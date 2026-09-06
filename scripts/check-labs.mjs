import { spawnSync } from "node:child_process";
import { mkdir, symlink, rm } from "node:fs/promises";
import assert from "node:assert/strict";
const run = (cmd, args) => {
  const result = spawnSync(cmd, args, { encoding: "utf8", timeout: 60000 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result.stdout;
};
await mkdir("node_modules/@typescript-course", { recursive: true });
await rm("node_modules/@typescript-course/job-summary", { force: true, recursive: true });
await symlink("../../labs/package", "node_modules/@typescript-course/job-summary", "dir");
for (const name of ["package", "stage1", "cli", "application", "browser", "classes", "migration"]) {
  await rm(`labs/${name}/dist`, { recursive: true, force: true });
  run("node_modules/.bin/tsc", ["-p", `labs/${name}/tsconfig.json`, "--pretty", "false"]);
}
run("node_modules/.bin/tsc", [
  "--ignoreConfig",
  "--noEmit",
  "--strict",
  "--target",
  "ES2022",
  "--module",
  "NodeNext",
  "labs/hero.ts",
]);
assert.equal(
  run(process.execPath, ["labs/stage1/dist/main.js", "labs/stage1/jobs.json"]),
  "Jobs: 2\nAttempts: 2\n",
);
assert.equal(
  run(process.execPath, ["labs/cli/dist/main.js", "labs/cli/jobs.json"]),
  '{"total":1,"attempts":2}\n',
);
assert.equal(run(process.execPath, [".work/classes/main.js"]), "Import\ntrue\nImport\n");
console.log(
  "Verified library, CLI, Node application, browser, class, and checked-JavaScript labs.",
);
