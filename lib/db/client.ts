import { createClient, Client } from "@libsql/client";

let dbInstance: Client | null = null;

// Check if we're in build mode
function isBuildTime(): boolean {
  if (typeof process === "undefined") return false;
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.argv.includes("build") ||
    process.env.npm_lifecycle_event === "build" ||
    process.env.VERCEL === "1" // Vercel build environment
  );
}

function getDb(): Client {
  // During build, don't initialize - return a mock that will fail gracefully
  if (isBuildTime()) {
    // Return a mock client that throws helpful errors if actually used
    return {
      execute: () => {
        throw new Error("Database client cannot be accessed during build time. This should only be called at runtime.");
      },
      transaction: () => {
        throw new Error("Database client cannot be accessed during build time. This should only be called at runtime.");
      },
      close: () => {},
    } as unknown as Client;
  }

  if (!dbInstance) {
    if (!process.env.TURSO_DATABASE_URL) {
      throw new Error("TURSO_DATABASE_URL environment variable is not set");
    }

    if (!process.env.TURSO_AUTH_TOKEN) {
      throw new Error("TURSO_AUTH_TOKEN environment variable is not set");
    }

    try {
      dbInstance = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
    } catch (error) {
      console.error("Failed to create database client:", error);
      throw error;
    }
  }
  return dbInstance;
}

// Lazy database client export - only initialized when actually accessed at runtime
// This prevents build-time database access which causes build failures
export const db = new Proxy({} as Client, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof Client];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Read schema from the schema.sql file
    const schema = `
-- BAST Counters Table
-- One global counter per year
CREATE TABLE IF NOT EXISTS bast_counters (
  year INTEGER PRIMARY KEY,
  counter INTEGER NOT NULL DEFAULT 0
);

-- Contract Counters Table
-- Counter per category (location_code + work_type + procurement_type) per year
CREATE TABLE IF NOT EXISTS contract_counters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location_code TEXT NOT NULL,
  work_type TEXT NOT NULL,
  procurement_type TEXT NOT NULL,
  year INTEGER NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  UNIQUE(location_code, work_type, procurement_type, year)
);

-- BAST Records Table
CREATE TABLE IF NOT EXISTS bast_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bast_number TEXT NOT NULL UNIQUE,
  project_name TEXT NOT NULL,
  bast_date DATE NOT NULL,
  budget TEXT,
  company_name TEXT,
  registration_datetime DATETIME NOT NULL,
  user_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contract Records Table
CREATE TABLE IF NOT EXISTS contract_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_number TEXT NOT NULL UNIQUE,
  project_name TEXT NOT NULL,
  contract_date DATE NOT NULL,
  location_code TEXT NOT NULL,
  work_type TEXT NOT NULL,
  procurement_type TEXT NOT NULL,
  budget TEXT,
  company_name TEXT,
  registration_datetime DATETIME NOT NULL,
  user_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bast_records_year ON bast_records(bast_date);
CREATE INDEX IF NOT EXISTS idx_bast_records_created ON bast_records(created_at);
CREATE INDEX IF NOT EXISTS idx_contract_records_year ON contract_records(contract_date);
CREATE INDEX IF NOT EXISTS idx_contract_records_category ON contract_records(location_code, work_type, procurement_type);
CREATE INDEX IF NOT EXISTS idx_contract_records_created ON contract_records(created_at);
`;
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      if (statement) {
        await db.execute({
          sql: statement,
        });
      }
    }

    console.log("Database schema initialized successfully");
    
    // Run migration to add budget and company_name columns if they don't exist
    await migrateDatabase();
  } catch (error) {
    console.error("Error initializing database schema:", error);
    throw error;
  }
}

// Migration function to add budget and company_name columns
export async function migrateDatabase() {
  try {
    const db = getDb();
    
    // Add budget and company_name columns to bast_records if they don't exist
    try {
      await db.execute({
        sql: "ALTER TABLE bast_records ADD COLUMN budget TEXT",
      });
      console.log("Added budget column to bast_records");
    } catch (error: any) {
      // Column might already exist, ignore error
      if (!error.message?.includes("duplicate column") && !error.message?.includes("no column named budget")) {
        console.warn("Error adding budget to bast_records:", error);
      }
    }

    try {
      await db.execute({
        sql: "ALTER TABLE bast_records ADD COLUMN company_name TEXT",
      });
      console.log("Added company_name column to bast_records");
    } catch (error: any) {
      if (!error.message?.includes("duplicate column") && !error.message?.includes("no column named company_name")) {
        console.warn("Error adding company_name to bast_records:", error);
      }
    }

    // Add budget and company_name columns to contract_records if they don't exist
    try {
      await db.execute({
        sql: "ALTER TABLE contract_records ADD COLUMN budget TEXT",
      });
      console.log("Added budget column to contract_records");
    } catch (error: any) {
      if (!error.message?.includes("duplicate column") && !error.message?.includes("no column named budget")) {
        console.warn("Error adding budget to contract_records:", error);
      }
    }

    try {
      await db.execute({
        sql: "ALTER TABLE contract_records ADD COLUMN company_name TEXT",
      });
      console.log("Added company_name column to contract_records");
    } catch (error: any) {
      if (!error.message?.includes("duplicate column") && !error.message?.includes("no column named company_name")) {
        console.warn("Error adding company_name to contract_records:", error);
      }
    }
  } catch (error) {
    // Migration errors are non-fatal, just log them
    console.warn("Migration completed with warnings:", error);
  }
}

