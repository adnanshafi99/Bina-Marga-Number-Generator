import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateBASTNumber } from "@/lib/bast/generator";
import { db, initializeDatabase, migrateDatabase } from "@/lib/db/client";
import { BASTGenerateRequest } from "@/types";

// Force dynamic rendering to prevent build-time database access
export const dynamic = 'force-dynamic';

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

    const body: BASTGenerateRequest = await request.json();

    // Validate input
    if (!body.project_name || !body.bast_date) {
      return NextResponse.json(
        { error: "Project name and BAST date are required" },
        { status: 400 }
      );
    }

    // Parse and validate date (YYYY-MM-DD format)
    // Parse date string directly to avoid timezone issues
    const dateMatch = body.bast_date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      return NextResponse.json(
        { error: "Invalid BAST date format. Expected YYYY-MM-DD" },
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
    const bastDate = new Date(year, month - 1, day);

    // Generate BAST number
    const bastNumber = await generateBASTNumber(bastDate);

    // Store the record
    const registrationDatetime = new Date().toISOString();
    const userId = (session.user as any)?.id || session.user?.email || null;

    await db.execute({
      sql: `INSERT INTO bast_records 
            (bast_number, project_name, bast_date, budget, company_name, registration_datetime, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        bastNumber,
        body.project_name,
        body.bast_date,
        body.budget || null,
        body.company_name || null,
        registrationDatetime,
        userId,
      ],
    });

    return NextResponse.json({
      success: true,
      bast_number: bastNumber,
      project_name: body.project_name,
      bast_date: body.bast_date,
      registration_datetime: registrationDatetime,
    });
  } catch (error: any) {
    console.error("Error generating BAST number:", error);
    
    // Check for unique constraint violation
    if (error.message?.includes("UNIQUE constraint")) {
      return NextResponse.json(
        { error: "BAST number already exists. Please try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate BAST number" },
      { status: 500 }
    );
  }
}

