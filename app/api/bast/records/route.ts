import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, initializeDatabase } from "@/lib/db/client";
import { BASTRecord } from "@/types";

// Force dynamic rendering to prevent build-time database access
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize database if tables don't exist yet
    try {
      await initializeDatabase();
    } catch (initError) {
      // If initialization fails, it might already be initialized - continue
      console.warn("Database initialization check:", initError);
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    let sql = "SELECT * FROM bast_records";
    const args: any[] = [];

    if (year) {
      sql += " WHERE strftime('%Y', bast_date) = ?";
      args.push(year);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    args.push(limit, offset);

    const result = await db.execute({
      sql,
      args,
    });

    const records: BASTRecord[] = result.rows.map((row) => ({
      id: row.id as number,
      bast_number: row.bast_number as string,
      project_name: row.project_name as string,
      bast_date: row.bast_date as string,
      budget: row.budget as string | undefined,
      company_name: row.company_name as string | undefined,
      registration_datetime: row.registration_datetime as string,
      user_id: row.user_id as string | undefined,
      created_at: row.created_at as string,
    }));

    // Get total count
    let countSql = "SELECT COUNT(*) as total FROM bast_records";
    const countArgs: any[] = [];

    if (year) {
      countSql += " WHERE strftime('%Y', bast_date) = ?";
      countArgs.push(year);
    }

    const countResult = await db.execute({
      sql: countSql,
      args: countArgs,
    });

    const total = countResult.rows[0].total as number;

    return NextResponse.json({
      records,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching BAST records:", error);
    
    // If table doesn't exist, return empty array (database not initialized yet)
    if (error.message?.includes("no such table") || error.message?.includes("does not exist")) {
      return NextResponse.json({
        records: [],
        total: 0,
        limit,
        offset,
      });
    }
    
    return NextResponse.json(
      { error: "Failed to fetch BAST records" },
      { status: 500 }
    );
  }
}


