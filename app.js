const DB_NAME = "my-score-folder";
const DB_VERSION = 12;
const STORE_NAME = "scores";
const FOLDER_STORE_NAME = "folders";
const PAGE_STORE_NAME = "score_pages";
const ASSET_STORE_NAME = "assets";
const SETLIST_STORE_NAME = "setlists";
const SETLIST_ITEM_STORE_NAME = "setlist_items";
const TRASH_STORE_NAME = "trash";
const ANNOTATION_STORE_NAME = "annotations";
const SYNC_OUTBOX_STORE_NAME = "sync_outbox";
const LOCAL_OP_STORE_NAME = "local_ops";
const SYNC_STATE_STORE_NAME = "sync_state";
const BACKUP_FORMAT = "my-score-folder-backup";
const BACKUP_VERSION = 2;
// 构建版本号：显示在“我的”页底部，用于确认实际加载到的版本（排查缓存是否刷新）。
const APP_BUILD = "v225";
// outbox 任务状态与重试策略
const OUTBOX_STATUS_PENDING = "pending";
const OUTBOX_STATUS_FAILED = "failed";
const OUTBOX_MAX_ATTEMPTS = 6;
const LOCAL_OP_STATUS_PENDING = "pending";
const LOCAL_OP_STATUS_SYNCING = "syncing";
const LOCAL_OP_STATUS_SYNCED = "synced";
const LOCAL_OP_STATUS_FAILED = "failed";
const LOCAL_OP_STATUS_SUPERSEDED = "superseded";
const LOCAL_OP_STATUS_CANCELLED = "cancelled";
const LOCAL_OP_STATUS_CONFLICT = "conflict";
const SYNC_STATE_DIRTY = "dirty";
const SYNC_STATE_SYNCING = "syncing";
const SYNC_STATE_SYNCED = "synced";
const SYNC_STATE_FAILED = "failed";
const SYNC_STATE_CONFLICT = "conflict";
const SYNC_STATE_DELETED = "deleted";
// 指数退避（毫秒），超出长度用最后一个值。
const OUTBOX_BACKOFF_MS = [0, 5000, 15000, 60000, 300000, 900000];
const SYNC_STATUS_LOCAL = "local";
const SYNC_STATUS_PENDING = "pending";
const SYNC_STATUS_SYNCED = "synced";
const CLOUD_TABLES = {
  folders: "folders",
  scores: "scores",
  pages: "score_pages",
  shareBatches: "share_batches",
  shareItems: "share_items",
  setlists: "setlists",
  setlistItems: "setlist_items",
  annotations: "annotations",
};
const VIEWER_MIN_ZOOM = 1;
const VIEWER_MAX_ZOOM = 4;
const VIEWER_DOUBLE_TAP_ZOOM = 2;
const VIEWER_TAP_MAX_DISTANCE = 10;
const VIEWER_DOUBLE_TAP_DELAY = 320;
const ANNOTATION_POINTER_DEBUG = false;
const IMAGE_MAX_EDGE = 1600;
const IMAGE_WEBP_QUALITY = 0.7;
const IMAGE_JPEG_QUALITY = 0.76;
const THUMBNAIL_MAX_EDGE = 420;
const THUMBNAIL_QUALITY = 0.6;
const CLOUDBASE_SDK_LOCAL = "./vendor/cloudbase.full.js";
const CLOUDBASE_SDK_CDN = "https://static.cloudbase.net/cloudbase-js-sdk/2.28.8/cloudbase.full.js";
const STORAGE_UPLOAD_VERSION = 3;
const ACCOUNT_LABEL_STORAGE_PREFIX = "my-score-folder-account-label:";
const PROFILE_STORAGE_PREFIX = "my-score-folder-profile:";
const PROFILE_COLLECTION_NAME = "profiles";
// 记录“某用户在某年生日已用过的祝福语”，用于尽量不重复地轮换祝福语。
const BIRTHDAY_USED_PREFIX = "my-score-folder-birthday-used:";
// 记录“支持作者”月度提示在某年某月是否已弹出，避免每月 1 号多次打开 App 重复弹。
const SUPPORT_PROMPT_SHOWN_PREFIX = "my-score-folder-support-shown:";
// 收款码图片缺失时的占位图，避免出现浏览器“裂图”图标。
const SUPPORT_PAY_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="100%" height="100%" rx="12" fill="#f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#9a9a9a">收款码待添加</text></svg>',
  );
const VIEWER_MODE_STORAGE_KEY = "my-score-folder-viewer-mode";
const VIEWER_MODE_PORTRAIT = "portrait";
const VIEWER_MODE_LANDSCAPE = "landscape";
const THEME_STORAGE_KEY = "my-score-folder-theme";
const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const THEME_CHROME_COLORS = {
  [THEME_LIGHT]: "#fffdf8",
  [THEME_DARK]: "#11110f",
};
// 系统栏（theme-color）颜色：与顶栏背景一致（浅色为 #fffdf8），避免状态栏区域显出米黄色。
const THEME_BAR_COLORS = {
  [THEME_LIGHT]: "#fffdf8",
  [THEME_DARK]: "#11110f",
};
const THEME_APPLE_STATUS_STYLES = {
  [THEME_LIGHT]: "default",
  [THEME_DARK]: "default",
};
const LIBRARY_FILTER_ALL = "all";
const LIBRARY_FILTER_RECENT = "recent";
const LIBRARY_FILTER_FAVORITE = "favorite";
const SCORE_SORT_RECENT_OPENED = "recentOpened";
const SCORE_SORT_RECENT_ADDED = "recentAdded";
const SCORE_SORT_NAME = "name";
const FAB_DRAG_START_DISTANCE = 4;
const FAB_VIEWPORT_MARGIN = 8;
const IMAGE_COMPRESSION_TIMEOUT = 30000;
const LOCAL_SAVE_TIMEOUT = 45000;
const PAGE_SAVE_TIMEOUT = 18000;
const TRASH_SNAPSHOT_MAX_BYTES = 2 * 1024 * 1024;
const CLOUD_QUERY_TIMEOUT = 30000;
const CLOUD_UPLOAD_TIMEOUT = 120000;
const CLOUD_DOWNLOAD_TIMEOUT = 90000;
const CLOUD_WRITE_CONCURRENCY = 4;
// 任何本地 IndexedDB 事务的兜底超时：超过即主动 abort，避免事务永远 pending。
const IDB_TXN_TIMEOUT = 20000;
const LOCAL_WRITE_PRIORITY = {
  HIGH: 0,
  NORMAL: 1,
  LOW: 2,
};
const LOCAL_WRITE_BATCH_SIZE = 10;
// 打开/重开本地数据库的兜底超时：iOS/PWA 退后台后连接可能卡死，open 请求永不回调，
// 会阻塞整条串行写队列（删除/保存/编辑“点了没反应”）。超时即 reject，让重试/重连能恢复。
const DB_OPEN_TIMEOUT = 8000;
// 操作锁的总超时兜底：任何被锁包裹的操作最多占用这么久，超时后释放锁并报错，避免“点了没反应”。
const OPERATION_LOCK_TIMEOUT = 180000;
// App 打开恢复 session 后，延迟这么久再做重型全量同步，避免一开就卡在网络/SDK 上。
const STARTUP_SYNC_DELAY = 6000;
const SHARE_SYNC_WAIT_TIMEOUT = 1200;
const SHARE_UPLOAD_CONCURRENCY = 3;
const SCORE_UPLOAD_CONCURRENCY = 3;
const SHARE_BACKGROUND_UPLOAD_CONCURRENCY = 1;
const SHARE_BATCH_EMBED_LIMIT = 700 * 1024;
const PAGE_BACKGROUND_HYDRATE_DELAY = 2600;
const PAGE_BACKGROUND_HYDRATE_CONCURRENCY = 2;
const SCORE_IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420" viewBox="0 0 320 420"><rect width="320" height="420" fill="#f4f7f6"/><rect x="32" y="32" width="256" height="356" rx="8" fill="#fff" stroke="#c7d2cf"/><path d="M82 140h156M82 172h156M82 204h156M82 236h156M82 268h156" stroke="#9ca9a6" stroke-width="8" stroke-linecap="round"/><circle cx="130" cy="296" r="18" fill="#9ca9a6"/><path d="M146 296V118" stroke="#9ca9a6" stroke-width="12" stroke-linecap="round"/></svg>',
)}`;

const state = {
  db: null,
  cloudApp: null,
  cloudAuth: null,
  cloudDb: null,
  session: null,
  cloudReady: false,
  cloudInitializing: null,
  cloudError: "",
  cloudAuthListenerBound: false,
  syncing: false,
  scores: [],
  scorePages: [],
  folders: [],
  setlists: [],
  setlistItems: [],
  pendingPages: [],
  pendingFilesProcessing: false,
  scoreUrls: new Map(),
  pendingUrls: new Map(),
  pageThumbUrls: new Map(),
  pageThumbRequests: new Map(),
  pageAssetUrlRequests: new Map(),
  // 列表封面 objectURL 缓存：scoreId -> { sig, url }，按内容签名复用，避免每次 loadScores 误回收正在显示的 URL。
  scoreCoverUrls: new Map(),
  // 已显示封面的粘性缓存：scoreId -> url。进入 app 解析一次后，后续渲染直接复用，不再重载、不回退占位。
  coverDisplayUrls: new Map(),
  // 复用的封面 <img> 元素：scoreId -> img。重渲染时移动同一元素（保留已解码位图），杜绝进出查看器后封面重新加载。
  coverImgElements: new Map(),
  // 正在补封面缩略图的 scoreId，避免重复生成。
  coverThumbRequests: new Set(),
  thumbObserver: null,
  pageTempUrls: new Map(),
  pageTempUrlRequests: new Map(),
  pageDownloads: new Set(),
  pageRecoveryAttempts: new Map(),
  pageHydrationTimer: 0,
  pageHydrationRunning: false,
  pageHydrationQueued: false,
  legacyPageAssetMigrationTimer: 0,
  legacyPageAssetMigrationRunning: false,
  outboxProcessing: false,
  outboxTimer: 0,
  outboxCounts: { pending: 0, failed: 0 },
  outboxLastError: "",
  syncStateCounts: { dirty: 0, syncing: 0, failed: 0, conflict: 0 },
  localOpCounts: { pending: 0, syncing: 0, failed: 0, conflict: 0 },
  syncEngineTimer: 0,
  syncEngineScheduled: false,
  syncEngineLastReason: "",
  syncEngineLastRunAt: 0,
  syncEngineLastError: "",
  // 用户正在进行的本地写操作计数：>0 时暂停后台 sync/outbox，避免与用户操作抢事务。
  userWriteActive: 0,
  userCommandPending: 0,
  backgroundWorkPausedUntil: 0,
  backgroundWorkRetryTimer: 0,
  // 后台同步（拉取/全量）最近一次失败原因：用于在“我的”同步面板里显示，而不是静默 console.warn。
  backgroundSyncError: "",
  // 云端是否已就绪可用；SDK 调用超时后会被标记 unhealthy 并清空，下次同步重新初始化。
  cloudUnhealthy: false,
  // 启动自动恢复账号期间为 true：此时列表空不显示“还没有歌谱”，而是“正在恢复账号和歌谱...”。
  authRestoring: false,
  viewerPageIndicatorFrame: 0,
  viewerPerformanceMode: false,
  wakeLockSentinel: null,
  installPrompt: null,
  addScreenOpen: false,
  accountSyncTimer: 0,
  scoreUploads: new Set(),
  scoreUploadTasks: new Map(),
  folderUploads: new Set(),
  shareTasks: new Set(),
  shareSelectedFolderIds: new Set(),
  shareSelectedScoreIds: new Set(),
  setlistDraftScoreIds: [],
  setlistPickerExpandedFolders: new Set(),
  copyFeedbackTimer: 0,
  activeTab: "library",
  currentFolderId: null,
  libraryFilter: LIBRARY_FILTER_ALL,
  scoreSort: SCORE_SORT_RECENT_ADDED,
  viewerMode: readViewerModePreference(),
  themeMode: readThemePreference(),
  authMode: "guest",
  authRegisterMethod: "phone",
  authRegisterAccount: "",
  authRegisterCode: "",
  authRegisterVerifyOtp: null,
  authRegisterPayload: null,
  profile: null,
  profileLoadedUserId: "",
  // 本次启动是否已弹过生日弹窗：仅内存标记，防止同一次启动的多个触发重复弹；
  // 不持久化，所以每次重新打开 App 都会再次弹出。
  birthdayPopupShownThisSession: false,
  // 本地数据库恢复弹窗最近一次被“稍后”关闭的时间戳，用于短时间内不反复打扰。
  dbRecoveryDismissedAt: 0,
  dbRecoveryPendingAction: null,
  dbRecoveryBusy: false,
  profileLinkMode: "phone",
  profileLinkSudoToken: "",
  profileLinkVerificationId: "",
  profileLinkContact: "",
  fabDrag: null,
  fabSuppressClick: false,
  appTouchY: 0,
  appReady: false,
  deleteDialogResolve: null,
  bulkDeleteSelectedIds: new Set(),
  bulkDeleteViewScores: [],
  bulkDeleting: false,
  verifyDialogResolve: null,
  scoreActionId: "",
  pageManagerScoreId: "",
  pageManagerReplacePageId: "",
  pageManagerPagesDraft: [],
  pageManagerBusy: false,
  pageManagerSaveChain: Promise.resolve(),
  scoreMetadataSaveChains: new Map(),
  annotationMode: false,
  annotationVisible: true,
  annotationTool: "pen",
  annotationColor: "#ef4444",
  annotationSize: 4,
  annotationOpacity: 1,
  annotationHighlighterColor: "#facc15",
  annotationHighlighterOpacity: 0.35,
  annotationDraftStroke: null,
  annotationPointerId: null,
  annotationDraftCanvas: null,
  annotationDraftInserted: false,
  annotationDraftUndoRegistered: false,
  annotationPenActiveStrokeId: "",
  annotationLastCommittedAt: 0,
  annotationLastPenDownAt: 0,
  annotationStrokeToken: 0,
  annotationActiveStrokeToken: 0,
  annotationStrokeStartedAt: 0,
  annotationLastPointerDownAt: 0,
  annotationLastPointerUpAt: 0,
  annotationPenLeaveTimer: 0,
  annotationRecentPenEvents: [],
  annotationRenderFrame: 0,
  annotationPendingRenderCanvas: null,
  annotationUndoStack: [],
  annotationRedoStack: [],
  annotationSaveTimer: 0,
  annotationPendingPageIds: new Set(),
  annotationSaveVersions: new Map(),
  annotationFlushPromise: null,
  annotationImmediateSaveTimes: new Map(),
  annotationRecords: new Map(),
  libraryRenderQueued: false,
  scoreEditId: "",
  folderActionId: "",
  editingFolderId: "",
  editingSetlistId: "",
  viewerZoom: VIEWER_MIN_ZOOM,
  viewerPointers: new Map(),
  viewerPinchStartDistance: 0,
  viewerPinchStartZoom: VIEWER_MIN_ZOOM,
  viewerPinchLastCenter: null,
  viewerPinchRaf: 0,
  viewerPendingPinch: null,
  viewerPinchLastDistance: 0,
  viewerPinchLastAppliedZoom: VIEWER_MIN_ZOOM,
  viewerPinchActive: false,
  viewerPinchTarget: null,
  viewerPinchAnchor: null,
  viewerPinchOriginX: 0,
  viewerPinchOriginY: 0,
  viewerPinchStartCenter: null,
  viewerPinchCurrentCenter: null,
  viewerPinchLiveScale: 1,
  viewerPinchLiveTranslateX: 0,
  viewerPinchLiveTranslateY: 0,
  viewerPinchCommitFrame: 0,
  viewerDrag: null,
  viewerTapStart: null,
  viewerLastTap: null,
  viewerHistoryActive: false,
  currentViewerPages: [],
  folderHistoryActive: false,
  currentViewerScoreId: null,
  currentViewerSetlistId: null,
  viewerPianoOpen: false,
  viewerMetronomeOpen: false,
  annotationResizeFrame: 0,
  annotationResizePending: false,
  annotationResizeNeedsFull: false,
};

const elements = {};
const operationLocks = new Set();

// 返回手势：不依赖浏览器历史（iOS 的历史手势会缓存/预览页面，导致右滑“撞回”查看器）。
// 改为自行识别“从屏幕左边缘向右滑”的手势，仅在有返回键的界面（文件夹 / 查看器）里当返回键用；
// 根层（谱夹/歌单/我的，无返回键）不做任何事。左滑一律忽略。
const EDGE_BACK_START_ZONE = 32; // 触摸需从距左边缘这么多 px 内开始才算“边缘返回”
const EDGE_BACK_MIN_DX = 56; // 水平向右至少滑动这么多 px 才触发
const EDGE_BACK_MAX_ANGLE_RATIO = 0.7; // 纵向位移不超过横向的这个比例，确保是横向滑动
let edgeBackTracking = null;

// 执行“返回上一级”——等价于点击当前界面的返回键。
function triggerEdgeBack() {
  if (state.annotationMode) {
    return;
  }
  if (elements.viewerDialog?.open) {
    // 演出模式吞掉返回，避免误退出。
    if (state.viewerPerformanceMode) {
      return;
    }
    closeViewerUI();
    return;
  }
  if (state.currentFolderId) {
    openRootFolder();
    return;
  }
  // 根层无返回键：不做任何操作。
}

function handleEdgeBackTouchStart(event) {
  if (state.annotationMode) {
    edgeBackTracking = null;
    return;
  }
  if (!event.touches || event.touches.length !== 1) {
    edgeBackTracking = null;
    return;
  }
  const touch = event.touches[0];
  // 仅当从左边缘附近按下，且当前界面确有返回键时才跟踪。
  const hasBackTarget = Boolean(elements.viewerDialog?.open) || Boolean(state.currentFolderId);
  if (hasBackTarget && touch.clientX <= EDGE_BACK_START_ZONE) {
    edgeBackTracking = { x: touch.clientX, y: touch.clientY };
  } else {
    edgeBackTracking = null;
  }
}

function handleEdgeBackTouchEnd(event) {
  if (state.annotationMode) {
    edgeBackTracking = null;
    return;
  }
  if (!edgeBackTracking) {
    return;
  }
  const touch = event.changedTouches && event.changedTouches[0];
  const start = edgeBackTracking;
  edgeBackTracking = null;
  if (!touch) {
    return;
  }
  const dx = touch.clientX - start.x;
  const dy = Math.abs(touch.clientY - start.y);
  if (dx >= EDGE_BACK_MIN_DX && dy <= dx * EDGE_BACK_MAX_ANGLE_RATIO) {
    triggerEdgeBack();
  }
}

function isStandaloneMode() {
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator.standalone === true
  );
}

function isAndroidDevice() {
  const ua = window.navigator?.userAgent || "";
  const platform = window.navigator?.userAgentData?.platform || "";
  return /Android/i.test(ua) || platform.toLowerCase() === "android";
}

function updateInstallButtonVisibility() {
  if (!elements.installAppButton) {
    return;
  }
  elements.installAppButton.hidden = isStandaloneMode() || (!state.installPrompt && !isAndroidDevice());
  refreshIcons();
}

// PWA 显示模式调试：用于排查 bottom-nav 离屏幕底部距离的问题。
function logLayoutDebug() {
  const isStandalone = isStandaloneMode();

  console.log("[layout-debug] isStandalone:", isStandalone);
  console.log("[layout-debug] innerHeight:", window.innerHeight);
  console.log("[layout-debug] visualViewport.height:", window.visualViewport?.height);
  console.log("[layout-debug] safe area bottom should be checked in CSS env");

  if (!isStandalone) {
    console.warn(
      "[layout-debug] 当前不是主屏幕 PWA 模式：Safari 浏览器底部工具栏不属于网页区域，bottom-nav 无法贴到手机物理屏幕底部。请将本站“添加到主屏幕”后从主屏图标打开。",
    );
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  logLayoutDebug();
  applyThemePreference(state.themeMode);
  bindElements();
  bindEvents();
  updateInstallButtonVisibility();
  setAppReady(false);
  registerServiceWorker();
  renderPending();
  refreshIcons();

  try {
    state.db = await openDatabase();
  } catch (error) {
    console.error(error);
    setAppReady(true);
    setStatus("本地谱夹读取失败，请确认浏览器允许本地存储。", true);
    return;
  }

  // 有记住的账号时，启动期间标记“正在恢复账号”，避免首屏空列表误显示“还没有歌谱”。
  state.authRestoring = Boolean(getRememberedAccountIds().length);
  // 列表加载失败也不能阻断自动登录：loadScores 单独 try，账号恢复始终执行。
  try {
    await loadScores();
  } catch (error) {
    console.error("启动加载歌谱失败", error);
  }
  setAppReady(true);
  setStatus("");
  updateAccountUi();
  refreshOutboxCounts();
  // 明确的启动账号恢复流程：自动恢复登录 + 必要时轻量拉取云端歌谱。
  restoreStartupAuthSession();
  // 每月 1 号自动弹出“支持作者”页面（稍延迟，等首屏稳定）。
  window.setTimeout(() => {
    try {
      maybeShowMonthlySupportPrompt();
    } catch (error) {
      console.warn("支持作者月度提示失败（忽略）", error);
    }
  }, 1500);
});

function setAppReady(ready) {
  state.appReady = Boolean(ready);
  document.body?.classList.toggle("app-ready", state.appReady);
  document.body?.classList.toggle("app-booting", !state.appReady);
  [
    elements.addScoreButton,
    ...(elements.bulkDeleteButtons || []),
    elements.shareScoresButton,
    elements.importShareButton,
    elements.createSetlistButton,
  ].forEach((button) => {
    if (button) {
      button.disabled = !state.appReady;
    }
  });
}

function ensureAppReady(message = "正在读取谱夹，请稍后再试。") {
  if (state.appReady && state.db) {
    return true;
  }

  // 启动已完成但本地数据库不可用（连接卡死/打开失败）：弹出可一键重试的恢复弹窗，
  // 而不仅是一句容易被忽略的提示。删除/编辑/添加/建歌单等写操作都经此判断。
  if (state.appReady && !state.db) {
    showDatabaseRecoveryDialog();
  } else if (message) {
    setStatus(message, true);
  }
  return false;
}

// 有界只读自检：连接可用则成功，卡死/不可用则抛错。noRetry 避免触发重连/弹窗副作用。
async function probeLocalDatabase() {
  await runIdbTransaction(
    STORE_NAME,
    "readonly",
    (store) => {
      store.count();
    },
    { timeoutMs: 6000, noRetry: true },
  );
}

// 恢复本地数据库：先用现有/正在打开的连接自检（多数“启动竞态/短暂卡顿”此步即可恢复，
// 不会粗暴地反复 close+open 造成连接抖动）；自检失败再强制重连。返回是否恢复成功。
async function recoverLocalDatabase() {
  try {
    await ensureDatabaseReady();
    await probeLocalDatabase();
    if (!state.appReady) {
      setAppReady(true);
    }
    return true;
  } catch (error) {
    console.warn("数据库自检失败，尝试重连", error);
  }
  try {
    await reopenDatabase();
    await probeLocalDatabase();
    if (!state.appReady) {
      setAppReady(true);
    }
    return true;
  } catch (error) {
    console.warn("数据库重连失败", error);
    return false;
  }
}

// 回到前台时静默自检/重连数据库：iOS/PWA 退后台后连接常被系统冻结而卡死，提前恢复可避免“点了没反应”。
// 仅在启动完成后执行，避免与首屏正在进行的数据库打开抢资源。
async function handleForegroundDatabaseRecovery() {
  if (document.visibilityState !== "visible" || !state.appReady) {
    return;
  }
  try {
    await ensureDatabaseReady();
    await probeLocalDatabase();
  } catch (error) {
    console.warn("前台数据库自检失败，尝试重连", error);
    try {
      await reopenDatabase();
    } catch (reopenError) {
      console.warn(reopenError);
    }
  }
}

const DB_RECOVERY_DEFAULT_TEXT =
  "本地数据库暂时未响应。点击“重试”会重置本地存储、从云端恢复数据，并继续刚才的操作。";

function showDatabaseRecoveryDialog(message, options = {}) {
  const dialog = elements.dbRecoveryDialog;
  if (!dialog) {
    return;
  }
  if (Object.prototype.hasOwnProperty.call(options, "pendingAction")) {
    state.dbRecoveryPendingAction = options.pendingAction || null;
  } else if (!dialog.open) {
    state.dbRecoveryPendingAction = null;
  }
  // 用户刚点过“稍后”的短时间内不反复打扰。
  if (!options.force && !dialog.open && state.dbRecoveryDismissedAt && Date.now() - state.dbRecoveryDismissedAt < 20000) {
    return;
  }
  if (elements.dbRecoveryText) {
    elements.dbRecoveryText.textContent = message || DB_RECOVERY_DEFAULT_TEXT;
  }
  if (elements.dbRecoveryRetryButton) {
    elements.dbRecoveryRetryButton.disabled = false;
  }
  if (dialog.open) {
    return;
  }
  openDialogSafely(dialog);
  refreshIcons();
}

function hideDatabaseRecoveryDialog() {
  closeDialogSafely(elements.dbRecoveryDialog);
}

function dismissDatabaseRecoveryDialog() {
  state.dbRecoveryDismissedAt = Date.now();
  state.dbRecoveryPendingAction = null;
  hideDatabaseRecoveryDialog();
}

function isRecoverableDatabaseError(error) {
  if (!error) {
    return false;
  }
  const message = error?.message || "";
  return message !== "当前操作正在进行，请稍候。" && (shouldRetryIdbTransaction(error) || isLocalDatabaseNotReadyError(error));
}

// 在“用户主动写操作整体失败”时调用：仅当错误确属本地库卡死/超时/不可用才弹恢复弹窗，
// 普通校验/业务错误不弹。由各操作的最终 catch 调用，避免中途事务抖动就过早误弹。
function showRecoveryDialogIfDbWedged(error, options = {}) {
  if (isRecoverableDatabaseError(error)) {
    showDatabaseRecoveryDialog(options.message, options);
  }
}

async function handleDatabaseRecoveryRetry() {
  if (state.dbRecoveryBusy) {
    return;
  }
  const pendingAction = state.dbRecoveryPendingAction;
  if (pendingAction?.type === "deleteScores") {
    await resetDatabaseAndReplayDelete(pendingAction);
    return;
  }
  await handleDatabaseReset({ skipConfirm: true });
}

async function resetDatabaseAndReplayDelete(action) {
  if (!state.session) {
    if (elements.dbRecoveryText) {
      elements.dbRecoveryText.textContent = "未登录，无法从云端恢复。请先登录账号后再重试。";
    }
    setStatus("请先登录后再从云端恢复。", true);
    return;
  }
  const button = elements.dbRecoveryRetryButton;
  const buttons = [elements.dbRecoveryRetryButton, elements.dbRecoveryLaterButton].filter(Boolean);
  state.dbRecoveryBusy = true;
  buttons.forEach((item) => {
    item.disabled = true;
  });
  if (elements.dbRecoveryText) {
    elements.dbRecoveryText.textContent = "正在重置本地存储并从云端恢复，随后会继续删除...";
  }
  try {
    await resetLocalDatabaseAndResync();
    state.dbRecoveryDismissedAt = 0;
    hideDatabaseRecoveryDialog();
    const scoreIds = Array.from(new Set((action.scoreIds || []).filter(Boolean).map(String)));
    state.dbRecoveryPendingAction = null;
    if (scoreIds.length) {
      setStatus("本地存储已重置，正在重新执行删除...");
      await deleteScoresStable(scoreIds, {
        skipConfirm: true,
        autoRetried: true,
        fromRecoveryDialog: true,
        suppressRecoveryDialog: true,
      });
    } else {
      setStatus("本地存储已重置并从云端恢复。");
    }
  } catch (error) {
    console.error("恢复后重试删除失败", error);
    if (elements.dbRecoveryText) {
      elements.dbRecoveryText.textContent =
        "重试失败：" + (getErrorMessage(error) || "请彻底关闭 App 后再试，或卸载并重新添加 PWA。");
    }
    setStatus(getErrorMessage(error) || "重试删除失败，请稍后再试。", true);
  } finally {
    state.dbRecoveryBusy = false;
    buttons.forEach((item) => {
      item.disabled = false;
    });
  }
}

// 彻底删除本地数据库（连接卡死/损坏到“怎么都救不回”时使用）。带超时与 onblocked 兜底，绝不悬挂。
async function deleteLocalDatabase() {
  try {
    state.db?.close();
  } catch (error) {
    console.warn(error);
  }
  state.db = null;
  reopenDatabasePromise = null;
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer = 0;
    const finish = (callback) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timer);
      callback();
    };
    let request;
    try {
      request = indexedDB.deleteDatabase(DB_NAME);
    } catch (error) {
      reject(error);
      return;
    }
    timer = window.setTimeout(() => {
      finish(() => reject(createNamedError("TimeoutError", "清除本地数据库超时，请稍后重试。")));
    }, 10000);
    request.onsuccess = () => finish(() => resolve());
    request.onerror = () =>
      finish(() => reject(request.error || createNamedError("AbortError", "清除本地数据库失败。")));
    request.onblocked = () =>
      finish(() => reject(createNamedError("BlockedError", "本地数据库被占用，请彻底关闭其它标签页后重试。")));
  });
}

function clearInMemoryDataState() {
  try {
    revokeAllUrls();
  } catch (error) {
    console.warn(error);
  }
  state.scores = [];
  state.scorePages = [];
  state.folders = [];
  state.setlists = [];
  state.setlistItems = [];
  state.annotationRecords.clear();
  state.currentFolderId = null;
}

// 彻底重置本地存储并从云端恢复：删库重建 → 清内存 → 重新认领 + 拉取云端 → 重新加载渲染。
// 已登录时本地清空是安全的（云端有数据）；未登录时调用方需先拦截。
async function resetLocalDatabaseAndResync() {
  await deleteLocalDatabase();
  state.db = await openDatabase();
  setAppReady(true);
  clearInMemoryDataState();

  if (state.session && state.cloudReady) {
    try {
      await claimLocalRecordsForUser(state.session.user.id);
    } catch (error) {
      console.warn("认领云端记录失败", error);
    }
    try {
      await pullCloudMetadataForCurrentAccount();
    } catch (error) {
      console.warn("拉取云端元数据失败", error);
    }
  }

  await loadScores();
  try {
    renderScores();
    renderSetlists();
  } catch (error) {
    console.warn(error);
  }
  if (state.session) {
    queueAccountBackgroundSync(state.session.user.id);
    kickOutbox(1500);
  }
}

async function handleDatabaseReset(options = {}) {
  if (!state.session) {
    if (elements.dbRecoveryText) {
      elements.dbRecoveryText.textContent = "未登录，无法从云端恢复。请先登录账号后再重置，否则会永久丢失本机歌谱。";
    }
    setStatus("请先登录后再重置（未登录时重置会永久丢失本机歌谱）。", true);
    return;
  }
  if (!options.skipConfirm) {
    const confirmed = await requestDeleteConfirmation({
      title: "彻底重置本地存储？",
      message: "将清空本机本地数据并从云端重新下载。未同步到云端的本地改动会丢失；已登录账号的歌谱会自动恢复。",
    });
    if (!confirmed) {
      return;
    }
  }
  const buttons = [
    elements.dbRecoveryRetryButton,
    elements.dbRecoveryLaterButton,
  ];
  buttons.forEach((b) => {
    if (b) {
      b.disabled = true;
    }
  });
  if (elements.dbRecoveryText) {
    elements.dbRecoveryText.textContent = "正在重置并从云端恢复，请稍候（视歌谱数量可能需要一会儿）...";
  }
  try {
    await resetLocalDatabaseAndResync();
    state.dbRecoveryDismissedAt = 0;
    hideDatabaseRecoveryDialog();
    setStatus("已重置本地存储并从云端恢复。");
  } catch (error) {
    console.error("重置本地存储失败", error);
    if (elements.dbRecoveryText) {
      elements.dbRecoveryText.textContent =
        "重置失败：" + (getErrorMessage(error) || "请彻底关闭 App 后重试，或卸载并重新添加 PWA。");
    }
  } finally {
    buttons.forEach((b) => {
      if (b) {
        b.disabled = false;
      }
    });
  }
}

function openDialogSafely(dialog) {
  if (!dialog || dialog.open) {
    return;
  }

  try {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      return;
    }
  } catch (error) {
    console.warn(error);
  }

  dialog.setAttribute("open", "");
}

function closeDialogSafely(dialog) {
  if (!dialog) {
    return;
  }

  try {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
      return;
    }
  } catch (error) {
    console.warn(error);
  }

  dialog.removeAttribute("open");
}

function runAfterDialogClose(callback) {
  window.setTimeout(() => requestAnimationFrame(callback), 0);
}

async function withOperationLock(name, callback, options = {}) {
  if (operationLocks.has(name)) {
    throw new Error("当前操作正在进行，请稍候。");
  }

  operationLocks.add(name);
  const timeoutMs = options.timeoutMs || OPERATION_LOCK_TIMEOUT;
  const timeoutMessage = options.timeoutMessage || "操作耗时过长，已超时，请重试。";
  try {
    // 总超时兜底：即使内部某个 await 永不返回，锁也会在超时后释放、并向上抛出可提示的错误，
    // 确保任何操作锁都不会永久占用、按钮状态可恢复。
    return await withTimeout(Promise.resolve().then(() => callback()), timeoutMs, timeoutMessage);
  } finally {
    operationLocks.delete(name);
  }
}

// ===== 调号选择器：第一排升/降，第二排音名 C–B，组合成调号（如 ♯ + E → "#E"）=====

// 解析已有调号文本为 {accidental, note}，兼容旧的自由输入（#/♯/升、b/♭/降、大小写音名）。
function parseKeySignature(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return { accidental: "", note: "" };
  }
  let accidental = "";
  let rest = raw;
  if (/^(#|♯|升)/.test(rest)) {
    accidental = "#";
    rest = rest.replace(/^(#|♯|升)/, "");
  } else if (/^(b|♭|降)/i.test(rest)) {
    accidental = "b";
    rest = rest.replace(/^(b|♭|降)/i, "");
  }
  const noteMatch = rest.match(/[A-Ga-g]/);
  const note = noteMatch ? noteMatch[0].toUpperCase() : "";
  // 没有音名时升降无意义，视为未设置。
  return { accidental: note ? accidental : "", note };
}

function getKeyPickerInput(picker) {
  return picker?.parentElement?.querySelector('input[type="hidden"]') || null;
}

// 把隐藏 input 的值写成 accidental+note（无音名则为空字符串），并实时更新“调号”后的预览反馈。
function writeKeyPickerValue(picker) {
  const input = getKeyPickerInput(picker);
  const accidental = picker.querySelector(".key-chip-accidental.is-active")?.dataset.keyAccidental || "";
  const note = picker.querySelector("[data-key-note].is-active")?.dataset.keyNote || "";
  const value = note ? `${accidental}${note}` : "";
  if (input) {
    input.value = value;
  }
  // 实时反馈：在“调号”标题后显示当前选中的字符；为空时由 CSS 显示提示文案。
  const preview = picker.parentElement?.querySelector("[data-key-preview]");
  if (preview) {
    preview.textContent = value;
  }
}

// 按给定值设置选中态并同步隐藏 input（用于编辑回显、新增/重置清空）。
function applyKeyPickerValue(picker, value) {
  if (!picker) {
    return;
  }
  const { accidental, note } = parseKeySignature(value);
  picker.querySelectorAll(".key-chip").forEach((chip) => {
    const isActive = chip.dataset.keyAccidental
      ? Boolean(accidental) && chip.dataset.keyAccidental === accidental
      : chip.dataset.keyNote === note && Boolean(note);
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  writeKeyPickerValue(picker);
}

// 绑定点选交互：升/降互斥可取消，音名单选可取消，每次点击后重算隐藏 input 的值。
function setupKeyPicker(picker) {
  if (!picker || picker.dataset.bound === "1") {
    return;
  }
  picker.dataset.bound = "1";
  picker.addEventListener("click", (event) => {
    const chip = event.target.closest(".key-chip");
    if (!chip || !picker.contains(chip)) {
      return;
    }
    // 清除按钮：一键清空升降与音名。
    if (chip.dataset.keyClear !== undefined) {
      applyKeyPickerValue(picker, "");
      return;
    }
    const group = chip.dataset.keyAccidental ? ".key-chip-accidental" : "[data-key-note]";
    const wasActive = chip.classList.contains("is-active");
    picker.querySelectorAll(group).forEach((sibling) => {
      sibling.classList.remove("is-active");
      sibling.setAttribute("aria-pressed", "false");
    });
    if (!wasActive) {
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
    }
    writeKeyPickerValue(picker);
  });
}

function bindElements() {
  elements.appShell = document.querySelector(".app-shell");
  const versionTag = document.querySelector("#appVersionTag");
  if (versionTag) {
    versionTag.textContent = `版本 ${APP_BUILD}`;
  }
  elements.topbar = document.querySelector(".topbar");
  elements.appTitle = document.querySelector("#appTitle");
  elements.librarySummary = document.querySelector("#librarySummary");
  elements.libraryScreen = document.querySelector("#libraryScreen");
  elements.setlistScreen = document.querySelector("#setlistScreen");
  elements.myScreen = document.querySelector("#myScreen");
  elements.navLibraryButton = document.querySelector("#navLibraryButton");
  elements.navSetlistsButton = document.querySelector("#navSetlistsButton");
  elements.navMineButton = document.querySelector("#navMineButton");
  elements.bottomNav = document.querySelector(".bottom-nav");
  elements.myProfileButton = document.querySelector("#myProfileButton");
  elements.preferencesButton = document.querySelector("#preferencesButton");
  elements.usageGuideButton = document.querySelector("#usageGuideButton");
  elements.usageGuideScreen = document.querySelector("#usageGuideScreen");
  elements.closeUsageGuideButton = document.querySelector("#closeUsageGuideButton");
  elements.supportAuthorButton = document.querySelector("#supportAuthorButton");
  elements.supportAuthorScreen = document.querySelector("#supportAuthorScreen");
  elements.closeSupportAuthorButton = document.querySelector("#closeSupportAuthorButton");
  elements.supportDeclineButton = document.querySelector("#supportDeclineButton");
  elements.supportAcceptButton = document.querySelector("#supportAcceptButton");
  elements.supportPayDialog = document.querySelector("#supportPayDialog");
  elements.supportPaySurface = document.querySelector("#supportPaySurface");
  elements.supportPayCloseButton = document.querySelector("#supportPayCloseButton");
  elements.supportPayWechatTab = document.querySelector("#supportPayWechatTab");
  elements.supportPayAlipayTab = document.querySelector("#supportPayAlipayTab");
  elements.supportPayWechatImg = document.querySelector("#supportPayWechatImg");
  elements.supportPayAlipayImg = document.querySelector("#supportPayAlipayImg");
  elements.supportPaySaveButton = document.querySelector("#supportPaySaveButton");
  elements.supportPayHint = document.querySelector("#supportPayHint");
  elements.supportPayHintLine1 = document.querySelector("#supportPayHintLine1");
  elements.dbRecoveryDialog = document.querySelector("#dbRecoveryDialog");
  elements.dbRecoveryText = document.querySelector("#dbRecoveryText");
  elements.dbRecoveryRetryButton = document.querySelector("#dbRecoveryRetryButton");
  elements.dbRecoveryLaterButton = document.querySelector("#dbRecoveryLaterButton");
  elements.myAuthState = document.querySelector("#myAuthState");
  elements.myAuthButton = document.querySelector("#myAuthButton");
  elements.syncOutboxPanel = document.querySelector("#syncOutboxPanel");
  elements.syncOutboxState = document.querySelector("#syncOutboxState");
  elements.retryOutboxButton = document.querySelector("#retryOutboxButton");
  elements.myAuthButtonText = document.querySelector("#myAuthButtonText");
  elements.preferencesScreen = document.querySelector("#preferencesScreen");
  elements.closePreferencesButton = document.querySelector("#closePreferencesButton");
  elements.viewerModeButtons = Array.from(document.querySelectorAll("[data-viewer-mode]"));
  elements.themeModeButtons = Array.from(document.querySelectorAll("[data-theme-mode]"));
  elements.recycleBinButton = document.querySelector("#recycleBinButton");
  elements.recycleBinScreen = document.querySelector("#recycleBinScreen");
  elements.closeRecycleBinButton = document.querySelector("#closeRecycleBinButton");
  elements.emptyRecycleBinButton = document.querySelector("#emptyRecycleBinButton");
  elements.recycleBinState = document.querySelector("#recycleBinState");
  elements.recycleBinList = document.querySelector("#recycleBinList");
  elements.backupButton = document.querySelector("#backupButton");
  elements.backupScreen = document.querySelector("#backupScreen");
  elements.closeBackupButton = document.querySelector("#closeBackupButton");
  elements.exportBackupButton = document.querySelector("#exportBackupButton");
  elements.importBackupButton = document.querySelector("#importBackupButton");
  elements.importBackupInput = document.querySelector("#importBackupInput");
  elements.backupStatus = document.querySelector("#backupStatus");
  elements.libraryTitle = document.querySelector("#libraryTitle");
  elements.folderBackButton = document.querySelector("#folderBackButton");
  elements.bulkDeleteButtons = Array.from(document.querySelectorAll(".bulk-delete-trigger"));
  elements.topbarBulkDeleteButton = document.querySelector("#topbarBulkDeleteButton");
  elements.libraryBulkDeleteButton = document.querySelector("#libraryBulkDeleteButton");
  elements.uploadScreen = document.querySelector("#uploadScreen");
  elements.resultCount = document.querySelector("#resultCount");
  elements.scoreGrid = document.querySelector("#scoreGrid");
  elements.searchInput = document.querySelector("#searchInput");
  elements.libraryStorageUsage = document.querySelector("#libraryStorageUsage");
  elements.clearSearchButton = document.querySelector("#clearSearchButton");
  elements.libraryFilterButtons = Array.from(document.querySelectorAll("[data-library-filter]"));
  elements.scoreSortSelect = document.querySelector("#scoreSortSelect");
  elements.setlistSummary = document.querySelector("#setlistSummary");
  elements.setlistList = document.querySelector("#setlistList");
  elements.createSetlistButton = document.querySelector("#createSetlistButton");
  elements.setlistDialog = document.querySelector("#setlistDialog");
  elements.setlistForm = document.querySelector("#setlistForm");
  elements.setlistDialogTitle = document.querySelector("#setlistDialogTitle");
  elements.setlistName = document.querySelector("#setlistName");
  elements.setlistDate = document.querySelector("#setlistDate");
  elements.setlistScene = document.querySelector("#setlistScene");
  elements.setlistScoreSearch = document.querySelector("#setlistScoreSearch");
  elements.setlistScorePicker = document.querySelector("#setlistScorePicker");
  elements.setlistOrderList = document.querySelector("#setlistOrderList");
  elements.setlistDialogState = document.querySelector("#setlistDialogState");
  elements.closeSetlistButton = document.querySelector("#closeSetlistButton");
  elements.cancelSetlistButton = document.querySelector("#cancelSetlistButton");
  elements.saveSetlistButton = document.querySelector("#saveSetlistButton");
  elements.deleteSetlistButton = document.querySelector("#deleteSetlistButton");
  elements.syncNowButton = document.querySelector("#syncNowButton");
  elements.shareScoresButton = document.querySelector("#shareScoresButton");
  elements.importShareButton = document.querySelector("#importShareButton");
  elements.accountButton = document.querySelector("#accountButton");
  elements.accountButtonText = document.querySelector("#accountButtonText");
  elements.authDialog = document.querySelector("#authDialog");
  elements.authForm = document.querySelector("#authForm");
  elements.authDialogTitle = document.querySelector("#authDialogTitle");
  elements.authBackButton = document.querySelector("#authBackButton");
  elements.authLoggedInPane = document.querySelector("#authLoggedInPane");
  elements.authGuestPane = document.querySelector("#authGuestPane");
  elements.authLoginPane = document.querySelector("#authLoginPane");
  elements.authRegisterChoicePane = document.querySelector("#authRegisterChoicePane");
  elements.authRegisterCodePane = document.querySelector("#authRegisterCodePane");
  elements.authRegisterPasswordPane = document.querySelector("#authRegisterPasswordPane");
  elements.authEmail = document.querySelector("#authEmail");
  elements.authPassword = document.querySelector("#authPassword");
  elements.authState = document.querySelector("#authState");
  elements.closeAuthButton = document.querySelector("#closeAuthButton");
  elements.signOutButton = document.querySelector("#signOutButton");
  elements.signUpButton = document.querySelector("#signUpButton");
  elements.signInButton = document.querySelector("#signInButton");
  elements.loginChoiceButton = document.querySelector("#loginChoiceButton");
  elements.registerPhoneOption = document.querySelector("#registerPhoneOption");
  elements.registerEmailOption = document.querySelector("#registerEmailOption");
  elements.registerContactLabel = document.querySelector("#registerContactLabel");
  elements.registerContactInput = document.querySelector("#registerContactInput");
  elements.sendRegisterCodeButton = document.querySelector("#sendRegisterCodeButton");
  elements.registerCodeInput = document.querySelector("#registerCodeInput");
  elements.nextRegisterPasswordButton = document.querySelector("#nextRegisterPasswordButton");
  elements.registerPassword = document.querySelector("#registerPassword");
  elements.registerPasswordConfirm = document.querySelector("#registerPasswordConfirm");
  elements.completeRegisterButton = document.querySelector("#completeRegisterButton");
  elements.profileScreen = document.querySelector("#profileScreen");
  elements.profileForm = document.querySelector("#profileForm");
  elements.profileState = document.querySelector("#profileState");
  elements.profileNickname = document.querySelector("#profileNickname");
  elements.profileGender = document.querySelector("#profileGender");
  elements.profileGenderButtons = Array.from(document.querySelectorAll("[data-gender-value]"));
  elements.profileBirthday = document.querySelector("#profileBirthday");
  elements.profileBirthdayButton = document.querySelector("#profileBirthdayButton");
  elements.profileBirthdayDisplay = document.querySelector("#profileBirthdayDisplay");
  elements.profilePhoneButton = document.querySelector("#profilePhoneButton");
  elements.profileEmailButton = document.querySelector("#profileEmailButton");
  elements.closeProfileButton = document.querySelector("#closeProfileButton");
  elements.saveProfileButton = document.querySelector("#saveProfileButton");
  elements.profileLinkDialog = document.querySelector("#profileLinkDialog");
  elements.profileLinkForm = document.querySelector("#profileLinkForm");
  elements.profileLinkDialogTitle = document.querySelector("#profileLinkDialogTitle");
  elements.profileLinkState = document.querySelector("#profileLinkState");
  elements.profileLinkPassword = document.querySelector("#profileLinkPassword");
  elements.profileLinkContactLabel = document.querySelector("#profileLinkContactLabel");
  elements.profileLinkContact = document.querySelector("#profileLinkContact");
  elements.sendProfileLinkCodeButton = document.querySelector("#sendProfileLinkCodeButton");
  elements.profileLinkCode = document.querySelector("#profileLinkCode");
  elements.confirmProfileLinkButton = document.querySelector("#confirmProfileLinkButton");
  elements.closeProfileLinkButton = document.querySelector("#closeProfileLinkButton");
  elements.birthdayDialog = document.querySelector("#birthdayDialog");
  elements.birthdayMessage = document.querySelector("#birthdayMessage");
  elements.birthdayCloseButton = document.querySelector("#birthdayCloseButton");
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
  elements.shareSearchInput = document.querySelector("#shareSearchInput");
  elements.shareSelectAll = document.querySelector("#shareSelectAll");
  elements.shareCodePanel = document.querySelector("#shareCodePanel");
  elements.shareCodeText = document.querySelector("#shareCodeText");
  elements.copyShareCodeButton = document.querySelector("#copyShareCodeButton");
  elements.shareDialogStatus = document.querySelector("#shareDialogStatus");
  elements.closeShareButton = document.querySelector("#closeShareButton");
  elements.createShareButton = document.querySelector("#createShareButton");
  elements.importShareDialog = document.querySelector("#importShareDialog");
  elements.importShareForm = document.querySelector("#importShareForm");
  elements.shareCodeInput = document.querySelector("#shareCodeInput");
  elements.closeImportShareButton = document.querySelector("#closeImportShareButton");
  elements.importShareSubmitButton = document.querySelector("#importShareSubmitButton");
  elements.installAppButton = document.querySelector("#installAppButton");
  elements.addScoreButton = document.querySelector("#addScoreButton");
  elements.addScoreButtonArt = document.querySelector(".fab-art");
  elements.addChoiceDialog = document.querySelector("#addChoiceDialog");
  elements.chooseFolderButton = document.querySelector("#chooseFolderButton");
  elements.chooseScoreButton = document.querySelector("#chooseScoreButton");
  elements.folderDialog = document.querySelector("#folderDialog");
  elements.folderForm = document.querySelector("#folderForm");
  elements.folderDialogTitle = document.querySelector("#folderDialogTitle");
  elements.folderName = document.querySelector("#folderName");
  elements.cancelFolderButton = document.querySelector("#cancelFolderButton");
  elements.saveFolderButton = document.querySelector("#saveFolderButton");
  elements.folderSaveButtonText = document.querySelector("#folderSaveButtonText");
  elements.folderActionDialog = document.querySelector("#folderActionDialog");
  elements.folderActionTitle = document.querySelector("#folderActionTitle");
  elements.folderActionEditButton = document.querySelector("#folderActionEditButton");
  elements.folderActionDeleteButton = document.querySelector("#folderActionDeleteButton");
  elements.closeFolderActionButton = document.querySelector("#closeFolderActionButton");
  elements.scoreActionDialog = document.querySelector("#scoreActionDialog");
  elements.scoreActionTitle = document.querySelector("#scoreActionTitle");
  elements.scoreActionEditButton = document.querySelector("#scoreActionEditButton");
  elements.scoreActionMoveButton = document.querySelector("#scoreActionMoveButton");
  elements.scoreActionPagesButton = document.querySelector("#scoreActionPagesButton");
  elements.scoreActionDeleteButton = document.querySelector("#scoreActionDeleteButton");
  elements.closeScoreActionButton = document.querySelector("#closeScoreActionButton");
  elements.pageManagerDialog = document.querySelector("#pageManagerDialog");
  elements.pageManagerTitle = document.querySelector("#pageManagerTitle");
  elements.pageManagerState = document.querySelector("#pageManagerState");
  elements.pageManagerList = document.querySelector("#pageManagerList");
  elements.closePageManagerButton = document.querySelector("#closePageManagerButton");
  elements.appendPageButton = document.querySelector("#appendPageButton");
  elements.appendPageInput = document.querySelector("#appendPageInput");
  elements.replacePageInput = document.querySelector("#replacePageInput");
  elements.scoreEditDialog = document.querySelector("#scoreEditDialog");
  elements.scoreEditForm = document.querySelector("#scoreEditForm");
  elements.scoreEditTitle = document.querySelector("#scoreEditTitle");
  elements.scoreEditState = document.querySelector("#scoreEditState");
  elements.scoreEditName = document.querySelector("#scoreEditName");
  elements.scoreEditFolder = document.querySelector("#scoreEditFolder");
  elements.scoreEditFolderPicker = document.querySelector("#scoreEditFolderPicker");
  elements.scoreEditFolderButton = document.querySelector("#scoreEditFolderButton");
  elements.scoreEditFolderLabel = document.querySelector("#scoreEditFolderLabel");
  elements.scoreEditFolderOptions = document.querySelector("#scoreEditFolderOptions");
  elements.scoreEditKey = document.querySelector("#scoreEditKey");
  elements.scoreEditKeyPicker = document.querySelector("#scoreEditKeyPicker");
  elements.scoreEditNotes = document.querySelector("#scoreEditNotes");
  elements.closeScoreEditButton = document.querySelector("#closeScoreEditButton");
  elements.cancelScoreEditButton = document.querySelector("#cancelScoreEditButton");
  elements.saveScoreEditButton = document.querySelector("#saveScoreEditButton");
  elements.scoreEditSaveText = document.querySelector("#scoreEditSaveText");
  elements.closeAddButton = document.querySelector("#closeAddButton");
  elements.scoreForm = document.querySelector("#scoreForm");
  elements.scoreName = document.querySelector("#scoreName");
  elements.scoreFolder = document.querySelector("#scoreFolder");
  elements.scoreFolderPicker = document.querySelector("#scoreFolderPicker");
  elements.scoreFolderButton = document.querySelector("#scoreFolderButton");
  elements.scoreFolderLabel = document.querySelector("#scoreFolderLabel");
  elements.scoreFolderOptions = document.querySelector("#scoreFolderOptions");
  elements.scoreKey = document.querySelector("#scoreKey");
  elements.scoreKeyPicker = document.querySelector("#scoreKeyPicker");
  elements.scoreNotes = document.querySelector("#scoreNotes");
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
  elements.deleteDialogTitle = document.querySelector("#deleteDialogTitle");
  elements.deleteDialogMessage = document.querySelector("#deleteDialogMessage");
  elements.cancelDeleteButton = document.querySelector("#cancelDeleteButton");
  elements.confirmDeleteButton = document.querySelector("#confirmDeleteButton");
  elements.bulkDeleteDialog = document.querySelector("#bulkDeleteDialog");
  elements.bulkDeleteList = document.querySelector("#bulkDeleteList");
  elements.bulkDeleteState = document.querySelector("#bulkDeleteState");
  elements.bulkDeleteSelectAll = document.querySelector("#bulkDeleteSelectAll");
  elements.closeBulkDeleteButton = document.querySelector("#closeBulkDeleteButton");
  elements.cancelBulkDeleteButton = document.querySelector("#cancelBulkDeleteButton");
  elements.confirmBulkDeleteButton = document.querySelector("#confirmBulkDeleteButton");
  elements.viewerDialog = document.querySelector("#viewerDialog");
  elements.viewerTitle = document.querySelector("#viewerTitle");
  elements.viewerKeySignature = document.querySelector("#viewerKeySignature");
  elements.viewerPageIndicator = document.querySelector("#viewerPageIndicator");
  elements.viewerPerformanceButton = document.querySelector("#viewerPerformanceButton");
  elements.viewerPerformanceText = document.querySelector("#viewerPerformanceText");
  elements.viewerFavoriteButton = document.querySelector("#viewerFavoriteButton");
  elements.viewerPianoButton = document.querySelector("#viewerPianoButton");
  elements.viewerPianoPanel = document.querySelector("#viewerPianoPanel");
  elements.viewerPiano = document.querySelector("#viewerPiano");
  elements.viewerMetronomeButton = document.querySelector("#viewerMetronomeButton");
  elements.viewerMetronomePanel = document.querySelector("#viewerMetronomePanel");
  elements.metronomePlayButton = document.querySelector("#metronomePlayButton");
  elements.metronomeMinusButton = document.querySelector("#metronomeMinusButton");
  elements.metronomePlusButton = document.querySelector("#metronomePlusButton");
  elements.metronomeBpmValue = document.querySelector("#metronomeBpmValue");
  elements.metronomeBeats = document.querySelector("#metronomeBeats");
  elements.metronomeSlider = document.querySelector("#metronomeSlider");
  elements.metronomeMeterOptions = document.querySelector("#metronomeMeterOptions");
  elements.viewerAnnotationButton = document.querySelector("#viewerAnnotationButton");
  elements.viewerNativeAnnotationButton = document.querySelector("#viewerNativeAnnotationButton");
  elements.viewerMore = document.querySelector(".viewer-more");
  elements.viewerMoreButton = document.querySelector("#viewerMoreButton");
  elements.viewerMoreMenu = document.querySelector("#viewerMoreMenu");
  elements.viewerBackButton = document.querySelector("#viewerBackButton");
  elements.viewerPages = document.querySelector("#viewerPages");
  elements.annotationToolbar = document.querySelector("#annotationToolbar");
  elements.annotationToolButtons = Array.from(document.querySelectorAll("[data-annotation-tool]"));
  elements.annotationColorInput = document.querySelector("#annotationColorInput");
  elements.annotationSizeInput = document.querySelector("#annotationSizeInput");
  elements.annotationUndoButton = document.querySelector("#annotationUndoButton");
  elements.annotationRedoButton = document.querySelector("#annotationRedoButton");
  elements.annotationClearButton = document.querySelector("#annotationClearButton");
  elements.annotationToggleVisibilityButton = document.querySelector("#annotationToggleVisibilityButton");
  elements.annotationDoneButton = document.querySelector("#annotationDoneButton");
}

function bindEvents() {
  elements.appShell.addEventListener("touchstart", handleAppTouchStart, { passive: true });
  elements.appShell.addEventListener("touchmove", handleAppTouchMove, { passive: false });
  setupKeyPicker(elements.scoreKeyPicker);
  setupKeyPicker(elements.scoreEditKeyPicker);
  elements.cameraButton.addEventListener("click", () => openFilePicker(elements.cameraInput));
  elements.galleryButton.addEventListener("click", () => openFilePicker(elements.galleryInput));
  elements.fileButton.addEventListener("click", () => openFilePicker(elements.fileInput));

  [elements.cameraInput, elements.galleryInput, elements.fileInput].forEach((input) => {
    input.addEventListener("change", () => addPendingFiles(input.files));
  });

  elements.scoreName.addEventListener("input", updateSaveState);
  elements.searchInput.addEventListener("input", renderScores);
  elements.bulkDeleteButtons.forEach((button) => button.addEventListener("click", openBulkDeleteDialog));
  elements.libraryFilterButtons?.forEach((button) => {
    button.addEventListener("click", () => setLibraryFilter(button.dataset.libraryFilter));
  });
  elements.scoreSortSelect?.addEventListener("change", () => setScoreSort(elements.scoreSortSelect.value));
  elements.navLibraryButton.addEventListener("click", () => switchMainTab("library"));
  elements.navSetlistsButton?.addEventListener("click", () => switchMainTab("setlists"));
  elements.navMineButton.addEventListener("click", () => switchMainTab("mine"));
  elements.createSetlistButton?.addEventListener("click", () => openSetlistDialog());
  elements.setlistForm?.addEventListener("submit", saveSetlist);
  elements.closeSetlistButton?.addEventListener("click", closeSetlistDialog);
  elements.cancelSetlistButton?.addEventListener("click", closeSetlistDialog);
  elements.deleteSetlistButton?.addEventListener("click", () => deleteSetlist(state.editingSetlistId));
  elements.setlistScoreSearch?.addEventListener("input", renderSetlistScorePicker);
  elements.setlistScorePicker?.addEventListener("change", handleSetlistPickerChange);
  elements.setlistScorePicker?.addEventListener("click", handleSetlistPickerClick);
  elements.setlistOrderList?.addEventListener("click", handleSetlistOrderAction);
  elements.setlistDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSetlistDialog();
  });
  elements.setlistDialog?.addEventListener("click", (event) => {
    if (event.target === elements.setlistDialog) {
      closeSetlistDialog();
    }
  });
  elements.myProfileButton.addEventListener("click", openProfileDialog);
  elements.myAuthButton.addEventListener("click", openAuthDialog);
  elements.preferencesButton.addEventListener("click", openPreferencesScreen);
  elements.usageGuideButton?.addEventListener("click", openUsageGuideScreen);
  elements.closeUsageGuideButton?.addEventListener("click", closeUsageGuideScreen);
  elements.supportAuthorButton?.addEventListener("click", () => openSupportAuthorScreen());
  elements.closeSupportAuthorButton?.addEventListener("click", closeSupportAuthorScreen);
  elements.supportDeclineButton?.addEventListener("click", closeSupportAuthorScreen);
  elements.supportAcceptButton?.addEventListener("click", openSupportPayDialog);
  elements.supportPayCloseButton?.addEventListener("click", closeSupportPayDialog);
  elements.supportPayWechatTab?.addEventListener("click", () => setSupportPayMethod("wechat"));
  elements.supportPayAlipayTab?.addEventListener("click", () => setSupportPayMethod("alipay"));
  elements.supportPaySaveButton?.addEventListener("click", saveSupportPayImage);
  elements.dbRecoveryRetryButton?.addEventListener("click", handleDatabaseRecoveryRetry);
  elements.dbRecoveryLaterButton?.addEventListener("click", dismissDatabaseRecoveryDialog);
  elements.dbRecoveryDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    dismissDatabaseRecoveryDialog();
  });
  [elements.supportPayWechatImg, elements.supportPayAlipayImg].forEach((img) => {
    img?.addEventListener("error", () => {
      if (img.dataset.fallbackApplied) {
        return;
      }
      img.dataset.fallbackApplied = "1";
      img.src = SUPPORT_PAY_PLACEHOLDER;
    });
  });
  elements.supportPayDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSupportPayDialog();
  });
  elements.supportPayDialog?.addEventListener("click", (event) => {
    if (event.target === elements.supportPayDialog) {
      closeSupportPayDialog();
    }
  });
  elements.closePreferencesButton?.addEventListener("click", closePreferencesScreen);
  elements.retryOutboxButton?.addEventListener("click", async () => {
    elements.retryOutboxButton.disabled = true;
    if (elements.syncOutboxState) {
      elements.syncOutboxState.textContent = "正在重试同步…";
    }
    try {
      await retryFailedOutboxTasks();
    } catch (error) {
      console.warn(error);
    } finally {
      elements.retryOutboxButton.disabled = false;
      refreshOutboxCounts();
    }
  });
  elements.recycleBinButton?.addEventListener("click", openRecycleBinScreen);
  elements.closeRecycleBinButton?.addEventListener("click", closeRecycleBinScreen);
  elements.emptyRecycleBinButton?.addEventListener("click", emptyRecycleBin);
  elements.backupButton?.addEventListener("click", openBackupScreen);
  elements.closeBackupButton?.addEventListener("click", closeBackupScreen);
  elements.exportBackupButton?.addEventListener("click", handleExportBackup);
  elements.importBackupButton?.addEventListener("click", () => openFilePicker(elements.importBackupInput));
  elements.importBackupInput?.addEventListener("change", (event) => {
    event.stopPropagation();
    handleImportBackup(elements.importBackupInput.files);
  });
  elements.viewerModeButtons?.forEach((button) => {
    button.addEventListener("click", () => setViewerModePreference(button.dataset.viewerMode));
  });
  elements.themeModeButtons?.forEach((button) => {
    button.addEventListener("click", () => setThemePreference(button.dataset.themeMode));
  });
  elements.clearSearchButton.addEventListener("click", () => {
    elements.searchInput.value = "";
    renderScores();
    elements.searchInput.blur();
  });
  elements.syncNowButton?.addEventListener("click", handleManualSync);
  elements.accountButton?.addEventListener("click", openAuthDialog);
  elements.closeAuthButton.addEventListener("click", closeAuthDialog);
  elements.authForm.addEventListener("submit", signInWithPassword);
  elements.authBackButton?.addEventListener("click", goBackInAuthDialog);
  elements.signUpButton.addEventListener("click", () => setAuthMode("registerChoice"));
  elements.loginChoiceButton?.addEventListener("click", () => setAuthMode("login"));
  elements.registerPhoneOption?.addEventListener("click", () => beginRegisterWithCode("phone"));
  elements.registerEmailOption?.addEventListener("click", () => beginRegisterWithCode("email"));
  elements.sendRegisterCodeButton?.addEventListener("click", sendRegisterCode);
  elements.nextRegisterPasswordButton?.addEventListener("click", continueToRegisterPassword);
  elements.completeRegisterButton?.addEventListener("click", completeRegisterWithPassword);
  elements.signOutButton.addEventListener("click", signOut);
  elements.profileForm?.addEventListener("submit", saveProfile);
  elements.closeProfileButton?.addEventListener("click", closeProfileDialog);
  elements.profileGenderButtons?.forEach((button) => {
    button.addEventListener("click", () => setProfileGender(button.dataset.genderValue || ""));
  });
  elements.profileBirthdayButton?.addEventListener("click", openProfileBirthdayPicker);
  elements.profileBirthday?.addEventListener("change", () => updateProfileBirthdayDisplay(elements.profileBirthday.value));
  elements.profilePhoneButton?.addEventListener("click", () => openProfileLinkDialog("phone"));
  elements.profileEmailButton?.addEventListener("click", () => openProfileLinkDialog("email"));
  elements.profileLinkForm?.addEventListener("submit", confirmProfileLink);
  elements.sendProfileLinkCodeButton?.addEventListener("click", sendProfileLinkCode);
  elements.closeProfileLinkButton?.addEventListener("click", closeProfileLinkDialog);
  elements.profileLinkDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProfileLinkDialog();
  });
  elements.birthdayCloseButton?.addEventListener("click", closeBirthdayPopup);
  elements.birthdayDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeBirthdayPopup();
  });
  elements.birthdayDialog?.addEventListener("click", (event) => {
    if (event.target === elements.birthdayDialog) {
      closeBirthdayPopup();
    }
  });
  elements.verifyForm?.addEventListener("submit", submitVerificationCode);
  elements.cancelVerifyButton?.addEventListener("click", () => closeVerifyDialog(""));
  elements.closeVerifyButton?.addEventListener("click", () => closeVerifyDialog(""));
  elements.verifyDialog?.addEventListener("cancel", (event) => {
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
  elements.shareSearchInput?.addEventListener("input", renderShareList);
  elements.shareSelectAll.addEventListener("change", handleShareSelectAllChange);
  elements.shareList.addEventListener("change", handleShareSelectionChange);
  elements.copyShareCodeButton?.addEventListener("click", copyShareCode);
  elements.importShareButton.addEventListener("click", openImportShareDialog);
  elements.closeImportShareButton.addEventListener("click", closeImportShareDialog);
  elements.importShareDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeImportShareDialog();
  });
  elements.importShareForm.addEventListener("submit", importSharedScores);
  elements.installAppButton.addEventListener("click", installApp);
  elements.addScoreButton.addEventListener("click", handleAddButtonClick);
  elements.addScoreButton.addEventListener("pointerdown", handleFabPointerDown);
  elements.addScoreButton.addEventListener("pointermove", handleFabPointerMove);
  elements.addScoreButton.addEventListener("pointerup", handleFabPointerEnd);
  elements.addScoreButton.addEventListener("pointercancel", handleFabPointerEnd);
  elements.addScoreButton.addEventListener("lostpointercapture", handleFabPointerEnd);
  if (elements.addScoreButtonArt) {
    if (elements.addScoreButtonArt.complete && elements.addScoreButtonArt.naturalWidth > 0) {
      elements.addScoreButton.classList.add("fab-image-ready");
    } else {
      elements.addScoreButtonArt.addEventListener("load", () => {
        elements.addScoreButton.classList.add("fab-image-ready");
      });
      elements.addScoreButtonArt.addEventListener("error", () => {
        elements.addScoreButton.classList.remove("fab-image-ready");
      });
    }
  }
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
  elements.closeFolderActionButton?.addEventListener("click", closeFolderActionDialog);
  elements.folderActionEditButton?.addEventListener("click", () => {
    const folderId = state.folderActionId;
    closeFolderActionDialog();
    openFolderDialog(folderId);
  });
  elements.folderActionDeleteButton?.addEventListener("click", () => {
    const folderId = state.folderActionId;
    closeFolderActionDialog();
    runAfterDialogClose(() => deleteFolder(folderId));
  });
  elements.folderActionDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeFolderActionDialog();
  });
  elements.folderActionDialog?.addEventListener("click", (event) => {
    if (event.target === elements.folderActionDialog) {
      closeFolderActionDialog();
    }
  });
  elements.closeScoreActionButton?.addEventListener("click", closeScoreActionDialog);
  elements.scoreActionEditButton?.addEventListener("click", () => {
    const scoreId = state.scoreActionId;
    closeScoreActionDialog();
    openScoreEditDialog(scoreId);
  });
  elements.scoreActionMoveButton?.addEventListener("click", () => {
    const scoreId = state.scoreActionId;
    closeScoreActionDialog();
    openScoreEditDialog(scoreId, { mode: "move" });
  });
  elements.scoreActionPagesButton?.addEventListener("click", () => {
    const scoreId = state.scoreActionId;
    closeScoreActionDialog();
    openPageManagerDialog(scoreId);
  });
  elements.scoreActionDeleteButton?.addEventListener("click", () => {
    const scoreId = state.scoreActionId;
    closeScoreActionDialog();
    runAfterDialogClose(() => deleteScore(scoreId));
  });
  elements.scoreActionDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeScoreActionDialog();
  });
  elements.scoreActionDialog?.addEventListener("click", (event) => {
    if (event.target === elements.scoreActionDialog) {
      closeScoreActionDialog();
    }
  });
  elements.closePageManagerButton?.addEventListener("click", closePageManagerDialog);
  elements.appendPageButton?.addEventListener("click", () => openFilePicker(elements.appendPageInput));
  elements.appendPageInput?.addEventListener("change", (event) => {
    event.stopPropagation();
    appendManagedPages(elements.appendPageInput.files);
  });
  elements.appendPageInput?.addEventListener("cancel", handlePagePickerCancel);
  elements.replacePageInput?.addEventListener("change", (event) => {
    event.stopPropagation();
    replaceManagedPage(elements.replacePageInput.files?.[0]);
  });
  elements.replacePageInput?.addEventListener("cancel", handlePagePickerCancel);
  elements.pageManagerList?.addEventListener("click", handlePageManagerAction);
  elements.pageManagerDialog?.addEventListener("cancel", (event) => {
    if (event.target !== elements.pageManagerDialog) {
      event.preventDefault();
      event.stopPropagation();
      handlePagePickerCancel(event);
      return;
    }
    event.preventDefault();
    closePageManagerDialog();
  });
  elements.scoreEditForm?.addEventListener("submit", saveScoreEdit);
  elements.closeScoreEditButton?.addEventListener("click", closeScoreEditDialog);
  elements.cancelScoreEditButton?.addEventListener("click", closeScoreEditDialog);
  elements.scoreEditFolderButton?.addEventListener("click", toggleScoreEditFolderPicker);
  elements.scoreEditFolderOptions?.addEventListener("click", handleScoreEditFolderOptionClick);
  elements.scoreEditDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeScoreEditDialog();
  });
  elements.scoreEditDialog?.addEventListener("click", (event) => {
    if (event.target instanceof Element && !event.target.closest("#scoreEditFolderPicker")) {
      closeScoreEditFolderPicker();
    }
    if (event.target === elements.scoreEditDialog) {
      closeScoreEditDialog();
    }
  });
  elements.closeAddButton.addEventListener("click", closeAddScreen);

  elements.scoreForm.addEventListener("submit", saveScore);
  elements.resetFormButton.addEventListener("click", resetForm);
  elements.scoreFolderButton?.addEventListener("click", toggleScoreFolderPicker);
  elements.scoreFolderOptions?.addEventListener("click", handleScoreFolderOptionClick);
  elements.uploadScreen?.addEventListener("click", (event) => {
    if (event.target instanceof Element && !event.target.closest("#scoreFolderPicker")) {
      closeScoreFolderPicker();
    }
  });
  elements.viewerPages.addEventListener("wheel", handleViewerWheel, { passive: false });
  elements.viewerPages.addEventListener("pointerdown", handleViewerPointerDown);
  elements.viewerPages.addEventListener("pointermove", handleViewerPointerMove);
  elements.viewerPages.addEventListener("pointerup", handleViewerPointerEnd);
  elements.viewerPages.addEventListener("pointercancel", handleViewerPointerEnd);
  elements.viewerPages.addEventListener("pointerdown", handlePenAnnotationFallbackDown, {
    capture: true,
    passive: false,
  });
  elements.viewerPages.addEventListener("pointermove", handlePenAnnotationFallbackMove, {
    capture: true,
    passive: false,
  });
  elements.viewerPages.addEventListener("scroll", scheduleViewerPageIndicatorUpdate, { passive: true });
  elements.viewerDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    if (state.viewerPerformanceMode) {
      return;
    }
    closeViewerUI();
  });
  elements.viewerBackButton.addEventListener("click", closeViewerUI);
  elements.viewerPerformanceButton?.addEventListener("click", toggleViewerPerformanceMode);
  elements.viewerFavoriteButton?.addEventListener("click", toggleCurrentViewerFavorite);
  elements.viewerPianoButton?.addEventListener("click", () => setViewerPianoOpen(!state.viewerPianoOpen));
  elements.viewerMetronomeButton?.addEventListener("click", () => setViewerMetronomeOpen(!state.viewerMetronomeOpen));
  elements.viewerAnnotationButton?.addEventListener("click", toggleAnnotationMode);
  elements.viewerNativeAnnotationButton?.addEventListener("click", openNativeAnnotationForCurrentPage);
  ["pointerdown", "pointermove", "pointerup", "pointercancel", "click"].forEach((eventName) => {
    elements.viewerPianoPanel?.addEventListener(eventName, (event) => event.stopPropagation());
    elements.viewerMetronomePanel?.addEventListener(eventName, (event) => event.stopPropagation());
  });
  elements.viewerPianoPanel?.addEventListener("touchstart", (event) => event.stopPropagation(), { passive: true });
  elements.viewerPianoPanel?.addEventListener("touchmove", (event) => event.stopPropagation(), { passive: true });
  elements.viewerMetronomePanel?.addEventListener("touchstart", (event) => event.stopPropagation(), { passive: true });
  elements.viewerMetronomePanel?.addEventListener("touchmove", (event) => event.stopPropagation(), { passive: true });
  elements.metronomePlayButton?.addEventListener("click", toggleMetronome);
  elements.metronomeMinusButton?.addEventListener("click", () => adjustMetronomeBpm(-1));
  elements.metronomePlusButton?.addEventListener("click", () => adjustMetronomeBpm(1));
  elements.metronomeSlider?.addEventListener("input", (event) => setMetronomeBpm(Number(event.target.value)));
  elements.metronomeMeterOptions?.addEventListener("click", handleMetronomeMeterClick);
  // “更多”弹出菜单：仅做显示/隐藏（标注、收藏的逻辑不变）。
  elements.viewerMoreButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleViewerMoreMenu();
  });
  // 点击菜单内任意按钮（标注/收藏）后收起菜单；其原有点击逻辑照常执行。
  elements.viewerMoreMenu?.addEventListener("click", (event) => {
    if (event.target.closest("button")) {
      setViewerMoreMenuOpen(false);
    }
  });
  // 点击菜单和“更多”按钮之外的任意区域时收起菜单。
  document.addEventListener("click", (event) => {
    if (elements.viewerMore?.classList.contains("is-open") && !event.target.closest(".viewer-more")) {
      setViewerMoreMenuOpen(false);
    }
  });
  elements.viewerPages?.addEventListener("pointerdown", () => setViewerMoreMenuOpen(false));
  elements.annotationToolButtons?.forEach((button) => {
    button.addEventListener("click", () => setAnnotationTool(button.dataset.annotationTool));
  });
  elements.annotationColorInput?.addEventListener("input", () => {
    state.annotationColor = elements.annotationColorInput.value || state.annotationColor;
  });
  elements.annotationSizeInput?.addEventListener("input", () => {
    state.annotationSize = clamp(Number(elements.annotationSizeInput.value) || 4, 2, 18);
  });
  elements.annotationUndoButton?.addEventListener("click", undoAnnotationStroke);
  elements.annotationRedoButton?.addEventListener("click", redoAnnotationStroke);
  elements.annotationClearButton?.addEventListener("click", clearCurrentPageAnnotations);
  elements.annotationToggleVisibilityButton?.addEventListener("click", toggleAnnotationVisibility);
  elements.annotationDoneButton?.addEventListener("click", () => {
    finishAnnotationMode().catch((error) => {
      console.warn(error);
      setStatus("标注暂未保存，请稍后重试。", true);
    });
  });
  updateNativeAnnotationButtonState();
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
  elements.closeBulkDeleteButton?.addEventListener("click", closeBulkDeleteDialog);
  elements.cancelBulkDeleteButton?.addEventListener("click", closeBulkDeleteDialog);
  elements.bulkDeleteDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeBulkDeleteDialog();
  });
  elements.bulkDeleteDialog?.addEventListener("click", (event) => {
    if (event.target === elements.bulkDeleteDialog) {
      closeBulkDeleteDialog();
    }
  });
  elements.bulkDeleteSelectAll?.addEventListener("change", handleBulkDeleteSelectAllChange);
  elements.bulkDeleteList?.addEventListener("change", handleBulkDeleteSelectionChange);
  elements.confirmBulkDeleteButton?.addEventListener("click", confirmBulkDelete);

  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("dragstart", handleDragStart);
  window.addEventListener("beforeunload", () => {
    flushAnnotationsForExit();
    revokeAllUrls();
  });
  window.addEventListener("pagehide", () => {
    flushAnnotationsForExit();
  });
  window.addEventListener("resize", () => {
    clampFabIntoBounds();
    scheduleAnnotationCanvasResize();
  });
  window.addEventListener("orientationchange", () => {
    window.setTimeout(clampFabIntoBounds, 250);
    window.setTimeout(scheduleAnnotationCanvasResize, 280);
  });
  document.addEventListener("visibilitychange", () => {
    handleWakeLockVisibilityChange();
    if (document.visibilityState === "hidden") {
      flushAnnotationsForExit();
    } else {
      // 回到前台时尝试重连/自检本地数据库，避免退后台后连接卡死导致写操作失效。
      handleForegroundDatabaseRecovery().catch((error) => console.warn(error));
      SyncEngine?.schedule?.({ reason: "foreground", delay: 1200 });
    }
  });
  window.addEventListener("online", () => {
    SyncEngine?.schedule?.({ reason: "online", delay: 800 });
  });
  // 自定义“边缘返回”手势（替代不可靠的浏览器历史手势）。capture 阶段记录，passive 观察，不打断内容滚动。
  document.addEventListener("touchstart", handleEdgeBackTouchStart, { passive: true, capture: true });
  document.addEventListener("touchend", handleEdgeBackTouchEnd, { passive: true, capture: true });
  ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
    document.addEventListener(eventName, preventBrowserZoom, { passive: false });
  });
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.installPrompt = event;
    updateInstallButtonVisibility();
  });
  window.addEventListener("appinstalled", () => {
    state.installPrompt = null;
    updateInstallButtonVisibility();
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

  if (event.target instanceof Element && event.target.closest(".profile-screen:not([hidden])")) {
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

function handleAddButtonClick(event) {
  if (state.fabSuppressClick) {
    event?.preventDefault();
    event?.stopPropagation();
    state.fabSuppressClick = false;
    return;
  }

  if (!ensureAppReady()) {
    return;
  }

  if (state.currentFolderId) {
    openAddScreen();
    return;
  }

  openAddChoiceDialog();
}

function handleFabPointerDown(event) {
  if (event.button !== undefined && event.button !== 0) {
    return;
  }

  const rect = elements.addScoreButton.getBoundingClientRect();
  state.fabDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    currentX: event.clientX,
    currentY: event.clientY,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    active: false,
  };

  try {
    elements.addScoreButton.setPointerCapture(event.pointerId);
  } catch (error) {
    console.warn(error);
  }
}

function handleFabPointerMove(event) {
  const drag = state.fabDrag;
  if (!drag || drag.pointerId !== event.pointerId) {
    return;
  }

  drag.currentX = event.clientX;
  drag.currentY = event.clientY;

  if (!drag.active) {
    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (distance < FAB_DRAG_START_DISTANCE) {
      return;
    }
    startFabDrag(event.pointerId);
  }

  event.preventDefault();
  moveFabToPointer(event.clientX, event.clientY);
}

function handleFabPointerEnd(event) {
  const drag = state.fabDrag;
  if (!drag || drag.pointerId !== event.pointerId) {
    return;
  }

  if (drag.active) {
    event.preventDefault();
    state.fabSuppressClick = true;
    window.setTimeout(() => {
      state.fabSuppressClick = false;
    }, 360);
  }

  elements.addScoreButton.classList.remove("is-dragging");
  try {
    elements.addScoreButton.releasePointerCapture(event.pointerId);
  } catch (error) {
    console.warn(error);
  }

  state.fabDrag = null;
}

function startFabDrag(pointerId) {
  const drag = state.fabDrag;
  if (!drag || drag.pointerId !== pointerId) {
    return;
  }

  drag.active = true;
  state.fabSuppressClick = true;
  const rect = elements.addScoreButton.getBoundingClientRect();
  elements.addScoreButton.style.left = `${rect.left}px`;
  elements.addScoreButton.style.top = `${rect.top}px`;
  elements.addScoreButton.style.right = "auto";
  elements.addScoreButton.style.bottom = "auto";
  elements.addScoreButton.classList.add("is-dragging");
  moveFabToPointer(drag.currentX, drag.currentY);
}

function moveFabToPointer(clientX, clientY) {
  const drag = state.fabDrag;
  if (!drag) {
    return;
  }

  const rect = elements.addScoreButton.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const bounds = getFabDragBounds(width, height);
  const nextLeft = clamp(clientX - drag.offsetX, bounds.minLeft, bounds.maxLeft);
  const nextTop = clamp(clientY - drag.offsetY, bounds.minTop, bounds.maxTop);
  elements.addScoreButton.style.left = `${nextLeft}px`;
  elements.addScoreButton.style.top = `${nextTop}px`;
}

function getFabDragBounds(width, height) {
  const topbarRect = getVisibleElementRect(elements.topbar);
  const bottomNavRect = getVisibleElementRect(elements.bottomNav);
  const minLeft = FAB_VIEWPORT_MARGIN;
  const maxLeft = Math.max(minLeft, window.innerWidth - width - FAB_VIEWPORT_MARGIN);
  const minTop = topbarRect
    ? Math.max(FAB_VIEWPORT_MARGIN, topbarRect.bottom + FAB_VIEWPORT_MARGIN)
    : FAB_VIEWPORT_MARGIN;
  const bottomLimit = bottomNavRect ? bottomNavRect.top - FAB_VIEWPORT_MARGIN : window.innerHeight - FAB_VIEWPORT_MARGIN;
  const maxTop = Math.max(minTop, bottomLimit - height);

  return { minLeft, maxLeft, minTop, maxTop };
}

function clampFabIntoBounds() {
  if (!elements.addScoreButton || elements.addScoreButton.hidden) {
    return;
  }

  const left = Number.parseFloat(elements.addScoreButton.style.left);
  const top = Number.parseFloat(elements.addScoreButton.style.top);
  if (!Number.isFinite(left) || !Number.isFinite(top)) {
    return;
  }

  const rect = elements.addScoreButton.getBoundingClientRect();
  const bounds = getFabDragBounds(rect.width, rect.height);
  elements.addScoreButton.style.left = `${clamp(left, bounds.minLeft, bounds.maxLeft)}px`;
  elements.addScoreButton.style.top = `${clamp(top, bounds.minTop, bounds.maxTop)}px`;
}

function getVisibleElementRect(element) {
  if (!element || element.hidden) {
    return null;
  }

  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  return rect;
}

function switchMainTab(tab) {
  if (state.addScreenOpen) {
    closeAddScreen();
  }

  state.activeTab = tab;
  const isMine = tab === "mine";
  const isSetlists = tab === "setlists";
  const isLibrary = tab === "library";

  elements.libraryScreen.hidden = !isLibrary;
  elements.setlistScreen.hidden = !isSetlists;
  elements.myScreen.hidden = !isMine;
  elements.uploadScreen.hidden = true;
  elements.addScoreButton.hidden = !isLibrary;
  elements.bulkDeleteButtons?.forEach((button) => {
    button.hidden = !isLibrary;
  });
  document.body.classList.toggle("mine-tab-open", isMine);
  document.body.classList.toggle("setlists-tab-open", isSetlists);
  updateMainNav();

  if (isLibrary) {
    renderScores();
  } else if (isSetlists) {
    renderSetlists();
  }

  elements.appShell.scrollTo({ top: 0 });
}

function updateMainNav() {
  const isLibrary = state.activeTab === "library";
  const isSetlists = state.activeTab === "setlists";
  const isMine = state.activeTab === "mine";
  elements.navLibraryButton.classList.toggle("is-active", isLibrary);
  elements.navSetlistsButton?.classList.toggle("is-active", isSetlists);
  elements.navMineButton.classList.toggle("is-active", isMine);
  if (isLibrary) {
    elements.navLibraryButton.setAttribute("aria-current", "page");
    elements.navSetlistsButton?.removeAttribute("aria-current");
    elements.navMineButton.removeAttribute("aria-current");
  } else if (isSetlists) {
    elements.navSetlistsButton?.setAttribute("aria-current", "page");
    elements.navLibraryButton.removeAttribute("aria-current");
    elements.navMineButton.removeAttribute("aria-current");
  } else {
    elements.navMineButton.setAttribute("aria-current", "page");
    elements.navLibraryButton.removeAttribute("aria-current");
    elements.navSetlistsButton?.removeAttribute("aria-current");
  }
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

function openFolderDialog(folderId = "") {
  const folder = folderId ? state.folders.find((item) => item.id === folderId) : null;
  state.editingFolderId = folder?.id || "";
  elements.folderForm.reset();
  elements.folderDialogTitle.textContent = folder ? "编辑文件夹名称" : "新建文件夹";
  elements.folderName.value = folder?.name || "";
  elements.folderSaveButtonText.textContent = folder ? "保存" : "创建";

  if (typeof elements.folderDialog.showModal === "function") {
    elements.folderDialog.showModal();
  } else {
    elements.folderDialog.setAttribute("open", "");
  }

  refreshIcons();
  requestAnimationFrame(() => elements.folderName.focus());
}

function closeFolderDialog() {
  state.editingFolderId = "";
  if (elements.folderDialog.open) {
    elements.folderDialog.close();
  } else {
    elements.folderDialog.removeAttribute("open");
  }

  elements.folderForm.reset();
  elements.saveFolderButton.disabled = false;
  elements.folderDialogTitle.textContent = "新建文件夹";
  elements.folderSaveButtonText.textContent = "创建";
}

function openFolderActionDialog(folderId) {
  const folder = state.folders.find((item) => item.id === folderId);
  if (!folder) {
    return;
  }

  state.folderActionId = folderId;
  elements.folderActionTitle.textContent = `《${folder.name}》`;
  openDialogSafely(elements.folderActionDialog);
  refreshIcons();
}

function closeFolderActionDialog() {
  state.folderActionId = "";
  closeDialogSafely(elements.folderActionDialog);
}

function openScoreActionDialog(scoreId) {
  const score = state.scores.find((item) => item.id === scoreId);
  if (!score) {
    return;
  }

  state.scoreActionId = scoreId;
  elements.scoreActionTitle.textContent = `《${score.name}》`;
  openDialogSafely(elements.scoreActionDialog);
  refreshIcons();
}

function closeScoreActionDialog() {
  state.scoreActionId = "";
  closeDialogSafely(elements.scoreActionDialog);
}

function openScoreEditDialog(scoreId, options = {}) {
  const score = state.scores.find((item) => item.id === scoreId);
  if (!score) {
    return;
  }

  const isMoveMode = options.mode === "move";
  state.scoreEditId = scoreId;
  populateScoreEditFolders(score.folderId);
  elements.scoreEditDialog.classList.toggle("is-move-mode", isMoveMode);
  elements.scoreEditTitle.textContent = isMoveMode ? "移动到文件夹" : "编辑歌谱信息";
  elements.scoreEditSaveText.textContent = isMoveMode ? "移动" : "保存";
  elements.scoreEditName.value = score.name || "";
  applyKeyPickerValue(elements.scoreEditKeyPicker, score.keySignature || "");
  elements.scoreEditNotes.value = score.notes || "";
  setScoreEditStatus(isMoveMode ? "请选择要移动到的文件夹。" : "可修改名称、所属文件夹、调号和备注。");

  if (typeof elements.scoreEditDialog.showModal === "function") {
    elements.scoreEditDialog.showModal();
  } else {
    elements.scoreEditDialog.setAttribute("open", "");
  }

  refreshIcons();
  requestAnimationFrame(() => {
    (isMoveMode ? elements.scoreEditFolderButton : elements.scoreEditName).focus();
  });
}

function closeScoreEditDialog() {
  state.scoreEditId = "";
  closeScoreEditFolderPicker();
  elements.scoreEditDialog.classList.remove("is-move-mode");
  elements.scoreEditTitle.textContent = "编辑歌谱信息";
  elements.scoreEditSaveText.textContent = "保存";
  elements.scoreEditForm.reset();
  elements.saveScoreEditButton.disabled = false;
  if (elements.scoreEditDialog.open) {
    elements.scoreEditDialog.close();
  } else {
    elements.scoreEditDialog.removeAttribute("open");
  }
}

function populateScoreEditFolders(selectedFolderId = "") {
  elements.scoreEditFolder.replaceChildren();
  elements.scoreEditFolderOptions.replaceChildren();
  const rootOption = document.createElement("option");
  rootOption.value = "";
  rootOption.textContent = "谱夹";
  elements.scoreEditFolder.append(rootOption);
  elements.scoreEditFolderOptions.append(createScoreEditFolderOption("", "谱夹"));

  state.folders
    .filter((folder) => !folder.deletedAt)
    .forEach((folder) => {
      const option = document.createElement("option");
      option.value = folder.id;
      option.textContent = folder.name;
      elements.scoreEditFolder.append(option);
      elements.scoreEditFolderOptions.append(createScoreEditFolderOption(folder.id, folder.name));
    });

  elements.scoreEditFolder.value = selectedFolderId || "";
  updateScoreEditFolderLabel();
  closeScoreEditFolderPicker();
}

function createScoreEditFolderOption(value, label) {
  const button = document.createElement("button");
  button.className = "folder-select-option";
  button.type = "button";
  button.setAttribute("role", "option");
  button.dataset.folderId = value;
  button.textContent = label;
  return button;
}

function toggleScoreEditFolderPicker() {
  const nextOpen = elements.scoreEditFolderOptions.hidden;
  elements.scoreEditFolderOptions.hidden = !nextOpen;
  elements.scoreEditFolderButton.setAttribute("aria-expanded", String(nextOpen));
  elements.scoreEditFolderPicker.classList.toggle("is-open", nextOpen);
  updateScoreEditFolderLabel();
}

function closeScoreEditFolderPicker() {
  if (!elements.scoreEditFolderOptions) {
    return;
  }
  elements.scoreEditFolderOptions.hidden = true;
  elements.scoreEditFolderButton?.setAttribute("aria-expanded", "false");
  elements.scoreEditFolderPicker?.classList.remove("is-open");
}

function handleScoreEditFolderOptionClick(event) {
  const button = event.target.closest("button[data-folder-id]");
  if (!button) {
    return;
  }

  elements.scoreEditFolder.value = button.dataset.folderId || "";
  updateScoreEditFolderLabel();
  closeScoreEditFolderPicker();
  elements.scoreEditFolderButton.focus();
}

function updateScoreEditFolderLabel() {
  const selectedId = elements.scoreEditFolder.value || "";
  const selectedOption = Array.from(elements.scoreEditFolderOptions.querySelectorAll(".folder-select-option")).find(
    (option) => (option.dataset.folderId || "") === selectedId,
  );
  elements.scoreEditFolderLabel.textContent = selectedOption?.textContent || "谱夹";
  elements.scoreEditFolderOptions.querySelectorAll(".folder-select-option").forEach((option) => {
    const selected = (option.dataset.folderId || "") === selectedId;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-selected", String(selected));
  });
}

function populateScoreFolders(selectedFolderId = "") {
  if (!elements.scoreFolder || !elements.scoreFolderOptions) {
    return;
  }

  elements.scoreFolder.replaceChildren();
  elements.scoreFolderOptions.replaceChildren();
  const rootOption = document.createElement("option");
  rootOption.value = "";
  rootOption.textContent = "谱夹";
  elements.scoreFolder.append(rootOption);
  elements.scoreFolderOptions.append(createScoreEditFolderOption("", "谱夹"));

  state.folders
    .filter((folder) => !folder.deletedAt)
    .forEach((folder) => {
      const option = document.createElement("option");
      option.value = folder.id;
      option.textContent = folder.name;
      elements.scoreFolder.append(option);
      elements.scoreFolderOptions.append(createScoreEditFolderOption(folder.id, folder.name));
    });

  elements.scoreFolder.value = selectedFolderId || "";
  updateScoreFolderLabel();
  closeScoreFolderPicker();
}

function toggleScoreFolderPicker() {
  const nextOpen = elements.scoreFolderOptions.hidden;
  elements.scoreFolderOptions.hidden = !nextOpen;
  elements.scoreFolderButton.setAttribute("aria-expanded", String(nextOpen));
  elements.scoreFolderPicker.classList.toggle("is-open", nextOpen);
  updateScoreFolderLabel();
}

function closeScoreFolderPicker() {
  if (!elements.scoreFolderOptions) {
    return;
  }
  elements.scoreFolderOptions.hidden = true;
  elements.scoreFolderButton?.setAttribute("aria-expanded", "false");
  elements.scoreFolderPicker?.classList.remove("is-open");
}

function handleScoreFolderOptionClick(event) {
  const button = event.target.closest("button[data-folder-id]");
  if (!button) {
    return;
  }

  elements.scoreFolder.value = button.dataset.folderId || "";
  updateScoreFolderLabel();
  closeScoreFolderPicker();
  elements.scoreFolderButton.focus();
}

function updateScoreFolderLabel() {
  if (!elements.scoreFolder || !elements.scoreFolderOptions) {
    return;
  }

  const selectedId = elements.scoreFolder.value || "";
  const selectedOption = Array.from(elements.scoreFolderOptions.querySelectorAll(".folder-select-option")).find(
    (option) => (option.dataset.folderId || "") === selectedId,
  );
  elements.scoreFolderLabel.textContent = selectedOption?.textContent || "谱夹";
  elements.scoreFolderOptions.querySelectorAll(".folder-select-option").forEach((option) => {
    const selected = (option.dataset.folderId || "") === selectedId;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-selected", String(selected));
  });
}

function setScoreEditStatus(message, isError = false) {
  elements.scoreEditState.textContent = message;
  elements.scoreEditState.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function queueCloudConnect() {
  window.setTimeout(async () => {
    if (await initializeCloud()) {
      await restoreCloudSession();
    }
  }, 100);
}

async function initializeCloud() {
  if (state.cloudReady) {
    return true;
  }
  if (state.cloudInitializing) {
    return state.cloudInitializing;
  }

  state.cloudInitializing = connectCloud();
  updateAccountUi();

  try {
    return await state.cloudInitializing;
  } finally {
    state.cloudInitializing = null;
    updateAccountUi();
  }
}

async function connectCloud() {
  const config = window.MY_SCORE_FOLDER_CLOUDBASE || {};
  const envId = String(config.envId || config.env || "").trim();

  if (!envId) {
    state.cloudReady = false;
    state.cloudError = "请先填写 cloudbase-config.js 中的 CloudBase 环境 ID。";
    return false;
  }

  try {
    state.cloudError = "";
    await loadCloudbaseSdk();

    const cloudbase = window.cloudbase?.init ? window.cloudbase : window.cloudbase?.default;
    if (!cloudbase?.init) {
      throw new Error("CloudBase SDK 没有加载成功。");
    }

    const initOptions = { env: envId };
    if (config.region) {
      initOptions.region = config.region;
    }

    state.cloudApp = cloudbase.init(initOptions);
    state.cloudAuth = state.cloudApp.auth({ persistence: config.persistence || "local" });
    state.cloudDb = state.cloudApp.database();
    state.cloudReady = true;
    state.cloudUnhealthy = false;

    if (!state.cloudAuthListenerBound && typeof state.cloudAuth.onLoginStateChanged === "function") {
      state.cloudAuthListenerBound = true;
      state.cloudAuth.onLoginStateChanged(async (loginState) => {
        try {
          state.session = await createCloudSession(loginState);
        } catch (error) {
          console.warn("读取登录态失败", error);
        }
        if (state.session) {
          rememberAccountIdentity();
          try {
            await loadProfileForCurrentUser({ includeCloud: true });
            scheduleBirthdayPopupCheck();
          } catch (error) {
            console.warn("加载资料失败（忽略）", error);
          }
        } else {
          state.profile = null;
          state.profileLoadedUserId = "";
        }
        updateAccountUi();
        // 立即加载列表显示（按实时或记住的账号身份）；认领与全量同步放后台。
        try {
          await loadScores();
        } catch (error) {
          console.error("加载本地歌谱失败", error);
        }
        if (state.session) {
          preloadAllScoreCovers({ includeCloud: true }).catch((error) => console.warn(error));
          queueAccountBackgroundSync(state.session.user.id);
          // 登录就绪后处理积压的同步发件箱（之前离线/失败的推送会在此重试）。
          kickOutbox(1500);
        }
      });
    }

    return true;
  } catch (error) {
    console.error(error);
    state.cloudReady = false;
    state.cloudError = `CloudBase 连接失败：${getErrorMessage(error)}`;
    return false;
  }
}

function loadCloudbaseSdk() {
  if (window.cloudbase?.init || window.cloudbase?.default?.init) {
    return Promise.resolve();
  }

  return loadScript(CLOUDBASE_SDK_LOCAL).catch((localError) => {
    console.warn("Local CloudBase SDK failed, trying CDN.", localError);
    return loadScript(CLOUDBASE_SDK_CDN);
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`${src} 加载失败`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      script.remove();
      reject(new Error(`${src} 加载超时`));
    }, 12000);

    script.src = src;
    script.async = true;
    script.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error(`${src} 加载失败`));
    };
    document.head.append(script);
  });
}

// 恢复云端会话：不依赖单一来源；createCloudSession 已会依次尝试
// loginState / loginState.getUserInfo / cloudAuth.getCurrentUser / getUserInfo / currentUser。
// 每一步独立 try，任何一步失败都不连累“更新登录态 + 加载列表”；恢复失败不清除记住的账号别名。
async function restoreCloudSession(options = {}) {
  if (!state.cloudReady) {
    updateAccountUi();
    return false;
  }

  try {
    const loginState =
      typeof state.cloudAuth.getLoginState === "function"
        ? await state.cloudAuth.getLoginState()
        : state.cloudAuth.hasLoginState?.();
    state.session = await createCloudSession(loginState);
  } catch (error) {
    console.warn("恢复云端会话失败", error);
  }
  if (state.session) {
    rememberAccountIdentity();
    try {
      await loadProfileForCurrentUser({ includeCloud: true });
      scheduleBirthdayPopupCheck();
    } catch (error) {
      console.warn("加载资料失败（忽略）", error);
    }
  }
  updateAccountUi();
  try {
    await ensureDatabaseReady();
    await loadScores();
  } catch (error) {
    console.error("加载本地歌谱失败", error);
    if (isLocalDatabaseNotReadyError(error)) {
      setBackgroundSyncError("");
      window.setTimeout(() => {
        restoreCloudSession({ reason: "db-retry" }).catch((retryError) => console.warn(retryError));
      }, 1500);
      return Boolean(state.session);
    }
  }
  if (state.session) {
    // 本地为空但已恢复会话：立刻做一次轻量云端拉取（只拉元数据，不下载大图），避免空白。
    if (!state.scores.length) {
      try {
        await pullCloudMetadataForCurrentAccount();
        await loadScores();
        renderScores();
      } catch (error) {
        console.warn("启动轻量拉取失败", error);
        if (isLocalDatabaseNotReadyError(error)) {
          setBackgroundSyncError("");
          window.setTimeout(() => {
            pullCloudMetadataForCurrentAccount()
              .then(() => loadScores())
              .then(() => renderScores())
              .catch((retryError) => console.warn(retryError));
          }, 1500);
        } else {
          setBackgroundSyncError(getErrorMessage(error) || "云端拉取失败，请在“我的”页重试。");
        }
      }
    }
    preloadAllScoreCovers({ includeCloud: true }).catch((error) => console.warn(error));
    queueAccountBackgroundSync(state.session.user.id);
  }
  return Boolean(state.session);
}

// 启动时的账号恢复总入口：initializeCloud → restoreCloudSession，并在恢复期间标记 authRestoring。
async function restoreStartupAuthSession() {
  console.log("[auth-startup] start");
  state.authRestoring = Boolean(getRememberedAccountIds().length);
  try {
    await ensureDatabaseReady();
    const ready = await initializeCloud();
    if (ready) {
      console.log("[auth-startup] cloud ready");
    }
    await restoreCloudSession({ reason: "startup" });
  } catch (error) {
    console.warn("[auth-startup] error", error);
  } finally {
    state.authRestoring = false;
  }
  console.log("[auth-startup] restored session userId:", state.session?.user?.id || null);
  console.log("[auth-startup] merged account ids:", getMergedAccountIds());
  console.log("[auth-startup] final scores:", state.scores.length);
  updateAccountUi();
  // 清掉“正在恢复”的占位文案，显示最终结果。
  try {
    renderScores();
  } catch (error) {
    console.warn(error);
  }
  if (state.session?.user?.id) {
    SyncEngine?.schedule?.({ reason: "startup-auth", delay: STARTUP_SYNC_DELAY });
  }
}

// 轻量云端拉取：只拉 folders/scores/pages/setlists/setlist_items 元数据并写回本地、刷新列表，
// 不在此阶段下载大图（封面/原图后台异步补）。复用 pullCloudChanges({downloadImages:false})。
async function pullCloudMetadataForCurrentAccount() {
  if (!state.cloudReady || !state.session) {
    return;
  }
  if (shouldDeferBackgroundWork()) {
    const userId = state.session.user.id;
    window.setTimeout(() => {
      if (state.session?.user?.id === userId) {
        pullCloudMetadataForCurrentAccount().catch((error) => console.warn(error));
      }
    }, 3000);
    return;
  }
  await ensureDatabaseReady();
  if (!(await ensureCloudMediaReady())) {
    return;
  }
  await pullCloudChanges({ downloadImages: false });
  await ensureDatabaseReady();
  await loadScores();
  console.log("[auth] 轻量拉取后本地歌谱数:", state.scores.length);
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

// ===== 账号别名兼容：旧版本可能用手机号/邮箱/uid/openId 等不同值作为 userId =====
// 把手机号统一到 11 位核心号（去空格/连字符/+、去 86 国家码），让各种历史写法可比较。
function canonicalPhoneCore(value) {
  let digits = normalizePhoneNumber(value).replace(/^\+/, "");
  const match = digits.match(/^86(1[3-9]\d{9})$/);
  if (match) {
    digits = match[1];
  }
  return digits;
}

// 归一化身份值（本地比较用）：手机号→phone:核心号；邮箱→email:小写；其它→原值。
// 加类型前缀避免不同类型串号。
function normalizeAccountIdentity(value) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return "";
  }
  if (isLikelyPhoneNumber(raw)) {
    return `phone:${canonicalPhoneCore(raw)}`;
  }
  if (isEmailAddress(raw)) {
    return `email:${raw.toLowerCase()}`;
  }
  return raw;
}

// 把一个值的各种“原始写法”加入别名集合（用于云端 user_id 查询，尽量覆盖历史格式）。
function addAccountAlias(aliases, value) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return;
  }
  aliases.add(raw);
  if (isLikelyPhoneNumber(raw)) {
    const core = canonicalPhoneCore(raw);
    if (core) {
      aliases.add(core); // 13800138000
      aliases.add(`86${core}`); // 8613800138000
      aliases.add(`+86${core}`); // +8613800138000
      aliases.add(`+86 ${core}`); // +86 13800138000（CloudBase 常见格式）
    }
  } else if (isEmailAddress(raw)) {
    aliases.add(raw.toLowerCase());
  }
}

// 收集一个云端用户对象上所有可能被旧版本当作 userId 写入的值。
function collectCloudUserAliases(user, fallbackAccount, primaryId, extraValues = []) {
  const aliases = new Set();
  addAccountAlias(aliases, primaryId);
  addAccountAlias(aliases, fallbackAccount);
  if (user && typeof user === "object") {
    [
      user.uid,
      user.uuid,
      user.userId,
      user.user_id,
      user._id,
      user.openId,
      user.openid,
      user.email,
      user.username,
      user.loginName,
      user.phoneNumber,
      user.phone_number,
      user.phone,
      user.mobile,
      user.mobilePhone,
    ].forEach((value) => addAccountAlias(aliases, value));
  }
  (extraValues || []).forEach((value) => addAccountAlias(aliases, value));
  return Array.from(aliases).filter(Boolean);
}

// 当前账号所有可能的“原始身份 ID”（用于云端 user_id in (...) 查询）。
function getSessionUserIdList(session = state.session) {
  const user = session?.user;
  if (!user) {
    return [];
  }
  const aliases = new Set();
  addAccountAlias(aliases, user.id);
  (user.aliasIds || []).forEach((value) => addAccountAlias(aliases, value));
  addAccountAlias(aliases, user.accountLabel);
  addAccountAlias(aliases, user.phoneNumber);
  addAccountAlias(aliases, user.emailAddress);
  return Array.from(aliases).filter(Boolean);
}

function getSessionUserIdSet(session = state.session) {
  return new Set(getSessionUserIdList(session));
}

// 当前账号的“归一化身份集合”（本地匹配用，手机号/邮箱已统一形式）。
function getSessionCanonicalIdSet(session = state.session) {
  const set = new Set();
  getSessionUserIdList(session).forEach((id) => {
    const canonical = normalizeAccountIdentity(id);
    if (canonical) {
      set.add(canonical);
    }
  });
  return set;
}

// 合并“实时会话身份 + 本地记住的上次账号身份”的完整别名列表（去重，含各种手机号/邮箱格式）。
// 自动恢复登录常常只拿到 uid，合并记住的身份后，旧数据用手机号/邮箱/+86/openId 保存也能识别。
function getMergedAccountIds(session = state.session) {
  const set = new Set();
  getSessionUserIdList(session).forEach((id) => addAccountAlias(set, id));
  getRememberedAccountIds().forEach((id) => addAccountAlias(set, id));
  return Array.from(set).filter(Boolean);
}

// 合并身份的归一化集合（本地匹配用）。
function getMergedCanonicalIdSet(session = state.session) {
  const set = new Set();
  getMergedAccountIds(session).forEach((id) => {
    const canonical = normalizeAccountIdentity(id);
    if (canonical) {
      set.add(canonical);
    }
  });
  return set;
}

// 判断某条记录的 userId 是否属于当前账号（含会话别名 + 记住的别名，跨手机号/邮箱格式）。
function isCurrentAccountAlias(userId, session = state.session) {
  if (!userId) {
    return false;
  }
  const canonical = normalizeAccountIdentity(userId);
  return canonical ? getMergedCanonicalIdSet(session).has(canonical) : false;
}

// 本地记住上次登录账号的身份 ID 列表：即使云端会话还没恢复（或自动登录慢/失败），
// 也能在打开 App 时立刻按该身份显示其歌谱，避免“进入 App / 登录前后看不到歌谱”。
const REMEMBERED_ACCOUNT_IDS_KEY = "my-score-folder-account-ids";
function rememberAccountIdentity(session = state.session) {
  if (!window.localStorage) {
    return;
  }
  const ids = getSessionUserIdList(session);
  if (!ids.length) {
    return;
  }
  try {
    window.localStorage.setItem(REMEMBERED_ACCOUNT_IDS_KEY, JSON.stringify(ids));
  } catch (error) {
    console.warn(error);
  }
}
function getRememberedAccountIds() {
  if (!window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(REMEMBERED_ACCOUNT_IDS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter(Boolean) : [];
  } catch (error) {
    return [];
  }
}
function clearRememberedAccountIdentity() {
  try {
    window.localStorage?.removeItem(REMEMBERED_ACCOUNT_IDS_KEY);
  } catch (error) {
    console.warn(error);
  }
}

// 生成“归属当前账号”的判定函数：无主数据 + 当前账号（实时会话 + 记住的上次账号）别名数据都算当前账号。
// 本地 score / folder / page / setlist / setlist_item 都用这一套规则过滤。
function createOwnerMatcher(session = state.session) {
  const canonicalSet = getMergedCanonicalIdSet(session);
  if (!canonicalSet.size) {
    // 从未登录过：仅显示无主（本地）数据。
    return (record) => !record.userId;
  }
  return (record) => {
    if (!record.userId) {
      return true;
    }
    const canonical = normalizeAccountIdentity(record.userId);
    return canonical ? canonicalSet.has(canonical) : false;
  };
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

  const phoneNumber = getUserPhoneNumber(user, fallbackEmail);
  const emailAddress = getUserEmailAddress(user, fallbackEmail);
  const accountLabel = getPreferredAccountLabel(user, fallbackEmail, id);
  // 别名集合：让旧版本用手机号/邮箱/uid/openId 写入的数据也能被当前账号识别。
  const aliasIds = collectCloudUserAliases(user, fallbackEmail, id, [accountLabel, phoneNumber, emailAddress]);
  return {
    user: {
      id: String(id),
      email: emailAddress || accountLabel || String(id),
      accountLabel: accountLabel || String(id),
      phoneNumber,
      emailAddress,
      aliasIds,
    },
  };
}

function getPreferredAccountLabel(user, fallbackAccount = "", userId = "") {
  const fallback = String(fallbackAccount || "").trim();
  const stored = readStoredAccountLabel(userId);
  const storedPhone = normalizePhoneNumber(stored);
  const phone = getUserPhoneNumber(user, fallback) || (isLikelyPhoneNumber(storedPhone) ? storedPhone : "");
  if (phone) {
    writeStoredAccountLabel(userId, phone);
    return phone;
  }

  const email = getUserEmailAddress(user, fallback) || (isEmailAddress(stored) ? stored : "");
  if (email) {
    writeStoredAccountLabel(userId, email);
    return email;
  }

  const readableAccount = [stored, fallback, user.loginName, user.username]
    .map((value) => String(value || "").trim())
    .find((value) => value && value !== String(userId));

  if (readableAccount) {
    writeStoredAccountLabel(userId, readableAccount);
    return readableAccount;
  }

  return "";
}

function getUserPhoneNumber(user, fallbackAccount = "") {
  const phoneCandidates = [
    fallbackAccount,
    user.phoneNumber,
    user.phone_number,
    user.phone,
    user.mobile,
    user.mobilePhone,
    user.phoneNum,
    user.tel,
    user.telephone,
  ];
  return phoneCandidates.map((value) => normalizePhoneNumber(value)).find(isLikelyPhoneNumber) || "";
}

function getUserEmailAddress(user, fallbackAccount = "") {
  const emailCandidates = [user.email, fallbackAccount, user.loginName, user.username];
  return emailCandidates.map((value) => String(value || "").trim()).find(isEmailAddress) || "";
}

function readStoredAccountLabel(userId) {
  if (!userId || !window.localStorage) {
    return "";
  }

  try {
    return window.localStorage.getItem(`${ACCOUNT_LABEL_STORAGE_PREFIX}${userId}`) || "";
  } catch (error) {
    console.warn(error);
    return "";
  }
}

function writeStoredAccountLabel(userId, accountLabel) {
  if (!userId || !accountLabel || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(`${ACCOUNT_LABEL_STORAGE_PREFIX}${userId}`, accountLabel);
  } catch (error) {
    console.warn(error);
  }
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
  const accountLabel = getCurrentAccountLabel();
  const accountButtonText = accountLabel ? "已登录" : state.cloudInitializing ? "连接中" : "登录";
  if (elements.accountButtonText) {
    elements.accountButtonText.textContent = accountButtonText;
  }
  if (elements.syncNowButton) {
    elements.syncNowButton.disabled = state.syncing || Boolean(state.cloudInitializing);
  }
  elements.shareScoresButton.disabled = !state.cloudReady || !state.session;
  elements.importShareButton.disabled = !state.cloudReady || !state.session;

  if (elements.myAuthState) {
    elements.myAuthState.style.color = "var(--muted)";
    if (state.cloudReady) {
      elements.myAuthState.textContent = accountLabel ? `当前账号：${accountLabel}` : "登录后可以跨设备同步歌谱。";
    } else if (state.cloudInitializing) {
      elements.myAuthState.textContent = "正在连接 CloudBase，请稍候...";
    } else {
      elements.myAuthState.textContent = state.cloudError || "登录后可以跨设备同步歌谱。";
      elements.myAuthState.style.color = state.cloudError ? "var(--danger)" : "var(--muted)";
    }
  }

  if (elements.myAuthButtonText) {
    elements.myAuthButtonText.textContent = accountLabel ? "账号管理" : state.cloudInitializing ? "连接中" : "登录 / 注册";
  }

  if (elements.myAuthButton) {
    elements.myAuthButton.disabled = Boolean(state.cloudInitializing);
  }

  if (elements.profileScreen && !elements.profileScreen.hidden) {
    renderProfileDialog();
  }
  updateAppTitle();

  if (elements.authDialog?.open && accountLabel && state.authMode !== "loggedIn") {
    setAuthMode("loggedIn");
  } else {
    renderAuthMode();
  }
}

function getCurrentAccountLabel() {
  return state.session?.user?.accountLabel || state.session?.user?.email || "";
}

function setAuthStatus(message, isError = false) {
  if (!elements.authState) {
    return;
  }

  elements.authState.textContent = message;
  elements.authState.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function getDefaultAuthMessage() {
  const accountLabel = getCurrentAccountLabel();
  if (accountLabel) {
    return `当前账号：${accountLabel}`;
  }
  if (state.cloudInitializing) {
    return "正在连接 CloudBase，请稍候...";
  }
  if (!state.cloudReady && state.cloudError) {
    return state.cloudError;
  }
  return "登录后可以跨设备同步歌谱。";
}

function setAuthMode(mode) {
  state.authMode = mode;
  renderAuthMode();
  refreshIcons();
}

function renderAuthMode() {
  if (!elements.authDialog) {
    return;
  }

  const accountLabel = getCurrentAccountLabel();
  const mode = accountLabel ? state.authMode : state.authMode === "loggedIn" ? "guest" : state.authMode;
  const titles = {
    loggedIn: "账号管理",
    guest: "账号管理",
    login: "账号登录",
    registerChoice: "账号注册",
    registerCode: state.authRegisterMethod === "phone" ? "手机验证码注册" : "邮箱验证码注册",
    registerPassword: "设置密码",
  };
  const panes = {
    loggedIn: elements.authLoggedInPane,
    guest: elements.authGuestPane,
    login: elements.authLoginPane,
    registerChoice: elements.authRegisterChoicePane,
    registerCode: elements.authRegisterCodePane,
    registerPassword: elements.authRegisterPasswordPane,
  };

  Object.values(panes).forEach((pane) => {
    if (pane) {
      pane.hidden = true;
    }
  });

  const visiblePane = panes[mode] || panes.guest;
  if (visiblePane) {
    visiblePane.hidden = false;
  }

  if (elements.authDialogTitle) {
    elements.authDialogTitle.textContent = titles[mode] || "账号管理";
  }

  if (elements.authBackButton) {
    elements.authBackButton.hidden = mode === "guest" || mode === "loggedIn";
  }

  if (elements.registerContactLabel) {
    elements.registerContactLabel.textContent =
      state.authRegisterMethod === "phone" ? "手机号" : "邮箱";
  }
  if (elements.registerContactInput) {
    elements.registerContactInput.type = state.authRegisterMethod === "phone" ? "tel" : "email";
    elements.registerContactInput.inputMode = state.authRegisterMethod === "phone" ? "tel" : "email";
    elements.registerContactInput.autocomplete = state.authRegisterMethod === "phone" ? "tel" : "email";
    elements.registerContactInput.placeholder =
      state.authRegisterMethod === "phone" ? "请输入手机号" : "请输入邮箱";
  }

  if (elements.signOutButton) {
    elements.signOutButton.hidden = !accountLabel;
  }

  setAuthStatus(getDefaultAuthMessage(), Boolean(!state.cloudReady && state.cloudError));
}

function requireCloudSession() {
  if (!state.cloudReady) {
    setStatus(state.cloudError || "CloudBase 尚未连接，请稍后再试。", true);
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

async function openAuthDialog() {
  setAuthMode(state.session ? "loggedIn" : "guest");
  if (typeof elements.authDialog.showModal === "function") {
    elements.authDialog.showModal();
  } else {
    elements.authDialog.setAttribute("open", "");
  }
  refreshIcons();

  // 打开账号弹窗时尽量先自动恢复会话：连接云端；云端已就绪但没有会话时也尝试恢复，
  // 恢复成功就直接显示“已登录”，不必让用户重新输入账号密码。
  if (!state.cloudReady) {
    const ready = await initializeCloud();
    if (ready && !state.session) {
      await restoreCloudSession({ reason: "dialog" });
    }
  } else if (!state.session) {
    await restoreCloudSession({ reason: "dialog" });
  }

  if (state.session) {
    setAuthMode("loggedIn");
    updateAccountUi();
  }
}

function closeAuthDialog() {
  if (elements.authDialog.open) {
    elements.authDialog.close();
  } else {
    elements.authDialog.removeAttribute("open");
  }
}

async function openProfileDialog() {
  if (!state.session) {
    setStatus("请先登录账号。", true);
    await openAuthDialog();
    return;
  }

  await loadProfileForCurrentUser({ includeCloud: true });
  renderProfileDialog();
  elements.profileScreen.hidden = false;
  document.body.classList.add("profile-screen-open");
  refreshIcons();
  requestAnimationFrame(() => elements.profileNickname.focus());
}

function closeProfileDialog() {
  if (!elements.profileScreen) {
    return;
  }

  elements.profileScreen.hidden = true;
  document.body.classList.remove("profile-screen-open");
}

function setProfileStatus(message, isError = false) {
  if (!elements.profileState) {
    return;
  }

  elements.profileState.textContent = message;
  elements.profileState.style.color = isError ? "var(--danger)" : "var(--muted)";
}

async function loadProfileForCurrentUser(options = {}) {
  const userId = state.session?.user?.id || "";
  if (!userId) {
    state.profile = null;
    state.profileLoadedUserId = "";
    return null;
  }

  // 已加载过且不要求拉云端时直接用缓存；includeCloud 时始终尝试从云端拉取，保证跨设备同步。
  if (!options.includeCloud && state.profileLoadedUserId === userId && state.profile) {
    return state.profile;
  }

  let profile =
    state.profileLoadedUserId === userId && state.profile
      ? state.profile
      : readStoredProfile(userId) || createDefaultProfile(userId);

  if (options.includeCloud && state.cloudReady && state.cloudDb) {
    try {
      const rows = await queryCloudRows(PROFILE_COLLECTION_NAME, { user_id: userId });
      if (rows.length) {
        profile = {
          ...profile,
          ...fromCloudProfile(rows[0]),
        };
        writeStoredProfile(userId, profile);
      }
    } catch (error) {
      console.warn("Profile cloud load skipped.", error);
    }
  }

  state.profile = profile;
  state.profileLoadedUserId = userId;
  updateAppTitle();
  return profile;
}

function renderProfileDialog() {
  if (!state.session) {
    return;
  }

  const userId = state.session.user.id;
  const profile = state.profile || readStoredProfile(userId) || createDefaultProfile(userId);
  const phoneNumber = getCurrentUserPhoneNumber(profile);
  const emailAddress = getCurrentUserEmailAddress(profile);

  elements.profileNickname.value = profile.nickname || "";
  setProfileGender(profile.gender || "");
  elements.profileBirthday.value = profile.birthday || "";
  updateProfileBirthdayDisplay(profile.birthday || "");
  renderProfileContactButton(elements.profilePhoneButton, phoneNumber, "关联手机号");
  renderProfileContactButton(elements.profileEmailButton, emailAddress, "关联邮箱");
  setProfileStatus("可编辑昵称、性别和生日。");
}

function setProfileGender(value) {
  const nextValue = ["male", "female"].includes(value) ? value : "";
  elements.profileGender.value = nextValue;
  elements.profileGenderButtons?.forEach((button) => {
    const selected = (button.dataset.genderValue || "") === nextValue;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
}

function openProfileBirthdayPicker() {
  if (!elements.profileBirthday) {
    return;
  }

  if (typeof elements.profileBirthday.showPicker === "function") {
    elements.profileBirthday.showPicker();
    return;
  }

  elements.profileBirthday.focus();
  elements.profileBirthday.click();
}

function updateProfileBirthdayDisplay(value) {
  if (!elements.profileBirthdayDisplay) {
    return;
  }

  elements.profileBirthdayDisplay.textContent = formatBirthdayDisplay(value);
  elements.profileBirthdayButton?.classList.toggle("has-value", Boolean(value));
}

function formatBirthdayDisplay(value) {
  if (!value) {
    return "请选择生日";
  }

  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${year}年${Number(month)}月${Number(day)}日`;
}

function renderProfileContactButton(button, value, emptyText) {
  if (!button) {
    return;
  }

  const text = String(value || "").trim();
  button.textContent = text || emptyText;
  button.disabled = Boolean(text);
  button.classList.toggle("is-linked", Boolean(text));
}

function readViewerModePreference() {
  try {
    const value = window.localStorage?.getItem(VIEWER_MODE_STORAGE_KEY);
    return value === VIEWER_MODE_LANDSCAPE ? VIEWER_MODE_LANDSCAPE : VIEWER_MODE_PORTRAIT;
  } catch (error) {
    return VIEWER_MODE_PORTRAIT;
  }
}

function writeViewerModePreference(mode) {
  try {
    window.localStorage?.setItem(VIEWER_MODE_STORAGE_KEY, mode);
  } catch (error) {
    console.warn(error);
  }
}

function readThemePreference() {
  try {
    return window.localStorage?.getItem(THEME_STORAGE_KEY) === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  } catch (error) {
    return THEME_LIGHT;
  }
}

function writeThemePreference(mode) {
  try {
    window.localStorage?.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    console.warn(error);
  }
}

function applyThemePreference(mode) {
  const nextMode = mode === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  document.documentElement.dataset.theme = nextMode;
  updateThemeChrome(nextMode);
}

function updateThemeChrome(mode) {
  const nextMode = mode === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  const color = THEME_CHROME_COLORS[nextMode];
  const barColor = THEME_BAR_COLORS[nextMode];
  const statusStyle = THEME_APPLE_STATUS_STYLES[nextMode];
  document.documentElement.style.setProperty("--safe-area-bg", color);
  document.documentElement.style.backgroundColor = color;
  document.body?.style.setProperty("background-color", color);
  // theme-color 决定安卓系统状态栏/导航栏底色：用白色，使底部系统栏与应用底部导航一致。
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", barColor);
  document
    .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    ?.setAttribute("content", statusStyle);
}

function openPreferencesScreen() {
  renderPreferencesScreen();
  elements.preferencesScreen.hidden = false;
  document.body.classList.add("preferences-screen-open");
  refreshIcons();
}

function closePreferencesScreen() {
  elements.preferencesScreen.hidden = true;
  document.body.classList.remove("preferences-screen-open");
}

function openUsageGuideScreen() {
  elements.usageGuideScreen.hidden = false;
  document.body.classList.add("usage-screen-open");
  refreshIcons();
}

function closeUsageGuideScreen() {
  elements.usageGuideScreen.hidden = true;
  document.body.classList.remove("usage-screen-open");
}

// ===== 支持作者 =====
function openSupportAuthorScreen() {
  if (!elements.supportAuthorScreen) {
    return;
  }
  elements.supportAuthorScreen.hidden = false;
  document.body.classList.add("support-screen-open");
  elements.supportAuthorScreen.scrollTop = 0;
  refreshIcons();
}

function closeSupportAuthorScreen() {
  if (!elements.supportAuthorScreen) {
    return;
  }
  elements.supportAuthorScreen.hidden = true;
  document.body.classList.remove("support-screen-open");
}

const supportPayBlobs = { wechat: null, alipay: null };

function setSupportPayMethod(method) {
  const isAlipay = method === "alipay";
  elements.supportPaySurface?.setAttribute("data-pay", isAlipay ? "alipay" : "wechat");
  elements.supportPayWechatTab?.classList.toggle("is-active", !isAlipay);
  elements.supportPayAlipayTab?.classList.toggle("is-active", isAlipay);
  if (elements.supportPayWechatImg) {
    elements.supportPayWechatImg.hidden = isAlipay;
  }
  if (elements.supportPayAlipayImg) {
    elements.supportPayAlipayImg.hidden = !isAlipay;
  }
  if (elements.supportPayHintLine1) {
    const app = isAlipay ? "支付宝" : "微信";
    elements.supportPayHintLine1.textContent = `保存图片后使用${app}扫一扫`;
  }
}

function currentSupportPayMethod() {
  return elements.supportPaySurface?.getAttribute("data-pay") === "alipay" ? "alipay" : "wechat";
}

// 预取两张收款码图片为 Blob，便于点击“保存图片”时在用户手势内即时分享/下载。
function prefetchSupportPayImages() {
  const map = { wechat: elements.supportPayWechatImg, alipay: elements.supportPayAlipayImg };
  Object.entries(map).forEach(([key, img]) => {
    if (supportPayBlobs[key] || !img?.src) {
      return;
    }
    fetch(img.src)
      .then((res) => res.blob())
      .then((blob) => {
        supportPayBlobs[key] = blob;
      })
      .catch((error) => console.warn(error));
  });
}

async function saveSupportPayImage() {
  const method = currentSupportPayMethod();
  const img = method === "alipay" ? elements.supportPayAlipayImg : elements.supportPayWechatImg;
  if (!img) {
    return;
  }
  const filename = method === "alipay" ? "支付宝收款码.jpg" : "微信收款码.jpg";
  let blob = supportPayBlobs[method];
  try {
    if (!blob) {
      const res = await fetch(img.src);
      blob = await res.blob();
      supportPayBlobs[method] = blob;
    }
  } catch (error) {
    console.warn(error);
  }

  // 优先用系统分享（移动端可直接“存储图像/保存到相册”）。
  try {
    if (blob && navigator.canShare) {
      const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "收款码" });
        return;
      }
    }
  } catch (error) {
    if (error && error.name === "AbortError") {
      return; // 用户取消分享
    }
    console.warn(error);
  }

  // 兜底：直接下载图片文件。
  try {
    const url = blob ? URL.createObjectURL(blob) : img.src;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    if (blob) {
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    }
  } catch (error) {
    console.warn(error);
    setStatus("保存图片失败，请长按二维码自行保存。", true);
  }
}

function openSupportPayDialog() {
  const dialog = elements.supportPayDialog;
  if (!dialog || dialog.open) {
    return;
  }
  setSupportPayMethod("wechat"); // 默认显示微信收款码
  prefetchSupportPayImages();
  openDialogSafely(dialog);
  refreshIcons();
}

function closeSupportPayDialog() {
  closeDialogSafely(elements.supportPayDialog);
}

// 每月 1 号进入 App 时自动弹出一次“支持作者”页面（同一天多次打开只弹一次）。
function maybeShowMonthlySupportPrompt() {
  if (!elements.supportAuthorScreen) {
    return;
  }
  const now = new Date();
  if (now.getDate() !== 1) {
    return;
  }
  const monthKey = `${SUPPORT_PROMPT_SHOWN_PREFIX}${now.getFullYear()}-${now.getMonth() + 1}`;
  try {
    if (window.localStorage && window.localStorage.getItem(monthKey)) {
      return;
    }
  } catch (error) {
    console.warn(error);
  }
  openSupportAuthorScreen();
  try {
    window.localStorage?.setItem(monthKey, "1");
  } catch (error) {
    console.warn(error);
  }
}

// ===== 回收站界面 =====

async function openRecycleBinScreen() {
  if (!ensureAppReady()) {
    return;
  }
  elements.recycleBinScreen.hidden = false;
  document.body.classList.add("recycle-bin-screen-open");
  refreshIcons();
  await renderRecycleBin();
}

function closeRecycleBinScreen() {
  elements.recycleBinScreen.hidden = true;
  document.body.classList.remove("recycle-bin-screen-open");
  if (elements.recycleBinList) {
    elements.recycleBinList.querySelectorAll("img[data-thumb-url]").forEach((image) => {
      URL.revokeObjectURL(image.dataset.thumbUrl);
    });
    elements.recycleBinList.replaceChildren();
  }
}

async function renderRecycleBin() {
  if (!elements.recycleBinList) {
    return;
  }
  let entries = [];
  try {
    entries = await getAllTrashEntries();
  } catch (error) {
    console.warn(error);
  }
  entries.sort((a, b) => new Date(b.trashedAt || 0) - new Date(a.trashedAt || 0));

  elements.recycleBinList.querySelectorAll("img[data-thumb-url]").forEach((image) => {
    URL.revokeObjectURL(image.dataset.thumbUrl);
  });
  elements.recycleBinList.replaceChildren();

  if (elements.emptyRecycleBinButton) {
    elements.emptyRecycleBinButton.disabled = entries.length === 0;
  }

  if (!entries.length) {
    elements.recycleBinState.textContent = "回收站是空的。";
    const empty = document.createElement("p");
    empty.className = "recycle-bin-empty";
    empty.textContent = "删除歌谱后会出现在这里，可恢复或彻底删除。";
    elements.recycleBinList.append(empty);
    return;
  }

  elements.recycleBinState.textContent = `回收站共有 ${entries.length} 份歌谱。`;
  entries.forEach((entry) => elements.recycleBinList.append(createRecycleBinRow(entry)));
  refreshIcons();
}

function createRecycleBinRow(entry) {
  const row = document.createElement("article");
  row.className = "recycle-bin-row";

  const thumb = document.createElement("div");
  thumb.className = "recycle-bin-thumb";
  const firstPage = (entry.pages || [])[0];
  if (firstPage?.blob && firstPage.blob.size > 0) {
    const image = document.createElement("img");
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    createThumbnailBlob(firstPage.blob)
      .then((thumbBlob) => {
        const source = thumbBlob || firstPage.blob;
        const url = URL.createObjectURL(source);
        image.dataset.thumbUrl = url;
        image.src = url;
      })
      .catch(() => {});
    thumb.append(image);
  } else {
    thumb.append(createIcon("music-2"));
  }

  const body = document.createElement("div");
  body.className = "recycle-bin-body";
  const title = document.createElement("h3");
  title.textContent = entry.name || "未命名歌谱";
  const meta = document.createElement("p");
  meta.textContent = [
    `${entry.pageCount || (entry.pages || []).length} 页`,
    entry.folderName ? `文件夹：${entry.folderName}` : "",
    formatTrashedTime(entry.trashedAt),
  ]
    .filter(Boolean)
    .join(" · ");
  body.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "recycle-bin-actions";
  const restoreButton = document.createElement("button");
  restoreButton.type = "button";
  restoreButton.className = "recycle-restore-button";
  restoreButton.append(createIcon("undo-2"), document.createTextNode("恢复"));
  restoreButton.addEventListener("click", () => handleRestoreTrashEntry(entry.id, restoreButton));
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "recycle-delete-button";
  deleteButton.append(createIcon("trash-2"), document.createTextNode("彻底删除"));
  deleteButton.addEventListener("click", () => handlePermanentDeleteTrashEntry(entry, deleteButton));
  actions.append(restoreButton, deleteButton);

  row.append(thumb, body, actions);
  return row;
}

function formatTrashedTime(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return `删除于 ${date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })}`;
}

async function handleRestoreTrashEntry(id, button) {
  if (button) {
    button.disabled = true;
  }
  try {
    const restored = await restoreScoreFromTrash(id);
    if (restored) {
      // 从数据库权威重载后再渲染，确保恢复的歌谱立即出现（不依赖内存插入/渲染队列）。
      await loadScores();
      renderScores();
      renderSetlists();
      setStatus("已恢复歌谱到谱夹。");
    }
  } catch (error) {
    console.error(error);
    setStatus(getStorageErrorMessage(error, "恢复"), true);
    if (button) {
      button.disabled = false;
    }
  }
  await renderRecycleBin();
}

async function handlePermanentDeleteTrashEntry(entry, button) {
  const confirmed = await requestDeleteConfirmation({
    title: "彻底删除？",
    message: `《${entry.name || "未命名歌谱"}》将从回收站彻底删除，无法恢复。`,
  });
  if (!confirmed) {
    return;
  }
  if (button) {
    button.disabled = true;
  }
  try {
    await cleanupTrashAnnotationResidues([entry]);
    await deleteTrashEntry(entry.id);
  } catch (error) {
    console.warn(error);
  }
  await renderRecycleBin();
}

async function emptyRecycleBin() {
  let entries = [];
  try {
    entries = await getAllTrashEntries();
  } catch (error) {
    console.warn(error);
  }
  if (!entries.length) {
    return;
  }
  const confirmed = await requestDeleteConfirmation({
    title: "清空回收站？",
    message: `回收站里的 ${entries.length} 份歌谱将被彻底删除，无法恢复。`,
  });
  if (!confirmed) {
    return;
  }
  try {
    await cleanupTrashAnnotationResidues(entries);
    await clearTrashStore();
    setStatus("已清空回收站。");
  } catch (error) {
    console.warn(error);
  }
  await renderRecycleBin();
}

// ===== 备份与导入界面 =====

function openBackupScreen() {
  if (!ensureAppReady()) {
    return;
  }
  setBackupStatus("");
  elements.backupScreen.hidden = false;
  document.body.classList.add("backup-screen-open");
  refreshIcons();
}

function closeBackupScreen() {
  elements.backupScreen.hidden = true;
  document.body.classList.remove("backup-screen-open");
}

function setBackupStatus(message, isError = false) {
  if (!elements.backupStatus) {
    return;
  }
  elements.backupStatus.textContent = message || "";
  elements.backupStatus.hidden = !message;
  elements.backupStatus.classList.toggle("is-error", Boolean(isError));
}

async function handleExportBackup() {
  if (!ensureAppReady()) {
    return;
  }
  elements.exportBackupButton.disabled = true;
  setBackupStatus("正在导出备份...");
  try {
    const result = await exportFullBackup();
    const annotationText = result.annotations ? `、${result.annotations} 条标注` : "";
    setBackupStatus(`已导出备份：${result.scores} 份歌谱、${result.folders} 个文件夹、${result.setlists} 个歌单${annotationText}。`);
  } catch (error) {
    console.error(error);
    setBackupStatus(getErrorMessage(error) || "导出失败，请稍后重试。", true);
  } finally {
    elements.exportBackupButton.disabled = false;
  }
}

async function handleImportBackup(fileList) {
  const file = Array.from(fileList || [])[0];
  elements.importBackupInput.value = "";
  if (!file || !ensureAppReady()) {
    return;
  }
  elements.importBackupButton.disabled = true;
  setBackupStatus("正在导入备份，请稍候...");
  try {
    const result = await importFullBackup(file);
    const parts = [`已导入 ${result.importedScores} 份歌谱`];
    if (result.importedSetlists) {
      parts.push(`${result.importedSetlists} 个歌单`);
    }
    if (result.importedAnnotations) {
      parts.push(`${result.importedAnnotations} 条标注`);
    }
    if (result.skippedScores) {
      parts.push(`跳过 ${result.skippedScores} 份同名歌谱`);
    }
    setBackupStatus(`${parts.join("，")}。`);
  } catch (error) {
    console.error(error);
    setBackupStatus(getErrorMessage(error) || "导入失败，请确认备份文件是否完整。", true);
  } finally {
    elements.importBackupButton.disabled = false;
  }
}

function renderPreferencesScreen() {
  elements.viewerModeButtons?.forEach((button) => {
    const selected = button.dataset.viewerMode === state.viewerMode;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-checked", selected ? "true" : "false");
  });

  elements.themeModeButtons?.forEach((button) => {
    const selected = button.dataset.themeMode === state.themeMode;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-checked", selected ? "true" : "false");
  });
}

function setViewerModePreference(mode) {
  const nextMode = mode === VIEWER_MODE_LANDSCAPE ? VIEWER_MODE_LANDSCAPE : VIEWER_MODE_PORTRAIT;
  if (state.viewerMode === nextMode) {
    renderPreferencesScreen();
    return;
  }

  state.viewerMode = nextMode;
  writeViewerModePreference(nextMode);
  renderPreferencesScreen();

  if (elements.viewerDialog?.open && state.currentViewerScoreId) {
    const score = state.scores.find((item) => item.id === state.currentViewerScoreId);
    if (score) {
      resetViewerGestureState();
      setViewerZoom(VIEWER_MIN_ZOOM);
      renderViewerPages(score);
      updateViewerPianoKeySignature();
      elements.viewerPages.scrollTo({ left: 0, top: 0 });
    }
  } else if (elements.viewerDialog?.open && state.currentViewerSetlistId) {
    const setlist = state.setlists.find((item) => item.id === state.currentViewerSetlistId);
    if (setlist) {
      resetViewerGestureState();
      setViewerZoom(VIEWER_MIN_ZOOM);
      renderViewerPages(createSetlistViewerScore(setlist));
      updateViewerPianoKeySignature();
      elements.viewerPages.scrollTo({ left: 0, top: 0 });
    }
  }
}

function setThemePreference(mode) {
  const nextMode = mode === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  if (state.themeMode === nextMode) {
    renderPreferencesScreen();
    return;
  }

  state.themeMode = nextMode;
  writeThemePreference(nextMode);
  applyThemePreference(nextMode);
  renderPreferencesScreen();
}

async function saveProfile(event) {
  event.preventDefault();
  if (!state.session) {
    setProfileStatus("请先登录账号。", true);
    return;
  }

  const userId = state.session.user.id;
  const profile = {
    ...(state.profile || createDefaultProfile(userId)),
    userId,
    nickname: elements.profileNickname.value.trim(),
    gender: elements.profileGender.value,
    birthday: elements.profileBirthday.value,
    phoneNumber: getCurrentUserPhoneNumber(state.profile),
    emailAddress: getCurrentUserEmailAddress(state.profile),
    updatedAt: new Date().toISOString(),
  };

  state.profile = profile;
  state.profileLoadedUserId = userId;
  writeStoredProfile(userId, profile);
  updateAppTitle();
  elements.saveProfileButton.disabled = true;
  setProfileStatus("正在保存资料...");

  try {
    await saveProfileToCloud(profile);
    setProfileStatus("资料已保存。");
  } catch (error) {
    console.warn(error);
    setProfileStatus("资料已保存到本机。若需跨设备同步个人资料，请在 CloudBase 创建 profiles 集合。");
  } finally {
    elements.saveProfileButton.disabled = false;
  }
}

async function saveProfileToCloud(profile) {
  if (!state.cloudReady || !state.cloudDb || !state.session) {
    return;
  }

  await upsertCloud(PROFILE_COLLECTION_NAME, [toCloudProfile(profile)]);
}

function createDefaultProfile(userId) {
  return {
    id: userId,
    userId,
    nickname: "",
    gender: "",
    birthday: "",
    phoneNumber: state.session?.user?.phoneNumber || "",
    emailAddress: state.session?.user?.emailAddress || "",
    updatedAt: "",
  };
}

function readStoredProfile(userId) {
  if (!userId || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`${PROFILE_STORAGE_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

function writeStoredProfile(userId, profile) {
  if (!userId || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(`${PROFILE_STORAGE_PREFIX}${userId}`, JSON.stringify(profile));
  } catch (error) {
    console.warn(error);
  }
}

function toCloudProfile(profile) {
  return {
    id: profile.userId,
    user_id: profile.userId,
    nickname: profile.nickname || "",
    gender: profile.gender || "",
    birthday: profile.birthday || "",
    phone_number: profile.phoneNumber || "",
    email: profile.emailAddress || "",
    updated_at: profile.updatedAt || new Date().toISOString(),
  };
}

function fromCloudProfile(row) {
  return {
    id: row.id || row._id || row.user_id,
    userId: row.user_id || row.userId || row.id || row._id,
    nickname: row.nickname || "",
    gender: row.gender || "",
    birthday: row.birthday || "",
    phoneNumber: row.phone_number || row.phoneNumber || "",
    emailAddress: row.email || row.emailAddress || "",
    updatedAt: row.updated_at || row.updatedAt || "",
  };
}

// ===== 生日祝福弹窗 =====
// 100 条祝福，按年龄段分组；命中用户年龄段后在段内随机抽取一条。
const BIRTHDAY_BLESSINGS = [
  {
    maxAge: 19,
    messages: [
      "愿你新的一岁，如清晨第一缕光，明亮、干净、勇敢，照见更广阔的远方。",
      "愿你的青春不被风雨折弯，眼里有星，心中有梦，脚下有路，一路明朗。",
      "新岁如春芽初绽，愿你慢慢长大，也永远保留心里的天真与热望。",
      "愿你在书页与晨光里汲取力量，在奔跑与欢笑中遇见更好的自己。",
      "愿你像一株向阳的小树，根扎得深，枝叶伸向天空。",
      "愿这一岁，你有敢试的勇气，也有被爱包围的底气；有少年意气，也有温柔心肠。",
      "愿你一路追光，不惧山高水远；愿你心怀热爱，所到之处皆有花开。",
      "愿你新的一岁，笑容像夏天一样明亮，心事像云朵一样轻盈。",
      "愿你每一次努力都有回响，每一个梦想都慢慢发芽，每一天都比昨天更接近远方。",
      "愿你在成长的路上，既能乘风，也能赏花；既有锋芒，也有善良。",
      "愿你不慌不忙地长大，不负年少时的光，也不忘最初的自己。",
      "新的一岁，愿你的世界有书香、有花香、有远方，也有家人朋友温暖的目光。",
      "愿你像晨露一样清澈，像星辰一样闪耀，在青春最好的年纪，活成自己喜欢的模样。",
      "愿你拥有奔向未来的勇气，也拥有停下来拥抱生活的温柔。",
      "祝你生辰喜乐，愿岁月赠你明亮眼眸，也赠你热爱世界的心。",
    ],
  },
  {
    maxAge: 29,
    messages: [
      "愿你二十几岁的每一步，都走得热烈而坚定；既敢奔赴山海，也懂珍惜眼前烟火。",
      "新的一岁，愿你心中有方向，脚下有力量，眼前有光，身旁有爱。",
      "愿你在长大的路上，不只收获成熟，也继续保有热忱、浪漫与清澈。",
      "愿你所遇皆温柔，所行皆坦途，所念皆有回应。",
      "愿这一岁，你把平凡日子过成诗，把忙碌生活过成光，把自己活成答案。",
      "愿你有迎风而上的胆量，也有随遇而安的从容；有锋芒，也有柔软。",
      "愿你在新的一岁里，既能实现小目标，也能靠近大梦想。",
      "愿你不被世俗催促，不被焦虑裹挟，按照自己的节奏，开出自己的花。",
      "愿你往后每一年，都比昨天更自由，比过去更笃定，比想象中更闪亮。",
      "愿生活予你清风、朗月、热茶，也予你坚定向前的力量。",
      "愿你把日子过得有声有色，把人生走得有光有岸，把热爱守得长久明亮。",
      "愿你新的一岁，有独立的清醒，也有被拥抱的幸运；有乘风的勇气，也有归家的温暖。",
      "祝你一路有星河相伴，有花香入梦，有人懂你，有事可盼。",
      "愿你在不确定的世界里，仍然拥有确定的热爱；在漫长岁月里，始终心怀明亮。",
      "生辰快乐。愿你岁岁奔赴热爱，年年遇见新光，日日平安喜乐。",
    ],
  },
  {
    maxAge: 39,
    messages: [
      "三十以后，愿你更懂生活的深意，也更爱自己的从容；愿岁月温柔待你。",
      "愿你新的一岁，心有山海而不张扬，眼有星辰而不迷茫，行有方向而不慌忙。",
      "愿你在柴米油盐里见诗意，在奔波忙碌中有安宁。",
      "愿你历经世事，仍能温柔；见过风雨，仍有晴朗；走过山河，仍爱人间。",
      "新的一岁，愿你事业有稳稳的进步，生活有细细的欢喜，心中有长长的春天。",
      "愿你不必事事圆满，却能处处心安；不必人人理解，却能坚定自在。",
      "祝你生辰喜乐。愿你把日子过得丰盈，把人生走得坦荡，把内心安放得温柔。",
      "愿这一岁，少些疲惫，多些舒展；少些遗憾，多些圆满；少些焦虑，多些安然。",
      "愿你在成熟的年纪里，仍保有少年般的清澈，也拥有成年人最珍贵的笃定。",
      "愿你有独处的清欢，也有相聚的热闹；有前行的力量，也有停靠的港湾。",
      "愿你往后的人生，山一程水一程，程程皆有好风景；昼一段夜一段，段段皆有暖灯火。",
      "愿你新的一岁，心中有秩序，眼里有温度，手中有能力，生活有回甘。",
      "愿你既能扛起责任，也能拥抱浪漫；既能照顾别人，也能好好疼爱自己。",
      "愿你在不声不响的日子里，积攒出越来越深的底气，活成温润而有力量的人。",
      "愿岁月赠你阅历，也赠你欢喜；赠你沉稳，也赠你不灭的热爱。",
    ],
  },
  {
    maxAge: 49,
    messages: [
      "四十至五十，是人生由热烈走向丰盈的年纪。愿你心中有山河，眼里有清光，日子从容，岁月生香。",
      "愿你走过半生风雨，依旧心怀明亮；历经人间冷暖，仍能温柔从容。",
      "愿这一岁，你把过往沉淀成智慧，把未来铺展成坦途，把平凡日子过出清欢与回甘。",
      "愿你不被年龄定义，不被忙碌消磨，心中仍有热爱，脚下仍有方向。",
      "四十以后，愿你活得更通透，也更自在；更懂取舍，也更懂珍惜。",
      "愿你眼里有阅历沉淀出的光，心中有岁月打磨后的静，身边有温暖长久相伴。",
      "愿你新的一岁，事业稳中有进，家庭和乐安宁，心境舒展明朗，生活处处有喜。",
      "愿你把生活过成一杯好茶，有清香，有回味，有温度，也有恰到好处的从容。",
      "愿未来的日子，不慌不忙，不忧不惧；有山水可看，有知己可谈，有欢喜可盼。",
      "愿你半生积攒的努力，都化作今日的底气；愿你往后的岁月，安稳、丰盛、明亮、自在。",
    ],
  },
  {
    maxAge: 59,
    messages: [
      "五十之后，人生如秋水长天，沉静而辽阔。愿您岁岁安康。",
      "愿您新的一岁，心宽如海，福暖如春，日子有滋有味，生活有声有色。",
      "愿岁月只添风度，不添烦忧；只赠从容，不减笑颜。",
      "愿您把半生风霜走成坦途，把往后日子过成花开，平安健康，喜乐常在。",
      "愿您的生活像一壶好茶，越品越香；像一卷好书，越读越有味。",
      "新的一岁，愿您身康体健，心静神安，春有花香，秋有果甜，四季皆欢喜。",
      "愿您眼中有笑，心中有暖，家中有爱，身边有福。",
      "愿岁月温柔地经过您，不带走光彩，只沉淀智慧；不留下疲惫，只留下安宁。",
      "愿您往后的日子，清晨有好茶，午后有闲趣，夜晚有安眠，心中有长乐。",
      "五十多岁的光阴，是山水入画，也是人生入境。愿您越活越舒展，越走越明朗。",
      "愿您不慌不忙地享受生活，不紧不慢地收获幸福，日日有暖意，年年有好景。",
      "愿好运如春风常至，健康如青山常在，福气如流水绵长。",
      "愿您把日子过得安静丰盈，把心情养得明亮舒展，把人生走得稳稳当当。",
      "愿新的一岁，所有辛苦都被温柔接住，所有付出都被岁月记得。",
      "祝您福气满怀，安康常伴；愿一岁一礼，一寸欢喜，一程岁月，一路花开。",
    ],
  },
  {
    maxAge: Infinity,
    messages: [
      "花甲之后，人生更见清明。愿您身体康健，心情舒朗，福泽绵长。",
      "愿您新的一岁，如松柏常青，如春风常暖，日子平和，笑容常在。",
      "愿健康与您相伴，快乐与您同行，家人围坐，岁月温良。",
      "愿您把人生的风雨都走成风景，把岁月的痕迹都酿成慈祥。",
      "六十多岁的光阴，是一盏温暖的灯。愿它照见团圆，也照见您心里的自在安宁。",
      "愿您日日有清欢，月月有喜事，年年有安康，岁岁有福气。",
      "祝您生辰吉乐。愿您心如明月，身似青松，福如春水，寿比南山。",
      "愿您的晚年不止平安，更有乐趣；不止健康，更有自在；不止团圆，更有欢笑。",
      "愿您在新的一岁里，晨起有鸟鸣，饭后有闲步，窗前有花开，身边有亲人。",
      "愿岁月缓缓，福气长长，家和人安，万事皆顺。",
      "愿您一生积攒的善意，都化作今日的祝福；一生付出的辛劳，都换来往后的安享。",
      "愿您身体如松柏康健，心境如白云悠然，生活如春水温柔。",
      "祝您新岁添福，寿域增辉；愿每一天都有好心情，每一年都有好光景。",
      "愿您笑看庭前花开，闲听窗外风过，平平安安，和和美美，长长久久。",
      "愿您福在眼前，乐在心间，安康在身边，团圆在岁岁年年。",
      "岁至古稀，风华不减。愿您福寿安康，笑口常开，岁月长宁。",
      "愿您如松柏长青，如明月常圆，福气绵绵，安康年年。",
      "祝您生辰吉乐。愿家人绕膝，灯火可亲，日子温暖，心境安然。",
      "愿您这一生的慈爱与辛劳，都在今天化作满堂祝福、满屋欢笑。",
      "七十岁以后，人生如一幅淡雅长卷。愿您笔笔从容，页页安康，日日喜乐。",
      "愿您福如春水长流，寿似青山不老，心中常有欢喜，身边常有团圆。",
      "愿您吃得香、睡得安、笑得甜、走得稳，岁岁平安。",
      "愿岁月不催您，只陪您慢慢享福；愿时光不扰您，只赠您安康与欢颜。",
      "愿您一生的厚德，化作后辈的敬爱；一世的温良，换来满门的福气。",
      "祝您寿辰安康。愿春有繁花，夏有清风，秋有硕果，冬有暖阳，四季皆吉祥。",
      "愿您眉眼含笑，心中无忧；家中有爱，身边有伴；日子清宁，福寿绵延。",
      "愿青山不老，绿水长流，福星常照，喜事常来。",
      "愿您把日子过成诗，把岁月过成福；一餐一饭皆安稳，一朝一夕皆欢喜。",
      "愿您所到之处皆有温暖，所念之人皆在身旁，所过之年皆是福年。",
      "祝您福寿双全，安康长乐；愿今天的烛光映着团圆，往后的岁月盛满平安。",
    ],
  },
];

function getAgeFromBirthday(birthday) {
  if (!birthday) {
    return null;
  }
  const birth = new Date(birthday);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

function isBirthdayToday(birthday) {
  if (!birthday) {
    return false;
  }
  const birth = new Date(birthday);
  if (Number.isNaN(birth.getTime())) {
    return false;
  }
  const now = new Date();
  return birth.getMonth() === now.getMonth() && birth.getDate() === now.getDate();
}

function pickBirthdayBlessing(birthday, userId) {
  const age = getAgeFromBirthday(birthday);
  const group =
    BIRTHDAY_BLESSINGS.find((item) => age == null || age <= item.maxAge) ||
    BIRTHDAY_BLESSINGS[BIRTHDAY_BLESSINGS.length - 1];
  const messages = group.messages;
  if (!messages.length) {
    return "";
  }
  if (!userId) {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // 尽量不重复：记录本年内已用过的祝福语，每次从未用过的里随机抽；用完一轮再重置。
  const key = `${BIRTHDAY_USED_PREFIX}${userId}:${new Date().getFullYear()}`;
  let used = [];
  try {
    const raw = window.localStorage?.getItem(key);
    used = raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn(error);
  }
  if (!Array.isArray(used)) {
    used = [];
  }
  let available = messages.filter((message) => !used.includes(message));
  if (!available.length) {
    used = [];
    available = messages.slice();
  }
  const chosen = available[Math.floor(Math.random() * available.length)];
  used.push(chosen);
  try {
    window.localStorage?.setItem(key, JSON.stringify(used));
  } catch (error) {
    console.warn(error);
  }
  return chosen;
}

function scheduleBirthdayPopupCheck() {
  // 略延迟，等启动/登录 UI 稳定后再弹，避免与其它流程冲突。
  window.setTimeout(() => {
    try {
      maybeShowBirthdayPopup();
    } catch (error) {
      console.warn("生日弹窗检查失败（忽略）", error);
    }
  }, 1200);
}

function maybeShowBirthdayPopup() {
  const profile = state.profile;
  const userId = state.session?.user?.id || "";
  if (!profile || !userId || !profile.birthday || !isBirthdayToday(profile.birthday)) {
    return;
  }
  // 仅防止同一次启动的多个触发重复弹；不持久化，所以每次重新打开 App 都会再弹。
  if (state.birthdayPopupShownThisSession) {
    return;
  }
  state.birthdayPopupShownThisSession = true;
  showBirthdayPopup(profile.birthday, userId);
}

function showBirthdayPopup(birthday, userId = state.session?.user?.id || "") {
  const dialog = elements.birthdayDialog;
  if (!dialog || dialog.open) {
    return;
  }
  if (elements.birthdayMessage) {
    elements.birthdayMessage.textContent = pickBirthdayBlessing(birthday, userId);
  }
  if (typeof dialog.showModal === "function") {
    try {
      dialog.showModal();
    } catch (error) {
      dialog.setAttribute("open", "");
    }
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeBirthdayPopup() {
  const dialog = elements.birthdayDialog;
  if (!dialog) {
    return;
  }
  if (dialog.open) {
    try {
      dialog.close();
    } catch (error) {
      dialog.removeAttribute("open");
    }
  } else {
    dialog.removeAttribute("open");
  }
}

function getCurrentUserPhoneNumber(profile = state.profile) {
  const userPhone = state.session?.user?.phoneNumber || "";
  const profilePhone = profile?.phoneNumber || "";
  const accountLabel = getCurrentAccountLabel();
  const labelPhone = isLikelyPhoneNumber(accountLabel) ? normalizePhoneNumber(accountLabel) : "";
  return userPhone || profilePhone || labelPhone || "";
}

function getCurrentUserEmailAddress(profile = state.profile) {
  const userEmail = state.session?.user?.emailAddress || "";
  const profileEmail = profile?.emailAddress || "";
  const accountLabel = getCurrentAccountLabel();
  const labelEmail = isEmailAddress(accountLabel) ? accountLabel : "";
  return userEmail || profileEmail || labelEmail || "";
}

function openProfileLinkDialog(mode) {
  if (!state.session) {
    openAuthDialog();
    return;
  }

  state.profileLinkMode = mode;
  state.profileLinkSudoToken = "";
  state.profileLinkVerificationId = "";
  state.profileLinkContact = "";
  elements.profileLinkForm.reset();

  const isPhone = mode === "phone";
  elements.profileLinkDialogTitle.textContent = isPhone ? "关联手机号" : "关联邮箱";
  elements.profileLinkContactLabel.textContent = isPhone ? "手机号" : "邮箱";
  elements.profileLinkContact.type = isPhone ? "tel" : "email";
  elements.profileLinkContact.inputMode = isPhone ? "tel" : "email";
  elements.profileLinkContact.autocomplete = isPhone ? "tel" : "email";
  elements.profileLinkContact.placeholder = isPhone ? "请输入手机号" : "请输入邮箱";
  setProfileLinkStatus(isPhone ? "输入手机号并发送验证码。" : "输入邮箱并发送验证码。");
  closeProfileDialog();

  if (typeof elements.profileLinkDialog.showModal === "function") {
    elements.profileLinkDialog.showModal();
  } else {
    elements.profileLinkDialog.setAttribute("open", "");
  }

  refreshIcons();
  requestAnimationFrame(() => elements.profileLinkContact.focus());
}

function closeProfileLinkDialog() {
  if (elements.profileLinkDialog.open) {
    elements.profileLinkDialog.close();
  } else {
    elements.profileLinkDialog.removeAttribute("open");
  }
}

function setProfileLinkStatus(message, isError = false) {
  if (!elements.profileLinkState) {
    return;
  }

  elements.profileLinkState.textContent = message;
  elements.profileLinkState.style.color = isError ? "var(--danger)" : "var(--muted)";
}

async function sendProfileLinkCode() {
  const password = elements.profileLinkPassword.value;
  const contact = getNormalizedProfileLinkContact();

  if (!password) {
    setProfileLinkStatus("请输入当前账号密码。", true);
    return;
  }
  if (!contact) {
    setProfileLinkStatus(state.profileLinkMode === "phone" ? "请输入正确的手机号。" : "请输入正确的邮箱。", true);
    return;
  }

  if (!(await ensureCloudReady())) {
    setProfileLinkStatus(state.cloudError || "CloudBase 连接失败。", true);
    return;
  }

  elements.sendProfileLinkCodeButton.disabled = true;
  setProfileLinkStatus("正在发送验证码...");

  try {
    state.profileLinkSudoToken = await requestCloudSudoToken(password);
    const result = await sendCloudContactVerification(state.profileLinkMode, contact);
    state.profileLinkVerificationId = extractCloudValue(result, ["verification_id", "verificationId", "id"]);
    state.profileLinkContact = contact;
    setProfileLinkStatus(`验证码已发送至 ${contact}。`);
    requestAnimationFrame(() => elements.profileLinkCode.focus());
  } catch (error) {
    console.error(error);
    setProfileLinkStatus(getErrorMessage(error) || "验证码发送失败，请稍后再试。", true);
  } finally {
    elements.sendProfileLinkCodeButton.disabled = false;
  }
}

async function confirmProfileLink(event) {
  event.preventDefault();
  const code = elements.profileLinkCode.value.trim();
  const contact = getNormalizedProfileLinkContact();

  if (!state.profileLinkSudoToken || !state.profileLinkContact || contact !== state.profileLinkContact) {
    setProfileLinkStatus("请先发送验证码。", true);
    return;
  }
  if (!code) {
    setProfileLinkStatus("请输入验证码。", true);
    return;
  }

  elements.confirmProfileLinkButton.disabled = true;
  setProfileLinkStatus("正在完成关联...");

  try {
    await bindCloudContact(state.profileLinkMode, contact, code);
    await updateLinkedContact(state.profileLinkMode, contact);
    closeProfileLinkDialog();
    setStatus(state.profileLinkMode === "phone" ? "手机号关联成功。" : "邮箱关联成功。");
    await openProfileDialog();
  } catch (error) {
    console.error(error);
    setProfileLinkStatus(getErrorMessage(error) || "关联失败，请稍后再试。", true);
  } finally {
    elements.confirmProfileLinkButton.disabled = false;
  }
}

function getNormalizedProfileLinkContact() {
  const value = elements.profileLinkContact.value.trim();
  if (state.profileLinkMode === "phone") {
    return isValidPhoneNumber(value) ? toCloudPhoneNumber(value) : "";
  }

  return isEmailAddress(value) ? value : "";
}

async function requestCloudSudoToken(password) {
  const sudoMethod =
    typeof state.cloudAuth.sudo === "function"
      ? state.cloudAuth.sudo.bind(state.cloudAuth)
      : typeof state.cloudAuth.getSudoToken === "function"
        ? state.cloudAuth.getSudoToken.bind(state.cloudAuth)
        : null;

  if (!sudoMethod) {
    throw new Error("当前 CloudBase SDK 不支持账号关联所需的安全验证。");
  }

  const result = await sudoMethod({ password });
  throwCloudResultError(result);
  const token = extractCloudValue(result, ["sudo_token", "sudoToken", "token"]);
  if (!token) {
    throw new Error("安全验证失败，请确认当前账号密码。");
  }
  return token;
}

async function sendCloudContactVerification(mode, contact) {
  if (typeof state.cloudAuth.getVerification === "function") {
    const payload = mode === "phone" ? { phone_number: contact } : { email: contact };
    const result = await state.cloudAuth.getVerification(payload);
    throwCloudResultError(result);
    return result;
  }

  if (mode === "phone" && typeof state.cloudAuth.sendPhoneCode === "function") {
    const result = await state.cloudAuth.sendPhoneCode(contact);
    throwCloudResultError(result);
    return result;
  }

  throw new Error("当前 CloudBase SDK 不支持发送关联验证码。");
}

async function bindCloudContact(mode, contact, code) {
  const verificationToken = await getProfileLinkVerificationToken(code);
  const payload =
    mode === "phone"
      ? { sudo_token: state.profileLinkSudoToken, phone_number: contact }
      : { sudo_token: state.profileLinkSudoToken, email: contact };

  if (verificationToken) {
    payload.verification_token = verificationToken;
  } else {
    payload.verification_code = code;
  }

  const methodName = mode === "phone" ? "bindPhoneNumber" : "bindEmail";
  if (typeof state.cloudAuth[methodName] !== "function") {
    throw new Error(mode === "phone" ? "当前 CloudBase SDK 不支持关联手机号。" : "当前 CloudBase SDK 不支持关联邮箱。");
  }

  const result = await state.cloudAuth[methodName](payload);
  throwCloudResultError(result);
  return result;
}

async function getProfileLinkVerificationToken(code) {
  if (!state.profileLinkVerificationId || typeof state.cloudAuth.verify !== "function") {
    return "";
  }

  const result = await state.cloudAuth.verify({
    verification_id: state.profileLinkVerificationId,
    verification_code: code,
  });
  throwCloudResultError(result);
  return extractCloudValue(result, ["verification_token", "verificationToken", "token"]);
}

async function updateLinkedContact(mode, contact) {
  if (!state.session) {
    return;
  }

  const userId = state.session.user.id;
  const profile = state.profile || readStoredProfile(userId) || createDefaultProfile(userId);
  const nextProfile = {
    ...profile,
    phoneNumber: mode === "phone" ? contact : getCurrentUserPhoneNumber(profile),
    emailAddress: mode === "email" ? contact : getCurrentUserEmailAddress(profile),
    updatedAt: new Date().toISOString(),
  };

  if (mode === "phone") {
    state.session.user.phoneNumber = contact;
    state.session.user.accountLabel = contact;
    writeStoredAccountLabel(userId, contact);
  } else {
    state.session.user.emailAddress = contact;
    if (!state.session.user.phoneNumber) {
      state.session.user.accountLabel = contact;
      writeStoredAccountLabel(userId, contact);
    }
  }

  state.profile = nextProfile;
  state.profileLoadedUserId = userId;
  writeStoredProfile(userId, nextProfile);
  updateAppTitle();

  try {
    await saveProfileToCloud(nextProfile);
  } catch (error) {
    console.warn(error);
  }

  updateAccountUi();
}

function updateAppTitle() {
  if (!elements.appTitle) {
    return;
  }

  const nickname = String(state.profile?.nickname || "").trim();
  elements.appTitle.textContent = nickname ? `${nickname}的谱夹` : "我的谱夹";
}

function extractCloudValue(result, keys) {
  const containers = [result, result?.data, result?.result, result?.result?.data];
  for (const container of containers) {
    if (!container || typeof container !== "object") {
      continue;
    }
    for (const key of keys) {
      if (container[key]) {
        return String(container[key]);
      }
    }
  }
  return "";
}

function goBackInAuthDialog() {
  if (state.authMode === "registerPassword") {
    setAuthMode("registerCode");
    return;
  }
  if (state.authMode === "registerCode") {
    setAuthMode("registerChoice");
    return;
  }
  setAuthMode("guest");
}

function beginRegisterWithCode(method) {
  state.authRegisterMethod = method;
  state.authRegisterAccount = "";
  state.authRegisterCode = "";
  state.authRegisterVerifyOtp = null;
  state.authRegisterPayload = null;
  elements.registerContactInput.value = "";
  elements.registerCodeInput.value = "";
  elements.registerPassword.value = "";
  elements.registerPasswordConfirm.value = "";
  setAuthMode("registerCode");
  requestAnimationFrame(() => elements.registerContactInput.focus());
}

async function signInWithPassword(event) {
  event.preventDefault();
  if (state.authMode !== "login") {
    return;
  }

  const account = elements.authEmail.value.trim();
  if (!account || !elements.authPassword.value) {
    setAuthStatus("请填写手机号或邮箱和密码。", true);
    return;
  }

  setAuthStatus("正在连接 CloudBase，请稍候...");
  elements.signInButton.disabled = true;

  if (!(await ensureCloudReady())) {
    elements.signInButton.disabled = false;
    updateAccountUi();
    return;
  }

  try {
    setAuthStatus("正在登录...");
    const loginState = await signInCloudWithPassword(account, elements.authPassword.value);
    state.session = await createCloudSession(loginState, account);
    if (!state.session) {
      throw new Error("登录状态读取失败，请重新登录。");
    }
    // 记住账号身份：之后即使会话恢复慢，打开 App 也能按此身份显示歌谱。
    rememberAccountIdentity();
    console.log("[auth-login] userId:", state.session.user.id, "| merged account ids:", getMergedAccountIds());
    try {
      await loadProfileForCurrentUser({ includeCloud: true });
      scheduleBirthdayPopupCheck();
    } catch (profileError) {
      console.warn("加载资料失败（忽略）", profileError);
    }
    // 先更新 UI、关闭弹窗，保证登录态即时生效、不被同步阻塞。
    updateAccountUi();
    closeAuthDialog();
    // 本地可能为空（重装/换设备），登录后必须主动从云端拉回歌谱元数据并显示。
    setStatus("已登录，正在从云端同步歌谱...");
    try {
      await claimLocalRecordsForUser(state.session.user.id);
      await pullCloudMetadataForCurrentAccount();
      await loadScores();
      setBackgroundSyncError("");
      setStatus(state.scores.length ? "歌谱已从云端同步。" : "同步完成。");
    } catch (syncError) {
      console.warn("登录后云端拉取失败", syncError);
      if (isLocalDatabaseNotReadyError(syncError)) {
        setBackgroundSyncError("");
        setStatus("本地数据库正在恢复，请稍后重试同步。", true);
        window.setTimeout(() => queueAccountBackgroundSync(state.session.user.id, "", { immediate: true }), 1500);
        return;
      }
      // 拉取失败不回退登录态；在“我的”同步面板显示原因。
      setBackgroundSyncError(getErrorMessage(syncError) || "云端同步失败，请在“我的”页点击重试。");
      setStatus("云端同步未完成，可在“我的”页点击重试。", true);
      try { await loadScores(); } catch (e) { console.warn(e); }
    }
    console.log("[auth-login] cloud/final scores:", state.scores.length);
    preloadAllScoreCovers({ includeCloud: true }).catch((coverError) => console.warn(coverError));
    queueAccountBackgroundSync(state.session.user.id, "", { immediate: true });
    kickOutbox(1500);
  } catch (error) {
    console.error(error);
    const message = getErrorMessage(error) || "登录失败，请检查账号密码。";
    setAuthStatus(message, true);
    setStatus(message, true);
  } finally {
    elements.signInButton.disabled = false;
  }
}

async function sendRegisterCode() {
  const account = elements.registerContactInput.value.trim();
  if (state.authRegisterMethod === "phone" && !isValidPhoneNumber(account)) {
    setAuthStatus("请输入正确的手机号。", true);
    return;
  }
  if (state.authRegisterMethod === "email" && !isEmailAddress(account)) {
    setAuthStatus("请输入正确的邮箱。", true);
    return;
  }

  elements.sendRegisterCodeButton.disabled = true;
  setAuthStatus("正在发送验证码...");

  if (!(await ensureCloudReady())) {
    elements.sendRegisterCodeButton.disabled = false;
    return;
  }

  try {
    state.authRegisterAccount =
      state.authRegisterMethod === "phone" ? normalizePhoneNumber(account) : account;
    state.authRegisterVerifyOtp = null;
    state.authRegisterPayload = null;

    if (state.authRegisterMethod === "phone") {
      if (typeof state.cloudAuth.sendPhoneCode !== "function") {
        throw new Error("当前 CloudBase SDK 不支持手机验证码注册。");
      }
      const result = await state.cloudAuth.sendPhoneCode(state.authRegisterAccount);
      throwCloudResultError(result);
    } else {
      if (typeof state.cloudAuth.signUp !== "function") {
        throw new Error("当前 CloudBase SDK 不支持邮箱验证码注册。");
      }
      state.authRegisterPayload = { email: state.authRegisterAccount };
      const result = await state.cloudAuth.signUp(state.authRegisterPayload);
      throwCloudResultError(result);
      state.authRegisterVerifyOtp = result?.data?.verifyOtp || null;
    }

    setAuthStatus(`验证码已发送至 ${state.authRegisterAccount}。`);
    requestAnimationFrame(() => elements.registerCodeInput.focus());
  } catch (error) {
    console.error(error);
    const message = getErrorMessage(error) || "验证码发送失败，请稍后再试。";
    setAuthStatus(message, true);
    setStatus(message, true);
  } finally {
    elements.sendRegisterCodeButton.disabled = false;
  }
}

function continueToRegisterPassword() {
  const account = elements.registerContactInput.value.trim();
  const normalizedAccount = state.authRegisterMethod === "phone" ? normalizePhoneNumber(account) : account;
  const code = elements.registerCodeInput.value.trim();

  if (!state.authRegisterAccount || state.authRegisterAccount !== normalizedAccount) {
    setAuthStatus("请先发送验证码。", true);
    return;
  }
  if (!code) {
    setAuthStatus("请输入验证码。", true);
    return;
  }

  state.authRegisterCode = code;
  setAuthMode("registerPassword");
  requestAnimationFrame(() => elements.registerPassword.focus());
}

async function completeRegisterWithPassword() {
  const password = elements.registerPassword.value;
  const confirmPassword = elements.registerPasswordConfirm.value;
  if (password.length < 6) {
    setAuthStatus("密码至少需要 6 位。", true);
    return;
  }
  if (password !== confirmPassword) {
    setAuthStatus("两次输入的密码不一致。", true);
    return;
  }
  if (!state.authRegisterAccount || !state.authRegisterCode) {
    setAuthStatus("验证码已失效，请重新获取。", true);
    setAuthMode("registerCode");
    return;
  }

  elements.completeRegisterButton.disabled = true;
  setAuthStatus("正在注册账号...");

  if (!(await ensureCloudReady())) {
    elements.completeRegisterButton.disabled = false;
    return;
  }

  try {
    const loginState =
      state.authRegisterMethod === "phone"
        ? await signUpCloudWithPhoneCode(state.authRegisterAccount, state.authRegisterCode, password)
        : await signUpCloudWithEmailCode(state.authRegisterAccount, state.authRegisterCode, password);
    state.session = await createCloudSession(loginState, state.authRegisterAccount);
    if (!state.session) {
      throw new Error("注册成功，但登录状态读取失败，请重新登录。");
    }
    rememberAccountIdentity();
    try {
      await loadProfileForCurrentUser({ includeCloud: true });
    } catch (profileError) {
      console.warn("加载资料失败（忽略）", profileError);
    }
    state.authRegisterVerifyOtp = null;
    state.authRegisterPayload = null;
    // 注册完成后立即刷新列表；认领与同步放后台立即执行，不阻塞。
    await loadScores();
    updateAccountUi();
    closeAuthDialog();
    preloadAllScoreCovers({ includeCloud: true }).catch((coverError) => console.warn(coverError));
    queueAccountBackgroundSync(state.session.user.id, "注册成功，正在后台同步...", { immediate: true });
  } catch (error) {
    console.error(error);
    const message = getErrorMessage(error) || "注册失败，请稍后再试。";
    setAuthStatus(message, true);
    setStatus(message, true);
  } finally {
    elements.completeRegisterButton.disabled = false;
  }
}

async function ensureCloudReady() {
  if (state.cloudReady) {
    return true;
  }

  setAuthStatus("正在连接 CloudBase，请稍候...");
  setStatus("正在连接 CloudBase...");
  const ready = await initializeCloud();
  if (!ready) {
    setAuthStatus(state.cloudError || "CloudBase 连接失败，请检查配置。", true);
    setStatus(state.cloudError || "CloudBase 连接失败，请检查配置。", true);
    return false;
  }

  setAuthStatus("CloudBase 已连接，可以登录或注册。");
  setStatus("");
  return true;
}

async function signInCloudWithPassword(account, password) {
  if (isLikelyPhoneNumber(account) && typeof state.cloudAuth.signInWithPhoneCodeOrPassword === "function") {
    return state.cloudAuth.signInWithPhoneCodeOrPassword({
      phoneNumber: normalizePhoneNumber(account),
      password,
    });
  }

  if (typeof state.cloudAuth.signIn === "function") {
    return state.cloudAuth.signIn({ username: account, password });
  }

  if (typeof state.cloudAuth.signInWithUsernameAndPassword === "function") {
    return state.cloudAuth.signInWithUsernameAndPassword(account, password);
  }

  return state.cloudAuth.signInWithEmailAndPassword(account, password);
}

async function signUpCloudWithPhoneCode(phoneNumber, phoneCode, password) {
  if (typeof state.cloudAuth.signUpWithPhoneCode === "function") {
    return state.cloudAuth.signUpWithPhoneCode(phoneNumber, phoneCode, password);
  }

  if (typeof state.cloudAuth.signUp === "function") {
    const result = await state.cloudAuth.signUp({
      phone_number: phoneNumber,
      verification_code: phoneCode,
      password,
    });
    throwCloudResultError(result);
    return result;
  }

  throw new Error("当前 CloudBase SDK 不支持手机验证码注册。");
}

async function signUpCloudWithEmailCode(email, emailCode, password) {
  if (typeof state.cloudAuth.signUp !== "function") {
    throw new Error("当前 CloudBase SDK 不支持邮箱验证码注册。");
  }

  if (typeof state.authRegisterVerifyOtp === "function") {
    if (state.authRegisterPayload?.email === email) {
      state.authRegisterPayload.password = password;
    }
    const result = await state.authRegisterVerifyOtp({ token: emailCode });
    throwCloudResultError(result);
    return result;
  }

  const result = await state.cloudAuth.signUp({
    email,
    verification_code: emailCode,
    password,
  });
  throwCloudResultError(result);
  return result;
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

function getErrorMessage(error) {
  if (!error) {
    return "未知错误";
  }

  if (typeof error === "string") {
    return error;
  }

  return error.message || error.msg || error.error_description || error.code || "未知错误";
}

function isEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhoneNumber(value) {
  return String(value || "").replace(/[\s-]/g, "");
}

function toCloudPhoneNumber(value) {
  const normalized = normalizePhoneNumber(value).replace(/^\+/, "");
  if (/^1[3-9]\d{9}$/.test(normalized)) {
    return `+86 ${normalized}`;
  }
  if (/^861[3-9]\d{9}$/.test(normalized)) {
    return `+86 ${normalized.slice(2)}`;
  }
  return String(value || "").trim().replace(/\s+/, " ");
}

function isLikelyPhoneNumber(value) {
  const normalized = normalizePhoneNumber(value);
  return /^(\+?86)?1[3-9]\d{9}$/.test(normalized);
}

function isValidPhoneNumber(value) {
  return isLikelyPhoneNumber(value);
}

function requestVerificationCode(account) {
  if (!elements.verifyDialog || !elements.verifyForm || !elements.verifyCodeInput) {
    return Promise.resolve(window.prompt(`请输入发送至 ${account} 的验证码`)?.trim() || "");
  }

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
  if (!elements.verifyDialog) {
    if (state.verifyDialogResolve) {
      state.verifyDialogResolve(code);
      state.verifyDialogResolve = null;
    }
    return;
  }

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

  const keepAuthDialogOpen = Boolean(elements.authDialog?.open);
  await state.cloudAuth.signOut();
  window.clearTimeout(state.accountSyncTimer);
  state.accountSyncTimer = 0;
  state.session = null;
  state.profile = null;
  state.profileLoadedUserId = "";
  // 退出登录后清除记住的账号身份，避免之后按旧身份继续显示该账号歌谱。
  clearRememberedAccountIdentity();
  updateAppTitle();
  closeProfileDialog();
  closeProfileLinkDialog();
  if (keepAuthDialogOpen) {
    setAuthMode("guest");
  } else {
    closeAuthDialog();
  }
  await loadScores();
  setStatus("已退出登录。");
  updateAccountUi();
}

function openAddScreen() {
  state.addScreenOpen = true;
  state.activeTab = "library";
  populateScoreFolders(state.currentFolderId || "");
  elements.libraryScreen.hidden = true;
  elements.myScreen.hidden = true;
  elements.uploadScreen.hidden = false;
  elements.addScoreButton.hidden = true;
  document.body.classList.add("add-screen-open");
  document.body.classList.remove("mine-tab-open");
  updateMainNav();
  refreshIcons();
  requestAnimationFrame(() => {
    elements.scoreName.focus();
  });
}

function closeAddScreen(options = {}) {
  state.addScreenOpen = false;
  state.activeTab = "library";
  elements.uploadScreen.hidden = true;
  elements.libraryScreen.hidden = false;
  elements.myScreen.hidden = true;
  elements.addScoreButton.hidden = false;
  document.body.classList.remove("add-screen-open");
  document.body.classList.remove("mine-tab-open");
  updateMainNav();

  if (options.resetForm) {
    resetForm(false);
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    return;
  }

  try {
    let reloadingForNewWorker = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloadingForNewWorker) {
        return;
      }

      reloadingForNewWorker = true;
      window.location.reload();
    });

    const registration = await navigator.serviceWorker.register("./sw.js?v=241");
    await registration.update();
  } catch (error) {
    console.warn("Service worker registration failed.", error);
  }
}

async function installApp() {
  if (!state.installPrompt) {
    showInstallFallbackGuide();
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
  updateInstallButtonVisibility();
}

function showInstallFallbackGuide() {
  const message = isAndroidDevice()
    ? "如果没有弹出安装窗口，请点浏览器右上角菜单，选择“安装应用”或“添加到主屏幕”。部分安卓自带浏览器只能通过浏览器菜单安装网页 App。"
    : "请使用浏览器菜单中的“添加到主屏幕”或“安装应用”来安装。";
  setStatus(message);
  window.alert(message);
  updateInstallButtonVisibility();
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

  if (previousZoom !== state.viewerZoom) {
    // 即时让画布随图片缩放（不重绘，无闪烁），缩放停止后再去抖重栅格化恢复清晰度。
    syncAllAnnotationCanvasGeometry();
    scheduleAnnotationRerasterAfterZoom();
  }
}

function setViewerZoomFast(value, options = {}) {
  const previousZoom = state.viewerZoom;
  const nextZoom = clamp(value, VIEWER_MIN_ZOOM, VIEWER_MAX_ZOOM);

  if (Math.abs(nextZoom - previousZoom) < 0.001) {
    return;
  }

  const anchor = getViewerZoomAnchor(options.centerPoint);

  state.viewerZoom = Math.round(nextZoom * 1000) / 1000;
  elements.viewerPages.style.setProperty("--viewer-zoom", state.viewerZoom);
  elements.viewerPages.classList.toggle("is-zoomed", state.viewerZoom > VIEWER_MIN_ZOOM + 0.001);

  if (anchor && previousZoom > 0 && previousZoom !== state.viewerZoom) {
    applyViewerZoomAnchor(anchor);
  }

  // 即时几何同步（无重绘、无闪烁），停止后去抖重栅格化恢复清晰度。
  syncAllAnnotationCanvasGeometry();
  scheduleAnnotationRerasterAfterZoom();
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

function resetViewerPointerState() {
  resetViewerLivePinchState();
  state.viewerPointers.clear();
  state.viewerPinchStartDistance = 0;
  state.viewerPinchStartZoom = state.viewerZoom;
  state.viewerPinchLastCenter = null;
  state.viewerPinchLastDistance = 0;
  state.viewerPinchLastAppliedZoom = state.viewerZoom;
  state.viewerDrag = null;
  state.viewerTapStart = null;
  elements.viewerPages?.classList.remove("is-pinching", "is-dragging");
}

function requestViewerPinchFrame() {
  if (state.viewerPinchRaf) {
    return;
  }

  state.viewerPinchRaf = requestAnimationFrame(applyViewerPinchFrame);
}

function applyViewerPinchFrame() {
  state.viewerPinchRaf = 0;

  const pending = state.viewerPendingPinch;
  state.viewerPendingPinch = null;
  const target = state.viewerPinchTarget;

  if (!pending || !target || !state.viewerPinchActive || !state.viewerPinchStartDistance) {
    return;
  }

  const rawScale = pending.distance / state.viewerPinchStartDistance;
  const finalZoom = clamp(state.viewerPinchStartZoom * rawScale, VIEWER_MIN_ZOOM, VIEWER_MAX_ZOOM);
  const visualScale = finalZoom / Math.max(state.viewerPinchStartZoom, 0.001);
  const startCenter = state.viewerPinchStartCenter || pending.center;
  const currentCenter = pending.center || startCenter;
  state.viewerPinchCurrentCenter = currentCenter;
  state.viewerPinchLiveScale = visualScale;
  state.viewerPinchLiveTranslateX = currentCenter.x - startCenter.x;
  state.viewerPinchLiveTranslateY = currentCenter.y - startCenter.y;
  state.viewerPinchLastCenter = pending.center;
  state.viewerPinchLastDistance = pending.distance;
  state.viewerPinchLastAppliedZoom = finalZoom;

  target.style.setProperty("--pinch-scale", String(visualScale));
  target.style.setProperty("--pinch-x", `${state.viewerPinchLiveTranslateX}px`);
  target.style.setProperty("--pinch-y", `${state.viewerPinchLiveTranslateY}px`);
}

function getViewerPinchTarget(center) {
  if (center) {
    const element = document.elementFromPoint(center.x, center.y);
    const shell = element?.closest(".viewer-page-shell");
    if (shell && elements.viewerPages?.contains(shell)) {
      return shell;
    }
  }

  const currentPageId = getCurrentViewerPageId();
  if (currentPageId) {
    const escapedPageId = cssEscape(currentPageId);
    const shell = elements.viewerPages?.querySelector(`.viewer-page-shell[data-page-id="${escapedPageId}"]`);
    if (shell) {
      return shell;
    }
  }

  return getMostVisibleViewerPageShell();
}

function getMostVisibleViewerPageShell() {
  const container = elements.viewerPages;
  if (!container) {
    return null;
  }

  const containerRect = container.getBoundingClientRect();
  const targetY = containerRect.top + containerRect.height / 2;
  let nearestTarget = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  container.querySelectorAll(".viewer-page-shell").forEach((candidate) => {
    const rect = candidate.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }
    const distance = Math.abs(rect.top + rect.height / 2 - targetY);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestTarget = candidate;
    }
  });
  return nearestTarget;
}

function createViewerPinchAnchor(target, center) {
  const container = elements.viewerPages;
  if (!target || !center || !container) {
    return null;
  }

  const targetRect = target.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  if (!targetRect.width || !targetRect.height) {
    return null;
  }

  return {
    target,
    ratioX: clamp((center.x - targetRect.left) / targetRect.width, 0, 1),
    ratioY: clamp((center.y - targetRect.top) / targetRect.height, 0, 1),
    startCenterX: center.x,
    startCenterY: center.y,
    startOffsetX: center.x - containerRect.left,
    startOffsetY: center.y - containerRect.top,
    startScrollLeft: container.scrollLeft,
    startScrollTop: container.scrollTop,
  };
}

function beginViewerLivePinch() {
  const center = getViewerPointerCenter();
  const target = getViewerPinchTarget(center);
  const distance = getViewerPointerDistance();
  if (!center || !target || !distance) {
    return false;
  }

  if (state.viewerPinchCommitFrame) {
    cancelAnimationFrame(state.viewerPinchCommitFrame);
    state.viewerPinchCommitFrame = 0;
  }
  clearViewerLivePinchTransform();
  state.viewerPinchActive = true;
  state.viewerPinchTarget = target;
  state.viewerPinchAnchor = createViewerPinchAnchor(target, center);
  state.viewerPinchStartDistance = distance;
  state.viewerPinchStartZoom = state.viewerZoom;
  state.viewerPinchStartCenter = center;
  state.viewerPinchCurrentCenter = center;
  state.viewerPinchLiveScale = 1;
  state.viewerPinchLiveTranslateX = 0;
  state.viewerPinchLiveTranslateY = 0;
  state.viewerPendingPinch = null;
  state.viewerPinchLastCenter = center;
  state.viewerPinchLastDistance = distance;
  state.viewerPinchLastAppliedZoom = state.viewerZoom;

  const rect = target.getBoundingClientRect();
  state.viewerPinchOriginX = center.x - rect.left;
  state.viewerPinchOriginY = center.y - rect.top;

  target.classList.add("is-live-pinching");
  target.style.setProperty("--pinch-origin-x", `${state.viewerPinchOriginX}px`);
  target.style.setProperty("--pinch-origin-y", `${state.viewerPinchOriginY}px`);
  target.style.setProperty("--pinch-scale", "1");
  target.style.setProperty("--pinch-x", "0px");
  target.style.setProperty("--pinch-y", "0px");

  elements.viewerPages.classList.add("is-pinching");
  getTouchViewerPointerEntries().forEach(([pointerId]) => captureViewerPointer(pointerId));
  return true;
}

function commitViewerLivePinch() {
  const target = state.viewerPinchTarget;
  const anchor = state.viewerPinchAnchor;
  if (!state.viewerPinchActive || !target) {
    resetViewerLivePinchState();
    return;
  }

  if (state.viewerPendingPinch) {
    if (state.viewerPinchRaf) {
      cancelAnimationFrame(state.viewerPinchRaf);
      state.viewerPinchRaf = 0;
    }
    applyViewerPinchFrame();
  }

  if (state.viewerPinchRaf) {
    cancelAnimationFrame(state.viewerPinchRaf);
    state.viewerPinchRaf = 0;
  }

  const finalZoom = clamp(
    state.viewerPinchStartZoom * state.viewerPinchLiveScale,
    VIEWER_MIN_ZOOM,
    VIEWER_MAX_ZOOM,
  );
  const currentCenter = state.viewerPinchCurrentCenter || state.viewerPinchStartCenter;
  const translateX = state.viewerPinchLiveTranslateX || 0;
  const translateY = state.viewerPinchLiveTranslateY || 0;

  if (state.viewerPinchCommitFrame) {
    cancelAnimationFrame(state.viewerPinchCommitFrame);
  }

  state.viewerPinchCommitFrame = requestAnimationFrame(() => {
    state.viewerPinchCommitFrame = 0;
    clearViewerLivePinchTransform(target);
    commitViewerZoomWithPinchAnchor({
      finalZoom,
      anchor,
      currentCenter,
      translateX,
      translateY,
    });
    resetViewerLivePinchStateAfterCommit();

    requestAnimationFrame(() => {
      resizeAllAnnotationCanvases();
      renderAllVisibleAnnotations();
    });
  });
}

function commitViewerZoomWithPinchAnchor({ finalZoom, anchor, currentCenter, translateX = 0, translateY = 0 }) {
  const container = elements.viewerPages;
  if (!container) {
    return;
  }

  const previousZoom = state.viewerZoom;
  const nextZoom = Math.round(clamp(finalZoom, VIEWER_MIN_ZOOM, VIEWER_MAX_ZOOM) * 1000) / 1000;
  const targetCenter =
    currentCenter ||
    (anchor
      ? {
          x: anchor.startCenterX + translateX,
          y: anchor.startCenterY + translateY,
        }
      : null);

  if (!anchor || !anchor.target || !anchor.target.isConnected) {
    setViewerZoomFast(nextZoom, { centerPoint: targetCenter || undefined });
    clampViewerScroll();
    return;
  }

  if (Math.abs(nextZoom - previousZoom) >= 0.001) {
    state.viewerZoom = nextZoom;
    container.style.setProperty("--viewer-zoom", state.viewerZoom);
    container.classList.toggle("is-zoomed", state.viewerZoom > VIEWER_MIN_ZOOM + 0.001);
  }

  const targetRect = anchor.target.getBoundingClientRect();
  const anchorClientX = targetRect.left + targetRect.width * anchor.ratioX;
  const anchorClientY = targetRect.top + targetRect.height * anchor.ratioY;
  const finalCenter = targetCenter || {
    x: anchor.startCenterX + translateX,
    y: anchor.startCenterY + translateY,
  };

  container.scrollLeft += anchorClientX - finalCenter.x;
  container.scrollTop += anchorClientY - finalCenter.y;
  clampViewerScroll();
}

function clampViewerScroll() {
  const container = elements.viewerPages;
  if (!container) {
    return;
  }

  const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth);
  const maxTop = Math.max(0, container.scrollHeight - container.clientHeight);

  if (container.scrollLeft < 0) {
    container.scrollLeft = 0;
  } else if (container.scrollLeft > maxLeft) {
    container.scrollLeft = maxLeft;
  }

  if (container.scrollTop < 0) {
    container.scrollTop = 0;
  } else if (container.scrollTop > maxTop) {
    container.scrollTop = maxTop;
  }
}

function clearViewerLivePinchTransform(target = state.viewerPinchTarget) {
  if (!target) {
    return;
  }
  target.classList.remove("is-live-pinching");
  target.style.removeProperty("--pinch-origin-x");
  target.style.removeProperty("--pinch-origin-y");
  target.style.removeProperty("--pinch-scale");
  target.style.removeProperty("--pinch-x");
  target.style.removeProperty("--pinch-y");
}

function resetViewerLivePinchStateAfterCommit() {
  state.viewerPendingPinch = null;
  state.viewerPinchActive = false;
  state.viewerPinchTarget = null;
  state.viewerPinchAnchor = null;
  state.viewerPinchStartDistance = 0;
  state.viewerPinchStartCenter = null;
  state.viewerPinchCurrentCenter = null;
  state.viewerPinchLiveScale = 1;
  state.viewerPinchLiveTranslateX = 0;
  state.viewerPinchLiveTranslateY = 0;
  state.viewerPinchLastCenter = null;
  state.viewerPinchLastDistance = 0;
  state.viewerPinchLastAppliedZoom = state.viewerZoom;
  elements.viewerPages?.classList.remove("is-pinching");
}

function resetViewerLivePinchState() {
  if (state.viewerPinchRaf) {
    cancelAnimationFrame(state.viewerPinchRaf);
    state.viewerPinchRaf = 0;
  }
  if (state.viewerPinchCommitFrame) {
    cancelAnimationFrame(state.viewerPinchCommitFrame);
    state.viewerPinchCommitFrame = 0;
  }
  clearViewerLivePinchTransform();
  state.viewerPendingPinch = null;
  state.viewerPinchActive = false;
  state.viewerPinchTarget = null;
  state.viewerPinchAnchor = null;
  state.viewerPinchStartDistance = 0;
  state.viewerPinchStartCenter = null;
  state.viewerPinchCurrentCenter = null;
  state.viewerPinchLiveScale = 1;
  state.viewerPinchLiveTranslateX = 0;
  state.viewerPinchLiveTranslateY = 0;
  state.viewerPinchLastCenter = null;
  state.viewerPinchLastDistance = 0;
  state.viewerPinchLastAppliedZoom = state.viewerZoom;
  elements.viewerPages?.classList.remove("is-pinching");
}

function handleViewerWheel(event) {
  if (state.annotationMode) {
    return;
  }
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

function getPointerKind(event) {
  return event?.pointerType || "mouse";
}

function isTouchPointer(event) {
  return getPointerKind(event) === "touch";
}

function isPenPointer(event) {
  return getPointerKind(event) === "pen";
}

function getTouchViewerPointerEntries() {
  return Array.from(state.viewerPointers.entries()).filter(([, pointer]) => pointer?.pointerType === "touch");
}

function getTouchViewerPointers() {
  return getTouchViewerPointerEntries().map(([, pointer]) => pointer);
}

function clearPenFromViewerPointers(pointerId) {
  if (pointerId != null) {
    state.viewerPointers.delete(pointerId);
  }
  state.viewerPointers.forEach((value, key) => {
    if (value?.pointerType === "pen" || value?.pointerType === "mouse") {
      state.viewerPointers.delete(key);
    }
  });
}

function handleViewerPointerDown(event) {
  if (!elements.viewerDialog.open || !event.target.closest(".viewer-pages")) {
    return;
  }

  if (state.annotationMode && isPenPointer(event)) {
    clearPenFromViewerPointers(event.pointerId);
    return;
  }

  if (state.annotationMode && !isTouchPointer(event)) {
    state.viewerPointers.delete(event.pointerId);
    return;
  }

  state.viewerPointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
    pointerType: getPointerKind(event),
  });

  if (state.annotationMode) {
    if (getTouchViewerPointers().length === 2) {
      event.preventDefault();
      cancelAnnotationDraft();
      state.viewerTapStart = null;
      state.viewerDrag = null;
      beginViewerLivePinch();
    }
    return;
  }

  if (state.viewerPointers.size === 2) {
    event.preventDefault();
    state.viewerTapStart = null;
    state.viewerDrag = null;
    // 查看模式也用实时 CSS 变换缩放（与标注模式一致），避免每帧重排导致卡顿。
    beginViewerLivePinch();
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
  if (state.annotationMode && isPenPointer(event)) {
    clearPenFromViewerPointers(event.pointerId);
    return;
  }

  if (!state.viewerPointers.has(event.pointerId)) {
    return;
  }

  state.viewerPointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
    pointerType: getPointerKind(event),
  });

  if (state.annotationMode) {
    if (getTouchViewerPointers().length === 2 && state.viewerPinchActive) {
      event.preventDefault();
      const distance = getViewerPointerDistance();
      const center = getViewerPointerCenter();
      state.viewerPendingPinch = {
        distance,
        center,
      };
      requestViewerPinchFrame();
    }
    return;
  }

  if (state.viewerPinchActive && getTouchViewerPointers().length === 2) {
    event.preventDefault();
    const distance = getViewerPointerDistance();
    const center = getViewerPointerCenter();
    state.viewerPendingPinch = { distance, center };
    requestViewerPinchFrame();
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
  if (state.annotationMode && isPenPointer(event)) {
    clearPenFromViewerPointers(event.pointerId);
    return;
  }

  if (state.annotationMode) {
    state.viewerPointers.delete(event.pointerId);
    try {
      elements.viewerPages.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture may already be released by the browser.
    }
    const remainingTouchPointers = getTouchViewerPointers();
    if (remainingTouchPointers.length < 2) {
      if (state.viewerPinchActive && !state.viewerPinchCommitFrame) {
        commitViewerLivePinch();
      } else if (remainingTouchPointers.length === 0 && !state.viewerPinchActive && !state.viewerPinchCommitFrame) {
        resetViewerLivePinchState();
      }
    }
    return;
  }
  const tapStart = state.viewerTapStart;
  state.viewerPointers.delete(event.pointerId);

  try {
    elements.viewerPages.releasePointerCapture(event.pointerId);
  } catch (error) {
    // Pointer capture may already be released by the browser.
  }

  // 结束实时双指缩放（与标注模式一致，平滑提交），避免落回每帧重排的卡顿路径。
  if (state.viewerPinchActive && getTouchViewerPointers().length < 2) {
    if (!state.viewerPinchCommitFrame) {
      commitViewerLivePinch();
    }
    state.viewerTapStart = null;
    if (state.viewerPointers.size < 2) {
      elements.viewerPages.classList.remove("is-pinching");
    }
    return;
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
    state.viewerPinchLastCenter = null;
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
  const pointers = getTouchViewerPointers();
  const source = pointers.length >= 2 ? pointers : Array.from(state.viewerPointers.values());
  if (source.length < 2) {
    return 0;
  }

  return Math.hypot(source[0].x - source[1].x, source[0].y - source[1].y);
}

function getViewerPointerCenter() {
  const pointers = getTouchViewerPointers();
  const source = pointers.length >= 2 ? pointers : Array.from(state.viewerPointers.values());
  if (source.length < 2) {
    return null;
  }

  return {
    x: (source[0].x + source[1].x) / 2,
    y: (source[0].y + source[1].y) / 2,
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

async function loadScores() {
  await ensureDatabaseReady();
  try {
    const [scoreRecords, pageRecords, folders, setlistRecords, setlistItemRecords] = await Promise.all([
      getAllScores(),
      getAllScorePages(),
      getAllFolders(),
      getAllSetlists(),
      getAllSetlistItems(),
    ]);
    const migrated = await migrateNestedScorePages(scoreRecords);
    const normalizedScores = migrated.map(normalizeLocalScoreRecord);
  // 用账号别名匹配器：兼容旧数据 userId 是手机号/邮箱/uid/openId 的情况。
  const ownerMatches = createOwnerMatcher();
  const ownedScores = normalizedScores.filter(ownerMatches);
  // 诊断：若有歌谱因账号不匹配被过滤掉，打印实际 userId 与当前/记住的账号别名，便于定位历史身份不一致。
  const accountIds = state.session?.user?.id ? getSessionUserIdList() : getRememberedAccountIds();
  if (accountIds.length) {
    const activeAll = normalizedScores.filter((score) => !score.deletedAt);
    const hidden = activeAll.filter((score) => !ownerMatches(score));
    if (hidden.length) {
      const hiddenUserIds = Array.from(new Set(hidden.map((score) => score.userId)));
      console.warn("[account-debug] 有歌谱因账号不匹配被隐藏", "账号别名:", accountIds, "被隐藏的 userId:", hiddenUserIds);
      // 全部被隐藏时在界面上提示具体值，方便排查（看不到控制台时可据此反馈）。
      if (ownedScores.filter((score) => !score.deletedAt).length === 0) {
        setStatus(
          `检测到 ${hidden.length} 份本地歌谱不属于当前账号而未显示。账号ID：${accountIds[0] || "无"}；数据归属：${hiddenUserIds.slice(0, 3).join("、")}`,
          true,
        );
      }
    }
  }
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
  state.setlists = setlistRecords.map(normalizeLocalSetlistRecord).filter((setlist) => !setlist.deletedAt && ownerMatches(setlist));
  const activeSetlistIds = new Set(state.setlists.map((setlist) => setlist.id));
  const activeScoreIds = new Set(state.scores.map((score) => score.id));
  state.setlistItems = setlistItemRecords
    .map(normalizeLocalSetlistItemRecord)
    .filter((item) => !item.deletedAt && ownerMatches(item) && activeSetlistIds.has(item.setlistId) && activeScoreIds.has(item.scoreId))
    .sort((a, b) => a.position - b.position || new Date(a.createdAt) - new Date(b.createdAt));
  state.scores.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  state.folders.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  state.setlists.sort((a, b) => getSetlistSortTime(b) - getSetlistSortTime(a) || new Date(b.updatedAt) - new Date(a.updatedAt));

  if (state.currentFolderId && !state.folders.some((folder) => folder.id === state.currentFolderId)) {
    state.currentFolderId = null;
    state.folderHistoryActive = false;
  }

  // 清理已不存在歌谱的封面缓存（删除/同步移除后），避免缓存无限增长。
  const liveScoreIds = new Set(state.scores.map((score) => score.id));
  state.coverImgElements.forEach((_, id) => {
    if (!liveScoreIds.has(id)) {
      state.coverImgElements.delete(id);
    }
  });
  state.coverDisplayUrls.forEach((_, id) => {
    if (!liveScoreIds.has(id)) {
      state.coverDisplayUrls.delete(id);
    }
  });

  await consolidateDuplicateFoldersByName();
  renderScores();
  renderSetlists();
  refreshVisibleScoreImages();
  preloadAllScoreCovers({ includeCloud: state.cloudReady && Boolean(state.session) }).catch((error) => console.warn(error));
  // 列表封面优先加载：立即显示已有缩略图、为缺失的本地封面后台生成，云端就绪时取临时URL。
  preloadAllScoreCovers({ includeCloud: state.cloudReady && Boolean(state.session) }).catch((error) => console.warn(error));
    queueBackgroundPageHydration();
    scheduleLegacyPageAssetMigration();
  } catch (error) {
    console.warn("读取本地谱夹失败，已保留当前页面数据。", error);
    if (isLocalDatabaseNotReadyError(error)) {
      setStatus("本地数据库正在恢复，请稍后重试同步。", true);
    }
    throw error;
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    let settled = false;
    let upgrading = false;
    let timer = 0;
    const finish = (callback) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timer);
      callback();
    };

    let request;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (error) {
      reject(error);
      return;
    }

    // 兜底超时：open 一直不回调（卡死/被占用）时主动 reject，避免无限挂起。
    // 升级迁移可能较久，检测到 upgradeneeded 后不再因超时中断，交给 success/error 收尾。
    timer = window.setTimeout(() => {
      if (upgrading) {
        return;
      }
      finish(() => {
        // 若稍后 open 又成功，关闭这条迟到的连接，避免占用/泄漏。
        request.onsuccess = () => {
          try {
            request.result.close();
          } catch (closeError) {
            console.warn(closeError);
          }
        };
        reject(createNamedError("TimeoutError", "打开本地数据库超时，请重试。"));
      });
    }, DB_OPEN_TIMEOUT);

    request.onupgradeneeded = () => {
      upgrading = true;
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
      if (!scoreStore.indexNames.contains("deletedAt")) {
        scoreStore.createIndex("deletedAt", "deletedAt", { unique: false });
      }
      if (request.oldVersion < 4) {
        migrateScoreMetadataFields(scoreStore);
      }

      if (!db.objectStoreNames.contains(FOLDER_STORE_NAME)) {
        const folderStore = db.createObjectStore(FOLDER_STORE_NAME, { keyPath: "id" });
        folderStore.createIndex("normalizedName", "normalizedName", { unique: false });
        folderStore.createIndex("updatedAt", "updatedAt", { unique: false });
        folderStore.createIndex("userId", "userId", { unique: false });
        folderStore.createIndex("syncStatus", "syncStatus", { unique: false });
        folderStore.createIndex("deletedAt", "deletedAt", { unique: false });
      } else {
        const folderStore = request.transaction.objectStore(FOLDER_STORE_NAME);
        if (!folderStore.indexNames.contains("userId")) {
          folderStore.createIndex("userId", "userId", { unique: false });
        }
        if (!folderStore.indexNames.contains("syncStatus")) {
          folderStore.createIndex("syncStatus", "syncStatus", { unique: false });
        }
        if (!folderStore.indexNames.contains("deletedAt")) {
          folderStore.createIndex("deletedAt", "deletedAt", { unique: false });
        }
      }

      if (!db.objectStoreNames.contains(PAGE_STORE_NAME)) {
        const pageStore = db.createObjectStore(PAGE_STORE_NAME, { keyPath: "id" });
        pageStore.createIndex("scoreId", "scoreId", { unique: false });
        pageStore.createIndex("userId", "userId", { unique: false });
        pageStore.createIndex("syncStatus", "syncStatus", { unique: false });
        pageStore.createIndex("deletedAt", "deletedAt", { unique: false });
      } else {
        const pageStore = request.transaction.objectStore(PAGE_STORE_NAME);
        if (!pageStore.indexNames.contains("scoreId")) {
          pageStore.createIndex("scoreId", "scoreId", { unique: false });
        }
        if (!pageStore.indexNames.contains("userId")) {
          pageStore.createIndex("userId", "userId", { unique: false });
        }
        if (!pageStore.indexNames.contains("syncStatus")) {
          pageStore.createIndex("syncStatus", "syncStatus", { unique: false });
        }
        if (!pageStore.indexNames.contains("deletedAt")) {
          pageStore.createIndex("deletedAt", "deletedAt", { unique: false });
        }
      }

      if (!db.objectStoreNames.contains(ASSET_STORE_NAME)) {
        const assetStore = db.createObjectStore(ASSET_STORE_NAME, { keyPath: "id" });
        assetStore.createIndex("by_score", "scoreId", { unique: false });
        assetStore.createIndex("by_page", "pageId", { unique: false });
        assetStore.createIndex("by_kind", "kind", { unique: false });
        assetStore.createIndex("by_hash", "hash", { unique: false });
        assetStore.createIndex("by_localState", "localState", { unique: false });
        assetStore.createIndex("by_cloudPath", "cloudPath", { unique: false });
        assetStore.createIndex("by_updatedAt", "updatedAt", { unique: false });
      } else {
        const assetStore = request.transaction.objectStore(ASSET_STORE_NAME);
        if (!assetStore.indexNames.contains("by_score")) {
          assetStore.createIndex("by_score", "scoreId", { unique: false });
        }
        if (!assetStore.indexNames.contains("by_page")) {
          assetStore.createIndex("by_page", "pageId", { unique: false });
        }
        if (!assetStore.indexNames.contains("by_kind")) {
          assetStore.createIndex("by_kind", "kind", { unique: false });
        }
        if (!assetStore.indexNames.contains("by_hash")) {
          assetStore.createIndex("by_hash", "hash", { unique: false });
        }
        if (!assetStore.indexNames.contains("by_localState")) {
          assetStore.createIndex("by_localState", "localState", { unique: false });
        }
        if (!assetStore.indexNames.contains("by_cloudPath")) {
          assetStore.createIndex("by_cloudPath", "cloudPath", { unique: false });
        }
        if (!assetStore.indexNames.contains("by_updatedAt")) {
          assetStore.createIndex("by_updatedAt", "updatedAt", { unique: false });
        }
      }

      if (!db.objectStoreNames.contains(SETLIST_STORE_NAME)) {
        const setlistStore = db.createObjectStore(SETLIST_STORE_NAME, { keyPath: "id" });
        setlistStore.createIndex("userId", "userId", { unique: false });
        setlistStore.createIndex("date", "date", { unique: false });
        setlistStore.createIndex("updatedAt", "updatedAt", { unique: false });
        setlistStore.createIndex("syncStatus", "syncStatus", { unique: false });
        setlistStore.createIndex("deletedAt", "deletedAt", { unique: false });
      } else {
        const setlistStore = request.transaction.objectStore(SETLIST_STORE_NAME);
        if (!setlistStore.indexNames.contains("userId")) {
          setlistStore.createIndex("userId", "userId", { unique: false });
        }
        if (!setlistStore.indexNames.contains("date")) {
          setlistStore.createIndex("date", "date", { unique: false });
        }
        if (!setlistStore.indexNames.contains("syncStatus")) {
          setlistStore.createIndex("syncStatus", "syncStatus", { unique: false });
        }
        if (!setlistStore.indexNames.contains("deletedAt")) {
          setlistStore.createIndex("deletedAt", "deletedAt", { unique: false });
        }
      }

      if (!db.objectStoreNames.contains(SETLIST_ITEM_STORE_NAME)) {
        const setlistItemStore = db.createObjectStore(SETLIST_ITEM_STORE_NAME, { keyPath: "id" });
        setlistItemStore.createIndex("setlistId", "setlistId", { unique: false });
        setlistItemStore.createIndex("scoreId", "scoreId", { unique: false });
        setlistItemStore.createIndex("userId", "userId", { unique: false });
        setlistItemStore.createIndex("syncStatus", "syncStatus", { unique: false });
        setlistItemStore.createIndex("deletedAt", "deletedAt", { unique: false });
      } else {
        const setlistItemStore = request.transaction.objectStore(SETLIST_ITEM_STORE_NAME);
        if (!setlistItemStore.indexNames.contains("setlistId")) {
          setlistItemStore.createIndex("setlistId", "setlistId", { unique: false });
        }
        if (!setlistItemStore.indexNames.contains("scoreId")) {
          setlistItemStore.createIndex("scoreId", "scoreId", { unique: false });
        }
        if (!setlistItemStore.indexNames.contains("userId")) {
          setlistItemStore.createIndex("userId", "userId", { unique: false });
        }
        if (!setlistItemStore.indexNames.contains("syncStatus")) {
          setlistItemStore.createIndex("syncStatus", "syncStatus", { unique: false });
        }
        if (!setlistItemStore.indexNames.contains("deletedAt")) {
          setlistItemStore.createIndex("deletedAt", "deletedAt", { unique: false });
        }
      }

      // 回收站快照存储（本地，不参与云端同步）：保存被删除歌谱的完整副本以便恢复。
      if (!db.objectStoreNames.contains(TRASH_STORE_NAME)) {
        const trashStore = db.createObjectStore(TRASH_STORE_NAME, { keyPath: "id" });
        trashStore.createIndex("trashedAt", "trashedAt", { unique: false });
      }

      if (!db.objectStoreNames.contains(ANNOTATION_STORE_NAME)) {
        const annotationStore = db.createObjectStore(ANNOTATION_STORE_NAME, { keyPath: "id" });
        annotationStore.createIndex("pageId", "pageId", { unique: false });
        annotationStore.createIndex("scoreId", "scoreId", { unique: false });
        annotationStore.createIndex("userId", "userId", { unique: false });
        annotationStore.createIndex("syncStatus", "syncStatus", { unique: false });
        annotationStore.createIndex("deletedAt", "deletedAt", { unique: false });
        annotationStore.createIndex("updatedAt", "updatedAt", { unique: false });
      } else {
        const annotationStore = request.transaction.objectStore(ANNOTATION_STORE_NAME);
        if (!annotationStore.indexNames.contains("pageId")) {
          annotationStore.createIndex("pageId", "pageId", { unique: false });
        }
        if (!annotationStore.indexNames.contains("scoreId")) {
          annotationStore.createIndex("scoreId", "scoreId", { unique: false });
        }
        if (!annotationStore.indexNames.contains("userId")) {
          annotationStore.createIndex("userId", "userId", { unique: false });
        }
        if (!annotationStore.indexNames.contains("syncStatus")) {
          annotationStore.createIndex("syncStatus", "syncStatus", { unique: false });
        }
        if (!annotationStore.indexNames.contains("deletedAt")) {
          annotationStore.createIndex("deletedAt", "deletedAt", { unique: false });
        }
        if (!annotationStore.indexNames.contains("updatedAt")) {
          annotationStore.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      }

      // 同步发件箱（sync_outbox）：把每个待推送到云端的操作显式入队，便于观测与重试。
      if (!db.objectStoreNames.contains(SYNC_OUTBOX_STORE_NAME)) {
        const outboxStore = db.createObjectStore(SYNC_OUTBOX_STORE_NAME, { keyPath: "id" });
        outboxStore.createIndex("status", "status", { unique: false });
        outboxStore.createIndex("nextAttemptAt", "nextAttemptAt", { unique: false });
        outboxStore.createIndex("dedupeKey", "dedupeKey", { unique: false });
      }

      if (!db.objectStoreNames.contains(LOCAL_OP_STORE_NAME)) {
        const localOpStore = db.createObjectStore(LOCAL_OP_STORE_NAME, { keyPath: "id" });
        localOpStore.createIndex("by_status", "status", { unique: false });
        localOpStore.createIndex("by_priority_createdAt", ["priority", "createdAt"], { unique: false });
        localOpStore.createIndex("by_entity", ["entityType", "entityId"], { unique: false });
        localOpStore.createIndex("by_createdAt", "createdAt", { unique: false });
        localOpStore.createIndex("by_user_status", ["userId", "status"], { unique: false });
        localOpStore.createIndex("by_nextRetryAt", "nextRetryAt", { unique: false });
        localOpStore.createIndex("by_batchKey", "batchKey", { unique: false });
      } else {
        const localOpStore = request.transaction.objectStore(LOCAL_OP_STORE_NAME);
        if (!localOpStore.indexNames.contains("by_status")) {
          localOpStore.createIndex("by_status", "status", { unique: false });
        }
        if (!localOpStore.indexNames.contains("by_priority_createdAt")) {
          localOpStore.createIndex("by_priority_createdAt", ["priority", "createdAt"], { unique: false });
        }
        if (!localOpStore.indexNames.contains("by_entity")) {
          localOpStore.createIndex("by_entity", ["entityType", "entityId"], { unique: false });
        }
        if (!localOpStore.indexNames.contains("by_createdAt")) {
          localOpStore.createIndex("by_createdAt", "createdAt", { unique: false });
        }
        if (!localOpStore.indexNames.contains("by_user_status")) {
          localOpStore.createIndex("by_user_status", ["userId", "status"], { unique: false });
        }
        if (!localOpStore.indexNames.contains("by_nextRetryAt")) {
          localOpStore.createIndex("by_nextRetryAt", "nextRetryAt", { unique: false });
        }
        if (!localOpStore.indexNames.contains("by_batchKey")) {
          localOpStore.createIndex("by_batchKey", "batchKey", { unique: false });
        }
      }

      if (!db.objectStoreNames.contains(SYNC_STATE_STORE_NAME)) {
        const syncStateStore = db.createObjectStore(SYNC_STATE_STORE_NAME, { keyPath: "id" });
        syncStateStore.createIndex("by_status", "status", { unique: false });
        syncStateStore.createIndex("by_dirty", "dirty", { unique: false });
        syncStateStore.createIndex("by_entity", ["entityType", "entityId"], { unique: false });
        syncStateStore.createIndex("by_user_status", ["userId", "status"], { unique: false });
        syncStateStore.createIndex("by_updatedAt", "updatedAt", { unique: false });
        syncStateStore.createIndex("by_lastLocalAt", "lastLocalAt", { unique: false });
      } else {
        const syncStateStore = request.transaction.objectStore(SYNC_STATE_STORE_NAME);
        if (!syncStateStore.indexNames.contains("by_status")) {
          syncStateStore.createIndex("by_status", "status", { unique: false });
        }
        if (!syncStateStore.indexNames.contains("by_dirty")) {
          syncStateStore.createIndex("by_dirty", "dirty", { unique: false });
        }
        if (!syncStateStore.indexNames.contains("by_entity")) {
          syncStateStore.createIndex("by_entity", ["entityType", "entityId"], { unique: false });
        }
        if (!syncStateStore.indexNames.contains("by_user_status")) {
          syncStateStore.createIndex("by_user_status", ["userId", "status"], { unique: false });
        }
        if (!syncStateStore.indexNames.contains("by_updatedAt")) {
          syncStateStore.createIndex("by_updatedAt", "updatedAt", { unique: false });
        }
        if (!syncStateStore.indexNames.contains("by_lastLocalAt")) {
          syncStateStore.createIndex("by_lastLocalAt", "lastLocalAt", { unique: false });
        }
      }
    };

    request.onsuccess = () => finish(() => resolve(request.result));
    request.onerror = () =>
      finish(() => reject(request.error || createNamedError("AbortError", "打开本地数据库失败，请重试。")));
    // 另一个连接（如旧标签页/卡死的连接）占用数据库时触发：不再无限等待，直接 reject 让上层重连。
    request.onblocked = () =>
      finish(() => reject(createNamedError("BlockedError", "本地数据库被占用，请重试。")));
  });
}

// 关闭并重新打开本地数据库连接。某些浏览器（尤其 iOS / iPad Safari）在事务卡死时，
// 旧连接会阻塞之后所有事务，导致“删除没反应、保存卡住”。重连可让后续操作恢复正常。
let reopenDatabasePromise = null;
function reopenDatabase() {
  if (reopenDatabasePromise) {
    return reopenDatabasePromise;
  }
  reopenDatabasePromise = (async () => {
    try {
      state.db?.close();
    } catch (error) {
      console.warn("关闭数据库连接失败", error);
    }
    state.db = await openDatabase();
    return state.db;
  })();
  reopenDatabasePromise.finally(() => {
    reopenDatabasePromise = null;
  });
  return reopenDatabasePromise;
}

async function ensureDatabaseReady() {
  if (state.db) {
    return state.db;
  }
  if (reopenDatabasePromise) {
    return await reopenDatabasePromise;
  }
  try {
    state.db = await openDatabase();
    return state.db;
  } catch (error) {
    const readyError = createNamedError("LocalDatabaseNotReadyError", "本地数据库未准备好，请重新打开 App 后重试。");
    readyError.cause = error;
    throw readyError;
  }
}

function isLocalDatabaseNotReadyError(error) {
  const message = `${error?.name || ""} ${getErrorMessage(error) || ""} ${String(error || "")}`;
  return /state\.db|transaction|IndexedDB|本地数据库|Database|InvalidStateError|AbortError|TimeoutError|null is not an object|LocalDatabaseNotReadyError/i.test(message);
}

function shouldRetryIdbTransaction(error) {
  const message = `${error?.name || ""} ${getErrorMessage(error) || ""}`;
  return isLocalDatabaseNotReadyError(error) || /AbortError|TimeoutError|InvalidStateError/i.test(message);
}

// 当本地写入超时/被中断时，连接可能已卡死，重连数据库以便用户重试时能成功。
async function recoverDatabaseIfWedged(error) {
  const combined = `${error?.name || ""} ${getErrorMessage(error)}`;
  if (!/TimeoutError|AbortError|InvalidStateError|abort|timeout|transaction|IndexedDB|Database|state\.db|null is not an object|超时|中断|本地数据库/i.test(combined)) {
    return;
  }
  try {
    await reopenDatabase();
  } catch (reopenError) {
    console.warn("重连数据库失败", reopenError);
  }
}

// ===== 统一的本地数据层封装：超时兜底 + 串行写队列，确保任何本地操作都不会永远 pending =====

// 统一的 IndexedDB 事务封装：
// - 支持 timeoutMs / timeoutMessage；超时后主动 abort 事务；
// - oncomplete / onerror / onabort 都会 settle（resolve 或 reject），绝不悬挂；
// - 出现超时/中断时调用 recoverDatabaseIfWedged 重连，确保用户重试可恢复。
// executor(stores, tx) 同步发起读写操作；如需返回读结果，可让 executor 返回一个对象，
// 并在各 request.onsuccess 里写入该对象的字段，事务 oncomplete 时该对象即为最终结果。
async function runIdbTransaction(storeNames, mode, executor, options = {}) {
  try {
    return await runIdbTransactionOnce(storeNames, mode, executor, options);
  } catch (error) {
    if (options.noRetry || !shouldRetryIdbTransaction(error)) {
      throw error;
    }
    await recoverDatabaseIfWedged(error);
    try {
      await reopenDatabase();
      return await runIdbTransactionOnce(storeNames, mode, executor, { ...options, noRetry: true });
    } catch (retryError) {
      await recoverDatabaseIfWedged(retryError);
      // 注意：这里不弹“本地存储未响应”。单个事务的中途失败/重试不代表用户操作失败——
      // 删除等操作由多个小事务组成，某个事务抖动后整体仍可能成功。
      // 恢复弹窗改由“用户操作最终失败时”触发（见 showRecoveryDialogIfDbWedged），避免过早误弹。
      throw retryError;
    }
  }
}

async function runIdbTransactionOnce(storeNames, mode, executor, options = {}) {
  const timeoutMs = options.timeoutMs || IDB_TXN_TIMEOUT;
  const timeoutMessage = options.timeoutMessage || "本地数据库操作超时，请重试。";
  const db = await ensureDatabaseReady();
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer = 0;
    let transaction;
    let resultValue;

    const settle = (callback) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timer);
      callback();
    };
    const fail = (error) => {
      // 超时/中断后连接可能卡死，重连数据库（内部已按错误类型判断，且去重）。
      recoverDatabaseIfWedged(error);
      reject(error);
    };

    try {
      transaction = db.transaction(storeNames, mode);
    } catch (error) {
      fail(error);
      return;
    }

    timer = window.setTimeout(() => {
      try {
        transaction.abort();
      } catch (abortError) {
        console.warn(abortError);
      }
      settle(() => fail(createNamedError("TimeoutError", timeoutMessage)));
    }, timeoutMs);

    transaction.oncomplete = () => settle(() => resolve(resultValue));
    transaction.onerror = () =>
      settle(() => fail(transaction.error || createNamedError("AbortError", timeoutMessage)));
    transaction.onabort = () =>
      settle(() => fail(transaction.error || createNamedError("AbortError", timeoutMessage)));

    try {
      const stores = Array.isArray(storeNames)
        ? storeNames.map((name) => transaction.objectStore(name))
        : transaction.objectStore(storeNames);
      resultValue = executor(stores, transaction);
    } catch (error) {
      try {
        transaction.abort();
      } catch (abortError) {
        console.warn(abortError);
      }
      settle(() => fail(error));
    }
  });
}

// 全局本地写队列：所有写 IndexedDB 的用户操作和后台同步写入都串行进入此队列，
// 避免 iOS Safari / PWA 下并发事务相互阻塞而卡死。每个任务自身带超时（见 runIdbTransaction），
// 因此队列不会被某个任务永久占用。
const localWriteQueues = {
  high: [],
  normal: [],
  low: [],
};
let localWriteWorkerRunning = false;
let localWriteCurrentItem = null;
let localWriteDepth = 0;

function normalizeLocalWritePriority(value) {
  const priority = String(value || "").toLowerCase();
  if (priority === "high" || priority === "normal" || priority === "low") {
    return priority;
  }
  return "normal";
}

function getInheritedLocalWritePriority() {
  return localWriteCurrentItem?.priority || "normal";
}

function getNextLocalWriteItem() {
  if (localWriteQueues.high.length) {
    return localWriteQueues.high.shift();
  }
  if (localWriteQueues.normal.length) {
    return localWriteQueues.normal.shift();
  }
  if (localWriteQueues.low.length) {
    return localWriteQueues.low.shift();
  }
  return null;
}

function hasQueuedHighLocalWrite() {
  return localWriteQueues.high.length > 0;
}

function hasQueuedLocalWrites() {
  return Boolean(localWriteQueues.high.length || localWriteQueues.normal.length || localWriteQueues.low.length);
}

function requeueLocalWriteItem(item) {
  if (!item) {
    return;
  }
  localWriteQueues[item.priority]?.unshift(item);
}

function scheduleLocalWriteWorker(delay = 0) {
  if (localWriteWorkerRunning) {
    return;
  }
  if (delay > 0) {
    if (state.backgroundWorkRetryTimer) {
      return;
    }
    state.backgroundWorkRetryTimer = window.setTimeout(() => {
      state.backgroundWorkRetryTimer = 0;
      runLocalWriteWorker();
    }, delay);
    return;
  }
  runLocalWriteWorker();
}

async function executeLocalWriteItem(item) {
  const previousItem = localWriteCurrentItem;
  localWriteCurrentItem = item;
  localWriteDepth += 1;
  try {
    return await withTimeout(
      Promise.resolve().then(() => item.task()),
      item.timeoutMs,
      `${item.label || "local-write"} 操作超时，请重试。`,
    );
  } catch (error) {
    await recoverDatabaseIfWedged(error);
    throw error;
  } finally {
    localWriteDepth = Math.max(0, localWriteDepth - 1);
    localWriteCurrentItem = previousItem;
  }
}

async function runLocalWriteWorker() {
  if (localWriteWorkerRunning) {
    return;
  }
  localWriteWorkerRunning = true;
  try {
    while (true) {
      const item = getNextLocalWriteItem();
      if (!item) {
        break;
      }

      if (item.priority === "low" && shouldDeferBackgroundWork()) {
        requeueLocalWriteItem(item);
        if (!state.backgroundWorkRetryTimer) {
          state.backgroundWorkRetryTimer = window.setTimeout(() => {
            state.backgroundWorkRetryTimer = 0;
            runLocalWriteWorker();
          }, 3000);
        }
        break;
      }

      try {
        const result = await executeLocalWriteItem(item);
        item.resolve(result);
      } catch (error) {
        console.warn(`本地写入失败：${item.label}`, error);
        item.reject(error);
      }
    }
  } finally {
    localWriteWorkerRunning = false;
    if (hasQueuedLocalWrites() && !state.backgroundWorkRetryTimer) {
      scheduleLocalWriteWorker(0);
    }
  }
}

function enqueueLocalWrite(labelOrTask, taskOrOptions, maybeOptions = {}) {
  let label = "local-write";
  let task = taskOrOptions;
  let options = maybeOptions || {};

  if (typeof labelOrTask === "function") {
    task = labelOrTask;
    options = taskOrOptions || {};
    label = options.label || "local-write";
  } else {
    label = String(labelOrTask || "local-write");
  }

  if (typeof task !== "function") {
    return Promise.reject(new Error("本地写入任务无效。"));
  }

  const priority = normalizeLocalWritePriority(options.priority || getInheritedLocalWritePriority());
  const item = {
    task,
    priority,
    label: options.label || label,
    timeoutMs: options.timeoutMs || OPERATION_LOCK_TIMEOUT || LOCAL_SAVE_TIMEOUT || IDB_TXN_TIMEOUT,
    queuedAt: Date.now(),
    userBlocking: options.userBlocking === true,
    resolve: null,
    reject: null,
  };

  // runUserCommand 本身会进入高优先级队列；它内部沿用旧的本地写函数时，
  // 直接在当前队列项内执行，避免“队列等队列”的死锁。
  if (localWriteDepth > 0) {
    return executeLocalWriteItem(item);
  }

  return new Promise((resolve, reject) => {
    item.resolve = resolve;
    item.reject = reject;
    localWriteQueues[priority].push(item);
    scheduleLocalWriteWorker(0);
  });
}

// 标记“用户正在进行本地写操作”，用于让后台 sync/outbox 让路（见 isUserWriteActive）。
function beginUserWrite() {
  state.userWriteActive += 1;
  state.backgroundWorkPausedUntil = Date.now() + 8000;
}
function endUserWrite() {
  state.userWriteActive = Math.max(0, state.userWriteActive - 1);
  // 用户操作结束后，若有积压的同步任务，空闲时再推进。
  if (!state.userWriteActive) {
    kickOutbox(1500);
  }
}
function isUserWriteActive() {
  return state.userWriteActive > 0;
}

function shouldDeferBackgroundWork() {
  return Boolean(
    (state.userCommandPending || 0) > 0 ||
      (state.userWriteActive || 0) > 0 ||
      Date.now() < (state.backgroundWorkPausedUntil || 0) ||
      hasQueuedHighLocalWrite(),
  );
}

function sanitizeLocalOperationPayload(value, depth = 0) {
  if (value == null || depth > 4) {
    return value == null ? null : "[MaxDepth]";
  }
  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return `[Blob:${value.size || 0}]`;
  }
  if (typeof File !== "undefined" && value instanceof File) {
    return `[File:${value.name || ""}:${value.size || 0}]`;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLocalOperationPayload(item, depth + 1));
  }
  if (typeof value === "object") {
    const output = {};
    Object.entries(value).forEach(([key, item]) => {
      if (/^(blob|file|displayUrl|objectUrl|previewUrl|tempUrl)$/i.test(key)) {
        return;
      }
      output[key] = sanitizeLocalOperationPayload(item, depth + 1);
    });
    return output;
  }
  return value;
}

async function recordLocalOperation(operation = {}) {
  const now = Date.now();
  const record = normalizeLocalOperationRecord({
    ...operation,
    status: operation.status || LOCAL_OP_STATUS_PENDING,
    createdAt: operation.createdAt || now,
    updatedAt: now,
  });
  const syncTargets = getSyncTargetsForOperation(record);

  try {
    await enqueueLocalWrite(
      "recordLocalOperation",
      () =>
        runIdbTransaction(
          [LOCAL_OP_STORE_NAME, SYNC_STATE_STORE_NAME],
          "readwrite",
          ([localOpStore, syncStateStore]) => {
            localOpStore.put(record);
            syncTargets.forEach((target) => {
              mutateSyncStateStore(syncStateStore, target, {
                status: SYNC_STATE_DIRTY,
                dirty: true,
                deleted: /delete/i.test(record.type),
                incrementLocalRevision: true,
                lastLocalAt: now,
                updatedAt: now,
                userId: record.userId || state.session?.user?.id || "",
                pendingOpIds: [record.id],
                lastError: "",
                conflict: null,
              });
            });
          },
          { timeoutMs: 8000, timeoutMessage: "记录本地操作超时。" },
        ),
      { priority: record.priority },
    );
  } catch (error) {
    console.warn("记录本地操作失败", error);
  }
  SyncEngine?.schedule?.({ reason: "local-op", delay: 1000 });
  return record;
}

async function runUserCommand(type, callback, options = {}) {
  const commandId = typeof createId === "function"
    ? createId("op")
    : `op-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const label = options.label || "正在处理...";
  const slowLabel = options.slowLabel || "本地存储较忙，正在优先处理您的操作...";
  const successMessage = options.successMessage || "";
  const failMessage = options.failMessage || "操作失败，请稍后重试。";
  let slowTimer = 0;
  let busyTimer = 0;

  state.userWriteActive = (state.userWriteActive || 0) + 1;
  state.userCommandPending = (state.userCommandPending || 0) + 1;
  state.backgroundWorkPausedUntil = Date.now() + 8000;

  if (!state.db) {
    showDatabaseRecoveryDialog?.("本地数据库正在恢复，请稍后重试。");
  }
  setStatus(label);

  try {
    slowTimer = window.setTimeout(() => {
      setStatus(slowLabel);
    }, 800);
    busyTimer = window.setTimeout(() => {
      setStatus(slowLabel);
      try {
        handleForegroundDatabaseRecovery?.();
      } catch (error) {
        console.warn(error);
      }
    }, 3000);

    const result = await enqueueLocalWrite(
      async () => {
        await ensureDatabaseReady();
        return callback({ commandId, type });
      },
      {
        priority: "high",
        userBlocking: true,
        label: type,
        timeoutMs: options.timeoutMs || LOCAL_SAVE_TIMEOUT || 45000,
      },
    );

    if (successMessage) {
      setStatus(successMessage);
    }

    SyncEngine?.schedule?.({ reason: `user-command:${type}`, delay: 1200 });
    const userId = state.session?.user?.id;
    if (userId) {
      window.setTimeout(() => SyncEngine?.schedule?.({ reason: "user-command-account", delay: 0 }), 3000);
    }

    return result;
  } catch (error) {
    console.error(`[user-command] ${type} failed`, error);
    setStatus(getErrorMessage?.(error) || failMessage, true);
    showRecoveryDialogIfDbWedged?.(error, {
      message: "本地存储暂时无响应，正在尝试恢复。恢复后可以继续刚才的操作。",
    });
    throw error;
  } finally {
    window.clearTimeout(slowTimer);
    window.clearTimeout(busyTimer);
    state.userWriteActive = Math.max(0, (state.userWriteActive || 0) - 1);
    state.userCommandPending = Math.max(0, (state.userCommandPending || 0) - 1);
  }
}

// CloudBase SDK 调用超时/网络异常后，标记 cloud 为 unhealthy 并清空 SDK 状态，
// 下一次同步会重新 initializeCloud，避免一直沿用已卡死的 SDK 句柄。
function markCloudUnhealthy(error) {
  const combined = `${error?.name || ""} ${getErrorMessage(error)}`;
  if (!/TimeoutError|timeout|超时|AbortError|abort|网络|network|Failed to fetch/i.test(combined)) {
    return;
  }
  console.warn("CloudBase 调用异常，重置云端连接状态。", error);
  state.cloudUnhealthy = true;
  state.cloudReady = false;
  state.cloudApp = null;
  state.cloudAuth = null;
  state.cloudDb = null;
  state.cloudInitializing = null;
  state.cloudAuthListenerBound = false;
}

// 云端 SDK 调用统一包裹：超时即抛错并把 cloud 标记为 unhealthy。
async function cloudGuard(promise, timeoutMs, message) {
  try {
    return await withTimeout(promise, timeoutMs, message);
  } catch (error) {
    markCloudUnhealthy(error);
    throw error;
  }
}

async function readStoreAll(storeName) {
  const result = await runIdbTransaction(
    storeName,
    "readonly",
    (store, transaction) => {
      const output = { rows: [] };
      const request = store.getAll();
      request.onsuccess = () => {
        output.rows = request.result || [];
      };
      request.onerror = () => {
        try {
          transaction.abort();
        } catch (error) {
          console.warn(error);
        }
      };
      return output;
    },
    { timeoutMessage: "读取本地数据库超时，请重试。" },
  );
  return result.rows || [];
}

async function readStoreRecord(storeName, id) {
  const result = await runIdbTransaction(
    storeName,
    "readonly",
    (store, transaction) => {
      const output = { record: null };
      const request = store.get(String(id));
      request.onsuccess = () => {
        output.record = request.result || null;
      };
      request.onerror = () => {
        try {
          transaction.abort();
        } catch (error) {
          console.warn(error);
        }
      };
      return output;
    },
    { timeoutMessage: "读取本地数据库超时，请重试。" },
  );
  return result.record || null;
}

function buildSyncStateId(entityType, entityId) {
  return `${String(entityType || "").trim()}:${String(entityId || "").trim()}`;
}

function normalizeLocalOpStatus(status) {
  const value = String(status || "").trim();
  if (!value || value === "localCommitted") {
    return LOCAL_OP_STATUS_PENDING;
  }
  if (
    [
      LOCAL_OP_STATUS_PENDING,
      LOCAL_OP_STATUS_SYNCING,
      LOCAL_OP_STATUS_SYNCED,
      LOCAL_OP_STATUS_FAILED,
      LOCAL_OP_STATUS_SUPERSEDED,
      LOCAL_OP_STATUS_CANCELLED,
      LOCAL_OP_STATUS_CONFLICT,
    ].includes(value)
  ) {
    return value;
  }
  return LOCAL_OP_STATUS_PENDING;
}

function buildLocalOpBatchKey(operation = {}) {
  const entityType = operation.entityType || String(operation.type || "").split(".")[0] || "unknown";
  const entityId = operation.entityId || operation.payload?.scoreId || operation.payload?.folderId || operation.payload?.setlistId || "";
  return operation.batchKey || `${operation.type || "unknown"}:${entityType}:${entityId}`;
}

function normalizeLocalOperationRecord(operation = {}) {
  const now = Date.now();
  const createdAt = Number(operation.createdAt) || now;
  return {
    id: operation.id || `op-${now}-${Math.random().toString(16).slice(2)}`,
    type: operation.type || "unknown",
    entityType: operation.entityType || String(operation.type || "").split(".")[0] || "",
    entityId: operation.entityId ? String(operation.entityId) : "",
    payload: sanitizeLocalOperationPayload(operation.payload || null),
    status: normalizeLocalOpStatus(operation.status),
    priority: operation.priority || "high",
    createdAt,
    updatedAt: Number(operation.updatedAt) || now,
    startedAt: operation.startedAt || null,
    finishedAt: operation.finishedAt || null,
    error: operation.error || operation.lastError || "",
    retryCount: Number(operation.retryCount) || 0,
    nextRetryAt: Number(operation.nextRetryAt) || 0,
    syncedAt: operation.syncedAt || "",
    supersededBy: operation.supersededBy || "",
    batchKey: buildLocalOpBatchKey(operation),
    userId: operation.userId || state.session?.user?.id || "",
  };
}

function getSyncTargetsForOperation(operation = {}) {
  const targets = [];
  const add = (entityType, entityId) => {
    if (!entityType || !entityId) {
      return;
    }
    const key = buildSyncStateId(entityType, entityId);
    if (!targets.some((target) => target.id === key)) {
      targets.push({ id: key, entityType, entityId: String(entityId) });
    }
  };

  add(operation.entityType, operation.entityId);
  const payload = operation.payload || {};
  (payload.scoreIds || []).forEach((id) => add("score", id));
  (payload.activePageIds || []).forEach((id) => add("page", id));
  (payload.deletedPageIds || []).forEach((id) => add("page", id));
  if (payload.scoreId) {
    add("score", payload.scoreId);
  }
  if (payload.folderId) {
    add("folder", payload.folderId);
  }
  if (payload.setlistId) {
    add("setlist", payload.setlistId);
  }
  if (payload.annotation?.id) {
    add("annotation", payload.annotation.id);
  }
  return targets;
}

function buildNextSyncState(previous, target, patch = {}) {
  const now = patch.now || Date.now();
  const pendingSource = patch.replacePendingOpIds
    ? patch.pendingOpIds || []
    : [...(previous?.pendingOpIds || []), ...(patch.pendingOpIds || [])];
  const pendingOpIds = Array.from(new Set(pendingSource.filter(Boolean).map(String)));
  const localRevision = Number(previous?.localRevision) || 0;
  return {
    id: buildSyncStateId(target.entityType, target.entityId),
    entityType: target.entityType,
    entityId: String(target.entityId),
    userId: patch.userId ?? previous?.userId ?? state.session?.user?.id ?? "",
    status: patch.status || previous?.status || SYNC_STATE_SYNCED,
    dirty: patch.dirty ?? previous?.dirty ?? false,
    deleted: patch.deleted ?? previous?.deleted ?? false,
    localRevision: patch.incrementLocalRevision ? localRevision + 1 : Number(patch.localRevision ?? localRevision),
    serverRevision: patch.serverRevision ?? previous?.serverRevision ?? "",
    lastLocalAt: patch.lastLocalAt ?? previous?.lastLocalAt ?? "",
    lastSyncedAt: patch.lastSyncedAt ?? previous?.lastSyncedAt ?? "",
    lastPulledAt: patch.lastPulledAt ?? previous?.lastPulledAt ?? "",
    lastError: patch.lastError ?? previous?.lastError ?? "",
    pendingOpIds,
    conflict: patch.conflict ?? previous?.conflict ?? null,
    updatedAt: patch.updatedAt || now,
  };
}

function mutateSyncStateStore(store, target, patch = {}) {
  if (!target?.entityType || !target?.entityId) {
    return;
  }
  const id = buildSyncStateId(target.entityType, target.entityId);
  const request = store.get(id);
  request.onsuccess = () => {
    const previous = request.result || null;
    store.put(buildNextSyncState(previous, target, patch));
  };
}

function getAllSyncStates() {
  return readStoreAll(SYNC_STATE_STORE_NAME);
}

function getAllLocalOps() {
  return readStoreAll(LOCAL_OP_STORE_NAME).then((ops) => ops.map(normalizeLocalOperationRecord));
}

function markEntityDirty(entityType, entityId, options = {}) {
  if (!entityType || !entityId) {
    return Promise.resolve(null);
  }
  const now = Date.now();
  return enqueueLocalWrite(
    "markEntityDirty",
    () =>
      runIdbTransaction(
        SYNC_STATE_STORE_NAME,
        "readwrite",
        (store) => {
          mutateSyncStateStore(store, { entityType, entityId }, {
            status: options.status || SYNC_STATE_DIRTY,
            dirty: true,
            deleted: Boolean(options.deleted),
            incrementLocalRevision: true,
            lastLocalAt: options.lastLocalAt || now,
            updatedAt: now,
            userId: options.userId || state.session?.user?.id || "",
            pendingOpIds: options.opId ? [options.opId] : [],
            lastError: "",
          });
        },
        { timeoutMessage: "同步状态写入超时，请稍后重试。" },
      ),
    { priority: options.priority || "high" },
  ).catch((error) => console.warn("markEntityDirty failed", error));
}

function markEntitySyncing(entityType, entityId, options = {}) {
  return updateEntitySyncState(entityType, entityId, {
    status: SYNC_STATE_SYNCING,
    dirty: true,
    lastError: "",
    ...options,
  });
}

function markEntitySynced(entityType, entityId, options = {}) {
  const now = Date.now();
  return updateEntitySyncState(entityType, entityId, {
    status: SYNC_STATE_SYNCED,
    dirty: false,
    deleted: Boolean(options.deleted),
    pendingOpIds: [],
    replacePendingOpIds: true,
    lastSyncedAt: options.lastSyncedAt || now,
    lastError: "",
    conflict: null,
    ...options,
  });
}

function markEntityFailed(entityType, entityId, error, options = {}) {
  return updateEntitySyncState(entityType, entityId, {
    status: SYNC_STATE_FAILED,
    dirty: true,
    lastError: getErrorMessage(error) || String(error || ""),
    ...options,
  });
}

function markEntityConflict(entityType, entityId, conflict, options = {}) {
  return updateEntitySyncState(entityType, entityId, {
    status: SYNC_STATE_CONFLICT,
    dirty: true,
    conflict: conflict || true,
    lastError: "同步冲突",
    ...options,
  });
}

function updateEntitySyncState(entityType, entityId, patch = {}) {
  if (!entityType || !entityId) {
    return Promise.resolve(null);
  }
  const now = Date.now();
  return enqueueLocalWrite(
    "updateEntitySyncState",
    () =>
      runIdbTransaction(
        SYNC_STATE_STORE_NAME,
        "readwrite",
        (store) => {
          mutateSyncStateStore(store, { entityType, entityId }, {
            now,
            updatedAt: now,
            userId: patch.userId || state.session?.user?.id || "",
            ...patch,
          });
        },
        { timeoutMessage: "同步状态写入超时，请稍后重试。" },
      ),
    { priority: patch.priority || "low" },
  ).catch((error) => console.warn("updateEntitySyncState failed", error));
}

function getLocalOpRetryDelay(retryCount = 0) {
  const index = Math.min(Math.max(Number(retryCount) || 0, 0), OUTBOX_BACKOFF_MS.length - 1);
  return OUTBOX_BACKOFF_MS[index] || 0;
}

async function updateLocalOperationStatus(operationId, status, patch = {}) {
  if (!operationId) {
    return null;
  }
  const now = Date.now();
  return enqueueLocalWrite(
    "updateLocalOperationStatus",
    () =>
      runIdbTransaction(
        LOCAL_OP_STORE_NAME,
        "readwrite",
        (store) => {
          const request = store.get(String(operationId));
          request.onsuccess = () => {
            const previous = request.result ? normalizeLocalOperationRecord(request.result) : null;
            if (!previous) {
              return;
            }
            store.put({
              ...previous,
              ...patch,
              status: normalizeLocalOpStatus(status),
              updatedAt: now,
            });
          };
        },
        { timeoutMessage: "Local operation status update timed out." },
      ),
    { priority: patch.priority || "low" },
  ).catch((error) => console.warn("updateLocalOperationStatus failed", error));
}

function markLocalOpSyncing(operation) {
  return updateLocalOperationStatus(operation?.id, LOCAL_OP_STATUS_SYNCING, {
    startedAt: Date.now(),
    error: "",
    nextRetryAt: 0,
  });
}

function markLocalOpSynced(operation) {
  const now = Date.now();
  return updateLocalOperationStatus(operation?.id, LOCAL_OP_STATUS_SYNCED, {
    finishedAt: now,
    syncedAt: now,
    error: "",
    nextRetryAt: 0,
  });
}

function markLocalOpFailed(operation, error) {
  const retryCount = (Number(operation?.retryCount) || 0) + 1;
  return updateLocalOperationStatus(operation?.id, LOCAL_OP_STATUS_FAILED, {
    finishedAt: Date.now(),
    error: getErrorMessage(error) || String(error || ""),
    retryCount,
    nextRetryAt: Date.now() + getLocalOpRetryDelay(retryCount),
  });
}

function markLocalOpSuperseded(operation, supersededBy = "") {
  return updateLocalOperationStatus(operation?.id, LOCAL_OP_STATUS_SUPERSEDED, {
    finishedAt: Date.now(),
    supersededBy,
    error: "",
    nextRetryAt: 0,
  });
}

function getLocalOpPriorityWeight(priority) {
  switch (priority) {
    case "high":
      return 0;
    case "normal":
    case "medium":
      return 1;
    case "low":
      return 2;
    default:
      return 1;
  }
}

function isLocalOpRunnable(operation, now = Date.now()) {
  const status = normalizeLocalOpStatus(operation?.status);
  if (status === LOCAL_OP_STATUS_PENDING) {
    return true;
  }
  if (status === LOCAL_OP_STATUS_FAILED) {
    return !operation.nextRetryAt || operation.nextRetryAt <= now;
  }
  if (status === LOCAL_OP_STATUS_SYNCING) {
    return !operation.startedAt || now - Number(operation.startedAt) > 120000;
  }
  return false;
}

async function getRunnableLocalOperations(limit = 24) {
  const now = Date.now();
  const userId = state.session?.user?.id || "";
  const operations = (await getAllLocalOps())
    .filter((operation) => isLocalOpRunnable(operation, now))
    .filter((operation) => !userId || !operation.userId || operation.userId === userId)
    .sort((a, b) => {
      const priorityDelta = getLocalOpPriorityWeight(a.priority) - getLocalOpPriorityWeight(b.priority);
      if (priorityDelta) {
        return priorityDelta;
      }
      return (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0);
    });
  return operations.slice(0, limit);
}

async function compactLocalOperationsForSync(operations = []) {
  const grouped = new Map();
  operations.forEach((operation) => {
    const key = operation.batchKey || `${operation.entityType}:${operation.entityId}:${operation.type}`;
    const list = grouped.get(key) || [];
    list.push(operation);
    grouped.set(key, list);
  });

  const compacted = [];
  for (const list of grouped.values()) {
    list.sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0));
    const deleteOp = [...list].reverse().find((operation) => /delete/i.test(operation.type));
    const keep = deleteOp || list[list.length - 1];
    compacted.push(keep);
    for (const operation of list) {
      if (operation.id !== keep.id && normalizeLocalOpStatus(operation.status) !== LOCAL_OP_STATUS_SUPERSEDED) {
        await markLocalOpSuperseded(operation, keep.id);
      }
    }
  }
  return compacted.sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0));
}

async function scheduleLocalOperationRetry() {
  if (!state.session || SyncEngine.running || state.syncEngineTimer) {
    return;
  }
  let operations = [];
  try {
    operations = await getAllLocalOps();
  } catch (error) {
    if (!isLocalDatabaseNotReadyError(error)) {
      console.warn(error);
    }
    return;
  }
  const retryable = operations.filter((operation) => {
    const status = normalizeLocalOpStatus(operation.status);
    return status === LOCAL_OP_STATUS_PENDING || status === LOCAL_OP_STATUS_FAILED || status === LOCAL_OP_STATUS_SYNCING;
  });
  if (!retryable.length) {
    return;
  }
  const now = Date.now();
  const nextRetryAt = Math.min(...retryable.map((operation) => Number(operation.nextRetryAt) || now));
  SyncEngine.schedule({ reason: "local-op-retry", delay: Math.max(1000, nextRetryAt - now) });
}

const CloudBaseAdapter = {
  async ensureReady() {
    if (!state.cloudReady) {
      await initializeCloud();
    }
    if (state.cloudReady && !state.session) {
      await restoreCloudSession({ reason: "sync-engine" });
    }
    if (!state.cloudReady || !state.session) {
      return false;
    }
    return await ensureCloudMediaReady();
  },

  async uploadScore(scoreId) {
    if (scoreId) {
      await uploadScoreToCloud(String(scoreId));
    }
  },

  async uploadFolder(folderId) {
    if (folderId) {
      await uploadFolderToCloud(String(folderId));
    }
  },

  async uploadPage(pageId, payload = {}) {
    const scoreId = payload.scoreId || payload.score?.id || payload.page?.scoreId;
    if (scoreId) {
      await uploadScoreToCloud(String(scoreId));
      return;
    }
    const pages = await getAllScorePages();
    const page = pages.find((item) => String(item.id) === String(pageId));
    if (page?.scoreId) {
      await uploadScoreToCloud(String(page.scoreId));
    }
  },

  async uploadPageAsset(pageId, payload = {}) {
    await this.uploadPage(pageId, payload);
  },

  async uploadSetlist(setlistId) {
    if (setlistId) {
      await uploadSetlistToCloud(String(setlistId));
    }
  },

  async uploadAnnotation(annotationId, payload = {}) {
    await uploadAnnotationToCloud(payload.annotation, annotationId);
  },

  async deleteEntity(operation) {
    if (!operation?.type) {
      return;
    }
    if (operation.type === "score.delete" && operation.payload?.score) {
      await deleteCloudScore(operation.payload.score, operation.payload.deletedAt);
    } else if (operation.type === "folder.delete" && operation.payload?.folder) {
      await deleteCloudFolder(operation.payload.folder, operation.payload.folderScores || [], operation.payload.deletedAt);
    } else if (operation.type === "DELETE_ANNOTATION" || operation.type === "annotation.delete") {
      await deleteCloudAnnotation(operation.payload?.annotation, operation.payload?.deletedAt);
    }
  },

  async pullChangedSince() {
    await pullCloudMetadataForCurrentAccount({ fromSyncEngine: true });
  },
};

async function dispatchLocalOperationToCloud(operation) {
  if (!operation || /delete/i.test(operation.type)) {
    await CloudBaseAdapter.deleteEntity(operation);
    return;
  }
  switch (operation.entityType) {
    case "score":
      await CloudBaseAdapter.uploadScore(operation.entityId || operation.payload?.scoreId);
      return;
    case "folder":
      await CloudBaseAdapter.uploadFolder(operation.entityId || operation.payload?.folderId);
      return;
    case "page":
      await CloudBaseAdapter.uploadPage(operation.entityId, operation.payload || {});
      return;
    case "pageAsset":
      await CloudBaseAdapter.uploadPageAsset(operation.entityId, operation.payload || {});
      return;
    case "setlist":
      await CloudBaseAdapter.uploadSetlist(operation.entityId || operation.payload?.setlistId);
      return;
    case "annotation":
      await CloudBaseAdapter.uploadAnnotation(operation.entityId || operation.payload?.annotation?.id, operation.payload || {});
      return;
    default:
      if (operation.payload?.scoreId) {
        await CloudBaseAdapter.uploadScore(operation.payload.scoreId);
      }
  }
}

const SyncEngine = {
  running: false,
  rerunRequested: false,

  schedule(options = {}) {
    const delay = Number(options.delay ?? 1000);
    state.syncEngineScheduled = true;
    state.syncEngineLastReason = options.reason || state.syncEngineLastReason || "scheduled";
    window.clearTimeout(state.syncEngineTimer);
    state.syncEngineTimer = window.setTimeout(() => {
      state.syncEngineTimer = 0;
      this.run({ reason: state.syncEngineLastReason }).catch((error) => console.warn("SyncEngine run failed", error));
    }, Math.max(0, delay));
  },

  shouldPause(options = {}) {
    if (options.manual || options.force) {
      return false;
    }
    if (!state.session) {
      return true;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return true;
    }
    if (typeof document !== "undefined" && document.hidden) {
      return true;
    }
    return shouldDeferBackgroundWork();
  },

  pauseForUserWork(delay = 2500) {
    this.schedule({ reason: "user-work", delay });
  },

  async run(options = {}) {
    if (this.running) {
      this.rerunRequested = true;
      return;
    }
    if (!state.session) {
      await refreshOutboxCounts();
      return;
    }
    if (this.shouldPause(options)) {
      this.schedule({ reason: options.reason || "paused", delay: 2500 });
      return;
    }

    this.running = true;
    state.syncEngineScheduled = false;
    state.syncing = true;
    state.syncEngineLastRunAt = Date.now();
    state.syncEngineLastError = "";
    updateAccountUi();

    try {
      await ensureDatabaseReady();
      await claimLocalRecordsForUser(state.session.user.id);
      const ready = await CloudBaseAdapter.ensureReady();
      if (!ready) {
        await refreshOutboxCounts();
        return;
      }
      await this.uploadPendingOps(options);
      if (this.shouldPause(options)) {
        this.pauseForUserWork();
        return;
      }
      await this.processLegacyOutbox(options);
      if (this.shouldPause(options)) {
        this.pauseForUserWork();
        return;
      }
      await this.pullRemoteChanges(options);
      setBackgroundSyncError("");
    } catch (error) {
      if (isLocalDatabaseNotReadyError(error)) {
        console.warn("Local database is recovering; SyncEngine will retry.", error);
        setBackgroundSyncError("");
        this.schedule({ reason: "local-db-recover", delay: 1500 });
      } else {
        console.warn("SyncEngine failed.", error);
        state.syncEngineLastError = getErrorMessage(error) || String(error || "");
        setBackgroundSyncError(state.syncEngineLastError);
      }
    } finally {
      this.running = false;
      state.syncing = false;
      await refreshOutboxCounts();
      await scheduleLocalOperationRetry();
      updateAccountUi();
      if (this.rerunRequested) {
        this.rerunRequested = false;
        this.schedule({ reason: "rerun", delay: 1000 });
      }
    }
  },

  async uploadPendingOps(options = {}) {
    const batch = await compactLocalOperationsForSync(await getRunnableLocalOperations(options.limit || 24));
    for (const operation of batch) {
      if (this.shouldPause(options)) {
        this.pauseForUserWork();
        break;
      }
      await markLocalOpSyncing(operation);
      const targets = getSyncTargetsForOperation(operation);
      await Promise.all(targets.map((target) => markEntitySyncing(target.entityType, target.entityId)));
      try {
        await dispatchLocalOperationToCloud(operation);
        await markLocalOpSynced(operation);
        await Promise.all(targets.map((target) => markEntitySynced(target.entityType, target.entityId)));
      } catch (error) {
        await markLocalOpFailed(operation, error);
        await Promise.all(targets.map((target) => markEntityFailed(target.entityType, target.entityId, error)));
      }
    }
  },

  async processLegacyOutbox(options = {}) {
    await processSyncOutbox({
      force: Boolean(options.manual || options.force),
      ensureConnection: true,
      fromSyncEngine: true,
    });
  },

  async pullRemoteChanges(options = {}) {
    await CloudBaseAdapter.pullChangedSince(options.since || 0);
  },
};

function createAssetId(prefix = "asset") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getAssetIdForPage(page) {
  return page?.assetId || page?.imageAssetId || "";
}

function stripPageBlob(page) {
  if (!page) {
    return page;
  }
  const { blob, file, dataUrl, blobData, blobType, displayUrl, objectUrl, previewUrl, tempUrl, ...rest } = page;
  return rest;
}

function normalizePageForStore(page) {
  if (!page) {
    return page;
  }
  const clean = stripPageBlob(page);
  return {
    ...clean,
    id: String(clean.id || createId()),
    scoreId: String(clean.scoreId || ""),
    userId: clean.userId || null,
    pageIndex: Number.isInteger(clean.pageIndex) ? clean.pageIndex : 0,
    name: clean.name || "歌谱图片",
    type: clean.type || clean.mimeType || "image/jpeg",
    size: Number(clean.size) || 0,
    width: Number(clean.width) || 0,
    height: Number(clean.height) || 0,
    assetId: clean.assetId || clean.imageAssetId || "",
    thumbnailAssetId: clean.thumbnailAssetId || "",
    storagePath: clean.storagePath || null,
    storageSyncedAt: clean.storageSyncedAt || null,
    storageUploadVersion: Number(clean.storageUploadVersion) || 0,
    createdAt: clean.createdAt || new Date().toISOString(),
    updatedAt: clean.updatedAt || clean.createdAt || new Date().toISOString(),
    deletedAt: clean.deletedAt || null,
    syncStatus: clean.syncStatus || SYNC_STATUS_LOCAL,
  };
}

function buildPageAssetRecord(page, blob, options = {}) {
  const now = new Date().toISOString();
  const mimeType = blob?.type || page?.type || options.mimeType || "image/jpeg";
  return {
    id: options.assetId || page?.assetId || createAssetId("asset"),
    kind: options.kind || "page-image",
    scoreId: page?.scoreId || options.scoreId || "",
    pageId: page?.id || options.pageId || "",
    userId: page?.userId || options.userId || state.session?.user?.id || "",
    blob: blob || null,
    mimeType,
    size: Number(blob?.size || page?.size || options.size) || 0,
    width: Number(page?.width || options.width) || 0,
    height: Number(page?.height || options.height) || 0,
    hash: options.hash || page?.hash || "",
    localState: blob ? "ready" : "missing",
    cloudPath: page?.storagePath || options.cloudPath || "",
    storagePath: page?.storagePath || options.storagePath || "",
    storageSyncedAt: page?.storageSyncedAt || "",
    storageUploadVersion: Number(page?.storageUploadVersion || options.storageUploadVersion) || 0,
    createdAt: page?.createdAt || now,
    updatedAt: now,
    deletedAt: page?.deletedAt || "",
    error: "",
  };
}

function getAllAssets() {
  return readStoreAll(ASSET_STORE_NAME);
}

function putAsset(asset, options = {}) {
  return enqueueLocalWrite(
    "putAsset",
    () =>
      runIdbTransaction(
        ASSET_STORE_NAME,
        "readwrite",
        (store) => {
          store.put(asset);
        },
        {
          timeoutMs: options.timeoutMs || getBlobWriteTimeout(asset?.blob?.size || asset?.size),
          timeoutMessage: "保存页面资源超时，请稍后重试。",
        },
      ),
    {
      priority: options.priority || getInheritedLocalWritePriority(),
      label: "putAsset",
      timeoutMs: options.timeoutMs || getBlobWriteTimeout(asset?.blob?.size || asset?.size),
    },
  );
}

function getAsset(assetId) {
  if (!assetId) {
    return Promise.resolve(null);
  }
  return readStoreRecord(ASSET_STORE_NAME, String(assetId));
}

async function getAssetByPageId(pageId) {
  if (!pageId) {
    return null;
  }
  const result = await runIdbTransaction(
    ASSET_STORE_NAME,
    "readonly",
    (store, transaction) => {
      const output = { rows: [] };
      const request = store.index("by_page").getAll(String(pageId));
      request.onsuccess = () => {
        output.rows = request.result || [];
      };
      request.onerror = () => {
        try {
          transaction.abort();
        } catch (error) {
          console.warn(error);
        }
      };
      return output;
    },
    { timeoutMessage: "读取页面资源超时，请重试。" },
  );
  return (result.rows || [])
    .filter((asset) => !asset.deletedAt && asset.kind === "page-image")
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))[0] || null;
}

async function getPageAsset(page) {
  const assetId = getAssetIdForPage(page);
  if (assetId) {
    return getAsset(assetId);
  }
  return getAssetByPageId(page?.id);
}

async function getPageBlob(page) {
  if (page?.blob instanceof Blob && page.blob.size > 0) {
    return page.blob;
  }

  const asset = await getPageAsset(page);
  if (asset?.blob instanceof Blob && asset.blob.size > 0) {
    return asset.blob;
  }

  // Legacy fallback: older score_pages records may still contain blob until lazy migration finishes.
  if (page?.id) {
    const legacy = await readStoreRecord(PAGE_STORE_NAME, page.id).catch(() => null);
    if (legacy?.blob instanceof Blob && legacy.blob.size > 0) {
      return legacy.blob;
    }
  }

  return null;
}

function cachePageObjectUrl(page, blob) {
  if (!page?.id || !(blob instanceof Blob) || blob.size <= 0) {
    return "";
  }
  const existing = state.scoreUrls.get(page.id);
  if (existing) {
    return existing;
  }
  const url = URL.createObjectURL(blob);
  state.scoreUrls.set(page.id, url);
  return url;
}

function ensurePageAssetDisplayUrl(page) {
  if (!page?.id || state.scoreUrls.has(page.id) || state.pageAssetUrlRequests.has(page.id)) {
    return;
  }
  const request = getPageBlob(page)
    .then((blob) => {
      if (!(blob instanceof Blob) || blob.size <= 0) {
        return "";
      }
      const url = cachePageObjectUrl(page, blob);
      refreshPageImages({ ...page, blob });
      return url;
    })
    .catch((error) => {
      console.warn("读取页面资源失败", error);
      return "";
    })
    .finally(() => {
      state.pageAssetUrlRequests.delete(page.id);
    });
  state.pageAssetUrlRequests.set(page.id, request);
}

async function markPageAssetStorageSynced(page, metadata = {}, options = {}) {
  const asset = await getPageAsset(page);
  if (!asset) {
    return;
  }
  await putAsset(
    {
      ...asset,
      storagePath: metadata.storagePath || asset.storagePath || "",
      cloudPath: metadata.storagePath || asset.cloudPath || "",
      storageSyncedAt: metadata.storageSyncedAt || asset.storageSyncedAt || "",
      storageUploadVersion: Number(metadata.storageUploadVersion || asset.storageUploadVersion) || 0,
      size: Number(metadata.size || asset.size) || 0,
      localState: asset.blob ? "ready" : asset.localState || "missing",
      error: "",
      updatedAt: new Date().toISOString(),
    },
    { priority: options.priority || "low" },
  );
}

function deleteStoreRecord(storeName, id, timeoutMessage = "本地删除超时，请重试。") {
  return enqueueLocalWrite(`delete:${storeName}`, () =>
    runIdbTransaction(
      storeName,
      "readwrite",
      (store) => {
        store.delete(String(id));
      },
      { timeoutMessage },
    ),
  );
}

function clearStore(storeName, timeoutMessage = "本地清理超时，请重试。") {
  return enqueueLocalWrite(`clear:${storeName}`, () =>
    runIdbTransaction(
      storeName,
      "readwrite",
      (store) => {
        store.clear();
      },
      { timeoutMessage },
    ),
  );
}

// 在只读事务中按索引读取一组主键（用于“先 readonly 读 keys，再 readwrite 删除”的安全删除模式）。
function readKeysByIndex(storeName, indexName, value) {
  return runIdbTransaction(
    storeName,
    "readonly",
    (store, transaction) => {
      const output = { keys: [] };
      const request = store.index(indexName).getAllKeys(value);
      request.onsuccess = () => {
        output.keys = request.result || [];
      };
      request.onerror = () => {
        try {
          transaction.abort();
        } catch (error) {
          console.warn(error);
        }
      };
      return output;
    },
    { timeoutMessage: "读取本地数据库超时，请重试。" },
  ).then((result) => result.keys || []);
}

// 在只读事务中读取指定歌谱的所有页记录（先读后写，避免在 getAll 回调里写入而卡死事务）。
function readPagesForScoreIds(scoreIds) {
  const idSet = new Set((scoreIds || []).map(String));
  if (!idSet.size) {
    return Promise.resolve([]);
  }
  return runIdbTransaction(
    PAGE_STORE_NAME,
    "readonly",
    (store, transaction) => {
      const output = { rows: [] };
      const index = store.index("scoreId");
      idSet.forEach((scoreId) => {
        const request = index.getAll(scoreId);
        request.onsuccess = () => {
          (request.result || []).forEach((page) => output.rows.push(page));
        };
        request.onerror = () => {
          try {
            transaction.abort();
          } catch (error) {
            console.warn(error);
          }
        };
      });
      return output;
    },
    { timeoutMessage: "读取歌谱页面超时，请重试。" },
  ).then((result) => result.rows || []);
}

// 在只读事务中读取关联到指定歌谱的歌单项记录。
function readSetlistItemsForScoreIds(scoreIds) {
  const idSet = new Set((scoreIds || []).map(String));
  if (!idSet.size) {
    return Promise.resolve([]);
  }
  return runIdbTransaction(
    SETLIST_ITEM_STORE_NAME,
    "readonly",
    (store, transaction) => {
      const output = { rows: [] };
      const index = store.index("scoreId");
      idSet.forEach((scoreId) => {
        const request = index.getAll(scoreId);
        request.onsuccess = () => {
          (request.result || []).forEach((item) => output.rows.push(item));
        };
        request.onerror = () => {
          try {
            transaction.abort();
          } catch (error) {
            console.warn(error);
          }
        };
      });
      return output;
    },
    { timeoutMessage: "读取歌单项目超时，请重试。" },
  ).then((result) => result.rows || []);
}

function migrateScoreMetadataFields(scoreStore) {
  const request = scoreStore.openCursor();
  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) {
      return;
    }

    const record = { ...cursor.value };
    const nextRecord = {
      ...record,
      tags: normalizeTags(record.tags),
      keySignature: String(record.keySignature || record.key_signature || "").trim(),
      usage: String(record.usage || "").trim(),
      notes: String(record.notes || "").trim(),
    };
    cursor.update(nextRecord);
    cursor.continue();
  };
}

async function migrateNestedScorePages(scores) {
  const nestedScores = scores.filter((score) => Array.isArray(score.pages));
  if (!nestedScores.length) {
    return scores;
  }

  await runIdbTransaction(
    [STORE_NAME, PAGE_STORE_NAME, ASSET_STORE_NAME],
    "readwrite",
    ([scoreStore, pageStore, assetStore]) => {
      nestedScores.forEach((score) => {
        const pages = score.pages.map((page, index) => ({
          id: page.id || createId(),
          scoreId: score.id,
          userId: score.userId || null,
          pageIndex: index,
          name: page.name || `第 ${index + 1} 页`,
          type: page.type || page.blob?.type || "image/jpeg",
          size: Number(page.size) || page.blob?.size || 0,
          assetId: page.assetId || (page.blob ? createAssetId("asset") : ""),
          blob: page.blob,
          storagePath: page.storagePath || null,
          storageSyncedAt: page.storageSyncedAt || null,
          storageUploadVersion: Number(page.storageUploadVersion) || 0,
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
        pages.forEach((page) => {
          if (page.blob instanceof Blob && page.blob.size > 0) {
            assetStore.put(buildPageAssetRecord(page, page.blob, { assetId: page.assetId }));
          }
          pageStore.put(normalizePageForStore(page));
        });
        score.__migratedPages = pages.map(normalizePageForStore);
      });
    },
    { timeoutMessage: "迁移本地歌谱页面超时，请重试。" },
  );

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
    tags: normalizeTags(score.tags),
    keySignature: String(score.keySignature || score.key_signature || "").trim(),
    usage: String(score.usage || "").trim(),
    notes: String(score.notes || "").trim(),
    favorite: Boolean(score.favorite),
    lastOpenedAt: score.lastOpenedAt || score.last_opened_at || null,
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
    normalizedName: normalizeText(name),
    createdAt: folder.createdAt || new Date().toISOString(),
    updatedAt: folder.updatedAt || folder.createdAt || new Date().toISOString(),
    deletedAt: folder.deletedAt || null,
    syncStatus: folder.syncStatus || SYNC_STATUS_LOCAL,
  };
}

function normalizeLocalPageRecord(page) {
  return normalizePageForStore({
    ...page,
    name: page.name || "歌谱图片",
    type: page.type || page.blob?.type || "image/jpeg",
    size: Number(page.size) || page.blob?.size || 0,
  });
}

function normalizeLocalSetlistRecord(setlist) {
  const name = String(setlist.name || "未命名歌单").trim() || "未命名歌单";
  const date = String(setlist.date || "").trim();

  return {
    ...setlist,
    id: String(setlist.id || createId()),
    userId: setlist.userId || null,
    name,
    normalizedName: normalizeText(setlist.normalizedName || name),
    date,
    scene: String(setlist.scene || setlist.scenario || "").trim(),
    createdAt: setlist.createdAt || new Date().toISOString(),
    updatedAt: setlist.updatedAt || setlist.createdAt || new Date().toISOString(),
    deletedAt: setlist.deletedAt || null,
    syncStatus: setlist.syncStatus || SYNC_STATUS_LOCAL,
  };
}

function normalizeLocalSetlistItemRecord(item) {
  return {
    ...item,
    id: String(item.id || createId()),
    setlistId: String(item.setlistId || ""),
    scoreId: String(item.scoreId || ""),
    userId: item.userId || null,
    position: Number.isInteger(item.position) ? item.position : 0,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
    deletedAt: item.deletedAt || null,
    syncStatus: item.syncStatus || SYNC_STATUS_LOCAL,
  };
}

function toScoreRecord(score) {
  const { pages, __migratedPages, ...record } = score;
  return record;
}

function createNamedError(name, message) {
  const error = new Error(message);
  error.name = name;
  return error;
}

function getStorageErrorMessage(error, action = "操作") {
  const errorName = String(error?.name || "");
  const message = getErrorMessage(error);
  const combined = `${errorName} ${message}`;

  if (/QuotaExceededError|quota|not enough|exceeded|storage/i.test(combined)) {
    return "本地存储空间不足，请删除部分歌谱或清理浏览器空间后再试。";
  }
  if (/DataCloneError/i.test(combined)) {
    return "图片数据格式异常，请重新选择图片。";
  }
  if (/TransactionInactiveError/i.test(combined)) {
    return "本地数据库写入中断，请刷新后再试。";
  }
  if (/InvalidStateError/i.test(combined)) {
    return "本地数据库状态异常，请刷新后再试。";
  }
  if (/TimeoutError|timeout|超时/i.test(combined)) {
    return message && /超时/.test(message) ? message : `${action}超时，图片较多或较大时请减少单次添加数量后重试。`;
  }
  if (/AbortError|abort/i.test(combined)) {
    return "本地数据库操作被中断，请重试。";
  }

  return `${action}失败，请刷新后重试。`;
}

function logStorageOperationError(error, action, context = {}) {
  console.error("Storage operation failed", {
    action,
    errorName: error?.name || "",
    errorMessage: error?.message || getErrorMessage(error),
    scoreIds: context.scoreIds || [],
    pagesLength: Number(context.pagesLength) || 0,
    totalBlobSize: Number(context.totalBlobSize) || 0,
    isLoggedIn: Boolean(state.session),
    cloudReady: Boolean(state.cloudReady),
    appReady: Boolean(state.appReady),
  });
}

function normalizePageBlob(page) {
  const source = page?.blob;
  if (!(source instanceof Blob) || source.size <= 0) {
    throw createNamedError("DataCloneError", "图片处理失败，请重新选择图片。");
  }

  const type = source.type || page.type || "image/jpeg";
  // 仅在类型需要修正时才重建 Blob，避免对大图做整块内存复制。
  const blob = source.type === type ? source : new Blob([source], { type });
  if (!(blob instanceof Blob) || blob.size <= 0) {
    throw createNamedError("DataCloneError", "图片处理失败，请重新选择图片。");
  }

  return {
    ...page,
    blob,
    type,
    size: blob.size,
  };
}

function getPagesTotalBlobSize(pages) {
  return (pages || []).reduce((total, page) => total + (Number(page?.blob?.size || page?.size) || 0), 0);
}

async function assertStorageSpaceAvailable(totalBlobSize) {
  if (!totalBlobSize || !navigator.storage?.estimate) {
    return;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const quota = Number(estimate.quota) || 0;
    const usage = Number(estimate.usage) || 0;
    const remaining = quota - usage;
    if (quota > 0 && remaining > 0 && remaining < totalBlobSize * 1.2) {
      throw createNamedError("QuotaExceededError", "本地存储空间不足。");
    }
  } catch (error) {
    if (error?.name === "QuotaExceededError") {
      throw error;
    }
    console.warn(error);
  }
}

function waitForTransaction(transaction, timeoutMs, timeoutMessage) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      try {
        transaction.abort();
      } catch (error) {
        console.warn(error);
      }
      reject(createNamedError("TimeoutError", timeoutMessage));
    }, timeoutMs);

    const finish = (callback) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timer);
      callback();
    };

    transaction.oncomplete = () => finish(resolve);
    transaction.onerror = () => finish(() => reject(transaction.error || createNamedError("AbortError", "本地数据库操作失败。")));
    transaction.onabort = () => finish(() => reject(transaction.error || createNamedError("AbortError", "本地数据库操作被中断。")));
  });
}

async function saveScoreLocalAtomic(score, pages, options = {}) {
  const requireBlobs = options.requireBlobs !== false;
  const preparedScore = normalizeLocalScoreRecord(score);
  const preparedPages = pages.map((page, index) => {
    const preparedPage = {
      ...page,
      id: String(page.id || createId()),
      scoreId: preparedScore.id,
      userId: page.userId || preparedScore.userId || null,
      pageIndex: Number.isInteger(page.pageIndex) ? page.pageIndex : index,
      name: page.name || "姝岃氨鍥剧墖",
      type: page.type || page.blob?.type || "image/jpeg",
      size: Number(page.size) || page.blob?.size || 0,
      createdAt: page.createdAt || new Date().toISOString(),
      updatedAt: page.updatedAt || page.createdAt || new Date().toISOString(),
      deletedAt: page.deletedAt || null,
      syncStatus: page.syncStatus || preparedScore.syncStatus || SYNC_STATUS_LOCAL,
    };
    if (requireBlobs || preparedPage.blob) {
      return normalizePageBlob(preparedPage);
    }
    return normalizeLocalPageRecord(preparedPage);
  });

  // 生成持久封面缩略图并写入 score（失败不影响保存，仅影响封面缓存，之后可重试）。
  const coverFields = await buildScoreCoverFields(preparedScore, preparedPages);
  Object.assign(preparedScore, coverFields);

  // 逐页写入：每页一个独立的小事务，而不是把多张大图塞进一个巨型事务。
  // iOS Safari 的 IndexedDB 在单事务存多个大 Blob 时容易卡死/超时，分开写更可靠，
  // 也能给出“正在保存第 N 页”的进度，并在失败时精确清理。
  const writtenPageIds = [];
  const writtenAssetIds = [];
  const storedPages = [];
  try {
    for (let index = 0; index < preparedPages.length; index += 1) {
      const page = preparedPages[index];
      options.onProgress?.(index + 1, preparedPages.length);
      const blob = page.blob instanceof Blob && page.blob.size > 0 ? page.blob : null;
      let pageForStore = page;
      if (blob) {
        const assetId = page.assetId || createAssetId("asset");
        const asset = buildPageAssetRecord({ ...page, assetId }, blob, { assetId });
        await putAsset(asset, {
          timeoutMs: getBlobWriteTimeout(blob.size),
        });
        writtenAssetIds.push(asset.id);
        pageForStore = normalizePageForStore({
          ...page,
          assetId,
          type: blob.type || page.type,
          size: blob.size,
        });
        cachePageObjectUrl(pageForStore, blob);
      } else {
        pageForStore = normalizePageForStore(page);
      }
      await putStoreRecord(
        PAGE_STORE_NAME,
        pageForStore,
        LOCAL_SAVE_TIMEOUT,
        `第 ${index + 1} 页图片保存较慢，请重试，或减小图片体积 / 减少单次添加数量。`,
      );
      writtenPageIds.push(pageForStore.id);
      storedPages.push(pageForStore);
      await nextFrame();
    }
    // 元数据最后写入，作为“提交点”：歌谱记录写成功，这份歌谱才算存在。
    await putStoreRecord(STORE_NAME, toScoreRecord(preparedScore), LOCAL_SAVE_TIMEOUT);
  } catch (error) {
    // 失败清理：删除本次已写入的页，避免留下孤立页；新歌谱记录尚未写入故不会出现在列表中。
    await cleanupPartialScoreSave(preparedScore.id, writtenPageIds, writtenAssetIds);
    throw error;
  }
  return { score: preparedScore, pages: storedPages };
}

// 按 Blob 大小给出写入超时：小图给基础时长，大图按每 MB 递增，避免大图在慢设备上被误判为超时。
function getBlobWriteTimeout(byteSize) {
  const sizeMb = (Number(byteSize) || 0) / (1024 * 1024);
  return Math.max(PAGE_SAVE_TIMEOUT, Math.ceil(sizeMb) * 10000 + 5000);
}

function toDeletedPageTombstone(page, userId, deletedAt) {
  const { blob, displayUrl, objectUrl, previewUrl, tempUrl, ...metadata } = page || {};
  return {
    ...metadata,
    id: String(metadata.id || ""),
    scoreId: String(metadata.scoreId || ""),
    userId: metadata.userId || userId,
    deletedAt,
    updatedAt: deletedAt,
    syncStatus: SYNC_STATUS_PENDING,
  };
}

// 清理一次未完成的保存：删除已写入的页与（可能尚未写入的）歌谱记录，尽力而为、不抛错。
function cleanupPartialScoreSave(scoreId, pageIds, assetIds = []) {
  if (!scoreId && !(pageIds && pageIds.length) && !(assetIds && assetIds.length)) {
    return Promise.resolve();
  }
  // 清理尽力而为：失败也不抛错，避免影响主流程。
  return enqueueLocalWrite("cleanupPartialScoreSave", () =>
    runIdbTransaction(
      [STORE_NAME, PAGE_STORE_NAME, ASSET_STORE_NAME],
      "readwrite",
      ([scoreStore, pageStore, assetStore]) => {
        scoreStore.delete(scoreId);
        (pageIds || []).forEach((id) => pageStore.delete(id));
        (assetIds || []).forEach((id) => assetStore.delete(id));
      },
      { timeoutMessage: "清理未完成的保存超时。" },
    ),
  ).catch((error) => {
    console.warn("清理未完成的保存失败", error);
  });
}

async function deleteScoresLocalAtomic(scoreIds, options = {}) {
  const ids = Array.from(new Set((scoreIds || []).filter(Boolean).map(String)));
  if (!ids.length) {
    return;
  }

  const deletedAt = options.deletedAt || new Date().toISOString();
  const providedScores = new Map((options.scores || []).map((score) => [String(score.id), score]));

  // 阶段一：先在只读事务中读出受影响的页与歌单项，await 完成后再写。
  // 旧实现在 readwrite 事务的 getAll().onsuccess 回调里发起写入，这种模式在
  // iOS / iPad Safari 上容易让事务卡死（永不 oncomplete），从而拖垮后续的保存。
  const [pageRecords, itemRecords, annotationRecords] = await withTimeout(
    Promise.all([readPagesForScoreIds(ids), readSetlistItemsForScoreIds(ids), readAnnotationsForScoreIds(ids)]),
    Math.max(LOCAL_SAVE_TIMEOUT, ids.length * 4000 + 5000),
    "读取本地数据超时，请稍后重试。",
  );
  const pagesByScore = new Map();
  pageRecords.forEach((page) => {
    const key = String(page.scoreId);
    const list = pagesByScore.get(key) || [];
    list.push(page);
    pagesByScore.set(key, list);
  });
  const itemsByScore = new Map();
  itemRecords.forEach((item) => {
    const key = String(item.scoreId);
    const list = itemsByScore.get(key) || [];
    list.push(item);
    itemsByScore.set(key, list);
  });
  const annotationsByScore = new Map();
  annotationRecords.forEach((annotation) => {
    const key = String(annotation.scoreId);
    const list = annotationsByScore.get(key) || [];
    list.push(annotation);
    annotationsByScore.set(key, list);
  });

  // 阶段二：拆分写入。软删除只需要保留页墓碑元数据（id / scoreId / storagePath / deletedAt），
  // 不应再重写图片 blob。旧逻辑把每页大图重新 put 一遍，iOS / PWA 下极易超时，
  // 表现为“删除失败，点恢复弹窗重试才成功”。
  // 因此：① 歌谱墓碑 + 歌单项 + 标注 + 硬删的各表删除 放在一个小事务（不含页 blob）；
  //       ② 软删的页墓碑逐页用独立小事务写入，且明确去掉 blob，保证删除快速稳定。
  const softWrites = [];
  const hardDeletes = [];
  ids.forEach((scoreId) => {
    const score = providedScores.get(scoreId) || state.scores.find((item) => item.id === scoreId) || null;
    const forceSoft = Boolean(options.forceSoft);
    const forceHard = Boolean(options.forceHard);
    const keepTombstone = forceSoft || (!forceHard && shouldKeepDeleteTombstone(score));
    const userId = score?.userId || state.session?.user?.id || null;
    const pages = pagesByScore.get(scoreId) || [];
    const items = itemsByScore.get(scoreId) || [];
    const annotations = annotationsByScore.get(scoreId) || [];
    if (keepTombstone && score) {
      softWrites.push({ scoreId, score, userId, pages, items, annotations });
    } else {
      hardDeletes.push({ scoreId, pages, items, annotations });
    }
  });

  // ① 元数据小事务：墓碑/删除（不含页图片，体积小、更稳）。
  await enqueueLocalWrite("deleteScores:meta", () =>
    runIdbTransaction(
      [STORE_NAME, PAGE_STORE_NAME, SETLIST_ITEM_STORE_NAME, ANNOTATION_STORE_NAME],
      "readwrite",
      ([scoreStore, pageStore, setlistItemStore, annotationStore]) => {
        softWrites.forEach(({ score, userId, items, annotations }) => {
          scoreStore.put({
            ...toScoreRecord(score),
            userId,
            deletedAt,
            updatedAt: deletedAt,
            syncStatus: SYNC_STATUS_PENDING,
          });
          items.forEach((item) => {
            setlistItemStore.put({
              ...item,
              userId: item.userId || userId,
              deletedAt,
              updatedAt: deletedAt,
              syncStatus: SYNC_STATUS_PENDING,
            });
          });
          annotations.forEach((annotation) => {
            annotationStore.put({
              ...annotation,
              userId: annotation.userId || userId,
              deletedAt,
              updatedAt: deletedAt,
              syncStatus: SYNC_STATUS_PENDING,
            });
          });
        });
        hardDeletes.forEach(({ scoreId, pages, items, annotations }) => {
          scoreStore.delete(scoreId);
          pages.forEach((page) => pageStore.delete(page.id));
          items.forEach((item) => setlistItemStore.delete(item.id));
          annotations.forEach((annotation) => annotationStore.delete(annotation.id));
        });
      },
      { timeoutMs: Math.max(LOCAL_SAVE_TIMEOUT, ids.length * 1500 + 5000) },
    ),
  );

  // ② 软删页墓碑：逐页独立小事务写入，但只写元数据，不复制图片 blob。
  for (const { userId, pages } of softWrites) {
    for (const page of pages) {
      await enqueueLocalWrite("deleteScores:softPage", () =>
        runIdbTransaction(
          PAGE_STORE_NAME,
          "readwrite",
          (pageStore) => {
            pageStore.put(toDeletedPageTombstone(page, userId, deletedAt));
          },
          { timeoutMs: LOCAL_SAVE_TIMEOUT, timeoutMessage: "删除歌谱页面超时，请重试。" },
        ),
      );
    }
  }
}

function softDeleteScoresLocalAtomic(scores, deletedAt) {
  return deleteScoresLocalAtomic(
    (scores || []).map((score) => score.id),
    { scores, deletedAt, forceSoft: true },
  );
}

function hardDeleteScoresLocalAtomic(scoreIds) {
  return deleteScoresLocalAtomic(scoreIds, { forceHard: true });
}

// ===== 回收站（本地快照，不参与云端同步）=====

function getAllTrashEntries() {
  return readStoreAll(TRASH_STORE_NAME);
}

function getTrashEntry(id) {
  return readStoreRecord(TRASH_STORE_NAME, String(id));
}

function putTrashEntry(entry) {
  return putStoreRecord(TRASH_STORE_NAME, entry, LOCAL_SAVE_TIMEOUT, "回收站写入超时，请重试。");
}

function deleteTrashEntry(id) {
  return deleteStoreRecord(TRASH_STORE_NAME, String(id), "回收站删除超时，请重试。");
}

function clearTrashStore() {
  return clearStore(TRASH_STORE_NAME, "清空回收站超时，请重试。");
}

function cleanupTrashAnnotationResidues(entries) {
  const annotationIds = Array.from(
    new Set(
      (entries || [])
        .flatMap((entry) => entry.annotations || [])
        .map((annotation) => annotation?.id)
        .filter(Boolean)
        .map(String),
    ),
  );
  if (!annotationIds.length) {
    return Promise.resolve();
  }

  return enqueueLocalWrite("cleanupTrashAnnotationResidues", () =>
    runIdbTransaction(
      ANNOTATION_STORE_NAME,
      "readwrite",
      (annotationStore) => {
        annotationIds.forEach((annotationId) => annotationStore.delete(annotationId));
      },
      { timeoutMessage: "清理标注回收残留超时，请重试。" },
    ),
  );
}

// 删除前把歌谱（含图片 blob）快照存入回收站，便于后续恢复。
async function snapshotScoresToTrash(scores) {
  const targets = (scores || []).filter(Boolean);
  if (!targets.length) {
    return;
  }
  const ids = targets.map((score) => score.id);
  const [pageRecords, annotationRecords] = await Promise.all([
    readPagesForScoreIds(ids),
    readAnnotationsForScoreIds(ids),
  ]);
  const pagesByScore = new Map();
  pageRecords.forEach((page) => {
    const key = String(page.scoreId);
    const list = pagesByScore.get(key) || [];
    list.push(page);
    pagesByScore.set(key, list);
  });
  const annotationsByScore = new Map();
  annotationRecords.forEach((annotation) => {
    const key = String(annotation.scoreId);
    const list = annotationsByScore.get(key) || [];
    list.push(annotation);
    annotationsByScore.set(key, list);
  });
  const trashedAt = new Date().toISOString();
  for (const score of targets) {
    const folder = score.folderId ? state.folders.find((item) => item.id === score.folderId) : null;
    const pages = (pagesByScore.get(String(score.id)) || (score.pages || []))
      .slice()
      .sort((a, b) => a.pageIndex - b.pageIndex);
    const annotations = annotationsByScore.get(String(score.id)) || [];
    const entry = {
      id: String(score.id),
      trashedAt,
      name: score.name || "未命名歌谱",
      keySignature: score.keySignature || "",
      folderName: folder?.name || "",
      pageCount: pages.length,
      score: toScoreRecord(score),
      pages: pages.map((page) => ({ ...page })),
      annotations: annotations.map((annotation) => ({ ...annotation })),
    };
    try {
      await putTrashEntry(entry);
    } catch (error) {
      console.warn("写入回收站失败", error);
    }
  }
  // 回收站只增不减会持续占用本地存储、最终撑爆 IndexedDB。写入后裁剪到最多保留 N 条（按时间，保留最新）。
  await pruneTrashEntries();
}

// 删除前预估：回收站要再存一份这些歌谱的图片，若剩余存储空间不够则返回 false（跳过备份）。
async function hasRoomForTrashSnapshot(scores) {
  if (!navigator.storage?.estimate) {
    return true;
  }
  try {
    const totalSize = (scores || []).reduce((sum, score) => {
      const pages = score.pages && score.pages.length
        ? score.pages
        : state.scorePages.filter((page) => page.scoreId === score.id);
      return sum + getPagesTotalBlobSize(pages);
    }, 0);
    if (!totalSize) {
      return true;
    }
    const estimate = await navigator.storage.estimate();
    const remaining = (Number(estimate.quota) || 0) - (Number(estimate.usage) || 0);
    return !(remaining > 0 && remaining < totalSize * 1.5);
  } catch (error) {
    console.warn(error);
    return true;
  }
}

function getTrashSnapshotByteSize(scores) {
  return (scores || []).reduce((sum, score) => {
    const pages = score.pages && score.pages.length
      ? score.pages
      : state.scorePages.filter((page) => page.scoreId === score.id);
    return sum + getPagesTotalBlobSize(pages);
  }, 0);
}

function shouldAttemptTrashSnapshot(scores) {
  const totalSize = getTrashSnapshotByteSize(scores);
  return totalSize > 0 && totalSize <= TRASH_SNAPSHOT_MAX_BYTES;
}

// 回收站自动上限：只保留最新的若干条，删除更旧的，避免本地存储被无限占用。
const TRASH_MAX_ENTRIES = 30;
async function pruneTrashEntries() {
  try {
    const entries = await getAllTrashEntries();
    if (!Array.isArray(entries) || entries.length <= TRASH_MAX_ENTRIES) {
      return;
    }
    const sorted = entries
      .slice()
      .sort((a, b) => String(b.trashedAt || "").localeCompare(String(a.trashedAt || "")));
    const stale = sorted.slice(TRASH_MAX_ENTRIES);
    for (const entry of stale) {
      try {
        await deleteTrashEntry(entry.id);
      } catch (error) {
        console.warn("清理旧回收站记录失败", error);
      }
    }
  } catch (error) {
    console.warn(error);
  }
}

// 从回收站恢复：作为全新的本地歌谱重新写入（新 id），与云端旧墓碑解耦。
async function restoreScoreFromTrash(id) {
  const entry = await getTrashEntry(id);
  if (!entry) {
    return false;
  }
  const now = new Date().toISOString();
  const userId = state.session?.user?.id || null;
  const folderExists = entry.score?.folderId && state.folders.some((item) => item.id === entry.score.folderId);
  const newScore = {
    ...entry.score,
    id: createId(),
    userId,
    folderId: folderExists ? entry.score.folderId : null,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };
  const pageIdMap = new Map();
  const newPages = (entry.pages || []).map((page, index) => {
    const newPageId = createId();
    pageIdMap.set(String(page.id), newPageId);
    return {
      ...page,
      id: newPageId,
      scoreId: newScore.id,
      userId,
      pageIndex: Number.isInteger(page.pageIndex) ? page.pageIndex : index,
      storagePath: null,
      storageSyncedAt: null,
      storageUploadVersion: 0,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
      syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
    };
  });
  const newAnnotations = (entry.annotations || [])
    .map((annotation) => {
      const pageId = pageIdMap.get(String(annotation.pageId));
      if (!pageId) {
        return null;
      }
      return normalizeAnnotationRecord({
        ...annotation,
        id: createId(),
        scoreId: newScore.id,
        pageId,
        userId,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
        syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
      });
    })
    .filter(Boolean);

  const saved = await saveScoreLocalAtomic(newScore, newPages, { requireBlobs: false });
  for (const annotation of newAnnotations) {
    await saveAnnotationRecord(annotation);
    state.annotationRecords.set(annotation.pageId, annotation);
    if (!saved) {
      return false;
    }
    if (userId || state.session) {
      enqueueOutboxTask("UPSERT_ANNOTATION", {
        entityId: annotation.id,
        entityType: "annotation",
        dedupeKey: `annotation.upsert:${annotation.id}`,
        payload: { annotation },
      }).catch((error) => console.warn(error));
    }
  }
  insertSavedScoreInMemory(saved.score, saved.pages);
  await deleteTrashEntry(id);
  if (userId || state.session) {
    queueScoreCloudUpload(newScore.id);
    if (newAnnotations.length) {
      kickOutbox(0);
    }
  }
  return true;
}

// ===== 完整备份 / 导入（单个 JSON 文件，图片以 base64 内嵌）=====

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve({ data: comma >= 0 ? result.slice(comma + 1) : result, type: blob.type || "" });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(base64, type) {
  const binary = atob(base64 || "");
  const length = binary.length;
  const bytes = new Uint8Array(length);
  for (let index = 0; index < length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: type || "application/octet-stream" });
}

function triggerFileDownload(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function exportFullBackup() {
  const [scoreRecords, pageRecords, folderRecords, setlistRecords, setlistItemRecords, annotationRecords, assetRecords] = await Promise.all([
    getAllScores(),
    getAllScorePages(),
    getAllFolders(),
    getAllSetlists(),
    getAllSetlistItems(),
    getAllAnnotations(),
    getAllAssets(),
  ]);

  const activeScores = scoreRecords.filter((score) => !score.deletedAt);
  const scoreIdSet = new Set(activeScores.map((score) => String(score.id)));
  const activeFolders = folderRecords.filter((folder) => !folder.deletedAt);
  const activeSetlists = setlistRecords.filter((setlist) => !setlist.deletedAt);
  const setlistIdSet = new Set(activeSetlists.map((setlist) => String(setlist.id)));
  const activeItems = setlistItemRecords.filter(
    (item) => !item.deletedAt && setlistIdSet.has(String(item.setlistId)) && scoreIdSet.has(String(item.scoreId)),
  );
  const activePages = pageRecords.filter((page) => !page.deletedAt && scoreIdSet.has(String(page.scoreId)));
  const activePageIdSet = new Set(activePages.map((page) => String(page.id)));
  const activeAnnotations = annotationRecords.filter(
    (annotation) =>
      !annotation.deletedAt &&
      scoreIdSet.has(String(annotation.scoreId)) &&
      activePageIdSet.has(String(annotation.pageId)),
  );

  const assetById = new Map((assetRecords || []).map((asset) => [String(asset.id), asset]));
  const assetByPageId = new Map();
  (assetRecords || []).forEach((asset) => {
    if (asset.pageId && !asset.deletedAt && asset.kind === "page-image") {
      assetByPageId.set(String(asset.pageId), asset);
    }
  });

  const encodedPages = [];
  const encodedAssets = [];
  const exportedAssetIds = new Set();
  for (const page of activePages) {
    const pageMeta = normalizePageForStore(page);
    let asset = pageMeta.assetId ? assetById.get(String(pageMeta.assetId)) : assetByPageId.get(String(page.id));
    let assetId = pageMeta.assetId || asset?.id || "";
    let blob = asset?.blob instanceof Blob ? asset.blob : null;
    if (!blob && page.blob instanceof Blob && page.blob.size > 0) {
      assetId = assetId || createAssetId("backup-asset");
      blob = page.blob;
      asset = buildPageAssetRecord({ ...pageMeta, assetId }, blob, { assetId });
    }
    if (asset && !exportedAssetIds.has(String(asset.id))) {
      let blobData = null;
      let blobType = asset.mimeType || page.type || "";
      try {
        if (blob) {
          const encoded = await blobToBase64(blob);
          blobData = encoded.data;
          blobType = encoded.type || blobType;
        }
      } catch (error) {
        console.warn("图片资源编码失败，已跳过该资源数据。", error);
      }
      const { blob: ignoredBlob, ...assetRest } = asset;
      encodedAssets.push({ ...assetRest, id: asset.id, blobData, blobType });
      exportedAssetIds.add(String(asset.id));
    }
    encodedPages.push({ ...pageMeta, assetId });
  }

  const backup = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    folders: activeFolders.map(({ blob, ...rest }) => rest),
    scores: activeScores.map(({ blob, pages, ...rest }) => rest),
    pages: encodedPages,
    assets: encodedAssets,
    setlists: activeSetlists,
    setlistItems: activeItems,
    annotations: activeAnnotations,
  };

  const stamp = new Date().toISOString().slice(0, 10);
  triggerFileDownload(`我的谱夹备份-${stamp}.json`, new Blob([JSON.stringify(backup)], { type: "application/json" }));
  return {
    scores: activeScores.length,
    folders: activeFolders.length,
    setlists: activeSetlists.length,
    annotations: activeAnnotations.length,
  };
}

async function importFullBackup(file) {
  const text = await file.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error("备份文件解析失败，请确认选择了正确的备份文件。");
  }
  if (!data || data.format !== BACKUP_FORMAT || !Array.isArray(data.scores)) {
    throw new Error("这不是有效的“我的谱夹”备份文件。");
  }

  const userId = state.session?.user?.id || null;
  const now = new Date().toISOString();
  const syncStatus = userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL;

  // 文件夹按名称去重，已存在则复用。
  const folderByName = new Map(state.folders.map((folder) => [normalizeText(folder.name), folder.id]));
  const folderIdMap = new Map();
  for (const folder of data.folders || []) {
    const key = normalizeText(folder.name);
    if (folderByName.has(key)) {
      folderIdMap.set(String(folder.id), folderByName.get(key));
      continue;
    }
    const newId = createId();
    const { blob, ...rest } = folder;
    await putStoreRecord(FOLDER_STORE_NAME, {
      ...rest,
      id: newId,
      userId,
      deletedAt: null,
      createdAt: folder.createdAt || now,
      updatedAt: now,
      syncStatus,
    });
    folderIdMap.set(String(folder.id), newId);
    folderByName.set(key, newId);
  }

  const pagesByScore = new Map();
  (data.pages || []).forEach((page) => {
    const key = String(page.scoreId);
    const list = pagesByScore.get(key) || [];
    list.push(page);
    pagesByScore.set(key, list);
  });
  const backupAssetById = new Map((data.assets || []).map((asset) => [String(asset.id), asset]));
  const pageIdMap = new Map();

  // 歌谱按“所在文件夹 + 名称”去重：同一位置同名才跳过，不同文件夹允许同名。
  const existingScoreByScope = createScoreNameScopeMap();
  const scoreIdMap = new Map();
  let importedScores = 0;
  let skippedScores = 0;

  for (const score of data.scores) {
    if (score.deletedAt) {
      continue;
    }
    const folderId = score.folderId && folderIdMap.has(String(score.folderId)) ? folderIdMap.get(String(score.folderId)) : null;
    const nameKey = getScoreNameScopeKey(score.name || score.normalizedName, folderId);
    if (existingScoreByScope.has(nameKey)) {
      scoreIdMap.set(String(score.id), existingScoreByScope.get(nameKey));
      skippedScores += 1;
      continue;
    }

    const newScoreId = createId();
    const { blob, pages, ...scoreRest } = score;
    const newScore = {
      ...scoreRest,
      id: newScoreId,
      userId,
      folderId,
      deletedAt: null,
      createdAt: score.createdAt || now,
      updatedAt: now,
      syncStatus,
    };
    const sourcePages = (pagesByScore.get(String(score.id)) || []).slice().sort((a, b) => a.pageIndex - b.pageIndex);
    const newPages = sourcePages.map((page, index) => {
      const sourceAsset = page.assetId ? backupAssetById.get(String(page.assetId)) : null;
      const restoredBlob = sourceAsset?.blobData
        ? base64ToBlob(sourceAsset.blobData, sourceAsset.blobType || sourceAsset.mimeType || page.type)
        : page.blobData
          ? base64ToBlob(page.blobData, page.blobType || page.type)
          : null;
      const { blobData, blobType, blob: ignoredBlob, assetId: ignoredAssetId, thumbnailAssetId: ignoredThumbAssetId, ...pageRest } = page;
      const newPageId = createId();
      pageIdMap.set(String(page.id), newPageId);
      return {
        ...pageRest,
        id: newPageId,
        scoreId: newScoreId,
        userId,
        pageIndex: index,
        blob: restoredBlob,
        type: restoredBlob ? restoredBlob.type : page.type,
        size: restoredBlob ? restoredBlob.size : page.size,
        assetId: "",
        thumbnailAssetId: "",
        storagePath: restoredBlob ? null : page.storagePath || sourceAsset?.storagePath || null,
        storageSyncedAt: restoredBlob ? null : page.storageSyncedAt || sourceAsset?.storageSyncedAt || null,
        storageUploadVersion: restoredBlob ? 0 : Number(page.storageUploadVersion || sourceAsset?.storageUploadVersion) || 0,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
        syncStatus,
      };
    });

    try {
      await saveScoreLocalAtomic(newScore, newPages, { requireBlobs: false });
      scoreIdMap.set(String(score.id), newScoreId);
      existingScoreByScope.set(nameKey, newScoreId);
      importedScores += 1;
      if (userId || state.session) {
        queueScoreCloudUpload(newScoreId);
      }
    } catch (error) {
      console.warn(`导入《${score.name || "未命名"}》失败`, error);
    }
  }

  // 歌单（按名称+日期去重），歌单项按映射后的歌谱/歌单 id 重建。
  let importedSetlists = 0;
  const setlistIdMap = new Map();
  const existingSetlistKeys = new Set(state.setlists.map((setlist) => `${normalizeText(setlist.name)}|${setlist.date || ""}`));
  for (const setlist of data.setlists || []) {
    if (setlist.deletedAt) {
      continue;
    }
    const key = `${normalizeText(setlist.name)}|${setlist.date || ""}`;
    if (existingSetlistKeys.has(key)) {
      continue;
    }
    const newId = createId();
    await putStoreRecord(SETLIST_STORE_NAME, {
      ...setlist,
      id: newId,
      userId,
      deletedAt: null,
      createdAt: setlist.createdAt || now,
      updatedAt: now,
      syncStatus,
    });
    setlistIdMap.set(String(setlist.id), newId);
    existingSetlistKeys.add(key);
    importedSetlists += 1;
  }
  for (const item of data.setlistItems || []) {
    const newSetlistId = setlistIdMap.get(String(item.setlistId));
    const newScoreId = scoreIdMap.get(String(item.scoreId));
    if (!newSetlistId || !newScoreId) {
      continue;
    }
    await putStoreRecord(SETLIST_ITEM_STORE_NAME, {
      ...item,
      id: createId(),
      setlistId: newSetlistId,
      scoreId: newScoreId,
      userId,
      deletedAt: null,
      createdAt: item.createdAt || now,
      updatedAt: now,
      syncStatus,
    });
  }

  let importedAnnotations = 0;
  for (const annotation of data.annotations || []) {
    const newScoreId = scoreIdMap.get(String(annotation.scoreId));
    const newPageId = pageIdMap.get(String(annotation.pageId));
    if (!newScoreId || !newPageId || annotation.deletedAt) {
      continue;
    }
    const newAnnotation = normalizeAnnotationRecord({
      ...annotation,
      id: createId(),
      scoreId: newScoreId,
      pageId: newPageId,
      userId,
      deletedAt: null,
      createdAt: annotation.createdAt || now,
      updatedAt: now,
      syncStatus,
    });
    await saveAnnotationRecord(newAnnotation);
    importedAnnotations += 1;
    if (userId || state.session) {
      enqueueOutboxTask("UPSERT_ANNOTATION", {
        entityId: newAnnotation.id,
        entityType: "annotation",
        dedupeKey: `annotation.upsert:${newAnnotation.id}`,
        payload: { annotation: newAnnotation },
      }).catch((error) => console.warn(error));
    }
  }

  await loadScores();
  renderScores();
  renderSetlists();
  if (userId && state.cloudReady) {
    if (importedAnnotations) {
      kickOutbox(0);
    }
    queueSync();
  }
  return { importedScores, skippedScores, importedSetlists, importedAnnotations };
}

function cleanupSetlistItemsForDeletedScores(scoreIds) {
  const ids = Array.from(new Set((scoreIds || []).filter(Boolean).map(String)));
  if (!ids.length) {
    return Promise.resolve();
  }

  return enqueueLocalWrite("cleanupSetlistItemsForDeletedScores", () =>
    runIdbTransaction(
      SETLIST_ITEM_STORE_NAME,
      "readwrite",
      (itemStore, transaction) => {
        const scoreIndex = itemStore.index("scoreId");
        ids.forEach((scoreId) => {
          const request = scoreIndex.getAll(scoreId);
          request.onsuccess = () => {
            (request.result || []).forEach((item) => itemStore.delete(item.id));
          };
          request.onerror = () => {
            try {
              transaction.abort();
            } catch (error) {
              console.warn(error);
            }
          };
        });
      },
      { timeoutMessage: "清理歌单项目超时，请重试。" },
    ),
  );
}

function getAllScores() {
  return readStoreAll(STORE_NAME);
}

function getAllScorePages() {
  return readStoreAll(PAGE_STORE_NAME);
}

function getAllFolders() {
  return readStoreAll(FOLDER_STORE_NAME);
}

function getAllSetlists() {
  return readStoreAll(SETLIST_STORE_NAME);
}

function getAllSetlistItems() {
  return readStoreAll(SETLIST_ITEM_STORE_NAME);
}

function getAllAnnotations() {
  return readStoreAll(ANNOTATION_STORE_NAME);
}

function cloneAnnotationStroke(stroke) {
  return {
    ...(stroke || {}),
    points: Array.isArray(stroke?.points) ? stroke.points.map((point) => ({ ...point })) : [],
  };
}

function cloneAnnotationStrokes(strokes) {
  return Array.isArray(strokes) ? strokes.map(cloneAnnotationStroke) : [];
}

function normalizeAnnotationRecord(record) {
  const now = new Date().toISOString();
  return {
    ...record,
    id: String(record?.id || createId()),
    scoreId: String(record?.scoreId || ""),
    pageId: String(record?.pageId || ""),
    userId: record?.userId || null,
    baseWidth: Number(record?.baseWidth) || 0,
    baseHeight: Number(record?.baseHeight) || 0,
    strokes: cloneAnnotationStrokes(record?.strokes),
    createdAt: record?.createdAt || now,
    updatedAt: record?.updatedAt || record?.createdAt || now,
    syncStatus: record?.syncStatus || SYNC_STATUS_LOCAL,
    deletedAt: record?.deletedAt || null,
  };
}

function getAnnotationSaveVersion(pageId) {
  return state.annotationSaveVersions.get(String(pageId || "")) || 0;
}

function bumpAnnotationSaveVersion(pageId) {
  const id = String(pageId || "");
  if (!id) {
    return 0;
  }
  const nextVersion = getAnnotationSaveVersion(id) + 1;
  state.annotationSaveVersions.set(id, nextVersion);
  return nextVersion;
}

function getAnnotationRecordForPage(pageId, options = {}) {
  const id = String(pageId || "");
  if (!id) {
    return null;
  }
  const existing = state.annotationRecords.get(id);
  if (existing || !options.create) {
    return existing || null;
  }
  const page = state.currentViewerPages.find((item) => item.id === id) || state.scorePages.find((item) => item.id === id);
  if (!page) {
    return null;
  }
  const now = new Date().toISOString();
  const record = normalizeAnnotationRecord({
    id: createId(),
    scoreId: page.scoreId,
    pageId: id,
    userId: page.userId || state.session?.user?.id || null,
    baseWidth: 0,
    baseHeight: 0,
    strokes: [],
    createdAt: now,
    updatedAt: now,
    syncStatus: state.session?.user?.id ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  });
  state.annotationRecords.set(id, record);
  return record;
}

function loadAnnotationForPage(pageId) {
  return loadAnnotationsForPages([pageId]).then((records) => records.get(String(pageId)) || null);
}

async function loadAnnotationsForPages(pageIds) {
  const ids = Array.from(new Set((pageIds || []).filter(Boolean).map(String)));
  const result = new Map();
  if (!ids.length) {
    return result;
  }
  try {
    const transactionResult = await runIdbTransaction(
      ANNOTATION_STORE_NAME,
      "readonly",
      (store, transaction) => {
        const output = { rows: [] };
        const index = store.index("pageId");
        ids.forEach((pageId) => {
          const request = index.getAll(pageId);
          request.onsuccess = () => {
            (request.result || []).forEach((record) => output.rows.push(record));
          };
          request.onerror = () => {
            try {
              transaction.abort();
            } catch (error) {
              console.warn(error);
            }
          };
        });
        return output;
      },
      { timeoutMessage: "读取标注超时，请重试。" },
    );
    const latestByPage = new Map();
    const ownerMatches = createOwnerMatcher();
    (transactionResult.rows || []).map(normalizeAnnotationRecord).forEach((record) => {
      if (record.deletedAt || !ids.includes(String(record.pageId)) || !ownerMatches(record)) {
        return;
      }
      const previous = latestByPage.get(record.pageId);
      if (!previous || String(record.updatedAt).localeCompare(String(previous.updatedAt)) > 0) {
        latestByPage.set(record.pageId, record);
      }
    });
    latestByPage.forEach((record, pageId) => {
      const existing = state.annotationRecords.get(pageId);
      const existingIsNewer =
        existing &&
        !existing.deletedAt &&
        String(existing.updatedAt || "").localeCompare(String(record.updatedAt || "")) >= 0;
      const nextRecord = existingIsNewer ? existing : record;
      state.annotationRecords.set(pageId, nextRecord);
      result.set(pageId, nextRecord);
    });
  } catch (error) {
    console.warn("读取标注失败", error);
  }
  return result;
}

async function readAnnotationsForScoreIds(scoreIds) {
  const ids = Array.from(new Set((scoreIds || []).filter(Boolean).map(String)));
  if (!ids.length) {
    return [];
  }
  try {
    const result = await runIdbTransaction(
      ANNOTATION_STORE_NAME,
      "readonly",
      (store, transaction) => {
        const output = { rows: [] };
        const index = store.index("scoreId");
        ids.forEach((scoreId) => {
          const request = index.getAll(scoreId);
          request.onsuccess = () => {
            (request.result || []).forEach((record) => output.rows.push(record));
          };
          request.onerror = () => {
            try {
              transaction.abort();
            } catch (error) {
              console.warn(error);
            }
          };
        });
        return output;
      },
      { timeoutMessage: "读取标注超时，请重试。" },
    );
    return (result.rows || []).map(normalizeAnnotationRecord);
  } catch (error) {
    console.warn("读取标注失败", error);
    return [];
  }
}

async function markAnnotationsForDeletedPages(pageIds, userId, deletedAt = new Date().toISOString()) {
  const ids = Array.from(new Set((pageIds || []).filter(Boolean).map(String)));
  if (!ids.length) {
    return;
  }
  const records = Array.from((await loadAnnotationsForPages(ids)).values());
  if (!records.length) {
    return;
  }
  const keepTombstone = Boolean(userId || state.session?.user?.id);
  await enqueueLocalWrite("markAnnotationsForDeletedPages", () =>
    runIdbTransaction(
      ANNOTATION_STORE_NAME,
      "readwrite",
      (annotationStore) => {
        records.forEach((record) => {
          if (keepTombstone) {
            annotationStore.put({
              ...record,
              userId: record.userId || userId || state.session?.user?.id || null,
              deletedAt,
              updatedAt: deletedAt,
              syncStatus: SYNC_STATUS_PENDING,
            });
          } else {
            annotationStore.delete(record.id);
          }
        });
      },
      { timeoutMessage: "清理页面标注超时，请重试。" },
    ),
  );
  records.forEach((record) => state.annotationRecords.delete(record.pageId));
  if (keepTombstone) {
    queueDeleteSyncForAnnotations(records, deletedAt);
  }
}

function saveAnnotationRecord(record) {
  const normalized = normalizeAnnotationRecord(record);
  return putStoreRecord(ANNOTATION_STORE_NAME, normalized, LOCAL_SAVE_TIMEOUT, "标注保存超时，请重试。");
}

function saveAnnotationSnapshot(snapshot, pageId, version) {
  const normalized = normalizeAnnotationRecord(snapshot);
  const id = String(pageId || normalized.pageId || "");
  return enqueueLocalWrite(`put:${ANNOTATION_STORE_NAME}`, () => {
    if (id && getAnnotationSaveVersion(id) > version) {
      return Promise.resolve(false);
    }
    return runIdbTransaction(
      ANNOTATION_STORE_NAME,
      "readwrite",
      (store) => {
        store.put(normalized);
      },
      { timeoutMs: LOCAL_SAVE_TIMEOUT, timeoutMessage: "标注保存超时，请重试。" },
    ).then(() => true);
  });
}

async function saveAnnotationForPage(pageId) {
  const id = String(pageId || "");
  const record = getAnnotationRecordForPage(id);
  if (!record) {
    return;
  }
  const now = new Date().toISOString();
  const page = state.currentViewerPages.find((item) => item.id === id) || state.scorePages.find((item) => item.id === id);
  const userId = record.userId || page?.userId || state.session?.user?.id || null;
  record.userId = userId;
  record.updatedAt = now;
  record.syncStatus = userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL;
  const version = getAnnotationSaveVersion(id);
  const snapshot = normalizeAnnotationRecord({
    ...record,
    userId,
    updatedAt: now,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  });
  try {
    const saved = await saveAnnotationSnapshot(snapshot, id, version);
    if (!saved) {
      return false;
    }
    if (userId || state.session) {
      enqueueOutboxTask("UPSERT_ANNOTATION", {
        entityId: snapshot.id,
        entityType: "annotation",
        dedupeKey: `annotation.upsert:${snapshot.id}`,
        payload: { annotation: snapshot },
      }).catch((error) => console.warn(error));
    }
    return saved;
  } catch (error) {
    console.warn("标注保存失败", error);
    setStatus("标注暂未保存，请稍后重试。", true);
  }
}

function requestAnnotationImmediateFlush() {
  flushAnnotationSave().catch((error) => console.warn(error));
}

function scheduleAnnotationSave(pageId, options = {}) {
  if (!pageId) {
    return;
  }
  const id = String(pageId);
  bumpAnnotationSaveVersion(id);
  state.annotationPendingPageIds.add(id);
  window.clearTimeout(state.annotationSaveTimer);
  state.annotationSaveTimer = window.setTimeout(() => {
    flushAnnotationSave().catch((error) => console.warn(error));
  }, 500);

  if (options.immediate) {
    const throttleMs = Number(options.throttleMs) || 0;
    const now = Date.now();
    const last = state.annotationImmediateSaveTimes.get(id) || 0;
    if (!throttleMs || now - last >= throttleMs) {
      state.annotationImmediateSaveTimes.set(id, now);
      requestAnnotationImmediateFlush();
    }
  }
}

// 退到后台 / 关闭前调用：先把进行中的笔迹落到记录与待存队列，再 flush，尽量保证不丢笔迹。
function flushAnnotationsForExit() {
  try {
    if (state.annotationDraftStroke) {
      commitAnnotationDraft({ reason: "app-exit", force: true });
    }
  } catch (error) {
    console.warn(error);
  }
  flushAnnotationSave().catch((error) => console.warn(error));
}

async function flushAnnotationSave() {
  if (state.annotationFlushPromise) {
    return state.annotationFlushPromise;
  }
  state.annotationFlushPromise = drainAnnotationSaves().finally(() => {
    state.annotationFlushPromise = null;
    if (state.annotationPendingPageIds.size) {
      requestAnnotationImmediateFlush();
    }
  });
  return state.annotationFlushPromise;
}

async function drainAnnotationSaves() {
  window.clearTimeout(state.annotationSaveTimer);
  state.annotationSaveTimer = 0;
  while (state.annotationPendingPageIds.size) {
    const ids = Array.from(state.annotationPendingPageIds);
    state.annotationPendingPageIds.clear();
    for (const pageId of ids) {
      await saveAnnotationForPage(pageId);
    }
  }
}

function putStoreRecord(storeName, record, timeoutMs = LOCAL_SAVE_TIMEOUT, timeoutMessage = "本地数据库写入超时，请重新打开 App 后再试。", options = {}) {
  return enqueueLocalWrite(
    `put:${storeName}`,
    () =>
      runIdbTransaction(
        storeName,
        "readwrite",
        (store) => {
          store.put(record);
        },
        { timeoutMs, timeoutMessage },
      ),
    { priority: options.priority, timeoutMs },
  );
}

function putScore(score) {
  return putStoreRecord(STORE_NAME, toScoreRecord(score));
}

async function putScoreWithPages(score, pages, options = {}) {
  const preparedPages = pages.map((page, index) => ({
    ...page,
    scoreId: score.id,
    pageIndex: Number.isInteger(page.pageIndex) ? page.pageIndex : index,
  }));
  const requireBlobs = options.requireBlobs ?? preparedPages.every((page) => page.blob || !page.storagePath);
  await saveScoreLocalAtomic(score, preparedPages, { requireBlobs, onProgress: options.onProgress });
}

function putScorePage(page, options = {}) {
  return putStoreRecord(
    PAGE_STORE_NAME,
    normalizePageForStore(page),
    options.timeoutMs || LOCAL_SAVE_TIMEOUT,
    options.timeoutMessage || "页面写入超时，请重试。",
    options,
  );
}

function putScorePageChanges(score, activePages, deletedPages = []) {
  return enqueueLocalWrite("putScorePageChanges", () =>
    runIdbTransaction(
      [STORE_NAME, PAGE_STORE_NAME],
      "readwrite",
      ([scoreStore, pageStore]) => {
        scoreStore.put(toScoreRecord(score));
        [...activePages, ...deletedPages].forEach((page) => pageStore.put(normalizePageForStore(page)));
      },
      { timeoutMessage: "页面保存超时，请重试。" },
    ),
  );
}

function putFolder(folder) {
  return enqueueLocalWrite("putFolder", () =>
    runIdbTransaction(
      FOLDER_STORE_NAME,
      "readwrite",
      (folderStore) => {
        folderStore.put(folder);
      },
      { timeoutMessage: "文件夹保存超时，请重试。" },
    ),
  );
}

function putSetlistWithItems(setlist, items, deletedItems = []) {
  return enqueueLocalWrite("putSetlistWithItems", () =>
    runIdbTransaction(
      [SETLIST_STORE_NAME, SETLIST_ITEM_STORE_NAME],
      "readwrite",
      ([setlistStore, itemStore]) => {
        setlistStore.put(setlist);
        [...items, ...deletedItems].forEach((item) => itemStore.put(item));
      },
      { timeoutMessage: "歌单保存超时，请重试。" },
    ),
  );
}

// 先在只读事务中读出歌单项的 keys，再单独发起读写删除（不在 readwrite 的 getAllKeys 回调里删除，
// 该旧模式在 iOS Safari 上易让事务卡死）。
async function deleteSetlistRecord(setlistId) {
  const itemKeys = await readKeysByIndex(SETLIST_ITEM_STORE_NAME, "setlistId", setlistId);
  return enqueueLocalWrite("deleteSetlistRecord", () =>
    runIdbTransaction(
      [SETLIST_STORE_NAME, SETLIST_ITEM_STORE_NAME],
      "readwrite",
      ([setlistStore, itemStore]) => {
        setlistStore.delete(setlistId);
        itemKeys.forEach((key) => itemStore.delete(key));
      },
      { timeoutMessage: "删除歌单超时，请重试。" },
    ),
  );
}

async function deleteScoreRecord(id) {
  // 先 readonly 读页 keys，再单独 readwrite 删除（避免在写事务回调里 getAllKeys 删除卡死）。
  const pageKeys = await readKeysByIndex(PAGE_STORE_NAME, "scoreId", id);
  return enqueueLocalWrite("deleteScoreRecord", () =>
    runIdbTransaction(
      [STORE_NAME, PAGE_STORE_NAME],
      "readwrite",
      ([scoreStore, pageStore]) => {
        scoreStore.delete(id);
        pageKeys.forEach((key) => pageStore.delete(key));
      },
      { timeoutMessage: "删除歌谱超时，请重试。" },
    ),
  );
}

async function deleteFolderRecord(folderId, scoreIds) {
  const ids = (scoreIds || []).filter(Boolean).map(String);
  // 先 readonly 读出每个歌谱对应的页 keys，再单独 readwrite 删除，避免在写事务回调里 getAllKeys 删页卡死。
  const [pageKeyGroups, annotationKeyGroups] = await Promise.all([
    Promise.all(ids.map((scoreId) => readKeysByIndex(PAGE_STORE_NAME, "scoreId", scoreId))),
    Promise.all(ids.map((scoreId) => readKeysByIndex(ANNOTATION_STORE_NAME, "scoreId", scoreId))),
  ]);
  const pageKeys = pageKeyGroups.flat();
  const annotationKeys = annotationKeyGroups.flat();
  return enqueueLocalWrite("deleteFolderRecord", () =>
    runIdbTransaction(
      [FOLDER_STORE_NAME, STORE_NAME, PAGE_STORE_NAME, ANNOTATION_STORE_NAME],
      "readwrite",
      ([folderStore, scoreStore, pageStore, annotationStore]) => {
        folderStore.delete(folderId);
        ids.forEach((scoreId) => scoreStore.delete(scoreId));
        pageKeys.forEach((key) => pageStore.delete(key));
        annotationKeys.forEach((key) => annotationStore.delete(key));
      },
      {
        timeoutMs: Math.max(IDB_TXN_TIMEOUT, ids.length * 3000 + 5000),
        timeoutMessage: "删除文件夹超时，请重试。",
      },
    ),
  );
}

async function markScoreDeletedRecord(score, deletedAt) {
  const userId = score.userId || state.session?.user?.id || null;
  const pages = score.pages || state.scorePages.filter((page) => page.scoreId === score.id);
  const annotations = await readAnnotationsForScoreIds([score.id]);
  return enqueueLocalWrite("markScoreDeletedRecord", () =>
    runIdbTransaction(
      [STORE_NAME, PAGE_STORE_NAME, ANNOTATION_STORE_NAME],
      "readwrite",
      ([scoreStore, pageStore, annotationStore]) => {
        scoreStore.put({
          ...toScoreRecord(score),
          userId,
          deletedAt,
          updatedAt: deletedAt,
          syncStatus: SYNC_STATUS_PENDING,
        });
        pages.forEach((page) => {
          pageStore.put(normalizePageForStore({
            ...page,
            userId: page.userId || userId,
            deletedAt,
            updatedAt: deletedAt,
            syncStatus: SYNC_STATUS_PENDING,
          }));
        });
        annotations.forEach((annotation) => {
          annotationStore.put({
            ...annotation,
            userId: annotation.userId || userId,
            deletedAt,
            updatedAt: deletedAt,
            syncStatus: SYNC_STATUS_PENDING,
          });
        });
      },
      { timeoutMessage: "删除歌谱超时，请重试。" },
    ),
  );
}

async function markFolderDeletedRecord(folder, folderScores, deletedAt) {
  const userId = folder.userId || state.session?.user?.id || null;
  const scoreIds = (folderScores || []).map((score) => score.id);
  const annotationRecords = await readAnnotationsForScoreIds(scoreIds);
  const annotationsByScore = new Map();
  annotationRecords.forEach((annotation) => {
    const key = String(annotation.scoreId);
    const list = annotationsByScore.get(key) || [];
    list.push(annotation);
    annotationsByScore.set(key, list);
  });
  return enqueueLocalWrite("markFolderDeletedRecord", () =>
    runIdbTransaction(
      [FOLDER_STORE_NAME, STORE_NAME, PAGE_STORE_NAME, ANNOTATION_STORE_NAME],
      "readwrite",
      ([folderStore, scoreStore, pageStore, annotationStore]) => {
        folderStore.put({
          ...folder,
          userId,
          deletedAt,
          updatedAt: deletedAt,
          syncStatus: SYNC_STATUS_PENDING,
        });
        folderScores.forEach((score) => {
          const scoreUserId = score.userId || userId;
          scoreStore.put({
            ...toScoreRecord(score),
            userId: scoreUserId,
            deletedAt,
            updatedAt: deletedAt,
            syncStatus: SYNC_STATUS_PENDING,
          });
          (score.pages || []).forEach((page) => {
            pageStore.put(normalizePageForStore({
              ...page,
              userId: page.userId || scoreUserId,
              deletedAt,
              updatedAt: deletedAt,
              syncStatus: SYNC_STATUS_PENDING,
            }));
          });
          (annotationsByScore.get(String(score.id)) || []).forEach((annotation) => {
            annotationStore.put({
              ...annotation,
              userId: annotation.userId || scoreUserId,
              deletedAt,
              updatedAt: deletedAt,
              syncStatus: SYNC_STATUS_PENDING,
            });
          });
        });
      },
      {
        timeoutMs: Math.max(IDB_TXN_TIMEOUT, (folderScores?.length || 0) * 3000 + 5000),
        timeoutMessage: "删除文件夹超时，请重试。",
      },
    ),
  );
}

function shouldKeepDeleteTombstone(record) {
  // 已登录时一律保留删除墓碑：本地添加的歌谱可能 userId 为空，但其实已上传到云端。
  // 若直接硬删本地记录而不留墓碑，删除护栏拦不住它，下次同步会把云端那份又拉回来，
  // 表现为“删不掉”。保留墓碑即可同步删除云端，并在本地挡住回拉。
  return Boolean(record?.userId || state.session?.user?.id);
}

async function addPendingFiles(fileList) {
  const files = Array.from(fileList || []);
  const imageFiles = files.filter(isImageFile);

  if (!imageFiles.length) {
    setStatus("请选择图片文件。", true);
    return;
  }

  setStatus(`正在压缩 1 / ${imageFiles.length} 张图片...`);

  state.pendingFilesProcessing = true;
  updateSaveState();

  for (const [index, file] of imageFiles.entries()) {
    await nextFrame();
    try {
      const compressed = await withTimeout(
        compressImageFile(file),
        IMAGE_COMPRESSION_TIMEOUT,
        `《${file.name}》压缩超时，已使用原图。`,
      );
      state.pendingPages.push({
        id: createId(),
        name: file.name,
        originalSize: file.size,
        type: compressed.type || file.type || "image/jpeg",
        size: compressed.size,
        blob: compressed,
      });
    } catch (error) {
      console.warn(error);
      state.pendingPages.push({
        id: createId(),
        name: file.name,
        originalSize: file.size,
        type: file.type || "image/jpeg",
        size: file.size,
        blob: file,
      });
    }

    renderPending();
    updateSaveState();
    await nextFrame();
    if (index < imageFiles.length - 1) {
      setStatus(`正在压缩 ${index + 2} / ${imageFiles.length} 张图片...`);
    }
  }

  state.pendingFilesProcessing = false;

  if (imageFiles.length !== files.length) {
    setStatus(`已压缩 ${imageFiles.length} 张图片，并跳过非图片文件。`, true);
  } else {
    setStatus(`已压缩并选择 ${state.pendingPages.length} 张图片。`);
  }

  renderPending();
  updateSaveState();
}

function isImageFile(file) {
  if (!file) {
    return false;
  }

  const type = String(file.type || "").toLowerCase();
  if (type.startsWith("image/")) {
    return true;
  }

  return /\.(jpe?g|png|webp|gif|heic|heif|bmp|tiff?)$/i.test(String(file.name || ""));
}

async function compressImageFile(file) {
  let source = null;

  try {
    source = await loadImageSource(file);
    const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });

    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(source.image, 0, 0, width, height);
    source.close?.();
    source = null;

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
  } finally {
    source?.close?.();
  }

  return file;
}

async function loadImageSource(file) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close?.(),
      };
    } catch (error) {
      console.warn("createImageBitmap failed, trying image element.", error);
    }
  }

  const { image, url } = await loadImageElement(file);
  return {
    image,
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
    close: () => URL.revokeObjectURL(url),
  };
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve({ image, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("图片读取失败。"));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function createCompressedFile(blob, originalName, extension) {
  const baseName = String(originalName || "score-page").replace(/\.[^.]+$/, "") || "score-page";
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

  if (!ensureAppReady()) {
    return;
  }

  await withOperationLock("saveScore", async () => {
    const name = elements.scoreName.value.trim();
    if (!name || !state.pendingPages.length) {
      updateSaveState();
      return;
    }
    const folderId = elements.scoreFolder ? elements.scoreFolder.value || null : state.currentFolderId || null;
    if (hasDuplicateScoreName(name, folderId)) {
      setStatus("已存在同名歌谱", true);
      elements.scoreName.focus();
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
      folderId,
      tags: [],
      keySignature: elements.scoreKey?.value.trim() || "",
      usage: "",
      notes: elements.scoreNotes?.value.trim() || "",
      favorite: false,
      lastOpenedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
    };

    let pages = [];
    let totalBlobSize = 0;

    try {
      pages = state.pendingPages.map((page, index) =>
        normalizePageBlob({
          id: page.id || createId(),
          scoreId: score.id,
          userId,
          pageIndex: index,
          name: page.name || `第 ${index + 1} 页`,
          type: page.type || page.blob?.type || "image/jpeg",
          size: page.size || page.blob?.size || 0,
          blob: page.blob,
          storagePath: null,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
          syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
        }),
      );
      totalBlobSize = getPagesTotalBlobSize(pages);
      if (!pages.length) {
        throw createNamedError("DataCloneError", "图片处理失败，请重新选择图片。");
      }
      await assertStorageSpaceAvailable(totalBlobSize);
    } catch (error) {
      logStorageOperationError(error, "保存", {
        scoreIds: [score.id],
        pagesLength: pages.length || state.pendingPages.length,
        totalBlobSize,
      });
      setStatus(getStorageErrorMessage(error, "保存"), true);
      updateSaveState();
      return;
    }

    elements.saveButton.disabled = true;
    try {
      await runUserCommand(
        "score.create",
        async ({ commandId }) => {
          const saved = await saveScoreLocalAtomic(score, pages, {
            onProgress: (current, total) => {
              if (total > 1) {
                setStatus(`正在保存到本机（第 ${current} / ${total} 页）...`);
              }
            },
          });
          await recordLocalOperation({
            id: commandId,
            type: "score.create",
            entityType: "score",
            entityId: score.id,
            payload: {
              scoreId: score.id,
              name,
              folderId,
              pageCount: pages.length,
            },
          });
          insertSavedScoreInMemory(saved.score, saved.pages);
          resetForm(false);
          elements.searchInput.value = "";
          closeAddScreen();

          let rendered = true;
          try {
            renderScores();
          } catch (renderError) {
            rendered = false;
            console.error(renderError);
            setStatus("数据已保存，但页面刷新失败，请手动刷新。", true);
          }

          if (userId) {
            if (rendered) {
              setStatus(`已保存《${name}》到本机，正在后台同步。`);
            }
            queueScoreCloudUpload(score.id);
          } else if (rendered) {
            setStatus(`已保存《${name}》。`);
          }
        },
        {
          label: totalBlobSize > 80 * 1024 * 1024 ? "图片较大，正在保存到本机..." : "正在保存到本机...",
          slowLabel: "本地存储较忙，正在优先保存您的歌谱...",
          failMessage: "保存歌谱失败，请稍后重试。",
          timeoutMs: Math.max(LOCAL_SAVE_TIMEOUT, pages.length * PAGE_SAVE_TIMEOUT + 10000),
        }
      );
    } catch (error) {
      logStorageOperationError(error, "保存", {
        scoreIds: [score.id],
        pagesLength: pages.length,
        totalBlobSize,
      });
      // 保存超时/中断时连接可能已卡死，重连数据库，保证再次保存能成功。
      await recoverDatabaseIfWedged(error);
      setStatus(getStorageErrorMessage(error, "保存"), true);
      showRecoveryDialogIfDbWedged(error);
    } finally {
      updateSaveState();
    }
  }, { timeoutMessage: "保存耗时过长，已超时，请重试。" }).catch((error) => {
    setStatus(error.message || getStorageErrorMessage(error, "保存"), true);
    updateSaveState();
  });
}

function insertSavedScoreInMemory(score, pages) {
  const normalizedScore = normalizeLocalScoreRecord(score);
  const normalizedPages = pages.map(normalizeLocalPageRecord).sort((a, b) => a.pageIndex - b.pageIndex);
  const existingScoreIds = new Set(state.scores.map((item) => item.id));

  if (!existingScoreIds.has(normalizedScore.id)) {
    state.scores.unshift({
      ...normalizedScore,
      pages: normalizedPages,
    });
  } else {
    state.scores = state.scores.map((item) =>
      item.id === normalizedScore.id
        ? {
          ...item,
          ...normalizedScore,
          pages: normalizedPages,
        }
        : item,
    );
  }

  state.scorePages = [
    ...state.scorePages.filter((page) => page.scoreId !== normalizedScore.id),
    ...normalizedPages,
  ];
  state.scores.sort((a, b) => getScoreTime(b.createdAt) - getScoreTime(a.createdAt) || getScoreTime(b.updatedAt) - getScoreTime(a.updatedAt));
}

async function saveScoreEdit(event) {
  event.preventDefault();
  const score = state.scores.find((item) => item.id === state.scoreEditId);
  if (!score) {
    closeScoreEditDialog();
    return;
  }

  const isMoveMode = elements.scoreEditDialog.classList.contains("is-move-mode");
  const name = elements.scoreEditName.value.trim();
  if (!name) {
    setScoreEditStatus("请输入歌谱名。", true);
    elements.scoreEditName.focus();
    return;
  }
  const selectedFolderId = elements.scoreEditFolder.value || null;
  if (hasDuplicateScoreName(name, selectedFolderId, score.id)) {
    setScoreEditStatus("已存在同名歌谱。", true);
    elements.scoreEditName.focus();
    return;
  }

  const now = new Date().toISOString();
  const userId = score.userId || state.session?.user?.id || null;
  const updatedScore = {
    ...toScoreRecord(score),
    userId,
    name,
    normalizedName: normalizeText(name),
    folderId: selectedFolderId,
    keySignature: elements.scoreEditKey.value.trim(),
    notes: elements.scoreEditNotes.value.trim(),
    updatedAt: now,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };

  elements.saveScoreEditButton.disabled = true;
  setScoreEditStatus(isMoveMode ? "正在移动..." : "正在保存...");

  try {
    await runUserCommand(
      isMoveMode ? "score.move" : "score.updateMeta",
      async ({ commandId }) => {
        // 本地优先：本地写成功即给用户成功反馈，云端仅入 outbox 后台处理。
        await putScore(updatedScore);
        await recordLocalOperation({
          id: commandId,
          type: isMoveMode ? "score.move" : "score.updateMeta",
          entityType: "score",
          entityId: updatedScore.id,
          payload: {
            scoreId: updatedScore.id,
            name: updatedScore.name,
            folderId: selectedFolderId,
            keySignature: updatedScore.keySignature || "",
          },
        });
        closeScoreEditDialog();
        await loadScores();
        setStatus(isMoveMode ? `《${updatedScore.name}》已移动。` : `《${updatedScore.name}》信息已保存。`);
        // 只要存在 userId/session 就入队 outbox；cloudReady 只决定是否立刻 kick（见 queueScoreCloudUpload / kickOutbox）。
        if (userId || state.session) {
          queueScoreCloudUpload(updatedScore.id);
        }
      },
      {
        label: isMoveMode ? "正在移动..." : "正在保存...",
        slowLabel: "本地存储较忙，正在优先保存歌谱信息...",
        failMessage: "保存歌谱信息失败，请稍后重试。",
      },
    );
  } catch (error) {
    console.error(error);
    setScoreEditStatus(getErrorMessage(error) || "保存失败，请稍后再试。", true);
  } finally {
    elements.saveScoreEditButton.disabled = false;
  }
}

function openPageManagerDialog(scoreId) {
  const score = state.scores.find((item) => item.id === scoreId);
  if (!score) {
    return;
  }

  state.pageManagerScoreId = scoreId;
  state.pageManagerReplacePageId = "";
  state.pageManagerPagesDraft = createPageManagerDraft(score);
  state.pageManagerBusy = false;
  elements.pageManagerTitle.textContent = `管理《${score.name}》页面`;
  setPageManagerStatus("可调整页面顺序、替换图片或追加新页面。");
  renderPageManager();

  if (typeof elements.pageManagerDialog.showModal === "function") {
    elements.pageManagerDialog.showModal();
  } else {
    elements.pageManagerDialog.setAttribute("open", "");
  }

  refreshIcons();
}

function closePageManagerDialog() {
  state.pageManagerScoreId = "";
  state.pageManagerReplacePageId = "";
  state.pageManagerPagesDraft = [];
  state.pageManagerBusy = false;
  elements.appendPageInput.value = "";
  elements.replacePageInput.value = "";
  if (elements.pageManagerDialog.open) {
    elements.pageManagerDialog.close();
  } else {
    elements.pageManagerDialog.removeAttribute("open");
  }
}

function getPageManagerScore() {
  return state.scores.find((score) => score.id === state.pageManagerScoreId) || null;
}

function clonePageForManager(page) {
  return {
    ...page,
  };
}

function createPageManagerDraft(score) {
  return [...(score?.pages || [])]
    .sort((a, b) => a.pageIndex - b.pageIndex)
    .map(clonePageForManager);
}

function getPageManagerPages() {
  const score = getPageManagerScore();
  const sourcePages = state.pageManagerPagesDraft.length ? state.pageManagerPagesDraft : score?.pages || [];
  const latestPageById = new Map(state.scorePages.map((page) => [page.id, page]));

  return sourcePages
    .map((page) => {
      const latestPage = latestPageById.get(page.id);
      if (!latestPage) {
        return clonePageForManager(page);
      }

      return {
        ...latestPage,
        ...page,
        assetId: page.assetId || latestPage.assetId || "",
        thumbnailAssetId: page.thumbnailAssetId || latestPage.thumbnailAssetId || "",
        storagePath: Object.prototype.hasOwnProperty.call(page, "storagePath") ? page.storagePath : latestPage.storagePath,
        storageSyncedAt: Object.prototype.hasOwnProperty.call(page, "storageSyncedAt")
          ? page.storageSyncedAt
          : latestPage.storageSyncedAt,
        storageUploadVersion: Object.prototype.hasOwnProperty.call(page, "storageUploadVersion")
          ? page.storageUploadVersion
          : latestPage.storageUploadVersion,
      };
    })
    .sort((a, b) => a.pageIndex - b.pageIndex);
}

function renderPageManager() {
  const score = getPageManagerScore();
  const pages = getPageManagerPages();
  elements.pageManagerList.replaceChildren();

  if (!score) {
    elements.pageManagerList.append(createEmptyState("没有找到歌谱", "请关闭后重新打开。"));
    refreshIcons();
    return;
  }

  if (!pages.length) {
    elements.pageManagerList.append(createEmptyState("还没有页面", "可以追加新页面。"));
    refreshIcons();
    return;
  }

  pages.forEach((page, index) => {
    const row = document.createElement("article");
    row.className = "page-manager-row";
    row.dataset.pageId = page.id;

    const thumb = document.createElement("div");
    thumb.className = "page-manager-thumb";
    const image = document.createElement("img");
    image.draggable = false;
    image.alt = `《${score.name}》第 ${index + 1} 页`;
    bindScorePageImage(image, page);
    thumb.append(image);

    const body = document.createElement("div");
    body.className = "page-manager-body";
    const title = document.createElement("strong");
    title.textContent = `第 ${index + 1} 页`;
    const meta = document.createElement("span");
    meta.textContent = page.name || "歌谱图片";
    body.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "page-manager-actions";
    actions.append(
      createPageManagerButton("arrow-up", "上移", page.id, "up", index === 0),
      createPageManagerButton("arrow-down", "下移", page.id, "down", index === pages.length - 1),
      createPageManagerButton("image-up", "替换", page.id, "replace", false),
      createPageManagerButton("star", "设封面", page.id, "cover", index === 0),
      createPageManagerButton("trash-2", "删除", page.id, "delete", pages.length <= 1, true),
    );

    row.append(thumb, body, actions);
    elements.pageManagerList.append(row);
  });

  refreshIcons();
}

function createPageManagerButton(iconName, label, pageId, action, disabled = false, danger = false) {
  const button = document.createElement("button");
  button.className = danger ? "page-manager-icon-button is-danger" : "page-manager-icon-button";
  button.type = "button";
  button.title = label;
  button.setAttribute("aria-label", label);
  button.dataset.pageId = pageId;
  button.dataset.pageAction = action;
  button.disabled = disabled;
  button.addEventListener("click", handlePageManagerAction);
  button.append(createIcon(iconName));
  return button;
}

function setPageManagerStatus(message, isError = false) {
  elements.pageManagerState.textContent = message || "";
  elements.pageManagerState.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function handlePagePickerCancel(event) {
  event?.stopPropagation?.();
  state.pageManagerReplacePageId = "";
  if (elements.appendPageInput) {
    elements.appendPageInput.value = "";
  }
  if (elements.replacePageInput) {
    elements.replacePageInput.value = "";
  }
  if (state.pageManagerScoreId) {
    setPageManagerStatus("已取消选择图片。");
  }
}

async function handlePageManagerAction(event) {
  if (event.__pageManagerHandled) {
    return;
  }
  event.__pageManagerHandled = true;
  event.preventDefault?.();
  event.stopPropagation?.();

  const target = event.currentTarget?.matches?.("button[data-page-action]")
    ? event.currentTarget
    : event.target instanceof Element
      ? event.target.closest("button[data-page-action]")
      : null;
  const button = target;
  if (!button) {
    return;
  }
  if (button.disabled || state.pageManagerBusy) {
    return;
  }

  const pageId = button.dataset.pageId;
  const action = button.dataset.pageAction;
  const pages = getPageManagerPages();
  const index = pages.findIndex((page) => page.id === pageId);
  if (index < 0) {
    return;
  }

  if (action === "replace") {
    state.pageManagerReplacePageId = pageId;
    setPageManagerStatus(`请选择第 ${index + 1} 页的新图片。`);
    openFilePicker(elements.replacePageInput);
    return;
  }

  state.pageManagerBusy = true;
  try {
    if (action === "up" && index > 0) {
      setPageManagerStatus("正在上移页面...");
      [pages[index - 1], pages[index]] = [pages[index], pages[index - 1]];
      await persistManagedPages(pages, [], "页面已上移。");
    } else if (action === "down" && index < pages.length - 1) {
      setPageManagerStatus("正在下移页面...");
      [pages[index + 1], pages[index]] = [pages[index], pages[index + 1]];
      await persistManagedPages(pages, [], "页面已下移。");
    } else if (action === "cover" && index > 0) {
      setPageManagerStatus("正在设置封面...");
      const [coverPage] = pages.splice(index, 1);
      pages.unshift(coverPage);
      await persistManagedPages(pages, [], "已设为封面。");
    } else if (action === "delete") {
      await deleteManagedPage(pages[index]);
    }
  } catch (error) {
    console.error(error);
    setPageManagerStatus(error.message || "页面操作失败，请稍后再试。", true);
  } finally {
    state.pageManagerBusy = false;
  }
}

async function persistManagedPages(activePages, deletedPages = [], message = "页面已更新。") {
  const score = getPageManagerScore();
  if (!score) {
    throw new Error("没有找到歌谱。");
  }

  const now = new Date().toISOString();
  const userId = score.userId || state.session?.user?.id || null;
  const previousPageById = new Map(state.scorePages.map((page) => [page.id, page]));
  const preparedActivePages = [];
  for (const [index, page] of activePages.entries()) {
    let preparedPage = {
      ...page,
      userId: page.userId || userId,
      pageIndex: index,
      deletedAt: null,
    };
    const blob = page.blob instanceof Blob && page.blob.size > 0 ? page.blob : null;
    if (blob) {
      const assetId = page.assetId || createAssetId("asset");
      await putAsset(buildPageAssetRecord({ ...preparedPage, assetId }, blob, { assetId }), {
        timeoutMs: getBlobWriteTimeout(blob.size),
      });
      preparedPage = {
        ...preparedPage,
        assetId,
        type: blob.type || page.type || "image/jpeg",
        size: blob.size,
        storagePath: null,
        storageSyncedAt: null,
        storageUploadVersion: 0,
      };
      cachePageObjectUrl(preparedPage, blob);
    }
    preparedActivePages.push(preparedPage);
  }
  const normalizedPages = preparedActivePages.map((page) => {
    const previousPage = previousPageById.get(page.id);
    const changed = managedPageChanged(page, previousPage);

    return {
      ...normalizePageForStore(page),
      updatedAt: changed ? now : page.updatedAt || previousPage?.updatedAt || now,
      syncStatus: changed && userId ? SYNC_STATUS_PENDING : page.syncStatus || previousPage?.syncStatus || SYNC_STATUS_LOCAL,
    };
  });
  const normalizedDeletedPages = deletedPages.map((page) =>
    normalizePageForStore({
      ...page,
      userId: page.userId || userId,
      deletedAt: now,
      updatedAt: now,
      syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
    }),
  );
  const updatedScore = {
    ...toScoreRecord(score),
    userId,
    updatedAt: now,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };
  // 重算封面：首页变化（替换/排序/删除导致）才重建缩略图，仅改非首页则复用旧封面。
  const coverFields = await buildScoreCoverFields(updatedScore, normalizedPages);
  Object.assign(updatedScore, coverFields);
  // 封面确实变化（首页换了）时，清掉粘性缓存，让列表重新显示新封面；否则保持不动、不闪。
  if ((coverFields.coverThumbUpdatedAt || null) !== (score.coverThumbUpdatedAt || null) || (coverFields.coverPageId || null) !== (score.coverPageId || null)) {
    invalidateScoreCover(score.id);
  }
  const pagesToSave = normalizedPages.filter((page) => managedPageChanged(page, previousPageById.get(page.id)));

  normalizedDeletedPages.forEach((page) => revokeScoreUrlForPage(page.id));
  state.pageManagerPagesDraft = normalizedPages.map(clonePageForManager);
  applyManagedPageState(updatedScore, normalizedPages, normalizedDeletedPages);
  renderPageManager();
  renderScores();
  setPageManagerStatus("正在保存页面调整...");

  await queueManagedPageSave(updatedScore, pagesToSave, normalizedDeletedPages, userId, state.pageManagerScoreId);
  setPageManagerStatus(message);
}

function managedPageChanged(page, previousPage) {
  if (!previousPage) {
    return true;
  }

  return (
    page.pageIndex !== previousPage.pageIndex ||
    page.name !== previousPage.name ||
    page.type !== previousPage.type ||
    page.size !== previousPage.size ||
    page.width !== previousPage.width ||
    page.height !== previousPage.height ||
    (page.assetId || "") !== (previousPage.assetId || "") ||
    (page.thumbnailAssetId || "") !== (previousPage.thumbnailAssetId || "") ||
    page.storagePath !== previousPage.storagePath ||
    page.storageSyncedAt !== previousPage.storageSyncedAt ||
    page.storageUploadVersion !== previousPage.storageUploadVersion ||
    page.deletedAt !== previousPage.deletedAt
  );
}

function applyManagedPageState(updatedScore, activePages, deletedPages = []) {
  const scoreId = updatedScore.id;
  const activeIds = new Set(activePages.map((page) => page.id));
  const deletedIds = new Set(deletedPages.map((page) => page.id));

  state.scorePages = [
    ...state.scorePages.filter((page) => page.scoreId !== scoreId),
    ...activePages,
  ].filter((page) => !deletedIds.has(page.id));

  state.scores = state.scores.map((score) => {
    if (score.id !== scoreId) {
      return score;
    }

    return {
      ...score,
      ...updatedScore,
      pages: activePages
        .filter((page) => activeIds.has(page.id))
        .sort((a, b) => a.pageIndex - b.pageIndex),
    };
  });
  state.scores.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function queueManagedPageSave(updatedScore, pagesToSave, deletedPages, userId, scoreId) {
  state.pageManagerSaveChain = state.pageManagerSaveChain
    .catch(() => {})
    .then(async () => {
      await runUserCommand(
        "page.batchUpdate",
        async ({ commandId }) => {
        await putScorePageChanges(updatedScore, pagesToSave, deletedPages);
        if (deletedPages.length) {
          await markAnnotationsForDeletedPages(
            deletedPages.map((page) => page.id),
            userId,
            deletedPages[0]?.deletedAt || new Date().toISOString(),
          );
        }
          await recordLocalOperation({
            id: commandId,
            type: "page.batchUpdate",
            entityType: "score",
            entityId: scoreId,
            payload: {
              scoreId,
              activePageIds: pagesToSave.map((page) => page.id),
              deletedPageIds: deletedPages.map((page) => page.id),
              pageOrder: (updatedScore.pages || []).map((page) => page.id),
            },
          });
          // 页面管理保存：只要有 userId/session 就入队 outbox（不因 cloudReady=false 跳过）。
          if (userId || state.session) {
            queueScoreCloudUpload(scoreId);
          }
        },
        {
          label: "正在保存页面调整...",
          slowLabel: "本地存储较忙，正在优先保存页面调整...",
          failMessage: "保存页面调整失败，请重试。",
          timeoutMs: Math.max(LOCAL_SAVE_TIMEOUT, (pagesToSave.length + deletedPages.length) * 8000 + 10000),
        },
      );
    });

  state.pageManagerSaveChain.catch((error) => {
    console.error(error);
    if (state.pageManagerScoreId === scoreId) {
      setPageManagerStatus(error.message || "页面已显示更新，但保存失败，请刷新后重试。", true);
    }
  });
  return state.pageManagerSaveChain;
}

function pageBlobNeedsCloudUpload(page, pageDeleted = false) {
  if (pageDeleted || !page) {
    return false;
  }

  return !page.storagePath || !page.storageSyncedAt || Number(page.storageUploadVersion) < STORAGE_UPLOAD_VERSION;
}

async function deleteManagedPage(page) {
  const pages = getPageManagerPages();
  if (pages.length <= 1) {
    setPageManagerStatus("至少需要保留一页。", true);
    return;
  }

  const confirmed = await requestDeleteConfirmation({
    title: "删除这一页？",
    message: `确定删除第 ${page.pageIndex + 1} 页吗？删除后会同步到云端。`,
  });
  if (!confirmed) {
    return;
  }

  await persistManagedPages(
    pages.filter((item) => item.id !== page.id),
    [page],
    "页面已删除。",
  );
}

async function appendManagedPages(fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
  elements.appendPageInput.value = "";
  if (!files.length) {
    setPageManagerStatus("请选择图片文件。", true);
    return;
  }

  const score = getPageManagerScore();
  if (!score) {
    return;
  }
  if (state.pageManagerBusy) {
    return;
  }

  try {
    state.pageManagerBusy = true;
    setPageManagerStatus(`正在追加 1 / ${files.length} 页...`);
    const newPages = [];
    for (const [index, file] of files.entries()) {
      const compressed = await withTimeout(
        compressImageFile(file),
        IMAGE_COMPRESSION_TIMEOUT,
        `《${file.name}》压缩超时，已使用原图。`,
      ).catch((error) => {
        console.warn(error);
        return file;
      });
      newPages.push({
        id: createId(),
        scoreId: score.id,
        userId: score.userId || state.session?.user?.id || null,
        pageIndex: 0,
        name: file.name,
        type: compressed.type || file.type || "image/jpeg",
        size: compressed.size,
        blob: compressed,
        storagePath: null,
        storageSyncedAt: null,
        storageUploadVersion: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        syncStatus: state.session?.user?.id ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
      });
      if (index < files.length - 1) {
        setPageManagerStatus(`正在追加 ${index + 2} / ${files.length} 页...`);
      }
    }
    await persistManagedPages([...getPageManagerPages(), ...newPages], [], `已追加 ${newPages.length} 页。`);
  } catch (error) {
    console.error(error);
    setPageManagerStatus(error.message || "追加页面失败，请稍后再试。", true);
  } finally {
    state.pageManagerBusy = false;
  }
}

async function replaceManagedPage(file) {
  const pageId = state.pageManagerReplacePageId;
  state.pageManagerReplacePageId = "";
  elements.replacePageInput.value = "";
  if (!pageId || !file) {
    return;
  }
  if (!file.type.startsWith("image/")) {
    setPageManagerStatus("请选择图片文件。", true);
    return;
  }
  if (state.pageManagerBusy) {
    return;
  }

  try {
    state.pageManagerBusy = true;
    setPageManagerStatus("正在替换页面...");
    const pages = getPageManagerPages();
    const page = pages.find((item) => item.id === pageId);
    if (!page) {
      return;
    }
    const compressed = await withTimeout(
      compressImageFile(file),
      IMAGE_COMPRESSION_TIMEOUT,
      `《${file.name}》压缩超时，已使用原图。`,
    ).catch((error) => {
      console.warn(error);
      return file;
    });
    const updatedPage = {
      ...page,
      name: file.name,
      type: compressed.type || file.type || "image/jpeg",
      size: compressed.size,
      blob: compressed,
      storageSyncedAt: null,
      storageUploadVersion: 0,
    };
    revokeScoreUrlForPage(updatedPage.id);
    await persistManagedPages(
      pages.map((item) => (item.id === updatedPage.id ? updatedPage : item)),
      [],
      "页面已替换。",
    );
  } catch (error) {
    console.error(error);
    setPageManagerStatus(error.message || "替换页面失败，请稍后再试。", true);
  } finally {
    state.pageManagerBusy = false;
  }
}

async function createFolder(event) {
  event.preventDefault();

  const name = elements.folderName.value.trim();
  if (!name) {
    elements.folderName.focus();
    return;
  }
  if (hasDuplicateFolderName(name, state.editingFolderId)) {
    setStatus("已存在同名文件夹", true);
    elements.folderName.focus();
    return;
  }

  const now = new Date().toISOString();
  const userId = state.session?.user?.id || null;
  const existingFolder = state.editingFolderId
    ? state.folders.find((folder) => folder.id === state.editingFolderId)
    : null;
  const folder = {
    ...(existingFolder || {}),
    id: existingFolder?.id || createId(),
    userId,
    name,
    normalizedName: normalizeText(name),
    createdAt: existingFolder?.createdAt || now,
    updatedAt: now,
    deletedAt: null,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };

  elements.saveFolderButton.disabled = true;

  try {
    await runUserCommand(
      existingFolder ? "folder.update" : "folder.create",
      async ({ commandId }) => {
        await putFolder(folder);
        await recordLocalOperation({
          id: commandId,
          type: existingFolder ? "folder.update" : "folder.create",
          entityType: "folder",
          entityId: folder.id,
          payload: {
            folderId: folder.id,
            name: folder.name,
          },
        });
        elements.searchInput.value = "";
        closeFolderDialog();
        await loadScores();
        if (existingFolder) {
          renderScores();
          setStatus(`《${folder.name}》文件夹名称已保存。`);
        } else {
          openFolder(folder.id);
        }
        // 只要存在 userId/session 就入队 outbox（不因 cloudReady=false 跳过）。
        if (userId || state.session) {
          queueFolderCloudUpload(folder.id);
        }
      },
      {
        label: existingFolder ? "正在保存文件夹..." : "正在创建文件夹...",
        slowLabel: "本地存储较忙，正在优先保存文件夹...",
        failMessage: "保存文件夹失败，请稍后重试。",
      },
    );
  } catch (error) {
    console.error(error);
    await recoverDatabaseIfWedged(error);
    setStatus(getErrorMessage(error) || "保存文件夹失败，请稍后再试。", true);
  } finally {
    elements.saveFolderButton.disabled = false;
  }
}

async function claimLocalRecordsForUser(userId) {
  await ensureDatabaseReady();
  const [scores, pages, folders, setlists, setlistItems, annotations] = await Promise.all([
    getAllScores(),
    getAllScorePages(),
    getAllFolders(),
    getAllSetlists(),
    getAllSetlistItems(),
    getAllAnnotations(),
  ]);
  const now = new Date().toISOString();
  // 认领条件：无主数据，或 userId 是当前账号别名（手机号/邮箱/旧uid 等）且尚未写成当前规范 id。
  // 认领后统一写成当前 state.session.user.id 并标记 pending，避免旧数据因 userId 变化而消失。
  const shouldClaim = (record) => record.userId !== userId && (!record.userId || isCurrentAccountAlias(record.userId));
  const currentScoreIds = new Set(
    scores
      .map(normalizeLocalScoreRecord)
      .filter((score) => !score.deletedAt && (String(score.userId || "") === String(userId) || shouldClaim(score)))
      .map((score) => String(score.id)),
  );
  const currentPageIds = new Set(
    pages
      .map(normalizeLocalPageRecord)
      .filter((page) => !page.deletedAt && currentScoreIds.has(String(page.scoreId)))
      .map((page) => String(page.id)),
  );
  const claimedFolders = folders
    .filter(shouldClaim)
    .map((folder) => ({
      ...normalizeLocalFolderRecord(folder),
      userId,
      updatedAt: folder.updatedAt || now,
      syncStatus: SYNC_STATUS_PENDING,
    }));
  const claimedScores = scores
    .filter(shouldClaim)
    .map((score) => ({
      ...normalizeLocalScoreRecord(score),
      userId,
      updatedAt: score.updatedAt || now,
      syncStatus: SYNC_STATUS_PENDING,
    }));
  const claimedPages = pages
    .filter(shouldClaim)
    .map((page) => ({
      ...normalizeLocalPageRecord(page),
      userId,
      updatedAt: page.updatedAt || now,
      syncStatus: SYNC_STATUS_PENDING,
    }));
  const claimedSetlists = setlists
    .filter(shouldClaim)
    .map((setlist) => ({
      ...normalizeLocalSetlistRecord(setlist),
      userId,
      updatedAt: setlist.updatedAt || now,
      syncStatus: SYNC_STATUS_PENDING,
    }));
  const claimedSetlistItems = setlistItems
    .filter(shouldClaim)
    .map((item) => ({
      ...normalizeLocalSetlistItemRecord(item),
      userId,
      updatedAt: item.updatedAt || now,
      syncStatus: SYNC_STATUS_PENDING,
    }));
  const claimedAnnotations = annotations
    .map(normalizeAnnotationRecord)
    .filter(
      (annotation) =>
        !annotation.deletedAt &&
        annotation.userId !== userId &&
        (shouldClaim(annotation) ||
          currentScoreIds.has(String(annotation.scoreId || "")) ||
          currentPageIds.has(String(annotation.pageId || ""))),
    )
    .map((annotation) => ({
      ...annotation,
      userId,
      updatedAt: annotation.updatedAt || now,
      syncStatus: SYNC_STATUS_PENDING,
    }));

  if (
    !claimedFolders.length &&
    !claimedScores.length &&
    !claimedPages.length &&
    !claimedSetlists.length &&
    !claimedSetlistItems.length &&
    !claimedAnnotations.length
  ) {
    return;
  }

  await putCloudReadyRecords(claimedFolders, claimedScores, claimedPages, claimedSetlists, claimedSetlistItems, claimedAnnotations);
  await loadScores();
}

function queueAccountBackgroundSync(userId, message = "", options = {}) {
  if (!userId) {
    return;
  }

  if (message) {
    setStatus(message);
  }

  window.clearTimeout(state.accountSyncTimer);
  const run = async () => {
    state.accountSyncTimer = 0;
    if (!state.session || state.session.user.id !== userId) {
      return;
    }
    // 用户正在保存/删除/编辑时不抢资源，稍后再试。
    if (shouldDeferBackgroundWork()) {
      state.accountSyncTimer = window.setTimeout(run, 2500);
      return;
    }

    try {
      await ensureDatabaseReady();
      await claimLocalRecordsForUser(userId);
      await SyncEngine.run({ reason: "account-background", force: Boolean(options.immediate) });
      setBackgroundSyncError("");
    } catch (error) {
      if (isLocalDatabaseNotReadyError(error)) {
        console.warn("本地数据库正在恢复，稍后重试后台同步。", error);
        setBackgroundSyncError("");
        window.setTimeout(() => queueAccountBackgroundSync(userId, "", { immediate: true }), 1500);
        return;
      }
      // 后台同步失败不再静默：记录到同步面板，并保留一次轻提示。
      console.warn("后台同步失败", error);
      setBackgroundSyncError(getErrorMessage(error) || "后台同步失败，请稍后重试。");
    }
  };
  // 显式登录/注册后可 immediate 立即同步；冷启动恢复 session 则延迟到空闲再做重型全量同步。
  state.accountSyncTimer = window.setTimeout(run, options.immediate ? 0 : STARTUP_SYNC_DELAY);
}

// 记录后台同步问题原因并刷新“我的”同步面板（失败可见，而非静默 console.warn）。
function setBackgroundSyncError(message) {
  state.backgroundSyncError = message || "";
  updateOutboxIndicator();
}

async function putCloudReadyRecords(folders, scores, pages, setlists = [], setlistItems = [], annotations = []) {
  const batches = createCloudReadyBatches(folders, scores, pages, setlists, setlistItems, annotations);
  for (const batch of batches) {
    const total =
      batch.folders.length +
      batch.scores.length +
      batch.pages.length +
      batch.setlists.length +
      batch.setlistItems.length +
      batch.annotations.length;
    await enqueueLocalWrite(
      "putCloudReadyRecords",
      () =>
        runIdbTransaction(
          [FOLDER_STORE_NAME, STORE_NAME, PAGE_STORE_NAME, SETLIST_STORE_NAME, SETLIST_ITEM_STORE_NAME, ANNOTATION_STORE_NAME],
          "readwrite",
          ([folderStore, scoreStore, pageStore, setlistStore, setlistItemStore, annotationStore]) => {
            batch.folders.forEach((folder) => folderStore.put(folder));
            batch.scores.forEach((score) => scoreStore.put(toScoreRecord(score)));
            batch.pages.forEach((page) => pageStore.put(normalizePageForStore(page)));
            batch.setlists.forEach((setlist) => setlistStore.put(setlist));
            batch.setlistItems.forEach((item) => setlistItemStore.put(item));
            batch.annotations.forEach((annotation) => annotationStore.put(normalizeAnnotationRecord(annotation)));
          },
          {
            timeoutMs: Math.max(LOCAL_SAVE_TIMEOUT, total * 1500 + 5000),
            timeoutMessage: "本地写入云端数据超时，请稍后重试同步。",
          },
        ),
      { priority: "low", timeoutMs: Math.max(LOCAL_SAVE_TIMEOUT, total * 1500 + 5000) },
    );
    await nextFrame();
  }
}

function createCloudReadyBatches(folders, scores, pages, setlists = [], setlistItems = [], annotations = []) {
  const queues = {
    folders: folders.slice(),
    scores: scores.slice(),
    pages: pages.slice(),
    setlists: setlists.slice(),
    setlistItems: setlistItems.slice(),
    annotations: annotations.slice(),
  };
  const batches = [];
  while (
    queues.folders.length ||
    queues.scores.length ||
    queues.pages.length ||
    queues.setlists.length ||
    queues.setlistItems.length ||
    queues.annotations.length
  ) {
    batches.push({
      folders: queues.folders.splice(0, LOCAL_WRITE_BATCH_SIZE),
      scores: queues.scores.splice(0, LOCAL_WRITE_BATCH_SIZE),
      pages: queues.pages.splice(0, LOCAL_WRITE_BATCH_SIZE),
      setlists: queues.setlists.splice(0, LOCAL_WRITE_BATCH_SIZE),
      setlistItems: queues.setlistItems.splice(0, LOCAL_WRITE_BATCH_SIZE),
      annotations: queues.annotations.splice(0, LOCAL_WRITE_BATCH_SIZE),
    });
  }
  return batches;
}

function queueSync() {
  if (!state.cloudReady || !state.session || state.syncing) {
    return;
  }

  SyncEngine?.schedule?.({ reason: "queue-sync", delay: 3500 });
}

function queueScoreCloudUpload(scoreId, message = "") {
  if (message) {
    setStatus(message);
  }
  if (!scoreId || !state.session) {
    return;
  }
  // 入队到发件箱（持久、可观测、可重试），由处理器统一推送。
  enqueueOutboxTask("score.upsert", { entityId: scoreId })
    .then(() => kickOutbox(1200))
    .catch((error) => console.warn(error));
}

function startScoreCloudUpload(scoreId) {
  if (!scoreId) {
    return Promise.resolve();
  }

  const existingTask = state.scoreUploadTasks.get(scoreId);
  if (existingTask) {
    return existingTask;
  }

  const task = uploadScoreToCloud(scoreId).finally(() => {
    state.scoreUploadTasks.delete(scoreId);
  });
  state.scoreUploadTasks.set(scoreId, task);
  return task;
}

// ===== 同步发件箱（sync_outbox）：显式入队 + 退避重试 + 可观测 =====

function getAllOutboxTasks() {
  return readStoreAll(SYNC_OUTBOX_STORE_NAME);
}

function putOutboxTask(task, options = {}) {
  return putStoreRecord(SYNC_OUTBOX_STORE_NAME, task, LOCAL_SAVE_TIMEOUT, "同步队列写入超时。", {
    priority: options.priority,
  });
}

function removeOutboxTask(id) {
  return enqueueLocalWrite("removeOutboxTask", () =>
    runIdbTransaction(
      SYNC_OUTBOX_STORE_NAME,
      "readwrite",
      (store) => {
        store.delete(String(id));
      },
      { timeoutMessage: "同步队列写入超时。" },
    ),
  );
}

function outboxBackoff(attempts) {
  const index = Math.min(Math.max(attempts, 1), OUTBOX_BACKOFF_MS.length) - 1;
  return OUTBOX_BACKOFF_MS[index];
}

// 入队一个待推送操作。相同 dedupeKey 的待处理任务会被合并（覆盖 payload、重置重试）。
async function enqueueOutboxTask(type, options = {}) {
  try {
    await ensureDatabaseReady();
  } catch (error) {
    if (isLocalDatabaseNotReadyError(error)) {
      console.warn("本地数据库正在恢复，同步任务稍后重新入队。", error);
      window.setTimeout(() => {
        enqueueOutboxTask(type, options)
          .then(() => kickOutbox(1200))
          .catch((retryError) => console.warn(retryError));
      }, 1500);
      return;
    }
    throw error;
  }
  if (!state.db) {
    return;
  }
  const entityId = options.entityId ? String(options.entityId) : "";
  const dedupeKey = options.dedupeKey || `${type}:${entityId}`;
  const now = new Date().toISOString();

  let existingTasks = [];
  try {
    existingTasks = await getAllOutboxTasks();
  } catch (error) {
    console.warn(error);
  }

  // 删除某实体时，使其之前的 upsert 任务作废（先删后传没有意义）。
  if (options.supersedeUpsert && entityId) {
    const stale = existingTasks.filter((task) => task.entityId === entityId && task.type !== type && task.type.endsWith(".upsert"));
    for (const task of stale) {
      try {
        await removeOutboxTask(task.id);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  const existing = existingTasks.find((task) => task.dedupeKey === dedupeKey);
  const record = {
    id: existing?.id || createId(),
    type,
    entityType: options.entityType || type.split(".")[0] || "",
    entityId,
    dedupeKey,
    payload: options.payload ?? existing?.payload ?? null,
    status: OUTBOX_STATUS_PENDING,
    retryCount: 0,
    lastError: "",
    createdAt: existing?.createdAt || now,
    nextAttemptAt: Date.now(),
    updatedAt: now,
  };
  try {
    await putOutboxTask(record);
  } catch (error) {
    console.warn("入队同步任务失败", error);
  }
  refreshOutboxCounts();
}

// 启动一次发件箱处理（带去抖）。
function kickOutbox(delay = 600) {
  if (!state.session) {
    refreshOutboxCounts();
    return;
  }
  window.clearTimeout(state.outboxTimer);
  state.outboxTimer = window.setTimeout(() => {
    state.outboxTimer = 0;
    // 用户正在写入时让路，稍后再推进后台同步。
    if (shouldDeferBackgroundWork()) {
      kickOutbox(2000);
      return;
    }
    if (!state.db && !reopenDatabasePromise) {
      window.setTimeout(() => kickOutbox(0), 1500);
      return;
    }
    SyncEngine?.run?.({ reason: "outbox", ensureConnection: true }).catch((error) => console.warn(error));
  }, delay);
}

// 安排下一次重试（取最近一个未到期任务的时间）。
function scheduleOutboxRetry(tasks) {
  const pending = (tasks || []).filter((task) => task.status === OUTBOX_STATUS_PENDING);
  if (!pending.length) {
    return;
  }
  const now = Date.now();
  const next = Math.min(...pending.map((task) => task.nextAttemptAt || now));
  const delay = Math.max(1000, next - now);
  window.clearTimeout(state.outboxTimer);
  state.outboxTimer = window.setTimeout(() => {
    state.outboxTimer = 0;
    SyncEngine?.run?.({ reason: "outbox-retry" }).catch((error) => console.warn(error));
  }, delay);
}

function updateOutboxIndicator() {
  const outboxPending = state.outboxCounts?.pending || 0;
  const outboxFailed = state.outboxCounts?.failed || 0;
  const localPending = state.localOpCounts?.pending || 0;
  const localSyncing = state.localOpCounts?.syncing || 0;
  const localFailed = state.localOpCounts?.failed || 0;
  const localConflict = state.localOpCounts?.conflict || 0;
  const dirty = state.syncStateCounts?.dirty || 0;
  const syncing = state.syncStateCounts?.syncing || 0;
  const failed = state.syncStateCounts?.failed || 0;
  const conflict = state.syncStateCounts?.conflict || 0;
  const totalPending = outboxPending + localPending + dirty;
  const totalSyncing = localSyncing + syncing + (state.syncing ? 1 : 0);
  const totalFailed = outboxFailed + localFailed + failed;
  const totalConflict = localConflict + conflict;
  const hasVisibleState = Boolean(totalPending || totalSyncing || totalFailed || totalConflict || state.backgroundSyncError);

  if (elements.syncOutboxPanel) {
    elements.syncOutboxPanel.hidden = !hasVisibleState;
  }
  if (elements.syncOutboxState) {
    if (totalFailed || totalConflict || state.backgroundSyncError) {
      elements.syncOutboxState.textContent = totalConflict
        ? `同步冲突 ${totalConflict} 项，请稍后重试`
        : `同步失败 ${totalFailed || 1} 项，点击重试`;
    } else if (totalSyncing) {
      elements.syncOutboxState.textContent = "正在同步...";
    } else if (totalPending) {
      elements.syncOutboxState.textContent = `待同步 ${totalPending} 项`;
    } else {
      elements.syncOutboxState.textContent = "";
    }
  }
  if (elements.retryOutboxButton) {
    elements.retryOutboxButton.hidden = !(totalFailed || totalConflict || state.backgroundSyncError);
    elements.retryOutboxButton.disabled = false;
  }
}

async function refreshOutboxCounts() {
  try {
    await ensureDatabaseReady();
    const [tasks, localOps, syncStates] = await Promise.all([
      getAllOutboxTasks(),
      getAllLocalOps().catch(() => []),
      getAllSyncStates().catch(() => []),
    ]);
    applyOutboxCounts(tasks, localOps, syncStates);
  } catch (error) {
    if (!isLocalDatabaseNotReadyError(error)) {
      console.warn(error);
    }
    updateOutboxIndicator();
  }
}

// 处理发件箱：依次执行到期任务，成功即出队，失败按退避重试，超过上限标记 failed。
async function processSyncOutbox(options = {}) {
  if (state.outboxProcessing) {
    return;
  }
  try {
    await ensureDatabaseReady();
  } catch (error) {
    if (isLocalDatabaseNotReadyError(error)) {
      console.warn("本地数据库正在恢复，稍后重试同步队列。", error);
      kickOutbox(1500);
      return;
    }
    throw error;
  }
  // 用户正在保存/删除/编辑时，暂停后台 outbox 处理，等空闲再来（除非强制重试）。
  if (shouldDeferBackgroundWork() && !options.force) {
    kickOutbox(2000);
    return;
  }
  // 必要时先确保云端连接与会话（会话常从本地快速恢复，但云连接可能尚未就绪）。
  if ((!state.cloudReady || !state.session) && options.ensureConnection) {
    try {
      if (!state.cloudReady) {
        await initializeCloud();
      }
      if (state.cloudReady && !state.session) {
        await restoreCloudSession();
      }
    } catch (error) {
      console.warn("确保云端连接失败", error);
    }
  }
  if (!state.cloudReady || !state.session) {
    updateOutboxIndicator();
    return;
  }
  state.outboxProcessing = true;
  try {
    let tasks = [];
    try {
      tasks = await getAllOutboxTasks();
    } catch (error) {
      if (isLocalDatabaseNotReadyError(error)) {
        console.warn("本地数据库正在恢复，稍后重试同步队列。", error);
        kickOutbox(1500);
        return;
      }
      console.warn(error);
      return;
    }
    tasks.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
    const now = Date.now();

    for (const task of tasks) {
      if (!options.force) {
        if (task.status === OUTBOX_STATUS_FAILED) {
          continue;
        }
        if ((task.nextAttemptAt || 0) > now) {
          continue;
        }
      }
        try {
          await dispatchOutboxTask(task);
          await removeOutboxTask(task.id);
          if (!options.force && shouldDeferBackgroundWork()) {
            kickOutbox(2500);
            break;
          }
        } catch (error) {
        const attempts = (task.retryCount || 0) + 1;
        const failedPermanently = attempts >= OUTBOX_MAX_ATTEMPTS;
        try {
          await putOutboxTask({
            ...task,
            retryCount: attempts,
            status: failedPermanently ? OUTBOX_STATUS_FAILED : OUTBOX_STATUS_PENDING,
            lastError: getErrorMessage(error) || String(error),
            nextAttemptAt: Date.now() + outboxBackoff(attempts),
            updatedAt: new Date().toISOString(),
          }, { priority: "low" });
        } catch (writeError) {
          console.warn(writeError);
        }
      }
    }
  } finally {
    state.outboxProcessing = false;
    let remaining = [];
    try {
      remaining = await getAllOutboxTasks();
    } catch (error) {
      if (!isLocalDatabaseNotReadyError(error)) {
        console.warn(error);
      }
    }
    await refreshOutboxCounts();
    scheduleOutboxRetry(remaining);
  }
}

// 根据任务列表更新计数与最近的失败原因，并刷新面板。
function applyOutboxCounts(tasks, localOps = [], syncStates = []) {
  const list = tasks || [];
  state.outboxCounts = {
    pending: list.filter((task) => task.status === OUTBOX_STATUS_PENDING).length,
    failed: list.filter((task) => task.status === OUTBOX_STATUS_FAILED).length,
  };
  const ops = (localOps || []).map(normalizeLocalOperationRecord);
  state.localOpCounts = {
    pending: ops.filter((operation) => normalizeLocalOpStatus(operation.status) === LOCAL_OP_STATUS_PENDING).length,
    syncing: ops.filter((operation) => normalizeLocalOpStatus(operation.status) === LOCAL_OP_STATUS_SYNCING).length,
    failed: ops.filter((operation) => normalizeLocalOpStatus(operation.status) === LOCAL_OP_STATUS_FAILED).length,
    conflict: ops.filter((operation) => normalizeLocalOpStatus(operation.status) === LOCAL_OP_STATUS_CONFLICT).length,
  };
  const states = syncStates || [];
  state.syncStateCounts = {
    dirty: states.filter((item) => item.dirty || item.status === SYNC_STATE_DIRTY).length,
    syncing: states.filter((item) => item.status === SYNC_STATE_SYNCING).length,
    failed: states.filter((item) => item.status === SYNC_STATE_FAILED).length,
    conflict: states.filter((item) => item.status === SYNC_STATE_CONFLICT).length,
  };
  const withError = list.find((task) => task.lastError);
  const failedOp = ops.find((operation) => operation.error);
  const failedState = states.find((item) => item.lastError);
  state.outboxLastError = withError?.lastError || failedOp?.error || failedState?.lastError || "";
  updateOutboxIndicator();
}

// 把失败任务重新置为待处理并立即重试（供“立即重试”按钮使用）。
async function retryFailedOutboxTasks() {
  await ensureDatabaseReady();
  let tasks = [];
  try {
    tasks = await getAllOutboxTasks();
  } catch (error) {
    console.warn(error);
  }
  for (const task of tasks) {
    if (task.status === OUTBOX_STATUS_FAILED || (task.nextAttemptAt || 0) > Date.now()) {
      try {
        await putOutboxTask({ ...task, status: OUTBOX_STATUS_PENDING, nextAttemptAt: Date.now(), updatedAt: new Date().toISOString() });
      } catch (error) {
        console.warn(error);
      }
    }
  }
  await SyncEngine.run({ manual: true, force: true, reason: "retry-outbox" });

  // 同时重试后台全量同步（清除“云端同步暂时失败”的提示）。
  if (state.session) {
    try {
      if (!state.cloudReady) {
        await initializeCloud();
      }
      await ensureDatabaseReady();
      await SyncEngine.run({ manual: true, force: true, reason: "retry-background" });
      setBackgroundSyncError("");
    } catch (error) {
      if (isLocalDatabaseNotReadyError(error)) {
        console.warn("本地数据库正在恢复，稍后重试同步。", error);
        setBackgroundSyncError("");
        window.setTimeout(() => queueAccountBackgroundSync(state.session.user.id, "", { immediate: true }), 1500);
      } else {
        setBackgroundSyncError(getErrorMessage(error) || "云端同步失败，请稍后重试。");
      }
    }
  }
}

// 把任务类型分发到对应的云端操作。
async function dispatchOutboxTask(task) {
  switch (task.type) {
    case "score.upsert":
      await uploadScoreToCloud(task.entityId);
      return;
    case "score.delete": {
      const score = task.payload?.score;
      if (!score) {
        return;
      }
      await deleteCloudScore(score, task.payload.deletedAt);
      return;
    }
    case "folder.upsert":
      await uploadFolderToCloud(task.entityId);
      return;
    case "folder.delete": {
      const folder = task.payload?.folder;
      if (!folder) {
        return;
      }
      await deleteCloudFolder(folder, task.payload.folderScores || [], task.payload.deletedAt);
      return;
    }
    case "setlist.upsert":
      await uploadSetlistToCloud(task.entityId);
      return;
    case "UPSERT_ANNOTATION":
      await uploadAnnotationToCloud(task.payload?.annotation, task.entityId);
      return;
    case "DELETE_ANNOTATION":
      await deleteCloudAnnotation(task.payload?.annotation, task.payload?.deletedAt);
      return;
    default:
      console.warn("未知的同步任务类型", task.type);
  }
}

async function findLocalAnnotationById(annotationId) {
  if (!annotationId) {
    return null;
  }
  const records = await getAllAnnotations();
  const found = records.find((record) => String(record.id) === String(annotationId));
  return found ? normalizeAnnotationRecord(found) : null;
}

async function uploadAnnotationToCloud(annotation, annotationId = "") {
  if (!state.cloudReady || !state.session) {
    return;
  }
  const userId = state.session.user.id;
  const record = normalizeAnnotationRecord(annotation || (await findLocalAnnotationById(annotationId)) || {});
  if (!record.id || !record.pageId || !record.scoreId) {
    return;
  }
  const readyRecord = {
    ...record,
    userId: record.userId || userId,
    syncStatus: SYNC_STATUS_SYNCED,
  };
  const ok = await upsertOptionalCloud(CLOUD_TABLES.annotations, [toCloudAnnotation(readyRecord)]);
  if (!ok) {
    return;
  }
  await markLocalSynced([], [], [], [], [], [readyRecord]);
  state.annotationRecords.set(readyRecord.pageId, readyRecord);
}

async function deleteCloudAnnotation(annotation, deletedAt = new Date().toISOString()) {
  if (!state.cloudReady || !state.session || !annotation?.id) {
    return;
  }
  const userId = state.session.user.id;
  const tombstone = normalizeAnnotationRecord({
    ...annotation,
    userId: annotation.userId || userId,
    deletedAt,
    updatedAt: deletedAt,
    syncStatus: SYNC_STATUS_SYNCED,
  });
  const ok = await upsertOptionalCloud(CLOUD_TABLES.annotations, [toCloudAnnotation(tombstone)]);
  if (!ok) {
    return;
  }
  await markLocalSynced([], [], [], [], [], [tombstone]);
  state.annotationRecords.delete(tombstone.pageId);
}

// 上传单个歌单及其曲目到云端。本地记录若带 deletedAt（软删除），同一次上传即把墓碑推送到云端，
// 因此新建 / 编辑 / 删除共用此任务。歌单记录已被硬删除（本地不存在）则无需操作。
async function uploadSetlistToCloud(setlistId) {
  if (!state.cloudReady || !state.session || !setlistId) {
    return;
  }
  const userId = state.session.user.id;
  const [allSetlists, allItems] = await Promise.all([getAllSetlists(), getAllSetlistItems()]);
  const setlist = allSetlists.find((item) => String(item.id) === String(setlistId));
  if (!setlist) {
    return;
  }
  const setlistRecord = { ...normalizeLocalSetlistRecord(setlist), userId };
  const itemRecords = allItems
    .filter((item) => String(item.setlistId) === String(setlistId))
    .map((item) => ({ ...normalizeLocalSetlistItemRecord(item), userId: item.userId || userId }));

  // 集合缺失时 upsertOptionalCloud 返回 false（无法重试解决），视为完成，不抛错。
  const setlistOk = await upsertOptionalCloud(CLOUD_TABLES.setlists, [toCloudSetlist(setlistRecord)]);
  if (!setlistOk) {
    return;
  }
  if (itemRecords.length) {
    await upsertOptionalCloud(CLOUD_TABLES.setlistItems, itemRecords.map(toCloudSetlistItem));
  }
  await markLocalSynced(
    [],
    [],
    [],
    [{ ...setlistRecord, syncStatus: SYNC_STATUS_SYNCED }],
    itemRecords.map((item) => ({ ...item, syncStatus: SYNC_STATUS_SYNCED })),
  );
}

function queueSetlistCloudSync(setlistId) {
  if (!setlistId || !state.session) {
    return;
  }
  enqueueOutboxTask("setlist.upsert", { entityId: setlistId })
    .then(() => kickOutbox(0))
    .catch((error) => console.warn(error));
}

function queueFolderCloudUpload(folderId) {
  if (!folderId || !state.session) {
    return;
  }
  enqueueOutboxTask("folder.upsert", { entityId: folderId })
    .then(() => kickOutbox(0))
    .catch((error) => console.warn(error));
}

async function uploadFolderToCloud(folderId) {
  if (!state.cloudReady || !state.session || state.folderUploads.has(folderId)) {
    return;
  }

  const userId = state.session.user.id;
  const folder = state.folders.find((item) => item.id === folderId);
  if (!folder) {
    return;
  }

  state.folderUploads.add(folderId);
  try {
    const syncedFolder = {
      ...normalizeLocalFolderRecord(folder),
      userId,
      syncStatus: SYNC_STATUS_SYNCED,
    };
    await upsertCloud(CLOUD_TABLES.folders, [toCloudFolder(syncedFolder)]);
    await putFolder(syncedFolder);
    await loadScores();
  } finally {
    state.folderUploads.delete(folderId);
  }
}

async function uploadScoreToCloud(scoreId) {
  if (!state.cloudReady || !state.session || state.scoreUploads.has(scoreId)) {
    return;
  }

  const userId = state.session.user.id;
  let score = state.scores.find((item) => item.id === scoreId);
  if (!score) {
    await loadScores();
    score = state.scores.find((item) => item.id === scoreId);
  }
  if (!score) {
    return;
  }

  const pages = state.scorePages
    .filter((page) => page.scoreId === scoreId)
    .sort((a, b) => a.pageIndex - b.pageIndex);
  if (!pages.length) {
    return;
  }

  state.scoreUploads.add(scoreId);
  try {
    const folder = score.folderId ? state.folders.find((item) => item.id === score.folderId) : null;
    const syncedFolders = folder && folder.syncStatus !== SYNC_STATUS_SYNCED
      ? [
        {
          ...normalizeLocalFolderRecord(folder),
          userId,
          syncStatus: SYNC_STATUS_SYNCED,
        },
      ]
      : [];

    let uploadIndex = 0;
    const uploadTotal = pages.filter((page) => pageBlobNeedsCloudUpload(page)).length;
    const readyPages = (
      await runWithConcurrency(pages, SCORE_UPLOAD_CONCURRENCY, async (page) => {
        let storagePath = page.storagePath || null;
        let storageSyncedAt = page.storageSyncedAt || null;
        let pageSize = page.size;
        let shouldUploadBlob = pageBlobNeedsCloudUpload(page);
        const blob = shouldUploadBlob ? await getPageBlob(page) : null;
        const hasBlob = Boolean(blob && blob.size > 0);
        if (shouldUploadBlob && !hasBlob && storagePath) {
          shouldUploadBlob = false;
        }
        const shouldSyncMetadata = page.syncStatus !== SYNC_STATUS_SYNCED || shouldUploadBlob || !storagePath;

        if (!shouldSyncMetadata) {
          return null;
        }

        if (!storagePath && !hasBlob) {
          throw new Error(`《${score.name}》第 ${page.pageIndex + 1} 页缺少图片文件，无法上传云端。`);
        }

        if (shouldUploadBlob) {
          uploadIndex += 1;
          if (uploadTotal > 0) {
            const message = `正在直传《${score.name}》图片 ${uploadIndex} / ${uploadTotal}...`;
            setStatus(message);
            setShareDialogStatus(message);
          }
          const cloudPath = getPageUploadPath(userId, page, storagePath);
          storagePath = await uploadCloudFile(cloudPath, blob, `${page.id}.${getExtensionFromType(page.type)}`);
          storageSyncedAt = new Date().toISOString();
          pageSize = blob.size;
          await markPageAssetStorageSynced(page, {
            storagePath,
            storageSyncedAt,
            storageUploadVersion: STORAGE_UPLOAD_VERSION,
            size: pageSize,
          });
        }

        return {
          ...page,
          userId,
          size: pageSize,
          storagePath,
          storageSyncedAt,
          storageUploadVersion: storageSyncedAt ? STORAGE_UPLOAD_VERSION : page.storageUploadVersion,
          syncStatus: SYNC_STATUS_SYNCED,
        };
      })
    ).filter(Boolean);

    const syncedScore = {
      ...toScoreRecord(score),
      userId,
      syncStatus: SYNC_STATUS_SYNCED,
    };

    if (syncedFolders.length) {
      await upsertCloud(CLOUD_TABLES.folders, syncedFolders.map(toCloudFolder));
    }
    await upsertCloud(CLOUD_TABLES.scores, [toCloudScore(syncedScore)]);
    if (readyPages.length) {
      await upsertCloud(CLOUD_TABLES.pages, readyPages.map(toCloudPage));
    }
    await markLocalSynced(syncedFolders, [syncedScore], readyPages);
    readyPages.forEach(replaceLocalPage);
    await loadScores();
    const doneMessage = `《${score.name}》已上传云端。`;
    setStatus(doneMessage);
    setShareDialogStatus(doneMessage);
  } finally {
    state.scoreUploads.delete(scoreId);
  }
}

async function handleManualSync() {
  if (state.syncing) {
    return;
  }

  elements.syncNowButton?.classList.add("is-syncing");
  if (elements.syncNowButton) {
    elements.syncNowButton.disabled = true;
  }
  state.syncing = true;
  updateAccountUi();

  try {
    setStatus("正在刷新...");
    await loadScores();

    const cloudReady = state.cloudReady || (await initializeCloud());
    if (!cloudReady) {
      setStatus(state.cloudError || "CloudBase 连接失败，无法刷新。", true);
      await loadScores();
      return;
    }

    if (!state.session) {
      await restoreCloudSession();
    }

    if (!state.session) {
      setStatus("请先登录账号后再刷新同步。", true);
      await loadScores();
      return;
    }

    await SyncEngine.run({ manual: true, force: true, reason: "manual" });
    await loadScores();
    setStatus("刷新完成。");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "刷新失败，请检查网络和 CloudBase 配置。", true);
  } finally {
    state.syncing = false;
    elements.syncNowButton?.classList.remove("is-syncing");
    updateAccountUi();
  }
}

async function syncNow(options = {}) {
  if (!state.cloudReady || !state.session || state.syncing) {
    if (options.manual && !state.session) {
      setStatus("请先登录账号。", true);
    }
    if (options.throwOnError) {
      throw new Error(state.syncing ? "正在同步，请稍后再试。" : "请先登录账号。");
    }
    return;
  }
  if (!options.manual && shouldDeferBackgroundWork()) {
    queueAccountBackgroundSync(state.session.user.id, "", { immediate: true });
    return;
  }

  state.syncing = true;
  updateAccountUi();
  if (options.manual) {
    setStatus("正在同步...");
  }

  try {
    await ensureDatabaseReady();
    await performSync(options);
    if (options.manual) {
      setStatus("同步完成。");
    }
  } catch (error) {
    if (options.manual) {
      console.error(error);
      setStatus(
        isLocalDatabaseNotReadyError(error)
          ? "本地数据库正在恢复，请稍后重试同步。"
          : error.message || "同步失败，请检查网络和 CloudBase 配置。",
        true,
      );
    } else {
      console.warn("Background sync failed.", error);
    }
    if (options.throwOnError) {
      throw error;
    }
  } finally {
    state.syncing = false;
    updateAccountUi();
  }
}

async function performSync(options = {}) {
  await ensureDatabaseReady();
  if (!options.manual && shouldDeferBackgroundWork()) {
    return;
  }
  await pullCloudDeletions();
  if (!options.manual && shouldDeferBackgroundWork()) {
    return;
  }
  await uploadLocalChanges();
  if (!options.manual && shouldDeferBackgroundWork()) {
    return;
  }
  await pullCloudChanges(options);
  await loadScores();
}

async function pullCloudDeletions() {
  const userId = state.session.user.id;
  const [folders, scores, setlists, setlistItems, annotations] = await Promise.all([
    queryAccountCloudRows(CLOUD_TABLES.folders, userId),
    queryAccountCloudRows(CLOUD_TABLES.scores, userId),
    queryOptionalAccountCloudRows(CLOUD_TABLES.setlists, userId),
    queryOptionalAccountCloudRows(CLOUD_TABLES.setlistItems, userId),
    queryOptionalAccountCloudRows(CLOUD_TABLES.annotations, userId),
  ]);
  const deletedFolderIds = folders.filter((folder) => folder.deleted_at).map((folder) => folder.id);
  const deletedScoreIds = scores.filter((score) => score.deleted_at).map((score) => score.id);
  const deletedSetlistIds = setlists.filter((setlist) => setlist.deleted_at).map((setlist) => setlist.id);
  const deletedSetlistItemIds = setlistItems.filter((item) => item.deleted_at).map((item) => item.id);
  const deletedAnnotationIds = annotations.filter((annotation) => annotation.deleted_at).map((annotation) => annotation.id || annotation._id);

  await purgeCloudDeletedLocalRecords(deletedFolderIds, deletedScoreIds, deletedSetlistIds, deletedSetlistItemIds, deletedAnnotationIds);
}

async function purgeCloudDeletedLocalRecords(folderIds, scoreIds, setlistIds = [], setlistItemIds = [], annotationIds = []) {
  const folderIdSet = new Set(folderIds.filter(Boolean).map(String));
  const scoreIdSet = new Set(scoreIds.filter(Boolean).map(String));
  const setlistIdSet = new Set(setlistIds.filter(Boolean).map(String));
  const setlistItemIdSet = new Set(setlistItemIds.filter(Boolean).map(String));
  const annotationIdSet = new Set(annotationIds.filter(Boolean).map(String));

  if (folderIdSet.size) {
    const localScores = await getAllScores();
    localScores.forEach((score) => {
      if (score.folderId && folderIdSet.has(String(score.folderId))) {
        scoreIdSet.add(String(score.id));
      }
    });
  }

  if (setlistIdSet.size || scoreIdSet.size) {
    const localSetlistItems = await getAllSetlistItems();
    localSetlistItems.forEach((item) => {
      if (setlistIdSet.has(String(item.setlistId)) || scoreIdSet.has(String(item.scoreId))) {
        setlistItemIdSet.add(String(item.id));
      }
    });
  }

  if (scoreIdSet.size) {
    const localAnnotations = await getAllAnnotations();
    localAnnotations.forEach((annotation) => {
      if (scoreIdSet.has(String(annotation.scoreId))) {
        annotationIdSet.add(String(annotation.id));
      }
    });
  }

  if (!folderIdSet.size && !scoreIdSet.size && !setlistIdSet.size && !setlistItemIdSet.size && !annotationIdSet.size) {
    return;
  }

  // 先 readonly 读出所有受影响歌谱的页 keys，再单独 readwrite 删除，避免旧的 getAllKeys-in-readwrite 卡死。
  const scoreIdList = [...scoreIdSet];
  const pageKeyGroups = await Promise.all(
    scoreIdList.map((scoreId) => readKeysByIndex(PAGE_STORE_NAME, "scoreId", scoreId)),
  );
  const pageKeys = pageKeyGroups.flat();
  const total =
    folderIdSet.size + setlistIdSet.size + setlistItemIdSet.size + scoreIdSet.size + pageKeys.length + annotationIdSet.size;

  await enqueueLocalWrite("purgeCloudDeletedLocalRecords", () =>
    runIdbTransaction(
      [FOLDER_STORE_NAME, STORE_NAME, PAGE_STORE_NAME, SETLIST_STORE_NAME, SETLIST_ITEM_STORE_NAME, ANNOTATION_STORE_NAME],
      "readwrite",
      ([folderStore, scoreStore, pageStore, setlistStore, setlistItemStore, annotationStore]) => {
        folderIdSet.forEach((folderId) => folderStore.delete(folderId));
        setlistIdSet.forEach((setlistId) => setlistStore.delete(setlistId));
        setlistItemIdSet.forEach((itemId) => setlistItemStore.delete(itemId));
        scoreIdSet.forEach((scoreId) => scoreStore.delete(scoreId));
        pageKeys.forEach((key) => pageStore.delete(key));
        annotationIdSet.forEach((annotationId) => annotationStore.delete(annotationId));
      },
      {
        timeoutMs: Math.max(LOCAL_SAVE_TIMEOUT, total * 1500 + 5000),
        timeoutMessage: "清理云端已删除记录超时，请稍后重试同步。",
      },
    ),
  );
}

async function getSyncableLocalRecords(userId) {
  const [folderRecords, scoreRecords, pageRecords, setlistRecords, setlistItemRecords, annotationRecords] = await Promise.all([
    getAllFolders(),
    getAllScores(),
    getAllScorePages(),
    getAllSetlists(),
    getAllSetlistItems(),
    getAllAnnotations(),
  ]);
  const ownerMatches = createOwnerMatcher();
  const folders = folderRecords.map(normalizeLocalFolderRecord).filter(ownerMatches);
  const scores = scoreRecords.map(normalizeLocalScoreRecord).filter(ownerMatches);
  const scoreIds = new Set(scores.map((score) => score.id));
  const pages = pageRecords
    .map(normalizeLocalPageRecord)
    .filter((page) => scoreIds.has(page.scoreId) && ownerMatches(page));
  const setlists = setlistRecords.map(normalizeLocalSetlistRecord).filter(ownerMatches);
  const setlistIds = new Set(setlists.map((setlist) => setlist.id));
  const setlistItems = setlistItemRecords
    .map(normalizeLocalSetlistItemRecord)
    .filter((item) => setlistIds.has(item.setlistId) && scoreIds.has(item.scoreId) && ownerMatches(item));
  const pageIds = new Set(pages.map((page) => page.id));
  const annotations = annotationRecords
    .map(normalizeAnnotationRecord)
    .filter(
      (annotation) =>
        ownerMatches(annotation) &&
        scoreIds.has(String(annotation.scoreId || "")) &&
        pageIds.has(String(annotation.pageId || "")),
    );

  return { folders, scores, pages, setlists, setlistItems, annotations };
}

async function uploadLocalChanges() {
  const userId = state.session.user.id;
  const localRecords = await getSyncableLocalRecords(userId);
  const allFolders = localRecords.folders.map((folder) => ({ ...folder, userId }));
  const allScores = localRecords.scores.map((score) => ({ ...toScoreRecord(score), userId }));
  const allSetlists = localRecords.setlists.map((setlist) => ({ ...setlist, userId }));
  const allSetlistItems = localRecords.setlistItems.map((item) => ({ ...item, userId: item.userId || userId }));
  const allAnnotations = localRecords.annotations.map((annotation) => ({
    ...normalizeAnnotationRecord(annotation),
    userId: annotation.userId || userId,
  }));
  const folders = allFolders.filter(needsCloudMetadataSync);
  const scores = allScores.filter(needsCloudMetadataSync);
  const setlists = allSetlists.filter(needsCloudMetadataSync);
  const setlistItems = allSetlistItems.filter(needsCloudMetadataSync);
  const annotations = allAnnotations.filter(needsCloudMetadataSync);
  const scoreById = new Map(allScores.map((score) => [score.id, score]));
  const pages = localRecords.pages
    .filter((page) => scoreById.has(page.scoreId))
    .map((page) => ({ ...page, userId: page.userId || userId }));
  const uploadedPages = [];

  for (const page of pages) {
    const score = scoreById.get(page.scoreId);
    const pageDeleted = Boolean(page.deletedAt || score?.deletedAt);
    let storagePath = page.storagePath || null;
    let storageSyncedAt = page.storageSyncedAt || null;
    let pageSize = page.size;
    let shouldUploadBlob = pageBlobNeedsCloudUpload(page, pageDeleted);
    const blob = shouldUploadBlob ? await getPageBlob(page) : null;
    const hasBlob = Boolean(blob && blob.size > 0);
    if (shouldUploadBlob && !hasBlob && storagePath) {
      shouldUploadBlob = false;
    }
    const shouldSyncMetadata = page.syncStatus !== SYNC_STATUS_SYNCED || shouldUploadBlob || (!pageDeleted && !storagePath);

    if (!shouldSyncMetadata) {
      continue;
    }

    if (!pageDeleted && !storagePath && !hasBlob) {
      const scoreName = score?.name || "未命名歌谱";
      throw new Error(`《${scoreName}》第 ${page.pageIndex + 1} 页缺少图片文件，无法上传同步。`);
    }

    if (shouldUploadBlob) {
      const cloudPath = getPageUploadPath(userId, page, storagePath);
      storagePath = await uploadCloudFile(cloudPath, blob, `${page.id}.${getExtensionFromType(page.type)}`);
      storageSyncedAt = new Date().toISOString();
      pageSize = blob.size;
      await markPageAssetStorageSynced(page, {
        storagePath,
        storageSyncedAt,
        storageUploadVersion: STORAGE_UPLOAD_VERSION,
        size: pageSize,
      });
    }
    uploadedPages.push({
      ...page,
      size: pageSize,
      storagePath,
      storageSyncedAt,
      storageUploadVersion: storageSyncedAt ? STORAGE_UPLOAD_VERSION : page.storageUploadVersion,
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
  const syncedSetlists = setlists.length && (await upsertOptionalCloud(CLOUD_TABLES.setlists, setlists.map(toCloudSetlist)))
    ? setlists
    : [];
  const syncedSetlistItems =
    setlistItems.length && (await upsertOptionalCloud(CLOUD_TABLES.setlistItems, setlistItems.map(toCloudSetlistItem)))
      ? setlistItems
      : [];
  const syncedAnnotations =
    annotations.length && (await upsertOptionalCloud(CLOUD_TABLES.annotations, annotations.map(toCloudAnnotation)))
      ? annotations
      : [];

  const deletedScoreIds = scores.filter((score) => score.deletedAt).map((score) => score.id);
  if (deletedScoreIds.length) {
    await deleteCloudShareItemsForScores(deletedScoreIds);
  }
  const deletedFolderIds = folders.filter((folder) => folder.deletedAt).map((folder) => folder.id);
  if (deletedFolderIds.length) {
    await deleteCloudShareItemsForFolders(deletedFolderIds);
  }

  await markLocalSynced(
    folders.map((folder) => ({ ...folder, syncStatus: SYNC_STATUS_SYNCED })),
    scores.map((score) => ({ ...score, syncStatus: SYNC_STATUS_SYNCED })),
    uploadedPages,
    syncedSetlists.map((setlist) => ({ ...setlist, syncStatus: SYNC_STATUS_SYNCED })),
    syncedSetlistItems.map((item) => ({ ...item, syncStatus: SYNC_STATUS_SYNCED })),
    syncedAnnotations.map((annotation) => ({ ...annotation, syncStatus: SYNC_STATUS_SYNCED })),
  );
}

function needsCloudMetadataSync(record) {
  return record?.syncStatus !== SYNC_STATUS_SYNCED;
}

function isLocalAnnotationNewerThanCloud(localRecord, cloudRecord) {
  if (!localRecord || localRecord.deletedAt) {
    return false;
  }
  const localHasDrawing =
    (Array.isArray(localRecord.strokes) && localRecord.strokes.length > 0) || Boolean(localRecord.drawingDataBase64);
  const cloudHasDrawing =
    (Array.isArray(cloudRecord.strokes) && cloudRecord.strokes.length > 0) || Boolean(cloudRecord.drawingDataBase64);
  if (localHasDrawing && !cloudHasDrawing) {
    return true;
  }
  if (localRecord.syncStatus !== SYNC_STATUS_SYNCED) {
    return true;
  }
  return String(localRecord.updatedAt || "").localeCompare(String(cloudRecord.updatedAt || "")) > 0;
}

async function mergeCloudAnnotationsWithLocal(cloudAnnotations) {
  if (!cloudAnnotations.length) {
    return [];
  }
  const localRecords = (await getAllAnnotations()).map(normalizeAnnotationRecord);
  const localById = new Map(localRecords.map((record) => [String(record.id), record]));
  const localByPage = new Map();
  localRecords.forEach((record) => {
    if (!record.pageId || record.deletedAt) {
      return;
    }
    const previous = localByPage.get(record.pageId);
    if (!previous || String(record.updatedAt || "").localeCompare(String(previous.updatedAt || "")) > 0) {
      localByPage.set(record.pageId, record);
    }
  });

  return cloudAnnotations.map((cloudRecord) => {
    const localRecord = localById.get(String(cloudRecord.id)) || localByPage.get(String(cloudRecord.pageId));
    return isLocalAnnotationNewerThanCloud(localRecord, cloudRecord) ? localRecord : cloudRecord;
  });
}

async function pullCloudChanges(options = {}) {
  const downloadImages = Boolean(options.downloadImages);
  const userId = state.session.user.id;
  const deletionGuards = await getLocalDeletionGuards(userId);
  const [folderRows, scoreRows, pageRows, setlistRows, setlistItemRows, annotationRows] = await Promise.all([
    queryAccountCloudRows(CLOUD_TABLES.folders, userId),
    queryAccountCloudRows(CLOUD_TABLES.scores, userId),
    queryAccountCloudRows(CLOUD_TABLES.pages, userId, {
      orderBy: [["page_index", "asc"]],
    }),
    queryOptionalAccountCloudRows(CLOUD_TABLES.setlists, userId),
    queryOptionalAccountCloudRows(CLOUD_TABLES.setlistItems, userId, {
      orderBy: [["position", "asc"]],
    }),
    queryOptionalAccountCloudRows(CLOUD_TABLES.annotations, userId),
  ]);
  // 诊断：云端拉取到多少条歌谱、它们的 user_id 是什么、当前账号别名是什么——用于排查登录后无歌谱。
  console.log(
    "[account-debug] 云端拉取歌谱原始条数:", scoreRows.length,
    "| 云端 user_id 取样:", Array.from(new Set(scoreRows.map((row) => row.user_id))).slice(0, 5),
    "| 当前账号别名:", getSessionUserIdList(),
  );
  const folders = folderRows
    .filter(isCloudRowActive)
    .filter((row) => !deletionGuards.folderIds.has(String(row.id)));
  const scores = scoreRows
    .filter(isCloudRowActive)
    .filter(
      (row) =>
        !deletionGuards.scoreIds.has(String(row.id)) &&
        !deletionGuards.folderIds.has(String(row.folder_id || "")),
    );
  const activeScoreIds = new Set(scores.map((row) => String(row.id)));
  const pages = pageRows
    .filter(isCloudRowActive)
    .filter(
      (row) =>
        activeScoreIds.has(String(row.score_id)) &&
        !deletionGuards.pageIds.has(String(row.id)) &&
        !deletionGuards.scoreIds.has(String(row.score_id || "")),
    );
  const activePageIds = new Set(pages.map((row) => String(row.id)));
  const setlists = setlistRows
    .filter(isCloudRowActive)
    .filter((row) => !deletionGuards.setlistIds.has(String(row.id)));
  const activeSetlistIds = new Set(setlists.map((row) => String(row.id)));
  const setlistItems = setlistItemRows
    .filter(isCloudRowActive)
    .filter(
      (row) =>
        activeSetlistIds.has(String(row.setlist_id)) &&
        activeScoreIds.has(String(row.score_id)) &&
        !deletionGuards.setlistItemIds.has(String(row.id)) &&
        !deletionGuards.setlistIds.has(String(row.setlist_id || "")) &&
        !deletionGuards.scoreIds.has(String(row.score_id || "")),
    );
  const cloudAnnotations = annotationRows
    .filter(isCloudRowActive)
    .filter(
      (row) =>
        activeScoreIds.has(String(row.score_id || "")) &&
        activePageIds.has(String(row.page_id || "")) &&
        !deletionGuards.annotationIds.has(String(row.id || row._id || "")) &&
        !deletionGuards.pageIds.has(String(row.page_id || "")) &&
        !deletionGuards.scoreIds.has(String(row.score_id || "")),
    )
    .map(fromCloudAnnotation);

  const localPageById = new Map(state.scorePages.map((page) => [page.id, page]));
  const cloudPages = [];

  for (const row of pages) {
    const page = fromCloudPage(row);
    const localPage = localPageById.get(page.id);
    if (localPage?.blob?.size > 0) {
      cloudPages.push({
        ...page,
        blob: localPage.blob,
        storageSyncedAt: localPage.storageSyncedAt || page.updatedAt || null,
        storageUploadVersion: localPage.storageUploadVersion || 0,
      });
      continue;
    }

    if (!downloadImages) {
      cloudPages.push({
        ...page,
        blob: localPage?.blob,
        storageSyncedAt: localPage?.storageSyncedAt || page.updatedAt || null,
        storageUploadVersion: localPage?.storageUploadVersion || STORAGE_UPLOAD_VERSION,
      });
      continue;
    }

    try {
      const data = await downloadCloudFile(page.storagePath, page.size, page.type);
      cloudPages.push({
        ...page,
        blob: data,
        size: page.size || data.size,
        storageSyncedAt: page.updatedAt || new Date().toISOString(),
        storageUploadVersion: STORAGE_UPLOAD_VERSION,
      });
    } catch (error) {
      console.warn(error);
      cloudPages.push(page);
    }
  }

  await putCloudReadyRecords(
    folders.map(fromCloudFolder),
    scores.map(fromCloudScore),
    cloudPages,
    setlists.map(fromCloudSetlist),
    setlistItems.map(fromCloudSetlistItem),
    await mergeCloudAnnotationsWithLocal(cloudAnnotations),
  );
}

function markLocalSynced(folders, scores, pages, setlists = [], setlistItems = [], annotations = []) {
  return putCloudReadyRecords(folders, scores, pages, setlists, setlistItems, annotations);
}

async function getLocalDeletionGuards(userId) {
  await ensureDatabaseReady();
  const [folderRecords, scoreRecords, pageRecords, setlistRecords, setlistItemRecords, annotationRecords] = await Promise.all([
    getAllFolders(),
    getAllScores(),
    getAllScorePages(),
    getAllSetlists(),
    getAllSetlistItems(),
    getAllAnnotations(),
  ]);
  const ownerMatches = createOwnerMatcher();
  const folderIds = new Set(
    folderRecords
      .map(normalizeLocalFolderRecord)
      .filter((folder) => folder.deletedAt && ownerMatches(folder))
      .map((folder) => String(folder.id)),
  );
  const scoreIds = new Set(
    scoreRecords
      .map(normalizeLocalScoreRecord)
      .filter((score) => score.deletedAt && ownerMatches(score))
      .map((score) => String(score.id)),
  );
  const pageIds = new Set(
    pageRecords
      .map(normalizeLocalPageRecord)
      .filter((page) => page.deletedAt && ownerMatches(page))
      .map((page) => String(page.id)),
  );
  const setlistIds = new Set(
    setlistRecords
      .map(normalizeLocalSetlistRecord)
      .filter((setlist) => setlist.deletedAt && ownerMatches(setlist))
      .map((setlist) => String(setlist.id)),
  );
  const setlistItemIds = new Set(
    setlistItemRecords
      .map(normalizeLocalSetlistItemRecord)
      .filter((item) => item.deletedAt && ownerMatches(item))
      .map((item) => String(item.id)),
  );
  const annotationIds = new Set(
    annotationRecords
      .map(normalizeAnnotationRecord)
      .filter((annotation) => annotation.deletedAt && ownerMatches(annotation))
      .map((annotation) => String(annotation.id)),
  );

  scoreRecords
    .map(normalizeLocalScoreRecord)
    .filter((score) => folderIds.has(String(score.folderId || "")) && ownerMatches(score))
    .forEach((score) => scoreIds.add(String(score.id)));
  pageRecords
    .map(normalizeLocalPageRecord)
    .filter((page) => scoreIds.has(String(page.scoreId || "")) && ownerMatches(page))
    .forEach((page) => pageIds.add(String(page.id)));
  setlistItemRecords
    .map(normalizeLocalSetlistItemRecord)
    .filter(
      (item) =>
        ownerMatches(item) &&
        (setlistIds.has(String(item.setlistId || "")) || scoreIds.has(String(item.scoreId || ""))),
    )
    .forEach((item) => setlistItemIds.add(String(item.id)));
  annotationRecords
    .map(normalizeAnnotationRecord)
    .filter(
      (annotation) =>
        ownerMatches(annotation) &&
        (scoreIds.has(String(annotation.scoreId || "")) || pageIds.has(String(annotation.pageId || ""))),
    )
    .forEach((annotation) => annotationIds.add(String(annotation.id)));

  return { folderIds, scoreIds, pageIds, setlistIds, setlistItemIds, annotationIds };
}

function isCloudRowActive(row) {
  return !row?.deleted_at;
}

async function upsertCloud(table, rows) {
  const collection = state.cloudDb.collection(table);
  await runWithConcurrency(rows, CLOUD_WRITE_CONCURRENCY, async (row) => {
    const { _id, ...document } = row;
    const result = await cloudGuard(
      collection.doc(String(row.id)).set(document),
      CLOUD_QUERY_TIMEOUT,
      "云端数据保存超时，请检查网络后重试。",
    );
    assertCloudResult(result);
  });
}

async function upsertOptionalCloud(table, rows) {
  if (!rows.length) {
    return true;
  }

  try {
    await upsertCloud(table, rows);
    return true;
  } catch (error) {
    if (isMissingCloudCollectionError(error)) {
      console.warn(error);
      setStatus("歌单云同步需要先在 CloudBase 创建 setlists 和 setlist_items 集合。", true);
      return false;
    }
    throw error;
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

    const result = await cloudGuard(
      query.skip(offset).limit(pageSize).get(),
      CLOUD_QUERY_TIMEOUT,
      "云端数据读取超时，请检查网络后重试。",
    );
    assertCloudResult(result);
    batch = Array.isArray(result.data) ? result.data : [];
    rows.push(...batch);
    offset += batch.length;
  } while (batch.length === pageSize);

  return rows;
}

async function queryOptionalCloudRows(collectionName, where, options = {}) {
  try {
    return await queryCloudRows(collectionName, where, options);
  } catch (error) {
    if (isMissingCloudCollectionError(error)) {
      console.warn(error);
      return [];
    }
    throw error;
  }
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

// 按当前账号的所有别名 ID 查询云端：单一 ID 走普通查询，多个别名用 user_id in (...) 一并查回。
async function queryAccountCloudRows(collectionName, userId, options = {}) {
  // 用合并后的全部账号别名查询云端 user_id，兼容旧数据用手机号/邮箱/+86/openId/旧uid 保存的情况。
  const ids = getMergedAccountIds();
  if (!ids.length && userId) {
    ids.push(userId);
  }
  if (ids.length <= 1) {
    return queryCloudRows(collectionName, { user_id: ids[0] || userId }, options);
  }
  return queryCloudRowsByIds(collectionName, "user_id", ids, {}, options);
}

async function queryOptionalAccountCloudRows(collectionName, userId, options = {}) {
  try {
    return await queryAccountCloudRows(collectionName, userId, options);
  } catch (error) {
    if (isMissingCloudCollectionError(error)) {
      console.warn(error);
      return [];
    }
    throw error;
  }
}

async function deleteCloudRowsByIds(collectionName, ids) {
  const collection = state.cloudDb.collection(collectionName);
  for (const id of ids.filter(Boolean)) {
    const result = await cloudGuard(
      collection.doc(String(id)).remove(),
      CLOUD_QUERY_TIMEOUT,
      "云端数据删除超时，请检查网络后重试。",
    );
    assertCloudResult(result);
  }
}

async function deleteCloudShareItemsForScores(scoreIds) {
  const ids = Array.from(new Set(scoreIds.filter(Boolean).map(String)));
  if (!ids.length) {
    return;
  }

  const rows = await queryCloudRowsByIds(CLOUD_TABLES.shareItems, "score_id", ids);
  await deleteCloudRowsByIds(
    CLOUD_TABLES.shareItems,
    rows.map((row) => row.id || row._id),
  );
}

async function deleteCloudShareItemsForFolders(folderIds) {
  const ids = Array.from(new Set(folderIds.filter(Boolean).map(String)));
  if (!ids.length) {
    return;
  }

  const rows = await queryCloudRowsByIds(CLOUD_TABLES.shareItems, "folder_id", ids);
  await deleteCloudRowsByIds(
    CLOUD_TABLES.shareItems,
    rows.map((row) => row.id || row._id),
  );
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

async function uploadCloudFile(cloudPath, blob, fileName = "score-page.jpg") {
  const file = toUploadFile(blob, fileName);
  if (!file?.size) {
    throw new Error("歌谱图片文件为空，无法上传。");
  }

  if (typeof state.cloudApp.uploadFile === "function") {
    try {
      const result = await cloudGuard(
        state.cloudApp.uploadFile({
          cloudPath,
          filePath: file,
        }),
        CLOUD_UPLOAD_TIMEOUT,
        "歌谱图片上传超时，请检查网络后重试。",
      );
      assertCloudResult(result);
      return getUploadedFileID(result, cloudPath);
    } catch (error) {
      if (typeof state.cloudApp.getUploadMetadata !== "function") {
        throw error;
      }
      console.warn(error);
    }
  }

  if (typeof state.cloudApp.getUploadMetadata === "function") {
    return uploadCloudFileWithSignedUrl(cloudPath, file);
  }

  throw new Error("当前 CloudBase SDK 不支持图片上传。");
}

function getUploadedFileID(result, fallbackPath) {
  return (
    result?.fileID ||
    result?.fileId ||
    result?.file_id ||
    result?.data?.fileID ||
    result?.data?.fileId ||
    result?.data?.file_id ||
    fallbackPath
  );
}

function toUploadFile(blob, fileName) {
  if (typeof File === "function" && !(blob instanceof File)) {
    return new File([blob], fileName, {
      type: blob.type || "image/jpeg",
      lastModified: Date.now(),
    });
  }

  return blob;
}

async function uploadCloudFileWithSignedUrl(cloudPath, file) {
  const contentType = file.type || "application/octet-stream";
  const metadataResult = await cloudGuard(
    state.cloudApp.getUploadMetadata({
      cloudPath,
      method: "put",
      headers: {
        "content-type": contentType,
      },
    }),
    CLOUD_QUERY_TIMEOUT,
    "歌谱图片上传授权超时，请检查网络后重试。",
  );
  assertCloudResult(metadataResult);

  const metadata = metadataResult.data || metadataResult;
  const url = metadata.url;
  const fileID = metadata.fileID || metadata.fileId || metadata.file_id || cloudPath;
  const cosFileId = metadata.cosFileId || metadata.cosFileID || metadata.cos_file_id;
  const headers = {
    authorization: metadata.authorization,
    "content-type": contentType,
    "x-cos-meta-fileid": cosFileId,
    "x-cos-security-token": metadata.token,
  };

  Object.keys(headers).forEach((key) => {
    if (!headers[key]) {
      delete headers[key];
    }
  });

  const response = await fetchWithTimeout(
    url,
    {
      method: "PUT",
      headers,
      body: file,
    },
    CLOUD_UPLOAD_TIMEOUT,
    "歌谱图片上传超时，请检查网络后重试。",
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "歌谱图片上传失败。");
  }

  return fileID;
}

async function getCloudFileTempUrl(fileID) {
  if (!fileID) {
    throw new Error("歌谱图片缺少云端文件 ID。");
  }

  const urlMap = await getCloudFileTempUrls([fileID]);
  const url = urlMap.get(fileID);
  if (!url) {
    throw new Error("歌谱图片下载地址为空。");
  }

  return url;
}

async function getCloudFileTempUrls(fileIDs) {
  const targets = [...new Set((fileIDs || []).filter(Boolean))];
  if (!targets.length) {
    return new Map();
  }

  const result = await cloudGuard(
    state.cloudApp.getTempFileURL({
      fileList: targets,
    }),
    CLOUD_QUERY_TIMEOUT,
    "歌谱图片下载授权超时，请检查网络后重试。",
  );
  assertCloudResult(result);

  const fileList = result.fileList || result.data?.fileList || [];
  const urls = new Map();
  fileList.forEach((fileInfo, index) => {
    if (!fileInfo || (fileInfo.code && fileInfo.code !== "SUCCESS")) {
      return;
    }

    const url = getCloudTempUrlFromInfo(fileInfo);
    const fileID = fileInfo.fileID || fileInfo.fileId || fileInfo.file_id || targets[index];
    if (fileID && url) {
      urls.set(fileID, url);
    }
  });

  return urls;
}

function getCloudTempUrlFromInfo(fileInfo) {
  return fileInfo?.tempFileURL || fileInfo?.download_url || fileInfo?.url || "";
}

function isMissingCloudCollectionError(error) {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("collection") && (message.includes("not") || message.includes("exist") || message.includes("found"))
  ) || message.includes("collection not exists") || message.includes("collection not exist") || message.includes("集合不存在");
}

async function downloadCloudFile(fileID, expectedSize = 0, fallbackType = "") {
  const url = await getCloudFileTempUrl(fileID);
  return downloadCloudFileFromUrl(url, expectedSize, fallbackType);
}

async function downloadCloudFileFromUrl(url, expectedSize = 0, fallbackType = "") {
  const response = await fetchWithTimeout(url, {}, CLOUD_DOWNLOAD_TIMEOUT, "歌谱图片下载超时，请检查网络后重试。");
  if (!response.ok) {
    throw new Error("歌谱图片下载失败。");
  }

  const contentType = response.headers.get("content-type") || "";
  const blob = await response.blob();
  if (Number(expectedSize) > 0 && blob.size === 0) {
    throw new Error("云端歌谱图片文件为空，需要在保留本地图片的设备上重新同步。");
  }

  return normalizeDownloadedImageBlob(blob, fallbackType, contentType);
}

function normalizeDownloadedImageBlob(blob, fallbackType = "", contentType = "") {
  const blobType = getNormalizedMimeType(blob?.type || contentType);
  if (blobType && !blobType.startsWith("image/") && blobType !== "application/octet-stream") {
    throw new Error("云端返回的不是有效图片文件，请重新同步这页歌谱。");
  }

  const safeType =
    getSafeImageMimeType(blob?.type) ||
    getSafeImageMimeType(contentType) ||
    getSafeImageMimeType(fallbackType) ||
    "image/jpeg";
  if (blob?.type === safeType) {
    return blob;
  }

  return new Blob([blob], { type: safeType });
}

function getSafeImageMimeType(value) {
  const mimeType = getNormalizedMimeType(value);
  return mimeType.startsWith("image/") ? mimeType : "";
}

function getNormalizedMimeType(value) {
  return String(value || "").split(";")[0].trim().toLowerCase();
}

async function deleteCloudFiles(fileIDs) {
  const targets = fileIDs.filter(Boolean);
  if (!targets.length) {
    return;
  }

  const result = await cloudGuard(
    state.cloudApp.deleteFile({
      fileList: targets,
    }),
    CLOUD_QUERY_TIMEOUT,
    "云端图片删除超时。",
  );
  assertCloudResult(result);
}

function withTimeout(promise, timeoutMs, message = "操作超时，请重试。") {
  let timeoutId = 0;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    window.clearTimeout(timeoutId);
  });
}

async function fetchWithTimeout(url, options = {}, timeoutMs = CLOUD_QUERY_TIMEOUT, message = "网络请求超时，请重试。") {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = window.setTimeout(() => controller?.abort(), timeoutMs);

  try {
    return await withTimeout(
      fetch(url, {
        ...options,
        signal: controller?.signal || options.signal,
      }),
      timeoutMs,
      message,
    );
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(message);
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
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

function getPageUploadPath(userId, page, storagePath = page?.storagePath || null) {
  if (!storagePath || storagePath.startsWith("cloud://") || !isOwnStoragePath(storagePath, userId)) {
    return createStoragePath(userId, page.scoreId, page.id, page.type);
  }

  return storagePath;
}

function isOwnStoragePath(storagePath, userId) {
  if (!storagePath || !userId) {
    return false;
  }

  const root = String(window.MY_SCORE_FOLDER_CLOUDBASE?.storageRoot || "score-pages").replace(/^\/+|\/+$/g, "");
  return String(storagePath).includes(`/${root}/${userId}/`) || String(storagePath).startsWith(`${root}/${userId}/`);
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
    tags: normalizeTags(score.tags),
    key_signature: score.keySignature || "",
    usage: score.usage || "",
    notes: score.notes || "",
    favorite: Boolean(score.favorite),
    last_opened_at: score.lastOpenedAt || null,
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
    asset_id: page.assetId || null,
    thumbnail_asset_id: page.thumbnailAssetId || null,
    storage_path: page.storagePath,
    storage_synced_at: page.storageSyncedAt || null,
    storage_upload_version: Number(page.storageUploadVersion) || 0,
    created_at: page.createdAt,
    updated_at: page.updatedAt,
    deleted_at: page.deletedAt || null,
  };
}

function toCloudSetlist(setlist) {
  return {
    id: setlist.id,
    user_id: setlist.userId,
    name: setlist.name,
    normalized_name: setlist.normalizedName,
    date: setlist.date || "",
    scene: setlist.scene || "",
    created_at: setlist.createdAt,
    updated_at: setlist.updatedAt,
    deleted_at: setlist.deletedAt || null,
  };
}

function toCloudSetlistItem(item) {
  return {
    id: item.id,
    user_id: item.userId,
    setlist_id: item.setlistId,
    score_id: item.scoreId,
    position: item.position,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    deleted_at: item.deletedAt || null,
  };
}

function serializeCloudAnnotationStrokes(strokes) {
  return cloneAnnotationStrokes(strokes);
}

function parseCloudAnnotationStrokes(value) {
  if (Array.isArray(value)) {
    return cloneAnnotationStrokes(value);
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? cloneAnnotationStrokes(parsed) : [];
    } catch (error) {
      console.warn("Failed to parse cloud annotation strokes", error);
    }
  }
  return [];
}

function toCloudAnnotation(annotation) {
  const record = normalizeAnnotationRecord(annotation);
  return {
    id: record.id,
    user_id: record.userId,
    score_id: record.scoreId,
    page_id: record.pageId,
    base_width: record.baseWidth,
    base_height: record.baseHeight,
    strokes: serializeCloudAnnotationStrokes(record.strokes),
    engine: record.engine || "",
    drawing_data_base64: record.drawingDataBase64 || "",
    native_drawing_updated_at: record.nativeDrawingUpdatedAt || "",
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    deleted_at: record.deletedAt || null,
  };
}

function fromCloudAnnotation(row) {
  return normalizeAnnotationRecord({
    id: row.id || row._id,
    userId: row.user_id,
    scoreId: row.score_id,
    pageId: row.page_id,
    baseWidth: row.base_width,
    baseHeight: row.base_height,
    strokes: parseCloudAnnotationStrokes(row.strokes),
    engine: row.engine || "",
    drawingDataBase64: row.drawing_data_base64 || row.drawingDataBase64 || "",
    nativeDrawingUpdatedAt: row.native_drawing_updated_at || row.nativeDrawingUpdatedAt || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    syncStatus: SYNC_STATUS_SYNCED,
  });
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
    tags: row.tags,
    keySignature: row.key_signature,
    usage: row.usage,
    notes: row.notes,
    favorite: row.favorite,
    lastOpenedAt: row.last_opened_at,
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
    assetId: row.asset_id || row.assetId || "",
    thumbnailAssetId: row.thumbnail_asset_id || row.thumbnailAssetId || "",
    storagePath: row.storage_path,
    storageSyncedAt: row.storage_synced_at || row.storageSyncedAt || null,
    storageUploadVersion: Number(row.storage_upload_version || row.storageUploadVersion) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    syncStatus: SYNC_STATUS_SYNCED,
  });
}

function fromCloudSetlist(row) {
  return normalizeLocalSetlistRecord({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    normalizedName: row.normalized_name,
    date: row.date,
    scene: row.scene,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    syncStatus: SYNC_STATUS_SYNCED,
  });
}

function fromCloudSetlistItem(row) {
  return normalizeLocalSetlistItemRecord({
    id: row.id,
    userId: row.user_id,
    setlistId: row.setlist_id,
    scoreId: row.score_id,
    position: row.position,
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
  elements.shareSearchInput.value = "";
  clearShareSelection();
  setShareDialogStatus("");
  resetCopyShareCodeButton();
  setCreateShareButtonLabel("生成同步码");
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
  setShareDialogStatus("");
  resetCopyShareCodeButton();
}

function clearShareSelection() {
  state.shareSelectedFolderIds.clear();
  state.shareSelectedScoreIds.clear();
}

function setShareDialogStatus(message, isError = false) {
  if (!elements.shareDialogStatus) {
    return;
  }

  elements.shareDialogStatus.textContent = message || "";
  elements.shareDialogStatus.hidden = !message;
  elements.shareDialogStatus.classList.toggle("is-error", Boolean(isError));
}

function setCreateShareButtonLabel(text) {
  const label = elements.createShareButton?.querySelector("span");
  if (label && text) {
    label.textContent = text;
  }
}

function resetCopyShareCodeButton() {
  window.clearTimeout(state.copyFeedbackTimer);
  state.copyFeedbackTimer = 0;
  const label = elements.copyShareCodeButton?.querySelector("span");
  if (label) {
    label.textContent = "复制";
  }
}

function renderShareList() {
  elements.shareList.replaceChildren();
  elements.shareSelectAll.checked = false;
  elements.shareSelectAll.indeterminate = false;
  const query = normalizeText(elements.shareSearchInput?.value || "");

  if (!state.scores.length && !state.folders.length) {
    elements.shareList.append(createEmptyState("还没有歌谱", "保存歌谱后就可以分享。"));
    elements.createShareButton.disabled = true;
    elements.shareSelectAll.disabled = true;
    return;
  }

  elements.createShareButton.disabled = false;
  elements.shareSelectAll.disabled = false;

  let visibleCount = 0;

  state.folders.forEach((folder) => {
    const folderScores = state.scores.filter((score) => score.folderId === folder.id);
    const folderMatches = query && folder.normalizedName.includes(query);
    const visibleFolderScores = query && !folderMatches
      ? folderScores.filter((score) => scoreMatchesQuery(score, query))
      : folderScores;

    if (query && !folderMatches && !visibleFolderScores.length) {
      return;
    }

    elements.shareList.append(createShareFolderGroup(folder, visibleFolderScores, { expanded: Boolean(query) }));
    visibleCount += 1;
  });

  state.scores
    .filter((score) => !score.folderId)
    .filter((score) => scoreMatchesQuery(score, query))
    .forEach((score) => {
      elements.shareList.append(createShareScoreOption(score));
      visibleCount += 1;
    });

  if (!visibleCount) {
    elements.shareList.append(createEmptyState("没有找到歌谱", "换个名字试试。"));
    elements.shareSelectAll.disabled = true;
  }

  updateShareSelectAllState();
}

function createShareScoreOption(score, options = {}) {
  const label = document.createElement("label");
  label.className = options.child ? "share-option share-child-option" : "share-option";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = score.id;
  checkbox.dataset.shareSelect = "true";
  checkbox.dataset.shareKind = "score";
  checkbox.dataset.scoreId = score.id;
  if (options.folderId) {
    checkbox.dataset.folderId = options.folderId;
    if (state.shareSelectedFolderIds.has(options.folderId)) {
      checkbox.checked = true;
      checkbox.disabled = true;
    }
  }
  if (!checkbox.checked) {
    checkbox.checked = state.shareSelectedScoreIds.has(score.id);
  }
  const text = document.createElement("span");
  text.textContent = score.name;
  label.append(checkbox, text);
  return label;
}

function createShareFolderGroup(folder, folderScores = state.scores.filter((score) => score.folderId === folder.id), options = {}) {
  const group = document.createElement("div");
  group.className = "share-folder-group";
  group.dataset.folderId = folder.id;
  if (options.expanded) {
    group.classList.add("is-expanded");
  }

  const row = document.createElement("div");
  row.className = "share-option share-folder-option";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = folder.id;
  checkbox.dataset.shareSelect = "true";
  checkbox.dataset.shareKind = "folder";
  checkbox.dataset.folderId = folder.id;
  checkbox.checked = state.shareSelectedFolderIds.has(folder.id);

  const nameButton = document.createElement("button");
  nameButton.className = "share-folder-name";
  nameButton.type = "button";
  nameButton.setAttribute("aria-expanded", String(Boolean(options.expanded)));
  const icon = createIcon("folder");
  const text = document.createElement("span");
  text.textContent = folder.name;
  const count = document.createElement("small");
  count.textContent = `${folderScores.length} 份歌谱`;
  nameButton.append(icon, text, count);
  nameButton.addEventListener("click", () => {
    const expanded = group.classList.toggle("is-expanded");
    childList.hidden = !expanded;
    nameButton.setAttribute("aria-expanded", String(expanded));
  });

  row.append(checkbox, nameButton);
  group.append(row);

  const childList = document.createElement("div");
  childList.className = "share-folder-children";
  childList.hidden = !options.expanded;
  if (folderScores.length) {
    folderScores.forEach((score) => childList.append(createShareScoreOption(score, { child: true, folderId: folder.id })));
  } else {
    const empty = document.createElement("p");
    empty.className = "share-folder-empty";
    empty.textContent = "这个文件夹里还没有歌谱";
    childList.append(empty);
  }
  group.append(childList);

  return group;
}

function handleShareSelectAllChange() {
  const checked = elements.shareSelectAll.checked;
  elements.shareList.querySelectorAll("input[data-share-select]").forEach((input) => {
    input.checked = checked;
    input.disabled = false;
    storeShareSelection(input);
  });
  elements.shareList.querySelectorAll("input[data-share-kind='folder']").forEach((input) => {
    syncShareFolderChildren(input.dataset.folderId, checked);
  });
  updateShareSelectAllState();
}

function handleShareSelectionChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.dataset.shareSelect) {
    return;
  }

  if (input.dataset.shareKind === "folder") {
    storeShareSelection(input);
    syncShareFolderChildren(input.dataset.folderId, input.checked);
  } else {
    storeShareSelection(input);
  }
  updateShareSelectAllState();
}

function storeShareSelection(input) {
  if (input.dataset.shareKind === "folder") {
    const folderId = input.dataset.folderId || input.value;
    if (input.checked) {
      state.shareSelectedFolderIds.add(folderId);
      state.scores
        .filter((score) => score.folderId === folderId)
        .forEach((score) => state.shareSelectedScoreIds.delete(score.id));
    } else {
      state.shareSelectedFolderIds.delete(folderId);
    }
    return;
  }

  if (input.dataset.shareKind === "score") {
    const scoreId = input.dataset.scoreId || input.value;
    if (input.checked) {
      state.shareSelectedScoreIds.add(scoreId);
    } else {
      state.shareSelectedScoreIds.delete(scoreId);
    }
  }
}

function syncShareFolderChildren(folderId, folderChecked) {
  if (!folderId) {
    return;
  }

  Array.from(elements.shareList.querySelectorAll("input[data-share-kind='score']")).forEach((input) => {
    if (input.dataset.folderId !== folderId) {
      return;
    }
    input.checked = folderChecked;
    input.disabled = folderChecked;
    if (folderChecked) {
      state.shareSelectedScoreIds.delete(input.dataset.scoreId || input.value);
    } else {
      state.shareSelectedScoreIds.delete(input.dataset.scoreId || input.value);
    }
  });
}

function updateShareSelectAllState() {
  const inputs = Array.from(elements.shareList.querySelectorAll("input[data-share-select]"));
  if (!inputs.length) {
    elements.shareSelectAll.checked = false;
    elements.shareSelectAll.indeterminate = false;
    return;
  }

  const checkedCount = inputs.filter((input) => input.checked).length;
  elements.shareSelectAll.checked = checkedCount === inputs.length;
  elements.shareSelectAll.indeterminate = checkedCount > 0 && checkedCount < inputs.length;
}

function getSelectedShareTargets() {
  const folderIds = new Set(state.shareSelectedFolderIds);
  const scoreIds = new Set(state.shareSelectedScoreIds);

  return {
    folderIds: Array.from(folderIds),
    scoreIds: Array.from(scoreIds),
  };
}

async function ensureShareTargetsReady(targets) {
  if (!state.cloudReady || !state.session) {
    throw new Error("请先登录账号后再生成同步码。");
  }

  await waitForBackgroundSync();

  const userId = state.session.user.id;
  const folderIds = new Set((targets.folderIds || []).filter(Boolean));
  const scoreIds = new Set((targets.scoreIds || []).filter(Boolean));
  const selectedFolders = state.folders.filter((folder) => folderIds.has(folder.id)).map((folder) => ({ ...folder, userId }));
  let selectedScores = state.scores
    .filter((score) => scoreIds.has(score.id) || folderIds.has(score.folderId))
    .map((score) => ({
      ...toScoreRecord(score),
      userId,
    }));

  if (!selectedScores.length) {
    throw new Error("没有可分享的歌谱。");
  }

  const selectedScoreIds = new Set(selectedScores.map((score) => score.id));
  const uploadedBeforeShare = await ensureShareScoresUploaded(selectedScoreIds);
  if (uploadedBeforeShare) {
    selectedScores = state.scores
      .filter((score) => scoreIds.has(score.id) || folderIds.has(score.folderId))
      .map((score) => ({
        ...toScoreRecord(score),
        userId,
      }));
  }
  const selectedPages = state.scorePages
    .filter((page) => selectedScoreIds.has(page.scoreId))
    .map((page) => ({ ...page, userId: page.userId || userId }));

  let uploadIndex = 0;
  const pageNeedsUpload = (page) => pageBlobNeedsCloudUpload(page);
  const uploadTotal = selectedPages.filter(pageNeedsUpload).length;
  const uploadedPages = await runWithConcurrency(selectedPages, SHARE_UPLOAD_CONCURRENCY, async (page) => {
    let storagePath = page.storagePath || null;
    let storageSyncedAt = page.storageSyncedAt || null;
    let pageSize = page.size;
    let shouldUploadBlob = pageNeedsUpload(page);
    const blob = shouldUploadBlob ? await getPageBlob(page) : null;
    const hasBlob = Boolean(blob && blob.size > 0);
    if (shouldUploadBlob && !hasBlob && storagePath) {
      shouldUploadBlob = false;
    }

    if (!storagePath && !hasBlob) {
      const score = state.scores.find((item) => item.id === page.scoreId);
      throw new Error(`《${score?.name || "未命名歌谱"}》第 ${page.pageIndex + 1} 页还没有云端图片，请在原设备刷新同步后再分享。`);
    }

    if (shouldUploadBlob) {
      uploadIndex += 1;
      if (uploadTotal > 0) {
        const message = `正在上传分享图片 ${uploadIndex} / ${uploadTotal}...`;
        setStatus(message);
        setShareDialogStatus(message);
      }
      const cloudPath = getPageUploadPath(userId, page, storagePath);
      storagePath = await uploadCloudFile(cloudPath, blob, `${page.id}.${getExtensionFromType(page.type)}`);
      storageSyncedAt = new Date().toISOString();
      pageSize = blob.size;
      await markPageAssetStorageSynced(page, {
        storagePath,
        storageSyncedAt,
        storageUploadVersion: STORAGE_UPLOAD_VERSION,
        size: pageSize,
      });
    }

    const readyPage = {
      ...page,
      size: pageSize,
      storagePath,
      storageSyncedAt,
      storageUploadVersion: storageSyncedAt ? STORAGE_UPLOAD_VERSION : page.storageUploadVersion,
      syncStatus: SYNC_STATUS_SYNCED,
    };
    return readyPage;
  });

  uploadedPages.forEach(replaceLocalPage);

  if (selectedFolders.length) {
    await upsertCloud(CLOUD_TABLES.folders, selectedFolders.map(toCloudFolder));
  }
  if (selectedScores.length) {
    await upsertCloud(CLOUD_TABLES.scores, selectedScores.map(toCloudScore));
  }
  if (uploadedPages.length) {
    await upsertCloud(CLOUD_TABLES.pages, uploadedPages.map(toCloudPage));
    await markLocalSynced(
      selectedFolders.map((folder) => ({ ...folder, syncStatus: SYNC_STATUS_SYNCED })),
      selectedScores.map((score) => ({ ...score, syncStatus: SYNC_STATUS_SYNCED })),
      uploadedPages,
    );
    await loadScores();
  }
}

async function ensureShareScoresUploaded(selectedScoreIds) {
  const scoreIds = Array.from(selectedScoreIds || []).filter(Boolean);
  const scoreIdsNeedingUpload = scoreIds.filter((scoreId) =>
    state.scorePages.some((page) => page.scoreId === scoreId && pageBlobNeedsCloudUpload(page)),
  );

  if (!scoreIdsNeedingUpload.length) {
    return false;
  }

  setShareDialogStatus(`正在直传 ${scoreIdsNeedingUpload.length} 份歌谱的图片，请稍候...`);
  await runWithConcurrency(scoreIdsNeedingUpload, 1, async (scoreId) => {
    await startScoreCloudUpload(scoreId);
  });
  await loadScores();
  return true;
}

async function waitForBackgroundSync() {
  if (!state.syncing) {
    return;
  }

  setStatus("正在等待后台同步结束...");
  setShareDialogStatus("正在等待后台同步结束...");
  try {
    await waitUntil(() => !state.syncing, SHARE_SYNC_WAIT_TIMEOUT, "后台同步耗时较久，已先为本次分享单独准备图片。");
  } catch (error) {
    console.warn(error);
  }
}

function waitUntil(predicate, timeoutMs, timeoutMessage) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (predicate()) {
        resolve();
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        reject(new Error(timeoutMessage || "等待超时。"));
        return;
      }
      window.setTimeout(tick, 200);
    };
    tick();
  });
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, runWorker);
  await Promise.all(workers);
  return results;
}

async function createShareCode(event) {
  event.preventDefault();
  if (!requireCloudSession()) {
    return;
  }

  const selectedTargets = getSelectedShareTargets();
  if (!selectedTargets.scoreIds.length && !selectedTargets.folderIds.length) {
    setStatus("请至少选择一份歌谱。", true);
    setShareDialogStatus("请至少选择一份歌谱。", true);
    return;
  }

  elements.createShareButton.disabled = true;
  setCreateShareButtonLabel("生成中...");
  try {
    setStatus("正在生成同步码...");
    setShareDialogStatus("正在生成同步码...");
    const { code, shareId, totalCount } = await insertShareBatch(selectedTargets);
    elements.shareCodeText.textContent = code;
    elements.shareCodePanel.hidden = false;
    setStatus("同步码已生成，图片将在后台继续同步。");
    setShareDialogStatus(totalCount ? `同步码已生成，正在后台同步 0 / ${totalCount} 页。` : "同步码已生成，可以复制分享。");
    queueShareBatchPreparation(shareId, selectedTargets, code);
  } catch (error) {
    console.error(error);
    setStatus(error.message || "生成同步码失败。", true);
    setShareDialogStatus(error.message || "生成同步码失败。", true);
  } finally {
    elements.createShareButton.disabled = false;
    setCreateShareButtonLabel("生成同步码");
  }
}

async function copyShareCode() {
  const code = elements.shareCodeText.textContent.trim();
  if (!code) {
    return;
  }

  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(code);
    } else {
      copyTextWithFallback(code);
    }
    setStatus("同步码已复制。");
    setShareDialogStatus("同步码已复制。");
    showCopyShareCodeFeedback();
  } catch (error) {
    console.error(error);
    setStatus("复制失败，请长按同步码手动复制。", true);
    setShareDialogStatus("复制失败，请长按同步码手动复制。", true);
  }
}

function showCopyShareCodeFeedback() {
  const label = elements.copyShareCodeButton?.querySelector("span");
  if (!label) {
    return;
  }

  window.clearTimeout(state.copyFeedbackTimer);
  label.textContent = "已复制";
  state.copyFeedbackTimer = window.setTimeout(() => {
    label.textContent = "复制";
    state.copyFeedbackTimer = 0;
  }, 1600);
}

function copyTextWithFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.left = "-1000px";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Clipboard fallback failed.");
  }
}

async function insertShareBatch(targets) {
  const scoreIds = Array.from(new Set((targets.scoreIds || []).filter(Boolean)));
  const folderIds = Array.from(new Set((targets.folderIds || []).filter(Boolean)));
  const totalCount = countShareTargetPages(scoreIds, folderIds);
  if (!totalCount) {
    throw new Error("没有可分享的歌谱。");
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const code = createShareCodeValue();
    const now = new Date().toISOString();
    const shareId = createId();
    await upsertCloud(CLOUD_TABLES.shareBatches, [
      createShareBatchRecord({
        shareId,
        code,
        folderIds,
        scoreIds,
        totalCount,
        uploadedCount: 0,
        status: "uploading",
        items: [],
        createdAt: now,
        updatedAt: now,
      }),
    ]);

    return { code, shareId, totalCount };
  }

  throw new Error("同步码生成失败，请重试。");
}

function countShareTargetPages(scoreIds, folderIds) {
  const folderIdSet = new Set(folderIds);
  const scoreIdSet = new Set(scoreIds);
  return state.scores
    .filter((score) => scoreIdSet.has(score.id) || folderIdSet.has(score.folderId))
    .reduce((total, score) => total + (score.pages?.length || 0), 0);
}

function createShareBatchRecord({
  shareId,
  code,
  folderIds,
  scoreIds,
  totalCount,
  uploadedCount,
  status,
  items,
  createdAt,
  updatedAt,
}) {
  const canEmbedItems = Array.isArray(items) && items.length && estimateJsonBytes(items) <= SHARE_BATCH_EMBED_LIMIT;
  return {
    id: shareId,
    owner_id: state.session.user.id,
    code,
    payload_version: 4,
    status,
    total_count: totalCount,
    uploaded_count: uploadedCount,
    folder_ids: folderIds,
    score_ids: scoreIds,
    item_count: Array.isArray(items) ? items.length : 0,
    items: canEmbedItems ? items : [],
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

function queueShareBatchPreparation(shareId, targets, code) {
  if (!shareId || state.shareTasks.has(shareId)) {
    return;
  }

  state.shareTasks.add(shareId);
  window.setTimeout(() => {
    prepareShareBatch(shareId, targets, code)
      .catch((error) => {
        console.error(error);
        setStatus(error.message || "分享图片后台同步失败，请稍后重试。", true);
        setShareDialogStatus(error.message || "分享图片后台同步失败，请稍后重试。", true);
      })
      .finally(() => {
        state.shareTasks.delete(shareId);
      });
  }, 0);
}

async function prepareShareBatch(shareId, targets, code) {
  const folderIds = Array.from(new Set((targets.folderIds || []).filter(Boolean)));
  const scoreIds = Array.from(new Set((targets.scoreIds || []).filter(Boolean)));
  const startedAt = new Date().toISOString();
  let items = createShareItemsForBatch(shareId, scoreIds, folderIds, startedAt);
  const totalCount = countSharePages(items);
  let uploadedCount = countUploadedSharePages(items);

  if (items.length) {
    await upsertCloud(CLOUD_TABLES.shareItems, items);
  }
  await upsertCloud(CLOUD_TABLES.shareBatches, [
    createShareBatchRecord({
      shareId,
      code,
      folderIds,
      scoreIds,
      totalCount,
      uploadedCount,
      status: uploadedCount >= totalCount ? "completed" : "uploading",
      items,
      createdAt: startedAt,
      updatedAt: new Date().toISOString(),
    }),
  ]);
  setShareDialogStatus(totalCount ? `同步码已生成，正在后台同步 ${uploadedCount} / ${totalCount} 页。` : "同步码已生成，可以复制分享。");

  const selectedScoreIds = getShareTargetScoreIds(scoreIds, folderIds);
  const scoreIdsNeedingUpload = selectedScoreIds.filter((scoreId) =>
    state.scorePages.some((page) => page.scoreId === scoreId && pageBlobNeedsCloudUpload(page)),
  );

  if (scoreIdsNeedingUpload.length) {
    await runWithConcurrency(scoreIdsNeedingUpload, SHARE_BACKGROUND_UPLOAD_CONCURRENCY, async (scoreId) => {
      await startScoreCloudUpload(scoreId);
      await loadScores();
      items = createShareItemsForBatch(shareId, scoreIds, folderIds, startedAt);
      uploadedCount = countUploadedSharePages(items);
      if (items.length) {
        await upsertCloud(CLOUD_TABLES.shareItems, items);
      }
      await upsertCloud(CLOUD_TABLES.shareBatches, [
        createShareBatchRecord({
          shareId,
          code,
          folderIds,
          scoreIds,
          totalCount,
          uploadedCount,
          status: uploadedCount >= totalCount ? "completed" : "uploading",
          items,
          createdAt: startedAt,
          updatedAt: new Date().toISOString(),
        }),
      ]);
      setShareDialogStatus(`同步码已生成，正在后台同步 ${uploadedCount} / ${totalCount} 页。`);
    });
  }

  await loadScores();
  items = createShareItemsForBatch(shareId, scoreIds, folderIds, startedAt);
  uploadedCount = countUploadedSharePages(items);
  if (items.length) {
    await upsertCloud(CLOUD_TABLES.shareItems, items);
  }
  await upsertCloud(CLOUD_TABLES.shareBatches, [
    createShareBatchRecord({
      shareId,
      code,
      folderIds,
      scoreIds,
      totalCount,
      uploadedCount,
      status: uploadedCount >= totalCount ? "completed" : "uploading",
      items,
      createdAt: startedAt,
      updatedAt: new Date().toISOString(),
    }),
  ]);
  setShareDialogStatus(
    uploadedCount >= totalCount
      ? "分享图片已同步完成，可以复制同步码。"
      : `同步码已生成，已同步 ${uploadedCount} / ${totalCount} 页。`,
  );
}

function estimateJsonBytes(value) {
  const json = JSON.stringify(value);
  if (typeof TextEncoder === "function") {
    return new TextEncoder().encode(json).length;
  }
  return json.length * 2;
}

function getShareTargetScoreIds(scoreIds, folderIds) {
  const scoreIdSet = new Set(scoreIds);
  const folderIdSet = new Set(folderIds);
  return state.scores
    .filter((score) => scoreIdSet.has(score.id) || folderIdSet.has(score.folderId))
    .map((score) => score.id);
}

function createShareItemsForBatch(shareId, scoreIds, folderIds, createdAt = new Date().toISOString()) {
  return buildShareItems(scoreIds, folderIds).map((item) => ({
    ...item,
    id: createShareItemId(shareId, item),
    share_id: shareId,
    created_at: item.created_at || createdAt,
    updated_at: new Date().toISOString(),
  }));
}

function createShareItemId(shareId, item) {
  const key = item.item_type === "folder" ? item.folder_id : item.score_id;
  return `${shareId}_${item.item_type}_${sanitizeShareItemKey(key)}`;
}

function sanitizeShareItemKey(value) {
  return String(value || "item").replace(/[^a-zA-Z0-9_-]/g, "_");
}

function countSharePages(items) {
  return items.reduce((total, item) => total + (Array.isArray(item.pages) ? item.pages.length : 0), 0);
}

function countUploadedSharePages(items) {
  return items.reduce(
    (total, item) =>
      total + (Array.isArray(item.pages) ? item.pages.filter((page) => page.storage_path || page.upload_status === "success").length : 0),
    0,
  );
}

function hasPendingSharePages(items) {
  return items.some((item) => Array.isArray(item.pages) && item.pages.some((page) => !page.storage_path));
}

function buildShareItems(scoreIds, folderIds) {
  const items = [];
  const addedScoreIds = new Set();

  folderIds.forEach((folderId) => {
    const folder = state.folders.find((item) => item.id === folderId);
    if (!folder) {
      return;
    }

    items.push(createFolderShareItem(folder));
    state.scores
      .filter((score) => score.folderId === folder.id)
      .forEach((score) => {
        const item = createScoreShareItem(score, folder.id);
        if (item) {
          items.push(item);
          addedScoreIds.add(score.id);
        }
      });
  });

  scoreIds.forEach((scoreId) => {
    if (addedScoreIds.has(scoreId)) {
      return;
    }

    const score = state.scores.find((item) => item.id === scoreId);
    const item = score ? createScoreShareItem(score, null) : null;
    if (item) {
      items.push(item);
      addedScoreIds.add(scoreId);
    }
  });

  return items;
}

function createFolderShareItem(folder) {
  return {
    item_type: "folder",
    folder_id: folder.id,
    score_id: null,
    folder_name: folder.name,
    folder_normalized_name: folder.normalizedName,
  };
}

function createScoreShareItem(score, sharedFolderId) {
  const pages = (score.pages || [])
    .sort((a, b) => a.pageIndex - b.pageIndex)
    .map((page, index) => ({
      page_id: page.id,
      page_index: index,
      name: page.name || `第 ${index + 1} 页`,
      type: page.type || "image/jpeg",
      size: page.size || page.blob?.size || 0,
      storage_path: page.storagePath || null,
      upload_status: page.storagePath ? "success" : "pending",
    }));

  if (!pages.length) {
    return null;
  }

  return {
    item_type: "score",
    folder_id: sharedFolderId || null,
    score_id: score.id,
    score_name: score.name,
    score_normalized_name: score.normalizedName,
    tags: normalizeTags(score.tags),
    key_signature: score.keySignature || "",
    usage: score.usage || "",
    notes: score.notes || "",
    pages,
  };
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
    const importResult = await importScoresByShareCode(code);
    closeImportShareDialog();
    await loadScores();
    setStatus(formatImportShareResult(importResult));
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

  const items = await loadShareItems(batch);
  if (!items.length && Number(batch.payload_version) >= 4) {
    return {
      scoreCount: 0,
      folderCount: 0,
      pending: batch.status !== "completed",
      uploadedCount: Number(batch.uploaded_count) || 0,
      totalCount: Number(batch.total_count) || 0,
    };
  }

  const snapshotItems = items.filter((item) => item.item_type === "folder" || item.item_type === "score");
  const hasSnapshotPayload =
    Number(batch.payload_version) >= 2 ||
    snapshotItems.some((item) => Array.isArray(item.pages) || item.folder_name || item.score_name);
  if (hasSnapshotPayload) {
    const result = await importScoresFromShareSnapshot(snapshotItems);
    result.pending = batch.status !== "completed" || hasPendingSharePages(snapshotItems);
    result.uploadedCount = Number(batch.uploaded_count) || countUploadedSharePages(snapshotItems);
    result.totalCount = Number(batch.total_count) || countSharePages(snapshotItems);
    queueSync();
    return result;
  }

  const explicitScoreIds = uniqueValues(items.map((item) => item.score_id));
  const folderIds = uniqueValues(items.map((item) => item.folder_id));
  if (!explicitScoreIds.length && !folderIds.length) {
    return { scoreCount: 0, folderCount: 0 };
  }

  const [sharedFoldersRaw, explicitScoresRaw, folderScoresRaw] = await Promise.all([
    folderIds.length ? queryCloudRowsByIds(CLOUD_TABLES.folders, "id", folderIds) : [],
    explicitScoreIds.length ? queryCloudRowsByIds(CLOUD_TABLES.scores, "id", explicitScoreIds) : [],
    folderIds.length ? queryCloudRowsByIds(CLOUD_TABLES.scores, "folder_id", folderIds) : [],
  ]);
  const sharedFolders = sharedFoldersRaw.filter(isCloudRowActive);
  const explicitScores = explicitScoresRaw.filter(isCloudRowActive);
  const folderScores = folderScoresRaw.filter(isCloudRowActive);
  const folderScoreSourceIds = new Set(folderScores.map((score) => score.id));
  const allScoreIds = uniqueValues([
    ...explicitScores.map((score) => score.id),
    ...folderScores.map((score) => score.id),
  ]);
  const sharedPageRows = allScoreIds.length
    ? await queryCloudRowsByIds(CLOUD_TABLES.pages, "score_id", allScoreIds, {}, {
      orderBy: [["page_index", "asc"]],
    })
    : [];
  const sharedPages = sharedPageRows.filter(isCloudRowActive);

  const existingScoreScopes = createScoreNameScopeMap();
  const sharedFolderById = new Map(sharedFolders.map((folder) => [folder.id, folder]));
  const folderTargetByName = createFolderTargetMap();
  const userId = state.session.user.id;
  const result = { scoreCount: 0, folderCount: 0 };

  for (const folderId of folderIds) {
    const sharedFolder = sharedFolderById.get(folderId);
    if (!sharedFolder) {
      continue;
    }

    const sourceScores = folderScores.filter((score) => score.folder_id === folderId);
    const folderName = getSharedFolderName(sharedFolder.name);
    const normalizedFolderName = getSharedFolderNormalizedName(sharedFolder);
    let targetFolderId = folderTargetByName.get(normalizedFolderName) || null;
    const hasImportableScores = targetFolderId
      ? sourceScores.some((score) => !existingScoreScopes.has(getScoreNameScopeKey(score.name, targetFolderId)))
      : sourceScores.length > 0;
    if (!targetFolderId) {
      if (sourceScores.length && !hasImportableScores) {
        continue;
      }

      const now = new Date().toISOString();
      const newFolder = {
        id: createId(),
        userId,
        name: folderName,
        normalizedName: normalizedFolderName,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        syncStatus: SYNC_STATUS_SYNCED,
      };
      await putFolder(newFolder);
      await upsertCloud(CLOUD_TABLES.folders, [toCloudFolder(newFolder)]);
      folderTargetByName.set(normalizedFolderName, newFolder.id);
      targetFolderId = newFolder.id;
      result.folderCount += 1;
    }

    for (const sharedScore of sourceScores) {
      const imported = await importSharedScoreRow(sharedScore, sharedPages, userId, targetFolderId, existingScoreScopes);
      if (imported) {
        result.scoreCount += 1;
      }
    }
  }

  for (const sharedScore of explicitScores) {
    if (folderScoreSourceIds.has(sharedScore.id)) {
      continue;
    }
    const imported = await importSharedScoreRow(sharedScore, sharedPages, userId, null, existingScoreScopes);
    if (imported) {
      result.scoreCount += 1;
    }
  }

  queueSync();
  return result;
}

async function loadShareItems(batch) {
  if (Array.isArray(batch.items) && batch.items.length) {
    return batch.items;
  }

  try {
    return await queryCloudRows(CLOUD_TABLES.shareItems, { share_id: batch.id });
  } catch (error) {
    if (Array.isArray(batch.items) && batch.items.length) {
      return batch.items;
    }
    throw error;
  }
}

async function importScoresFromShareSnapshot(items) {
  const folders = items.filter((item) => item.item_type === "folder");
  const scores = items.filter((item) => item.item_type === "score" && Array.isArray(item.pages));
  const existingScoreScopes = createScoreNameScopeMap();
  const userId = state.session.user.id;
  const folderIdMap = new Map();
  const folderTargetByName = createFolderTargetMap();
  const result = { scoreCount: 0, folderCount: 0 };

  for (const folderItem of folders) {
    const folderScores = scores.filter((score) => score.folder_id === folderItem.folder_id);
    const sourceShareId = folderItem.share_id || null;
    const sourceFolderId = String(folderItem.folder_id || "");
    const existingSharedFolder = sourceShareId
      ? state.folders.find((folder) => folder.sourceShareId === sourceShareId && folder.sourceFolderId === sourceFolderId)
      : null;
    const folderName = getSharedFolderName(folderItem.folder_name);
    const normalizedFolderName = getSharedFolderNormalizedName(folderItem);
    const existingNamedFolderId = folderTargetByName.get(normalizedFolderName) || null;
    const targetFolderId = existingSharedFolder?.id || existingNamedFolderId;
    const hasImportableScores = targetFolderId
      ? folderScores.some(
        (score) =>
          !existingScoreScopes.has(getScoreNameScopeKey(score.score_name || "未命名歌谱", targetFolderId)) &&
          shareScoreHasReadyPages(score),
      )
      : folderScores.some(shareScoreHasReadyPages);
    if (targetFolderId) {
      folderIdMap.set(folderItem.folder_id, targetFolderId);
      continue;
    }
    if (folderScores.length && !hasImportableScores) {
      continue;
    }

    const now = new Date().toISOString();
    const newFolder = {
      id: createId(),
      userId,
      name: folderName,
      normalizedName: normalizedFolderName,
      sourceShareId,
      sourceFolderId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: SYNC_STATUS_SYNCED,
    };
    await putFolder(newFolder);
    await upsertCloud(CLOUD_TABLES.folders, [toCloudFolder(newFolder)]);
    folderTargetByName.set(normalizedFolderName, newFolder.id);
    folderIdMap.set(folderItem.folder_id, newFolder.id);
    result.folderCount += 1;
  }

  for (const scoreItem of scores) {
    const targetFolderId = scoreItem.folder_id ? folderIdMap.get(scoreItem.folder_id) || null : null;
    const imported = await importSharedScoreSnapshot(scoreItem, userId, targetFolderId, existingScoreScopes);
    if (imported) {
      result.scoreCount += 1;
    }
  }

  return result;
}

async function importSharedScoreSnapshot(scoreItem, userId, folderId, existingScoreScopes) {
  return importSharedScoreRow(
    {
      id: scoreItem.score_id,
      name: scoreItem.score_name || "未命名歌谱",
      source_share_id: scoreItem.share_id,
      tags: scoreItem.tags,
      key_signature: scoreItem.key_signature,
      usage: scoreItem.usage,
      notes: scoreItem.notes,
    },
    (scoreItem.pages || []).map((page) => ({
      score_id: scoreItem.score_id,
      page_id: page.page_id,
      page_index: page.page_index,
      name: page.name,
      type: page.type,
      size: page.size,
      storage_path: page.storage_path,
    })),
    userId,
    folderId,
    existingScoreScopes,
  );
}

function shareScoreHasReadyPages(scoreItem) {
  return Array.isArray(scoreItem.pages) && scoreItem.pages.some((page) => page.storage_path);
}

async function importSharedScoreRow(sharedScore, sharedPages, userId, folderId, existingScoreScopes) {
  const normalizedName = normalizeText(sharedScore.name || "未命名歌谱");
  const scoreScopeKey = getScoreNameScopeKey(normalizedName, folderId);
  const sourceShareId = sharedScore.source_share_id || sharedScore.share_id || sharedScore.sourceShareId || null;
  const sourceScoreId = String(sharedScore.id || sharedScore.score_id || "");
  const existingSharedScore = sourceShareId
    ? state.scores.find((score) => score.sourceShareId === sourceShareId && score.sourceScoreId === sourceScoreId)
    : null;

  if (existingScoreScopes.has(scoreScopeKey) && !existingSharedScore) {
    return null;
  }

  const now = new Date().toISOString();
  const newScore =
    existingSharedScore ||
    {
      id: createId(),
      userId,
      name: sharedScore.name || "未命名歌谱",
      normalizedName,
      folderId,
      tags: normalizeTags(sharedScore.tags),
      keySignature: sharedScore.key_signature || sharedScore.keySignature || "",
      usage: sharedScore.usage || "",
      notes: sharedScore.notes || "",
      sourceShareId,
      sourceScoreId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: SYNC_STATUS_SYNCED,
    };
  const pageRows = sharedPages.filter((page) => String(page.score_id) === sourceScoreId);
  const existingPages = existingSharedScore
    ? state.scorePages.filter((page) => page.scoreId === existingSharedScore.id)
    : [];
  const existingSourcePageIds = new Set(existingPages.map((page) => page.sourcePageId).filter(Boolean));
  const existingStoragePaths = new Set(existingPages.map((page) => page.storagePath).filter(Boolean));
  const newPages = [];

  for (const [index, pageRow] of pageRows.entries()) {
    if (!pageRow.storage_path) {
      continue;
    }
    const sourcePageId = String(pageRow.page_id || `${sourceScoreId}_${pageRow.page_index ?? index}`);
    if (existingSourcePageIds.has(sourcePageId) || existingStoragePaths.has(pageRow.storage_path)) {
      continue;
    }
    const newPageId = createId();
    const pageType = pageRow.type || "image/jpeg";
    newPages.push({
      id: newPageId,
      scoreId: newScore.id,
      userId,
      pageIndex: index,
      name: pageRow.name || `第 ${index + 1} 页`,
      type: pageType,
      size: Number(pageRow.size) || 0,
      storagePath: pageRow.storage_path,
      sourceShareId,
      sourceScoreId,
      sourcePageId,
      storageSyncedAt: new Date().toISOString(),
      storageUploadVersion: STORAGE_UPLOAD_VERSION,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: SYNC_STATUS_SYNCED,
    });
  }

  if (!newPages.length) {
    return null;
  }

  if (existingSharedScore) {
    await Promise.all(newPages.map(putScorePage));
  } else {
    await putScoreWithPages(newScore, newPages);
    existingScoreScopes.set(scoreScopeKey, newScore.id);
  }
  await upsertCloud(CLOUD_TABLES.scores, [toCloudScore(newScore)]);
  await upsertCloud(CLOUD_TABLES.pages, newPages.map(toCloudPage));
  return newScore;
}

function uniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean).map(String)));
}

async function consolidateDuplicateFoldersByName() {
  const activeFolders = state.folders.filter((folder) => !folder.deletedAt);
  const folderGroups = new Map();
  activeFolders.forEach((folder) => {
    const key = getSharedFolderNormalizedName(folder);
    if (!key) {
      return;
    }

    if (!folderGroups.has(key)) {
      folderGroups.set(key, []);
    }
    folderGroups.get(key).push(folder);
  });

  const groups = Array.from(folderGroups.values()).filter((folders) => folders.length > 1);
  if (!groups.length) {
    return;
  }

  const deletedAt = new Date().toISOString();
  const movedScores = [];
  const removedScores = [];
  const removedFolders = [];

  for (const folders of groups) {
    const primaryFolder = pickFolderMergePrimary(folders);
    const duplicateFolders = folders.filter((folder) => folder.id !== primaryFolder.id);
    const primaryScoreNames = new Set(
      state.scores
        .filter((score) => !score.deletedAt && score.folderId === primaryFolder.id)
        .map((score) => normalizeText(score.name)),
    );

    for (const duplicateFolder of duplicateFolders) {
      const duplicateScores = state.scores.filter((score) => !score.deletedAt && score.folderId === duplicateFolder.id);
      for (const score of duplicateScores) {
        const scoreName = normalizeText(score.name);
        if (primaryScoreNames.has(scoreName)) {
          removedScores.push(score);
          await markScoreDeletedRecord(score, deletedAt);
          continue;
        }

        const movedScore = {
          ...toScoreRecord(score),
          folderId: primaryFolder.id,
          updatedAt: deletedAt,
          syncStatus: SYNC_STATUS_PENDING,
        };
        movedScores.push(movedScore);
        primaryScoreNames.add(scoreName);
        await putScore(movedScore);
      }

      const removedFolder = {
        ...duplicateFolder,
        deletedAt,
        updatedAt: deletedAt,
        syncStatus: SYNC_STATUS_PENDING,
      };
      removedFolders.push(removedFolder);
      await putFolder(removedFolder);

      if (state.currentFolderId === duplicateFolder.id) {
        state.currentFolderId = primaryFolder.id;
      }
    }
  }

  if (!movedScores.length && !removedScores.length && !removedFolders.length) {
    return;
  }

  const removedScoreIds = new Set(removedScores.map((score) => score.id));
  const movedScoreById = new Map(movedScores.map((score) => [score.id, score]));
  const removedFolderIds = new Set(removedFolders.map((folder) => folder.id));

  state.scores = state.scores
    .map((score) => movedScoreById.get(score.id) || score)
    .filter((score) => !removedScoreIds.has(score.id));
  state.folders = state.folders.filter((folder) => !removedFolderIds.has(folder.id));
  state.scores.forEach((score) => {
    score.pages = state.scorePages
      .filter((page) => !page.deletedAt && page.scoreId === score.id)
      .sort((a, b) => a.pageIndex - b.pageIndex);
  });

  queueSync();
}

function pickFolderMergePrimary(folders) {
  return [...folders].sort((a, b) => {
    const aShared = Boolean(a.sourceShareId || a.sourceFolderId);
    const bShared = Boolean(b.sourceShareId || b.sourceFolderId);
    if (aShared !== bShared) {
      return aShared ? 1 : -1;
    }

    const aCreatedAt = Date.parse(a.createdAt || "") || 0;
    const bCreatedAt = Date.parse(b.createdAt || "") || 0;
    if (aCreatedAt !== bCreatedAt) {
      return aCreatedAt - bCreatedAt;
    }

    return String(a.id).localeCompare(String(b.id));
  })[0];
}

function createFolderTargetMap() {
  const targets = new Map();
  state.folders.forEach((folder) => {
    if (folder.deletedAt) {
      return;
    }

    const normalizedName = getSharedFolderNormalizedName(folder);
    if (normalizedName && !targets.has(normalizedName)) {
      targets.set(normalizedName, folder.id);
    }
  });
  return targets;
}

function getSharedFolderName(name) {
  return String(name || "分享文件夹").trim() || "分享文件夹";
}

function getSharedFolderNormalizedName(folder) {
  return normalizeText(
    folder?.folder_name ||
      folder?.name ||
      folder?.folder_normalized_name ||
      folder?.normalized_name ||
      folder?.normalizedName ||
      "分享文件夹",
  );
}

function formatImportShareResult(result) {
  if (result.pending) {
    const progress =
      Number(result.totalCount) > 0
        ? `已同步 ${Number(result.uploadedCount) || 0} / ${Number(result.totalCount)} 页，`
        : "";
    return `${progress}分享内容正在后台同步中，稍后再次输入同一个同步码可继续导入。`;
  }

  if (result.folderCount) {
    return `已导入 ${result.folderCount} 个文件夹 · ${result.scoreCount} 份歌谱。`;
  }

  return `已导入 ${result.scoreCount} 份分享歌谱。`;
}

function createShareCodeValue() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function resetForm(showMessage = true) {
  elements.scoreForm.reset();
  applyKeyPickerValue(elements.scoreKeyPicker, "");
  populateScoreFolders(state.currentFolderId || "");
  closeScoreFolderPicker();
  clearPendingUrls();
  state.pendingPages = [];
  state.pendingFilesProcessing = false;
  renderPending();
  updateSaveState();
  if (showMessage) {
    setStatus("");
  }
}

function updateSaveState() {
  elements.saveButton.disabled =
    operationLocks.has("saveScore") ||
    state.pendingFilesProcessing ||
    !elements.scoreName.value.trim() ||
    !state.pendingPages.length;
}

function normalizeScoreFolderScope(folderId) {
  return folderId ? String(folderId) : "";
}

function getScoreNameScopeKey(name, folderId = null) {
  const normalizedName = normalizeText(name);
  if (!normalizedName) {
    return "";
  }
  return `${normalizeScoreFolderScope(folderId)}\u0001${normalizedName}`;
}

function createScoreNameScopeMap(scores = state.scores) {
  return new Map(
    (scores || [])
      .filter((score) => !score.deletedAt)
      .map((score) => [getScoreNameScopeKey(score.name || score.normalizedName, score.folderId || null), score.id])
      .filter(([key]) => Boolean(key)),
  );
}

function hasDuplicateScoreName(name, folderId = null, excludeScoreId = "") {
  const scopeKey = getScoreNameScopeKey(name, folderId);
  if (!scopeKey) {
    return false;
  }

  return state.scores.some(
    (score) =>
      !score.deletedAt &&
      score.id !== excludeScoreId &&
      getScoreNameScopeKey(score.name || score.normalizedName, score.folderId || null) === scopeKey,
  );
}

function hasDuplicateFolderName(name, excludeFolderId = "") {
  const normalizedName = normalizeText(name);
  if (!normalizedName) {
    return false;
  }

  return state.folders.some(
    (folder) => !folder.deletedAt && folder.id !== excludeFolderId && getSharedFolderNormalizedName(folder) === normalizedName,
  );
}

function getLibraryFilter() {
  return [LIBRARY_FILTER_ALL, LIBRARY_FILTER_RECENT, LIBRARY_FILTER_FAVORITE].includes(state.libraryFilter)
    ? state.libraryFilter
    : LIBRARY_FILTER_ALL;
}

function setLibraryFilter(filter) {
  const nextFilter = [LIBRARY_FILTER_ALL, LIBRARY_FILTER_RECENT, LIBRARY_FILTER_FAVORITE].includes(filter)
    ? filter
    : LIBRARY_FILTER_ALL;
  if (state.libraryFilter === nextFilter) {
    updateLibraryFilterUi();
    return;
  }

  state.libraryFilter = nextFilter;
  renderScores();
}

function getScoreSort() {
  return [SCORE_SORT_RECENT_OPENED, SCORE_SORT_RECENT_ADDED, SCORE_SORT_NAME].includes(state.scoreSort)
    ? state.scoreSort
    : SCORE_SORT_RECENT_ADDED;
}

function getEffectiveLibrarySort(filter = getLibraryFilter()) {
  return filter === LIBRARY_FILTER_RECENT ? SCORE_SORT_RECENT_OPENED : getScoreSort();
}

function setScoreSort(sortMode) {
  const nextSort = [SCORE_SORT_RECENT_OPENED, SCORE_SORT_RECENT_ADDED, SCORE_SORT_NAME].includes(sortMode)
    ? sortMode
    : SCORE_SORT_RECENT_ADDED;
  if (state.scoreSort === nextSort) {
    updateLibraryFilterUi();
    return;
  }

  state.scoreSort = nextSort;
  renderScores();
}

function updateLibraryFilterUi() {
  const activeFilter = getLibraryFilter();
  const sortMode = getEffectiveLibrarySort(activeFilter);
  elements.libraryFilterButtons?.forEach((button) => {
    const selected = button.dataset.libraryFilter === activeFilter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
  if (elements.scoreSortSelect && elements.scoreSortSelect.value !== sortMode) {
    elements.scoreSortSelect.value = sortMode;
  }
}

function filterScoresByLibraryFilter(scores, filter) {
  if (filter === LIBRARY_FILTER_FAVORITE) {
    return scores.filter((score) => score.favorite);
  }
  if (filter === LIBRARY_FILTER_RECENT) {
    return scores.filter((score) => score.lastOpenedAt);
  }
  return scores;
}

function sortScoresForLibrary(scores, sortMode) {
  return [...scores].sort((a, b) => {
    if (sortMode === SCORE_SORT_NAME) {
      return compareScoreName(a, b);
    }

    if (sortMode === SCORE_SORT_RECENT_OPENED) {
      const openedDifference = getScoreTime(b.lastOpenedAt) - getScoreTime(a.lastOpenedAt);
      if (openedDifference !== 0) {
        return openedDifference;
      }
    } else {
      const addedDifference = getScoreTime(b.createdAt) - getScoreTime(a.createdAt);
      if (addedDifference !== 0) {
        return addedDifference;
      }
    }

    return getScoreTime(b.updatedAt) - getScoreTime(a.updatedAt) || compareScoreName(a, b);
  });
}

function compareScoreName(a, b) {
  return String(a?.name || "").localeCompare(String(b?.name || ""), "zh-Hans-CN", {
    numeric: true,
    sensitivity: "base",
  });
}

function getScoreTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatStorageShort(bytes) {
  const mb = (Number(bytes) || 0) / 1048576;
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)}G`;
  }
  return `${Math.round(mb)}M`;
}

let lastStorageUsageCheckAt = 0;
// 在谱夹筛选行右侧显示本地存储用量（弱化、不抢视觉重点）。轻度节流，避免频繁估算。
async function updateLibraryStorageUsage(force = false) {
  const el = elements.libraryStorageUsage;
  if (!el) {
    return;
  }
  if (!navigator.storage?.estimate) {
    el.hidden = true;
    return;
  }
  const now = Date.now();
  if (!force && now - lastStorageUsageCheckAt < 2000) {
    return;
  }
  lastStorageUsageCheckAt = now;
  try {
    const estimate = await navigator.storage.estimate();
    const quota = Number(estimate.quota) || 0;
    const usage = Number(estimate.usage) || 0;
    if (!quota) {
      el.hidden = true;
      return;
    }
    const percent = Math.min(100, Math.round((usage / quota) * 100));
    el.textContent = `${formatStorageShort(usage)}/${formatStorageShort(quota)}`;
    el.title = `本地存储：已用 ${formatStorageShort(usage)} / 配额 ${formatStorageShort(quota)}（约 ${percent}%）`;
    el.classList.toggle("is-high", percent >= 85);
    el.hidden = false;
  } catch (error) {
    console.warn(error);
    el.hidden = true;
  }
}

function renderScores() {
  if (isViewerActive()) {
    state.libraryRenderQueued = true;
    return;
  }

  updateLibraryStorageUsage();

  const activeScores = state.scores.filter((score) => !score.deletedAt);
  const activeFolders = state.folders.filter((folder) => !folder.deletedAt);
  const query = elements.searchInput.value.trim();
  const normalizedQuery = normalizeText(query);
  const currentFolder = getCurrentFolder();
  const inFolder = Boolean(currentFolder);
  const currentFolderId = inFolder ? currentFolder.id : null;
  const activeFilter = getLibraryFilter();
  const sortMode = getEffectiveLibrarySort(activeFilter);
  const visibleScores = activeScores.filter((score) => (score.folderId || null) === currentFolderId);
  const visibleFolders = inFolder ? [] : activeFolders;
  const globalScoreSearch = !inFolder && (Boolean(normalizedQuery) || activeFilter !== LIBRARY_FILTER_ALL);
  const scoreSource = globalScoreSearch ? activeScores : visibleScores;
  const folderSource = activeFilter === LIBRARY_FILTER_ALL ? visibleFolders : [];
  const filteredScores = sortScoresForLibrary(
    filterScoresByLibraryFilter(scoreSource, activeFilter).filter((score) => scoreMatchesQuery(score, normalizedQuery)),
    sortMode,
  );
  const filteredFolders = normalizedQuery
    ? folderSource.filter((folder) => folder.normalizedName.includes(normalizedQuery))
    : folderSource;
  const total = visibleScores.length + visibleFolders.length;
  const resultTotal = filteredScores.length + filteredFolders.length;

  updateLibraryFilterUi();
  elements.libraryTitle.textContent = currentFolder?.name || "谱夹";
  elements.folderBackButton.hidden = !inFolder;
  elements.libraryScreen.classList.toggle("is-folder-open", inFolder);
  // 启动恢复账号期间且本地暂为空：显示“正在恢复”而非“还没有歌谱”，避免误导。
  const restoringHint = state.authRestoring && !inFolder && total === 0;
  elements.librarySummary.textContent = restoringHint
    ? "正在恢复账号..."
    : inFolder
      ? `${currentFolder.name} · ${visibleScores.length} 份歌谱`
      : `${state.folders.length} 个文件夹 · ${visibleScores.length} 份歌谱`;
  elements.resultCount.textContent = normalizedQuery || activeFilter !== LIBRARY_FILTER_ALL
    ? `${resultTotal} 个结果`
    : inFolder
      ? `${visibleScores.length} 份歌谱`
      : `${state.folders.length} 个文件夹 · ${visibleScores.length} 份歌谱`;
  elements.scoreGrid.replaceChildren();

  if (!total && !normalizedQuery && activeFilter === LIBRARY_FILTER_ALL) {
    if (restoringHint) {
      elements.scoreGrid.append(createEmptyState("正在恢复账号和歌谱...", "正在从云端同步你的歌谱，请稍候。"));
      refreshIcons();
      return;
    }
    elements.scoreGrid.append(
      createEmptyState(
        inFolder ? "文件夹是空的" : "还没有歌谱",
        inFolder ? "添加几份常用乐谱，排练时会更顺手。" : "添加第一份乐谱，开始整理你的谱库。",
        {
          label: "添加歌谱",
          onClick: () => handleAddButtonClick(),
        },
      ),
    );
    refreshIcons();
    return;
  }

  if (!resultTotal) {
    const emptyTitle =
      activeFilter === LIBRARY_FILTER_FAVORITE
        ? "还没有收藏"
        : activeFilter === LIBRARY_FILTER_RECENT
          ? "还没有最近打开"
          : "没有找到";
    const emptyDetail =
      activeFilter === LIBRARY_FILTER_FAVORITE
        ? "打开歌谱后点击右上角星标收藏。"
        : activeFilter === LIBRARY_FILTER_RECENT
          ? "打开过的歌谱会显示在这里。"
          : "换一个歌谱名、标签或备注试试。";
    elements.scoreGrid.append(createEmptyState(emptyTitle, emptyDetail));
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

  return state.folders.find((folder) => !folder.deletedAt && folder.id === state.currentFolderId) || null;
}

function openFolder(id) {
  if (!id) {
    return;
  }

  if (state.currentFolderId !== id) {
    pushFolderHistory(id);
  }

  state.currentFolderId = id;
  elements.searchInput.value = "";
  renderScores();
  elements.appShell.scrollTo({ top: 0 });
}

function pushFolderHistory(id) {
  // 进入文件夹仅标记状态（不再写浏览器历史，返回由边缘手势 / 返回键驱动）。
  state.folderHistoryActive = true;
}

function openRootFolder() {
  state.currentFolderId = null;
  state.folderHistoryActive = false;
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

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const moreButton = document.createElement("button");
  moreButton.className = "more-button";
  moreButton.type = "button";
  moreButton.append(createIcon("ellipsis"), document.createTextNode("更多"));
  moreButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openFolderActionDialog(folder.id);
  });

  actions.append(moreButton);
  card.append(previewButton, name, detail, actions);
  return card;
}

// ===== 列表封面：持久化缩略图 + 启动优先加载（封面不再依赖滚动到视口或打开查看器）=====

// 取封面页：优先 coverPageId，否则取 pageIndex 最小的页。
function getCoverPage(score, pages) {
  const list = (pages || score?.pages || []).filter((page) => page && !page.deletedAt);
  if (!list.length) {
    return null;
  }
  if (score?.coverPageId) {
    const byId = list.find((page) => page.id === score.coverPageId);
    if (byId) {
      return byId;
    }
  }
  return list.slice().sort((a, b) => a.pageIndex - b.pageIndex)[0] || null;
}

// 由页面 blob 生成小封面缩略图；失败返回 null（不抛错，不影响保存/导入）。
async function createCoverThumbBlobFromPage(page) {
  const blob = await getPageBlob(page).catch(() => null);
  if (!(blob instanceof Blob) || blob.size === 0) {
    return null;
  }
  try {
    return await createThumbnailBlob(blob);
  } catch (error) {
    console.warn("封面缩略图生成失败", error);
    return null;
  }
}

// 计算封面字段（含尽量生成的缩略图）。不会抛错。
async function buildScoreCoverFields(score, pages, options = {}) {
  const coverPage = getCoverPage(score, pages);
  const fields = {
    coverPageId: coverPage?.id || null,
    coverPageUpdatedAt: coverPage?.updatedAt || null,
    coverStoragePath: coverPage?.storagePath || null,
    coverHasLocalBlob: Boolean((coverPage?.blob && coverPage.blob.size > 0) || getAssetIdForPage(coverPage)),
  };
  if (!coverPage) {
    return fields;
  }

  const sameCoverPage = score?.coverPageId === coverPage.id && score?.coverPageUpdatedAt === coverPage.updatedAt;
  // 首页未变且已有可用缩略图：直接复用，避免无意义重建。
  if (options.reuseExisting !== false && sameCoverPage && score?.coverThumbBlob && score.coverThumbBlob.size > 0) {
    fields.coverThumbBlob = score.coverThumbBlob;
    fields.coverThumbType = score.coverThumbType || score.coverThumbBlob.type || "image/webp";
    fields.coverThumbUpdatedAt = score.coverThumbUpdatedAt || new Date().toISOString();
    return fields;
  }

  const thumb = await createCoverThumbBlobFromPage(coverPage);
  if (thumb) {
    fields.coverThumbBlob = thumb;
    fields.coverThumbType = thumb.type || "image/webp";
    fields.coverThumbUpdatedAt = new Date().toISOString();
  } else if (sameCoverPage && score?.coverThumbBlob) {
    // 没生成出新图但仍是同一封面页：保留旧缩略图。
    fields.coverThumbBlob = score.coverThumbBlob;
    fields.coverThumbType = score.coverThumbType;
    fields.coverThumbUpdatedAt = score.coverThumbUpdatedAt;
  }
  return fields;
}

// 缓存 / 复用 coverThumbBlob 的 objectURL。按“内容签名”（封面更新时间 + 大小）判断是否变化，
// 而不是按 blob 实例——loadScores 每次都会从 IndexedDB 读出新 blob 实例，若按实例判断会反复
// 回收并重建 URL，导致正在显示的 <img> 指向被回收的旧 URL 而变成占位图（即“时不时变占位”）。
function getScoreCoverObjectUrl(score) {
  const blob = score?.coverThumbBlob;
  if (!blob || blob.size === 0) {
    return "";
  }
  const sig = `${score.coverThumbUpdatedAt || ""}:${score.coverPageId || ""}:${blob.size}`;
  const cached = state.scoreCoverUrls.get(score.id);
  if (cached && cached.sig === sig) {
    return cached.url;
  }
  if (cached) {
    URL.revokeObjectURL(cached.url);
  }
  const url = URL.createObjectURL(blob);
  state.scoreCoverUrls.set(score.id, { sig, url });
  return url;
}

// 让某首歌谱的封面失效（封面真正变化时调用，如页面管理替换了首页）：清掉粘性 URL 并回收旧 objectURL。
function invalidateScoreCover(scoreId) {
  state.coverDisplayUrls.delete(scoreId);
  state.coverImgElements.delete(scoreId);
  const cached = state.scoreCoverUrls.get(scoreId);
  if (cached) {
    URL.revokeObjectURL(cached.url);
    state.scoreCoverUrls.delete(scoreId);
  }
}

// 取当前可显示的封面 URL（优先级：已显示粘性URL > 持久缩略图 > 页缩略图缓存 > 本地首页 blob > 临时URL > 占位）。
// 一旦某封面显示过有效图，就记入粘性缓存并固定复用——之后任何渲染都不会再把它换回占位图。
function getScoreCoverUrl(score) {
  if (!score) {
    return SCORE_IMAGE_PLACEHOLDER;
  }
  const sticky = state.coverDisplayUrls.get(score.id);
  if (sticky) {
    return sticky;
  }
  let resolved = "";
  const coverThumbUrl = getScoreCoverObjectUrl(score);
  if (coverThumbUrl) {
    resolved = coverThumbUrl;
  } else {
    const coverPage = getCoverPage(score, score.pages);
    if (coverPage) {
      const thumbUrl = state.pageThumbUrls.get(coverPage.id);
      if (thumbUrl) {
        resolved = thumbUrl;
      } else if ((coverPage.blob && coverPage.blob.size > 0) || getAssetIdForPage(coverPage) || state.scoreUrls.has(coverPage.id)) {
        resolved = getScoreUrl(coverPage, { hydrate: false });
      } else {
        resolved = state.pageTempUrls.get(coverPage.id) || "";
      }
    }
  }
  if (resolved && resolved !== SCORE_IMAGE_PLACEHOLDER) {
    state.coverDisplayUrls.set(score.id, resolved);
    return resolved;
  }
  return SCORE_IMAGE_PLACEHOLDER;
}

// 设置封面 img 的 src；已显示的有效封面不会被重置回占位图。
function updateScoreCoverImageSource(image, score) {
  const url = getScoreCoverUrl(score);
  const isPlaceholder = url === SCORE_IMAGE_PLACEHOLDER;
  if (isPlaceholder && image.dataset.coverReady === "1") {
    return; // 不要把已显示的封面退回占位图
  }
  image.src = url;
  image.classList.toggle("is-score-placeholder", isPlaceholder);
  image.dataset.coverReady = isPlaceholder ? "0" : "1";
}

// 绑定列表封面图：不 lazy、不依赖 IntersectionObserver，立即显示。
// 仅当该封面尚未解析过（无粘性 URL）时才后台补封面；已显示过的不再重复加载（满足“只加载一次”）。
function bindScoreCoverImage(image, score) {
  const coverPage = getCoverPage(score, score.pages);
  image.dataset.scoreId = score.id;
  image.dataset.cover = "1";
  image.dataset.pageId = coverPage?.id || "";
  image.decoding = "async";
  if (coverPage?.id) {
    bindScoreImageRecovery(image, coverPage.id);
  }
  updateScoreCoverImageSource(image, score);
  if (!state.coverDisplayUrls.has(score.id)) {
    ensureScoreCoverThumb(score).catch((error) => console.warn(error));
  }
}

// 刷新列表中某首歌谱的封面 img，并记入粘性缓存（之后渲染直接复用）。
function refreshScoreCoverImage(scoreId, url) {
  if (!url || url === SCORE_IMAGE_PLACEHOLDER) {
    return;
  }
  state.coverDisplayUrls.set(scoreId, url);
  if (!elements.scoreGrid) {
    return;
  }
  elements.scoreGrid
    .querySelectorAll(`img[data-cover="1"][data-score-id="${cssEscape(scoreId)}"]`)
    .forEach((image) => {
      image.src = url;
      image.classList.remove("is-score-placeholder");
      image.dataset.coverReady = "1";
    });
}

// 读取本地 score 记录（用于写回封面字段时合并最新数据，避免覆盖用户刚改的标题/收藏等）。
function getScoreRecordById(id) {
  return readStoreRecord(STORE_NAME, String(id));
}

// 把封面字段合并写回本地 score（合并最新 DB 记录，避免覆盖用户编辑），并同步内存。
async function persistScoreCoverFields(scoreId, fields) {
  try {
    const current = await getScoreRecordById(scoreId);
    if (!current) {
      return;
    }
    const merged = { ...current, ...fields };
    await putStoreRecord(STORE_NAME, toScoreRecord(merged), LOCAL_SAVE_TIMEOUT, "封面写入超时，稍后重试。", { priority: "low" });
  } catch (error) {
    console.warn("封面字段写入失败", error);
    return;
  }
  state.scores = state.scores.map((score) => (score.id === scoreId ? { ...score, ...fields } : score));
}

// 确保某首歌谱有可显示的封面：有缩略图直接显示；本地有首页 blob 则生成并写回；
// 仅有 storagePath 则在云端就绪后取临时URL显示（完整下载由后台水合负责）。
async function ensureScoreCoverThumb(score, options = {}) {
  if (!score?.id) {
    return;
  }
  if (shouldDeferBackgroundWork()) {
    return;
  }
  if (score.coverThumbBlob && score.coverThumbBlob.size > 0) {
    const url = getScoreCoverObjectUrl(score);
    if (url) {
      refreshScoreCoverImage(score.id, url);
    }
    return;
  }
  const coverPage = getCoverPage(score, score.pages);
  if (!coverPage) {
    return;
  }

  // 本地有 blob：后台生成缩略图并写回。
  const coverBlob = await getPageBlob(coverPage);

  if (coverBlob && coverBlob.size > 0) {
    if (state.coverThumbRequests.has(score.id)) {
      return;
    }
    state.coverThumbRequests.add(score.id);
    try {
      const thumb = await createCoverThumbBlobFromPage(coverPage);
      if (thumb) {
        await persistScoreCoverFields(score.id, {
          coverPageId: coverPage.id,
          coverPageUpdatedAt: coverPage.updatedAt || null,
          coverStoragePath: coverPage.storagePath || null,
          coverHasLocalBlob: true,
          coverThumbBlob: thumb,
          coverThumbType: thumb.type || "image/webp",
          coverThumbUpdatedAt: new Date().toISOString(),
        });
        const updated = state.scores.find((item) => item.id === score.id) || { ...score, coverThumbBlob: thumb };
        const url = getScoreCoverObjectUrl(updated);
        if (url) {
          refreshScoreCoverImage(score.id, url);
        }
      } else {
        // 生成失败也先用本地 blob 直接显示封面。
        refreshScoreCoverImage(score.id, cachePageObjectUrl(coverPage, coverBlob));
      }
    } finally {
      state.coverThumbRequests.delete(score.id);
    }
    return;
  }

  // 仅有云端 storagePath：取临时URL立即显示封面。
  const storagePath = coverPage.storagePath || score.coverStoragePath;
  if (storagePath && options.includeCloud !== false && state.cloudReady && state.session) {
    if (score.coverStoragePath !== storagePath || score.coverPageId !== coverPage.id) {
      await persistScoreCoverFields(score.id, { coverStoragePath: storagePath, coverPageId: coverPage.id });
    }
    try {
      const url = await getScorePageTempUrl(coverPage);
      if (url) {
        refreshScoreCoverImage(score.id, url);
      }
    } catch (error) {
      console.warn(error);
    }
  }
}

// 启动 / 渲染后预加载全部歌谱封面（遍历当前 active scores，而非仅视口内）。
async function preloadAllScoreCovers(options = {}) {
  const scores = state.scores.slice();
  if (!scores.length) {
    return;
  }

  // 1. 已有持久缩略图的：立即显示（并记入粘性缓存）。
  scores.forEach((score) => {
    if (state.coverDisplayUrls.has(score.id)) {
      return;
    }
    if (score.coverThumbBlob && score.coverThumbBlob.size > 0) {
      const url = getScoreCoverObjectUrl(score);
      if (url) {
        refreshScoreCoverImage(score.id, url);
      }
    }
  });

  // 2. 尚未显示、且本地有首页 blob 但缺缩略图的：并发生成（限 4）。已显示过的不再处理。
  const needLocal = scores.filter((score) => {
    if (state.coverDisplayUrls.has(score.id) || (score.coverThumbBlob && score.coverThumbBlob.size > 0)) {
      return false;
    }
    const coverPage = getCoverPage(score, score.pages);
    return Boolean(coverPage && (coverPage.blob?.size > 0 || getAssetIdForPage(coverPage)));
  });
  if (needLocal.length) {
    await runWithConcurrency(needLocal, 4, (score) => ensureScoreCoverThumb(score));
  }

  // 3. 仅云端封面：会话就绪后批量取临时URL。
  if (options.includeCloud && state.cloudReady && state.session) {
    await preloadCloudCoverTempUrls(scores);
  }
}

// 批量获取云端封面页临时URL并立即刷新封面（每批 20 个，先显示再后台下载原图）。
async function preloadCloudCoverTempUrls(scores) {
  const targets = [];
  (scores || []).forEach((score) => {
    if (state.coverDisplayUrls.has(score.id) || (score.coverThumbBlob && score.coverThumbBlob.size > 0)) {
      return;
    }
    const coverPage = getCoverPage(score, score.pages);
    if (!coverPage || (coverPage.blob && coverPage.blob.size > 0)) {
      return;
    }
    const storagePath = coverPage.storagePath || score.coverStoragePath;
    if (!storagePath) {
      return;
    }
    const existing = state.pageTempUrls.get(coverPage.id);
    if (existing) {
      refreshScoreCoverImage(score.id, existing);
      return;
    }
    targets.push({ score, coverPage, storagePath });
  });
  if (!targets.length) {
    return;
  }
  if (!(await ensureCloudMediaReady())) {
    return;
  }

  for (const chunk of chunkArray(targets, 20)) {
    try {
      const urlMap = await getCloudFileTempUrls(chunk.map((item) => item.storagePath));
      chunk.forEach(({ score, coverPage, storagePath }) => {
        const url = urlMap.get(storagePath);
        if (url) {
          state.pageTempUrls.set(coverPage.id, url);
          refreshScoreCoverImage(score.id, url);
        }
      });
    } catch (error) {
      console.warn("封面临时链接获取失败", error);
    }
    await nextFrame();
  }
  // 后台下载首页原图，下载完成后会生成持久封面缩略图。
  queueBackgroundPageHydration();
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

  const coverPage = getCoverPage(score, score.pages);
  const hasCover = Boolean(coverPage) || Boolean(score.coverThumbBlob && score.coverThumbBlob.size > 0);
  if (hasCover) {
    // 复用已存在的封面 <img> 元素：移动 DOM 元素会保留其已解码的位图，
    // 因此进出查看器/重渲染列表时封面不会重新加载、不会闪。
    let image = state.coverImgElements.get(score.id);
    if (image) {
      image.alt = `《${score.name}》封面`;
      updateScoreCoverImageSource(image, score);
      if (!state.coverDisplayUrls.has(score.id)) {
        ensureScoreCoverThumb(score).catch((error) => console.warn(error));
      }
    } else {
      image = document.createElement("img");
      image.draggable = false;
      image.alt = `《${score.name}》封面`;
      state.coverImgElements.set(score.id, image);
      bindScoreCoverImage(image, score);
    }
    previewButton.append(image);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "score-preview-placeholder";
    placeholder.append(createIcon("music-2"));
    previewButton.append(placeholder);
  }
  if (score.favorite) {
    const favoriteMark = document.createElement("span");
    favoriteMark.className = "score-favorite-mark";
    favoriteMark.append(createIcon("star"));
    previewButton.append(favoriteMark);
  }

  const name = document.createElement("h3");
  name.className = "score-name";
  name.textContent = score.name;

  const detail = document.createElement("p");
  detail.className = "score-detail";
  detail.textContent = [`${score.pages.length} 页`, score.keySignature].filter(Boolean).join(" · ");

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const moreButton = document.createElement("button");
  moreButton.className = "more-button";
  moreButton.type = "button";
  moreButton.append(createIcon("ellipsis"), document.createTextNode("更多"));
  moreButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openScoreActionDialog(score.id);
  });

  actions.append(moreButton);
  card.append(previewButton, name, detail);
  card.append(actions);
  return card;
}

function renderSetlists() {
  if (!elements.setlistList) {
    return;
  }

  elements.setlistList.replaceChildren();
  elements.setlistSummary.textContent = `${state.setlists.length} 个歌单`;

  if (!state.setlists.length) {
    elements.setlistList.append(createEmptyState("还没有歌单", "创建合唱排练或弥撒演出的歌单。"));
    refreshIcons();
    return;
  }

  state.setlists.forEach((setlist) => {
    elements.setlistList.append(createSetlistCard(setlist));
  });
  refreshIcons();
}

function createSetlistCard(setlist) {
  const card = document.createElement("article");
  card.className = "setlist-card";
  card.addEventListener("click", () => openSetlistViewer(setlist.id));

  const icon = document.createElement("span");
  icon.className = "setlist-card-icon";
  icon.append(createIcon("list-music"));

  const body = document.createElement("div");
  body.className = "setlist-card-body";
  const title = document.createElement("h3");
  title.textContent = setlist.name;
  const meta = document.createElement("p");
  const itemCount = getSetlistItems(setlist.id).length;
  meta.textContent = [formatSetlistDate(setlist.date), setlist.scene, `${itemCount} 首歌谱`].filter(Boolean).join(" · ");
  body.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "setlist-card-actions";
  const manageButton = document.createElement("button");
  manageButton.className = "more-button";
  manageButton.type = "button";
  manageButton.append(createIcon("square-pen"), document.createTextNode("管理"));
  manageButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openSetlistDialog(setlist.id);
  });
  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.append(createIcon("trash-2"), document.createTextNode("删除"));
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteSetlist(setlist.id);
  });
  actions.append(manageButton, deleteButton);

  card.append(icon, body, actions);
  return card;
}

function getSetlistItems(setlistId) {
  const activeScoreIds = new Set(state.scores.map((score) => score.id));
  return state.setlistItems
    .filter((item) => item.setlistId === setlistId && activeScoreIds.has(item.scoreId))
    .sort((a, b) => a.position - b.position || new Date(a.createdAt) - new Date(b.createdAt));
}

function getSetlistScores(setlistId) {
  const scoreById = new Map(state.scores.map((score) => [score.id, score]));
  return getSetlistItems(setlistId)
    .map((item) => scoreById.get(item.scoreId))
    .filter(Boolean);
}

function openSetlistDialog(setlistId = "") {
  const setlist = setlistId ? state.setlists.find((item) => item.id === setlistId) : null;
  state.editingSetlistId = setlist?.id || "";
  state.setlistDraftScoreIds = setlist ? getSetlistItems(setlist.id).map((item) => item.scoreId) : [];

  // 默认展开包含已选歌谱的文件夹，方便编辑时直接看到勾选项。
  state.setlistPickerExpandedFolders = new Set();
  const draftSet = new Set(state.setlistDraftScoreIds);
  state.scores.forEach((score) => {
    if (score.folderId && draftSet.has(score.id)) {
      state.setlistPickerExpandedFolders.add(score.folderId);
    }
  });

  elements.setlistForm.reset();
  elements.setlistDialogTitle.textContent = setlist ? "管理歌单" : "创建歌单";
  elements.setlistName.value = setlist?.name || "";
  elements.setlistDate.value = setlist?.date || new Date().toISOString().slice(0, 10);
  elements.setlistScene.value = setlist?.scene || "";
  elements.setlistScoreSearch.value = "";
  elements.deleteSetlistButton.hidden = !setlist;
  elements.deleteSetlistButton.disabled = false;
  setSetlistDialogStatus("");
  renderSetlistScorePicker();
  renderSetlistOrderList();

  if (typeof elements.setlistDialog.showModal === "function") {
    elements.setlistDialog.showModal();
  } else {
    elements.setlistDialog.setAttribute("open", "");
  }
  refreshIcons();
  requestAnimationFrame(() => elements.setlistName.focus());
}

function closeSetlistDialog() {
  state.editingSetlistId = "";
  state.setlistDraftScoreIds = [];
  state.setlistPickerExpandedFolders = new Set();
  elements.setlistForm.reset();
  elements.saveSetlistButton.disabled = false;
  elements.deleteSetlistButton.hidden = true;
  elements.deleteSetlistButton.disabled = false;
  setSetlistDialogStatus("");
  if (elements.setlistDialog.open) {
    elements.setlistDialog.close();
  } else {
    elements.setlistDialog.removeAttribute("open");
  }
}

function createSetlistScoreOption(score, selectedIds) {
  const label = document.createElement("label");
  label.className = "setlist-score-option";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.dataset.scoreId = score.id;
  checkbox.checked = selectedIds.has(score.id);
  const text = document.createElement("span");
  text.textContent = score.name;
  label.append(checkbox, text);
  return label;
}

function renderSetlistScorePicker() {
  elements.setlistScorePicker.replaceChildren();
  const query = normalizeText(elements.setlistScoreSearch.value || "");
  const searching = Boolean(query);
  const scores = state.scores.filter((score) => !score.deletedAt && scoreMatchesQuery(score, query));

  if (!scores.length) {
    elements.setlistScorePicker.append(createEmptyState(query ? "没有找到歌谱" : "还没有歌谱", query ? "换个关键词试试。" : "先在谱夹中添加歌谱。"));
    refreshIcons();
    return;
  }

  const selectedIds = new Set(state.setlistDraftScoreIds);
  const activeFolders = state.folders.filter((folder) => !folder.deletedAt);
  const folderById = new Map(activeFolders.map((folder) => [folder.id, folder]));

  // 按文件夹分组：未分类（根目录）歌谱直接列出，其余归到各自文件夹。
  const rootScores = [];
  const scoresByFolder = new Map();
  scores.forEach((score) => {
    const folderId = score.folderId && folderById.has(score.folderId) ? score.folderId : null;
    if (!folderId) {
      rootScores.push(score);
      return;
    }
    if (!scoresByFolder.has(folderId)) {
      scoresByFolder.set(folderId, []);
    }
    scoresByFolder.get(folderId).push(score);
  });

  // 文件夹排在未分类歌谱前面。
  const foldersWithScores = activeFolders
    .filter((folder) => (scoresByFolder.get(folder.id) || []).length > 0)
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "zh"));

  foldersWithScores.forEach((folder) => {
    const folderScores = scoresByFolder.get(folder.id) || [];
    // 搜索时自动展开命中文件夹，便于直接看到结果。
    const expanded = searching || state.setlistPickerExpandedFolders.has(folder.id);
    const selectedCount = folderScores.reduce((sum, score) => sum + (selectedIds.has(score.id) ? 1 : 0), 0);

    const group = document.createElement("div");
    group.className = "setlist-folder-group";
    group.classList.toggle("is-expanded", expanded);

    const header = document.createElement("button");
    header.type = "button";
    header.className = "setlist-folder-header";
    header.dataset.folderToggle = folder.id;
    header.setAttribute("aria-expanded", expanded ? "true" : "false");

    const chevron = createIcon(expanded ? "chevron-down" : "chevron-right");
    chevron.classList.add("setlist-folder-chevron");
    const folderIcon = createIcon("folder");
    folderIcon.classList.add("setlist-folder-icon");
    const nameSpan = document.createElement("span");
    nameSpan.className = "setlist-folder-name";
    nameSpan.textContent = folder.name;
    const countSpan = document.createElement("span");
    countSpan.className = "setlist-folder-count";
    countSpan.textContent = selectedCount ? `${selectedCount} / ${folderScores.length}` : String(folderScores.length);

    header.append(chevron, folderIcon, nameSpan, countSpan);
    group.append(header);

    if (expanded) {
      const body = document.createElement("div");
      body.className = "setlist-folder-body";
      folderScores.forEach((score) => {
        body.append(createSetlistScoreOption(score, selectedIds));
      });
      group.append(body);
    }

    elements.setlistScorePicker.append(group);
  });

  // 未分类（根目录）歌谱放在文件夹之后。
  rootScores.forEach((score) => {
    elements.setlistScorePicker.append(createSetlistScoreOption(score, selectedIds));
  });

  refreshIcons();
}

function handleSetlistPickerClick(event) {
  const header = event.target.closest("[data-folder-toggle]");
  if (!header || !elements.setlistScorePicker.contains(header)) {
    return;
  }
  const folderId = header.dataset.folderToggle;
  if (state.setlistPickerExpandedFolders.has(folderId)) {
    state.setlistPickerExpandedFolders.delete(folderId);
  } else {
    state.setlistPickerExpandedFolders.add(folderId);
  }
  renderSetlistScorePicker();
}

function renderSetlistOrderList() {
  elements.setlistOrderList.replaceChildren();
  if (!state.setlistDraftScoreIds.length) {
    elements.setlistOrderList.append(createEmptyState("还没有选择歌谱", "勾选左侧歌谱后可调整顺序。"));
    refreshIcons();
    return;
  }

  const scoreById = new Map(state.scores.map((score) => [score.id, score]));
  state.setlistDraftScoreIds.forEach((scoreId, index) => {
    const score = scoreById.get(scoreId);
    if (!score) {
      return;
    }

    const row = document.createElement("div");
    row.className = "setlist-order-row";
    const order = document.createElement("strong");
    order.textContent = String(index + 1);
    const name = document.createElement("span");
    name.textContent = score.name;

    const controls = document.createElement("div");
    controls.className = "setlist-order-controls";
    const upButton = createSetlistOrderButton("arrow-up", "上移", scoreId, "up", index === 0);
    const downButton = createSetlistOrderButton("arrow-down", "下移", scoreId, "down", index === state.setlistDraftScoreIds.length - 1);
    const removeButton = createSetlistOrderButton("x", "移除", scoreId, "remove", false);
    controls.append(upButton, downButton, removeButton);

    row.append(order, name, controls);
    elements.setlistOrderList.append(row);
  });
  refreshIcons();
}

function createSetlistOrderButton(iconName, label, scoreId, action, disabled) {
  const button = document.createElement("button");
  button.className = "icon-button";
  button.type = "button";
  button.title = label;
  button.setAttribute("aria-label", label);
  button.dataset.scoreId = scoreId;
  button.dataset.setlistAction = action;
  button.disabled = disabled;
  button.append(createIcon(iconName));
  return button;
}

function handleSetlistPickerChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.dataset.scoreId) {
    return;
  }

  const scoreId = input.dataset.scoreId;
  if (input.checked) {
    if (!state.setlistDraftScoreIds.includes(scoreId)) {
      state.setlistDraftScoreIds.push(scoreId);
    }
  } else {
    state.setlistDraftScoreIds = state.setlistDraftScoreIds.filter((id) => id !== scoreId);
  }
  renderSetlistOrderList();
}

function handleSetlistOrderAction(event) {
  const button = event.target.closest("button[data-setlist-action]");
  if (!button) {
    return;
  }

  const scoreId = button.dataset.scoreId;
  const index = state.setlistDraftScoreIds.indexOf(scoreId);
  if (index < 0) {
    return;
  }

  if (button.dataset.setlistAction === "remove") {
    state.setlistDraftScoreIds.splice(index, 1);
  } else if (button.dataset.setlistAction === "up" && index > 0) {
    [state.setlistDraftScoreIds[index - 1], state.setlistDraftScoreIds[index]] = [
      state.setlistDraftScoreIds[index],
      state.setlistDraftScoreIds[index - 1],
    ];
  } else if (button.dataset.setlistAction === "down" && index < state.setlistDraftScoreIds.length - 1) {
    [state.setlistDraftScoreIds[index + 1], state.setlistDraftScoreIds[index]] = [
      state.setlistDraftScoreIds[index],
      state.setlistDraftScoreIds[index + 1],
    ];
  }

  renderSetlistScorePicker();
  renderSetlistOrderList();
}

async function saveSetlist(event) {
  event.preventDefault();
  const name = elements.setlistName.value.trim();
  const date = elements.setlistDate.value;
  const scene = elements.setlistScene.value.trim();
  const scoreIds = state.setlistDraftScoreIds.filter((scoreId, index, list) => list.indexOf(scoreId) === index);

  if (!name) {
    setSetlistDialogStatus("请输入歌单名称。", true);
    elements.setlistName.focus();
    return;
  }
  if (!date) {
    setSetlistDialogStatus("请选择歌单日期。", true);
    elements.setlistDate.focus();
    return;
  }
  if (!scoreIds.length) {
    setSetlistDialogStatus("请至少选择一首歌谱。", true);
    return;
  }

  const now = new Date().toISOString();
  const userId = state.session?.user?.id || null;
  const existingSetlist = state.editingSetlistId
    ? state.setlists.find((setlist) => setlist.id === state.editingSetlistId)
    : null;
  const setlistId = existingSetlist?.id || createId();
  const existingItems = state.setlistItems.filter((item) => item.setlistId === setlistId);
  const existingItemByScoreId = new Map(existingItems.map((item) => [item.scoreId, item]));
  const nextScoreIdSet = new Set(scoreIds);
  const setlist = {
    ...(existingSetlist || {}),
    id: setlistId,
    userId,
    name,
    normalizedName: normalizeText(name),
    date,
    scene,
    createdAt: existingSetlist?.createdAt || now,
    updatedAt: now,
    deletedAt: null,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };
  const items = scoreIds.map((scoreId, index) => {
    const existingItem = existingItemByScoreId.get(scoreId);
    return {
      ...(existingItem || {}),
      id: existingItem?.id || createId(),
      setlistId,
      scoreId,
      userId,
      position: index,
      createdAt: existingItem?.createdAt || now,
      updatedAt: now,
      deletedAt: null,
      syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
    };
  });
  const deletedItems = existingItems
    .filter((item) => !nextScoreIdSet.has(item.scoreId))
    .map((item) => ({
      ...item,
      userId,
      deletedAt: now,
      updatedAt: now,
      syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
    }));

  elements.saveSetlistButton.disabled = true;
  setSetlistDialogStatus("正在保存...");

  try {
    await runUserCommand(
      "setlist.upsert",
      async ({ commandId }) => {
        await putSetlistWithItems(setlist, items, deletedItems);
        await recordLocalOperation({
          id: commandId,
          type: "setlist.upsert",
          entityType: "setlist",
          entityId: setlistId,
          payload: {
            setlistId,
            name: setlist.name,
            itemCount: items.length,
            deletedItemCount: deletedItems.length,
          },
        });
        closeSetlistDialog();
        await loadScores();
        setStatus(`《${setlist.name}》歌单已保存。`);
        // 只要存在 session 就入队 outbox（queueSetlistCloudSync 内已按 session 判断，不依赖 cloudReady）。
        queueSetlistCloudSync(setlistId);
      },
      {
        label: "正在保存歌单...",
        slowLabel: "本地存储较忙，正在优先保存歌单...",
        failMessage: "保存歌单失败，请稍后重试。",
      },
    );
  } catch (error) {
    console.error(error);
    setSetlistDialogStatus(error.message || "保存歌单失败，请稍后再试。", true);
  } finally {
    elements.saveSetlistButton.disabled = false;
  }
}

async function deleteSetlist(id) {
  if (!ensureAppReady()) {
    return;
  }

  const setlist = state.setlists.find((item) => item.id === id);
  if (!setlist) {
    return;
  }

  const itemCount = getSetlistItems(id).length;
  const reopenEditorOnCancel = Boolean(elements.setlistDialog?.open);
  if (reopenEditorOnCancel) {
    closeSetlistDialog();
  }
  const confirmed = await requestDeleteConfirmation({
    title: "删除歌单？",
    message: `确定删除《${setlist.name}》歌单吗？其中 ${itemCount} 首歌谱不会被删除。`,
  });
  if (!confirmed) {
    if (reopenEditorOnCancel && state.setlists.some((item) => item.id === id)) {
      openSetlistDialog(id);
    }
    return;
  }

  elements.deleteSetlistButton.disabled = true;
  setSetlistDialogStatus("正在删除...");

  try {
    await runUserCommand(
      "setlist.delete",
      async ({ commandId }) => {
        const deletedAt = new Date().toISOString();
        const userId = setlist.userId || state.session?.user?.id || null;
        const setlistItems = state.setlistItems.filter((item) => item.setlistId === id);

        if (shouldKeepDeleteTombstone(setlist)) {
          await putSetlistWithItems(
            {
              ...setlist,
              userId,
              deletedAt,
              updatedAt: deletedAt,
              syncStatus: SYNC_STATUS_PENDING,
            },
            [],
            setlistItems.map((item) => ({
              ...item,
              userId: item.userId || userId,
              deletedAt,
              updatedAt: deletedAt,
              syncStatus: SYNC_STATUS_PENDING,
            })),
          );
          queueSetlistCloudSync(id);
        } else {
          await deleteSetlistRecord(id);
        }
        await recordLocalOperation({
          id: commandId,
          type: "setlist.delete",
          entityType: "setlist",
          entityId: id,
          payload: {
            setlistId: id,
            name: setlist.name,
            itemCount: setlistItems.length,
            deletedAt,
          },
        });

        if (state.currentViewerSetlistId === id && elements.viewerDialog.open) {
          closeViewerUI();
        }
        closeSetlistDialog();
        state.setlists = state.setlists.filter((item) => item.id !== id);
        state.setlistItems = state.setlistItems.filter((item) => item.setlistId !== id);
        renderSetlists();
        setStatus(`《${setlist.name}》歌单已删除。`);
      },
      {
        label: "正在删除歌单...",
        slowLabel: "本地存储较忙，正在优先删除歌单...",
        failMessage: "删除歌单失败，请稍后重试。",
      },
    );
  } catch (error) {
    console.error(error);
    setSetlistDialogStatus("删除歌单失败，请稍后再试。", true);
  } finally {
    elements.deleteSetlistButton.disabled = false;
  }
}

function setSetlistDialogStatus(message, isError = false) {
  elements.setlistDialogState.textContent = message || "";
  elements.setlistDialogState.hidden = !message;
  elements.setlistDialogState.classList.toggle("is-error", Boolean(isError));
}

function getBulkDeleteScoresForCurrentView() {
  const activeScores = state.scores.filter((score) => !score.deletedAt);
  const query = elements.searchInput.value.trim();
  const normalizedQuery = normalizeText(query);
  const currentFolder = getCurrentFolder();
  const inFolder = Boolean(currentFolder);
  const currentFolderId = inFolder ? currentFolder.id : null;
  const activeFilter = getLibraryFilter();
  const sortMode = getScoreSort();
  const visibleScores = activeScores.filter((score) => (score.folderId || null) === currentFolderId);
  const globalScoreSearch = !inFolder && (Boolean(normalizedQuery) || activeFilter !== LIBRARY_FILTER_ALL);
  const scoreSource = globalScoreSearch ? activeScores : visibleScores;

  return sortScoresForLibrary(
    filterScoresByLibraryFilter(scoreSource, activeFilter).filter((score) => scoreMatchesQuery(score, normalizedQuery)),
    sortMode,
  );
}

function openBulkDeleteDialog() {
  if (!ensureAppReady()) {
    return;
  }
  if (operationLocks.has("deleteScores")) {
    setStatus("删除正在进行，请稍候。", true);
    return;
  }

  const scores = getBulkDeleteScoresForCurrentView();
  if (!scores.length) {
    setStatus("当前列表没有可以批量删除的歌谱。", true);
    return;
  }

  state.bulkDeleteViewScores = scores;
  state.bulkDeleteSelectedIds = new Set();
  state.bulkDeleting = false;
  renderBulkDeleteList();

  openDialogSafely(elements.bulkDeleteDialog);

  refreshIcons();
}

function closeBulkDeleteDialog() {
  if (state.bulkDeleting) {
    return;
  }

  state.bulkDeleteSelectedIds.clear();
  state.bulkDeleteViewScores = [];
  closeDialogSafely(elements.bulkDeleteDialog);
}

function renderBulkDeleteList() {
  elements.bulkDeleteList.replaceChildren();
  elements.bulkDeleteState.classList.remove("is-error");
  state.bulkDeleteViewScores.forEach((score) => {
    const label = document.createElement("label");
    label.className = "bulk-delete-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = score.id;
    checkbox.checked = state.bulkDeleteSelectedIds.has(score.id);

    const text = document.createElement("span");
    text.className = "bulk-delete-row-text";
    const title = document.createElement("strong");
    title.textContent = score.name;
    const detail = document.createElement("small");
    detail.textContent = [`${score.pages.length} 页`, score.keySignature].filter(Boolean).join(" · ");
    text.append(title, detail);

    label.append(checkbox, text);
    elements.bulkDeleteList.append(label);
  });

  updateBulkDeleteDialogState();
}

function updateBulkDeleteDialogState() {
  const total = state.bulkDeleteViewScores.length;
  const selected = state.bulkDeleteSelectedIds.size;
  elements.bulkDeleteSelectAll.checked = Boolean(total && selected === total);
  elements.bulkDeleteSelectAll.indeterminate = Boolean(selected && selected < total);
  elements.confirmBulkDeleteButton.disabled = state.bulkDeleting || operationLocks.has("deleteScores") || selected === 0;
  elements.bulkDeleteState.textContent = state.bulkDeleting
    ? "正在删除所选歌谱..."
    : selected
      ? `已选择 ${selected} / ${total} 份歌谱。`
      : `当前列表共有 ${total} 份歌谱，请选择要删除的歌谱。`;
}

function handleBulkDeleteSelectAllChange() {
  if (elements.bulkDeleteSelectAll.checked) {
    state.bulkDeleteSelectedIds = new Set(state.bulkDeleteViewScores.map((score) => score.id));
  } else {
    state.bulkDeleteSelectedIds.clear();
  }
  renderBulkDeleteList();
}

function handleBulkDeleteSelectionChange(event) {
  const input = event.target instanceof HTMLInputElement ? event.target : null;
  if (!input || input.type !== "checkbox") {
    return;
  }

  if (input.checked) {
    state.bulkDeleteSelectedIds.add(input.value);
  } else {
    state.bulkDeleteSelectedIds.delete(input.value);
  }
  updateBulkDeleteDialogState();
}

async function confirmBulkDelete() {
  if (state.bulkDeleting || !ensureAppReady()) {
    return;
  }

  const selectedIds = new Set(state.bulkDeleteSelectedIds);
  const scores = state.bulkDeleteViewScores.filter((score) => selectedIds.has(score.id));
  if (!scores.length) {
    updateBulkDeleteDialogState();
    return;
  }

  state.bulkDeleting = true;
  updateBulkDeleteDialogState();
  const success = await deleteScoresStable(
    scores.map((score) => score.id),
    { skipConfirm: true },
  );
  state.bulkDeleting = false;

  if (success) {
    closeBulkDeleteDialog();
  } else {
    updateBulkDeleteDialogState();
    elements.bulkDeleteState.textContent = "批量删除未完成，请根据页面提示重试。";
    elements.bulkDeleteState.classList.add("is-error");
  }
}

function formatSetlistDate(date) {
  if (!date) {
    return "未设置日期";
  }

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function getSetlistSortTime(setlist) {
  const dateTime = setlist?.date ? new Date(`${setlist.date}T00:00:00`).getTime() : Number.NaN;
  if (!Number.isNaN(dateTime)) {
    return dateTime;
  }
  const updatedTime = new Date(setlist?.updatedAt || 0).getTime();
  return Number.isNaN(updatedTime) ? 0 : updatedTime;
}

function createEmptyState(title, detail, action = null) {
  const empty = document.createElement("div");
  empty.className = "empty-state";

  const content = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = title;
  const paragraph = document.createElement("span");
  paragraph.textContent = detail;
  content.append(strong, paragraph);

  if (action?.label && typeof action.onClick === "function") {
    const button = document.createElement("button");
    button.className = "empty-action-button";
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      action.onClick(event);
    });
    content.append(button);
  }

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
  state.currentViewerScoreId = score.id;
  state.currentViewerSetlistId = null;
  if (elements.viewerTitle) {
    elements.viewerTitle.textContent = "查看歌谱";
  }
  setViewerKeySignature(score.keySignature);
  setViewerFavoriteButton(score);
  exitViewerPerformanceMode({ silent: true });
  setViewerPianoOpen(false);
  renderViewerPages(score);
  updateViewerPianoKeySignature();
  recordScoreOpened(score.id).catch((error) => console.warn(error));

  if (typeof elements.viewerDialog.showModal === "function") {
    elements.viewerDialog.showModal();
  } else {
    elements.viewerDialog.setAttribute("open", "");
  }

  document.body.classList.add("viewer-open");

  state.viewerHistoryActive = true;

  requestAnimationFrame(() => {
    elements.viewerPages.scrollTo({ left: 0, top: 0 });
    prepareViewerPages(score.id, score.pages);
    refreshViewerAnnotationCanvases();
  });
}

function openSetlistViewer(id) {
  const setlist = state.setlists.find((item) => item.id === id);
  if (!setlist) {
    return;
  }

  const virtualScore = createSetlistViewerScore(setlist);
  if (!virtualScore.pages.length) {
    setStatus("这个歌单里还没有可浏览的歌谱。", true);
    return;
  }

  resetViewerGestureState();
  setViewerZoom(VIEWER_MIN_ZOOM);
  state.currentViewerScoreId = null;
  state.currentViewerSetlistId = setlist.id;
  if (elements.viewerTitle) {
    elements.viewerTitle.textContent = setlist.name;
  }
  setViewerKeySignature("");
  setViewerFavoriteButton(null);
  exitViewerPerformanceMode({ silent: true });
  setViewerPianoOpen(false);
  renderViewerPages(virtualScore);
  updateViewerPianoKeySignature();

  if (typeof elements.viewerDialog.showModal === "function") {
    elements.viewerDialog.showModal();
  } else {
    elements.viewerDialog.setAttribute("open", "");
  }

  document.body.classList.add("viewer-open");

  state.viewerHistoryActive = true;

  requestAnimationFrame(() => {
    elements.viewerPages.scrollTo({ left: 0, top: 0 });
    prepareSetlistViewerPages(setlist.id);
    refreshViewerAnnotationCanvases();
  });
}

// 纯 UI 收起查看器（不操作历史；历史后退由 popstate 统一驱动）。
// “更多”弹出菜单的显示/隐藏（仅 UI；标注、收藏的业务逻辑不变）。
// 用容器上的 .is-open 类控制（不依赖全局 [hidden]），打开时渲染菜单内图标。
function setViewerMoreMenuOpen(open) {
  if (!elements.viewerMore || !elements.viewerMoreButton) {
    return;
  }
  elements.viewerMore.classList.toggle("is-open", open);
  elements.viewerMoreButton.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    updateNativeAnnotationButtonState();
    refreshIcons();
  }
}

function toggleViewerMoreMenu() {
  if (!elements.viewerMore) {
    return;
  }
  setViewerMoreMenuOpen(!elements.viewerMore.classList.contains("is-open"));
}

function ensureViewerPianoReady() {
  if (!elements.viewerPiano) {
    return null;
  }
  if (!elements.viewerPiano.__myScorePiano && window.MyScorePiano?.init) {
    window.MyScorePiano.init(elements.viewerPiano);
  }
  return elements.viewerPiano.__myScorePiano || null;
}

function getCurrentViewerPage() {
  const pageId = getCurrentViewerPageId();
  if (pageId) {
    return state.currentViewerPages.find((page) => page.id === pageId) || state.scorePages.find((page) => page.id === pageId) || null;
  }
  return state.currentViewerPages[0] || null;
}

function getCurrentViewerScore() {
  if (state.currentViewerScoreId) {
    return state.scores.find((score) => score.id === state.currentViewerScoreId) || null;
  }
  const currentPage = getCurrentViewerPage();
  if (currentPage?.scoreId) {
    return state.scores.find((score) => score.id === currentPage.scoreId) || null;
  }
  return null;
}

function updateViewerPianoKeySignature() {
  if (!elements.viewerPiano) {
    return;
  }
  const score = getCurrentViewerScore();
  const keySignature = score?.keySignature || "C";
  window.MyScorePiano?.setKeySignature?.(elements.viewerPiano, keySignature);
}

function setViewerPianoOpen(open) {
  state.viewerPianoOpen = Boolean(open);
  elements.viewerDialog?.classList.toggle("is-piano-open", state.viewerPianoOpen);

  if (elements.viewerPianoPanel) {
    elements.viewerPianoPanel.hidden = !state.viewerPianoOpen;
  }

  if (elements.viewerPianoButton) {
    elements.viewerPianoButton.classList.toggle("is-active", state.viewerPianoOpen);
    elements.viewerPianoButton.setAttribute("aria-pressed", state.viewerPianoOpen ? "true" : "false");
  }

  if (!state.viewerPianoOpen) {
    window.MyScorePiano?.stopAll?.(elements.viewerPiano);
    return;
  }

  // 钢琴与节拍器互斥：打开钢琴时收起节拍器面板。
  setViewerMetronomeOpen(false);

  const piano = ensureViewerPianoReady();
  updateViewerPianoKeySignature();

  // 在用户点击“钢琴”按钮这个手势里解锁音频并预解码可见采样，降低首次按键延迟。
  window.MyScorePiano?.prepare?.(elements.viewerPiano);

  requestAnimationFrame(() => {
    piano?.render?.();
    if (typeof resizeAllAnnotationCanvases === "function") {
      resizeAllAnnotationCanvases();
    }
    if (typeof renderAllVisibleAnnotations === "function") {
      renderAllVisibleAnnotations();
    }
  });
}

// ---------- 节拍器 ----------
const metronome = {
  ctx: null,
  running: false,
  bpm: 90,
  beatsPerMeasure: 4,
  currentBeat: 0,
  nextNoteTime: 0,
  lookaheadMs: 25,
  scheduleAheadSec: 0.12,
  timer: 0,
};

function getMetronomeContext() {
  if (!metronome.ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }
    try {
      metronome.ctx = new AudioCtx();
    } catch (error) {
      console.warn("[metronome] create AudioContext failed", error);
      return null;
    }
  }
  return metronome.ctx;
}

function renderMetronomeBeats() {
  if (!elements.metronomeBeats) {
    return;
  }
  elements.metronomeBeats.replaceChildren();
  for (let i = 0; i < metronome.beatsPerMeasure; i += 1) {
    const dot = document.createElement("span");
    dot.className = "metronome-beat-dot";
    if (i === 0) {
      dot.classList.add("is-accent");
    }
    dot.dataset.beatIndex = String(i);
    elements.metronomeBeats.append(dot);
  }
}

function flashMetronomeBeat(beatIndex) {
  if (!elements.metronomeBeats) {
    return;
  }
  const dots = elements.metronomeBeats.children;
  for (let i = 0; i < dots.length; i += 1) {
    dots[i].classList.toggle("is-active", i === beatIndex);
  }
}

function clearMetronomeBeatHighlight() {
  if (!elements.metronomeBeats) {
    return;
  }
  Array.from(elements.metronomeBeats.children).forEach((dot) => dot.classList.remove("is-active"));
}

function scheduleMetronomeClick(beatIndex, time) {
  const ctx = metronome.ctx;
  if (!ctx) {
    return;
  }
  const accent = beatIndex === 0;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = accent ? 1600 : 1000;
  const peak = accent ? 0.6 : 0.32;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(peak, time + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.06);

  const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
  window.setTimeout(() => {
    if (metronome.running) {
      flashMetronomeBeat(beatIndex);
    }
  }, delayMs);
}

function metronomeScheduler() {
  const ctx = metronome.ctx;
  if (!ctx) {
    return;
  }
  const secondsPerBeat = 60 / metronome.bpm;
  while (metronome.nextNoteTime < ctx.currentTime + metronome.scheduleAheadSec) {
    scheduleMetronomeClick(metronome.currentBeat, metronome.nextNoteTime);
    metronome.nextNoteTime += secondsPerBeat;
    metronome.currentBeat = (metronome.currentBeat + 1) % metronome.beatsPerMeasure;
  }
}

function startMetronome() {
  const ctx = getMetronomeContext();
  if (!ctx || metronome.running) {
    return;
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  metronome.running = true;
  metronome.currentBeat = 0;
  metronome.nextNoteTime = ctx.currentTime + 0.08;
  metronome.timer = window.setInterval(metronomeScheduler, metronome.lookaheadMs);
  updateMetronomePlayUi();
}

function stopMetronome() {
  if (metronome.timer) {
    window.clearInterval(metronome.timer);
    metronome.timer = 0;
  }
  metronome.running = false;
  metronome.currentBeat = 0;
  clearMetronomeBeatHighlight();
  updateMetronomePlayUi();
}

function toggleMetronome() {
  if (metronome.running) {
    stopMetronome();
  } else {
    startMetronome();
  }
}

function updateMetronomePlayUi() {
  const button = elements.metronomePlayButton;
  if (!button) {
    return;
  }
  button.classList.toggle("is-running", metronome.running);
  button.setAttribute("aria-pressed", metronome.running ? "true" : "false");
  // 重建图标元素（lucide 会把 <i data-lucide> 替换为 <svg>，无法原地改属性）。
  button.replaceChildren(createIcon(metronome.running ? "square" : "play"));
  refreshIcons();
}

function setMetronomeBpm(value) {
  const bpm = Math.max(40, Math.min(240, Math.round(Number(value) || metronome.bpm)));
  metronome.bpm = bpm;
  if (elements.metronomeBpmValue) {
    elements.metronomeBpmValue.textContent = String(bpm);
  }
  if (elements.metronomeSlider && Number(elements.metronomeSlider.value) !== bpm) {
    elements.metronomeSlider.value = String(bpm);
  }
}

function adjustMetronomeBpm(delta) {
  setMetronomeBpm(metronome.bpm + delta);
}

function handleMetronomeMeterClick(event) {
  const button = event.target.closest("button[data-beats]");
  if (!button || !elements.metronomeMeterOptions.contains(button)) {
    return;
  }
  const beats = Math.max(1, Math.min(12, Number(button.dataset.beats) || 4));
  metronome.beatsPerMeasure = beats;
  metronome.currentBeat = 0;
  Array.from(elements.metronomeMeterOptions.querySelectorAll("button")).forEach((item) => {
    item.classList.toggle("is-active", item === button);
  });
  renderMetronomeBeats();
}

function setViewerMetronomeOpen(open) {
  state.viewerMetronomeOpen = Boolean(open);
  elements.viewerDialog?.classList.toggle("is-metronome-open", state.viewerMetronomeOpen);

  if (elements.viewerMetronomePanel) {
    elements.viewerMetronomePanel.hidden = !state.viewerMetronomeOpen;
  }
  if (elements.viewerMetronomeButton) {
    elements.viewerMetronomeButton.classList.toggle("is-active", state.viewerMetronomeOpen);
    elements.viewerMetronomeButton.setAttribute("aria-pressed", state.viewerMetronomeOpen ? "true" : "false");
  }

  if (!state.viewerMetronomeOpen) {
    stopMetronome();
    return;
  }

  // 节拍器与钢琴互斥：打开节拍器时收起钢琴面板。
  setViewerPianoOpen(false);

  // 同步 UI 到当前设置，并在用户手势内预热 AudioContext。
  setMetronomeBpm(metronome.bpm);
  renderMetronomeBeats();
  updateMetronomePlayUi();
  const ctx = getMetronomeContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

function closeViewerUI() {
  setViewerMoreMenuOpen(false);
  setViewerPianoOpen(false);
  setViewerMetronomeOpen(false);
  setAnnotationMode(false, { deferSave: true });
  flushAnnotationSave().catch((error) => console.warn(error));
  const shouldRenderLibrary = state.libraryRenderQueued;
  state.viewerHistoryActive = false;
  state.currentViewerScoreId = null;
  state.currentViewerSetlistId = null;
  state.currentViewerPages = [];
  state.annotationDraftStroke = null;
  state.annotationPointerId = null;
  state.annotationDraftCanvas = null;
  state.annotationDraftInserted = false;
  state.annotationDraftUndoRegistered = false;
  state.annotationPenActiveStrokeId = "";
  state.annotationActiveStrokeToken = 0;
  state.annotationStrokeStartedAt = 0;
  if (state.annotationPenLeaveTimer) {
    clearTimeout(state.annotationPenLeaveTimer);
    state.annotationPenLeaveTimer = 0;
  }
  state.annotationUndoStack = [];
  state.annotationRedoStack = [];
  state.libraryRenderQueued = false;
  if (elements.viewerTitle) {
    elements.viewerTitle.textContent = "查看歌谱";
  }
  setViewerKeySignature("");
  setViewerFavoriteButton(null);
  exitViewerPerformanceMode({ silent: true });

  if (elements.viewerDialog.open) {
    elements.viewerDialog.close();
  }
  document.body.classList.remove("viewer-open");
  resetViewerGestureState();
  setViewerZoom(VIEWER_MIN_ZOOM);

  if (shouldRenderLibrary && state.activeTab === "library") {
    renderScores();
  }
}

function setViewerKeySignature(value) {
  if (!elements.viewerKeySignature) {
    return;
  }

  const keySignature = String(value || "").trim();
  elements.viewerKeySignature.textContent = keySignature ? `调号 ${keySignature}` : "";
  elements.viewerKeySignature.hidden = !keySignature;
}

// 根据当前所在页（在歌单连续查看时可能属于不同歌谱）更新顶部调号显示。
function updateViewerKeySignatureForIndex(currentIndex) {
  const pages = state.currentViewerPages;
  if (!pages || !pages.length) {
    return;
  }
  const page = pages[clamp(Number(currentIndex) || 0, 0, pages.length - 1)];
  const scoreId = page?.scoreId;
  if (!scoreId) {
    return;
  }
  const score = state.scores.find((item) => item.id === scoreId);
  setViewerKeySignature(score?.keySignature || "");
}

function setViewerFavoriteButton(score) {
  if (!elements.viewerFavoriteButton) {
    return;
  }

  const hasScore = Boolean(score?.id);
  const favorite = Boolean(score?.favorite);
  elements.viewerFavoriteButton.hidden = !hasScore;
  elements.viewerFavoriteButton.disabled = !hasScore;
  elements.viewerFavoriteButton.classList.toggle("is-active", favorite);
  elements.viewerFavoriteButton.setAttribute("aria-pressed", favorite ? "true" : "false");
  const label = favorite ? "取消收藏" : "收藏歌谱";
  elements.viewerFavoriteButton.title = label;
  elements.viewerFavoriteButton.setAttribute("aria-label", label);
}

async function toggleCurrentViewerFavorite() {
  const scoreId = state.currentViewerScoreId;
  if (!scoreId) {
    return;
  }

  elements.viewerFavoriteButton.disabled = true;
  try {
    await toggleScoreFavorite(scoreId);
  } catch (error) {
    console.error(error);
    setStatus("收藏状态保存失败，请稍后重试。", true);
  } finally {
    if (state.currentViewerScoreId === scoreId) {
      elements.viewerFavoriteButton.disabled = false;
    }
  }
}

async function toggleScoreFavorite(scoreId) {
  const score = state.scores.find((item) => item.id === scoreId);
  if (!score) {
    return;
  }

  const now = new Date().toISOString();
  const userId = score.userId || state.session?.user?.id || null;
  const updatedScore = {
    ...toScoreRecord(score),
    userId,
    favorite: !score.favorite,
    updatedAt: now,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };
  replaceScoreMetadataInMemory(scoreId, updatedScore);
  await queueScoreMetadataSave(scoreId, (latestScore) => ({
    ...toScoreRecord(latestScore),
    userId: latestScore.userId || state.session?.user?.id || null,
    favorite: updatedScore.favorite,
    updatedAt: now,
    syncStatus: (latestScore.userId || state.session?.user?.id) ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  }));

  // 收藏属于歌谱编辑：只要有 session 就入队 outbox，离线/未连接也会在恢复后同步。
  if (userId || state.session) {
    queueScoreCloudUpload(scoreId);
  }
}

async function recordScoreOpened(scoreId) {
  const score = state.scores.find((item) => item.id === scoreId);
  if (!score) {
    return;
  }

  const userId = score.userId || state.session?.user?.id || null;
  const openedAt = new Date().toISOString();
  const updatedScore = {
    ...toScoreRecord(score),
    userId,
    lastOpenedAt: openedAt,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  };
  replaceScoreMetadataInMemory(scoreId, updatedScore);
  await queueScoreMetadataSave(scoreId, (latestScore) => ({
    ...toScoreRecord(latestScore),
    userId: latestScore.userId || state.session?.user?.id || null,
    lastOpenedAt: openedAt,
    syncStatus: (latestScore.userId || state.session?.user?.id) ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  }));

  if (userId && state.cloudReady) {
    queueSync();
  }
}

function replaceScoreMetadataInMemory(scoreId, updatedScore) {
  state.scores = state.scores.map((item) =>
    item.id === scoreId
      ? {
        ...item,
        ...updatedScore,
        pages: item.pages,
      }
      : item,
  );
  if (state.currentViewerScoreId === scoreId) {
    setViewerFavoriteButton(state.scores.find((item) => item.id === scoreId));
    updateViewerPianoKeySignature();
  } else if (state.currentViewerSetlistId && getCurrentViewerPage()?.scoreId === scoreId) {
    updateViewerPianoKeySignature();
  }
  requestLibraryRender();
}

function requestLibraryRender() {
  if (isViewerActive()) {
    state.libraryRenderQueued = true;
    return;
  }

  renderScores();
}

function isViewerActive() {
  return Boolean(elements.viewerDialog?.open || state.currentViewerScoreId || state.currentViewerSetlistId);
}

function toggleAnnotationMode() {
  if (state.annotationMode) {
    finishAnnotationMode().catch((error) => {
      console.warn(error);
      setStatus("标注暂未保存，请稍后重试。", true);
    });
    return;
  }
  setAnnotationMode(true);
}

function getNativeAnnotationPlugin() {
  return window.Capacitor?.Plugins?.NativeAnnotation || null;
}

function isNativeAnnotationAvailable() {
  const capacitor = window.Capacitor;
  const platform = typeof capacitor?.getPlatform === "function" ? capacitor.getPlatform() : capacitor?.platform;
  return Boolean(capacitor?.isNativePlatform?.() && platform === "ios" && typeof getNativeAnnotationPlugin()?.open === "function");
}

function updateNativeAnnotationButtonState() {
  if (!elements.viewerNativeAnnotationButton) {
    return;
  }
  elements.viewerNativeAnnotationButton.hidden = !isNativeAnnotationAvailable();
}

async function openNativeAnnotationForCurrentPage() {
  const plugin = getNativeAnnotationPlugin();
  if (!isNativeAnnotationAvailable() || !plugin) {
    setStatus("原生标注仅在 iPad/iPhone App 中可用。", true);
    return;
  }

  const pageId = getCurrentViewerPageId();
  const page = state.currentViewerPages.find((item) => item.id === pageId) || state.scorePages.find((item) => item.id === pageId);
  if (!page) {
    setStatus("没有找到当前歌谱页。", true);
    return;
  }

  try {
    await flushAnnotationSave().catch((error) => console.warn(error));
    const imageSource = await getNativeAnnotationImageSource(page);
    if (!imageSource) {
      setStatus("当前页图片尚未准备好，请稍后再试。", true);
      return;
    }

    const record = (await loadAnnotationForPage(pageId)) || getAnnotationRecordForPage(pageId, { create: true });
    const score = state.scores.find((item) => item.id === page.scoreId) || null;
    const response = await plugin.open({
      scoreId: page.scoreId,
      pageId,
      title: score?.name || "歌谱标注",
      imageSource: imageSource.source,
      imageMimeType: imageSource.type || page.type || "image/jpeg",
      drawingDataBase64: record?.drawingDataBase64 || "",
      drawingData: record?.drawingDataBase64 || "",
    });

    if (response?.cancelled) {
      return;
    }

    const drawingDataBase64 = response?.drawingDataBase64 || response?.drawingData || "";
    if (!drawingDataBase64) {
      setStatus("原生标注未返回绘图数据。", true);
      return;
    }

    await saveNativeAnnotationForPage(page, {
      drawingDataBase64,
      imageWidth: response?.imageWidth,
      imageHeight: response?.imageHeight,
      updatedAt: response?.updatedAt,
    });
    setStatus("原生标注已保存。");
  } catch (error) {
    console.error(error);
    setStatus(getErrorMessage(error) || "原生标注失败，请稍后重试。", true);
  }
}

async function getNativeAnnotationImageSource(page) {
  const latestPage = getLatestPageRecord(page) || page;
  if (latestPage?.blob && latestPage.blob.size > 0) {
    const encoded = await blobToBase64(latestPage.blob);
    const type = encoded.type || latestPage.type || "image/jpeg";
    return {
      source: `data:${type};base64,${encoded.data}`,
      type,
    };
  }

  const tempUrl = latestPage?.storagePath ? state.pageTempUrls.get(latestPage.id) || (await getScorePageTempUrl(latestPage)) : "";
  if (tempUrl) {
    return {
      source: tempUrl,
      type: latestPage.type || "image/jpeg",
    };
  }

  const image = elements.viewerPages?.querySelector(`img[data-page-id="${cssEscape(latestPage.id)}"]`);
  const source = image?.src || "";
  if (source && source !== SCORE_IMAGE_PLACEHOLDER && !source.startsWith("blob:")) {
    return {
      source,
      type: latestPage.type || "image/jpeg",
    };
  }

  return null;
}

async function saveNativeAnnotationForPage(page, data) {
  const pageId = String(page.id);
  const previous = getAnnotationRecordForPage(pageId, { create: true });
  const now = data.updatedAt || new Date().toISOString();
  const userId = previous?.userId || page.userId || state.session?.user?.id || null;
  const nextRecord = normalizeAnnotationRecord({
    ...(previous || {}),
    id: previous?.id || createId(),
    scoreId: page.scoreId,
    pageId,
    userId,
    engine: "pencilkit",
    drawingDataBase64: data.drawingDataBase64,
    nativeDrawingUpdatedAt: now,
    baseWidth: Number(data.imageWidth) || previous?.baseWidth || 0,
    baseHeight: Number(data.imageHeight) || previous?.baseHeight || 0,
    updatedAt: now,
    syncStatus: userId ? SYNC_STATUS_PENDING : SYNC_STATUS_LOCAL,
  });
  state.annotationRecords.set(pageId, nextRecord);
  await saveAnnotationRecord(nextRecord);
  if (userId || state.session) {
    enqueueOutboxTask("UPSERT_ANNOTATION", {
      entityId: nextRecord.id,
      entityType: "annotation",
      dedupeKey: `annotation.upsert:${nextRecord.id}`,
      payload: { annotation: nextRecord },
    }).catch((error) => console.warn(error));
  }
}

function cancelAnnotationDraft() {
  const draft = state.annotationDraftStroke;
  if (draft?.inserted) {
    finalizeAnnotationDraft({ reason: "cancel-inserted-draft" });
    return;
  }
  state.annotationDraftStroke = null;
  state.annotationPointerId = null;
  state.annotationDraftCanvas = null;
  state.annotationDraftInserted = false;
  state.annotationDraftUndoRegistered = false;
  state.annotationPenActiveStrokeId = "";
  state.annotationActiveStrokeToken = 0;
  state.annotationStrokeStartedAt = 0;
  if (state.annotationPenLeaveTimer) {
    clearTimeout(state.annotationPenLeaveTimer);
    state.annotationPenLeaveTimer = 0;
  }
  if (!draft?.pageId) {
    return;
  }
  const canvas = elements.viewerPages?.querySelector(`.annotation-canvas[data-page-id="${cssEscape(draft.pageId)}"]`);
  if (canvas) {
    renderAnnotationCanvas(canvas, state.annotationRecords.get(draft.pageId));
  }
}

function isViewerPinching() {
  return Boolean(state.viewerPinchActive || state.viewerPendingPinch || state.viewerPinchRaf);
}

function setAnnotationMode(enabled, options = {}) {
  resetViewerPointerState();
  state.annotationMode = Boolean(enabled) && !state.viewerPerformanceMode;
  elements.viewerDialog?.classList.toggle("is-annotation-mode", state.annotationMode);
  elements.viewerPages?.classList.toggle("is-annotation-mode", state.annotationMode);
  if (elements.annotationToolbar) {
    elements.annotationToolbar.hidden = !state.annotationMode;
  }
  if (elements.viewerAnnotationButton) {
    elements.viewerAnnotationButton.classList.toggle("is-active", state.annotationMode);
    elements.viewerAnnotationButton.setAttribute("aria-pressed", state.annotationMode ? "true" : "false");
  }
  if (state.annotationMode) {
    setStatus("标注模式：单指书写，双指缩放或移动页面。");
  } else {
    cancelAnnotationDraft();
    if (!options.deferSave) {
      flushAnnotationSave().catch((error) => console.warn(error));
    }
    setStatus("");
  }
  updateAnnotationToolbarState();
  scheduleAnnotationCanvasResize();
}

async function finishAnnotationMode() {
  setAnnotationMode(false, { deferSave: true });
  await flushAnnotationSave();
}

function setAnnotationTool(tool) {
  if (!["pen", "highlighter", "eraser"].includes(tool)) {
    return;
  }
  state.annotationTool = tool;
  updateAnnotationToolbarState();
}

function updateAnnotationToolbarState() {
  elements.annotationToolButtons?.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.annotationTool === state.annotationTool);
  });
  if (elements.annotationColorInput) {
    elements.annotationColorInput.value = state.annotationColor;
  }
  if (elements.annotationSizeInput) {
    elements.annotationSizeInput.value = String(state.annotationSize);
  }
  if (elements.annotationToggleVisibilityButton) {
    elements.annotationToggleVisibilityButton.textContent = state.annotationVisible ? "隐藏标注" : "显示标注";
  }
  if (elements.annotationUndoButton) {
    elements.annotationUndoButton.disabled = !state.annotationUndoStack.length;
  }
  if (elements.annotationRedoButton) {
    elements.annotationRedoButton.disabled = !state.annotationRedoStack.length;
  }
}

function getCurrentViewerPageId() {
  const pages = Array.from(elements.viewerPages?.querySelectorAll(".viewer-page") || []);
  if (!pages.length) {
    return "";
  }
  const horizontal = elements.viewerPages.classList.contains("is-horizontal-mode") && !elements.viewerPages.classList.contains("is-zoomed");
  let currentIndex = 0;
  if (horizontal) {
    const pageWidth = Math.max(1, pages[0].getBoundingClientRect().width || elements.viewerPages.clientWidth);
    currentIndex = clamp(Math.round(elements.viewerPages.scrollLeft / pageWidth), 0, pages.length - 1);
  } else {
    const containerRect = elements.viewerPages.getBoundingClientRect();
    const target = containerRect.top + containerRect.height * 0.35;
    let bestDistance = Number.POSITIVE_INFINITY;
    pages.forEach((page, index) => {
      const rect = page.getBoundingClientRect();
      const distance = Math.abs(rect.top - target);
      if (distance < bestDistance) {
        bestDistance = distance;
        currentIndex = index;
      }
    });
  }
  const boundaryIndex = getViewerBoundaryPageIndex(pages, horizontal);
  if (boundaryIndex !== null) {
    currentIndex = boundaryIndex;
  }
  return pages[currentIndex]?.dataset.pageId || state.currentViewerPages[currentIndex]?.id || "";
}

function getViewerBoundaryPageIndex(pages, horizontal) {
  const container = elements.viewerPages;
  if (!container || !pages.length) {
    return null;
  }

  const reachedStart = horizontal ? container.scrollLeft <= 2 : container.scrollTop <= 2;
  if (reachedStart) {
    return 0;
  }

  const reachedEnd = horizontal
    ? container.scrollLeft + container.clientWidth >= container.scrollWidth - 2
    : container.scrollTop + container.clientHeight >= container.scrollHeight - 2;
  return reachedEnd ? pages.length - 1 : null;
}

function scheduleAnnotationCanvasResize(options = {}) {
  if (!elements.viewerDialog?.open) {
    return;
  }

  state.annotationResizePending = true;
  if (!options.light) {
    state.annotationResizeNeedsFull = true;
  }

  if (state.annotationResizeFrame) {
    return;
  }

  state.annotationResizeFrame = requestAnimationFrame(() => {
    state.annotationResizeFrame = 0;

    if (!state.annotationResizePending) {
      return;
    }

    state.annotationResizePending = false;
    const lightOnly = options.light && !state.annotationResizeNeedsFull;
    state.annotationResizeNeedsFull = false;

    if (lightOnly) {
      resizeVisibleAnnotationCanvases();
      renderVisibleAnnotations();
    } else {
      resizeAllAnnotationCanvases();
      renderAllVisibleAnnotations();
    }
  });
}

function resizeAllAnnotationCanvases() {
  (elements.viewerPages || document).querySelectorAll(".annotation-canvas").forEach((canvas) => resizeAnnotationCanvas(canvas));
}

// 缩放过程中只做“几何同步”：画布随图片即时缩放，不重栅格化，避免抖动。
function syncAllAnnotationCanvasGeometry() {
  (elements.viewerPages || document)
    .querySelectorAll(".annotation-canvas")
    .forEach((canvas) => resizeAnnotationCanvas(canvas, { geometryOnly: true }));
}

let annotationZoomRerasterTimer = 0;
// 缩放停止后再做一次完整重栅格化，恢复清晰度（去抖）。
function scheduleAnnotationRerasterAfterZoom() {
  if (annotationZoomRerasterTimer) {
    window.clearTimeout(annotationZoomRerasterTimer);
  }
  annotationZoomRerasterTimer = window.setTimeout(() => {
    annotationZoomRerasterTimer = 0;
    scheduleAnnotationCanvasResize();
  }, 180);
}

function getVisibleAnnotationCanvases() {
  const container = elements.viewerPages;
  if (!container) {
    return [];
  }

  const containerRect = container.getBoundingClientRect();
  return Array.from(container.querySelectorAll(".annotation-canvas")).filter((canvas) => {
    const rect = canvas.getBoundingClientRect();
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom >= containerRect.top - 120 &&
      rect.top <= containerRect.bottom + 120 &&
      rect.right >= containerRect.left - 120 &&
      rect.left <= containerRect.right + 120
    );
  });
}

function resizeVisibleAnnotationCanvases() {
  getVisibleAnnotationCanvases().forEach((canvas) => resizeAnnotationCanvas(canvas));
}

function resizeAnnotationCanvas(canvas, options = {}) {
  const shell = canvas.closest(".viewer-page-shell");
  const image = shell?.querySelector(".viewer-page-image");
  if (!shell || !image) {
    return;
  }
  const shellRect = shell.getBoundingClientRect();
  const imageRect = image.getBoundingClientRect();
  if (!shellRect.width || !shellRect.height || !imageRect.width || !imageRect.height) {
    return;
  }

  const naturalWidth = image.naturalWidth || imageRect.width;
  const naturalHeight = image.naturalHeight || imageRect.height;
  const scale = Math.min(imageRect.width / naturalWidth, imageRect.height / naturalHeight);
  const drawWidth = Math.max(1, naturalWidth * scale);
  const drawHeight = Math.max(1, naturalHeight * scale);
  const left = imageRect.left - shellRect.left + (imageRect.width - drawWidth) / 2;
  const top = imageRect.top - shellRect.top + (imageRect.height - drawHeight) / 2;
  const dpr = window.devicePixelRatio || 1;

  canvas.style.left = `${left}px`;
  canvas.style.top = `${top}px`;
  canvas.style.width = `${drawWidth}px`;
  canvas.style.height = `${drawHeight}px`;

  // 仅同步几何（缩放过程中）：让画布随图片即时等比缩放，不改后备分辨率、不重绘，
  // 避免每一步缩放都清屏重画导致的闪烁/抖动。清晰度由缩放停止后的去抖重栅格化恢复。
  if (options.geometryOnly) {
    return;
  }

  const width = Math.max(1, Math.round(drawWidth * dpr));
  const height = Math.max(1, Math.round(drawHeight * dpr));
  const resized = canvas.width !== width || canvas.height !== height;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const record = getAnnotationRecordForPage(canvas.dataset.pageId);
  if (record) {
    record.baseWidth = naturalWidth;
    record.baseHeight = naturalHeight;
  }

  if (resized) {
    renderAnnotationCanvas(canvas, record);
  }
}

function renderAllVisibleAnnotations() {
  (elements.viewerPages || document).querySelectorAll(".annotation-canvas").forEach((canvas) => {
    renderAnnotationCanvas(canvas, state.annotationRecords.get(canvas.dataset.pageId));
  });
}

function renderVisibleAnnotations() {
  getVisibleAnnotationCanvases().forEach((canvas) => {
    renderAnnotationCanvas(canvas, state.annotationRecords.get(canvas.dataset.pageId));
  });
}

function refreshViewerAnnotationCanvases() {
  if (!elements.viewerDialog?.open || !elements.viewerPages) {
    return;
  }
  resizeAllAnnotationCanvases();
  renderAllVisibleAnnotations();
}

function renderAnnotationCanvas(canvas, record) {
  if (!canvas) {
    return;
  }
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  if (!state.annotationVisible || !record || record.deletedAt) {
    return;
  }
  (record.strokes || []).forEach((stroke) => drawAnnotationStroke(context, stroke, width, height));
  const draft = state.annotationDraftStroke;
  if (draft?.pageId === canvas.dataset.pageId && !draft.inserted) {
    drawAnnotationStroke(context, draft.stroke, width, height);
  }
}

function drawAnnotationStroke(context, stroke, width, height) {
  const points = (stroke?.points || []).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  if (!points.length) {
    return;
  }
  context.save();
  context.globalCompositeOperation = stroke.tool === "eraser" ? "destination-out" : "source-over";
  context.globalAlpha = stroke.tool === "eraser" ? 1 : clamp(Number(stroke.opacity) || 1, 0.05, 1);
  context.strokeStyle = stroke.color || "#ef4444";
  context.fillStyle = stroke.color || "#ef4444";
  // 笔迹粗细随缩放等比变化，与画面内容“丝滑结合”（zoom=1 时与原来一致）。
  const zoom = state.viewerZoom > 0 ? state.viewerZoom : 1;
  context.lineWidth = Math.max(1, Number(stroke.size) || 4) * (window.devicePixelRatio || 1) * zoom;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  points.forEach((point, index) => {
    const x = clamp(point.x, 0, 1) * width;
    const y = clamp(point.y, 0, 1) * height;
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  if (points.length === 1) {
    const point = points[0];
    context.arc(clamp(point.x, 0, 1) * width, clamp(point.y, 0, 1) * height, context.lineWidth / 2, 0, Math.PI * 2);
    context.fill();
  } else {
    context.stroke();
  }
  context.restore();
}

function getAnnotationCanvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }
  return {
    x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
    y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
  };
}

function createAnnotationStroke(point) {
  const tool = state.annotationTool;
  const now = new Date().toISOString();
  const size = tool === "highlighter" ? Math.max(8, state.annotationSize * 3) : tool === "eraser" ? Math.max(10, state.annotationSize * 3) : state.annotationSize;
  return {
    id: createId(),
    tool,
    color: tool === "highlighter" ? state.annotationHighlighterColor : state.annotationColor,
    size,
    opacity: tool === "highlighter" ? state.annotationHighlighterOpacity : state.annotationOpacity,
    points: [point],
    createdAt: now,
  };
}

function getPointerPressure(event) {
  const value = Number(event?.pressure);
  if (Number.isFinite(value) && value > 0) {
    return value;
  }
  return isPenPointer(event) ? 0.5 : 1;
}

function getPointerEventTime(event) {
  const value = Number(event?.timeStamp);
  if (Number.isFinite(value) && value > 0) {
    return value;
  }
  return performance.now();
}

function isActivePenContact(event) {
  if (!isPenPointer(event)) {
    return false;
  }

  const pressure = Number(event.pressure);
  if (Number.isFinite(pressure) && pressure > 0) {
    return true;
  }

  if (Number(event.buttons) > 0) {
    return true;
  }

  return false;
}

function getAnnotationCanvasFromPoint(event) {
  if (!event || !elements.viewerPages) {
    return null;
  }

  const element = document.elementFromPoint(event.clientX, event.clientY);
  const directCanvas = element?.closest?.(".annotation-canvas");
  if (directCanvas && elements.viewerPages.contains(directCanvas)) {
    return directCanvas;
  }

  const shell = element?.closest?.(".viewer-page-shell");
  const shellCanvas = shell?.querySelector?.(".annotation-canvas");
  if (shellCanvas && elements.viewerPages.contains(shellCanvas)) {
    return shellCanvas;
  }

  if (state.annotationDraftCanvas && elements.viewerPages.contains(state.annotationDraftCanvas)) {
    return state.annotationDraftCanvas;
  }

  return null;
}

function clearAnnotationDraftState() {
  state.annotationDraftStroke = null;
  state.annotationPointerId = null;
  state.annotationDraftCanvas = null;
  state.annotationDraftInserted = false;
  state.annotationDraftUndoRegistered = false;
  state.annotationPenActiveStrokeId = "";
  state.annotationActiveStrokeToken = 0;
  state.annotationStrokeStartedAt = 0;
  if (state.annotationPenLeaveTimer) {
    clearTimeout(state.annotationPenLeaveTimer);
    state.annotationPenLeaveTimer = 0;
  }
}

function finalizeAnnotationDraft(options = {}) {
  const draft = state.annotationDraftStroke;
  if (!draft) {
    return false;
  }

  const canvas = options.canvas || state.annotationDraftCanvas;
  const record = getAnnotationRecordForPage(draft.pageId, { create: true });

  if (!record) {
    clearAnnotationDraftState();
    return false;
  }

  const points = draft.stroke.points || [];
  if (points.length === 1) {
    points.push({ ...points[0] });
  }

  if (!draft.inserted) {
    record.strokes = [...(record.strokes || []), draft.stroke];
  } else if (!(record.strokes || []).some((item) => item.id === draft.stroke.id)) {
    record.strokes = [...(record.strokes || []), draft.stroke];
  }

  record.updatedAt = new Date().toISOString();

  if (!draft.undoRegistered) {
    state.annotationUndoStack.push({
      type: "stroke",
      pageId: draft.pageId,
      stroke: draft.stroke,
    });
    state.annotationRedoStack = [];
    draft.undoRegistered = true;
  }

  // 与手指一致的去抖保存（不再用 immediate），保证待存队列在退到后台时仍可被 flush 落库。
  scheduleAnnotationSave(draft.pageId);
  clearAnnotationDraftState();
  state.annotationLastCommittedAt = Date.now();

  if (canvas && options.render !== false) {
    renderAnnotationCanvas(canvas, record);
  }

  updateAnnotationToolbarState();
  return true;
}

function beginPenAnnotationStroke(event, canvas, options = {}) {
  if (!state.annotationMode || !isActivePenContact(event) || !canvas) {
    return false;
  }

  clearPenFromViewerPointers(event.pointerId);

  if (state.annotationDraftStroke) {
    if (state.annotationDraftStroke.inserted) {
      finalizeAnnotationDraft({
        reason: options.reason || "begin-pen-before-old-up",
        render: false,
      });
    } else {
      commitAnnotationDraft({
        reason: options.reason || "begin-pen-before-old-up",
        force: true,
      });
    }
  }

  if (state.annotationPenLeaveTimer) {
    clearTimeout(state.annotationPenLeaveTimer);
    state.annotationPenLeaveTimer = 0;
  }

  resizeAnnotationCanvas(canvas);

  const point = getAnnotationCanvasPoint(event, canvas);
  if (!point) {
    return false;
  }

  event.preventDefault();

  const pageId = canvas.dataset.pageId;
  const record = getAnnotationRecordForPage(pageId, { create: true });
  if (!record) {
    return false;
  }

  const eventTime = getPointerEventTime(event);
  const stroke = createAnnotationStroke({
    ...point,
    pressure: getPointerPressure(event),
    t: eventTime,
  });

  record.strokes = [...(record.strokes || []), stroke];
  record.updatedAt = new Date().toISOString();
  // 走与手指一致的去抖保存：保持 pageId 在待存队列中，由 500ms 定时器或退到后台时的
  // flush 可靠落库。避免 immediate 立即清空待存队列后、写入仍在途中就被系统杀掉而丢失。
  scheduleAnnotationSave(pageId);

  state.annotationDraftInserted = true;
  state.annotationDraftUndoRegistered = false;
  state.annotationPenActiveStrokeId = stroke.id;
  state.annotationLastPenDownAt = eventTime;
  state.annotationPointerId = event.pointerId;
  state.annotationDraftCanvas = canvas;
  state.annotationDraftStroke = {
    pointerId: event.pointerId,
    pointerType: "pen",
    pageId,
    stroke,
    inserted: true,
    undoRegistered: false,
    startedAt: eventTime,
  };

  renderAnnotationCanvas(canvas, record);
  return true;
}

function commitAnnotationDraft(options = {}) {
  const draft = state.annotationDraftStroke;
  if (!draft) {
    return false;
  }

  if (draft.inserted) {
    return finalizeAnnotationDraft(options);
  }

  const canvas =
    options.canvas ||
    state.annotationDraftCanvas ||
    elements.viewerPages?.querySelector(`.annotation-canvas[data-page-id="${cssEscape(draft.pageId)}"]`);
  const record = getAnnotationRecordForPage(draft.pageId, { create: true });

  if (!record) {
    clearAnnotationDraftState();
    return false;
  }

  const points = draft.stroke.points || [];
  if (!points.length) {
    clearAnnotationDraftState();
    return false;
  }

  if (points.length === 1) {
    points.push({ ...points[0] });
  }

  record.strokes = [...(record.strokes || []), draft.stroke];
  record.updatedAt = new Date().toISOString();
  state.annotationUndoStack.push({
    type: "stroke",
    pageId: draft.pageId,
    stroke: draft.stroke,
  });
  state.annotationRedoStack = [];
  scheduleAnnotationSave(draft.pageId);

  clearAnnotationDraftState();
  state.annotationLastCommittedAt = Date.now();

  if (canvas) {
    renderAnnotationCanvas(canvas, record);
  }

  updateAnnotationToolbarState();
  return true;
}

function appendAnnotationPointsFromEvent(event, canvas, options = {}) {
  const draft = state.annotationDraftStroke;
  if (!draft || draft.pointerId !== event.pointerId || !canvas) {
    return false;
  }

  const point = getAnnotationCanvasPoint(event, canvas);
  if (!point) {
    return false;
  }

  const nextPoint = {
    ...point,
    pressure: getPointerPressure(event),
    t: getPointerEventTime(event),
  };

  const points = draft.stroke.points;
  const last = points[points.length - 1];
  const rect = canvas.getBoundingClientRect();
  const minDistance = isPenPointer(event) ? 1 : 2;

  if (
    !options.final &&
    last &&
    Math.hypot((nextPoint.x - last.x) * rect.width, (nextPoint.y - last.y) * rect.height) < minDistance
  ) {
    return false;
  }

  points.push(nextPoint);
  if (draft.inserted) {
    const record = getAnnotationRecordForPage(draft.pageId);
    if (record) {
      record.updatedAt = new Date().toISOString();
    }
    // 去抖保存（不再用 immediate），与手指路径一致，确保退到后台时能可靠落库。
    scheduleAnnotationSave(draft.pageId);
  }
  return true;
}

function scheduleAnnotationRender(canvas) {
  state.annotationPendingRenderCanvas = canvas;

  if (state.annotationRenderFrame) {
    return;
  }

  state.annotationRenderFrame = requestAnimationFrame(() => {
    state.annotationRenderFrame = 0;
    const target = state.annotationPendingRenderCanvas;
    state.annotationPendingRenderCanvas = null;

    if (!target) {
      return;
    }

    renderAnnotationCanvas(target, state.annotationRecords.get(target.dataset.pageId));
  });
}

function handleAnnotationPointerDown(event) {
  if (!state.annotationMode) {
    return;
  }
  const isPen = isPenPointer(event);
  if (isPen) {
    const canvas = event.currentTarget?.classList?.contains("annotation-canvas")
      ? event.currentTarget
      : getAnnotationCanvasFromPoint(event);
    beginPenAnnotationStroke(event, canvas, { reason: "pen-pointerdown" });
    return;
  }

  if (isTouchPointer(event) && !event.isPrimary) {
    return;
  }
  if (!event.isPrimary) {
    return;
  }
  if (isViewerPinching()) {
    return;
  }
  if (state.annotationDraftStroke) {
    commitAnnotationDraft({
      reason: "new-pointerdown-before-old-up",
      force: true,
    });
  }

  const canvas = event.currentTarget;
  resizeAnnotationCanvas(canvas);
  const point = getAnnotationCanvasPoint(event, canvas);
  if (!point) {
    return;
  }
  event.preventDefault();

  const pageId = canvas.dataset.pageId;
  const record = getAnnotationRecordForPage(pageId, { create: true });
  if (!record) {
    return;
  }

  const stroke = createAnnotationStroke({
    ...point,
    pressure: getPointerPressure(event),
    t: getPointerEventTime(event),
  });

  if (isPen) {
    record.strokes = [...(record.strokes || []), stroke];
    record.updatedAt = new Date().toISOString();

    state.annotationDraftInserted = true;
    state.annotationDraftUndoRegistered = false;
    state.annotationPenActiveStrokeId = stroke.id;
    state.annotationLastPenDownAt = getPointerEventTime(event);
    state.annotationPointerId = event.pointerId;
    state.annotationDraftCanvas = canvas;
    state.annotationDraftStroke = {
      pointerId: event.pointerId,
      pointerType: "pen",
      pageId,
      stroke,
      inserted: true,
      undoRegistered: false,
    };

    renderAnnotationCanvas(canvas, record);
    return;
  }

  try {
    canvas.setPointerCapture(event.pointerId);
  } catch (error) {
    console.warn(error);
  }

  state.annotationPointerId = event.pointerId;
  state.annotationDraftCanvas = canvas;
  state.annotationDraftStroke = {
    pointerId: event.pointerId,
    pointerType: getPointerKind(event),
    pageId,
    stroke,
    inserted: false,
    undoRegistered: false,
  };
  renderAnnotationCanvas(canvas, record);
}

function handleAnnotationPointerMove(event) {
  const isPen = isPenPointer(event);
  if (isPen) {
    clearPenFromViewerPointers(event.pointerId);
  }

  if (isViewerPinching() && !isPen) {
    return;
  }

  let draft = state.annotationDraftStroke;
  let canvas = event.currentTarget?.classList?.contains("annotation-canvas")
    ? event.currentTarget
    : state.annotationDraftCanvas;

  if (isPen && isActivePenContact(event) && (!draft || draft.pointerId !== event.pointerId)) {
    const fallbackCanvas = getAnnotationCanvasFromPoint(event) || canvas;
    if (fallbackCanvas) {
      const started = beginPenAnnotationStroke(event, fallbackCanvas, {
        reason: "pen-move-without-down",
      });

      if (!started) {
        return;
      }

      draft = state.annotationDraftStroke;
      canvas = fallbackCanvas;
    }
  }

  if (!state.annotationMode || !draft || draft.pointerId !== event.pointerId) {
    return;
  }

  canvas = canvas || state.annotationDraftCanvas || getAnnotationCanvasFromPoint(event);
  if (!canvas) {
    return;
  }
  event.preventDefault();
  const changed = appendAnnotationPointsFromEvent(event, canvas);
  if (changed) {
    renderAnnotationCanvas(canvas, state.annotationRecords.get(draft.pageId));
  }
}

function handleAnnotationPointerEnd(event) {
  const draft = state.annotationDraftStroke;
  if (!draft || draft.pointerId !== event.pointerId) {
    return;
  }
  const isPen = isPenPointer(event);
  if (isPen) {
    clearPenFromViewerPointers(event.pointerId);
  }
  if (
    isPen &&
    Number.isFinite(draft.startedAt) &&
    getPointerEventTime(event) + 1 < draft.startedAt
  ) {
    return;
  }
  if (isViewerPinching() && !isPen) {
    cancelAnnotationDraft();
    return;
  }

  const canvas = event.currentTarget || state.annotationDraftCanvas;
  if (canvas) {
    event.preventDefault();
    appendAnnotationPointsFromEvent(event, canvas, { final: true });
  }
  if (!isPen) {
    try {
      canvas?.releasePointerCapture(event.pointerId);
    } catch (error) {
      console.warn(error);
    }
  }
  state.annotationLastPointerUpAt = getPointerEventTime(event);
  if (draft.inserted) {
    finalizeAnnotationDraft({
      canvas,
      reason: event.type || "pen-pointer-end",
    });
  } else {
    commitAnnotationDraft({
      canvas,
      reason: event.type || "pointer-end",
    });
  }
}

function handleAnnotationPointerMaybeLeave(event) {
  return;
}

function handlePenAnnotationFallbackDown(event) {
  if (!state.annotationMode || !isPenPointer(event)) {
    return;
  }

  if (event.target?.closest?.(".annotation-canvas")) {
    return;
  }

  const canvas = getAnnotationCanvasFromPoint(event);
  if (!canvas) {
    return;
  }

  beginPenAnnotationStroke(event, canvas, {
    reason: "pen-fallback-down",
  });
}

function handlePenAnnotationFallbackMove(event) {
  if (!state.annotationMode || !isActivePenContact(event)) {
    return;
  }

  if (event.target?.closest?.(".annotation-canvas")) {
    return;
  }

  const draft = state.annotationDraftStroke;
  let canvas = state.annotationDraftCanvas || getAnnotationCanvasFromPoint(event);

  if (!draft || draft.pointerId !== event.pointerId) {
    canvas = getAnnotationCanvasFromPoint(event) || canvas;
    if (!canvas) {
      return;
    }

    const started = beginPenAnnotationStroke(event, canvas, {
      reason: "pen-fallback-move-without-down",
    });

    if (!started) {
      return;
    }
  }

  canvas = state.annotationDraftCanvas || canvas;
  if (!canvas) {
    return;
  }

  event.preventDefault();

  const changed = appendAnnotationPointsFromEvent(event, canvas);
  if (changed) {
    renderAnnotationCanvas(canvas, state.annotationRecords.get(canvas.dataset.pageId));
  }
}

function undoAnnotationStroke() {
  const action = state.annotationUndoStack.pop();
  if (!action) {
    return;
  }
  const record = getAnnotationRecordForPage(action.pageId);
  if (!record) {
    return;
  }
  if (action.type === "clear") {
    record.strokes = action.previousStrokes || [];
  } else {
    record.strokes = (record.strokes || []).filter((stroke) => stroke.id !== action.stroke.id);
  }
  state.annotationRedoStack.push(action);
  record.updatedAt = new Date().toISOString();
  scheduleAnnotationSave(action.pageId, { immediate: true });
  renderAllVisibleAnnotations();
  updateAnnotationToolbarState();
}

function redoAnnotationStroke() {
  const action = state.annotationRedoStack.pop();
  if (!action) {
    return;
  }
  const record = getAnnotationRecordForPage(action.pageId, { create: true });
  if (!record) {
    return;
  }
  if (action.type === "clear") {
    record.strokes = [];
  } else {
    record.strokes = [...(record.strokes || []), action.stroke];
  }
  state.annotationUndoStack.push(action);
  record.updatedAt = new Date().toISOString();
  scheduleAnnotationSave(action.pageId, { immediate: true });
  renderAllVisibleAnnotations();
  updateAnnotationToolbarState();
}

async function clearCurrentPageAnnotations() {
  const pageId = getCurrentViewerPageId();
  if (!pageId) {
    return;
  }
  const record = getAnnotationRecordForPage(pageId, { create: true });
  if (!record || !(record.strokes || []).length) {
    return;
  }
  const confirmed = await requestDeleteConfirmation({
    title: "清空本页标注？",
    message: "只会清空当前页的标注，不会删除原始歌谱图片。",
  });
  if (!confirmed) {
    return;
  }
  const previousStrokes = [...record.strokes];
  record.strokes = [];
  record.updatedAt = new Date().toISOString();
  state.annotationUndoStack.push({ type: "clear", pageId, previousStrokes });
  state.annotationRedoStack = [];
  scheduleAnnotationSave(pageId, { immediate: true });
  renderAllVisibleAnnotations();
  updateAnnotationToolbarState();
}

function toggleAnnotationVisibility() {
  state.annotationVisible = !state.annotationVisible;
  elements.viewerDialog?.classList.toggle("annotations-hidden", !state.annotationVisible);
  renderAllVisibleAnnotations();
  updateAnnotationToolbarState();
}

function queueScoreMetadataSave(scoreId, createRecord) {
  const previous = state.scoreMetadataSaveChains.get(scoreId) || Promise.resolve();
  const task = previous
    .catch(() => {})
    .then(async () => {
      const latestScore = state.scores.find((item) => item.id === scoreId);
      if (!latestScore) {
        return null;
      }

      const record = createRecord(latestScore);
      await putScore(record);
      return record;
    });
  const cleanupTask = task.finally(() => {
    if (state.scoreMetadataSaveChains.get(scoreId) === cleanupTask) {
      state.scoreMetadataSaveChains.delete(scoreId);
    }
  });
  state.scoreMetadataSaveChains.set(scoreId, cleanupTask);
  return cleanupTask;
}

function setViewerPageIndicator(current, total) {
  if (!elements.viewerPageIndicator) {
    return;
  }
  const safeTotal = Math.max(1, Number(total) || 1);
  const safeCurrent = clamp(Number(current) || 1, 1, safeTotal);
  elements.viewerPageIndicator.textContent = `${safeCurrent} / ${safeTotal}`;
}

function scheduleViewerPageIndicatorUpdate() {
  if (state.viewerPageIndicatorFrame) {
    return;
  }

  state.viewerPageIndicatorFrame = requestAnimationFrame(() => {
    state.viewerPageIndicatorFrame = 0;
    updateViewerPageIndicator();
  });
}

function updateViewerPageIndicator() {
  const pages = Array.from(elements.viewerPages.querySelectorAll(".viewer-page"));
  if (!pages.length) {
    setViewerPageIndicator(1, 1);
    return;
  }

  const horizontal = elements.viewerPages.classList.contains("is-horizontal-mode") && !elements.viewerPages.classList.contains("is-zoomed");
  let currentIndex = 0;

  if (horizontal) {
    const pageWidth = Math.max(1, pages[0].getBoundingClientRect().width || elements.viewerPages.clientWidth);
    currentIndex = clamp(Math.round(elements.viewerPages.scrollLeft / pageWidth), 0, pages.length - 1);
  } else {
    const offsets = pages.map((page) => page.offsetTop);
    const canUseOffsets = offsets.some((offset, index) => index > 0 && offset !== offsets[0]);
    if (canUseOffsets) {
      const targetTop = elements.viewerPages.scrollTop + Math.max(1, elements.viewerPages.clientHeight * 0.25);
      offsets.forEach((offset, index) => {
        if (offset <= targetTop) {
          currentIndex = index;
        }
      });
    } else {
      const containerRect = elements.viewerPages.getBoundingClientRect();
      const target = containerRect.top + containerRect.height / 2;
      let bestDistance = Number.POSITIVE_INFINITY;
      pages.forEach((page, index) => {
        const rect = page.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - target);
        if (distance < bestDistance) {
          bestDistance = distance;
          currentIndex = index;
        }
      });
    }
  }

  // 滚动到末端时直接判定为最后一页：当最后一页图片较矮时，仅靠上述阈值无法选中它，
  // 会卡在“倒数第二页”，导致末页页码和调号都显示不出来。
  const boundaryIndex = getViewerBoundaryPageIndex(pages, horizontal);
  if (boundaryIndex !== null) {
    currentIndex = boundaryIndex;
  }

  setViewerPageIndicator(currentIndex + 1, pages.length);
  updateViewerKeySignatureForIndex(currentIndex);
  updateViewerPianoKeySignature();
  preloadViewerNeighbors(currentIndex);
}

async function toggleViewerPerformanceMode() {
  if (state.viewerPerformanceMode) {
    await exitViewerPerformanceMode();
  } else {
    await enterViewerPerformanceMode();
  }
}

async function enterViewerPerformanceMode() {
  if (state.annotationMode) {
    setAnnotationMode(false, { deferSave: true });
    await flushAnnotationSave().catch((error) => console.warn(error));
  }
  state.viewerPerformanceMode = true;
  elements.viewerDialog.classList.add("is-performance-mode");
  elements.viewerPerformanceText.textContent = "退出";
  elements.viewerPerformanceButton?.setAttribute("aria-pressed", "true");
  await requestViewerWakeLock();
}

async function exitViewerPerformanceMode(options = {}) {
  if (!state.viewerPerformanceMode && !state.wakeLockSentinel) {
    return;
  }

  state.viewerPerformanceMode = false;
  elements.viewerDialog?.classList.remove("is-performance-mode");
  if (elements.viewerPerformanceText) {
    elements.viewerPerformanceText.textContent = "演出";
  }
  elements.viewerPerformanceButton?.setAttribute("aria-pressed", "false");
  await releaseViewerWakeLock();
  if (!options.silent) {
    setStatus("");
  }
}

async function requestViewerWakeLock() {
  if (!("wakeLock" in navigator) || typeof navigator.wakeLock?.request !== "function") {
    return;
  }

  try {
    state.wakeLockSentinel = await navigator.wakeLock.request("screen");
    state.wakeLockSentinel.addEventListener("release", () => {
      state.wakeLockSentinel = null;
    });
  } catch (error) {
    console.warn("Wake Lock unavailable.", error);
  }
}

async function releaseViewerWakeLock() {
  const sentinel = state.wakeLockSentinel;
  state.wakeLockSentinel = null;
  try {
    await sentinel?.release?.();
  } catch (error) {
    console.warn("Wake Lock release failed.", error);
  }
}

function handleWakeLockVisibilityChange() {
  if (document.visibilityState === "visible" && state.viewerPerformanceMode && !state.wakeLockSentinel) {
    requestViewerWakeLock();
  }
}

function resetViewerGestureState() {
  state.viewerPointers.clear();
  state.viewerPinchStartDistance = 0;
  state.viewerPinchStartZoom = VIEWER_MIN_ZOOM;
  state.viewerDrag = null;
  state.viewerTapStart = null;
  state.viewerLastTap = null;
  elements.viewerPages.classList.remove("is-dragging", "is-pinching", "has-multiple-pages", "is-horizontal-mode");
}

function createSetlistViewerScore(setlist) {
  let pageIndex = 0;
  const pages = getSetlistScores(setlist.id).flatMap((score) =>
    [...(score.pages || [])]
      .sort((a, b) => a.pageIndex - b.pageIndex)
      .map((page) => ({
        ...page,
        pageIndex: pageIndex++,
      })),
  );

  return {
    id: `setlist:${setlist.id}`,
    name: setlist.name,
    pages,
  };
}

async function prepareSetlistViewerPages(setlistId) {
  try {
    const scores = getSetlistScores(setlistId);
    if (!scores.length) {
      return;
    }

    const initialSetlist = state.setlists.find((item) => item.id === setlistId);
    prioritizeScorePageDisplay(initialSetlist ? createSetlistViewerScore(initialSetlist).pages : []);

    if (!(await ensureCloudMediaReady())) {
      return;
    }

    prioritizeScorePageDisplay(initialSetlist ? createSetlistViewerScore(initialSetlist).pages : []);

    try {
      await runWithConcurrency(scores, 2, (score) => refreshScorePagesFromCloud(score.id));
      const setlist = state.setlists.find((item) => item.id === setlistId);
      if (setlist && elements.viewerDialog.open && state.currentViewerSetlistId === setlistId) {
        const previousScrollTop = elements.viewerPages.scrollTop;
        const previousScrollLeft = elements.viewerPages.scrollLeft;
        const virtualScore = createSetlistViewerScore(setlist);
        renderViewerPages(virtualScore);
        updateViewerPianoKeySignature();
        requestAnimationFrame(() => {
          elements.viewerPages.scrollTo({ top: previousScrollTop, left: previousScrollLeft });
        });
      }
    } catch (error) {
      console.warn(error);
    }

    const setlist = state.setlists.find((item) => item.id === setlistId);
    const virtualScore = setlist ? createSetlistViewerScore(setlist) : null;
    prioritizeScorePageDisplay(virtualScore?.pages || []);
  } catch (error) {
    console.warn(error);
  }
}

function removeScoresFromMemory(scores) {
  const scoreIds = new Set(scores.filter(Boolean).map((score) => score.id));
  if (!scoreIds.size) {
    return;
  }

  scores.forEach(revokeScoreUrls);
  state.scores = state.scores.filter((score) => !scoreIds.has(score.id));
  state.scorePages = state.scorePages.filter((page) => !scoreIds.has(page.scoreId));
  state.setlistItems = state.setlistItems.filter((item) => !scoreIds.has(item.scoreId));
  state.annotationRecords.forEach((record, pageId) => {
    if (scoreIds.has(record.scoreId)) {
      state.annotationRecords.delete(pageId);
    }
  });
  if (state.currentViewerScoreId && scoreIds.has(state.currentViewerScoreId)) {
    closeViewerUI();
  }
}

function queueDeleteSyncForScores(scores, deletedAt) {
  const targets = scores.filter((score) => shouldKeepDeleteTombstone(score));
  if (!targets.length) {
    return;
  }

  // 把云端删除入队到发件箱：携带必要的快照（页 id / storagePath 等），因为本地记录此时已被移除。
  targets.forEach((score) => {
    const pages = (score.pages && score.pages.length
      ? score.pages
      : state.scorePages.filter((page) => page.scoreId === score.id)
    ).map(({ blob, ...rest }) => rest);
    enqueueOutboxTask("score.delete", {
      entityId: score.id,
      supersedeUpsert: true,
      payload: { score: { ...toScoreRecord(score), pages }, deletedAt },
    }).catch((error) => console.warn(error));
  });
  kickOutbox(0);
}

function queueDeleteSyncForAnnotations(annotations, deletedAt) {
  (annotations || [])
    .filter((annotation) => annotation?.id)
    .forEach((annotation) => {
      enqueueOutboxTask("DELETE_ANNOTATION", {
        entityId: annotation.id,
        entityType: "annotation",
        dedupeKey: `annotation.delete:${annotation.id}`,
        payload: { annotation: { ...annotation, deletedAt, updatedAt: deletedAt }, deletedAt },
      }).catch((error) => console.warn(error));
    });
  if ((annotations || []).length) {
    kickOutbox(0);
  }
}

function queueDeleteSyncForFolder(folder, folderScores, deletedAt) {
  if (!shouldKeepDeleteTombstone(folder)) {
    return;
  }
  const scores = (folderScores || []).map((score) => {
    const pages = (score.pages && score.pages.length
      ? score.pages
      : state.scorePages.filter((page) => page.scoreId === score.id)
    ).map(({ blob, ...rest }) => rest);
    return { ...toScoreRecord(score), pages };
  });
  enqueueOutboxTask("folder.delete", {
    entityId: folder.id,
    payload: { folder: { ...folder }, folderScores: scores, deletedAt },
  }).catch((error) => console.warn(error));
  kickOutbox(0);
}

function getDeleteRecoveryAction(scoreIds) {
  return {
    type: "deleteScores",
    scoreIds: Array.from(new Set((scoreIds || []).filter(Boolean).map(String))),
    createdAt: new Date().toISOString(),
  };
}

function isSameDeleteRecoveryAction(action, scoreIds) {
  if (action?.type !== "deleteScores") {
    return false;
  }
  const left = Array.from(new Set((action.scoreIds || []).map(String))).sort().join(",");
  const right = Array.from(new Set((scoreIds || []).map(String))).sort().join(",");
  return Boolean(left && left === right);
}

function showDeleteRecoveryDialog(scoreIds, message) {
  showDatabaseRecoveryDialog(
    message ||
      "本地存储仍未响应。点击“重试”会重置本地存储、从云端恢复数据，并继续执行删除。",
    {
      force: true,
      pendingAction: getDeleteRecoveryAction(scoreIds),
    },
  );
}

async function retryDeleteScoresAfterLocalRecovery(scoreIds, originalError) {
  const ids = Array.from(new Set((scoreIds || []).filter(Boolean).map(String)));
  if (!ids.length) {
    return false;
  }

  let settled = false;
  const promptTimer = window.setTimeout(() => {
    if (!settled) {
      showDeleteRecoveryDialog(ids);
    }
  }, 3000);

  try {
    setStatus("本地存储短暂未响应，正在自动恢复并重试删除...");
    await recoverDatabaseIfWedged(originalError);
    const recovered = await recoverLocalDatabase();
    if (!recovered) {
      throw originalError || new Error("本地数据库恢复失败。");
    }

    const deleted = await deleteScoresStable(ids, {
      skipConfirm: true,
      autoRetried: true,
      suppressRecoveryDialog: true,
    });
    settled = true;
    if (deleted) {
      if (isSameDeleteRecoveryAction(state.dbRecoveryPendingAction, ids)) {
        state.dbRecoveryPendingAction = null;
      }
      hideDatabaseRecoveryDialog();
    } else {
      showDeleteRecoveryDialog(ids);
    }
    return deleted;
  } catch (error) {
    settled = true;
    console.warn("自动恢复并重试删除失败", error);
    if (isRecoverableDatabaseError(error) || isRecoverableDatabaseError(originalError)) {
      showDeleteRecoveryDialog(ids);
    } else {
      setStatus(getStorageErrorMessage(error, "删除"), true);
    }
    return false;
  } finally {
    window.clearTimeout(promptTimer);
  }
}

async function deleteScoresStable(scoreIds, options = {}) {
  if (!ensureAppReady()) {
    return false;
  }

  const ids = Array.from(new Set((scoreIds || []).filter(Boolean).map(String)));
  const targets = ids
    .map((id) => state.scores.find((score) => score.id === id))
    .filter(Boolean);

  if (!targets.length) {
    return false;
  }

  // 用户确认放在操作锁之外：等待确认期间不持有锁，避免弹窗未响应时锁被永久占用、
  // 进而导致之后所有删除“点了没反应”。
  if (!options.skipConfirm) {
    const confirmed =
      targets.length === 1
        ? await requestDeleteConfirmation(targets[0])
        : await requestDeleteConfirmation({
            title: "删除歌谱？",
            message: `确定删除 ${targets.length} 份歌谱吗？删除后无法恢复。`,
          });
    if (!confirmed) {
      return false;
    }
  }

  return withOperationLock("deleteScores", async () => {
    return runUserCommand(
      targets.length > 1 ? "score.batchDelete" : "score.delete",
      async ({ commandId }) => {
        const deletedAt = new Date().toISOString();
        const cloudDeleteQueued = targets.some((score) => shouldKeepDeleteTombstone(score));
        const annotationsForDeleteSync = await readAnnotationsForScoreIds(ids);

        setStatus("正在从本机删除...");
        // 删除前先把完整副本存入回收站，便于恢复（失败不阻断删除本身）。
        // 但回收站会再复制一份图片：存储紧张时跳过备份，避免把本地库撑爆 / 删除写入失败。
        try {
          if (shouldAttemptTrashSnapshot(targets) && (await hasRoomForTrashSnapshot(targets))) {
            await snapshotScoresToTrash(targets);
          } else {
            console.info("跳过回收站快照：歌谱图片较大或本地空间不足，优先保证删除完成。");
          }
        } catch (snapshotError) {
          console.warn("写入回收站失败", snapshotError);
        }
        await deleteScoresLocalAtomic(ids, { scores: targets, deletedAt });
        await recordLocalOperation({
          id: commandId,
          type: targets.length > 1 ? "score.batchDelete" : "score.delete",
          entityType: "score",
          entityId: targets.length === 1 ? targets[0].id : "",
          payload: {
            scoreIds: ids,
            count: targets.length,
            deletedAt,
          },
        });
        removeScoresFromMemory(targets);

        let rendered = true;
        try {
          renderScores();
          renderSetlists();
        } catch (renderError) {
          rendered = false;
          console.error(renderError);
          setStatus("数据已删除，但页面刷新失败，请手动刷新。", true);
        }

        queueDeleteSyncForScores(targets, deletedAt);
        queueDeleteSyncForAnnotations(annotationsForDeleteSync, deletedAt);
        if (rendered) {
          setStatus(cloudDeleteQueued ? `已删除 ${targets.length} 份歌谱，稍后同步云端。` : `已删除 ${targets.length} 份歌谱。`);
        }
        return true;
      },
      {
        label: targets.length > 1 ? "正在批量删除歌谱..." : "正在删除歌谱...",
        slowLabel: "本地存储较忙，正在优先删除您的歌谱...",
        failMessage: "删除歌谱失败，请稍后重试。",
        timeoutMs: Math.max(OPERATION_LOCK_TIMEOUT, ids.length * 5000),
      },
    );
  }, { timeoutMs: Math.max(OPERATION_LOCK_TIMEOUT, ids.length * 5000) }).catch(async (error) => {
    logStorageOperationError(error, "删除", {
      scoreIds: ids,
      pagesLength: state.scorePages.filter((page) => ids.includes(page.scoreId)).length,
    });
    if (!options.autoRetried && !options.fromRecoveryDialog && isRecoverableDatabaseError(error)) {
      return retryDeleteScoresAfterLocalRecovery(ids, error);
    }
    // 删除超时/中断时连接可能已卡死，重连数据库，保证用户重试以及后续保存能恢复。
    await recoverDatabaseIfWedged(error);
    setStatus(error.message === "当前操作正在进行，请稍候。" ? error.message : getStorageErrorMessage(error, "删除"), true);
    // 仅当删除“整体失败”且确属数据库卡死时，才弹恢复弹窗（避免中途事务抖动误弹）。
    if (!options.suppressRecoveryDialog) {
      showRecoveryDialogIfDbWedged(error, {
        pendingAction: getDeleteRecoveryAction(ids),
      });
    }
    return false;
  });
}

async function deleteScore(id) {
  await deleteScoresStable([id]);
}

async function deleteFolder(id) {
  if (!ensureAppReady()) {
    return;
  }

  const folder = state.folders.find((item) => item.id === id);
  if (!folder) {
    return;
  }

  const folderScores = state.scores.filter((score) => score.folderId === id);
  const confirmed = await requestDeleteConfirmation({
    title: "删除文件夹？",
    message: `确定删除《${folder.name}》文件夹吗？其中 ${folderScores.length} 份歌谱也会一起删除，删除后无法恢复。`,
  });
  if (!confirmed) {
    return;
  }

  try {
    await runUserCommand(
      "folder.delete",
      async ({ commandId }) => {
        const deletedAt = new Date().toISOString();
        const cloudDeleteQueued = shouldKeepDeleteTombstone(folder);
        const folderScoreIds = new Set(folderScores.map((score) => score.id));
        const annotationsForDeleteSync = await readAnnotationsForScoreIds(Array.from(folderScoreIds));

        // 文件夹内的歌谱也先快照到回收站，便于单独恢复。
        if (folderScores.length) {
          try {
            if (shouldAttemptTrashSnapshot(folderScores) && (await hasRoomForTrashSnapshot(folderScores))) {
              await snapshotScoresToTrash(folderScores);
            } else {
              console.info("跳过文件夹回收站快照：歌谱图片较大或本地空间不足，优先保证删除完成。");
            }
          } catch (snapshotError) {
            console.warn("写入回收站失败", snapshotError);
          }
        }

        if (cloudDeleteQueued) {
          await markFolderDeletedRecord(folder, folderScores, deletedAt);
        } else {
          await deleteFolderRecord(
            id,
            folderScores.map((score) => score.id),
          );
        }
        await recordLocalOperation({
          id: commandId,
          type: "folder.delete",
          entityType: "folder",
          entityId: id,
          payload: {
            folderId: id,
            scoreIds: Array.from(folderScoreIds),
            deletedAt,
          },
        });
        folderScores.forEach(revokeScoreUrls);
        state.folders = state.folders.filter((item) => item.id !== id);
        state.scores = state.scores.filter((score) => score.folderId !== id);
        state.scorePages = state.scorePages.filter((page) => !folderScoreIds.has(page.scoreId));
        state.setlistItems = state.setlistItems.filter((item) => !folderScoreIds.has(item.scoreId));
        state.annotationRecords.forEach((record, pageId) => {
          if (folderScoreIds.has(record.scoreId)) {
            state.annotationRecords.delete(pageId);
          }
        });
        if (state.currentFolderId === id) {
          state.currentFolderId = null;
        }
        renderScores();
        renderSetlists();
        if (cloudDeleteQueued) {
          queueDeleteSyncForFolder(folder, folderScores, deletedAt);
          queueDeleteSyncForAnnotations(annotationsForDeleteSync, deletedAt);
        }
        setStatus(
          cloudDeleteQueued
            ? `已删除《${folder.name}》文件夹，正在后台同步到云端。`
            : `已删除《${folder.name}》文件夹。`,
        );
      },
      {
        label: "正在删除文件夹...",
        slowLabel: "本地存储较忙，正在优先删除文件夹...",
        failMessage: "删除文件夹失败，请稍后重试。",
        timeoutMs: Math.max(OPERATION_LOCK_TIMEOUT, folderScores.length * 5000 + 10000),
      },
    );
  } catch (error) {
    console.error(error);
    await recoverDatabaseIfWedged(error);
    setStatus(getErrorMessage(error) || "删除文件夹失败，请稍后再试。", true);
    showRecoveryDialogIfDbWedged(error);
  }
}

async function deleteCloudScore(score, deletedAt = new Date().toISOString()) {
  const pageIds = (score.pages || []).map((page) => page.id);
  const paths = (score.pages || []).map((page) => page.storagePath).filter(Boolean);
  const userId = score.userId || state.session?.user?.id || null;
  const deletedScore = {
    ...toScoreRecord(score),
    userId,
    deletedAt,
    updatedAt: deletedAt,
  };
  const deletedPages = (score.pages || []).map((page) => ({
    ...page,
    userId: page.userId || userId,
    deletedAt,
    updatedAt: deletedAt,
  }));

  if (pageIds.length) {
    await upsertCloud(CLOUD_TABLES.pages, deletedPages.map(toCloudPage));
  }
  await upsertCloud(CLOUD_TABLES.scores, [toCloudScore(deletedScore)]);
  await deleteCloudShareItemsForScores([score.id]);
  await cleanupCloudFilesAfterDelete(paths, userId);
}

async function deleteCloudFolder(folder, folderScores, deletedAt = new Date().toISOString()) {
  const paths = folderScores.flatMap((score) => (score.pages || []).map((page) => page.storagePath).filter(Boolean));
  const scoreIds = folderScores.map((score) => score.id);
  const userId = folder.userId || state.session?.user?.id || null;
  const deletedFolder = {
    ...folder,
    userId,
    deletedAt,
    updatedAt: deletedAt,
  };
  const deletedScores = folderScores.map((score) => ({
    ...toScoreRecord(score),
    userId: score.userId || userId,
    deletedAt,
    updatedAt: deletedAt,
  }));
  const deletedPages = folderScores.flatMap((score) =>
    (score.pages || []).map((page) => ({
      ...page,
      userId: page.userId || score.userId || userId,
      deletedAt,
      updatedAt: deletedAt,
    })),
  );

  if (deletedPages.length) {
    await upsertCloud(CLOUD_TABLES.pages, deletedPages.map(toCloudPage));
  }
  if (deletedScores.length) {
    await upsertCloud(CLOUD_TABLES.scores, deletedScores.map(toCloudScore));
  }
  await upsertCloud(CLOUD_TABLES.folders, [toCloudFolder(deletedFolder)]);
  await deleteCloudShareItemsForFolders([folder.id]);
  await deleteCloudShareItemsForScores(scoreIds);
  await cleanupCloudFilesAfterDelete(paths, userId);
}

async function cleanupCloudFilesAfterDelete(paths, userId) {
  try {
    await deleteCloudFiles(paths.filter((path) => isOwnStoragePath(path, userId)));
  } catch (error) {
    console.warn(error);
  }
}

function requestDeleteConfirmation(target) {
  if (state.deleteDialogResolve) {
    state.deleteDialogResolve(false);
    state.deleteDialogResolve = null;
  }

  const title = target.title || "删除歌谱？";
  const message = target.message || `确定删除《${target.name}》吗？删除后无法恢复。`;
  if (elements.deleteDialogTitle) {
    elements.deleteDialogTitle.textContent = title;
  }
  elements.deleteDialogMessage.textContent = message;
  refreshIcons();

  return new Promise((resolve) => {
    state.deleteDialogResolve = resolve;

    openDialogSafely(elements.deleteDialog);

    try {
      elements.cancelDeleteButton?.focus({ preventScroll: true });
    } catch (error) {
      console.warn(error);
    }
  });
}

function closeDeleteDialog(confirmed) {
  closeDialogSafely(elements.deleteDialog);

  if (state.deleteDialogResolve) {
    state.deleteDialogResolve(confirmed);
    state.deleteDialogResolve = null;
  }
}

function renderViewerPages(score) {
  const pages = [...(score.pages || [])].sort((a, b) => a.pageIndex - b.pageIndex);
  const horizontalMode = state.viewerMode === VIEWER_MODE_LANDSCAPE && pages.length > 1;
  state.currentViewerPages = pages;
  elements.viewerPages.replaceChildren();
  elements.viewerPages.classList.toggle("has-multiple-pages", pages.length > 1);
  elements.viewerPages.classList.toggle("is-horizontal-mode", horizontalMode);

  pages.forEach((page, index) => {
    const figure = document.createElement("figure");
    figure.className = "viewer-page";
    figure.dataset.pageNumber = String(index + 1);
    figure.dataset.pageId = page.id;

    const image = document.createElement("img");
    image.className = "viewer-page-image";
    image.draggable = false;
    image.decoding = "async";
    // 首页立即加载，其余页懒加载，避免一次性解码所有大图。未加载前给页面预留高度
    // （is-page-pending），防止竖向多页布局塌陷、滚动错乱；加载完成即恢复自然高度。
    if (index === 0) {
      image.loading = "eager";
    } else {
      image.loading = "lazy";
      figure.classList.add("is-page-pending");
      const clearPending = () => figure.classList.remove("is-page-pending");
      image.addEventListener("load", clearPending, { once: true });
      image.addEventListener("error", clearPending, { once: true });
    }
    image.alt = `《${score.name}》第 ${index + 1} 页`;

    const imageFrame = document.createElement("div");
    imageFrame.className = "viewer-image-frame";
    const shell = document.createElement("div");
    shell.className = "viewer-page-shell";
    shell.dataset.pageId = page.id;
    const canvas = document.createElement("canvas");
    canvas.className = "annotation-canvas";
    canvas.dataset.pageId = page.id;
    canvas.setAttribute("aria-hidden", "true");
    canvas.addEventListener("pointerdown", handleAnnotationPointerDown);
    canvas.addEventListener("pointermove", handleAnnotationPointerMove);
    canvas.addEventListener("pointerup", handleAnnotationPointerEnd);
    canvas.addEventListener("pointercancel", handleAnnotationPointerEnd);
    image.addEventListener("load", () => {
      resizeAnnotationCanvas(canvas);
      renderAnnotationCanvas(canvas, state.annotationRecords.get(page.id));
    });
    shell.append(image, canvas);
    imageFrame.append(shell);

    figure.append(imageFrame);
    elements.viewerPages.append(figure);
    bindScorePageImage(image, page, { hydrate: false });
    requestAnimationFrame(() => {
      resizeAnnotationCanvas(canvas);
      renderAnnotationCanvas(canvas, state.annotationRecords.get(page.id));
    });
  });
  setViewerPageIndicator(1, pages.length || 1);
  scheduleViewerPageIndicatorUpdate();
  preloadViewerNeighbors(0);
  prioritizeScorePageDisplay(pages);
  loadAnnotationsForPages(pages.map((page) => page.id)).then(() => {
    requestAnimationFrame(() => {
      refreshViewerAnnotationCanvases();
    });
  });
}

// 预加载当前页及其相邻页（下一页/上一页）：提前解码，使翻页时立即显示，不必等待懒加载。
function preloadViewerNeighbors(currentIndex) {
  const images = elements.viewerPages?.querySelectorAll(".viewer-page img");
  if (!images || !images.length) {
    return;
  }
  const base = Number(currentIndex) || 0;
  [base, base + 1, base + 2, base - 1].forEach((index) => {
    const image = images[index];
    if (!image) {
      return;
    }
    // 取消懒加载延迟并触发解码，确保相邻页提前就绪。
    image.loading = "eager";
    if (typeof image.decode === "function") {
      image.decode().catch(() => {});
    }
  });
}

function getLatestScorePages(scoreId, fallbackPages = []) {
  const latestScore = state.scores.find((score) => score.id === scoreId);
  const scorePages = state.scorePages.filter((page) => page.scoreId === scoreId && !page.deletedAt);
  const scoreRecordPages = (latestScore?.pages || []).filter((page) => !page.deletedAt);
  const viewerPages =
    state.currentViewerScoreId === scoreId
      ? state.currentViewerPages.filter((page) => page.scoreId === scoreId)
      : [];
  const pages =
    scorePages.length > scoreRecordPages.length
      ? scorePages
      : scoreRecordPages.length
        ? scoreRecordPages
        : scorePages.length
          ? scorePages
        : viewerPages.length
          ? viewerPages
          : fallbackPages;
  return [...(pages || [])].sort((a, b) => a.pageIndex - b.pageIndex);
}

async function prepareViewerPages(scoreId, fallbackPages = []) {
  try {
    let pages = getLatestScorePages(scoreId, fallbackPages);
    if (!pages.length) {
      return;
    }

    prioritizeScorePageDisplay(pages);

    if (!(await ensureCloudMediaReady())) {
      return;
    }

    pages = getLatestScorePages(scoreId, pages);
    prioritizeScorePageDisplay(pages);

    try {
      await refreshScorePagesFromCloud(scoreId);
      pages = getLatestScorePages(scoreId, pages);
      rerenderOpenViewerIfPageListChanged(scoreId);
    } catch (error) {
      console.warn(error);
    }

    pages = getLatestScorePages(scoreId, pages);
    prioritizeScorePageDisplay(pages);
  } catch (error) {
    console.warn(error);
  }
}

function rerenderOpenViewerIfPageListChanged(scoreId) {
  if (!elements.viewerDialog.open || state.currentViewerScoreId !== scoreId) {
    return;
  }

  const score = state.scores.find((item) => item.id === scoreId);
  if (!score) {
    return;
  }

  const latestPages = getLatestScorePages(scoreId, state.currentViewerPages);
  if (!latestPages.length) {
    return;
  }

  const renderedIds = Array.from(elements.viewerPages.querySelectorAll("img[data-page-id]")).map((image) => image.dataset.pageId);
  const latestIds = latestPages.map((page) => page.id);
  const samePages = renderedIds.length === latestIds.length && renderedIds.every((id, index) => id === latestIds[index]);
  if (samePages) {
    return;
  }

  const previousScrollTop = elements.viewerPages.scrollTop;
  const previousScrollLeft = elements.viewerPages.scrollLeft;
  renderViewerPages({
    ...score,
    pages: latestPages,
  });
  updateViewerPianoKeySignature();
  requestAnimationFrame(() => {
    elements.viewerPages.scrollTo({ top: previousScrollTop, left: previousScrollLeft });
  });
}

async function ensureCloudMediaReady() {
  if (!state.cloudReady) {
    const ready = await initializeCloud();
    if (!ready) {
      return false;
    }
  }

  if (!state.session) {
    await restoreCloudSession();
  }

  return Boolean(state.cloudReady && state.session);
}

async function refreshScorePagesFromCloud(scoreId) {
  if (!scoreId || !state.session || !state.cloudReady) {
    return;
  }

  const rows = await queryCloudRows(
    CLOUD_TABLES.pages,
    {
      user_id: state.session.user.id,
      score_id: scoreId,
    },
    {
      orderBy: [["page_index", "asc"]],
    },
  );
  const cloudPages = rows.filter(isCloudRowActive).map(fromCloudPage);
  if (!cloudPages.length) {
    return;
  }

  const localPageById = new Map(state.scorePages.map((page) => [page.id, page]));
  const mergedPages = cloudPages.map((page) => {
    const localPage = localPageById.get(page.id);
    return {
      ...page,
      assetId: localPage?.assetId || page.assetId || "",
      thumbnailAssetId: localPage?.thumbnailAssetId || page.thumbnailAssetId || "",
      storageSyncedAt: localPage?.storageSyncedAt || page.updatedAt || null,
      storageUploadVersion: localPage?.storageUploadVersion || STORAGE_UPLOAD_VERSION,
    };
  });

  await putCloudReadyRecords([], [], mergedPages);
  upsertLocalPagesInMemory(mergedPages);
  renderScores();
}

function upsertLocalPagesInMemory(pages) {
  if (!Array.isArray(pages) || !pages.length) {
    return;
  }

  const pageById = new Map(state.scorePages.map((page) => [page.id, page]));
  pages.forEach((page) => {
    pageById.set(page.id, normalizeLocalPageRecord(page));
  });
  state.scorePages = Array.from(pageById.values());
  if (state.currentViewerPages.length) {
    state.currentViewerPages = state.currentViewerPages.map((page) => pageById.get(page.id) || page);
  }

  const pagesByScoreId = new Map();
  state.scorePages.forEach((page) => {
    if (!pagesByScoreId.has(page.scoreId)) {
      pagesByScoreId.set(page.scoreId, []);
    }
    pagesByScoreId.get(page.scoreId).push(page);
  });

  state.scores = state.scores.map((score) => ({
    ...score,
    pages: (pagesByScoreId.get(score.id) || score.pages || []).sort((a, b) => a.pageIndex - b.pageIndex),
  }));
}

function getScoreUrl(page, options = {}) {
  if (page?.id && state.scoreUrls.has(page.id)) {
    return state.scoreUrls.get(page.id);
  }

  if (page?.blob instanceof Blob && page.blob.size > 0) {
    return cachePageObjectUrl(page, page.blob);
  }

  if (!page?.blob || page.blob.size === 0) {
    const tempUrl = page?.id ? state.pageTempUrls.get(page.id) : "";
    if (tempUrl) {
      return tempUrl;
    }

    ensurePageAssetDisplayUrl(page);
    if (options.hydrate !== false) {
      hydrateScorePage(page);
    }
    return SCORE_IMAGE_PLACEHOLDER;
  }

  return SCORE_IMAGE_PLACEHOLDER;
}

function bindScorePageImage(image, page, options = {}) {
  if (!image || !page?.id) {
    return;
  }

  image.dataset.pageId = page.id;
  bindScoreImageRecovery(image, page.id);
  updateScorePageImageSource(image, page);

  if (options.hydrate !== false) {
    scheduleScorePageHydration(page);
  }
}

// 列表缩略图绑定：列表只显示小缩略图而非整张原图，降低解码和内存开销、滚动更顺。
// 仅对本地有 blob 的页生成缩略图；云端页仍走原有的临时链接/水合逻辑。
function bindScoreThumbnailImage(image, page) {
  if (!image || !page?.id) {
    return;
  }

  image.dataset.pageId = page.id;
  image.dataset.thumb = "1";
  image.loading = "lazy";
  image.decoding = "async";
  bindScoreImageRecovery(image, page.id);

  const thumbUrl = state.pageThumbUrls.get(page.id);
  if (thumbUrl) {
    image.src = thumbUrl;
    image.classList.remove("is-score-placeholder");
    return;
  }

  // 先显示占位/已有原图链接，再在卡片进入视口时按需生成缩略图。
  updateScorePageImageSource(image, page);
  if ((page.blob && page.blob.size > 0) || getAssetIdForPage(page) || state.scoreUrls.has(page.id)) {
    observeThumbnailTarget(image);
  } else {
    scheduleScorePageHydration(page);
  }
}

function observeThumbnailTarget(image) {
  if (!("IntersectionObserver" in window)) {
    // 不支持时直接生成（少量设备）。
    const pageId = image.dataset.pageId;
    const page = getLatestPageRecord(pageId);
    if (page) {
      ensureThumbnailUrl(page);
    }
    return;
  }

  if (!state.thumbObserver) {
    state.thumbObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          observer.unobserve(entry.target);
          const page = getLatestPageRecord(entry.target.dataset.pageId);
          if (page) {
            ensureThumbnailUrl(page);
          }
        });
      },
      { rootMargin: "200px" },
    );
  }
  state.thumbObserver.observe(image);
}

async function ensureThumbnailUrl(page) {
  if (!page?.id) {
    return "";
  }
  if (state.pageThumbUrls.has(page.id)) {
    return state.pageThumbUrls.get(page.id);
  }
  if (state.pageThumbRequests.has(page.id)) {
    return state.pageThumbRequests.get(page.id);
  }

  const request = getPageBlob(page)
    .then((blob) => {
      if (!(blob instanceof Blob) || blob.size <= 0) {
        return null;
      }
      return createThumbnailBlob(blob);
    })
    .then((thumbBlob) => {
      if (!thumbBlob) {
        return "";
      }
      const url = URL.createObjectURL(thumbBlob);
      state.pageThumbUrls.set(page.id, url);
      refreshGridThumbnailImages(page.id, url);
      return url;
    })
    .catch((error) => {
      console.warn("缩略图生成失败", error);
      return "";
    })
    .finally(() => {
      state.pageThumbRequests.delete(page.id);
    });
  state.pageThumbRequests.set(page.id, request);
  return request;
}

async function createThumbnailBlob(blob) {
  let source = null;
  try {
    source = await loadImageSource(blob);
    const scale = Math.min(1, THUMBNAIL_MAX_EDGE / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(source.image, 0, 0, width, height);
    source.close?.();
    source = null;

    const webp = await canvasToBlob(canvas, "image/webp", THUMBNAIL_QUALITY);
    if (webp) {
      return webp;
    }
    return await canvasToBlob(canvas, "image/jpeg", THUMBNAIL_QUALITY);
  } catch (error) {
    console.warn("缩略图绘制失败", error);
    return null;
  } finally {
    source?.close?.();
  }
}

function refreshGridThumbnailImages(pageId, url) {
  if (!elements.scoreGrid || !url) {
    return;
  }
  elements.scoreGrid.querySelectorAll(`img[data-thumb][data-page-id="${cssEscape(pageId)}"]`).forEach((image) => {
    image.src = url;
    image.classList.remove("is-score-placeholder");
  });
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }
  return String(value).replace(/["\\]/g, "\\$&");
}

function updateScorePageImageSource(image, page) {
  const latestPage = getLatestPageRecord(page) || page;
  const src = getScoreUrl(latestPage, { hydrate: false });
  image.src = src;
  image.classList.toggle("is-score-placeholder", src === SCORE_IMAGE_PLACEHOLDER);
}

function getLatestPageRecord(pageOrId) {
  const pageId = typeof pageOrId === "string" ? pageOrId : pageOrId?.id;
  if (!pageId) {
    return null;
  }

  return state.scorePages.find((page) => page.id === pageId) || state.currentViewerPages.find((page) => page.id === pageId) || null;
}

function scheduleScorePageHydration(page, delay = 0) {
  if (!pageNeedsHydration(page)) {
    return;
  }

  window.setTimeout(() => {
    const latestPage = getLatestPageRecord(page) || page;
    if (pageNeedsHydration(latestPage)) {
      ensureScorePageDisplayUrl(latestPage);
    }
  }, delay);
}

async function ensureScorePageDisplayUrl(page) {
  if (!pageNeedsHydration(page) || state.pageTempUrls.has(page.id)) {
    return state.pageTempUrls.get(page.id) || "";
  }
  if (!state.cloudReady || !state.session) {
    return "";
  }

  try {
    const tempUrl = await getScorePageTempUrl(page);
    if (tempUrl) {
      refreshPageImages(page);
    }
    return tempUrl;
  } catch (error) {
    console.warn(error);
    return "";
  }
}

function getScorePageTempUrl(page) {
  if (!page?.id || !page.storagePath) {
    return Promise.resolve("");
  }

  const existingUrl = state.pageTempUrls.get(page.id);
  if (existingUrl) {
    return Promise.resolve(existingUrl);
  }

  const existingRequest = state.pageTempUrlRequests.get(page.id);
  if (existingRequest) {
    return existingRequest;
  }

  const request = getCloudFileTempUrl(page.storagePath)
    .then((tempUrl) => {
      if (tempUrl) {
        state.pageTempUrls.set(page.id, tempUrl);
      }
      return tempUrl || "";
    })
    .finally(() => {
      if (state.pageTempUrlRequests.get(page.id) === request) {
        state.pageTempUrlRequests.delete(page.id);
      }
    });
  state.pageTempUrlRequests.set(page.id, request);
  return request;
}

function bindScoreImageRecovery(image, pageId) {
  if (!image || !pageId) {
    return;
  }

  image.addEventListener("load", () => {
    state.pageRecoveryAttempts.delete(pageId);
  });
  image.addEventListener("error", () => {
    recoverBrokenScoreImage(pageId).catch((error) => console.warn(error));
  });
}

async function recoverBrokenScoreImage(pageId) {
  const page = state.scorePages.find((item) => item.id === pageId);
  if (!page?.storagePath) {
    return;
  }

  const attempts = state.pageRecoveryAttempts.get(pageId) || 0;
  if (attempts >= 2) {
    return;
  }
  state.pageRecoveryAttempts.set(pageId, attempts + 1);

  revokeScoreUrlForPage(pageId);
  state.pageTempUrls.delete(pageId);
  state.pageTempUrlRequests.delete(pageId);
  const recoveryPage = {
    ...page,
    blob: null,
  };
  replaceLocalPage(recoveryPage);
  await putScorePage(recoveryPage);
  await hydrateScorePage(recoveryPage);
}

async function hydrateScorePages(pages) {
  const pendingPages = (pages || []).filter((page) => page && (!page.blob || page.blob.size === 0) && page.storagePath);
  if (!pendingPages.length) {
    return;
  }

  if (!(await ensureCloudMediaReady())) {
    return;
  }

  try {
    await runWithConcurrency(pendingPages, 2, hydrateScorePage);
  } catch (error) {
    console.warn(error);
  }
}

function prioritizeScorePageDisplay(pages) {
  const pendingPages = (pages || []).filter(pageNeedsHydration);
  if (!pendingPages.length) {
    return;
  }

  warmScorePageTempUrls(pendingPages).catch((error) => console.warn(error));
  pendingPages.forEach((page, index) => {
    scheduleScorePageHydration(page, index * 35);
  });
  queueBackgroundPageHydration();
}

async function warmScorePageTempUrls(pages) {
  const pendingPages = (pages || []).filter(
    (page) => pageNeedsHydration(page) && page.storagePath && !state.pageTempUrls.has(page.id) && !state.pageTempUrlRequests.has(page.id),
  );
  if (!pendingPages.length) {
    return;
  }

  if (!(await ensureCloudMediaReady())) {
    return;
  }

  const chunks = chunkArray(pendingPages, 20);
  for (const pageChunk of chunks) {
    if (shouldDeferBackgroundWork()) {
      queueBackgroundPageHydration(3000);
      return;
    }
    const chunkRequest = getCloudFileTempUrls(pageChunk.map((page) => page.storagePath));
    pageChunk.forEach((page) => {
      state.pageTempUrlRequests.set(
        page.id,
        chunkRequest.then((urlMap) => urlMap.get(page.storagePath) || "").catch(() => ""),
      );
    });

    try {
      const urlMap = await chunkRequest;
      pageChunk.forEach((page) => {
        const tempUrl = urlMap.get(page.storagePath);
        if (!tempUrl) {
          return;
        }

        state.pageTempUrls.set(page.id, tempUrl);
        refreshPageImages(page);
      });
    } finally {
      pageChunk.forEach((page) => {
        state.pageTempUrlRequests.delete(page.id);
      });
    }
    await nextFrame();
  }
}

function queueBackgroundPageHydration(delay = PAGE_BACKGROUND_HYDRATE_DELAY) {
  if (!state.cloudReady || !state.session || !state.scorePages.some(pageNeedsHydration)) {
    return;
  }
  if (shouldDeferBackgroundWork()) {
    window.clearTimeout(state.pageHydrationTimer);
    state.pageHydrationTimer = window.setTimeout(() => queueBackgroundPageHydration(delay), 3000);
    return;
  }

  if (state.pageHydrationRunning) {
    state.pageHydrationQueued = true;
    return;
  }

  window.clearTimeout(state.pageHydrationTimer);
  state.pageHydrationTimer = window.setTimeout(() => {
    state.pageHydrationTimer = 0;
    hydrateMissingScorePagesInBackground().catch((error) => console.warn(error));
  }, delay);
}

function scheduleLegacyPageAssetMigration(delay = 3000) {
  window.clearTimeout(state.legacyPageAssetMigrationTimer);
  state.legacyPageAssetMigrationTimer = window.setTimeout(() => {
    state.legacyPageAssetMigrationTimer = 0;
    migrateLegacyPageBlobsToAssetsBatch().catch((error) => console.warn(error));
  }, delay);
}

async function migrateLegacyPageBlobsToAssetsBatch() {
  if (state.legacyPageAssetMigrationRunning) {
    return;
  }
  if (shouldDeferBackgroundWork()) {
    scheduleLegacyPageAssetMigration(5000);
    return;
  }

  state.legacyPageAssetMigrationRunning = true;
  try {
    const rawPages = await getAllScorePages();
    const candidates = rawPages
      .filter((page) => page?.blob instanceof Blob && page.blob.size > 0 && !getAssetIdForPage(page))
      .slice(0, 4);

    if (!candidates.length) {
      console.info("旧页面资源迁移完成");
      return;
    }

    for (const page of candidates) {
      if (shouldDeferBackgroundWork()) {
        scheduleLegacyPageAssetMigration(5000);
        return;
      }
      const assetId = createAssetId("asset");
      const asset = buildPageAssetRecord({ ...page, assetId }, page.blob, { assetId });
      const metadata = normalizePageForStore({
        ...page,
        assetId,
        type: page.blob.type || page.type,
        size: page.blob.size || page.size,
      });
      await putAsset(asset, { priority: "low" });
      await putScorePage(metadata, { priority: "low" });
      replaceLocalPage(metadata);
      await nextFrame();
    }

    scheduleLegacyPageAssetMigration(1500);
  } catch (error) {
    console.warn("旧页面资源迁移失败", error);
    scheduleLegacyPageAssetMigration(10000);
  } finally {
    state.legacyPageAssetMigrationRunning = false;
  }
}

async function hydrateMissingScorePagesInBackground() {
  if (state.pageHydrationRunning) {
    state.pageHydrationQueued = true;
    return;
  }

  if (!state.cloudReady || !state.session) {
    return;
  }
  if (shouldDeferBackgroundWork()) {
    queueBackgroundPageHydration(3000);
    return;
  }

  const pages = getMissingLocalImagePages();
  if (!pages.length) {
    return;
  }

  state.pageHydrationRunning = true;
  try {
    if (!(await ensureCloudMediaReady())) {
      return;
    }

    await runWithConcurrency(pages, PAGE_BACKGROUND_HYDRATE_CONCURRENCY, async (page) => {
      if (shouldDeferBackgroundWork()) {
        state.pageHydrationQueued = true;
        return;
      }
      await hydrateScorePage(page);
    });
  } finally {
    state.pageHydrationRunning = false;

    if (state.pageHydrationQueued) {
      state.pageHydrationQueued = false;
      queueBackgroundPageHydration();
    }
  }
}

function getMissingLocalImagePages() {
  const userId = state.session?.user?.id || null;
  const scoreOrder = new Map(state.scores.map((score, index) => [score.id, index]));

  return state.scorePages
    .filter((page) => pageNeedsHydration(page) && (!userId || !page.userId || page.userId === userId))
    .sort((a, b) => {
      const scoreDelta = (scoreOrder.get(a.scoreId) ?? Number.MAX_SAFE_INTEGER) - (scoreOrder.get(b.scoreId) ?? Number.MAX_SAFE_INTEGER);
      return scoreDelta || a.pageIndex - b.pageIndex;
    });
}

function pageNeedsHydration(page) {
  return Boolean(page?.storagePath && !state.scoreUrls.has(page.id) && (!page.blob || page.blob.size === 0));
}

async function hydrateScorePage(page) {
  if (!page?.id || !page.storagePath || state.pageDownloads.has(page.id)) {
    return;
  }

  if (!(await ensureCloudMediaReady())) {
    return;
  }

  state.pageDownloads.add(page.id);
  try {
    const tempUrl = await getScorePageTempUrl(page);
    if (!tempUrl) {
      return;
    }
    refreshPageImages(page);

    const blob = await downloadCloudFileFromUrl(tempUrl, page.size, page.type);
    const assetId = page.assetId || createAssetId("asset");
    await putAsset(buildPageAssetRecord({ ...page, assetId }, blob, {
      assetId,
      storagePath: page.storagePath,
      storageUploadVersion: STORAGE_UPLOAD_VERSION,
    }), { priority: "low" });
    const updatedPage = {
      ...page,
      assetId,
      size: page.size || blob.size,
      storageSyncedAt: new Date().toISOString(),
      storageUploadVersion: STORAGE_UPLOAD_VERSION,
      syncStatus: SYNC_STATUS_SYNCED,
    };
    cachePageObjectUrl(updatedPage, blob);
    await putScorePage(updatedPage, { priority: "low" });
    replaceLocalPage(updatedPage);
    refreshPageImages(updatedPage);

    // 若刚下载的是某首歌谱的封面页，生成持久封面缩略图并刷新列表封面。
    const ownerScore = state.scores.find((item) => item.id === updatedPage.scoreId);
    if (ownerScore) {
      const coverPage = getCoverPage(ownerScore, ownerScore.pages);
      if (coverPage && coverPage.id === updatedPage.id && !(ownerScore.coverThumbBlob && ownerScore.coverThumbBlob.size > 0)) {
        ensureScoreCoverThumb(ownerScore).catch((coverError) => console.warn(coverError));
      }
    }
  } catch (error) {
    console.warn(error);
  } finally {
    state.pageDownloads.delete(page.id);
  }
}

function replaceLocalPage(updatedPage) {
  const nextPage = normalizeLocalPageRecord(updatedPage);
  const existingPage = state.scorePages.some((page) => page.id === nextPage.id);
  state.scorePages = existingPage
    ? state.scorePages.map((page) => (page.id === nextPage.id ? nextPage : page))
    : [...state.scorePages, nextPage];
  if (state.currentViewerPages.some((page) => page.id === nextPage.id)) {
    state.currentViewerPages = state.currentViewerPages.map((page) => (page.id === nextPage.id ? nextPage : page));
  }
  state.scores = state.scores.map((score) => {
    if (score.id !== nextPage.scoreId) {
      return score;
    }

    const scorePages = score.pages || [];
    const existingScorePage = scorePages.some((page) => page.id === nextPage.id);
    const pages = existingScorePage
      ? scorePages.map((page) => (page.id === nextPage.id ? nextPage : page))
      : [...scorePages, nextPage];

    return {
      ...score,
      pages: pages.sort((a, b) => a.pageIndex - b.pageIndex),
    };
  });
}

function refreshPageImages(page) {
  document.querySelectorAll("img[data-page-id]").forEach((image) => {
    if (image.dataset.pageId !== page.id) {
      return;
    }
    // 封面图片由封面子系统管理，不走页面图片逻辑（避免被重置成占位图）。
    if (image.dataset.cover === "1") {
      const score = state.scores.find((item) => item.id === image.dataset.scoreId);
      if (score) {
        updateScoreCoverImageSource(image, score);
      }
      return;
    }
    updateScorePageImageSource(image, page);
  });
}

function refreshVisibleScoreImages() {
  document.querySelectorAll("img[data-page-id]").forEach((image) => {
    // 封面图片单独处理，绝不重置为占位图。
    if (image.dataset.cover === "1") {
      const score = state.scores.find((item) => item.id === image.dataset.scoreId);
      if (score) {
        updateScoreCoverImageSource(image, score);
      }
      return;
    }
    const page = getLatestPageRecord(image.dataset.pageId);
    if (!page) {
      return;
    }

    updateScorePageImageSource(image, page);
    scheduleScorePageHydration(page);
  });
}

function getPendingUrl(page) {
  if (!state.pendingUrls.has(page.id)) {
    state.pendingUrls.set(page.id, URL.createObjectURL(page.blob));
  }
  return state.pendingUrls.get(page.id);
}

function revokeScoreUrls(score) {
  score.pages.forEach((page) => {
    revokeScoreUrlForPage(page.id);
    state.pageTempUrls.delete(page.id);
    state.pageTempUrlRequests.delete(page.id);
    state.pageAssetUrlRequests.delete(page.id);
  });
  const cover = state.scoreCoverUrls.get(score.id);
  if (cover) {
    URL.revokeObjectURL(cover.url);
    state.scoreCoverUrls.delete(score.id);
  }
  state.coverDisplayUrls.delete(score.id);
  state.coverImgElements.delete(score.id);
}

function revokeScoreUrlForPage(pageId) {
  const url = state.scoreUrls.get(pageId);
  if (url) {
    URL.revokeObjectURL(url);
    state.scoreUrls.delete(pageId);
  }
  const thumbUrl = state.pageThumbUrls.get(pageId);
  if (thumbUrl) {
    URL.revokeObjectURL(thumbUrl);
    state.pageThumbUrls.delete(pageId);
  }
  state.pageThumbRequests.delete(pageId);
  state.pageTempUrlRequests.delete(pageId);
  state.pageAssetUrlRequests.delete(pageId);
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
  state.pageThumbUrls.forEach((url) => URL.revokeObjectURL(url));
  state.pageThumbUrls.clear();
  state.pageThumbRequests.clear();
  state.pageAssetUrlRequests.clear();
  state.scoreCoverUrls.forEach((entry) => URL.revokeObjectURL(entry.url));
  state.scoreCoverUrls.clear();
  state.coverDisplayUrls.clear();
  state.coverImgElements.clear();
  state.pageTempUrls.clear();
  state.pageTempUrlRequests.clear();
  clearPendingUrls();
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
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("zh-CN");
}

function normalizeTags(value) {
  const source = Array.isArray(value) ? value : String(value || "").split(/[,\uFF0C\u3001;\uFF1B\s]+/);
  const seen = new Set();
  const tags = [];

  source.forEach((item) => {
    const tag = String(item || "").trim();
    const key = normalizeText(tag);
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    tags.push(tag);
  });

  return tags;
}

function getScoreSearchText(score) {
  return normalizeText([
    score?.name,
    ...(Array.isArray(score?.tags) ? score.tags : []),
    score?.keySignature,
    score?.notes,
  ].join(" "));
}

function scoreMatchesQuery(score, normalizedQuery) {
  return !normalizedQuery || getScoreSearchText(score).includes(normalizedQuery);
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
