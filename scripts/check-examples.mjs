import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
const run = (command, args) => spawnSync(command, args, { encoding: "utf8", timeout: 60000 });
const compiler = "node_modules/.bin/tsc";
const version = run(compiler, ["--version"]);
assert.equal(version.status, 0, version.stderr);
assert.match(version.stdout, /7\.0\.2/);
await rm(".work/examples", { recursive: true, force: true });
await mkdir(".work/examples", { recursive: true });
const build = run(compiler, ["-p", "examples/tsconfig.json", "--pretty", "false"]);
assert.equal(build.status, 0, build.stdout + build.stderr);
const report = {
  compiler: version.stdout.trim(),
  runtime: process.version,
  verifiedAt: new Date().toISOString(),
  examples: [],
};
for (const file of (await readdir("examples/valid")).filter((f) => f.endsWith(".ts")).sort()) {
  const id = file.slice(0, -3);
  const expected = JSON.parse(await readFile(`examples/expected/${id}.json`, "utf8"));
  const execution = run(process.execPath, [` .work/examples/${id}.js`.trim()]);
  assert.equal(execution.status, 0, execution.stdout + execution.stderr);
  assert.equal(execution.stdout, expected.stdout, `Runtime output ${id}`);
  const bad = run(compiler, [
    "--ignoreConfig",
    "--noEmit",
    "--pretty",
    "false",
    "--strict",
    "--noUncheckedIndexedAccess",
    "--exactOptionalPropertyTypes",
    "--verbatimModuleSyntax",
    "--target",
    "ES2022",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--types",
    "node",
    `examples/invalid/${id}.ts`,
  ]);
  assert.notEqual(bad.status, 0, `Expected failure ${id}`);
  const codes = [...bad.stdout.matchAll(/error TS(\d+):/g)].map((m) => Number(m[1]));
  assert.deepEqual(codes, [expected.diagnostic].flat(), `Diagnostic ${id}: ${bad.stdout}`);
  await writeFile(`examples/expected/${id}.txt`, bad.stdout);
  const source = await readFile(`examples/valid/${id}.ts`, "utf8");
  report.examples.push({
    id,
    diagnostic: expected.diagnostic,
    sourceHash: createHash("sha256").update(source).digest("hex"),
    stdout: execution.stdout,
  });
}
await writeFile("research/verification.json", JSON.stringify(report, null, 2) + "\n");
console.log(
  `Verified ${report.examples.length} executable examples and ${report.examples.length} exact diagnostics with ${report.compiler}.`,
);
