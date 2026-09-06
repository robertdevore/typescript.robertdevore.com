import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { readCollection, origin } from "../scripts/content.mjs";
async function walk(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory() ? walk(`${path}/${entry.name}`) : `${path}/${entry.name}`,
      ),
    )
  ).flat();
}
test("complete curriculum has substantial unique lessons and build milestones", async () => {
  const lessons = await readCollection("lessons"),
    builds = await readCollection("builds");
  assert.equal(lessons.length, 36);
  assert.equal(builds.length, 5);
  assert.equal(new Set(lessons.map((l) => l.slug)).size, 36);
  assert.deepEqual(
    lessons.map((l) => l.number),
    Array.from({ length: 36 }, (_, i) => i + 1),
  );
  for (const l of lessons) {
    assert.ok(l.body.split(/\s+/).length >= 430, `${l.slug} needs substance`);
    for (const section of [
      "## Where you are",
      "## Working example",
      "## Type-checker drill",
      "## Runtime drill",
      "## Checkpoint",
      "## Sources",
    ])
      assert.ok(l.body.includes(section), `${l.slug}: ${section}`);
  }
  for (const b of builds) {
    assert.ok(b.body.split(/\s+/).length >= 600, b.slug);
    assert.match(b.body, /Milestone/);
    assert.match(b.body, /Completion checkpoint/);
  }
});
test("every generated internal link, fragment, and asset resolves", async () => {
  const pages = (await walk("dist")).filter((f) => f.endsWith(".html"));
  const cache = new Map();
  for (const path of pages) {
    cache.set(resolve(path), await readFile(path, "utf8"));
  }
  for (const [path, html] of cache) {
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (/^(https?:|data:|mailto:)/.test(href)) continue;
      const [raw, fragment] = href.split("#");
      const clean = raw.split("?")[0];
      let target = clean
        ? clean.startsWith("/")
          ? resolve("dist", `.${clean}`)
          : resolve(dirname(path), clean)
        : path;
      const info = await stat(target).catch(() => null);
      assert.ok(info, `${path}: missing ${href}`);
      if (info.isDirectory()) target = resolve(target, "index.html");
      assert.ok(await stat(target).catch(() => null), target);
      if (fragment) {
        const content = cache.get(target) || (await readFile(target, "utf8"));
        assert.ok(content.includes(`id="${fragment}"`), `${path}: missing #${fragment}`);
      }
    }
  }
});
test("production canonical and discovery metadata are consistent", async () => {
  for (const file of (await walk("dist")).filter(
    (f) => f.endsWith(".html") && !f.includes("/labs/"),
  )) {
    const html = await readFile(file, "utf8");
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<link rel="canonical" href="https:\/\/typescript\.robertdevore\.com\//);
    assert.ok(!/python\.robertdevore\.com|workers\.dev|pages\.dev/.test(html), file);
    const head = html.slice(0, html.indexOf("</head>"));
    assert.ok(!/localhost|127\.0\.0\.1/.test(head));
    assert.ok(!html.includes("{{example}}"));
    assert.ok(!html.includes("{{diagnostic}}"));
    assert.match(head, /og:image.*typescript\.robertdevore\.com\/assets\/social\.png/);
  }
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  assert.equal((sitemap.match(/<loc>/g) || []).length, 47);
  assert.ok(!sitemap.includes("/search/"));
  assert.match(
    await readFile("dist/robots.txt", "utf8"),
    /Allow: \/\nSitemap: https:\/\/typescript/,
  );
  assert.ok(sitemap.includes(origin + "/builds/capstone/"));
});
test("site JavaScript stays small and fonts are locally owned", async () => {
  assert.ok((await stat("dist/assets/site.js")).size < 10000);
  const css = await readFile("dist/assets/site.css", "utf8");
  assert.match(css, /Departure Mono/);
  assert.match(css, /Inter/);
  assert.ok((await stat("dist/assets/fonts/DepartureMono-Regular.woff2")).size > 1000);
  const search = JSON.parse(await readFile("dist/search-index.json", "utf8"));
  assert.equal(search.length, 41);
  for (const query of [
    "unknown",
    "satisfies",
    "never",
    "infer",
    "NodeNext",
    "moduleResolution",
    "package exports",
    "declaration",
  ]) {
    assert.ok(
      search.some((x) => `${x.title} ${x.text}`.toLowerCase().includes(query.toLowerCase())),
      query,
    );
  }
});
