import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
const directory = await mkdtemp(join(tmpdir(), "ts-course-"));
try {
  const file = join(directory, "job.json");
  await writeFile(file, JSON.stringify({ id: "j1" }));
  const value: unknown = JSON.parse(await readFile(file, "utf8"));
  if (typeof value === "object" && value !== null && "id" in value && typeof value.id === "string")
    console.log(value.id);
} finally {
  await rm(directory, { recursive: true, force: true });
}
export {};
