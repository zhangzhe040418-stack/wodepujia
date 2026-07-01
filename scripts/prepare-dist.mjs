import { existsSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

const ASSETS = [
  "index.html",
  "app.js",
  "app-v238.js",
  "app-v239.js",
  "app-v241.js",
  "styles.css",
  "styles-v238.css",
  "styles-v239.css",
  "styles-v241.css",
  "piano.css",
  "piano.js",
  "sw.js",
  "manifest.webmanifest",
  "cloudbase-config.js",
  "THIRD_PARTY_NOTICES.md",
  ".nojekyll",
  "assets",
  "icons",
  "vendor",
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);

for (const name of ASSETS) {
  const src = join(root, name);
  if (existsSync(src)) {
    cpSync(src, join(dist, name), { recursive: true });
  } else {
    console.warn(`跳过缺失项：${name}`);
  }
}

console.log("dist 已准备完成。");
