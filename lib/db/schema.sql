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



