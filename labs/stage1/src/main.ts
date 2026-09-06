import { readFile, stat } from "node:fs/promises";
type Job = { id: string; attempts: number };
type Parsed = { ok: true; jobs: Job[] } | { ok: false; message: string };
function parse(value: unknown): Parsed {
  if (!Array.isArray(value)) return { ok: false, message: "Expected a JSON array" };
  const jobs: Job[] = [];
  for (const item of value) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("id" in item) ||
      typeof item.id !== "string" ||
      item.id.trim() === "" ||
      !("attempts" in item) ||
      typeof item.attempts !== "number" ||
      !Number.isSafeInteger(item.attempts) ||
      item.attempts < 0
    )
      return {
        ok: false,
        message: "Every job needs a nonempty id and nonnegative safe integer attempts",
      };
    jobs.push({ id: item.id, attempts: item.attempts });
  }
  return { ok: true, jobs };
}
try {
  const file = process.argv[2];
  if (!file || process.argv.length !== 3) throw new Error("Usage: node dist/main.js <jobs.json>");
  // A convenience limit for a local trusted file, not a race-free adversarial stream limit.
  if ((await stat(file)).size > 1024 * 1024) throw new Error("Input exceeds 1 MiB");
  const input: unknown = JSON.parse(await readFile(file, "utf8"));
  const result = parse(input);
  if (!result.ok) throw new Error(result.message);
  const attempts = result.jobs.reduce((total, job) => total + job.attempts, 0);
  if (!Number.isSafeInteger(attempts)) throw new Error("Attempt total is too large");
  console.log(`Jobs: ${result.jobs.length}\nAttempts: ${attempts}`);
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : "Unexpected failure");
  process.exitCode = 1;
}
