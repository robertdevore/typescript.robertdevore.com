import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseJob, parseJobs, summarize, groupBy } from "../labs/package/dist/index.js";
import { readSummary, UpstreamError } from "../labs/application/dist/client.js";
import { parseConfig } from "../labs/application/dist/config.js";
import { createApplication } from "../labs/application/dist/server.js";
import { normalizeLimit } from "../labs/migration/src/index.js";
const valid = { id: "job_a", label: " Import ", attempts: 2 };
async function listen(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return `http://127.0.0.1:${server.address().port}`;
}
async function close(server) {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}

test("parser rejects malformed boundary values and normalizes owned immutable data", () => {
  for (const raw of [
    null,
    [],
    false,
    42,
    {},
    { ...valid, id: 42 },
    { ...valid, id: "bad" },
    { ...valid, label: " " },
    { ...valid, label: "x".repeat(121) },
    { ...valid, attempts: -1 },
    { ...valid, attempts: 0.5 },
    { ...valid, attempts: NaN },
    { ...valid, attempts: Infinity },
    { ...valid, attempts: Number.MAX_SAFE_INTEGER + 1 },
    { ...valid, extra: true },
  ])
    assert.equal(parseJob(raw).ok, false, JSON.stringify(raw));
  const result = parseJob(valid);
  assert.equal(result.ok, true);
  assert.equal(result.value.label, "Import");
  assert.ok(Object.isFrozen(result.value));
  assert.equal(parseJob({ ...valid, attempts: 0 }).ok, true);
  assert.equal(parseJobs([valid, valid]).ok, false);
  assert.equal(parseJobs(Array(10001).fill(valid)).ok, false);
  assert.equal(parseJobs({}).ok, false);
});
test("summary and grouping preserve observable contracts", () => {
  const result = parseJobs([valid, { ...valid, id: "job_b", attempts: 0 }]);
  assert.ok(result.ok);
  assert.deepEqual(summarize(result.value), { total: 2, attempts: 2 });
  assert.deepEqual(summarize([]), { total: 0, attempts: 0 });
  assert.throws(
    () => summarize([{ ...valid, attempts: Number.MAX_SAFE_INTEGER }, valid]),
    RangeError,
  );
  const grouped = groupBy(result.value, (job) => job.attempts);
  assert.equal(grouped.get(2)[0].id, "job_a");
  const same = groupBy([valid, { ...valid, id: "job_b" }], (job) => job.attempts);
  assert.equal(same.get(2).length, 2);
  assert.ok(Object.isFrozen(result.value));
});
test("configuration rejects empty, invalid, and credential-bearing values", () => {
  for (const port of ["", "0", "-1", "65536", "1.5", "x"])
    assert.throws(() => parseConfig({ PORT: port, UPSTREAM_URL: "https://example.invalid/jobs" }));
  assert.throws(() => parseConfig({}));
  assert.throws(() => parseConfig({ UPSTREAM_URL: "file:///tmp/jobs" }));
  assert.throws(() => parseConfig({ UPSTREAM_URL: "https://user:pass@example.invalid" }));
  assert.equal(
    parseConfig({ PORT: "3100", UPSTREAM_URL: "https://example.invalid/jobs" }).port,
    3100,
  );
});
test("client distinguishes status, malformed JSON, invalid schema, size, and transport", async () => {
  const url = new URL("https://example.invalid/jobs"),
    signal = new AbortController().signal;
  const response = (body) => async () => Response.json(body);
  assert.deepEqual(await readSummary(url, signal, response([valid])), { total: 1, attempts: 2 });
  for (const [fetcher, code] of [
    [async () => new Response("no", { status: 429 }), "status"],
    [async () => new Response("{"), "payload"],
    [response([{ id: 42 }]), "payload"],
    [async () => new Response("x".repeat(1024 * 1024 + 1)), "size"],
    [
      async () => {
        throw new Error("offline");
      },
      "transport",
    ],
  ])
    await assert.rejects(
      readSummary(url, signal, fetcher),
      (error) => error instanceof UpstreamError && error.code === code,
    );
});
test("actual HTTP service validates input and returns explicit status responses", async () => {
  let payload = [valid],
    status = 200;
  const upstream = createServer((_req, res) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(payload));
  });
  const upstreamUrl = await listen(upstream);
  const events = [];
  const app = createApplication(
    { port: 3100, upstream: new URL(upstreamUrl), timeoutMs: 500 },
    (event, context) => events.push({ event, ...context }),
  );
  try {
    const base = await listen(app.server);
    assert.equal((await fetch(`${base}/health`)).status, 200);
    assert.deepEqual(await (await fetch(`${base}/summary`)).json(), { total: 1, attempts: 2 });
    assert.equal((await fetch(`${base}/missing`)).status, 404);
    assert.equal((await fetch(`${base}/summary`, { method: "POST" })).status, 405);
    payload = [{ id: 42 }];
    assert.equal((await fetch(`${base}/summary`)).status, 502);
    status = 500;
    assert.equal((await fetch(`${base}/summary`)).status, 502);
    assert.ok(events.some((event) => event.event === "summary"));
    assert.ok(events.some((event) => event.event === "upstream_failure"));
  } finally {
    await app.stop();
    await close(upstream);
  }
});
test("admission limit and shutdown cancel active HTTP requests", async () => {
  let started = 0;
  const upstream = createServer((_req, _res) => {
    started++;
  });
  const upstreamUrl = await listen(upstream);
  const app = createApplication(
    { port: 3100, upstream: new URL(upstreamUrl), timeoutMs: 3000 },
    () => {},
  );
  try {
    const base = await listen(app.server);
    const requests = Array.from({ length: 10 }, () =>
      fetch(`${base}/summary`)
        .then((res) => res.status)
        .catch(() => 0),
    );
    const deadline = Date.now() + 2000;
    while (started < 8 && Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(started, 8);
    await app.stop();
    await app.stop();
    const results = await Promise.all(requests);
    assert.ok(results.includes(503));
    assert.ok(results.every((status) => [0, 503, 504].includes(status)));
  } finally {
    if (app.server.listening) await app.stop();
    await close(upstream);
  }
});
test("CLI validates process output, failure status, and JSON boundary", async () => {
  const temp = await mkdtemp(join(tmpdir(), "ts-course-test-"));
  try {
    const file = join(temp, "jobs.json");
    for (const [value, code] of [
      ["[]", 0],
      ["{", 1],
      [JSON.stringify([{ id: "job_a", attempts: "2" }]), 1],
    ]) {
      await writeFile(file, value);
      const run = spawnSync(process.execPath, ["labs/stage1/dist/main.js", file], {
        encoding: "utf8",
      });
      assert.equal(run.status, code);
      if (code) {
        assert.equal(run.stdout, "");
        assert.ok(run.stderr.length);
      } else assert.equal(run.stdout, "Jobs: 0\nAttempts: 0\n");
    }
    const usage = spawnSync(process.execPath, ["labs/stage1/dist/main.js"], { encoding: "utf8" });
    assert.equal(usage.status, 1);
    assert.match(usage.stderr, /Usage/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
test("entry point handles SIGTERM during active work and exits cleanly", async () => {
  let observed = false;
  const upstream = createServer((_req, _res) => {
    observed = true;
  });
  const url = await listen(upstream);
  const reserve = createServer();
  await listen(reserve);
  const port = reserve.address().port;
  await close(reserve);
  const child = spawn(process.execPath, ["labs/application/dist/main.js"], {
    env: { ...process.env, PORT: String(port), UPSTREAM_URL: url },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const exit = once(child, "exit");
  let stdout = "";
  child.stdout.on("data", (chunk) => (stdout += chunk));
  const deadline = Date.now() + 4000;
  try {
    while (!stdout.includes('"listening"') && Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, 10));
    assert.match(stdout, /listening/);
    const request = fetch(`http://127.0.0.1:${port}/summary`).catch(() => undefined);
    while (!observed && Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, 10));
    assert.ok(observed);
    child.kill("SIGTERM");
    const watchdog = setTimeout(() => child.kill("SIGKILL"), 4000);
    const [code, signal] = await exit;
    clearTimeout(watchdog);
    await request;
    assert.equal(code, 0);
    assert.equal(signal, null);
    assert.match(stdout, /stopped/);
  } finally {
    if (child.exitCode === null) child.kill("SIGKILL");
    await close(upstream);
  }
});
test("migration fixture preserves validation behavior", () => {
  assert.equal(normalizeLimit(2), 2);
  for (const value of [0, -1, 0.5, NaN, "2", undefined]) assert.throws(() => normalizeLimit(value));
});
