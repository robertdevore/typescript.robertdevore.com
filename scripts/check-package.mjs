import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, writeFile, rm, cp, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import assert from "node:assert/strict";
const root = process.cwd();
const run = (cmd, args, cwd = root) => {
  const result = spawnSync(cmd, args, { cwd, encoding: "utf8", timeout: 90000 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result.stdout;
};
run(process.execPath, ["scripts/check-labs.mjs"]);
const consumer = await mkdtemp(join(tmpdir(), "ts-course-consumer-"));
try {
  const packed = JSON.parse(
    run("npm", ["pack", "--json", "--pack-destination", consumer], resolve("labs/package")),
  )[0];
  const files = packed.files.map((file) => file.path);
  for (const required of ["dist/index.js", "dist/index.d.ts", "README.md", "LICENSE"])
    assert.ok(files.includes(required), required);
  assert.ok(!files.some((file) => /(?:\.env|node_modules|test-results)/.test(file)));
  await writeFile(
    join(consumer, "package.json"),
    JSON.stringify({ name: "consumer", private: true, type: "module" }),
  );
  run(
    "npm",
    ["install", "--ignore-scripts", "--no-audit", "--no-fund", join(consumer, packed.filename)],
    consumer,
  );
  await writeFile(
    join(consumer, "index.ts"),
    `import { parseJobs, summarize, groupBy } from "@typescript-course/job-summary";\nconst result = parseJobs([{id:"job_a",label:"Import",attempts:2}]);\nif (!result.ok) throw new Error(result.error.message);\nconst groups = groupBy(result.value, job => job.attempts);\nconst typed: Map<number, import("@typescript-course/job-summary").Job[]> = groups;\nconsole.log(JSON.stringify(summarize(result.value)), typed.size);\n`,
  );
  const flags = [
    "--ignoreConfig",
    "--strict",
    "--target",
    "ES2022",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--types",
    "node",
    "--typeRoots",
    resolve("node_modules/@types"),
  ];
  run(resolve("node_modules/.bin/tsc"), [...flags, "index.ts"], consumer);
  assert.equal(run(process.execPath, ["index.js"], consumer), '{"total":1,"attempts":2} 1\n');
  await writeFile(
    join(consumer, "invalid.ts"),
    'import { summarize } from "@typescript-course/job-summary";\nsummarize([{id:"job_a",label:"Import",attempts:"two"}]);\n',
  );
  const bad = spawnSync(
    resolve("node_modules/.bin/tsc"),
    [...flags, "--noEmit", "--pretty", "false", "invalid.ts"],
    { cwd: consumer, encoding: "utf8", timeout: 60000 },
  );
  assert.notEqual(bad.status, 0);
  assert.deepEqual(
    [...bad.stdout.matchAll(/error TS(\d+):/g)].map((m) => m[1]),
    ["2322"],
  );
  await mkdir(".work/package", { recursive: true });
  await cp(join(consumer, packed.filename), join(".work/package", packed.filename));
  await writeFile(
    "research/package-verification.json",
    JSON.stringify(
      {
        runtime: process.version,
        package: JSON.parse(await readFile("labs/package/package.json", "utf8")).name,
        files,
        negativeDiagnostic: 2322,
        result: "passed",
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Packed ESM consumer: runtime, declarations, inferred Map relationships, and rejected input passed.",
  );
} finally {
  await rm(consumer, { recursive: true, force: true });
}
