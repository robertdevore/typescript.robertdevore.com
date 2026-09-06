import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const base = process.env.SITE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch(
  process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : { headless: true },
);
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
const checks = [];
try {
  await mkdir(".work/screenshots", { recursive: true });
  for (const route of [
    "/",
    "/course/",
    "/lessons/modules/",
    "/lessons/runtime-validation/",
    "/builds/capstone/",
    "/reference/",
    "/search/",
  ]) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
    await page.evaluate(() => document.fonts.ready);
    const violations = (
      await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
    ).violations;
    assert.deepEqual(
      violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      [],
      route,
    );
    checks.push({ route, accessibility: "passed" });
  }
  await page.goto(base + "/");
  assert.match(
    await page.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily),
    /Departure Mono/,
  );
  assert.match(
    await page
      .locator(".lead")
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily),
    /Inter/,
  );
  await page.screenshot({ path: ".work/screenshots/home-desktop.png", fullPage: true });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(base + "/lessons/setup/");
  await page.locator(".copy").first().click();
  await expect(page.locator(".copy").first()).toHaveText("Copied");
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    await page.locator("figure code").first().textContent(),
  );
  await page.goto(base + "/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await page.keyboard.press("Enter");
  assert.ok(page.url().endsWith("#main"));
  await page.goto(base + "/lessons/setup/");
  await page.getByRole("button", { name: "Mark complete", exact: true }).click();
  await page.reload();
  await expect(page.locator("[data-complete]")).toHaveAttribute("aria-pressed", "true");
  await page.goto(base + "/course/");
  await expect(page.locator("[data-progress-text]")).toContainText("1 / 41");
  await page.goto(base + "/");
  await expect(page.locator("[data-resume]")).toHaveAttribute("href", "/lessons/values-and-types/");
  await page.goto(base + "/search/");
  for (const [query, slug] of [
    ["unknown vs any", "any-unknown-never-void"],
    ["satisfies", "assertions-const-satisfies"],
    ["NodeNext", "modules"],
    ["TS2345", "generics"],
    ["package exports", "publishing"],
  ]) {
    await page.locator("#search").fill(query);
    await expect(page.locator(`#search-results a[href="/lessons/${slug}/"]`)).toBeVisible();
  }
  await page.locator("#search").fill("qzxnomatch987");
  await expect(page.locator("#search-status")).toContainText("No results");
  await page.goto(base + "/lessons/modules/#runtime-drill");
  await page.reload();
  await expect(page.locator("#runtime-drill")).toBeVisible();
  await page.screenshot({ path: ".work/screenshots/lesson-desktop.png", fullPage: true });
  await page.goto(base + "/lessons/values-and-types/");
  await page.getByText("Inspect compiler-emitted types", { exact: true }).click();
  await expect(page.locator(".explorer")).toContainText('status = "ready"');
  await page.goto(base + "/labs/browser/");
  await page.getByRole("button", { name: "Run a job" }).click();
  await expect(page.locator("#output")).toHaveText("Executed 1 job.");
  await page.route("**/labs/browser/main.js", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body:
        'document.querySelector("#run").outerHTML = \'<p id="run">wrong</p>\';\n' +
        (await response.text()),
    });
  });
  await page.reload();
  await expect(page.locator("body")).toHaveAttribute("data-error", "invalid-elements");
  await page.unroute("**/labs/browser/main.js");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/course/", "/lessons/modules/", "/search/"]) {
    await page.goto(base + route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `Mobile overflow ${route}`);
    const violations = (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations;
    assert.equal(violations.length, 0, JSON.stringify(violations.map((v) => v.id)));
  }
  await page.goto(base + "/");
  await page.screenshot({ path: ".work/screenshots/home-mobile.png", fullPage: true });
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  await staticPage.goto(base + "/course/");
  await expect(staticPage.locator(".lesson-list a")).toHaveCount(41);
  await nojs.close();
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(base + "/lessons/setup/");
  await expect(blockedPage.locator(".storage-note")).toContainText("unavailable");
  await blocked.close();
  assert.deepEqual(errors, []);
  await writeFile(
    "research/browser-verification.json",
    JSON.stringify(
      {
        base,
        checks,
        search: "passed",
        progress: "passed",
        mobile: "passed",
        dom: "passed",
        noJavaScript: "passed",
        blockedStorage: "passed",
        consoleErrors: errors,
        browserVersion: browser.version(),
        clipboard: "passed",
        keyboard: "passed",
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Browser checks passed: accessibility, search, progress, mobile, deep links, DOM boundaries, no-JS navigation, and console.",
  );
} finally {
  await browser.close();
}
