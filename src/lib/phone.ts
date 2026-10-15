/**
 * Phone number normalization and validation for Indian mobile numbers.
 * Conforms to docs/06-FORM-AND-BACKEND.md.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  e164: string;
  digits: string;
  formatted: string;
  error?: string;
}

export function normalizePhone(raw: string): PhoneValidationResult {
  if (!raw || typeof raw !== "string") {
    return {
      isValid: false,
      e164: "",
      digits: "",
      formatted: "",
      error: "Phone number is required",
    };
  }

  // 1. Remove all spaces, dashes, parentheses, dots
  let cleaned = raw.replace(/[\s\-\(\)\.]+/g, "");

  // 2. Remove leading "+"
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  }

  // 3. Remove leading "91" if total length is 12 digits
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    cleaned = cleaned.slice(2);
  }

  // 4. Remove leading "0" if total length is 11 digits
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  // 5. Must be exactly 10 digits starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  const isValid = indianMobileRegex.test(cleaned);

  if (!isValid) {
    return {
      isValid: false,
      e164: "",
      digits: cleaned,
      formatted: cleaned,
      error: "Enter a valid 10-digit Indian mobile number (e.g. 98765 43210)",
    };
  }

  const e164 = `+91${cleaned}`;
  const formatted = `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;

  return {
    isValid: true,
    e164,
    digits: cleaned,
    formatted,
  };
}
