import { db } from "@/lib/db/client";

/**
 * Gets the current counter for a given year
 * Creates a new counter entry if it doesn't exist
 */
export async function getBASTCounter(year: number): Promise<number> {
  try {
    const result = await db.execute({
      sql: "SELECT counter FROM bast_counters WHERE year = ?",
      args: [year],
    });

    if (result.rows.length === 0) {
      // Create new counter entry for this year
      await db.execute({
        sql: "INSERT INTO bast_counters (year, counter) VALUES (?, 0)",
        args: [year],
      });
      return 0;
    }

    return result.rows[0].counter as number;
  } catch (error) {
    console.error("Error getting BAST counter:", error);
    throw error;
  }
}

/**
 * Increments the BAST counter for a given year atomically
 * Returns the new counter value
 */
export async function incrementBASTCounter(year: number): Promise<number> {
  try {
    // First, ensure the counter exists
    await getBASTCounter(year);

    // Use a transaction to atomically increment
    // SQLite/Turso supports atomic updates
    await db.execute({
      sql: "UPDATE bast_counters SET counter = counter + 1 WHERE year = ?",
      args: [year],
    });

    // Get the updated counter value
    const result = await db.execute({
      sql: "SELECT counter FROM bast_counters WHERE year = ?",
      args: [year],
    });

    if (result.rows.length === 0) {
      throw new Error("Counter was not found after increment");
    }

    return result.rows[0].counter as number;
  } catch (error) {
    console.error("Error incrementing BAST counter:", error);
    throw error;
  }
}



