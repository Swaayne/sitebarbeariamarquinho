import { createServer } from "node:http";
import { readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
const base = (process.argv[3] ?? process.env.SITE_BASE_PATH ?? "").replace(/\/+$/, "");
const port = Number(process.env.PORT ?? 4173);
const mime = { ".html":"text/html; charset=utf-8", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".svg":"image/svg+xml", ".webp":"image/webp", ".png":"image/png", ".jpg":"image/jpeg", ".ttf":"font/ttf", ".woff":"font/woff", ".woff2":"font/woff2", ".txt":"text/plain; charset=utf-8" };
if (!existsSync(path.join(root, "index.html"))) throw new Error("Run pnpm build first.");
createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400); res.end(); return; }
  if (base && pathname === base) { res.writeHead(308, { Location: base + "/" + url.search }); res.end(); return; }
  let file = path.resolve(root, "." + pathname.slice(base.length));
  const allowed = (!base || pathname.startsWith(base + "/")) && (file === root || file.startsWith(root + path.sep));
  if (!allowed) { res.writeHead(404); res.end("Not found"); return; }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!pathname.endsWith("/")) { res.writeHead(308, { Location: url.pathname + "/" + url.search }); res.end(); return; }
    file = path.join(file, "index.html");
  }
  if (!existsSync(file)) { res.writeHead(404); res.end("Not found"); return; }
  res.writeHead(200, { "Content-Type": mime[path.extname(file)] ?? "application/octet-stream" });
  res.end(req.method === "HEAD" ? undefined : readFileSync(file));
}).listen(port, "127.0.0.1", () => console.log(`Static preview: http://localhost:${port}${base}/`));
