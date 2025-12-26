import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db/client";

// Force dynamic rendering to prevent build-time database access
export const dynamic = 'force-dynamic';

// Migration endpoint to add budget and company_name columns
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Add budget and company_name columns to bast_records if they don't exist
    try {
      await db.execute({
        sql: "ALTER TABLE bast_records ADD COLUMN budget TEXT",
      });
    } catch (error: any) {
      // Column might already exist, ignore error
      if (!error.message?.includes("duplicate column")) {
        console.warn("Error adding budget to bast_records:", error);
      }
    }

    try {
      await db.execute({
        sql: "ALTER TABLE bast_records ADD COLUMN company_name TEXT",
      });
    } catch (error: any) {
      if (!error.message?.includes("duplicate column")) {
        console.warn("Error adding company_name to bast_records:", error);
      }
    }

    // Add budget and company_name columns to contract_records if they don't exist
    try {
      await db.execute({
        sql: "ALTER TABLE contract_records ADD COLUMN budget TEXT",
      });
    } catch (error: any) {
      if (!error.message?.includes("duplicate column")) {
        console.warn("Error adding budget to contract_records:", error);
      }
    }

    try {
      await db.execute({
        sql: "ALTER TABLE contract_records ADD COLUMN company_name TEXT",
      });
    } catch (error: any) {
      if (!error.message?.includes("duplicate column")) {
        console.warn("Error adding company_name to contract_records:", error);
      }
    }

    return NextResponse.json({ success: true, message: "Migration completed" });
  } catch (error: any) {
    console.error("Error running migration:", error);
    return NextResponse.json(
      { error: "Failed to run migration" },
      { status: 500 }
    );
  }
}


