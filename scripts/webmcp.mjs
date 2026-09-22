import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const schema = "kujo-ssg-site-index/v1";
const runtimeTag =
  '<script src="/assets/js/kujo-webmcp.js" data-kujo-webmcp data-kujo-site-index="/.well-known/kujo-site-index.json" defer></script>';

async function walk(directory) {
  const files = [];
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(file)));
    else files.push(file);
  }
  return files;
}

function decodeHtml(value) {
  const names = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"' };
  return value
    .replace(/&#(x?[0-9a-f]+);/gi, (_, raw) =>
      String.fromCodePoint(
        raw[0].toLowerCase() === "x" ? Number.parseInt(raw.slice(1), 16) : Number.parseInt(raw, 10),
      ),
    )
    .replace(/&([a-z]+);/gi, (match, name) => names[name.toLowerCase()] ?? match);
}

function plainText(html) {
  return decodeHtml(
    html.replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function bounded(value, length) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, length);
}

function routeFor(output, file) {
  const relative = path.relative(output, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
}

function contentType(route) {
  if (/^\/(?:course|lessons)\/[^/]+\/$/.test(route)) return "lessons";
  if (/^\/(?:builds\/|build-|capstone\/)/.test(route)) return "builds";
  return "pages";
}

function slugFor(route) {
  if (route === "/") return "home";
  return route
    .replace(/^\/|\/$/g, "")
    .replace(/\.html$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/**
 * Emit the public, read-only Kujo SSG WebMCP v1 projection for a static site.
 * The runtime is vendored byte-for-byte from Kujo SSG 1.0.0.
 */
export async function emitWebMcp({ output, siteTitle, tagline, siteUrl }) {
  const htmlFiles = (await walk(output)).filter(
    (file) => file.endsWith(".html") && !/(?:^|\/)404(?:\/index)?\.html$/.test(file),
  );
  const items = [];

  for (const file of htmlFiles) {
    let html = await readFile(file, "utf8");
    const route = routeFor(output, file);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
    const title =
      plainText(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "") ||
      plainText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? route);
    const description = decodeHtml(
      html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] ?? "",
    );
    const type = contentType(route);
    const slug = slugFor(route);
    items.push({
      id: `${type}:${slug}`,
      type,
      slug,
      url: route,
      title: bounded(title, 160),
      description: bounded(description, 320),
      summary: bounded(plainText(main), 600),
      language: "en",
      searchable: true,
      taxonomies: {},
    });

    if (!html.includes("data-kujo-webmcp")) {
      html = html.includes("</body>")
        ? html.replace("</body>", `${runtimeTag}</body>`)
        : `${html}${runtimeTag}`;
      await writeFile(file, html);
    }
  }

  items.sort(
    (a, b) =>
      a.type.localeCompare(b.type) || a.url.localeCompare(b.url) || a.id.localeCompare(b.id),
  );
  const ids = new Set();
  const urls = new Set();
  for (const item of items) {
    if (ids.has(item.id) || urls.has(item.url)) {
      throw new Error(`Duplicate WebMCP public record: ${item.id} ${item.url}`);
    }
    ids.add(item.id);
    urls.add(item.url);
  }

  const types = [...new Set(items.map((item) => item.type))].sort();
  const contentTypes = types.map((name) => {
    const info = {
      name,
      title: name[0].toUpperCase() + name.slice(1),
      count: items.filter((item) => item.type === name).length,
      taxonomies: [],
    };
    if (name === "lessons" && items.some((item) => item.url === "/course/")) {
      info.listing_url = "/course/";
    }
    return info;
  });
  const navigation = items
    .filter((item) => item.url === "/" || item.url.split("/").filter(Boolean).length === 1)
    .sort((a, b) => (a.url === "/" ? -1 : b.url === "/" ? 1 : a.url.localeCompare(b.url)))
    .slice(0, 25)
    .map((item) => ({ label: item.url === "/" ? "Home" : item.title, url: item.url }));

  const document = {
    schema,
    generated_by: { name: "kujo-ssg", version: "1.0.0" },
    site: {
      title: bounded(siteTitle, 160),
      tagline: bounded(tagline, 320),
      url: siteUrl.replace(/\/$/, ""),
      base_path: "/",
      language: "en",
    },
    navigation,
    content_types: contentTypes,
    items,
  };
  await mkdir(path.join(output, ".well-known"), { recursive: true });
  await writeFile(
    path.join(output, ".well-known", "kujo-site-index.json"),
    `${JSON.stringify(document)}\n`,
  );
}
