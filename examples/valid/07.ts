type Result = { ok: true; count: number } | { ok: false; code: "invalid_count" };
function parse(value: number): Result {
  return Number.isInteger(value) && value >= 0
    ? { ok: true, count: value }
    : { ok: false, code: "invalid_count" };
}
function retries(value?: number) {
  return value ?? 3;
}
console.log(retries(0));
const result = parse(-1);
console.log(result.ok ? result.count : result.code);
export {};
