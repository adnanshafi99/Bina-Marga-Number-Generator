/**
 * Converts a month number (1-12) to Roman numeral (I-XII)
 */
export function toRomanMonth(month: number): string {
  const romanMonths: Record<number, string> = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
  };

  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Month must be between 1 and 12.`);
  }

  return romanMonths[month];
}

/**
 * Formats a sequence number with proper leading zeros
 * 01-09: leading zero required
 * 10+: no leading zero
 */
export function formatSequence(sequence: number): string {
  if (sequence < 1) {
    throw new Error("Sequence must be at least 1");
  }

  if (sequence >= 1 && sequence <= 9) {
    return `0${sequence}`;
  }

  return sequence.toString();
}



