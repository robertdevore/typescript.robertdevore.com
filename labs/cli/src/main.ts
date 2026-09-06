import { readFile } from "node:fs/promises";
import { parseJobs, summarize } from "@typescript-course/job-summary";
try {
  const path = process.argv[2];
  if (!path || process.argv.length !== 3) throw new Error("Usage: node dist/main.js <jobs.json>");
  const raw: unknown = JSON.parse(await readFile(path, "utf8"));
  const parsed = parseJobs(raw);
  if (!parsed.ok) throw new Error(parsed.error.message);
  console.log(JSON.stringify(summarize(parsed.value)));
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : "Failed");
  process.exitCode = 1;
}
