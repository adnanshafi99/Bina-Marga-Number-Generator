import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateBASTNumber } from "@/lib/bast/generator";
import { db, migrateDatabase } from "@/lib/db/client";

// Force dynamic rendering to prevent build-time database access
export const dynamic = 'force-dynamic';

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
    const { id, project_name, bast_date, budget, company_name } = body;

    if (!id || !project_name || !bast_date) {
      return NextResponse.json(
        { error: "ID, project name, and BAST date are required" },
        { status: 400 }
      );
    }

    // Parse and validate date (YYYY-MM-DD format)
    const dateMatch = bast_date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      return NextResponse.json(
        { error: "Invalid BAST date format. Expected YYYY-MM-DD" },
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
      sql: "SELECT bast_number FROM bast_records WHERE id = ?",
      args: [id],
    });

    if (existingRecord.rows.length === 0) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    // Extract the sequence number from the existing BAST number
    // Format: {SEQUENCE}/BAST-BM/{ROMAN_MONTH}/{YEAR}
    const oldBastNumber = existingRecord.rows[0].bast_number as string;
    const sequenceMatch = oldBastNumber.match(/^(\d+)\/BAST-BM\//);
    
    if (!sequenceMatch) {
      return NextResponse.json(
        { error: "Could not extract sequence from existing BAST number" },
        { status: 400 }
      );
    }

    const preservedSequence = parseInt(sequenceMatch[1], 10);

    // Create date object in local timezone
    const bastDate = new Date(year, month - 1, day);
    const newYear = bastDate.getFullYear();
    const newMonth = bastDate.getMonth() + 1;

    // Import utilities
    const { toRomanMonth, formatSequence } = await import("@/utils/roman-month");

    // Format the preserved sequence
    const formattedSequence = formatSequence(preservedSequence);

    // Convert month to Roman numeral
    const romanMonth = toRomanMonth(newMonth);

    // Generate the new BAST number with the preserved sequence
    const newBastNumber = `${formattedSequence}/BAST-BM/${romanMonth}/${newYear}`;

    // Update the record
    await db.execute({
      sql: `UPDATE bast_records 
            SET bast_number = ?, project_name = ?, bast_date = ?, budget = ?, company_name = ? 
            WHERE id = ?`,
      args: [newBastNumber, project_name, bast_date, budget || null, company_name || null, id],
    });

    return NextResponse.json({
      success: true,
      bast_number: newBastNumber,
      project_name,
      bast_date,
    });
  } catch (error: any) {
    console.error("Error updating BAST record:", error);
    
    if (error.message?.includes("UNIQUE constraint")) {
      return NextResponse.json(
        { error: "BAST number already exists. Please try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update BAST record" },
      { status: 500 }
    );
  }
}

