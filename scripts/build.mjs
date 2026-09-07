import { mkdir, readFile, writeFile, rm, cp, readdir } from "node:fs/promises";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { build } from "esbuild";
import { readCollection, stages, origin, escape as e } from "./content.mjs";
import { icon } from "../assets/icons.js";
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
  return `<figure class="code ${token.content.includes("error TS") ? "diagnostic" : ""}"><figcaption>${e(lang === "ts" ? "TypeScript" : lang)}<button type="button" class="copy" aria-label="Copy ${e(lang)} code">${icon("copy")}<span class="copy-label" aria-live="polite">Copy</span></button></figcaption><pre tabindex="0"><code class="language-${e(lang)}">${code}</code></pre></figure>`;
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
  const links = [
    ["/course/", "Course"],
    ["/reference/", "Reference"],
    ["/about/", "About"],
    ["/tracks/", "Specialization tracks"],
    ["/research/", "Sources & versions"],
  ];
  const link = ([url, label]) =>
    `<a href="${url}" ${active === "course" && url === "/course/" ? 'aria-current="page"' : ""}>${label}</a>`;
  return `<a class="skip" href="#main">Skip to content</a><header class="top"><a class="brand" href="/"><span class="logo" aria-hidden="true">TS</span><span>TypeScript<span class="brand-small"> / THE COURSE</span></span></a><nav class="desktop-nav" aria-label="Main">${links.slice(0, 3).map(link).join("")}</nav><a class="search-link" href="/search/" aria-label="Search the course (slash shortcut)">${icon("search")}<span>Search</span><kbd aria-hidden="true">${icon("slash")}</kbd></a><button class="menu-toggle" type="button" aria-label="Open site menu" aria-controls="site-menu" aria-expanded="false" hidden>${icon("menu-2")}</button></header><dialog id="site-menu" aria-labelledby="menu-title"><div class="menu-heading"><p id="menu-title" class="eyebrow">EXPLORE THE COURSE</p><button class="menu-close" type="button" aria-label="Close site menu" autofocus>${icon("x")}</button></div><nav aria-label="Site menu"><a href="/">Home ${icon("arrow-up-right")}</a>${links.map(([url, label]) => `<a href="${url}">${label}${icon("arrow-up-right")}</a>`).join("")}<a href="/search/">Search ${icon("search")}</a></nav><p class="menu-note">Learn at your pace. Pick up where you left off.</p></dialog>`;
}
function layout(title, description, path, body, active = "", noindex = false) {
  const lesson = sequence.find((item) => item.url === path);
  const isHomepage = path === "/";
  const socialImage = isHomepage
    ? `${origin}/assets/typescript-course-launch.png`
    : lesson
      ? `${origin}/assets/og/${lesson.slug}.png`
      : `${origin}/assets/social.png`;
  const socialWidth = isHomepage ? 1536 : 1200;
  const socialHeight = isHomepage ? 1024 : 630;
  const socialAlt = isHomepage
    ? "Learn TypeScript. Build real things. Free course with 36 lessons and a production capstone."
    : lesson
      ? `${lesson.title} — TypeScript Course`
      : "TypeScript Course: Learn TypeScript. Build apps and libraries.";
  const crumbs = [
    { name: "Home", url: "/" },
    ...(lesson ? [{ name: "Course", url: "/course/" }] : []),
    { name: title, url: path },
  ];
  if (path !== "/" && !noindex) {
    body = body.replace(
      /<main([^>]*)>/,
      `<main$1><nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${crumbs.map((crumb, i) => `<li>${i ? icon("chevron-right") : ""}${i === crumbs.length - 1 ? `<span aria-current="page">${e(crumb.name)}</span>` : `<a href="${crumb.url}">${e(crumb.name)}</a>`}</li>`).join("")}</ol></nav>`,
    );
  }
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: "TypeScript Course",
      inLanguage: "en",
    },
    {
      "@type": lesson
        ? ["WebPage", "LearningResource"]
        : path === "/about/"
          ? "AboutPage"
          : path === "/course/" || path === "/reference/"
            ? "CollectionPage"
            : "WebPage",
      "@id": `${origin}${path}#page`,
      url: `${origin}${path}`,
      name: title,
      description,
      inLanguage: "en",
      isPartOf: { "@id": `${origin}/#website` },
      ...(lesson
        ? {
            learningResourceType: lesson.number ? "Lesson" : "Project brief",
            isAccessibleForFree: true,
          }
        : {}),
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: socialImage,
        width: socialWidth,
        height: socialHeight,
        caption: socialAlt,
      },
    },
    ...(path !== "/"
      ? [
          {
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map((crumb, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: crumb.name,
              item: origin + crumb.url,
            })),
          },
        ]
      : []),
  ];
  const schema = noindex
    ? ""
    : `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c")}</script>`;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(title)} · TypeScript Course</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${origin}${path}"><meta property="og:type" content="website"><meta property="og:title" content="${e(title)} · TypeScript Course"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${origin}${path}"><meta property="og:image" content="${socialImage}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="${socialWidth}"><meta property="og:image:height" content="${socialHeight}"><meta property="og:image:alt" content="${e(socialAlt)}"><meta property="og:site_name" content="TypeScript Course"><meta property="og:locale" content="en_US"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(description)}"><meta name="twitter:image" content="${socialImage}"><meta name="twitter:image:alt" content="${e(socialAlt)}">${schema}${noindex ? '<meta name="robots" content="noindex,follow">' : ""}<meta name="theme-color" content="#f7f8f6"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/DepartureMono-Regular.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/site.css"><script src="/assets/site.js" defer></script></head><body data-course-ids="${e(JSON.stringify(ids))}">${nav(active)}${body}<footer><a class="brand" href="/">TypeScript / The course</a><p>Understand JavaScript. Use TypeScript. Check what runs.</p><div><a href="/course/">Learning path</a><a href="/research/">Sources & versions</a><a href="/sitemap.xml">Sitemap</a><a href="https://robertdevore.com">Robert DeVore</a><a href="https://github.com/robertdevore/typescript.robertdevore.com">Source code</a></div><small>Independent educational course. No affiliation with or endorsement by Microsoft or the named reference contributors.</small></footer></body></html>`;
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
  return `<a href="${l.url}" data-progress-id="${l.slug}" ${current === l.slug ? 'aria-current="page"' : ""}><span class="check" aria-hidden="true">${icon("square")}</span><span class="number">${l.number ? String(l.number).padStart(2, "0") : icon("diamond")}</span><span>${e(l.title)}</span></a>`;
}
function pathCards() {
  return stages
    .map(
      (s, i) =>
        `<article class="stage-card"><p class="eyebrow">STAGE 0${i + 1} <span>LESSONS ${s.range}</span></p><h3><a href="/course/#stage-${i + 1}">${e(s.title)}</a></h3><p>${e(s.description)}</p><a class="text-link" href="${lessons.find((l) => l.stage === i + 1).url}">Start stage ${icon("arrow-up-right")}</a></article>`,
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
await cp("media/typescript-course-launch.png", "dist/assets/typescript-course-launch.png");
const symbols = await Promise.all(
  (await readdir("assets/tabler"))
    .filter((name) => name.endsWith(".svg"))
    .map(async (name) => {
      const source = await readFile(`assets/tabler/${name}`, "utf8");
      const svg = source.match(/<svg([\s\S]*?)>([\s\S]*?)<\/svg>/);
      return `<symbol id="${name.slice(0, -4)}"${svg[1].replace(/\s(?:xmlns|width|height)="[^"]*"/g, "")}>${svg[2]}</symbol>`;
    }),
);
await writeFile(
  "dist/assets/icons.svg",
  `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>`,
);
await cp("assets/tabler/brand-typescript.svg", "dist/assets/favicon.svg");
await build({
  entryPoints: ["assets/site.js"],
  outfile: "dist/assets/site.js",
  bundle: true,
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
  "Learn TypeScript. Build apps and libraries.",
  "A free, self-guided TypeScript course: 36 lessons, five builds, verified examples, and a production capstone. JavaScript underneath. Types above it.",
  `<main id="main"><section class="hero"><div><p class="eyebrow">${icon("circle-filled")} FREE COURSE / TYPESCRIPT 7</p><h1>Learn TypeScript.<br><span>Build apps<br>and libraries.</span></h1><p class="lead">Learn how JavaScript runs and how TypeScript checks your code. Then build, test, and package software you can maintain.</p><div class="actions"><a class="button" href="/lessons/setup/" data-resume>Start learning ${icon("arrow-up-right")}</a><a class="text-link" href="/course/">View all lessons ${icon("arrow-right")}</a></div><p class="hero-note">Free to read. No account needed.</p></div><div class="hero-visual"><div class="window-bar"><span class="window-dots">${icon("circle-filled")}${icon("circle-filled")}${icon("circle-filled")}</span><span>your-next-step.ts</span><span>TS</span></div>${heroCode}<div class="type-note"><span class="eyebrow">THE LEARNING LOOP</span><p>Predict the type.<br>Check the code.<br>Run the JavaScript.</p><span class="verified">${icon("check")} CHECKED AND RUN</span></div></div></section><section class="stats" aria-label="Course at a glance"><div><strong>36</strong><span>LESSONS WITH EXERCISES</span></div><div><strong>05</strong><span>STAGES</span></div><div><strong>72</strong><span>CODE EXAMPLES & DRILLS</span></div><div><strong>01</strong><span>PRODUCTION CAPSTONE</span></div></section><section class="section"><div class="section-intro"><div><p class="eyebrow">YOUR LEARNING PATH</p><h2>Start with the basics.<br>Build at every stage.</h2></div><p>Write your first program, learn the type system, then build applications and libraries. Each stage ends with a project.</p></div><div class="stage-grid">${pathCards()}</div></section><section class="principles section"><p class="eyebrow">TYPES AND RUNTIME</p><h2>Types check your code.<br>Validation checks your data.</h2><div class="boundary" aria-label="External data flows to unknown, then parsing, then a trusted application type"><span>EXTERNAL DATA</span>${icon("arrow-right")}<span>UNKNOWN</span>${icon("arrow-right")}<span>PARSE + VALIDATE</span>${icon("arrow-right")}<span>TRUSTED TYPE</span></div><p>Let TypeScript infer what it can. Use unions to describe valid states, and validate external data before you trust it.</p><a class="text-link" href="/lessons/runtime-validation/">Learn runtime validation ${icon("arrow-right")}</a></section><section class="section capstone-promo"><div><p class="eyebrow">THE FINAL PROJECT</p><h2>Build a job<br>execution platform.</h2><p>A CLI, HTTP API, async executor, persistence, cancellation, and a reusable package. Build it in stages and test each part.</p><a class="button" href="/builds/capstone/">View the project ${icon("arrow-up-right")}</a></div><ul><li>01 / Model the domain</li><li>02 / Validate the boundaries</li><li>03 / Manage async execution</li><li>04 / Package & test</li><li>05 / Ship & maintain</li></ul></section></main>`,
);
await page(
  "/course/",
  "The complete learning path",
  "All 36 TypeScript lessons and five milestone builds in order, with local progress and clear checkpoints.",
  `<main id="main" class="wide"><div class="page-intro"><p class="eyebrow">THE COMPLETE COURSE</p><h1>Your TypeScript<br>learning path.</h1><p class="lead">Start at the beginning or return to the concept you need. Complete each build before moving to the next stage.</p><div class="progress-box" hidden><label for="overall">Your progress <span data-progress-text></span></label><progress id="overall" max="41" value="0"></progress><button class="plain" data-reset>Reset progress</button><p class="storage-note" role="status"></p></div></div>${curriculum()}</main>`,
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
    `<details class="explorer"><summary>${icon("chevron-right")}Inspect compiler-emitted types</summary>${lesson.explorer || ""}</details>`,
  );
  const index = sequence.indexOf(lesson),
    previous = sequence[index - 1],
    next = sequence[index + 1];
  const sidebar = `<aside class="course-nav"><details open><summary>${icon("chevron-right")}Course navigation</summary><nav aria-label="Course">${stages
    .map(
      (s, i) =>
        `<details ${lesson.stage === i + 1 ? "open" : ""}><summary>${icon("chevron-right")}0${i + 1} / ${e(s.title)}</summary>${sequence
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
    `<div class="lesson-layout">${sidebar}<main id="main" class="lesson" data-lesson="${lesson.slug}"><header class="lesson-header"><a class="eyebrow" href="/course/#stage-${lesson.stage}">STAGE 0${lesson.stage} / ${e(stages[lesson.stage - 1].title.toUpperCase())}</a><p class="lesson-number">${lesson.number ? `LESSON ${String(lesson.number).padStart(2, "0")} OF 36` : "STAGE BUILD"} · ${Math.max(20, Math.ceil(body.split(/\s+/).length / 180) + 20)} MIN + PRACTICE</p><h1>${e(lesson.title)}</h1><p class="lead">${e(lesson.description)}</p><p class="verified">${lesson.number ? `${icon("check")} EXAMPLES CHECKED WITH TYPESCRIPT 7.0.2 / NODE 24` : `${icon("diamond")} BUILD / TEST / REVIEW`}</p></header><article class="prose">${rendered.html}</article><section class="completion"><button type="button" data-complete="${lesson.slug}" aria-pressed="false" hidden>Mark complete</button><p class="storage-note" role="status"></p><p>Check off this ${lesson.number ? "lesson" : "build"} when you can meet its checkpoint. Progress stays in this browser.</p></section><nav class="previous-next" aria-label="Lesson pagination">${previous ? `<a href="${previous.url}"><small>${icon("arrow-left")} PREVIOUS</small>${e(previous.title)}</a>` : "<span></span>"}${next ? `<a href="${next.url}"><small>NEXT ${icon("arrow-right")}</small>${e(next.title)}</a>` : `<a href="/tracks/"><small>CONTINUE ${icon("arrow-right")}</small>Specialization tracks</a>`}</nav></main>${toc}</div>`,
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
    "Sources & versions",
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
  `<main id="main" class="reading-page"><p class="eyebrow">SEARCH</p><h1>Search the course.</h1><form role="search" action="/search/"><label for="search">Concept, keyword, or compiler error</label><input id="search" name="q" type="search" placeholder="unknown vs any, NodeNext, TS2345…" autocomplete="off"><button type="submit" class="button">Search</button></form><p id="search-status" role="status">Search all lessons and builds. Try “satisfies” or “package exports”.</p><div id="search-results"></div><noscript><p>Interactive search requires JavaScript. Use the <a href="/reference/">reference index</a> or <a href="/course/">full curriculum</a> to find every topic.</p></noscript></main>`,
  "",
  true,
);
await writeFile("dist/search-index.json", JSON.stringify(search));
// Exact known routes only. Workers assets preserves query strings on these redirects.
await writeFile(
  "dist/_redirects",
  [
    "/index.html / 301",
    ...[
      "/course/",
      "/about/",
      "/reference/",
      "/research/",
      "/tracks/",
      "/search/",
      ...sequence.map((item) => item.url),
    ].map((url) => `${url.slice(0, -1)} ${url} 301`),
  ].join("\n") + "\n",
);

await writeFile(
  "dist/404.html",
  layout(
    "Page not found",
    "Return to the TypeScript course learning path.",
    "/404/",
    '<main id="main" class="reading-page"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>Page not found.</h1><p>Browse the <a href="/course/">complete learning path</a> or <a href="/search/">search the course</a>.</p></main>',
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
