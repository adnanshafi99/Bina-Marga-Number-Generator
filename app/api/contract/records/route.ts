import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, initializeDatabase } from "@/lib/db/client";
import { ContractRecord } from "@/types";

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
    const locationCode = searchParams.get("location_code");
    const workType = searchParams.get("work_type");
    const procurementType = searchParams.get("procurement_type");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    let sql = "SELECT * FROM contract_records";
    const conditions: string[] = [];
    const args: any[] = [];

    if (year) {
      conditions.push("strftime('%Y', contract_date) = ?");
      args.push(year);
    }

    if (locationCode) {
      conditions.push("location_code = ?");
      args.push(locationCode);
    }

    if (workType) {
      conditions.push("work_type = ?");
      args.push(workType);
    }

    if (procurementType) {
      conditions.push("procurement_type = ?");
      args.push(procurementType);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    args.push(limit, offset);

    const result = await db.execute({
      sql,
      args,
    });

    const records: ContractRecord[] = result.rows.map((row) => ({
      id: row.id as number,
      contract_number: row.contract_number as string,
      project_name: row.project_name as string,
      contract_date: row.contract_date as string,
      location_code: row.location_code as string,
      work_type: row.work_type as string,
      procurement_type: row.procurement_type as string,
      budget: row.budget as string | undefined,
      company_name: row.company_name as string | undefined,
      registration_datetime: row.registration_datetime as string,
      user_id: row.user_id as string | undefined,
      created_at: row.created_at as string,
    }));

    // Get total count
    let countSql = "SELECT COUNT(*) as total FROM contract_records";
    const countArgs: any[] = [];

    if (conditions.length > 0) {
      countSql += " WHERE " + conditions.join(" AND ");
      countArgs.push(...args.slice(0, -2)); // Exclude limit and offset
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
    console.error("Error fetching contract records:", error);
    
    // If table doesn't exist, return empty array (database not initialized yet)
    if (error.message?.includes("no such table") || error.message?.includes("does not exist")) {
      const { searchParams } = new URL(request.url);
      return NextResponse.json({
        records: [],
        total: 0,
        limit: parseInt(searchParams.get("limit") || "100"),
        offset: parseInt(searchParams.get("offset") || "0"),
      });
    }
    
    return NextResponse.json(
      { error: "Failed to fetch contract records" },
      { status: 500 }
    );
  }
}


