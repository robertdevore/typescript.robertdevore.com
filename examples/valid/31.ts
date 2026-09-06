export function normalizeLimit(value: number): number {
  if (!Number.isInteger(value) || value < 1) throw new Error("Invalid limit");
  return value;
}
console.log(normalizeLimit(2));
export {};
