import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateContractNumber } from "@/lib/contract/generator";
import { db, initializeDatabase, migrateDatabase } from "@/lib/db/client";
import { ContractGenerateRequest } from "@/types";

// Initialize database on first use (idempotent)
let dbInitialized = false;
async function ensureDatabaseInitialized() {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (error) {
      // If initialization fails, it might already be initialized
      // Continue anyway
      console.warn("Database initialization check:", error);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();
    
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

    const body: ContractGenerateRequest = await request.json();

    // Validate input
    if (
      !body.project_name ||
      !body.contract_date ||
      !body.location ||
      !body.work_type ||
      !body.procurement_type
    ) {
      return NextResponse.json(
        {
          error:
            "Project name, contract date, location, work type, and procurement type are required",
        },
        { status: 400 }
      );
    }

    // Validate location
    if (body.location !== "621" && body.location !== "622") {
      return NextResponse.json(
        { error: "Location must be 621 or 622" },
        { status: 400 }
      );
    }

    // Validate work type
    if (body.work_type !== "BM" && body.work_type !== "BM-KONS") {
      return NextResponse.json(
        { error: "Work type must be BM or BM-KONS" },
        { status: 400 }
      );
    }

    // Validate procurement type
    if (body.procurement_type !== "SP" && body.procurement_type !== "SPK") {
      return NextResponse.json(
        { error: "Procurement type must be SP or SPK" },
        { status: 400 }
      );
    }

    // Parse and validate date (YYYY-MM-DD format)
    // Parse date string directly to avoid timezone issues
    const dateMatch = body.contract_date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      return NextResponse.json(
        { error: "Invalid contract date format. Expected YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const year = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const day = parseInt(dateMatch[3], 10);

    // Validate date values
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return NextResponse.json(
        { error: "Invalid date values" },
        { status: 400 }
      );
    }

    // Create date object in local timezone to avoid UTC conversion issues
    const contractDate = new Date(year, month - 1, day);

    // Generate contract number
    const contractNumber = await generateContractNumber(
      contractDate,
      body.location,
      body.work_type,
      body.procurement_type
    );

    // Store the record
    const registrationDatetime = new Date().toISOString();
    const userId = (session.user as any)?.id || session.user?.email || null;

    await db.execute({
      sql: `INSERT INTO contract_records 
            (contract_number, project_name, contract_date, location_code, work_type, procurement_type, budget, company_name, registration_datetime, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        contractNumber,
        body.project_name,
        body.contract_date,
        body.location,
        body.work_type,
        body.procurement_type,
        body.budget || null,
        body.company_name || null,
        registrationDatetime,
        userId,
      ],
    });

    return NextResponse.json({
      success: true,
      contract_number: contractNumber,
      project_name: body.project_name,
      contract_date: body.contract_date,
      location_code: body.location,
      work_type: body.work_type,
      procurement_type: body.procurement_type,
      registration_datetime: registrationDatetime,
    });
  } catch (error: any) {
    console.error("Error generating contract number:", error);

    // Check for unique constraint violation
    if (error.message?.includes("UNIQUE constraint")) {
      return NextResponse.json(
        { error: "Contract number already exists. Please try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate contract number" },
      { status: 500 }
    );
  }
}

