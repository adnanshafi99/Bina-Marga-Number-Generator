import { incrementBASTCounter } from "./counter";
import { toRomanMonth, formatSequence } from "@/utils/roman-month";

/**
 * Generates a BAST number in the format:
 * {SEQUENCE}/BAST-BM/{ROMAN_MONTH}/{YEAR}
 */
export async function generateBASTNumber(bastDate: Date): Promise<string> {
  const year = bastDate.getFullYear();
  const month = bastDate.getMonth() + 1; // getMonth() returns 0-11

  // Get and increment the counter for this year
  const sequence = await incrementBASTCounter(year);

  // Format the sequence (01-09 with leading zero, 10+ without)
  const formattedSequence = formatSequence(sequence);

  // Convert month to Roman numeral
  const romanMonth = toRomanMonth(month);

  // Generate the BAST number
  const bastNumber = `${formattedSequence}/BAST-BM/${romanMonth}/${year}`;

  return bastNumber;
}



