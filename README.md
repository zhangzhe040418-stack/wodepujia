# 我的谱夹

一个可安装到手机主屏幕的歌谱 App。它支持上传歌谱图片、填写歌谱名、创建文件夹、搜索歌谱并查看图片。

查看歌谱时会进入纯图片全屏模式，默认完整显示整张图片。全屏查看时没有额外按钮，可用双指缩放、拖动查看细节，双击或双点可在放大和还原之间切换。页面本身已禁止手机浏览器的整页缩放。

进入 App 后默认只显示谱夹。点击右下角按钮后，可以选择添加文件夹或添加歌谱；进入文件夹后，右下角按钮会直接添加歌谱。

## 电脑本地预览

直接打开 `index.html` 即可使用基础功能。

也可以启动本地服务器：

```bash
node server.js
```

然后打开 `http://localhost:4173`。

## 公网使用

如果希望手机在任意网络下都能打开，不要继续使用 `localhost` 或电脑局域网 IP。需要把整个项目发布到一个 HTTPS 静态网站。

推荐方式：

1. Vercel：把本文件夹上传到 GitHub，再在 Vercel 导入这个仓库即可。项目已经包含 `vercel.json`。
2. Netlify：把本文件夹上传到 GitHub，再在 Netlify 导入这个仓库即可。项目已经包含 `netlify.toml`。
3. GitHub Pages：把本文件夹推送到 GitHub 仓库，在仓库 Settings -> Pages 中选择部署分支。项目已经包含 `.nojekyll`。

发布成功后，用公网 HTTPS 地址打开，例如 `https://你的站点名.vercel.app`。这个地址在手机移动网络、家里 Wi-Fi、教会 Wi-Fi 等任意网络中都可以访问。

## Supabase 登录与同步

当前代码已经预留账号密码登录、云端同步、图片上传和分享码导入功能。启用步骤：

1. 在 Supabase 新建项目。
2. 打开项目的 SQL Editor，运行 `supabase-schema.sql`。
3. 在 Supabase Authentication 里开启 Email 登录方式。
4. 打开 `supabase-config.js`，填写项目 URL 和 anon key：

```js
window.MY_SCORE_FOLDER_SUPABASE = {
  url: "https://你的项目.supabase.co",
  anonKey: "你的 anon public key",
  storageBucket: "score-pages",
};
```

5. 提交并重新部署到 GitHub Pages。

启用后，用户可以用邮箱和密码注册/登录。登录后，本地歌谱会上传到当前账号；换设备登录同一个账号后，会自动下载该账号的文件夹、歌谱和图片。

分享功能：登录后点击“分享”按钮，选择歌谱生成同步码。其他登录用户输入同步码后，会把分享的歌谱复制到自己的账号中；如果自己账号里已有同名歌谱，会保留自己的歌谱，不导入同名分享歌谱。

## 手机安装

把整个文件夹发布到 HTTPS 网站后，用手机浏览器打开：

1. 安卓 Chrome/Edge：页面出现“安装”按钮时点击安装。
2. iPhone Safari：点分享按钮，再选“添加到主屏幕”。

安装后会像普通 App 一样从桌面打开。应用外壳支持离线加载，歌谱数据保存在当前浏览器或已安装 App 的 IndexedDB 中；只要不清除站点数据，之前保存的歌谱都会保留。

注意：没有填写 Supabase 配置时，App 会继续以本地离线模式运行。填写并部署 Supabase 配置后，才会启用账号登录和多设备同步。
