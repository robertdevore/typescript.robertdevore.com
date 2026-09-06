type Job = { id: string; attempts: number };
function parseJob(value: unknown): Job {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new Error("Expected object");
  if (!("id" in value) || typeof value.id !== "string" || value.id.trim() === "")
    throw new Error("Invalid id");
  if (
    !("attempts" in value) ||
    typeof value.attempts !== "number" ||
    !Number.isInteger(value.attempts) ||
    value.attempts < 0
  )
    throw new Error("Invalid attempts");
  return { id: value.id, attempts: value.attempts };
}
const raw: unknown = JSON.parse('{"id":"j1","attempts":2,"extra":true}');
console.log(JSON.stringify(parseJob(raw)));
try {
  parseJob({ id: 42 });
} catch (error) {
  console.log(error instanceof Error ? error.message : "error");
}
export {};
