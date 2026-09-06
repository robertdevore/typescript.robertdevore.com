/**
 * Validate a positive concurrency limit without changing JavaScript execution.
 * @param {number} value
 * @returns {number}
 */
export function normalizeLimit(value) {
  if (!Number.isInteger(value) || value < 1) throw new Error("Invalid limit");
  return value;
}
