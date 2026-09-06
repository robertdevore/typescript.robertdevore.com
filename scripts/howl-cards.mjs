import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { chromium } from "@playwright/test";
import { readCollection, origin } from "./content.mjs";
const items = [...(await readCollection("lessons")), ...(await readCollection("builds"))];
const manifest = {
  project: { name: "TypeScript Course", url: origin },
  theme: { name: "minimal", mode: "light" },
  cards: items.map((item) => ({
    id: item.slug,
    title: item.title,
    file: item.number
      ? `examples/valid/${String(item.number).padStart(2, "0")}.ts`
      : `content/builds/${item.file}`,
    language: item.number ? "typescript" : "markdown",
    variant: "social",
    label: item.number ? `Lesson ${String(item.number).padStart(2, "0")}` : "Stage build",
    tagline: item.description,
    url: origin + item.url,
    font_file: "assets/fonts/DepartureMono-Regular.woff2",
    alt: item.title + " — TypeScript Course",
    caption: item.description + " " + origin + item.url,
  })),
};
await writeFile("howl.json", JSON.stringify(manifest, null, 2) + "\n");
if (process.argv.includes("--manifest-only")) process.exit(0);
const howl = process.env.HOWL_BIN || "howl";
for (const args of [
  ["validate"],
  ["list"],
  ["show", "performance"],
  ["caption", "performance", "--platform", "x"],
  ["render", "--out", ".work/howl", "--format", "svg"],
]) {
  execFileSync(howl, args, { stdio: "inherit" });
}
await mkdir("assets/og", { recursive: true });
const browser = await chromium.launch(
  process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {},
);
const inter = (await readFile("assets/fonts/inter-latin-400.woff2")).toString("base64");
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  for (const card of manifest.cards) {
    let svg = await readFile(`.work/howl/${card.id}.svg`, "utf8");
    // Howl owns composition. Apply the site's body font to descriptions before rasterizing.
    svg = svg.replace(
      "</style>",
      `@font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter}) format('woff2')}.social-tag{font-family:Inter,sans-serif}</style>`,
    );
    await page.setContent(
      `<html><head><style>body{margin:0}</style></head><body>${svg}</body></html>`,
    );
    await page.evaluate(() => document.fonts.ready);
    const shownTitle = await page.locator(".social-title").allTextContents();
    if (shownTitle.join(" ") !== card.title) throw Error(`${card.id}: Howl clipped the title`);
    const clipped = await page.locator("svg text").evaluateAll((nodes) =>
      nodes
        .filter((el) => {
          const b = el.getBBox();
          return b.x < 0 || b.y < 0 || b.x + b.width > 1200 || b.y + b.height > 630;
        })
        .map((el) => el.textContent),
    );
    if (clipped.length) throw Error(`${card.id}: overflowing SVG text: ${clipped.join("; ")}`);
    await page.screenshot({ path: `assets/og/${card.id}.png` });
  }
} finally {
  await browser.close();
}
console.log(`Rendered ${manifest.cards.length} Howl social cards as 1200x630 PNGs.`);
