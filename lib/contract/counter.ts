import { db } from "@/lib/db/client";

/**
 * Gets the current counter for a given contract category and year
 * Creates a new counter entry if it doesn't exist
 */
export async function getContractCounter(
  locationCode: string,
  workType: string,
  procurementType: string,
  year: number
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `SELECT counter FROM contract_counters 
            WHERE location_code = ? AND work_type = ? AND procurement_type = ? AND year = ?`,
      args: [locationCode, workType, procurementType, year],
    });

    if (result.rows.length === 0) {
      // Create new counter entry for this category/year
      await db.execute({
        sql: `INSERT INTO contract_counters (location_code, work_type, procurement_type, year, counter) 
              VALUES (?, ?, ?, ?, 0)`,
        args: [locationCode, workType, procurementType, year],
      });
      return 0;
    }

    return result.rows[0].counter as number;
  } catch (error) {
    console.error("Error getting contract counter:", error);
    throw error;
  }
}

/**
 * Increments the contract counter for a given category/year atomically
 * Returns the new counter value
 */
export async function incrementContractCounter(
  locationCode: string,
  workType: string,
  procurementType: string,
  year: number
): Promise<number> {
  try {
    // First, ensure the counter exists
    await getContractCounter(locationCode, workType, procurementType, year);

    // Use a transaction to atomically increment
    await db.execute({
      sql: `UPDATE contract_counters SET counter = counter + 1 
            WHERE location_code = ? AND work_type = ? AND procurement_type = ? AND year = ?`,
      args: [locationCode, workType, procurementType, year],
    });

    // Get the updated counter value
    const result = await db.execute({
      sql: `SELECT counter FROM contract_counters 
            WHERE location_code = ? AND work_type = ? AND procurement_type = ? AND year = ?`,
      args: [locationCode, workType, procurementType, year],
    });

    if (result.rows.length === 0) {
      throw new Error("Counter was not found after increment");
    }

    return result.rows[0].counter as number;
  } catch (error) {
    console.error("Error incrementing contract counter:", error);
    throw error;
  }
}



