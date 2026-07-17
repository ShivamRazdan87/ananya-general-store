export type AddressValidation =
  | { valid: true; formatted: string }
  | { valid: false; error: string };

export const ADDRESS_FORMAT_ERROR =
  'Only "T-" (Tower) or "IND-" (Independent) is accepted. Example: T-206 or IND-025.';

/**
 * Validates and normalizes a society flat number.
 *
 * Tower (High-rise): T-<floor><unit>
 *   - floor: 1 to 11 (no ground floor)
 *   - unit: 01 to 08 (max 8 flats per floor)
 *   - e.g. T-206 = floor 2, unit 06 | T-1102 = floor 11, unit 02
 *
 * Independent (Low-rise): IND-<flatNumber>
 *   - resident enters their flat number as-is (1-3 digits)
 *   - auto zero-padded to 3 digits, e.g. IND-25 -> IND-025
 *
 * Prefix matching is case-insensitive (t-/T-, ind-/IND-) and the
 * stored/displayed value is always normalized to uppercase.
 */
export function validateSocietyAddress(raw: string): AddressValidation {
  const value = raw.trim();

  const towerMatch = value.match(/^t-(\d+)$/i);
  const indMatch = value.match(/^ind-(\d+)$/i);

  if (!towerMatch && !indMatch) {
    return { valid: false, error: ADDRESS_FORMAT_ERROR };
  }

  if (towerMatch) {
    const digits = towerMatch[1];
    if (digits.length !== 3 && digits.length !== 4) {
      return {
        valid: false,
        error:
          "Invalid Tower flat number. Format: T-<floor><unit>, e.g. T-206 (floor 2, unit 06) or T-1102 (floor 11, unit 02).",
      };
    }
    const unitStr = digits.slice(-2);
    const floorStr = digits.slice(0, -2);
    const floor = parseInt(floorStr, 10);
    const unit = parseInt(unitStr, 10);

    if (floor < 1 || floor > 11) {
      return { valid: false, error: "Tower floor must be between 1 and 11." };
    }
    if (unit < 1 || unit > 8) {
      return { valid: false, error: "Tower unit number must be between 01 and 08 (max 8 flats per floor)." };
    }
    return { valid: true, formatted: `T-${digits}` };
  }

  const digits = indMatch![1];
  if (digits.length > 3) {
    return {
      valid: false,
      error: "Invalid Independent flat number. It should be at most 3 digits, e.g. IND-25.",
    };
  }
  const padded = digits.padStart(3, "0");
  return { valid: true, formatted: `IND-${padded}` };
}
