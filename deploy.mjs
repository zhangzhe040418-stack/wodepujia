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
const tcbCommand = process.platform === "win32" ? "tcb.cmd" : "tcb";
const SUCCESS_TEXT = /File deployment successful|Deployment complete/i;

// 站点运行所需的文件 / 目录白名单（只上传这些，避免泄露 .git 与无关文件）。
const ASSETS = [
  "index.html",
  "force-update.html",
  "app.js",
  "app-v238.js",
  "styles.css",
  "styles-v238.css",
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
const copiedAssets = [];
for (const name of ASSETS) {
  const src = join(root, name);
  if (existsSync(src)) {
    cpSync(src, join(dist, name), { recursive: true });
    copiedAssets.push(name);
  } else {
    console.warn(`跳过缺失项：${name}`);
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function runDeployCommand(command) {
  try {
    const output = execSync(command, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    process.stdout.write(output);
    return { ok: true, output };
  } catch (error) {
    const output = `${error.stdout || ""}${error.stderr || ""}`;
    if (output) {
      process.stdout.write(output);
    }

    // CloudBase CLI 有时已经完成上传，但后续 DescribeStaticStore 查询因为 TLS 断开而退出 1。
    // 看到成功文本时按成功处理，避免重复卡死。
    if (SUCCESS_TEXT.test(output)) {
      return { ok: true, output };
    }

    return { ok: false, output, error };
  }
}

function deployWithRetry(localPath, remotePath, attempts = 5) {
  const command = remotePath
    ? `${tcbCommand} hosting deploy ${localPath} ${remotePath} -e ${envId}`
    : `${tcbCommand} hosting deploy ${localPath} -e ${envId}`;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    console.log(`\n部署 ${remotePath || localPath}（第 ${attempt}/${attempts} 次）`);
    const result = runDeployCommand(command);
    if (result.ok) {
      return true;
    }
    if (attempt < attempts) {
      console.warn("本次上传未成功，3 秒后自动重试...");
      sleep(3000);
    }
  }

  return false;
}

console.log(`正在部署到 CloudBase 环境：${envId}`);
// envId 仅含字母、数字和连字符，可安全拼入命令。tcb 通过 shell 解析（Windows 上为 tcb.cmd）。
if (deployWithRetry("./dist", "", 2)) {
  console.log("部署完成。");
  process.exit(0);
}

console.warn("\n整包部署失败，改为逐项上传，降低网络中断影响。");
for (const name of copiedAssets) {
  const localPath = `./dist/${name}`;
  if (!deployWithRetry(localPath, name, 6)) {
    console.error(`部署失败：${name}`);
    process.exit(1);
  }
}

console.log("部署完成。");
