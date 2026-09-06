import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
// Isolated experiments intentionally demonstrate unsafe assumptions. Never import them into the application.
test("JavaScript boundary experiments execute the failures described by the course", () => {
  const value = JSON.parse('{"id":42}');
  assert.throws(() => value.id.toUpperCase(), TypeError);
  const data = { id: "job_a", internal: true };
  const view = data;
  assert.equal(JSON.stringify(view).includes("internal"), true);
  const projected = { id: data.id };
  assert.equal(JSON.stringify(projected).includes("internal"), false);
  const nested = { meta: { attempts: 0 } },
    copy = { ...nested };
  copy.meta.attempts++;
  assert.equal(nested.meta.attempts, 1);
  const retries = 0;
  assert.equal(retries || 3, 3);
  assert.equal(retries ?? 3, 0);
  assert.equal(Number.isFinite(Number("oops")), false);
  assert.equal(typeof null, "object");
  assert.equal([][0], undefined);
  assert.throws(() => {
    const absent = undefined;
    return absent.toUpperCase();
  }, TypeError);
  const a = { id: "a" },
    b = { id: "a" };
  assert.notEqual(a, b);
});
test("accepted assertion, ambient, variance, and environment programs fail at runtime", async () => {
  await mkdir(".work/unsafe", { recursive: true });
  const cases = {
    assertion:
      "const raw: unknown = JSON.parse('{\"id\":42}'); const user = raw as {id:string}; user.id.toUpperCase();",
    ambient: "declare function missingRuntime(): void; missingRuntime();",
    dom: 'document.querySelector("button");',
    covariance:
      'const labels: string[] = ["ok"]; const wider: (string | number)[] = labels; wider.push(42); labels[1]?.toUpperCase();',
    method:
      'type Basic = {id:string}; type Rich = Basic & {label:string}; const specific: {handle(value:Rich):void} = {handle(value){value.label.toUpperCase();}}; const broad: {handle(value:Basic):void} = specific; broad.handle({id:"a"});',
    any: "// Intentional negative experiment: any removes checks; unknown would force the missing guard.\nconst unchecked: any = 42; unchecked.toUpperCase();",
  };
  for (const [name, source] of Object.entries(cases)) {
    await writeFile(`.work/unsafe/${name}.ts`, source + "\nexport {};\n");
    const checked = spawnSync(
      "node_modules/.bin/tsc",
      [
        "--ignoreConfig",
        "--strict",
        "--target",
        "ES2022",
        "--module",
        "NodeNext",
        "--noUncheckedIndexedAccess",
        "--types",
        "node",
        ` .work/unsafe/${name}.ts`.trim(),
      ],
      { encoding: "utf8", timeout: 60000 },
    );
    assert.equal(checked.status, 0, checked.stdout);
    const runtime = spawnSync(process.execPath, [`.work/unsafe/${name}.js`], {
      encoding: "utf8",
      timeout: 10000,
    });
    assert.notEqual(runtime.status, 0);
    assert.match(runtime.stderr, /(TypeError|ReferenceError)/);
  }
});
test("Promise.all rejection does not cancel sibling work", async () => {
  let effect = false;
  const sibling = new Promise((resolve) =>
    setTimeout(() => {
      effect = true;
      resolve();
    }, 5),
  );
  await assert.rejects(Promise.all([Promise.reject(new Error("fail")), sibling]));
  await sibling;
  assert.equal(effect, true);
});
test("a promise which ignores a signal continues", async () => {
  const controller = new AbortController();
  let completed = false;
  const work = new Promise((resolve) =>
    setTimeout(() => {
      completed = true;
      resolve();
    }, 5),
  );
  controller.abort();
  await work;
  assert.equal(completed, true);
});
test("closures and lexical receiver ownership follow JavaScript", () => {
  function make() {
    let count = 0;
    return () => ++count;
  }
  const a = make(),
    b = make();
  assert.equal(a(), 1);
  assert.equal(a(), 2);
  assert.equal(b(), 1);
  let prefix = "a";
  const label = () => prefix;
  prefix = "b";
  assert.equal(label(), "b");
});
test("compiler emission erases annotations and preserves runtime implementation", async () => {
  const js = await readFile(".work/examples/35.js", "utf8"),
    declaration = await readFile(".work/examples/35.d.ts", "utf8");
  assert.ok(!js.includes("id: string"));
  assert.match(declaration, /id: string/);
  assert.match(js, /return/);
  assert.ok(!declaration.includes("return `"));
});
