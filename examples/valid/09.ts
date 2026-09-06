function label(value: unknown): string {
  return typeof value === "string" ? value.toUpperCase() : "invalid";
}
const entries: string[] = [];
const record: (value: string) => void = (value) => entries.push(value);
function fail(message: string): never {
  throw new Error(message);
}
record(label("ready"));
console.log(entries.join(","));
try {
  fail("stop");
} catch (error: unknown) {
  console.log(error instanceof Error ? error.message : "unknown error");
}
export {};
