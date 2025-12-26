export interface BASTRecord {
  id: number;
  bast_number: string;
  project_name: string;
  bast_date: string;
  budget?: string;
  company_name?: string;
  registration_datetime: string;
  user_id?: string;
  created_at: string;
}

export interface ContractRecord {
  id: number;
  contract_number: string;
  project_name: string;
  contract_date: string;
  location_code: string;
  work_type: string;
  procurement_type: string;
  budget?: string;
  company_name?: string;
  registration_datetime: string;
  user_id?: string;
  created_at: string;
}

export interface BASTGenerateRequest {
  project_name: string;
  bast_date: string;
  budget?: string;
  company_name?: string;
}

export interface ContractGenerateRequest {
  project_name: string;
  contract_date: string;
  location: "621" | "622";
  work_type: "BM" | "BM-KONS";
  procurement_type: "SP" | "SPK";
  budget?: string;
  company_name?: string;
}

export interface BASTCounter {
  year: number;
  counter: number;
}

export interface ContractCounter {
  id: number;
  location_code: string;
  work_type: string;
  procurement_type: string;
  year: number;
  counter: number;
}


