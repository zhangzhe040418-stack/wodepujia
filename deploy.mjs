// 一键部署到 CloudBase 静态托管。
// 用法：node deploy.mjs
// 作用：把站点所需文件归集到 dist/ 暂存目录（排除 .git、README、server.js 等），
//       再通过 CloudBase CLI（tcb）上传到静态托管根目录。
import { existsSync, rmSync, mkdirSync, cpSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");

// 站点运行所需的文件 / 目录白名单（只上传这些，避免泄露 .git 与无关文件）。
const ASSETS = [
  "index.html",
  "app.js",
  "styles.css",
  "sw.js",
  "manifest.webmanifest",
  "cloudbase-config.js",
  ".nojekyll",
  "assets",
  "icons",
  "vendor",
];

// 从 cloudbase-config.js 读取环境 ID，保持单一来源。
const config = readFileSync(join(root, "cloudbase-config.js"), "utf8");
const envId = config.match(/envId:\s*["']([^"']+)["']/)?.[1];
if (!envId) {
  console.error("未能从 cloudbase-config.js 解析出 envId，请检查配置。");
  process.exit(1);
}

// 重建 dist 暂存目录。
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

console.log(`正在部署到 CloudBase 环境：${envId}`);
// envId 仅含字母、数字和连字符，可安全拼入命令。tcb 通过 shell 解析（Windows 上为 tcb.cmd）。
execSync(`tcb hosting deploy ./dist -e ${envId}`, { cwd: root, stdio: "inherit" });
console.log("部署完成。");
