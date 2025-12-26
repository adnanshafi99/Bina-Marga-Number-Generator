import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/client";

// Force dynamic rendering to prevent build-time database access
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: "Database initialized" });
  } catch (error: any) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



