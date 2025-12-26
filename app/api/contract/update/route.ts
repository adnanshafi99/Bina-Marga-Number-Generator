import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateContractNumber } from "@/lib/contract/generator";
import { db, migrateDatabase } from "@/lib/db/client";

export async function PUT(request: NextRequest) {
  try {
    // Run migration to add missing columns (idempotent)
    try {
      await migrateDatabase();
    } catch (error) {
      // Migration errors are non-fatal
      console.warn("Migration warning:", error);
    }
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, project_name, contract_date, location, work_type, procurement_type, budget, company_name } = body;

    if (!id || !project_name || !contract_date || !location || !work_type || !procurement_type) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate location
    if (location !== "621" && location !== "622") {
      return NextResponse.json(
        { error: "Location must be 621 or 622" },
        { status: 400 }
      );
    }

    // Validate work type
    if (work_type !== "BM" && work_type !== "BM-KONS") {
      return NextResponse.json(
        { error: "Work type must be BM or BM-KONS" },
        { status: 400 }
      );
    }

    // Validate procurement type
    if (procurement_type !== "SP" && procurement_type !== "SPK") {
      return NextResponse.json(
        { error: "Procurement type must be SP or SPK" },
        { status: 400 }
      );
    }

    // Parse and validate date (YYYY-MM-DD format)
    const dateMatch = contract_date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      return NextResponse.json(
        { error: "Invalid contract date format. Expected YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const year = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const day = parseInt(dateMatch[3], 10);

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return NextResponse.json(
        { error: "Invalid date values" },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingRecord = await db.execute({
      sql: "SELECT contract_number FROM contract_records WHERE id = ?",
      args: [id],
    });

    if (existingRecord.rows.length === 0) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    // Extract the sequence number from the existing contract number
    // Format: {LOCATION}/DISPUPR/{WORK_TYPE}/{PROC_TYPE}/{SEQUENCE}/{ROMAN_MONTH}/{YEAR}
    const oldContractNumber = existingRecord.rows[0].contract_number as string;
    const sequenceMatch = oldContractNumber.match(/\/(\d+)\/[IVX]+/);
    
    if (!sequenceMatch) {
      return NextResponse.json(
        { error: "Could not extract sequence from existing contract number" },
        { status: 400 }
      );
    }

    const preservedSequence = parseInt(sequenceMatch[1], 10);

    // Create date object in local timezone
    const contractDate = new Date(year, month - 1, day);
    const newYear = contractDate.getFullYear();
    const newMonth = contractDate.getMonth() + 1;

    // Import utilities
    const { toRomanMonth, formatSequence } = await import("@/utils/roman-month");

    // Format the preserved sequence
    const formattedSequence = formatSequence(preservedSequence);

    // Convert month to Roman numeral
    const romanMonth = toRomanMonth(newMonth);

    // Generate the new contract number with the preserved sequence
    const newContractNumber = `${location}/DISPUPR/${work_type}/${procurement_type}/${formattedSequence}/${romanMonth}/${newYear}`;

    // Update the record
    await db.execute({
      sql: `UPDATE contract_records 
            SET contract_number = ?, project_name = ?, contract_date = ?, 
                location_code = ?, work_type = ?, procurement_type = ?, budget = ?, company_name = ? 
            WHERE id = ?`,
      args: [newContractNumber, project_name, contract_date, location, work_type, procurement_type, budget || null, company_name || null, id],
    });

    return NextResponse.json({
      success: true,
      contract_number: newContractNumber,
      project_name,
      contract_date,
      location_code: location,
      work_type,
      procurement_type,
    });
  } catch (error: any) {
    console.error("Error updating contract record:", error);
    
    if (error.message?.includes("UNIQUE constraint")) {
      return NextResponse.json(
        { error: "Contract number already exists. Please try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update contract record" },
      { status: 500 }
    );
  }
}

