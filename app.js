const DB_NAME = "my-score-folder";
const DB_VERSION = 3;
const STORE_NAME = "scores";
const FOLDER_STORE_NAME = "folders";
const PAGE_STORE_NAME = "score_pages";
const SYNC_STATUS_LOCAL = "local";
const SYNC_STATUS_PENDING = "pending";
const SYNC_STATUS_SYNCED = "synced";
const CLOUD_TABLES = {
  folders: "folders",
  scores: "scores",
  pages: "score_pages",
  shareBatches: "share_batches",
  shareItems: "share_items",
};
const VIEWER_MIN_ZOOM = 1;
const VIEWER_MAX_ZOOM = 4;
const VIEWER_DOUBLE_TAP_ZOOM = 2;
const VIEWER_TAP_MAX_DISTANCE = 10;
const VIEWER_DOUBLE_TAP_DELAY = 320;
const IMAGE_MAX_EDGE = 1800;
const IMAGE_WEBP_QUALITY = 0.78;
const IMAGE_JPEG_QUALITY = 0.82;

const state = {
  db: null,
  cloudApp: null,
  cloudAuth: null,
  cloudDb: null,
  session: null,
  cloudReady: false,
  syncing: false,
  scores: [],
  scorePages: [],
  folders: [],
  pendingPages: [],
  scoreUrls: new Map(),
  pendingUrls: new Map(),
  installPrompt: null,
  addScreenOpen: false,
  currentFolderId: null,
  appTouchY: 0,
  deleteDialogResolve: null,
  verifyDialogResolve: null,
  viewerZoom: VIEWER_MIN_ZOOM,
  viewerPointers: new Map(),
  viewerPinchStartDistance: 0,
  viewerPinchStartZoom: VIEWER_MIN_ZOOM,
  viewerDrag: null,
  viewerTapStart: null,
  viewerLastTap: null,
  viewerHistoryActive: false,
};

const elements = {};

document.addEventListener("DOMContentLoaded", async () => {
  bindElements();
  bindEvents();
  registerServiceWorker();
  renderPending();
  refreshIcons();

  try {
    state.db = await openDatabase();
    initializeCloud();
    await loadScores();
    await restoreCloudSession();
    setStatus("");
  } catch (error) {
    console.error(error);
    setStatus("本地谱夹读取失败，请确认浏览器允许本地存储。", true);
  }
});

function bindElements() {
  elements.appShell = document.querySelector(".app-shell");
  elements.librarySummary = document.querySelector("#librarySummary");
  elements.libraryScreen = document.querySelector("#libraryScreen");
  elements.libraryTitle = document.querySelector("#libraryTitle");
  elements.folderBackButton = document.querySelector("#folderBackButton");
  elements.uploadScreen = document.querySelector("#uploadScreen");
  elements.resultCount = document.querySelector("#resultCount");
  elements.scoreGrid = document.querySelector("#scoreGrid");
  elements.searchInput = document.querySelector("#searchInput");
  elements.clearSearchButton = document.querySelector("#clearSearchButton");
  elements.exportDataButton = document.querySelector("#exportDataButton");
  elements.importDataButton = document.querySelector("#importDataButton");
  elements.backupInput = document.querySelector("#backupInput");
  elements.syncNowButton = document.querySelector("#syncNowButton");
  elements.shareScoresButton = document.querySelector("#shareScoresButton");
  elements.importShareButton = document.querySelector("#importShareButton");
  elements.accountButton = document.querySelector("#accountButton");
  elements.accountButtonText = document.querySelector("#accountButtonText");
  elements.authDialog = document.querySelector("#authDialog");
  elements.authForm = document.querySelector("#authForm");
  elements.authEmail = document.querySelector("#authEmail");
  elements.authPassword = document.querySelector("#authPassword");
  elements.authState = document.querySelector("#authState");
  elements.closeAuthButton = document.querySelector("#closeAuthButton");
  elements.signOutButton = document.querySelector("#signOutButton");
  elements.signUpButton = document.querySelector("#signUpButton");
  elements.signInButton = document.querySelector("#signInButton");
  elements.verifyDialog = document.querySelector("#verifyDialog");
  elements.verifyForm = document.querySelector("#verifyForm");
  elements.verifyState = document.querySelector("#verifyState");
  elements.verifyCodeInput = document.querySelector("#verifyCodeInput");
  elements.cancelVerifyButton = document.querySelector("#cancelVerifyButton");
  elements.closeVerifyButton = document.querySelector("#closeVerifyButton");
  elements.confirmVerifyButton = document.querySelector("#confirmVerifyButton");
  elements.shareDialog = document.querySelector("#shareDialog");
  elements.shareForm = document.querySelector("#shareForm");
  elements.shareList = document.querySelector("#shareList");
  elements.shareCodePanel = document.querySelector("#shareCodePanel");
  elements.shareCodeText = document.querySelector("#shareCodeText");
  elements.closeShareButton = document.querySelector("#closeShareButton");
  elements.createShareButton = document.querySelector("#createShareButton");
  elements.importShareDialog = document.querySelector("#importShareDialog");
  elements.importShareForm = document.querySelector("#importShareForm");
  elements.shareCodeInput = document.querySelector("#shareCodeInput");
  elements.closeImportShareButton = document.querySelector("#closeImportShareButton");
  elements.importShareSubmitButton = document.querySelector("#importShareSubmitButton");
  elements.installAppButton = document.querySelector("#installAppButton");
  elements.addScoreButton = document.querySelector("#addScoreButton");
  elements.addChoiceDialog = document.querySelector("#addChoiceDialog");
  elements.chooseFolderButton = document.querySelector("#chooseFolderButton");
  elements.chooseScoreButton = document.querySelector("#chooseScoreButton");
  elements.folderDialog = document.querySelector("#folderDialog");
  elements.folderForm = document.querySelector("#folderForm");
  elements.folderName = document.querySelector("#folderName");
  elements.cancelFolderButton = document.querySelector("#cancelFolderButton");
  elements.saveFolderButton = document.querySelector("#saveFolderButton");
  elements.closeAddButton = document.querySelector("#closeAddButton");
  elements.scoreForm = document.querySelector("#scoreForm");
  elements.scoreName = document.querySelector("#scoreName");
  elements.cameraButton = document.querySelector("#cameraButton");
  elements.galleryButton = document.querySelector("#galleryButton");
  elements.fileButton = document.querySelector("#fileButton");
  elements.cameraInput = document.querySelector("#cameraInput");
  elements.galleryInput = document.querySelector("#galleryInput");
  elements.fileInput = document.querySelector("#fileInput");
  elements.pendingArea = document.querySelector("#pendingArea");
  elements.saveButton = document.querySelector("#saveButton");
  elements.resetFormButton = document.querySelector("#resetFormButton");
  elements.statusMessage = document.querySelector("#statusMessage");
  elements.deleteDialog = document.querySelector("#deleteDialog");
  elements.deleteDialogMessage = document.querySelector("#deleteDialogMessage");
  elements.cancelDeleteButton = document.querySelector("#cancelDeleteButton");
  elements.confirmDeleteButton = document.querySelector("#confirmDeleteButton");
  elements.viewerDialog = document.querySelector("#viewerDialog");
  elements.viewerPages = document.querySelector("#viewerPages");
}

function bindEvents() {
  elements.appShell.addEventListener("touchstart", handleAppTouchStart, { passive: true });
  elements.appShell.addEventListener("touchmove", handleAppTouchMove, { passive: false });
  elements.cameraButton.addEventListener("click", () => openFilePicker(elements.cameraInput));
  elements.galleryButton.addEventListener("click", () => openFilePicker(elements.galleryInput));
  elements.fileButton.addEventListener("click", () => openFilePicker(elements.fileInput));

  [elements.cameraInput, elements.galleryInput, elements.fileInput].forEach((input) => {
    input.addEventListener("change", () => addPendingFiles(input.files));
  });

  elements.scoreName.addEventListener("input", updateSaveState);
  elements.searchInput.addEventListener("input", renderScores);
  elements.clearSearchButton.addEventListener("click", () => {
    elements.searchInput.value = "";
    renderScores();
    elements.searchInput.blur();
  });
  elements.exportDataButton.addEventListener("click", exportBackup);
  elements.importDataButton.addEventListener("click", openBackupPicker);
  elements.backupInput.addEventListener("change", importBackupFile);
  elements.syncNowButton.addEventListener("click", () => syncNow({ manual: true }));
  elements.accountButton.addEventListener("click", openAuthDialog);
  elements.closeAuthButton.addEventListener("click", closeAuthDialog);
  elements.authForm.addEventListener("submit", signInWithPassword);
  elements.signUpButton.addEventListener("click", signUpWithPassword);
  elements.signOutButton.addEventListener("click", signOut);
  elements.verifyForm.addEventListener("submit", submitVerificationCode);
  elements.cancelVerifyButton.addEventListener("click", () => closeVerifyDialog(""));
  elements.closeVerifyButton.addEventListener("click", () => closeVerifyDialog(""));
  elements.verifyDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeVerifyDialog("");
  });
  elements.authDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeAuthDialog();
  });
  elements.shareScoresButton.addEventListener("click", openShareDialog);
  elements.closeShareButton.addEventListener("click", closeShareDialog);
  elements.shareDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeShareDialog();
  });
  elements.shareForm.addEventListener("submit", createShareCode);
  elements.importShareButton.addEventListener("click", openImportShareDialog);
  elements.closeImportShareButton.addEventListener("click", closeImportShareDialog);
  elements.importShareDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeImportShareDialog();
  });
  elements.importShareForm.addEventListener("submit", importSharedScores);
  elements.installAppButton.addEventListener("click", installApp);
  elements.addScoreButton.addEventListener("click", handleAddButtonClick);
  elements.folderBackButton.addEventListener("click", openRootFolder);
  elements.chooseScoreButton.addEventListener("click", () => {
    closeAddChoiceDialog();
    openAddScreen();
  });
  elements.chooseFolderButton.addEventListener("click", () => {
    closeAddChoiceDialog();
    openFolderDialog();
  });
  elements.addChoiceDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeAddChoiceDialog();
  });
  elements.addChoiceDialog.addEventListener("click", (event) => {
    if (event.target === elements.addChoiceDialog) {
      closeAddChoiceDialog();
    }
  });
  elements.folderForm.addEventListener("submit", createFolder);
  elements.cancelFolderButton.addEventListener("click", closeFolderDialog);
  elements.folderDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeFolderDialog();
  });
  elements.folderDialog.addEventListener("click", (event) => {
    if (event.target === elements.folderDialog) {
      closeFolderDialog();
    }
  });
  elements.closeAddButton.addEventListener("click", closeAddScreen);

  elements.scoreForm.addEventListener("submit", saveScore);
  elements.resetFormButton.addEventListener("click", resetForm);
  elements.viewerPages.addEventListener("wheel", handleViewerWheel, { passive: false });
  elements.viewerPages.addEventListener("pointerdown", handleViewerPointerDown);
  elements.viewerPages.addEventListener("pointermove", handleViewerPointerMove);
  elements.viewerPages.addEventListener("pointerup", handleViewerPointerEnd);
  elements.viewerPages.addEventListener("pointercancel", handleViewerPointerEnd);
  elements.viewerDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeViewer();
  });
  elements.cancelDeleteButton.addEventListener("click", () => closeDeleteDialog(false));
  elements.confirmDeleteButton.addEventListener("click", () => closeDeleteDialog(true));
  elements.deleteDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDeleteDialog(false);
  });
  elements.deleteDialog.addEventListener("click", (event) => {
    if (event.target === elements.deleteDialog) {
      closeDeleteDialog(false);
    }
  });

  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("dragstart", handleDragStart);
  window.addEventListener("beforeunload", revokeAllUrls);
  window.addEventListener("popstate", () => {
    if (state.viewerHistoryActive) {
      closeViewer({ fromHistory: true });
    }
  });
  ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
    document.addEventListener(eventName, preventBrowserZoom, { passive: false });
  });
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.installPrompt = event;
    elements.installAppButton.hidden = false;
    refreshIcons();
  });
  window.addEventListener("appinstalled", () => {
    state.installPrompt = null;
    elements.installAppButton.hidden = true;
    setStatus("已安装到手机。");
  });
}

function preventBrowserZoom(event) {
  event.preventDefault();
}

function handleContextMenu(event) {
  if (!isEditableElement(event.target)) {
    event.preventDefault();
  }
}

function handleDragStart(event) {
  if (event.target instanceof Element && event.target.closest("img")) {
    event.preventDefault();
  }
}

function isEditableElement(target) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function handleAppTouchStart(event) {
  state.appTouchY = event.touches[0]?.clientY || 0;
}

function handleAppTouchMove(event) {
  if (elements.viewerDialog.open || event.touches.length !== 1) {
    return;
  }

  const scroller = elements.appShell;
  const currentY = event.touches[0].clientY;
  const deltaY = currentY - state.appTouchY;
  const atTop = scroller.scrollTop <= 0;
  const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;

  if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
    event.preventDefault();
  }
}

function handleAddButtonClick() {
  if (state.currentFolderId) {
    openAddScreen();
    return;
  }

  openAddChoiceDialog();
}

function openAddChoiceDialog() {
  if (typeof elements.addChoiceDialog.showModal === "function") {
    elements.addChoiceDialog.showModal();
  } else {
    elements.addChoiceDialog.setAttribute("open", "");
  }

  refreshIcons();
  requestAnimationFrame(() => elements.chooseScoreButton.focus());
}

function closeAddChoiceDialog() {
  if (elements.addChoiceDialog.open) {
    elements.addChoiceDialog.close();
  } else {
    elements.addChoiceDialog.removeAttribute("open");
  }
}

function openFolderDialog() {
  elements.folderForm.reset();

  if (typeof elements.folderDialog.showModal === "function") {
    elements.folderDialog.showModal();
  } else {
    elements.folderDialog.setAttribute("open", "");
  }

  refreshIcons();
  requestAnimationFrame(() => elements.folderName.focus());
}

function closeFolderDialog() {
  if (elements.folderDialog.open) {
    elements.folderDialog.close();
  } else {
    elements.folderDialog.removeAttribute("open");
  }

  elements.folderForm.reset();
  elements.saveFolderButton.disabled = false;
}

function initializeCloud() {
  const config = window.MY_SCORE_FOLDER_CLOUDBASE || {};
  const envId = String(config.envId || config.env || "").trim();

  if (!envId || !window.cloudbase?.init) {
    state.cloudReady = false;
    updateAccountUi();
    return;
  }

  try {
    const initOptions = { env: envId };
    if (config.region) {
      initOptions.region = config.region;
    }

    state.cloudApp = window.cloudbase.init(initOptions);
    state.cloudAuth = state.cloudApp.auth({ persistence: config.persistence || "local" });
    state.cloudDb = state.cloudApp.database();
    state.cloudReady = true;

    if (typeof state.cloudAuth.onLoginStateChanged === "function") {
      state.cloudAuth.onLoginStateChanged(async (loginState) => {
        state.session = await createCloudSession(loginState);
        updateAccountUi();
        await loadScores();
        if (state.session) {
          await claimLocalRecordsForUser(state.session.user.id);
          await syncNow();
        }
      });
    }
  } catch (error) {
    console.error(error);
    state.cloudReady = false;
  }

  updateAccountUi();
}

async function restoreCloudSession() {
  if (!state.cloudReady) {
    updateAccountUi();
    return;
  }

  try {
    const loginState =
      typeof state.cloudAuth.getLoginState === "function"
        ? await state.cloudAuth.getLoginState()
        : state.cloudAuth.hasLoginState?.();
    state.session = await createCloudSession(loginState);
  } catch (error) {
    console.error(error);
    updateAccountUi();
    return;
  }

  updateAccountUi();
  await loadScores();
  if (state.session) {
    await claimLocalRecordsForUser(state.session.user.id);
    await syncNow();
  }
}

async function createCloudSession(loginState, fallbackEmail = "") {
  const directSession = normalizeCloudSession(loginState, fallbackEmail);
  if (directSession) {
    return directSession;
  }

  const candidates = [];

  if (loginState && typeof loginState.getUserInfo === "function") {
    try {
      candidates.push(await loginState.getUserInfo());
    } catch (error) {
      console.warn(error);
    }
  }

  if (state.cloudAuth) {
    if (typeof state.cloudAuth.getCurrentUser === "function") {
      try {
        candidates.push(await state.cloudAuth.getCurrentUser());
      } catch (error) {
        console.warn(error);
      }
    }

    if (typeof state.cloudAuth.getUserInfo === "function") {
      try {
        candidates.push(await state.cloudAuth.getUserInfo());
      } catch (error) {
        console.warn(error);
      }
    }

    candidates.push(state.cloudAuth.currentUser);
  }

  for (const candidate of candidates) {
    const session = normalizeCloudSession(candidate, fallbackEmail);
    if (session) {
      return session;
    }
  }

  return null;
}

function normalizeCloudSession(source, fallbackEmail = "") {
  const user = extractCloudUser(source);
  if (!user) {
    return null;
  }

  const id =
    user.uid ||
    user.uuid ||
    user.userId ||
    user.user_id ||
    user._id ||
    user.openId ||
    user.openid ||
    user.email ||
    user.username ||
    fallbackEmail;

  if (!id) {
    return null;
  }

  const email = user.email || user.username || user.loginName || fallbackEmail || "";
  return {
    user: {
      id: String(id),
      email: email ? String(email) : String(id),
    },
  };
}

function extractCloudUser(source) {
  if (!source || typeof source !== "object") {
    return null;
  }

  const candidates = [
    source.user,
    source.userInfo,
    source.userinfo,
    source.data?.user,
    source.data?.userInfo,
    source.data?.userinfo,
    source.data,
    source,
  ];

  return candidates.find((candidate) => candidate && typeof candidate === "object") || null;
}

function updateAccountUi() {
  const email = state.session?.user?.email;
  elements.accountButtonText.textContent = email ? "已登录" : "登录";
  elements.syncNowButton.disabled = !state.cloudReady || !state.session || state.syncing;
  elements.shareScoresButton.disabled = !state.cloudReady || !state.session;
  elements.importShareButton.disabled = !state.cloudReady || !state.session;

  if (elements.authState) {
    elements.authState.textContent = state.cloudReady
      ? email
        ? `当前账号：${email}`
        : "登录后可以跨设备同步歌谱。"
      : "请先填写 cloudbase-config.js 中的 CloudBase 环境 ID。";
  }

  if (elements.signOutButton) {
    elements.signOutButton.hidden = !email;
  }
}

function requireCloudSession() {
  if (!state.cloudReady) {
    setStatus("请先填写 CloudBase 配置并重新部署。", true);
    openAuthDialog();
    return false;
  }

  if (!state.session) {
    setStatus("请先登录账号。", true);
    openAuthDialog();
    return false;
  }

  return true;
}

function openAuthDialog() {
  updateAccountUi();
  if (typeof elements.authDialog.showModal === "function") {
    elements.authDialog.showModal();
  } else {
    elements.authDialog.setAttribute("open", "");
  }
  refreshIcons();
}

function closeAuthDialog() {
  if (elements.authDialog.open) {
    elements.authDialog.close();
  } else {
    elements.authDialog.removeAttribute("open");
  }
}

async function signInWithPassword(event) {
  event.preventDefault();
  if (!state.cloudReady) {
    updateAccountUi();
    return;
  }

  elements.signInButton.disabled = true;
  try {
    const account = elements.authEmail.value.trim();
    const loginState = await signInCloudWithPassword(account, elements.authPassword.value);
    state.session = await createCloudSession(loginState, account);
    if (!state.session) {
      throw new Error("登录状态读取失败，请重新登录。");
    }
    closeAuthDialog();
    setStatus("已登录，正在同步...");
    await claimLocalRecordsForUser(state.session.user.id);
    await syncNow({ manual: true });
  } catch (error) {
    console.error(error);
    setStatus(error.message || "登录失败，请检查账号密码。", true);
  } finally {
    elements.signInButton.disabled = false;
    updateAccountUi();
  }
}

async function signUpWithPassword() {
  if (!state.cloudReady) {
    updateAccountUi();
    return;
  }

  elements.signUpButton.disabled = true;
  try {
    const account = elements.authEmail.value.trim();
    if (!isEmailAddress(account)) {
      throw new Error("注册时请填写邮箱地址；注册成功后可以用这个邮箱作为账号登录。");
    }

    const signUpResult = await signUpCloudWithEmail(account, elements.authPassword.value);
    const verifyOtp = signUpResult?.data?.verifyOtp;
    if (typeof verifyOtp === "function") {
      const code = await requestVerificationCode(account);
      if (!code) {
        throw new Error("已取消邮箱验证。");
      }
      const verifyResult = await verifyOtp({ token: code });
      throwCloudResultError(verifyResult);
    }

    const loginState = await signInCloudWithPassword(account, elements.authPassword.value);
    state.session = await createCloudSession(loginState, account);
    if (!state.session) {
      throw new Error("注册成功，但登录状态读取失败，请重新登录。");
    }
    setStatus("注册成功，正在同步...");
    closeAuthDialog();
    await claimLocalRecordsForUser(state.session.user.id);
    await syncNow({ manual: true });
  } catch (error) {
    console.error(error);
    setStatus(error.message || "注册失败，请稍后再试。", true);
  } finally {
    elements.signUpButton.disabled = false;
    updateAccountUi();
  }
}

async function signInCloudWithPassword(account, password) {
  if (typeof state.cloudAuth.signIn === "function") {
    return state.cloudAuth.signIn({ username: account, password });
  }

  if (typeof state.cloudAuth.signInWithUsernameAndPassword === "function") {
    return state.cloudAuth.signInWithUsernameAndPassword(account, password);
  }

  return state.cloudAuth.signInWithEmailAndPassword(account, password);
}

async function signUpCloudWithEmail(email, password) {
  const result =
    typeof state.cloudAuth.signUp === "function"
      ? await state.cloudAuth.signUp({ email, password })
      : await state.cloudAuth.signUpWithEmailAndPassword(email, password);
  throwCloudResultError(result);
  return result;
}

function throwCloudResultError(result) {
  if (result?.error) {
    throw result.error;
  }

  if (result?.code && result.code !== "SUCCESS") {
    throw new Error(result.message || result.msg || String(result.code));
  }
}

function isEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requestVerificationCode(account) {
  elements.verifyForm.reset();
  elements.verifyState.textContent = `验证码已发送至 ${account}，请输入验证码完成注册。`;

  if (typeof elements.verifyDialog.showModal === "function") {
    elements.verifyDialog.showModal();
  } else {
    elements.verifyDialog.setAttribute("open", "");
  }

  refreshIcons();
  requestAnimationFrame(() => elements.verifyCodeInput.focus());

  return new Promise((resolve) => {
    state.verifyDialogResolve = resolve;
  });
}

function submitVerificationCode(event) {
  event.preventDefault();
  const code = elements.verifyCodeInput.value.trim();
  if (!code) {
    return;
  }

  closeVerifyDialog(code);
}

function closeVerifyDialog(code) {
  if (elements.verifyDialog.open) {
    elements.verifyDialog.close();
  } else {
    elements.verifyDialog.removeAttribute("open");
  }

  if (state.verifyDialogResolve) {
    state.verifyDialogResolve(code);
    state.verifyDialogResolve = null;
  }
}

async function signOut() {
  if (!state.cloudReady) {
    return;
  }

  await state.cloudAuth.signOut();
  state.session = null;
  closeAuthDialog();
  await loadScores();
  setStatus("已退出登录。");
  updateAccountUi();
}

function openAddScreen() {
  state.addScreenOpen = true;
  elements.libraryScreen.hidden = true;
  elements.uploadScreen.hidden = false;
  elements.addScoreButton.hidden = true;
  document.body.classList.add("add-screen-open");
  refreshIcons();
  requestAnimationFrame(() => {
    elements.scoreName.focus();
  });
}

function closeAddScreen(options = {}) {
  state.addScreenOpen = false;
  elements.uploadScreen.hidden = true;
  elements.libraryScreen.hidden = false;
  elements.addScoreButton.hidden = false;
  document.body.classList.remove("add-screen-open");

  if (options.resetForm) {
    resetForm(false);
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    return;
  }

  try {
    await navigator.serviceWorker.register("./sw.js");
  } catch (error) {
    console.warn("Service worker registration failed.", error);
  }
}

async function installApp() {
  if (!state.installPrompt) {
    return;
  }

  const promptEvent = state.installPrompt;
  state.installPrompt = null;
  elements.installAppButton.hidden = true;
  promptEvent.prompt();

  const choice = await promptEvent.userChoice;
  if (choice.outcome !== "accepted") {
    setStatus("可以稍后再安装。");
  }
}

function setViewerZoom(value, options = {}) {
  const previousZoom = state.viewerZoom;
  const nextZoom = clamp(value, VIEWER_MIN_ZOOM, VIEWER_MAX_ZOOM);
  const anchor = getViewerZoomAnchor(options.centerPoint);

  state.viewerZoom = Math.round(nextZoom * 100) / 100;
  elements.viewerPages.style.setProperty("--viewer-zoom", state.viewerZoom);
  elements.viewerPages.classList.toggle("is-zoomed", state.viewerZoom > VIEWER_MIN_ZOOM);

  if (anchor && previousZoom > 0 && previousZoom !== state.viewerZoom) {
    applyViewerZoomAnchor(anchor);
  }
}

function getViewerZoomAnchor(centerPoint) {
  const container = elements.viewerPages;
  const rect = container.getBoundingClientRect();
  const offsetX = centerPoint ? centerPoint.x - rect.left : container.clientWidth / 2;
  const offsetY = centerPoint ? centerPoint.y - rect.top : container.clientHeight / 2;
  const anchorElement = getViewerAnchorElement(centerPoint, rect);

  if (anchorElement) {
    const elementRect = anchorElement.getBoundingClientRect();

    if (elementRect.width > 0 && elementRect.height > 0) {
      const pointX = centerPoint ? centerPoint.x : rect.left + offsetX;
      const pointY = centerPoint ? centerPoint.y : rect.top + offsetY;

      return {
        type: "element",
        element: anchorElement,
        ratioX: clamp((pointX - elementRect.left) / elementRect.width, 0, 1),
        ratioY: clamp((pointY - elementRect.top) / elementRect.height, 0, 1),
        offsetX,
        offsetY,
      };
    }
  }

  return {
    type: "content",
    x: container.scrollLeft + offsetX,
    y: container.scrollTop + offsetY,
    offsetX,
    offsetY,
    scrollWidth: Math.max(container.scrollWidth, 1),
    scrollHeight: Math.max(container.scrollHeight, 1),
  };
}

function getViewerAnchorElement(centerPoint, containerRect) {
  const fallbackPoint = {
    x: containerRect.left + containerRect.width / 2,
    y: containerRect.top + containerRect.height / 2,
  };
  const point = centerPoint || fallbackPoint;
  const element = document.elementFromPoint(point.x, point.y)?.closest(".viewer-image-frame img");

  if (element && elements.viewerPages.contains(element)) {
    return element;
  }

  return null;
}

function applyViewerZoomAnchor(anchor) {
  const container = elements.viewerPages;

  if (anchor.type === "element" && anchor.element.isConnected) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = anchor.element.getBoundingClientRect();
    const targetX = container.scrollLeft + elementRect.left - containerRect.left + elementRect.width * anchor.ratioX;
    const targetY = container.scrollTop + elementRect.top - containerRect.top + elementRect.height * anchor.ratioY;

    container.scrollLeft = targetX - anchor.offsetX;
    container.scrollTop = targetY - anchor.offsetY;
    return;
  }

  container.scrollLeft = anchor.x * (container.scrollWidth / anchor.scrollWidth) - anchor.offsetX;
  container.scrollTop = anchor.y * (container.scrollHeight / anchor.scrollHeight) - anchor.offsetY;
}

function resetViewerZoom() {
  setViewerZoom(VIEWER_MIN_ZOOM);
  requestAnimationFrame(() => {
    elements.viewerPages.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  });
}

function handleViewerWheel(event) {
  if (!elements.viewerDialog.open || (!event.ctrlKey && !event.metaKey)) {
    return;
  }

  event.preventDefault();
  const direction = event.deltaY > 0 ? -1 : 1;
  setViewerZoom(state.viewerZoom + direction * 0.15, {
    centerPoint: {
      x: event.clientX,
      y: event.clientY,
    },
  });
}

function handleViewerPointerDown(event) {
  if (!elements.viewerDialog.open || !event.target.closest(".viewer-pages")) {
    return;
  }

  state.viewerPointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
  });

  if (state.viewerPointers.size === 2) {
    event.preventDefault();
    state.viewerTapStart = null;
    state.viewerDrag = null;
    state.viewerPinchStartDistance = getViewerPointerDistance();
    state.viewerPinchStartZoom = state.viewerZoom;
    elements.viewerPages.classList.add("is-pinching");
    state.viewerPointers.forEach((_, pointerId) => captureViewerPointer(pointerId));
    return;
  }

  if (state.viewerPointers.size === 1) {
    state.viewerTapStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };

    if (state.viewerZoom > VIEWER_MIN_ZOOM) {
      captureViewerPointer(event.pointerId);
      state.viewerDrag = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        scrollLeft: elements.viewerPages.scrollLeft,
        scrollTop: elements.viewerPages.scrollTop,
      };
      elements.viewerPages.classList.add("is-dragging");
    }
  }
}

function handleViewerPointerMove(event) {
  if (!state.viewerPointers.has(event.pointerId)) {
    return;
  }

  state.viewerPointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
  });

  if (state.viewerPointers.size === 2 && state.viewerPinchStartDistance > 0) {
    event.preventDefault();
    const distance = getViewerPointerDistance();
    const ratio = distance / state.viewerPinchStartDistance;
    const center = getViewerPointerCenter();
    setViewerZoom(state.viewerPinchStartZoom * ratio, { centerPoint: center });
    return;
  }

  if (state.viewerTapStart?.pointerId === event.pointerId) {
    const movedDistance = Math.hypot(event.clientX - state.viewerTapStart.x, event.clientY - state.viewerTapStart.y);
    if (movedDistance > VIEWER_TAP_MAX_DISTANCE) {
      state.viewerTapStart.moved = true;
    }
  }

  if (state.viewerDrag?.pointerId === event.pointerId && state.viewerZoom > VIEWER_MIN_ZOOM) {
    event.preventDefault();
    elements.viewerPages.scrollLeft = state.viewerDrag.scrollLeft - (event.clientX - state.viewerDrag.x);
    elements.viewerPages.scrollTop = state.viewerDrag.scrollTop - (event.clientY - state.viewerDrag.y);
  }
}

function handleViewerPointerEnd(event) {
  const tapStart = state.viewerTapStart;
  state.viewerPointers.delete(event.pointerId);

  try {
    elements.viewerPages.releasePointerCapture(event.pointerId);
  } catch (error) {
    // Pointer capture may already be released by the browser.
  }

  if (state.viewerDrag?.pointerId === event.pointerId) {
    state.viewerDrag = null;
    elements.viewerPages.classList.remove("is-dragging");
  }

  if (tapStart?.pointerId === event.pointerId && !tapStart.moved && state.viewerPinchStartDistance === 0) {
    handleViewerTap(event);
  }

  if (tapStart?.pointerId === event.pointerId) {
    state.viewerTapStart = null;
  }

  if (state.viewerPointers.size < 2) {
    state.viewerPinchStartDistance = 0;
    elements.viewerPages.classList.remove("is-pinching");
  }
}

function handleViewerTap(event) {
  const now = Date.now();
  const lastTap = state.viewerLastTap;
  const isDoubleTap =
    lastTap &&
    now - lastTap.time < VIEWER_DOUBLE_TAP_DELAY &&
    Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 36;

  if (isDoubleTap) {
    state.viewerLastTap = null;
    toggleViewerZoom(event.clientX, event.clientY);
    return;
  }

  state.viewerLastTap = {
    time: now,
    x: event.clientX,
    y: event.clientY,
  };
}

function toggleViewerZoom(x, y) {
  if (state.viewerZoom > VIEWER_MIN_ZOOM) {
    resetViewerZoom();
    return;
  }

  setViewerZoom(VIEWER_DOUBLE_TAP_ZOOM, {
    centerPoint: { x, y },
  });
}

function getViewerPointerDistance() {
  const pointers = Array.from(state.viewerPointers.values());
  if (pointers.length < 2) {
    return 0;
  }

  return Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y);
}

function getViewerPointerCenter() {
  const pointers = Array.from(state.viewerPointers.values());
  if (pointers.length < 2) {
    return null;
  }

  return {
    x: (pointers[0].x + pointers[1].x) / 2,
    y: (pointers[0].y + pointers[1].y) / 2,
  };
}

function captureViewerPointer(pointerId) {
  try {
    elements.viewerPages.setPointerCapture(pointerId);
  } catch (error) {
    // Pointer capture is unavailable for some synthetic events.
  }
}

function openFilePicker(input) {
  input.value = "";
  input.click();
}

function openBackupPicker() {
  elements.backupInput.value = "";
  elements.backupInput.click();
}

async function loadScores() {
  const [scoreRecords, pageRecords, folders] = await Promise.all([getAllScores(), getAllScorePages(), getAllFolders()]);
  const migrated = await migrateNestedScorePages(scoreRecords);
  const normalizedScores = migrated.map(normalizeLocalScoreRecord);
  const activeUserId = state.session?.user?.id || null;
  const ownerMatches = (record) => (activeUserId ? !record.userId || record.userId === activeUserId : !record.userId);
  const ownedScores = normalizedScores.filter(ownerMatches);
  const ownedScoreIds = new Set(ownedScores.map((score) => score.id));
  const normalizedPages = [...pageRecords, ...migrated.flatMap((score) => score.__migratedPages || [])]
    .map(normalizeLocalPageRecord)
    .filter((page) => !page.deletedAt && ownedScoreIds.has(page.scoreId));

  state.scorePages = normalizedPages;
  state.scores = ownedScores
    .filter((score) => !score.deletedAt)
    .map((score) => ({
      ...score,
      pages: normalizedPages
        .filter((page) => page.scoreId === score.id)
        .sort((a, b) => a.pageIndex - b.pageIndex),
    }));
  state.folders = folders.map(normalizeLocalFolderRecord).filter((folder) => !folder.deletedAt && ownerMatches(folder));
  state.scores.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  state.folders.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (state.currentFolderId && !state.folders.some((folder) => folder.id === state.currentFolderId)) {
    state.currentFolderId = null;
  }

  renderScores();
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      let scoreStore;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        scoreStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
      } else {
        scoreStore = request.transaction.objectStore(STORE_NAME);
      }

      if (!scoreStore.indexNames.contains("normalizedName")) {
        scoreStore.createIndex("normalizedName", "normalizedName", { unique: false });
      }
      if (!scoreStore.indexNames.contains("updatedAt")) {
        scoreStore.createIndex("updatedAt", "updatedAt", { unique: false });
      }
      if (!scoreStore.indexNames.contains("folderId")) {
        scoreStore.createIndex("folderId", "folderId", { unique: false });
      }
      if (!scoreStore.indexNames.contains("userId")) {
        scoreStore.createIndex("userId", "userId", { unique: false });
      }
      if (!scoreStore.indexNames.contains("syncStatus")) {
        scoreStore.createIndex("syncStatus", "syncStatus", { unique: false });
      }

      if (!db.objectStoreNames.contains(FOLDER_STORE_NAME)) {
        const folderStore = db.createObjectStore(FOLDER_STORE_NAME, { keyPath: "id" });
        folderStore.createIndex("normalizedName", "normalizedName", { unique: false });
        folderStore.createIndex("updatedAt", "updatedAt", { unique: false });
        folderStore.createIndex("userId", "userId", { unique: false });
        folderStore.createIndex("syncStatus", "syncStatus", { unique: false });
      } else {
        const folderStore = request.transaction.objectStore(FOLDER_STORE_NAME);
        if (!folderStore.indexNames.contains("userId")) {
          folderStore.createIndex("userId", "userId", { unique: false });
        }
        if (!folderStore.indexNames.contains("syncStatus")) {
          folderStore.createIndex("syncStatus", "syncStatus", { unique: false });
        }
      }

      if (!db.objectStoreNames.contains(PAGE_STORE_NAME)) {
        const pageStore = db.createObjectStore(PAGE_STORE_NAME, { keyPath: "id" });
        pageStore.createIndex("scoreId", "scoreId", { unique: false });
        pageStore.createIndex("userId", "userId", { unique: false });
        pageStore.createIndex("syncStatus", "syncStatus", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function migrateNestedScorePages(scores) {
  const nestedScores = scores.filter((score) => Array.isArray(score.pages));
  if (!nestedScores.length) {
    return scores;
  }

  await new Promise((resolve, reject) => {
    const transaction = state.db.transaction([STORE_NAME, PAGE_STORE_NAME], "readwrite");
    const scoreStore = transaction.objectStore(STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);

    nestedScores.forEach((score) => {
      const pages = score.pages.map((page, index) => ({
        id: page.id || createId(),
        scoreId: score.id,
        userId: score.userId || null,
        pageIndex: index,
        name: page.name || `第 ${index + 1} 页`,
        type: page.type || page.blob?.type || "image/jpeg",
        size: Number(page.size) || page.blob?.size || 0,
        blob: page.blob,
        storagePath: page.storagePath || null,
        createdAt: page.createdAt || score.createdAt || new Date().toISOString(),
        updatedAt: page.updatedAt || score.updatedAt || new Date().toISOString(),
        deletedAt: page.deletedAt || null,
        syncStatus: page.syncStatus || score.syncStatus || SYNC_STATUS_LOCAL,
      }));
      const record = toScoreRecord({
        ...score,
        syncStatus: score.syncStatus || SYNC_STATUS_LOCAL,
      });

      scoreStore.put(record);
      pages.forEach((page) => pageStore.put(page));
      score.__migratedPages = pages;
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });

  return scores.map((score) => {
    if (!Array.isArray(score.pages)) {
      return score;
    }

    return {
      ...toScoreRecord(score),
      __migratedPages: score.__migratedPages || [],
    };
  });
}

function normalizeLocalScoreRecord(score) {
  const name = String(score.name || "未命名歌谱").trim() || "未命名歌谱";

  return {
    ...score,
    id: String(score.id || createId()),
    userId: score.userId || null,
    folderId: score.folderId || null,
    name,
    normalizedName: normalizeText(score.normalizedName || name),
    createdAt: score.createdAt || new Date().toISOString(),
    updatedAt: score.updatedAt || score.createdAt || new Date().toISOString(),
    deletedAt: score.deletedAt || null,
    syncStatus: score.syncStatus || SYNC_STATUS_LOCAL,
    storageSyncedAt: score.storageSyncedAt || null,
  };
}

function normalizeLocalFolderRecord(folder) {
  const name = String(folder.name || "未命名文件夹").trim() || "未命名文件夹";

  return {
    ...folder,
    id: String(folder.id || createId()),
    userId: folder.userId || null,
    name,
    normalizedName: normalizeText(folder.normalizedName || name),
    createdAt: folder.createdAt || new Date().toISOString(),
    updatedAt: folder.updatedAt || folder.createdAt || new Date().toISOString(),
    deletedAt: folder.deletedAt || null,
    syncStatus: folder.syncStatus || SYNC_STATUS_LOCAL,
  };
}

function normalizeLocalPageRecord(page) {
  return {
    ...page,
    id: String(page.id || createId()),
    scoreId: String(page.scoreId || ""),
    userId: page.userId || null,
    pageIndex: Number.isInteger(page.pageIndex) ? page.pageIndex : 0,
    name: page.name || "歌谱图片",
    type: page.type || page.blob?.type || "image/jpeg",
    size: Number(page.size) || page.blob?.size || 0,
    blob: page.blob,
    storagePath: page.storagePath || null,
    createdAt: page.createdAt || new Date().toISOString(),
    updatedAt: page.updatedAt || page.createdAt || new Date().toISOString(),
    deletedAt: page.deletedAt || null,
    syncStatus: page.syncStatus || SYNC_STATUS_LOCAL,
  };
}

function toScoreRecord(score) {
  const { pages, __migratedPages, ...record } = score;
  return record;
}

function getAllScores() {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function getAllScorePages() {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(PAGE_STORE_NAME, "readonly");
    const request = transaction.objectStore(PAGE_STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function getAllFolders() {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(FOLDER_STORE_NAME, "readonly");
    const request = transaction.objectStore(FOLDER_STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function putScore(score) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(STORE_NAME, "readwrite");
    const request = transaction.objectStore(STORE_NAME).put(toScoreRecord(score));
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function putScoreWithPages(score, pages) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction([STORE_NAME, PAGE_STORE_NAME], "readwrite");
    const scoreStore = transaction.objectStore(STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);

    scoreStore.put(toScoreRecord(score));
    pages.forEach((page, index) => {
      pageStore.put({
        ...page,
        scoreId: score.id,
        pageIndex: Number.isInteger(page.pageIndex) ? page.pageIndex : index,
      });
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function putFolder(folder) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(FOLDER_STORE_NAME, "readwrite");
    const request = transaction.objectStore(FOLDER_STORE_NAME).put(folder);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function putImportedRecords(folders, scores) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction([FOLDER_STORE_NAME, STORE_NAME, PAGE_STORE_NAME], "readwrite");
    const folderStore = transaction.objectStore(FOLDER_STORE_NAME);
    const scoreStore = transaction.objectStore(STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);

    folders.forEach((folder) => folderStore.put(folder));
    scores.forEach((score) => {
      scoreStore.put(toScoreRecord(score));
      (score.pages || []).forEach((page, index) => {
        pageStore.put({
          ...page,
          scoreId: score.id,
          pageIndex: Number.isInteger(page.pageIndex) ? page.pageIndex : index,
        });
      });
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function deleteScoreRecord(id) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction([STORE_NAME, PAGE_STORE_NAME], "readwrite");
    const scoreStore = transaction.objectStore(STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);
    const pageIndex = pageStore.index("scoreId");
    const scoreRequest = scoreStore.delete(id);
    const pageRequest = pageIndex.getAllKeys(id);

    pageRequest.onsuccess = () => {
      pageRequest.result.forEach((key) => pageStore.delete(key));
    };
    scoreRequest.onerror = () => reject(scoreRequest.error);
    pageRequest.onerror = () => reject(pageRequest.error);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function addPendingFiles(fileList) {
  const files = Array.from(fileList || []);
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  if (!imageFiles.length) {
    setStatus("请选择图片文件。", true);
    return;
  }

  setStatus(`正在压缩 ${imageFiles.length} 张图片...`);

  for (const file of imageFiles) {
    const compressed = await compressImageFile(file);
    state.pendingPages.push({
      id: createId(),
      name: file.name,
      originalSize: file.size,
      type: compressed.type || file.type || "image/jpeg",
      size: compressed.size,
      blob: compressed,
    });
  }

  if (imageFiles.length !== files.length) {
    setStatus(`已压缩 ${imageFiles.length} 张图片，并跳过非图片文件。`, true);
  } else {
    setStatus(`已压缩并选择 ${state.pendingPages.length} 张图片。`);
  }

  renderPending();
  updateSaveState();
}

async function compressImageFile(file) {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });

    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const webpBlob = await canvasToBlob(canvas, "image/webp", IMAGE_WEBP_QUALITY);
    if (webpBlob && webpBlob.size < file.size) {
      return createCompressedFile(webpBlob, file.name, "webp");
    }

    const jpegBlob = await canvasToBlob(canvas, "image/jpeg", IMAGE_JPEG_QUALITY);
    if (jpegBlob && jpegBlob.size < file.size) {
      return createCompressedFile(jpegBlob, file.name, "jpg");
    }
  } catch (error) {
    console.warn("Image compression failed, using original file.", error);
  }

  return file;
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function createCompressedFile(blob, originalName, extension) {
  const baseName = originalName.replace(/\.[^.]+$/, "") || "score-page";
  return new File([blob], `${baseName}.${extension}`, {
    type: blob.type,
    lastModified: Date.now(),
  });
}

function renderPending() {
  clearPendingUrls();
  elements.pendingArea.replaceChildren();

  if (!state.pendingPages.length) {
    const empty = document.createElement("div");
    empty.className = "pending-empty";
    empty.textContent = "等待选择图片";
    elements.pendingArea.append(empty);
    updateSaveState();
    return;
  }

  state.pendingPages.forEach((page, index) => {
    const row = document.createElement("div");
    row.className = "pending-row";

    const thumb = document.createElement("div");
    thumb.className = "pending-thumb";
    const img = document.createElement("img");
    img.draggable = false;
    img.src = getPendingUrl(page);
    img.alt = `待保存第 ${index + 1} 页`;
    thumb.append(img);

    const text = document.createElement("div");
    const title = document.createElement("p");
    title.className = "pending-title";
    title.textContent = page.name || `第 ${index + 1} 页`;
    const meta = document.createElement("p");
    meta.className = "pending-meta";
    meta.textContent = `${index + 1} / ${state.pendingPages.length} · ${formatCompressionMeta(page)}`;
    text.append(title, meta);

    const removeButton = document.createElement("button");
    removeButton.className = "icon-button";
    removeButton.type = "button";
    removeButton.title = "移除图片";
    removeButton.setAttribute("aria-label", "移除图片");
    removeButton.append(createIcon("trash-2"));
    removeButton.addEventListener("click", () => {
      revokePendingUrl(page.id);
      state.pendingPages = state.pendingPages.filter((item) => item.id !== page.id);
      renderPending();
      updateSaveState();
    });

    row.append(thumb, text, removeButton);
    elements.pendingArea.append(row);
  });

  refreshIcons();
}

async function saveScore(event) {
  event.preventDefault();

  const name = elements.scoreName.value.trim();
  if (!name || !state.pendingPages.length) {
    updateSaveState();
    return;
  }

  const now = new Date().toISOString();
  const userId = state.session?.user?.id || null;
  const score = {
    id: createId(),
    userId,
    name,
    normalizedName: normalizeText(name),
    folderId: state.currentFolderId || null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };
  const pages = state.pendingPages.map((page, index) => ({
    id: page.id,
    scoreId: score.id,
    userId,
    pageIndex: index,
    name: page.name,
    type: page.type,
    size: page.size,
    blob: page.blob,
    storagePath: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  }));

  elements.saveButton.disabled = true;
  setStatus("正在保存...");

    try {
      await putScoreWithPages(score, pages);
      resetForm(false);
      elements.searchInput.value = "";
      await loadScores();
      queueSync();
      closeAddScreen();
      setStatus(`已保存《${name}》。`);
    } catch (error) {
    console.error(error);
    setStatus("保存失败，请稍后再试。", true);
  } finally {
    updateSaveState();
  }
}

async function createFolder(event) {
  event.preventDefault();

  const name = elements.folderName.value.trim();
  if (!name) {
    elements.folderName.focus();
    return;
  }

  const now = new Date().toISOString();
  const userId = state.session?.user?.id || null;
  const folder = {
    id: createId(),
    userId,
    name,
    normalizedName: normalizeText(name),
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };

  elements.saveFolderButton.disabled = true;

  try {
    await putFolder(folder);
    state.currentFolderId = folder.id;
    elements.searchInput.value = "";
    closeFolderDialog();
    await loadScores();
    queueSync();
    elements.appShell.scrollTo({ top: 0 });
  } catch (error) {
    console.error(error);
    elements.saveFolderButton.disabled = false;
  }
}

async function exportBackup() {
  elements.exportDataButton.disabled = true;

  try {
    const backup = {
      app: DB_NAME,
      version: 1,
      exportedAt: new Date().toISOString(),
      folders: state.folders.map((folder) => ({
        id: folder.id,
        name: folder.name,
        normalizedName: folder.normalizedName,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
      })),
      scores: await Promise.all(
        state.scores.map(async (score) => ({
          id: score.id,
          name: score.name,
          normalizedName: score.normalizedName,
          folderId: score.folderId || null,
          createdAt: score.createdAt,
          updatedAt: score.updatedAt,
          pages: await Promise.all(
            score.pages.map(async (page, index) => ({
              id: page.id || createId(),
              name: page.name || `第 ${index + 1} 页`,
              type: page.type || page.blob?.type || "image/jpeg",
              size: page.size || page.blob?.size || 0,
              dataUrl: await blobToDataUrl(page.blob),
            })),
          ),
        })),
      ),
    };

    downloadJsonBackup(backup);
    setStatus("已导出备份文件。");
  } catch (error) {
    console.error(error);
    setStatus("导出失败，请稍后再试。", true);
  } finally {
    elements.exportDataButton.disabled = false;
  }
}

async function importBackupFile(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  elements.importDataButton.disabled = true;
  setStatus("正在导入备份...");

  try {
    const backup = JSON.parse(await file.text());
    const imported = await normalizeBackupData(backup);
    await putImportedRecords(imported.folders, imported.scores);
    revokeAllUrls();
    elements.searchInput.value = "";
    state.currentFolderId = null;
    await loadScores();
    queueSync();
    setStatus(`已导入 ${imported.folders.length} 个文件夹、${imported.scores.length} 份歌谱。`);
  } catch (error) {
    console.error(error);
    setStatus("导入失败，请确认选择的是我的谱夹备份文件。", true);
  } finally {
    elements.backupInput.value = "";
    elements.importDataButton.disabled = false;
  }
}

async function normalizeBackupData(backup) {
  if (!backup || backup.app !== DB_NAME || !Array.isArray(backup.scores)) {
    throw new Error("Invalid backup file.");
  }

  const now = new Date().toISOString();
  const folders = Array.isArray(backup.folders)
    ? backup.folders.map((folder) => normalizeImportedFolder(folder, now))
    : [];
  const knownFolderIds = new Set([...state.folders.map((folder) => folder.id), ...folders.map((folder) => folder.id)]);
  const scores = await Promise.all(
    backup.scores.map((score) => normalizeImportedScore(score, knownFolderIds, now)),
  );

  return {
    folders,
    scores: scores.filter((score) => score.pages.length),
  };
}

function normalizeImportedFolder(folder, now) {
  const name = String(folder?.name || "未命名文件夹").trim() || "未命名文件夹";
  const userId = state.session?.user?.id || null;

  return {
    id: String(folder?.id || createId()),
    userId,
    name,
    normalizedName: normalizeText(folder?.normalizedName || name),
    createdAt: folder?.createdAt || now,
    updatedAt: folder?.updatedAt || folder?.createdAt || now,
    deletedAt: folder?.deletedAt || null,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };
}

async function normalizeImportedScore(score, knownFolderIds, now) {
  const name = String(score?.name || "未命名歌谱").trim() || "未命名歌谱";
  const userId = state.session?.user?.id || null;
  const folderId = score?.folderId && knownFolderIds.has(score.folderId) ? score.folderId : null;
  const pages = Array.isArray(score?.pages) ? score.pages : [];
  const scoreId = String(score?.id || createId());

  return {
    id: scoreId,
    userId,
    name,
    normalizedName: normalizeText(score?.normalizedName || name),
    folderId,
    createdAt: score?.createdAt || now,
    updatedAt: score?.updatedAt || score?.createdAt || now,
    deletedAt: score?.deletedAt || null,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
    pages: await Promise.all(
      pages
        .filter((page) => typeof page?.dataUrl === "string")
        .map(async (page, index) => {
          const blob = dataUrlToBlob(page.dataUrl);

          return {
            id: String(page.id || createId()),
            scoreId,
            userId,
            pageIndex: index,
            name: page.name || `第 ${index + 1} 页`,
            type: page.type || blob.type || "image/jpeg",
            size: Number(page.size) || blob.size,
            blob,
            storagePath: page.storagePath || null,
            createdAt: page.createdAt || now,
            updatedAt: page.updatedAt || now,
            deletedAt: page.deletedAt || null,
            syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
          };
        }),
    ),
  };
}

async function claimLocalRecordsForUser(userId) {
  const [scores, pages, folders] = await Promise.all([getAllScores(), getAllScorePages(), getAllFolders()]);
  const now = new Date().toISOString();
  const claimedFolders = folders
    .filter((folder) => !folder.userId)
    .map((folder) => ({
      ...normalizeLocalFolderRecord(folder),
      userId,
      updatedAt: folder.updatedAt || now,
      syncStatus: SYNC_STATUS_PENDING,
    }));
  const claimedScores = scores
    .filter((score) => !score.userId)
    .map((score) => ({
      ...normalizeLocalScoreRecord(score),
      userId,
      updatedAt: score.updatedAt || now,
      syncStatus: SYNC_STATUS_PENDING,
    }));
  const claimedPages = pages
    .filter((page) => !page.userId)
    .map((page) => ({
      ...normalizeLocalPageRecord(page),
      userId,
      updatedAt: page.updatedAt || now,
      syncStatus: SYNC_STATUS_PENDING,
    }));

  if (!claimedFolders.length && !claimedScores.length && !claimedPages.length) {
    return;
  }

  await putCloudReadyRecords(claimedFolders, claimedScores, claimedPages);
  await loadScores();
}

function putCloudReadyRecords(folders, scores, pages) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction([FOLDER_STORE_NAME, STORE_NAME, PAGE_STORE_NAME], "readwrite");
    const folderStore = transaction.objectStore(FOLDER_STORE_NAME);
    const scoreStore = transaction.objectStore(STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);

    folders.forEach((folder) => folderStore.put(folder));
    scores.forEach((score) => scoreStore.put(toScoreRecord(score)));
    pages.forEach((page) => pageStore.put(page));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function queueSync() {
  if (!state.cloudReady || !state.session || state.syncing) {
    return;
  }

  window.setTimeout(() => syncNow(), 250);
}

async function syncNow(options = {}) {
  if (!state.cloudReady || !state.session || state.syncing) {
    if (options.manual && !state.session) {
      setStatus("请先登录账号。", true);
    }
    return;
  }

  state.syncing = true;
  updateAccountUi();
  if (options.manual) {
    setStatus("正在同步...");
  }

  try {
    await uploadLocalChanges();
    await pullCloudChanges();
    await loadScores();
    if (options.manual) {
      setStatus("同步完成。");
    }
  } catch (error) {
    console.error(error);
    setStatus(error.message || "同步失败，请检查网络和 CloudBase 配置。", true);
  } finally {
    state.syncing = false;
    updateAccountUi();
  }
}

async function uploadLocalChanges() {
  const userId = state.session.user.id;
  const folders = state.folders.map((folder) => ({ ...folder, userId }));
  const scores = state.scores.map((score) => ({ ...toScoreRecord(score), userId }));
  const pages = state.scorePages
    .filter((page) => scores.some((score) => score.id === page.scoreId))
    .map((page) => ({ ...page, userId }));
  const uploadedPages = [];

  for (const page of pages) {
    let storagePath = page.storagePath || createStoragePath(userId, page.scoreId, page.id, page.type);
    if (page.blob && (!page.storagePath || page.syncStatus !== SYNC_STATUS_SYNCED)) {
      const cloudPath = page.storagePath?.startsWith("cloud://")
        ? createStoragePath(userId, page.scoreId, page.id, page.type)
        : storagePath;
      storagePath = await uploadCloudFile(cloudPath, page.blob);
    }
    uploadedPages.push({
      ...page,
      storagePath,
      syncStatus: SYNC_STATUS_SYNCED,
    });
  }

  if (folders.length) {
    await upsertCloud(CLOUD_TABLES.folders, folders.map(toCloudFolder));
  }
  if (scores.length) {
    await upsertCloud(CLOUD_TABLES.scores, scores.map(toCloudScore));
  }
  if (uploadedPages.length) {
    await upsertCloud(CLOUD_TABLES.pages, uploadedPages.map(toCloudPage));
  }

  await markLocalSynced(
    folders.map((folder) => ({ ...folder, syncStatus: SYNC_STATUS_SYNCED })),
    scores.map((score) => ({ ...score, syncStatus: SYNC_STATUS_SYNCED })),
    uploadedPages,
  );
}

async function pullCloudChanges() {
  const userId = state.session.user.id;
  const [folders, scores, pages] = await Promise.all([
    queryCloudRows(CLOUD_TABLES.folders, { user_id: userId, deleted_at: null }),
    queryCloudRows(CLOUD_TABLES.scores, { user_id: userId, deleted_at: null }),
    queryCloudRows(CLOUD_TABLES.pages, { user_id: userId, deleted_at: null }, {
      orderBy: [["page_index", "asc"]],
    }),
  ]);

  const localPageById = new Map(state.scorePages.map((page) => [page.id, page]));
  const cloudPages = [];

  for (const row of pages) {
    const page = fromCloudPage(row);
    const localPage = localPageById.get(page.id);
    if (localPage?.blob) {
      cloudPages.push({ ...page, blob: localPage.blob });
      continue;
    }

    const data = await downloadCloudFile(page.storagePath);
    cloudPages.push({
      ...page,
      blob: data,
      size: page.size || data.size,
    });
  }

  await putCloudReadyRecords(
    folders.map(fromCloudFolder),
    scores.map(fromCloudScore),
    cloudPages,
  );
}

function markLocalSynced(folders, scores, pages) {
  return putCloudReadyRecords(folders, scores, pages);
}

async function upsertCloud(table, rows) {
  const collection = state.cloudDb.collection(table);
  for (const row of rows) {
    const { _id, ...document } = row;
    const result = await collection.doc(String(row.id)).set(document);
    assertCloudResult(result);
  }
}

async function queryCloudRows(collectionName, where, options = {}) {
  const pageSize = 1000;
  const rows = [];
  let offset = 0;
  let batch = [];

  do {
    let query = state.cloudDb.collection(collectionName).where(where);
    (options.orderBy || []).forEach(([field, direction]) => {
      query = query.orderBy(field, direction || "asc");
    });

    const result = await query.skip(offset).limit(pageSize).get();
    assertCloudResult(result);
    batch = Array.isArray(result.data) ? result.data : [];
    rows.push(...batch);
    offset += batch.length;
  } while (batch.length === pageSize);

  return rows;
}

async function queryCloudRowsByIds(collectionName, field, values, where = {}, options = {}) {
  const uniqueValues = Array.from(new Set(values.filter(Boolean)));
  if (!uniqueValues.length) {
    return [];
  }

  const rows = [];
  for (const chunk of chunkArray(uniqueValues, 50)) {
    rows.push(
      ...(await queryCloudRows(
        collectionName,
        {
          ...where,
          [field]: state.cloudDb.command.in(chunk),
        },
        options,
      )),
    );
  }

  return rows;
}

async function deleteCloudRowsByIds(collectionName, ids) {
  const collection = state.cloudDb.collection(collectionName);
  for (const id of ids.filter(Boolean)) {
    const result = await collection.doc(String(id)).remove();
    assertCloudResult(result);
  }
}

function assertCloudResult(result) {
  if (!result) {
    return;
  }

  if (result.error) {
    throw result.error;
  }

  if (result.code && result.code !== "SUCCESS") {
    throw new Error(result.message || result.msg || String(result.code));
  }
}

async function uploadCloudFile(cloudPath, blob) {
  const result = await state.cloudApp.uploadFile({
    cloudPath,
    fileContent: blob,
  });
  assertCloudResult(result);
  return result.fileID || result.fileId || result.data?.fileID || cloudPath;
}

async function downloadCloudFile(fileID) {
  if (!fileID) {
    throw new Error("歌谱图片缺少云端文件 ID。");
  }

  const result = await state.cloudApp.getTempFileURL({
    fileList: [fileID],
  });
  assertCloudResult(result);

  const fileInfo = result.fileList?.[0] || result.data?.fileList?.[0];
  if (!fileInfo) {
    throw new Error("无法获取歌谱图片下载地址。");
  }
  if (fileInfo.code && fileInfo.code !== "SUCCESS") {
    throw new Error(fileInfo.message || fileInfo.msg || "歌谱图片下载地址获取失败。");
  }

  const url = fileInfo.tempFileURL || fileInfo.download_url || fileInfo.url;
  if (!url) {
    throw new Error("歌谱图片下载地址为空。");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("歌谱图片下载失败。");
  }

  return response.blob();
}

async function deleteCloudFiles(fileIDs) {
  const targets = fileIDs.filter(Boolean);
  if (!targets.length) {
    return;
  }

  const result = await state.cloudApp.deleteFile({
    fileList: targets,
  });
  assertCloudResult(result);
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function createStoragePath(userId, scoreId, pageId, type) {
  const root = String(window.MY_SCORE_FOLDER_CLOUDBASE?.storageRoot || "score-pages").replace(/^\/+|\/+$/g, "");
  return `${root}/${userId}/${scoreId}/${pageId}.${getExtensionFromType(type)}`;
}

function getExtensionFromType(type) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

function toCloudFolder(folder) {
  return {
    id: folder.id,
    user_id: folder.userId,
    name: folder.name,
    normalized_name: folder.normalizedName,
    created_at: folder.createdAt,
    updated_at: folder.updatedAt,
    deleted_at: folder.deletedAt || null,
  };
}

function toCloudScore(score) {
  return {
    id: score.id,
    user_id: score.userId,
    folder_id: score.folderId || null,
    name: score.name,
    normalized_name: score.normalizedName,
    created_at: score.createdAt,
    updated_at: score.updatedAt,
    deleted_at: score.deletedAt || null,
  };
}

function toCloudPage(page) {
  return {
    id: page.id,
    user_id: page.userId,
    score_id: page.scoreId,
    page_index: page.pageIndex,
    name: page.name,
    type: page.type,
    size: page.size,
    storage_path: page.storagePath,
    created_at: page.createdAt,
    updated_at: page.updatedAt,
    deleted_at: page.deletedAt || null,
  };
}

function fromCloudFolder(row) {
  return normalizeLocalFolderRecord({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    normalizedName: row.normalized_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    syncStatus: SYNC_STATUS_SYNCED,
  });
}

function fromCloudScore(row) {
  return normalizeLocalScoreRecord({
    id: row.id,
    userId: row.user_id,
    folderId: row.folder_id,
    name: row.name,
    normalizedName: row.normalized_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    syncStatus: SYNC_STATUS_SYNCED,
  });
}

function fromCloudPage(row) {
  return normalizeLocalPageRecord({
    id: row.id,
    userId: row.user_id,
    scoreId: row.score_id,
    pageIndex: row.page_index,
    name: row.name,
    type: row.type,
    size: row.size,
    storagePath: row.storage_path,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    syncStatus: SYNC_STATUS_SYNCED,
  });
}

function openShareDialog() {
  if (!requireCloudSession()) {
    return;
  }

  elements.shareCodePanel.hidden = true;
  elements.shareCodeText.textContent = "";
  renderShareList();
  if (typeof elements.shareDialog.showModal === "function") {
    elements.shareDialog.showModal();
  } else {
    elements.shareDialog.setAttribute("open", "");
  }
  refreshIcons();
}

function closeShareDialog() {
  if (elements.shareDialog.open) {
    elements.shareDialog.close();
  } else {
    elements.shareDialog.removeAttribute("open");
  }
}

function renderShareList() {
  elements.shareList.replaceChildren();
  if (!state.scores.length) {
    elements.shareList.append(createEmptyState("还没有歌谱", "保存歌谱后就可以分享。"));
    elements.createShareButton.disabled = true;
    return;
  }

  elements.createShareButton.disabled = false;
  state.scores.forEach((score) => {
    const label = document.createElement("label");
    label.className = "share-option";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = score.id;
    const text = document.createElement("span");
    text.textContent = score.name;
    label.append(checkbox, text);
    elements.shareList.append(label);
  });
}

async function createShareCode(event) {
  event.preventDefault();
  if (!requireCloudSession()) {
    return;
  }

  const selectedIds = Array.from(elements.shareList.querySelectorAll("input[type='checkbox']:checked")).map(
    (input) => input.value,
  );
  if (!selectedIds.length) {
    setStatus("请至少选择一份歌谱。", true);
    return;
  }

  elements.createShareButton.disabled = true;
  try {
    await syncNow();
    const code = await insertShareBatch(selectedIds);
    elements.shareCodeText.textContent = code;
    elements.shareCodePanel.hidden = false;
    setStatus("同步码已生成。");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "生成同步码失败。", true);
  } finally {
    elements.createShareButton.disabled = false;
  }
}

async function insertShareBatch(scoreIds) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const code = createShareCodeValue();
    const existing = await queryCloudRows(CLOUD_TABLES.shareBatches, { code });
    if (existing.length) {
      continue;
    }

    const now = new Date().toISOString();
    const shareId = createId();
    await upsertCloud(CLOUD_TABLES.shareBatches, [
      {
        id: shareId,
        owner_id: state.session.user.id,
        code,
        created_at: now,
      },
    ]);
    await upsertCloud(
      CLOUD_TABLES.shareItems,
      scoreIds.map((scoreId) => ({
        id: createId(),
        share_id: shareId,
        score_id: scoreId,
        created_at: now,
      })),
    );

    return code;
  }

  throw new Error("同步码生成失败，请重试。");
}

function openImportShareDialog() {
  if (!requireCloudSession()) {
    return;
  }

  elements.importShareForm.reset();
  if (typeof elements.importShareDialog.showModal === "function") {
    elements.importShareDialog.showModal();
  } else {
    elements.importShareDialog.setAttribute("open", "");
  }
  requestAnimationFrame(() => elements.shareCodeInput.focus());
}

function closeImportShareDialog() {
  if (elements.importShareDialog.open) {
    elements.importShareDialog.close();
  } else {
    elements.importShareDialog.removeAttribute("open");
  }
}

async function importSharedScores(event) {
  event.preventDefault();
  if (!requireCloudSession()) {
    return;
  }

  const code = elements.shareCodeInput.value.trim().toUpperCase();
  if (!code) {
    return;
  }

  elements.importShareSubmitButton.disabled = true;
  setStatus("正在导入分享歌谱...");

  try {
    const importedCount = await importScoresByShareCode(code);
    closeImportShareDialog();
    await loadScores();
    setStatus(`已导入 ${importedCount} 份分享歌谱。`);
  } catch (error) {
    console.error(error);
    setStatus(error.message || "导入同步码失败。", true);
  } finally {
    elements.importShareSubmitButton.disabled = false;
  }
}

async function importScoresByShareCode(code) {
  const batches = await queryCloudRows(CLOUD_TABLES.shareBatches, { code });
  const batch = batches[0];
  if (!batch) {
    throw new Error("同步码不存在，请检查后再试。");
  }

  const items = await queryCloudRows(CLOUD_TABLES.shareItems, { share_id: batch.id });
  const scoreIds = items.map((item) => item.score_id);
  if (!scoreIds.length) {
    return 0;
  }

  const [sharedScores, sharedPages] = await Promise.all([
    queryCloudRowsByIds(CLOUD_TABLES.scores, "id", scoreIds, { deleted_at: null }),
    queryCloudRowsByIds(CLOUD_TABLES.pages, "score_id", scoreIds, { deleted_at: null }, {
      orderBy: [["page_index", "asc"]],
    }),
  ]);

  const existingNames = new Set(state.scores.map((score) => normalizeText(score.name)));
  const userId = state.session.user.id;
  let importedCount = 0;

  for (const sharedScore of sharedScores) {
    if (existingNames.has(normalizeText(sharedScore.name))) {
      continue;
    }

    const now = new Date().toISOString();
    const newScore = {
      id: createId(),
      userId,
      name: sharedScore.name,
      normalizedName: normalizeText(sharedScore.name),
      folderId: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: SYNC_STATUS_PENDING,
    };
    const pageRows = sharedPages.filter((page) => page.score_id === sharedScore.id);
    const newPages = [];

    for (const [index, pageRow] of pageRows.entries()) {
      const blob = await downloadCloudFile(pageRow.storage_path);
      const newPageId = createId();
      const storagePath = createStoragePath(userId, newScore.id, newPageId, pageRow.type);
      const fileID = await uploadCloudFile(storagePath, blob);
      newPages.push({
        id: newPageId,
        scoreId: newScore.id,
        userId,
        pageIndex: index,
        name: pageRow.name || `第 ${index + 1} 页`,
        type: pageRow.type || blob.type || "image/jpeg",
        size: Number(pageRow.size) || blob.size,
        blob,
        storagePath: fileID,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        syncStatus: SYNC_STATUS_SYNCED,
      });
    }

    if (!newPages.length) {
      continue;
    }

    await putScoreWithPages(newScore, newPages);
    await upsertCloud(CLOUD_TABLES.scores, [toCloudScore(newScore)]);
    await upsertCloud(CLOUD_TABLES.pages, newPages.map(toCloudPage));
    existingNames.add(newScore.normalizedName);
    importedCount += 1;
  }

  await syncNow();
  return importedCount;
}

function createShareCodeValue() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function resetForm(showMessage = true) {
  elements.scoreForm.reset();
  clearPendingUrls();
  state.pendingPages = [];
  renderPending();
  updateSaveState();
  if (showMessage) {
    setStatus("");
  }
}

function updateSaveState() {
  elements.saveButton.disabled = !elements.scoreName.value.trim() || !state.pendingPages.length;
}

function renderScores() {
  const query = elements.searchInput.value.trim();
  const normalizedQuery = normalizeText(query);
  const currentFolder = getCurrentFolder();
  const inFolder = Boolean(currentFolder);
  const currentFolderId = inFolder ? currentFolder.id : null;
  const visibleScores = state.scores.filter((score) => (score.folderId || null) === currentFolderId);
  const visibleFolders = inFolder ? [] : state.folders;
  const searchableScores = normalizedQuery && !inFolder ? state.scores : visibleScores;
  const filteredScores = normalizedQuery
    ? searchableScores.filter((score) => score.normalizedName.includes(normalizedQuery))
    : visibleScores;
  const filteredFolders = normalizedQuery
    ? visibleFolders.filter((folder) => folder.normalizedName.includes(normalizedQuery))
    : visibleFolders;
  const total = visibleScores.length + visibleFolders.length;
  const resultTotal = filteredScores.length + filteredFolders.length;

  elements.libraryTitle.textContent = currentFolder?.name || "谱夹";
  elements.folderBackButton.hidden = !inFolder;
  elements.librarySummary.textContent = inFolder
    ? `${currentFolder.name} · ${visibleScores.length} 份歌谱`
    : `${state.folders.length} 个文件夹 · ${visibleScores.length} 份歌谱`;
  elements.resultCount.textContent = query
    ? `${resultTotal} 个结果`
    : inFolder
      ? `${visibleScores.length} 份歌谱`
      : `${state.folders.length} 个文件夹 · ${visibleScores.length} 份歌谱`;
  elements.scoreGrid.replaceChildren();

  if (!total && !normalizedQuery) {
    elements.scoreGrid.append(
      createEmptyState(
        inFolder ? "文件夹是空的" : "还没有歌谱",
        inFolder ? "点击右下角添加歌谱。" : "点击右下角添加文件夹或歌谱。",
      ),
    );
    refreshIcons();
    return;
  }

  if (!resultTotal) {
    elements.scoreGrid.append(createEmptyState("没有找到", "换一个歌谱名试试。"));
    refreshIcons();
    return;
  }

  filteredFolders.forEach((folder) => {
    elements.scoreGrid.append(createFolderCard(folder));
  });

  filteredScores.forEach((score) => {
    elements.scoreGrid.append(createScoreCard(score));
  });

  refreshIcons();
}

function getCurrentFolder() {
  if (!state.currentFolderId) {
    return null;
  }

  return state.folders.find((folder) => folder.id === state.currentFolderId) || null;
}

function openFolder(id) {
  state.currentFolderId = id;
  elements.searchInput.value = "";
  renderScores();
  elements.appShell.scrollTo({ top: 0 });
}

function openRootFolder() {
  state.currentFolderId = null;
  elements.searchInput.value = "";
  renderScores();
  elements.appShell.scrollTo({ top: 0 });
}

function createFolderCard(folder) {
  const folderScores = state.scores.filter((score) => score.folderId === folder.id);
  const card = document.createElement("article");
  card.className = "score-card folder-card";
  card.addEventListener("click", () => openFolder(folder.id));

  const previewButton = document.createElement("button");
  previewButton.className = "score-preview folder-preview";
  previewButton.type = "button";
  previewButton.title = `打开《${folder.name}》`;
  previewButton.setAttribute("aria-label", `打开《${folder.name}》`);
  previewButton.append(createIcon("folder"));
  previewButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openFolder(folder.id);
  });

  const name = document.createElement("h3");
  name.className = "score-name";
  name.textContent = folder.name;

  const detail = document.createElement("p");
  detail.className = "score-detail";
  detail.textContent = `${folderScores.length} 份歌谱`;

  card.append(previewButton, name, detail);
  return card;
}

function createScoreCard(score) {
  const card = document.createElement("article");
  card.className = "score-card";
  card.addEventListener("click", () => openViewer(score.id));

  const previewButton = document.createElement("button");
  previewButton.className = "score-preview";
  previewButton.type = "button";
  previewButton.title = `查看《${score.name}》`;
  previewButton.setAttribute("aria-label", `查看《${score.name}》`);
  previewButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openViewer(score.id);
  });

  const firstPage = score.pages[0];
  if (firstPage) {
    const image = document.createElement("img");
    image.draggable = false;
    image.src = getScoreUrl(firstPage);
    image.alt = `《${score.name}》第 1 页`;
    previewButton.append(image);
  }

  const name = document.createElement("h3");
  name.className = "score-name";
  name.textContent = score.name;

  const detail = document.createElement("p");
  detail.className = "score-detail";
  detail.textContent = `${score.pages.length} 页`;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.append(createIcon("trash-2"), document.createTextNode("删除"));
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteScore(score.id);
  });

  actions.append(deleteButton);
  card.append(previewButton, name, detail, actions);
  return card;
}

function createEmptyState(title, detail) {
  const empty = document.createElement("div");
  empty.className = "empty-state";

  const content = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = title;
  const paragraph = document.createElement("span");
  paragraph.textContent = detail;
  content.append(strong, paragraph);

  empty.append(content);
  return empty;
}

function openViewer(id) {
  const score = state.scores.find((item) => item.id === id);
  if (!score) {
    return;
  }

  resetViewerGestureState();
  setViewerZoom(VIEWER_MIN_ZOOM);
  elements.viewerPages.replaceChildren();
  elements.viewerPages.classList.toggle("has-multiple-pages", score.pages.length > 1);

  score.pages.forEach((page, index) => {
    const figure = document.createElement("figure");
    figure.className = "viewer-page";

    const image = document.createElement("img");
    image.draggable = false;
    image.src = getScoreUrl(page);
    image.alt = `《${score.name}》第 ${index + 1} 页`;

    const imageFrame = document.createElement("div");
    imageFrame.className = "viewer-image-frame";
    imageFrame.append(image);

    figure.append(imageFrame);
    elements.viewerPages.append(figure);
  });

  if (typeof elements.viewerDialog.showModal === "function") {
    elements.viewerDialog.showModal();
  } else {
    elements.viewerDialog.setAttribute("open", "");
  }

  document.body.classList.add("viewer-open");

  if (!state.viewerHistoryActive) {
    window.history.pushState({ viewer: id }, "");
    state.viewerHistoryActive = true;
  }

  requestAnimationFrame(() => {
    elements.viewerPages.scrollTo({ left: 0, top: 0 });
  });
}

function closeViewer(options = {}) {
  const shouldReturnHistory = state.viewerHistoryActive && !options.fromHistory;
  state.viewerHistoryActive = false;

  if (elements.viewerDialog.open) {
    elements.viewerDialog.close();
  }
  document.body.classList.remove("viewer-open");
  resetViewerGestureState();
  setViewerZoom(VIEWER_MIN_ZOOM);

  if (shouldReturnHistory) {
    window.history.back();
  }
}

function resetViewerGestureState() {
  state.viewerPointers.clear();
  state.viewerPinchStartDistance = 0;
  state.viewerPinchStartZoom = VIEWER_MIN_ZOOM;
  state.viewerDrag = null;
  state.viewerTapStart = null;
  state.viewerLastTap = null;
  elements.viewerPages.classList.remove("is-dragging", "is-pinching", "has-multiple-pages");
}

async function deleteScore(id) {
  const score = state.scores.find((item) => item.id === id);
  if (!score) {
    return;
  }

  const confirmed = await requestDeleteConfirmation(score);
  if (!confirmed) {
    return;
  }

  try {
    if (state.cloudReady && state.session && score.userId === state.session.user.id) {
      await deleteCloudScore(score);
    }
    await deleteScoreRecord(id);
    revokeScoreUrls(score);
    state.scores = state.scores.filter((item) => item.id !== id);
    closeViewer();
    renderScores();
    setStatus(`已删除《${score.name}》。`);
  } catch (error) {
    console.error(error);
    setStatus("删除失败，请稍后再试。", true);
  }
}

async function deleteCloudScore(score) {
  const pageIds = (score.pages || []).map((page) => page.id);
  const paths = (score.pages || []).map((page) => page.storagePath).filter(Boolean);

  if (paths.length) {
    await deleteCloudFiles(paths);
  }
  if (pageIds.length) {
    await deleteCloudRowsByIds(CLOUD_TABLES.pages, pageIds);
  }
  await deleteCloudRowsByIds(CLOUD_TABLES.scores, [score.id]);
}

function requestDeleteConfirmation(score) {
  elements.deleteDialogMessage.textContent = `确定删除《${score.name}》吗？删除后无法恢复。`;
  refreshIcons();

  return new Promise((resolve) => {
    state.deleteDialogResolve = resolve;

    if (typeof elements.deleteDialog.showModal === "function") {
      elements.deleteDialog.showModal();
    } else {
      elements.deleteDialog.setAttribute("open", "");
    }

    elements.cancelDeleteButton.focus();
  });
}

function closeDeleteDialog(confirmed) {
  if (elements.deleteDialog.open) {
    elements.deleteDialog.close();
  } else {
    elements.deleteDialog.removeAttribute("open");
  }

  if (state.deleteDialogResolve) {
    state.deleteDialogResolve(confirmed);
    state.deleteDialogResolve = null;
  }
}

function getScoreUrl(page) {
  if (!state.scoreUrls.has(page.id)) {
    state.scoreUrls.set(page.id, URL.createObjectURL(page.blob));
  }
  return state.scoreUrls.get(page.id);
}

function getPendingUrl(page) {
  if (!state.pendingUrls.has(page.id)) {
    state.pendingUrls.set(page.id, URL.createObjectURL(page.blob));
  }
  return state.pendingUrls.get(page.id);
}

function revokeScoreUrls(score) {
  score.pages.forEach((page) => {
    const url = state.scoreUrls.get(page.id);
    if (url) {
      URL.revokeObjectURL(url);
      state.scoreUrls.delete(page.id);
    }
  });
}

function revokePendingUrl(id) {
  const url = state.pendingUrls.get(id);
  if (url) {
    URL.revokeObjectURL(url);
    state.pendingUrls.delete(id);
  }
}

function clearPendingUrls() {
  state.pendingUrls.forEach((url) => URL.revokeObjectURL(url));
  state.pendingUrls.clear();
}

function revokeAllUrls() {
  state.scoreUrls.forEach((url) => URL.revokeObjectURL(url));
  state.scoreUrls.clear();
  clearPendingUrls();
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl) {
  const [header, content] = dataUrl.split(",");
  const match = /^data:([^;]+);base64$/i.exec(header || "");

  if (!match || !content) {
    throw new Error("Invalid image data.");
  }

  const binary = atob(content);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: match[1] });
}

function downloadJsonBackup(backup) {
  const json = JSON.stringify(backup);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `我的谱夹备份-${formatBackupDate(new Date())}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function createIcon(name) {
  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", name);
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function setStatus(message, isError = false) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function normalizeText(value) {
  return value.trim().toLocaleLowerCase("zh-CN");
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function formatBackupDate(date) {
  const pad = (value) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
  ].join("");
}

function formatCompressionMeta(page) {
  if (!page.originalSize || page.originalSize <= page.size) {
    return formatBytes(page.size);
  }

  const percent = Math.max(1, Math.round((1 - page.size / page.originalSize) * 100));
  return `${formatBytes(page.size)}，已减小 ${percent}%`;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || min, min), max);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
