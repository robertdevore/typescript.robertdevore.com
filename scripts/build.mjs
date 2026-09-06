import { mkdir, readFile, writeFile, rm, cp } from "node:fs/promises";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { build } from "esbuild";
import { readCollection, stages, origin, escape as e } from "./content.mjs";
const lessons = await readCollection("lessons");
const builds = await readCollection("builds");
const sequence = stages.flatMap((_, i) => [
  ...lessons.filter((l) => l.stage === i + 1),
  ...builds.filter((b) => b.stage === i + 1),
]);
const ids = sequence.map((l) => l.slug);
const md = new MarkdownIt({
  html: false,
  linkify: true,
  highlight: (code, lang) =>
    hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : e(code),
});
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx];
  const lang = token.info.trim().split(/\s+/)[0] || "text";
  const code = hljs.getLanguage(lang)
    ? hljs.highlight(token.content, { language: lang }).value
    : e(token.content);
  return `<figure class="code ${token.content.includes("error TS") ? "diagnostic" : ""}"><figcaption>${e(lang === "ts" ? "TypeScript" : lang)}<button type="button" class="copy" aria-label="Copy ${e(lang)} code">Copy</button></figcaption><pre tabindex="0"><code class="language-${e(lang)}">${code}</code></pre></figure>`;
};
function render(text) {
  const tokens = md.parse(text, {});
  const toc = [];
  const used = new Map();
  tokens.forEach((token, i) => {
    if (token.type === "heading_open") {
      const title = tokens[i + 1].content;
      const base = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      const id = count ? `${base}-${count}` : base;
      token.attrSet("id", id);
      if (token.tag === "h2") toc.push({ title, id });
    }
  });
  return { html: md.renderer.render(tokens, md.options, {}), toc };
}
function nav(active) {
  return `<a class="skip" href="#main">Skip to content</a><header class="top"><a class="brand" href="/"><span class="logo" aria-hidden="true">TS</span><span>TypeScript<span class="brand-small"> / THE COURSE</span></span></a><nav aria-label="Main"><a href="/course/" ${active === "course" ? 'aria-current="page"' : ""}>Course</a><a href="/reference/">Reference</a><a href="/about/">About</a></nav><a class="search-link" href="/search/">Search <kbd>/</kbd></a></header>`;
}
function layout(title, description, path, body, active = "", noindex = false) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(title)} · TypeScript Course</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${origin}${path}"><meta property="og:type" content="website"><meta property="og:title" content="${e(title)} · TypeScript Course"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${origin}${path}"><meta property="og:image" content="${origin}/assets/social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="TypeScript Course: JavaScript underneath. Types above it. Build real systems."><meta name="twitter:card" content="summary_large_image">${noindex ? '<meta name="robots" content="noindex,follow">' : ""}<meta name="theme-color" content="#f7f8f6"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/DepartureMono-Regular.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/site.css"><script src="/assets/site.js" defer></script></head><body data-course-ids="${e(JSON.stringify(ids))}">${nav(active)}${body}<footer><a class="brand" href="/">TypeScript / The course</a><p>JavaScript underneath. Types above it. Runtime evidence between them.</p><div><a href="/course/">Learning path</a><a href="/research/">Sources & currency</a><a href="/sitemap.xml">Sitemap</a><a href="https://robertdevore.com">Robert DeVore</a><a href="https://github.com/robertdevore/typescript.robertdevore.com">Source code</a></div><small>Independent educational course. No affiliation with or endorsement by Microsoft or the named reference contributors.</small></footer></body></html>`;
}
async function page(path, title, description, body, active, noindex) {
  const directory = `dist${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(
    `${directory}index.html`,
    layout(title, description, path, body, active, noindex),
  );
}
function lessonLink(l, current) {
  return `<a href="${l.url}" data-progress-id="${l.slug}" ${current === l.slug ? 'aria-current="page"' : ""}><span class="check" aria-hidden="true">□</span><span class="number">${l.number ? String(l.number).padStart(2, "0") : "◆"}</span><span>${e(l.title)}</span></a>`;
}
function pathCards() {
  return stages
    .map(
      (s, i) =>
        `<article class="stage-card"><p class="eyebrow">STAGE 0${i + 1} <span>LESSONS ${s.range}</span></p><h3><a href="/course/#stage-${i + 1}">${e(s.title)}</a></h3><p>${e(s.description)}</p><a class="text-link" href="${lessons.find((l) => l.stage === i + 1).url}">Start stage <span aria-hidden="true">↗</span></a></article>`,
    )
    .join("");
}
function curriculum() {
  return stages
    .map(
      (s, i) =>
        `<section class="curriculum-stage" id="stage-${i + 1}"><div><p class="eyebrow">STAGE 0${i + 1}</p><h2>${e(s.title)}</h2><p>${e(s.description)}</p></div><div class="lesson-list">${sequence
          .filter((l) => l.stage === i + 1)
          .map((l) => lessonLink(l))
          .join("")}</div></section>`,
    )
    .join("");
}
await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
await cp("assets", "dist/assets", { recursive: true });
await build({
  entryPoints: ["assets/site.js"],
  outfile: "dist/assets/site.js",
  bundle: false,
  minify: true,
  target: "es2022",
});
await build({
  entryPoints: ["assets/site.css"],
  outfile: "dist/assets/site.css",
  minify: true,
  loader: { ".woff2": "file" },
  external: ["/assets/*"],
  bundle: true,
});
const heroSource = await readFile("labs/hero.ts", "utf8");
const heroCode = md.render("```ts\n" + heroSource + "```\n");
await page(
  "/",
  "Learn TypeScript. Build real systems.",
  "A free, self-guided TypeScript course: 36 lessons, five builds, verified examples, and a production capstone. JavaScript underneath. Types above it.",
  `<main id="main"><section class="hero"><div><p class="eyebrow"><span class="dot"></span> FREE COURSE / TYPESCRIPT 7</p><h1>JavaScript underneath.<br><span>TypeScript<br>within reach.</span></h1><p class="lead">Go from your first inferred type to systems you can confidently build, test, package, and maintain. One practical lesson at a time.</p><div class="actions"><a class="button" href="/lessons/setup/" data-resume>Start learning <span aria-hidden="true">↗</span></a><a class="text-link" href="/course/">Explore the curriculum →</a></div><p class="hero-note">No account. No paywall. Just you, the code, and the compiler.</p></div><div class="hero-visual"><div class="window-bar"><span>● ● ●</span><span>your-next-step.ts</span><span>TS</span></div>${heroCode}<div class="type-note"><span class="eyebrow">THE LEARNING LOOP</span><p>Predict the type.<br>Check the code.<br>Run the JavaScript.</p><span class="verified">✓ COMPILER + RUNTIME VERIFIED</span></div></div></section><section class="stats" aria-label="Course at a glance"><div><strong>36</strong><span>SUBSTANTIAL LESSONS</span></div><div><strong>05</strong><span>STAGES, ONE CLEAR PATH</span></div><div><strong>72</strong><span>WORKING + CHECKER DRILLS</span></div><div><strong>01</strong><span>PRODUCTION CAPSTONE</span></div></section><section class="section"><div class="section-intro"><div><p class="eyebrow">YOUR LEARNING PATH</p><h2>From first types<br>to better systems.</h2></div><p>Learn the runtime behind the syntax. Build a useful mental model. Then put it to work in software that crosses real boundaries.</p></div><div class="stage-grid">${pathCards()}</div></section><section class="principles section"><p class="eyebrow">THE COURSE PHILOSOPHY</p><h2>Types make promises.<br>Runtime evidence keeps them.</h2><div class="boundary" aria-label="External data flows to unknown, then parsing, then a trusted application type"><span>EXTERNAL DATA</span><b aria-hidden="true">→</b><span>UNKNOWN</span><b aria-hidden="true">→</b><span>PARSE + VALIDATE</span><b aria-hidden="true">→</b><span>TRUSTED TYPE</span></div><p>Use inference instead of annotation noise. Model valid states instead of casting around errors. Learn when simple types are the strongest design.</p><a class="text-link" href="/lessons/runtime-validation/">Explore runtime boundaries →</a></section><section class="section capstone-promo"><div><p class="eyebrow">BUILD SOMETHING THAT HOLDS TOGETHER</p><h2>Your final project:<br>a typed job platform.</h2><p>A CLI, HTTP API, async executor, persistence, cancellation, and a reusable package. Build it in milestones and prove its contracts.</p><a class="button" href="/builds/capstone/">See the capstone ↗</a></div><ul><li>01 / Model the domain</li><li>02 / Validate the boundaries</li><li>03 / Own async execution</li><li>04 / Package & test</li><li>05 / Ship & maintain</li></ul></section></main>`,
);
await page(
  "/course/",
  "The complete learning path",
  "All 36 TypeScript lessons and five milestone builds in order, with local progress and clear checkpoints.",
  `<main id="main" class="wide"><div class="page-intro"><p class="eyebrow">THE COMPLETE COURSE</p><h1>One path.<br>Every layer.</h1><p class="lead">Start at the beginning or return to the concept you need. Complete each build before moving to the next stage.</p><div class="progress-box" hidden><label for="overall">Your progress <span data-progress-text></span></label><progress id="overall" max="41" value="0"></progress><button class="plain" data-reset>Reset progress</button><p class="storage-note" role="status"></p></div></div>${curriculum()}</main>`,
  "course",
);
const search = [];
for (const lesson of sequence) {
  let body = lesson.body;
  if (lesson.number) {
    const id = String(lesson.number).padStart(2, "0");
    const code = await readFile(`examples/valid/${id}.ts`, "utf8");
    const bad = await readFile(`examples/invalid/${id}.ts`, "utf8");
    const diagnostic = await readFile(`examples/expected/${id}.txt`, "utf8");
    const expected = JSON.parse(await readFile(`examples/expected/${id}.json`, "utf8"));
    body = body
      .replace("{{example}}", `\nSource: examples/valid/${id}.ts\n\n\`\`\`ts\n${code}\`\`\`\n`)
      .replace(
        "{{invalid}}",
        `\nIntentionally invalid: examples/invalid/${id}.ts\n\n\`\`\`ts\n${bad}\`\`\`\n`,
      )
      .replace(
        "{{diagnostic}}",
        `\nActual TypeScript 7.0.2 diagnostic:\n\n\`\`\`text\n${diagnostic}\`\`\`\n`,
      )
      .replace(
        "{{output}}",
        `\nVerified runtime output:\n\n\`\`\`text\n${expected.stdout}\`\`\`\n`,
      );
    if ([2, 10, 11, 12, 26, 27, 35].includes(lesson.number)) {
      const declaration = await readFile(`.work/examples/${id}.d.ts`, "utf8");
      body += `\n## Type explorer\n\nThese are the actual exported types emitted by TypeScript 7.0.2. Expand the declaration view to compare inferred and annotated types. This is a static compiler snapshot, not a live editor.\n\n{{explorer}}\n`;
      lesson.explorer = md.render(`\`\`\`ts\n${declaration}\`\`\``);
    }
  }
  const rendered = render(body);
  rendered.html = rendered.html.replace(
    "<p>{{explorer}}</p>",
    `<details class="explorer"><summary>Inspect compiler-emitted types</summary>${lesson.explorer || ""}</details>`,
  );
  const index = sequence.indexOf(lesson),
    previous = sequence[index - 1],
    next = sequence[index + 1];
  const sidebar = `<aside class="course-nav"><details open><summary>Course navigation</summary><nav aria-label="Course">${stages
    .map(
      (s, i) =>
        `<details ${lesson.stage === i + 1 ? "open" : ""}><summary>0${i + 1} / ${e(s.title)}</summary>${sequence
          .filter((l) => l.stage === i + 1)
          .map((l) => lessonLink(l, lesson.slug))
          .join("")}</details>`,
    )
    .join("")}</nav></details></aside>`;
  const toc = `<aside class="toc"><nav aria-label="On this page"><p class="eyebrow">ON THIS PAGE</p>${rendered.toc.map((t) => `<a href="#${t.id}">${e(t.title)}</a>`).join("")}</nav></aside>`;
  await page(
    lesson.url,
    lesson.title,
    lesson.description,
    `<div class="lesson-layout">${sidebar}<main id="main" class="lesson" data-lesson="${lesson.slug}"><header class="lesson-header"><a class="eyebrow" href="/course/#stage-${lesson.stage}">STAGE 0${lesson.stage} / ${e(stages[lesson.stage - 1].title.toUpperCase())}</a><p class="lesson-number">${lesson.number ? `LESSON ${String(lesson.number).padStart(2, "0")} OF 36` : "STAGE BUILD"} · ${Math.max(20, Math.ceil(body.split(/\s+/).length / 180) + 20)} MIN + PRACTICE</p><h1>${e(lesson.title)}</h1><p class="lead">${e(lesson.description)}</p><p class="verified">${lesson.number ? "✓ EXAMPLES CHECKED WITH TYPESCRIPT 7.0.2 / NODE 24" : "◆ IMPLEMENT / TEST / REVIEW"}</p></header><article class="prose">${rendered.html}</article><section class="completion"><button type="button" data-complete="${lesson.slug}" aria-pressed="false" hidden>Mark complete</button><p class="storage-note" role="status"></p><p>Check off this ${lesson.number ? "lesson" : "build"} when you can meet its checkpoint. Progress stays in this browser.</p></section><nav class="previous-next" aria-label="Lesson pagination">${previous ? `<a href="${previous.url}"><small>← PREVIOUS</small>${e(previous.title)}</a>` : "<span></span>"}${next ? `<a href="${next.url}"><small>NEXT →</small>${e(next.title)}</a>` : '<a href="/tracks/"><small>CONTINUE →</small>Specialization tracks</a>'}</nav></main>${toc}</div>`,
    "course",
  );
  search.push({
    title: lesson.title,
    url: lesson.url,
    description: lesson.description,
    text: body.replace(/[`#{}]/g, ""),
    stage: lesson.stage,
  });
}
for (const [slug, title, description] of [
  [
    "about",
    "About the course",
    "How to study this independent TypeScript course and verify your work.",
  ],
  [
    "reference",
    "TypeScript reference",
    "Find TypeScript concepts, common errors, and the lesson that explains them.",
  ],
  [
    "research",
    "Sources & technical currency",
    "The course's verified TypeScript baseline, evidence ledger, and release status.",
  ],
  [
    "tracks",
    "Optional specialization tracks",
    "Continue into backend, frontend, library, type-level, tooling, or enterprise TypeScript.",
  ],
]) {
  const source = await readFile(`content/${slug}.md`, "utf8");
  await page(
    `/${slug}/`,
    title,
    description,
    `<main id="main" class="reading-page"><p class="eyebrow">TYPESCRIPT / THE COURSE</p><h1>${title}</h1><article class="prose">${render(source).html}</article></main>`,
  );
}
await page(
  "/search/",
  "Search the course",
  "Search TypeScript concepts, compiler errors, and practical reference topics.",
  `<main id="main" class="reading-page"><p class="eyebrow">FIND YOUR NEXT ANSWER</p><h1>Search the course.</h1><form role="search" action="/search/"><label for="search">Concept, keyword, or compiler error</label><input id="search" name="q" type="search" placeholder="unknown vs any, NodeNext, TS2345…" autocomplete="off"><button type="submit" class="button">Search</button></form><p id="search-status" role="status">Search all lessons and builds. Try “satisfies” or “package exports”.</p><div id="search-results"></div><noscript><p>Interactive search requires JavaScript. Use the <a href="/reference/">reference index</a> or <a href="/course/">full curriculum</a> to find every topic.</p></noscript></main>`,
  "",
  true,
);
await writeFile("dist/search-index.json", JSON.stringify(search));
await writeFile(
  "dist/404.html",
  layout(
    "Page not found",
    "Return to the TypeScript course learning path.",
    "/404/",
    '<main id="main" class="reading-page"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>This path ends here.</h1><p>Find your way back to the <a href="/course/">complete learning path</a> or <a href="/search/">search the course</a>.</p></main>',
    "",
    true,
  ),
);
const routes = [
  "/",
  "/course/",
  "/reference/",
  "/about/",
  "/research/",
  "/tracks/",
  ...sequence.map((l) => l.url),
];
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((p) => `<url><loc>${origin}${p}</loc></url>`).join("")}</urlset>`,
);
await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(
  "dist/llms.txt",
  `# TypeScript Course\n\nIndependent, free TypeScript course. Verified baseline: TypeScript 7.0.2, Node 24.20.0; September 6, 2026.\n\n${sequence.map((l) => `- [${l.title}](${origin}${l.url}): ${l.description}`).join("\n")}\n`,
);
await writeFile(
  "dist/_headers",
  "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n",
);
await cp(".work/examples", "dist/examples", { recursive: true });
await cp("examples/valid", "dist/examples/source", { recursive: true });
await mkdir("dist/labs/browser", { recursive: true });
await cp("labs/browser/index.html", "dist/labs/browser/index.html");
await cp(".work/browser/main.js", "dist/labs/browser/main.js");
console.log(
  `Built ${routes.length} indexed pages, ${sequence.length} progress checkpoints, search, sitemap, and browser lab.`,
);
