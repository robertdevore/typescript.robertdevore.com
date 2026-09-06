import { chromium } from "@playwright/test";
import { cp, readFile } from "node:fs/promises";
const browser = await chromium.launch(
  process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {},
);
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto("http://127.0.0.1:4173/");
  const brand = (await readFile("assets/tabler/brand-typescript.svg", "utf8")).replace(
    /<!--[\s\S]*?-->/g,
    "",
  );
  await page.setContent(
    `<!doctype html><html><head><link rel="stylesheet" href="http://127.0.0.1:4173/assets/site.css"><style>body{width:1200px;height:630px;padding:56px 65px;background:#f7f8f6;overflow:hidden}.social-top{display:flex;justify-content:space-between;border-bottom:1px solid #dce2dc;padding-bottom:25px;margin-bottom:40px;font-family:'Departure Mono';font-size:13px}.social-main{display:grid;grid-template-columns:1fr 220px;gap:40px;align-items:center}h1{font-size:64px;line-height:1.15}h1 span{color:#2358b8}.tile svg{width:160px;height:160px}.tile{width:210px;height:210px;background:#2358b8;color:white;font:100px 'Departure Mono';display:grid;place-items:center;box-shadow:12px 12px 0 #dce2dc}p{font-size:21px;max-width:730px}.eyebrow{font-size:13px}</style></head><body><div class="social-top"><span>TYPESCRIPT / THE COURSE</span><span>FREE · SELF-GUIDED · TYPESCRIPT 7</span></div><div class="social-main"><div><h1>Learn TypeScript.<br><span>Build apps<br>and libraries.</span></h1><p>36 lessons. Five stages. Learn by building.</p><span class="eyebrow">TYPESCRIPT.ROBERTDEVORE.COM</span></div><div class="tile">${brand}</div></div></body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "assets/social.png" });
  await cp("assets/social.png", "dist/assets/social.png");
} finally {
  await browser.close();
}
