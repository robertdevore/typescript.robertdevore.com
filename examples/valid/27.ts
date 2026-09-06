export type ParsedLabel = { ok: true; value: string } | { ok: false; reason: string };
export function parseLabel(value: unknown): ParsedLabel {
  return typeof value === "string" && value.trim() !== ""
    ? { ok: true, value: value.trim() }
    : { ok: false, reason: "Expected nonempty label" };
}
console.log(JSON.stringify(parseLabel(" Import ")));
export {};
