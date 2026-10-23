/** Strips spaces and punctuation people paste along with an Estonian registry code. */
export function normalizeRegCode(input: string) {
  return input.replace(/[\s.\-]/g, "");
}

/**
 * Estonian registry codes (registrikood) are 8 digits; the last is a modulo-11 check digit,
 * computed the same way as for personal ID codes.
 */
export function isValidEeRegCode(code: string) {
  if (!/^\d{8}$/.test(code)) return false;
  const digits = [...code].map(Number);
  const check = (weights: number[]) => weights.reduce((sum, w, i) => sum + w * digits[i], 0) % 11;
  let c = check([1, 2, 3, 4, 5, 6, 7]);
  if (c === 10) c = check([3, 4, 5, 6, 7, 8, 9]);
  if (c === 10) c = 0;
  return c === digits[7];
}
