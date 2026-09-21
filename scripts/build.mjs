import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { rmSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const rawBase = (process.env.SITE_BASE_PATH ?? "").trim();
if (rawBase && !/^\/(?:[A-Za-z0-9._~-]+\/)*[A-Za-z0-9._~-]*\/?$/.test(rawBase)) {
  throw new Error("SITE_BASE_PATH must be empty or a path such as /repository-name.");
}
const basePath = rawBase.replace(/\/+$/, "");
if (basePath.split("/").some(part => part === "." || part === "..")) {
  throw new Error("SITE_BASE_PATH cannot contain . or .. path segments.");
}
const env = { ...process.env, NEXT_PUBLIC_BASE_PATH: basePath, NEXT_TELEMETRY_DISABLED: "1" };
rmSync(path.join(root, "out"), { recursive: true, force: true });
const result = spawnSync(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], { stdio: "inherit", env });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
if (!existsSync("out/index.html")) throw new Error("Static export did not produce out/index.html.");
writeFileSync("out/.nojekyll", "");
// Keep the validator separate so it can also inspect a downloaded deployment.
const check = spawnSync(process.execPath, ["scripts/check-assets.mjs", "out", basePath], { stdio: "inherit", env });
if (check.error) throw check.error;
process.exit(check.status ?? 1);
