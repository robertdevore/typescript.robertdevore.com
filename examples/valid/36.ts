import assert from "node:assert/strict";
const release = { schemaVersion: 1, module: "esm" } as const;
assert.equal(release.schemaVersion, 1);
assert.equal(release.module, "esm");
console.log("release contract verified");
export {};
