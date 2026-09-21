import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
const base = (process.argv[3] ?? process.env.SITE_BASE_PATH ?? "").replace(/\/+$/, "");
const origin = "https://static-validation.invalid";
const errors = new Set();
let checked = 0;
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory()
    ? files(path.join(dir, item.name)) : [path.join(dir, item.name)]);
}
function check(raw, file, fromRoot = false) {
  const value = raw.replace(/&amp;/g, "&").replace(/\\\//g, "/");
  if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) return;
  const relative = path.relative(root, file).split(path.sep).join("/");
  const source = fromRoot ? `${base}/index.html` : `${base}/${relative}`;
  let resolved;
  try { resolved = new URL(value, origin + source); } catch { errors.add(`Invalid URL in ${relative}: ${value}`); return; }
  if (resolved.origin !== origin) return;
  const pathname = decodeURIComponent(resolved.pathname);
  if (base && !pathname.startsWith(base + "/")) {
    errors.add(`Escapes deployment base ${base}: ${relative} → ${value}`);
    return;
  }
  const local = path.resolve(root, "." + pathname.slice(base.length));
  if (!local.startsWith(root + path.sep) && local !== root) {
    errors.add(`Escapes publish directory: ${relative} → ${value}`); return;
  }
  let target = local;
  if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, "index.html");
  if (!existsSync(target)) errors.add(`Missing file: ${relative} → ${value}`);
  checked++;
}
if (!existsSync(path.join(root, "index.html"))) throw new Error(`Missing ${root}/index.html`);
if (!existsSync(path.join(root, ".nojekyll"))) errors.add("Missing .nojekyll");
for (const file of files(root)) {
  const extension = path.extname(file);
  if (![".html", ".css", ".js", ".json", ".rsc", ".txt", ".webmanifest", ".svg"].includes(extension)) continue;
  const text = readFileSync(file, "utf8");
  if ([".html", ".svg"].includes(extension)) {
    const ids = new Set([...text.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]));
    for (const m of text.matchAll(/\b(?:href|src|poster|data-src)=["']([^"']+)["']/g)) {
      if (m[1].startsWith("#")) {
        if (m[1].length > 1 && !ids.has(m[1].slice(1))) errors.add(`Missing anchor in ${path.basename(file)}: ${m[1]}`);
      } else check(m[1], file);
    }
    for (const m of text.matchAll(/\bsrcset=["']([^"']+)["']/g)) {
      for (const entry of m[1].split(",")) check(entry.trim().split(/\s+/)[0], file);
    }
  }
  if (extension === ".css") {
    for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) check(m[1].trim(), file);
    for (const m of text.matchAll(/@import\s+["']([^"']+)["']/g)) check(m[1], file);
  }
  if ([".js", ".rsc", ".txt"].includes(extension)) {
    // Covers static/dynamic ES module imports, preload maps and RSC asset IDs.
    for (const m of text.matchAll(/["']((?:\.{1,2}\/|\/|_next\/)[^"'\s<>]*\.(?:js|mjs|css|woff2?|ttf|otf|webp|png|jpe?g|svg|ico|rsc)(?:\?[^"'\s]*)?)["']/g)) {
      check(m[1], file, m[1].startsWith("_next/"));
    }
    // Next.js build manifests store chunk names relative to /_next/.
    if (path.basename(file).endsWith("Manifest.js")) {
      for (const m of text.matchAll(/["'](static\/[^"']+\.(?:js|css))["']/g)) check(`${base}/_next/${m[1]}`, file);
    }
  }
  if ([".json", ".webmanifest"].includes(extension)) {
    const data = JSON.parse(text);
    if (path.relative(root, file).split(path.sep).join("/") === ".vite/manifest.json") {
      // Vite's imports/dynamicImports are manifest keys, not deployed URLs.
      for (const entry of Object.values(data)) {
        if (entry.file) check(entry.file, file, true);
        for (const asset of [...(entry.css ?? []), ...(entry.assets ?? [])]) check(asset, file, true);
        for (const key of [...(entry.imports ?? []), ...(entry.dynamicImports ?? [])]) {
          if (!(key in data)) errors.add(`Missing Vite manifest entry: ${key}`);
        }
      }
      continue;
    }
    function walk(value, key) {
      if (typeof value === "string" && (/\.(?:js|css|woff2?|ttf|webp|png|svg|ico)$/.test(value)) && key !== "src" && !value.startsWith("\u0000")) check(value, file, true);
      else if (Array.isArray(value)) value.forEach(item => walk(item, key));
      else if (value && typeof value === "object") for (const [k,v] of Object.entries(value)) walk(v,k);
    }
    walk(data, "");
  }
}
if (errors.size) {
  console.error([...errors].join("\n"));
  console.error(`Asset validation failed: ${errors.size} error(s).`);
  process.exit(1);
}
console.log(`Asset validation passed: ${checked} local references; base ${base || "/"}.`);
