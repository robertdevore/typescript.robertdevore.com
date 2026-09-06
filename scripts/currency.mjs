import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
const tags = JSON.parse(
  execFileSync("npm", ["view", "typescript", "dist-tags", "--json"], { encoding: "utf8" }),
);
if (tags.latest !== "7.0.2")
  throw new Error(`Stable changed to ${tags.latest}: review the course before release`);
const urls = {
  release: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/",
  iteration: "https://api.github.com/repos/microsoft/TypeScript/issues/63703",
  handbook: "https://www.typescriptlang.org/docs/handbook/intro.html",
  config: "https://www.typescriptlang.org/tsconfig/",
  modules: "https://nodejs.org/docs/latest-v24.x/api/packages.html",
  node: "https://nodejs.org/en/about/previous-releases",
  proposals: "https://raw.githubusercontent.com/tc39/proposals/main/README.md",
  finished: "https://raw.githubusercontent.com/tc39/proposals/main/finished-proposals.md",
  decorators: "https://raw.githubusercontent.com/tc39/proposal-decorators/master/README.md",
  changes: "https://raw.githubusercontent.com/microsoft/typescript-go/main/CHANGES.md",
};
const sources = [];
for (const [concept, url] of Object.entries(urls)) {
  const response = await fetch(url, {
    headers: { "user-agent": "TypeScript-course-currency-check" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`${concept}: HTTP ${response.status}`);
  const text = await response.text();
  const entry = { concept, url, status: response.status, bytes: Buffer.byteLength(text) };
  if (concept === "iteration") {
    const issue = JSON.parse(text);
    entry.updatedAt = issue.updated_at;
    entry.plan = issue.body;
  }
  if (concept === "decorators") entry.stage = text.match(/Stage:\s*[^\n]+/)?.[0];
  sources.push(entry);
}
const packageNames = [
  "typescript",
  "@types/node",
  "markdown-it",
  "highlight.js",
  "esbuild",
  "wrangler",
  "@playwright/test",
  "@axe-core/playwright",
  "eslint",
  "prettier",
  "zod",
];
const packages = packageNames.map((name) => ({
  name,
  registry: JSON.parse(
    execFileSync("npm", ["view", name, "version", "engines", "deprecated", "--json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }),
  ),
}));
await writeFile(
  "research/currency.json",
  JSON.stringify(
    { verifiedAt: new Date().toISOString(), runtime: process.version, tags, sources, packages },
    null,
    2,
  ) + "\n",
);
console.log(
  `Currency gate: stable ${tags.latest}; ${sources.length} authoritative documents and ${packages.length} packages inspected.`,
);
