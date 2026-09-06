import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
};
const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  let path;
  try {
    path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (path !== root && !path.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(path)).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        res.writeHead(308, { location: url.pathname + "/" + url.search }).end();
        return;
      }
      path = resolve(path, "index.html");
    }
    res.writeHead(200, { "content-type": mime[extname(path)] || "application/octet-stream" });
    res.end(await readFile(path));
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end(await readFile(resolve(root, "404.html")));
  }
});
server.listen(Number(process.env.PORT || 4173), "127.0.0.1", () =>
  console.log("Course preview ready"),
);
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => server.close());
