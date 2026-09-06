type Parsed = { ok: true; value: number } | { ok: false; error: string };
function parseCount(input: string | number): Parsed {
  if (typeof input === "string" && input.trim() === "") return { ok: false, error: "empty" };
  const value = typeof input === "string" ? Number(input) : input;
  if (!Number.isFinite(value)) return { ok: false, error: "not finite" };
  return { ok: true, value };
}
for (const input of [0, "12", ""]) {
  const result = parseCount(input);
  console.log(result.ok ? result.value : result.error);
}
export {};
