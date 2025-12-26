import { incrementContractCounter } from "./counter";
import { toRomanMonth, formatSequence } from "@/utils/roman-month";

/**
 * Generates a contract number in the format:
 * {LOCATION_CODE}/DISPUPR/{BM or BM-KONS}/{SP or SPK}/{SEQUENCE}/{ROMAN_MONTH}/{YEAR}
 */
export async function generateContractNumber(
  contractDate: Date,
  locationCode: string,
  workType: "BM" | "BM-KONS",
  procurementType: "SP" | "SPK"
): Promise<string> {
  const year = contractDate.getFullYear();
  const month = contractDate.getMonth() + 1; // getMonth() returns 0-11

  // Get and increment the counter for this category/year
  const sequence = await incrementContractCounter(
    locationCode,
    workType,
    procurementType,
    year
  );

  // Format the sequence (01-09 with leading zero, 10+ without)
  const formattedSequence = formatSequence(sequence);

  // Convert month to Roman numeral
  const romanMonth = toRomanMonth(month);

  // Generate the contract number
  const contractNumber = `${locationCode}/DISPUPR/${workType}/${procurementType}/${formattedSequence}/${romanMonth}/${year}`;

  return contractNumber;
}


