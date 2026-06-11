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
const IMAGE_MAX_EDGE = 1600;
const IMAGE_WEBP_QUALITY = 0.7;
const IMAGE_JPEG_QUALITY = 0.76;
const CLOUDBASE_SDK_LOCAL = "./vendor/cloudbase.full.js";
const CLOUDBASE_SDK_CDN = "https://static.cloudbase.net/cloudbase-js-sdk/2.28.8/cloudbase.full.js";
const STORAGE_UPLOAD_VERSION = 3;
const ACCOUNT_LABEL_STORAGE_PREFIX = "my-score-folder-account-label:";
const PROFILE_STORAGE_PREFIX = "my-score-folder-profile:";
const PROFILE_COLLECTION_NAME = "profiles";
const VIEWER_MODE_STORAGE_KEY = "my-score-folder-viewer-mode";
const VIEWER_MODE_PORTRAIT = "portrait";
const VIEWER_MODE_LANDSCAPE = "landscape";
const THEME_STORAGE_KEY = "my-score-folder-theme";
const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const FAB_DRAG_START_DISTANCE = 4;
const FAB_VIEWPORT_MARGIN = 8;
const IMAGE_COMPRESSION_TIMEOUT = 30000;
const CLOUD_QUERY_TIMEOUT = 30000;
const CLOUD_UPLOAD_TIMEOUT = 120000;
const CLOUD_DOWNLOAD_TIMEOUT = 90000;
const CLOUD_WRITE_CONCURRENCY = 4;
const SHARE_SYNC_WAIT_TIMEOUT = 1200;
const SHARE_UPLOAD_CONCURRENCY = 3;
const SCORE_UPLOAD_CONCURRENCY = 3;
const SHARE_BACKGROUND_UPLOAD_CONCURRENCY = 1;
const SHARE_BATCH_EMBED_LIMIT = 700 * 1024;
const PAGE_BACKGROUND_HYDRATE_DELAY = 0;
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
  pendingPages: [],
  scoreUrls: new Map(),
  pendingUrls: new Map(),
  pageTempUrls: new Map(),
  pageDownloads: new Set(),
  pageRecoveryAttempts: new Map(),
  pageHydrationTimer: 0,
  pageHydrationRunning: false,
  pageHydrationQueued: false,
  installPrompt: null,
  addScreenOpen: false,
  accountSyncTimer: 0,
  scoreUploads: new Set(),
  scoreUploadTasks: new Map(),
  folderUploads: new Set(),
  shareTasks: new Set(),
  shareSelectedFolderIds: new Set(),
  shareSelectedScoreIds: new Set(),
  copyFeedbackTimer: 0,
  activeTab: "library",
  currentFolderId: null,
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
  profileLinkMode: "phone",
  profileLinkSudoToken: "",
  profileLinkVerificationId: "",
  profileLinkContact: "",
  fabDrag: null,
  fabSuppressClick: false,
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
  folderHistoryActive: false,
  currentViewerScoreId: null,
};

const elements = {};

document.addEventListener("DOMContentLoaded", async () => {
  applyThemePreference(state.themeMode);
  bindElements();
  bindEvents();
  registerServiceWorker();
  renderPending();
  refreshIcons();

  try {
    state.db = await openDatabase();
    await loadScores();
    setStatus("");
    updateAccountUi();
    queueCloudConnect();
  } catch (error) {
    console.error(error);
    setStatus("本地谱夹读取失败，请确认浏览器允许本地存储。", true);
  }
});

function bindElements() {
  elements.appShell = document.querySelector(".app-shell");
  elements.topbar = document.querySelector(".topbar");
  elements.appTitle = document.querySelector("#appTitle");
  elements.librarySummary = document.querySelector("#librarySummary");
  elements.libraryScreen = document.querySelector("#libraryScreen");
  elements.myScreen = document.querySelector("#myScreen");
  elements.navLibraryButton = document.querySelector("#navLibraryButton");
  elements.navMineButton = document.querySelector("#navMineButton");
  elements.bottomNav = document.querySelector(".bottom-nav");
  elements.myProfileButton = document.querySelector("#myProfileButton");
  elements.preferencesButton = document.querySelector("#preferencesButton");
  elements.myAuthState = document.querySelector("#myAuthState");
  elements.myAuthButton = document.querySelector("#myAuthButton");
  elements.myAuthButtonText = document.querySelector("#myAuthButtonText");
  elements.preferencesScreen = document.querySelector("#preferencesScreen");
  elements.closePreferencesButton = document.querySelector("#closePreferencesButton");
  elements.viewerModeButtons = Array.from(document.querySelectorAll("[data-viewer-mode]"));
  elements.themeModeButtons = Array.from(document.querySelectorAll("[data-theme-mode]"));
  elements.libraryTitle = document.querySelector("#libraryTitle");
  elements.folderBackButton = document.querySelector("#folderBackButton");
  elements.uploadScreen = document.querySelector("#uploadScreen");
  elements.resultCount = document.querySelector("#resultCount");
  elements.scoreGrid = document.querySelector("#scoreGrid");
  elements.searchInput = document.querySelector("#searchInput");
  elements.clearSearchButton = document.querySelector("#clearSearchButton");
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
  elements.deleteDialogTitle = document.querySelector("#deleteDialogTitle");
  elements.deleteDialogMessage = document.querySelector("#deleteDialogMessage");
  elements.cancelDeleteButton = document.querySelector("#cancelDeleteButton");
  elements.confirmDeleteButton = document.querySelector("#confirmDeleteButton");
  elements.viewerDialog = document.querySelector("#viewerDialog");
  elements.viewerBackButton = document.querySelector("#viewerBackButton");
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
  elements.navLibraryButton.addEventListener("click", () => switchMainTab("library"));
  elements.navMineButton.addEventListener("click", () => switchMainTab("mine"));
  elements.myProfileButton.addEventListener("click", openProfileDialog);
  elements.myAuthButton.addEventListener("click", openAuthDialog);
  elements.preferencesButton.addEventListener("click", openPreferencesScreen);
  elements.closePreferencesButton?.addEventListener("click", closePreferencesScreen);
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
  elements.syncNowButton.addEventListener("click", handleManualSync);
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
  elements.viewerBackButton.addEventListener("click", closeViewer);
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
  window.addEventListener("resize", clampFabIntoBounds);
  window.addEventListener("orientationchange", () => {
    window.setTimeout(clampFabIntoBounds, 250);
  });
  window.addEventListener("popstate", (event) => {
    if (state.viewerHistoryActive) {
      closeViewer({ fromHistory: true });
      return;
    }

    const folderId = event.state?.folder;
    if (folderId && state.folders.some((folder) => folder.id === folderId)) {
      if (state.currentFolderId !== folderId) {
        state.currentFolderId = folderId;
        elements.searchInput.value = "";
        renderScores();
        elements.appShell.scrollTo({ top: 0 });
      }
      state.folderHistoryActive = true;
      return;
    }

    if (state.currentFolderId) {
      openRootFolder({ fromHistory: true });
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

function handleAddButtonClick(event) {
  if (state.fabSuppressClick) {
    event?.preventDefault();
    event?.stopPropagation();
    state.fabSuppressClick = false;
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

  elements.libraryScreen.hidden = isMine;
  elements.myScreen.hidden = !isMine;
  elements.uploadScreen.hidden = true;
  elements.addScoreButton.hidden = isMine;
  document.body.classList.toggle("mine-tab-open", isMine);
  updateMainNav();

  if (!isMine) {
    renderScores();
  }

  elements.appShell.scrollTo({ top: 0 });
}

function updateMainNav() {
  const isLibrary = state.activeTab === "library";
  elements.navLibraryButton.classList.toggle("is-active", isLibrary);
  elements.navMineButton.classList.toggle("is-active", !isLibrary);
  if (isLibrary) {
    elements.navLibraryButton.setAttribute("aria-current", "page");
    elements.navMineButton.removeAttribute("aria-current");
  } else {
    elements.navMineButton.setAttribute("aria-current", "page");
    elements.navLibraryButton.removeAttribute("aria-current");
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

    if (!state.cloudAuthListenerBound && typeof state.cloudAuth.onLoginStateChanged === "function") {
      state.cloudAuthListenerBound = true;
      state.cloudAuth.onLoginStateChanged(async (loginState) => {
        state.session = await createCloudSession(loginState);
        if (state.session) {
          await loadProfileForCurrentUser();
        } else {
          state.profile = null;
          state.profileLoadedUserId = "";
        }
        updateAccountUi();
        await loadScores();
        if (state.session) {
          queueAccountBackgroundSync(state.session.user.id);
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
    if (state.session) {
      await loadProfileForCurrentUser();
    }
  } catch (error) {
    console.error(error);
    updateAccountUi();
    return;
  }

  updateAccountUi();
  await loadScores();
  if (state.session) {
    queueAccountBackgroundSync(state.session.user.id);
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

  const phoneNumber = getUserPhoneNumber(user, fallbackEmail);
  const emailAddress = getUserEmailAddress(user, fallbackEmail);
  const accountLabel = getPreferredAccountLabel(user, fallbackEmail, id);
  return {
    user: {
      id: String(id),
      email: emailAddress || accountLabel || String(id),
      accountLabel: accountLabel || String(id),
      phoneNumber,
      emailAddress,
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
  elements.syncNowButton.disabled = state.syncing || Boolean(state.cloudInitializing);
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

  if (!state.cloudReady) {
    const ready = await initializeCloud();
    if (ready) {
      await restoreCloudSession();
    }
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

  if (state.profileLoadedUserId === userId && state.profile) {
    return state.profile;
  }

  let profile = readStoredProfile(userId) || createDefaultProfile(userId);

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
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextMode === THEME_DARK ? "#0b1211" : "#0f766e");
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
    await loadProfileForCurrentUser();
    closeAuthDialog();
    queueAccountBackgroundSync(state.session.user.id, "已登录，正在后台同步...");
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
    await loadProfileForCurrentUser();
    state.authRegisterVerifyOtp = null;
    state.authRegisterPayload = null;
    closeAuthDialog();
    queueAccountBackgroundSync(state.session.user.id, "注册成功，正在后台同步...");
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

function getStorageSaveErrorMessage(error) {
  const message = getErrorMessage(error);
  const errorName = String(error?.name || "");

  if (/quota|storage|not enough|exceeded/i.test(`${errorName} ${message}`)) {
    return "保存失败：手机或浏览器的本地存储空间不足，请删除一些旧歌谱或清理浏览器空间后再试。";
  }

  if (/transaction|abort|indexeddb|database/i.test(`${errorName} ${message}`)) {
    return "保存失败：本地谱夹数据库写入中断，请重新打开 App 后再试。";
  }

  return message ? `保存失败：${message}` : "保存失败，请稍后再试。";
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

    const registration = await navigator.serviceWorker.register("./sw.js?v=74");
    await registration.update();
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
    state.folderHistoryActive = false;
  }

  await consolidateDuplicateFoldersByName();
  renderScores();
  queueBackgroundPageHydration();
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
    normalizedName: normalizeText(name),
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
    storageSyncedAt: page.storageSyncedAt || null,
    storageUploadVersion: Number(page.storageUploadVersion) || 0,
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

function putScorePage(page) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(PAGE_STORE_NAME, "readwrite");
    const request = transaction.objectStore(PAGE_STORE_NAME).put(page);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
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

function deleteFolderRecord(folderId, scoreIds) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction([FOLDER_STORE_NAME, STORE_NAME, PAGE_STORE_NAME], "readwrite");
    const folderStore = transaction.objectStore(FOLDER_STORE_NAME);
    const scoreStore = transaction.objectStore(STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);
    const pageIndex = pageStore.index("scoreId");

    folderStore.delete(folderId);
    scoreIds.filter(Boolean).forEach((scoreId) => {
      scoreStore.delete(scoreId);
      const pageRequest = pageIndex.getAllKeys(scoreId);
      pageRequest.onsuccess = () => {
        pageRequest.result.forEach((key) => pageStore.delete(key));
      };
      pageRequest.onerror = () => reject(pageRequest.error);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function markScoreDeletedRecord(score, deletedAt) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction([STORE_NAME, PAGE_STORE_NAME], "readwrite");
    const scoreStore = transaction.objectStore(STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);
    const userId = score.userId || state.session?.user?.id || null;
    const pages = score.pages || state.scorePages.filter((page) => page.scoreId === score.id);

    scoreStore.put({
      ...toScoreRecord(score),
      userId,
      deletedAt,
      updatedAt: deletedAt,
      syncStatus: SYNC_STATUS_PENDING,
    });
    pages.forEach((page) => {
      pageStore.put({
        ...page,
        userId: page.userId || userId,
        deletedAt,
        updatedAt: deletedAt,
        syncStatus: SYNC_STATUS_PENDING,
      });
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function markFolderDeletedRecord(folder, folderScores, deletedAt) {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction([FOLDER_STORE_NAME, STORE_NAME, PAGE_STORE_NAME], "readwrite");
    const folderStore = transaction.objectStore(FOLDER_STORE_NAME);
    const scoreStore = transaction.objectStore(STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);
    const userId = folder.userId || state.session?.user?.id || null;

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
        pageStore.put({
          ...page,
          userId: page.userId || scoreUserId,
          deletedAt,
          updatedAt: deletedAt,
          syncStatus: SYNC_STATUS_PENDING,
        });
      });
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function shouldKeepDeleteTombstone(record) {
  return Boolean(record?.userId || state.session?.user?.id);
}

async function addPendingFiles(fileList) {
  const files = Array.from(fileList || []);
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  if (!imageFiles.length) {
    setStatus("请选择图片文件。", true);
    return;
  }

  setStatus(`正在压缩 1 / ${imageFiles.length} 张图片...`);

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

  if (imageFiles.length !== files.length) {
    setStatus(`已压缩 ${imageFiles.length} 张图片，并跳过非图片文件。`, true);
  } else {
    setStatus(`已压缩并选择 ${state.pendingPages.length} 张图片。`);
  }

  renderPending();
  updateSaveState();
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
  if (hasDuplicateScoreName(name)) {
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
    if (userId && state.cloudReady) {
      queueScoreCloudUpload(score.id, `已保存《${name}》，正在直传云端。`);
    } else {
      setStatus(`已保存《${name}》。`);
    }
    closeAddScreen();
  } catch (error) {
    console.error(error);
    setStatus(getStorageSaveErrorMessage(error), true);
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
  if (hasDuplicateFolderName(name)) {
    setStatus("已存在同名文件夹", true);
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
    elements.searchInput.value = "";
    closeFolderDialog();
    await loadScores();
    openFolder(folder.id);
    if (userId && state.cloudReady) {
      queueFolderCloudUpload(folder.id);
    }
  } catch (error) {
    console.error(error);
    elements.saveFolderButton.disabled = false;
  }
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

function queueAccountBackgroundSync(userId, message = "") {
  if (!userId) {
    return;
  }

  if (message) {
    setStatus(message);
  }

  window.clearTimeout(state.accountSyncTimer);
  state.accountSyncTimer = window.setTimeout(async () => {
    state.accountSyncTimer = 0;
    if (!state.session || state.session.user.id !== userId) {
      return;
    }

    try {
      await claimLocalRecordsForUser(userId);
      await syncNow();
    } catch (error) {
      console.error(error);
      setStatus(error.message || "后台同步失败，请稍后点刷新重试。", true);
    }
  }, 100);
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

  window.setTimeout(() => syncNow(), 3500);
}

function queueScoreCloudUpload(scoreId, message = "") {
  if (message) {
    setStatus(message);
  }

  if (!state.cloudReady || !state.session || !scoreId) {
    return;
  }

  window.setTimeout(() => {
    startScoreCloudUpload(scoreId).catch((error) => {
      console.error(error);
      setStatus(error.message || "歌谱云端上传失败，请稍后点刷新重试。", true);
    });
  }, 0);
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

function queueFolderCloudUpload(folderId) {
  if (!state.cloudReady || !state.session || !folderId || state.folderUploads.has(folderId)) {
    return;
  }

  window.setTimeout(() => {
    uploadFolderToCloud(folderId).catch((error) => {
      console.error(error);
      setStatus(error.message || "文件夹云端保存失败，请稍后点刷新重试。", true);
    });
  }, 0);
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
    const uploadTotal = pages.filter((page) => page.blob?.size > 0 && (!page.storagePath || page.syncStatus !== SYNC_STATUS_SYNCED)).length;
    const readyPages = (
      await runWithConcurrency(pages, SCORE_UPLOAD_CONCURRENCY, async (page) => {
        let storagePath = page.storagePath || null;
        let storageSyncedAt = page.storageSyncedAt || null;
        let pageSize = page.size;
        const hasBlob = Boolean(page.blob && page.blob.size > 0);
        const shouldUploadBlob = hasBlob && (!page.storagePath || page.syncStatus !== SYNC_STATUS_SYNCED);
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
          storagePath = await uploadCloudFile(cloudPath, page.blob, `${page.id}.${getExtensionFromType(page.type)}`);
          storageSyncedAt = new Date().toISOString();
          pageSize = page.blob.size;
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

  elements.syncNowButton.classList.add("is-syncing");
  elements.syncNowButton.disabled = true;
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

    await performSync();
    setStatus("刷新完成。");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "刷新失败，请检查网络和 CloudBase 配置。", true);
  } finally {
    state.syncing = false;
    elements.syncNowButton.classList.remove("is-syncing");
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

  state.syncing = true;
  updateAccountUi();
  if (options.manual) {
    setStatus("正在同步...");
  }

  try {
    await performSync();
    if (options.manual) {
      setStatus("同步完成。");
    }
  } catch (error) {
    console.error(error);
    setStatus(error.message || "同步失败，请检查网络和 CloudBase 配置。", true);
    if (options.throwOnError) {
      throw error;
    }
  } finally {
    state.syncing = false;
    updateAccountUi();
  }
}

async function performSync(options = {}) {
  await pullCloudDeletions();
  await uploadLocalChanges();
  await pullCloudChanges(options);
  await loadScores();
}

async function pullCloudDeletions() {
  const userId = state.session.user.id;
  const [folders, scores] = await Promise.all([
    queryCloudRows(CLOUD_TABLES.folders, { user_id: userId }),
    queryCloudRows(CLOUD_TABLES.scores, { user_id: userId }),
  ]);
  const deletedFolderIds = folders.filter((folder) => folder.deleted_at).map((folder) => folder.id);
  const deletedScoreIds = scores.filter((score) => score.deleted_at).map((score) => score.id);

  await purgeCloudDeletedLocalRecords(deletedFolderIds, deletedScoreIds);
}

async function purgeCloudDeletedLocalRecords(folderIds, scoreIds) {
  const folderIdSet = new Set(folderIds.filter(Boolean).map(String));
  const scoreIdSet = new Set(scoreIds.filter(Boolean).map(String));

  if (folderIdSet.size) {
    const localScores = await getAllScores();
    localScores.forEach((score) => {
      if (score.folderId && folderIdSet.has(String(score.folderId))) {
        scoreIdSet.add(String(score.id));
      }
    });
  }

  if (!folderIdSet.size && !scoreIdSet.size) {
    return;
  }

  await new Promise((resolve, reject) => {
    const transaction = state.db.transaction([FOLDER_STORE_NAME, STORE_NAME, PAGE_STORE_NAME], "readwrite");
    const folderStore = transaction.objectStore(FOLDER_STORE_NAME);
    const scoreStore = transaction.objectStore(STORE_NAME);
    const pageStore = transaction.objectStore(PAGE_STORE_NAME);
    const pageIndex = pageStore.index("scoreId");

    folderIdSet.forEach((folderId) => folderStore.delete(folderId));
    scoreIdSet.forEach((scoreId) => {
      scoreStore.delete(scoreId);
      const pageRequest = pageIndex.getAllKeys(scoreId);
      pageRequest.onsuccess = () => {
        pageRequest.result.forEach((key) => pageStore.delete(key));
      };
      pageRequest.onerror = () => reject(pageRequest.error);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

async function getSyncableLocalRecords(userId) {
  const [folderRecords, scoreRecords, pageRecords] = await Promise.all([getAllFolders(), getAllScores(), getAllScorePages()]);
  const ownerMatches = (record) => !record.userId || record.userId === userId;
  const folders = folderRecords.map(normalizeLocalFolderRecord).filter(ownerMatches);
  const scores = scoreRecords.map(normalizeLocalScoreRecord).filter(ownerMatches);
  const scoreIds = new Set(scores.map((score) => score.id));
  const pages = pageRecords
    .map(normalizeLocalPageRecord)
    .filter((page) => scoreIds.has(page.scoreId) && ownerMatches(page));

  return { folders, scores, pages };
}

async function uploadLocalChanges() {
  const userId = state.session.user.id;
  const localRecords = await getSyncableLocalRecords(userId);
  const allFolders = localRecords.folders.map((folder) => ({ ...folder, userId }));
  const allScores = localRecords.scores.map((score) => ({ ...toScoreRecord(score), userId }));
  const folders = allFolders.filter(needsCloudMetadataSync);
  const scores = allScores.filter(needsCloudMetadataSync);
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
    const hasBlob = Boolean(page.blob && page.blob.size > 0);
    const shouldUploadBlob =
      !pageDeleted &&
      hasBlob &&
      (!page.storagePath || page.syncStatus !== SYNC_STATUS_SYNCED);
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
      storagePath = await uploadCloudFile(cloudPath, page.blob, `${page.id}.${getExtensionFromType(page.type)}`);
      storageSyncedAt = new Date().toISOString();
      pageSize = page.blob.size;
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
  );
}

function needsCloudMetadataSync(record) {
  return record?.syncStatus !== SYNC_STATUS_SYNCED;
}

async function pullCloudChanges(options = {}) {
  const downloadImages = Boolean(options.downloadImages);
  const userId = state.session.user.id;
  const [folderRows, scoreRows, pageRows] = await Promise.all([
    queryCloudRows(CLOUD_TABLES.folders, { user_id: userId }),
    queryCloudRows(CLOUD_TABLES.scores, { user_id: userId }),
    queryCloudRows(CLOUD_TABLES.pages, { user_id: userId }, {
      orderBy: [["page_index", "asc"]],
    }),
  ]);
  const folders = folderRows.filter(isCloudRowActive);
  const scores = scoreRows.filter(isCloudRowActive);
  const pages = pageRows.filter(isCloudRowActive);

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
  );
}

function markLocalSynced(folders, scores, pages) {
  return putCloudReadyRecords(folders, scores, pages);
}

function isCloudRowActive(row) {
  return !row?.deleted_at;
}

async function upsertCloud(table, rows) {
  const collection = state.cloudDb.collection(table);
  await runWithConcurrency(rows, CLOUD_WRITE_CONCURRENCY, async (row) => {
    const { _id, ...document } = row;
    const result = await withTimeout(
      collection.doc(String(row.id)).set(document),
      CLOUD_QUERY_TIMEOUT,
      "云端数据保存超时，请检查网络后重试。",
    );
    assertCloudResult(result);
  });
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

    const result = await withTimeout(
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
    const result = await withTimeout(
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
      const result = await withTimeout(
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
  const metadataResult = await withTimeout(
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

  const result = await withTimeout(
    state.cloudApp.getTempFileURL({
      fileList: [fileID],
    }),
    CLOUD_QUERY_TIMEOUT,
    "歌谱图片下载授权超时，请检查网络后重试。",
  );
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

  return url;
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

  const result = await withTimeout(
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
      ? folderScores.filter((score) => score.normalizedName.includes(query))
      : folderScores;

    if (query && !folderMatches && !visibleFolderScores.length) {
      return;
    }

    elements.shareList.append(createShareFolderGroup(folder, visibleFolderScores, { expanded: Boolean(query) }));
    visibleCount += 1;
  });

  state.scores
    .filter((score) => !score.folderId)
    .filter((score) => !query || score.normalizedName.includes(query))
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
  const pageNeedsUpload = (page) => page.blob?.size > 0 && (!page.storagePath || page.syncStatus !== SYNC_STATUS_SYNCED);
  const uploadTotal = selectedPages.filter(pageNeedsUpload).length;
  const uploadedPages = await runWithConcurrency(selectedPages, SHARE_UPLOAD_CONCURRENCY, async (page) => {
    let storagePath = page.storagePath || null;
    let storageSyncedAt = page.storageSyncedAt || null;
    let pageSize = page.size;
    const hasBlob = Boolean(page.blob && page.blob.size > 0);
    const shouldUploadBlob = pageNeedsUpload(page);

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
      storagePath = await uploadCloudFile(cloudPath, page.blob, `${page.id}.${getExtensionFromType(page.type)}`);
      storageSyncedAt = new Date().toISOString();
      pageSize = page.blob.size;
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
    state.scorePages.some((page) => page.scoreId === scoreId && page.blob?.size > 0 && (!page.storagePath || page.syncStatus !== SYNC_STATUS_SYNCED)),
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
    state.scorePages.some((page) => page.scoreId === scoreId && page.blob?.size > 0 && (!page.storagePath || page.syncStatus !== SYNC_STATUS_SYNCED)),
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

  const existingNames = new Set(state.scores.map((score) => normalizeText(score.name)));
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
    const hasImportableScores = sourceScores.some((score) => !existingNames.has(normalizeText(score.name)));
    const folderName = getSharedFolderName(sharedFolder.name);
    const normalizedFolderName = getSharedFolderNormalizedName(sharedFolder);
    let targetFolderId = folderTargetByName.get(normalizedFolderName) || null;
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
      const imported = await importSharedScoreRow(sharedScore, sharedPages, userId, targetFolderId, existingNames);
      if (imported) {
        result.scoreCount += 1;
      }
    }
  }

  for (const sharedScore of explicitScores) {
    if (folderScoreSourceIds.has(sharedScore.id)) {
      continue;
    }
    const imported = await importSharedScoreRow(sharedScore, sharedPages, userId, null, existingNames);
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
  const existingNames = new Set(state.scores.map((score) => normalizeText(score.name)));
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
    const hasImportableScores = folderScores.some(
      (score) => !existingNames.has(normalizeText(score.score_name || "未命名歌谱")) && shareScoreHasReadyPages(score),
    );
    const folderName = getSharedFolderName(folderItem.folder_name);
    const normalizedFolderName = getSharedFolderNormalizedName(folderItem);
    const existingNamedFolderId = folderTargetByName.get(normalizedFolderName) || null;
    const targetFolderId = existingSharedFolder?.id || existingNamedFolderId;
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
    const imported = await importSharedScoreSnapshot(scoreItem, userId, targetFolderId, existingNames);
    if (imported) {
      result.scoreCount += 1;
    }
  }

  return result;
}

async function importSharedScoreSnapshot(scoreItem, userId, folderId, existingNames) {
  return importSharedScoreRow(
    {
      id: scoreItem.score_id,
      name: scoreItem.score_name || "未命名歌谱",
      source_share_id: scoreItem.share_id,
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
    existingNames,
  );
}

function shareScoreHasReadyPages(scoreItem) {
  return Array.isArray(scoreItem.pages) && scoreItem.pages.some((page) => page.storage_path);
}

async function importSharedScoreRow(sharedScore, sharedPages, userId, folderId, existingNames) {
  const normalizedName = normalizeText(sharedScore.name || "未命名歌谱");
  const sourceShareId = sharedScore.source_share_id || sharedScore.share_id || sharedScore.sourceShareId || null;
  const sourceScoreId = String(sharedScore.id || sharedScore.score_id || "");
  const existingSharedScore = sourceShareId
    ? state.scores.find((score) => score.sourceShareId === sourceShareId && score.sourceScoreId === sourceScoreId)
    : null;

  if (existingNames.has(normalizedName) && !existingSharedScore) {
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
    existingNames.add(newScore.normalizedName);
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

function hasDuplicateScoreName(name) {
  const normalizedName = normalizeText(name);
  if (!normalizedName) {
    return false;
  }

  return state.scores.some((score) => !score.deletedAt && normalizeText(score.name || score.normalizedName) === normalizedName);
}

function hasDuplicateFolderName(name) {
  const normalizedName = normalizeText(name);
  if (!normalizedName) {
    return false;
  }

  return state.folders.some((folder) => !folder.deletedAt && getSharedFolderNormalizedName(folder) === normalizedName);
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
  try {
    window.history.pushState({ folder: id }, "");
    state.folderHistoryActive = true;
  } catch (error) {
    console.warn(error);
    state.folderHistoryActive = false;
  }
}

function openRootFolder(options = {}) {
  if (!options.fromHistory && state.currentFolderId && state.folderHistoryActive) {
    window.history.back();
    return;
  }

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

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.append(createIcon("trash-2"), document.createTextNode("删除"));
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteFolder(folder.id);
  });

  actions.append(deleteButton);
  card.append(previewButton, name, detail, actions);
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
    image.dataset.pageId = firstPage.id;
    bindScoreImageRecovery(image, firstPage.id);
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
  state.currentViewerScoreId = score.id;
  renderViewerPages(score);

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
    prepareViewerPages(score.id, score.pages);
  });
}

function closeViewer(options = {}) {
  const shouldReturnHistory = state.viewerHistoryActive && !options.fromHistory;
  state.viewerHistoryActive = false;
  state.currentViewerScoreId = null;

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
  elements.viewerPages.classList.remove("is-dragging", "is-pinching", "has-multiple-pages", "is-horizontal-mode");
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
    const deletedAt = new Date().toISOString();
    let cloudDeleteQueued = false;
    if (state.cloudReady && state.session && score.userId === state.session.user.id) {
      try {
        await deleteCloudScore(score, deletedAt);
      } catch (error) {
        cloudDeleteQueued = shouldKeepDeleteTombstone(score);
        if (!cloudDeleteQueued) {
          throw error;
        }
        console.warn(error);
      }
    } else {
      cloudDeleteQueued = shouldKeepDeleteTombstone(score);
    }

    if (cloudDeleteQueued) {
      await markScoreDeletedRecord(score, deletedAt);
    } else {
      await deleteScoreRecord(id);
    }
    revokeScoreUrls(score);
    state.scores = state.scores.filter((item) => item.id !== id);
    closeViewer();
    renderScores();
    setStatus(cloudDeleteQueued ? `已删除《${score.name}》，下次刷新时会同步到云端。` : `已删除《${score.name}》。`);
  } catch (error) {
    console.error(error);
    setStatus("删除失败，请稍后再试。", true);
  }
}

async function deleteFolder(id) {
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
    const deletedAt = new Date().toISOString();
    let cloudDeleteQueued = false;
    if (state.cloudReady && state.session && folder.userId === state.session.user.id) {
      try {
        await deleteCloudFolder(folder, folderScores, deletedAt);
      } catch (error) {
        cloudDeleteQueued = shouldKeepDeleteTombstone(folder);
        if (!cloudDeleteQueued) {
          throw error;
        }
        console.warn(error);
      }
    } else {
      cloudDeleteQueued = shouldKeepDeleteTombstone(folder);
    }

    if (cloudDeleteQueued) {
      await markFolderDeletedRecord(folder, folderScores, deletedAt);
    } else {
      await deleteFolderRecord(
        id,
        folderScores.map((score) => score.id),
      );
    }
    folderScores.forEach(revokeScoreUrls);
    state.folders = state.folders.filter((item) => item.id !== id);
    state.scores = state.scores.filter((score) => score.folderId !== id);
    const folderScoreIds = new Set(folderScores.map((score) => score.id));
    state.scorePages = state.scorePages.filter((page) => !folderScoreIds.has(page.scoreId));
    if (state.currentFolderId === id) {
      state.currentFolderId = null;
    }
    renderScores();
    setStatus(
      cloudDeleteQueued
        ? `已删除《${folder.name}》文件夹，下次刷新时会同步到云端。`
        : `已删除《${folder.name}》文件夹。`,
    );
  } catch (error) {
    console.error(error);
    setStatus("删除文件夹失败，请稍后再试。", true);
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
  const title = target.title || "删除歌谱？";
  const message = target.message || `确定删除《${target.name}》吗？删除后无法恢复。`;
  if (elements.deleteDialogTitle) {
    elements.deleteDialogTitle.textContent = title;
  }
  elements.deleteDialogMessage.textContent = message;
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

function renderViewerPages(score) {
  const pages = [...(score.pages || [])].sort((a, b) => a.pageIndex - b.pageIndex);
  const horizontalMode = state.viewerMode === VIEWER_MODE_LANDSCAPE && pages.length > 1;
  elements.viewerPages.replaceChildren();
  elements.viewerPages.classList.toggle("has-multiple-pages", pages.length > 1);
  elements.viewerPages.classList.toggle("is-horizontal-mode", horizontalMode);

  pages.forEach((page, index) => {
    const figure = document.createElement("figure");
    figure.className = "viewer-page";

    const image = document.createElement("img");
    image.draggable = false;
    image.decoding = "async";
    image.loading = "eager";
    image.dataset.pageId = page.id;
    bindScoreImageRecovery(image, page.id);
    image.src = getScoreUrl(page, { hydrate: false });
    image.alt = `《${score.name}》第 ${index + 1} 页`;

    const imageFrame = document.createElement("div");
    imageFrame.className = "viewer-image-frame";
    imageFrame.append(image);

    figure.append(imageFrame);
    elements.viewerPages.append(figure);
  });
}

function getLatestScorePages(scoreId, fallbackPages = []) {
  const latestScore = state.scores.find((score) => score.id === scoreId);
  const pages = latestScore?.pages?.length ? latestScore.pages : fallbackPages;
  return [...(pages || [])].sort((a, b) => a.pageIndex - b.pageIndex);
}

async function prepareViewerPages(scoreId, fallbackPages = []) {
  try {
    let pages = getLatestScorePages(scoreId, fallbackPages);
    if (!pages.length) {
      return;
    }

    if (await ensureCloudMediaReady()) {
      await refreshScorePagesFromCloud(scoreId);
      pages = getLatestScorePages(scoreId, pages);
      rerenderOpenViewerIfPageListChanged(scoreId);
    }

    await hydrateScorePages(pages);
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

  const renderedIds = Array.from(elements.viewerPages.querySelectorAll("img[data-page-id]")).map((image) => image.dataset.pageId);
  const latestIds = (score.pages || []).map((page) => page.id);
  const samePages = renderedIds.length === latestIds.length && renderedIds.every((id, index) => id === latestIds[index]);
  if (samePages) {
    return;
  }

  const previousScrollTop = elements.viewerPages.scrollTop;
  const previousScrollLeft = elements.viewerPages.scrollLeft;
  renderViewerPages(score);
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
      blob: localPage?.blob,
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
    pageById.set(page.id, page);
  });
  state.scorePages = Array.from(pageById.values());

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
  if (!page?.blob || page.blob.size === 0) {
    const tempUrl = page?.id ? state.pageTempUrls.get(page.id) : "";
    if (tempUrl) {
      return tempUrl;
    }

    if (options.hydrate !== false) {
      hydrateScorePage(page);
    }
    return SCORE_IMAGE_PLACEHOLDER;
  }

  if (!state.scoreUrls.has(page.id)) {
    state.scoreUrls.set(page.id, URL.createObjectURL(page.blob));
  }
  return state.scoreUrls.get(page.id);
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

function queueBackgroundPageHydration(delay = PAGE_BACKGROUND_HYDRATE_DELAY) {
  if (!state.cloudReady || !state.session || !state.scorePages.some(pageNeedsHydration)) {
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

async function hydrateMissingScorePagesInBackground() {
  if (state.pageHydrationRunning) {
    state.pageHydrationQueued = true;
    return;
  }

  if (!state.cloudReady || !state.session) {
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

    await runWithConcurrency(pages, PAGE_BACKGROUND_HYDRATE_CONCURRENCY, hydrateScorePage);
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
  return Boolean(page?.storagePath && (!page.blob || page.blob.size === 0));
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
    const tempUrl = await getCloudFileTempUrl(page.storagePath);
    state.pageTempUrls.set(page.id, tempUrl);
    refreshPageImages(page);

    const blob = await downloadCloudFileFromUrl(tempUrl, page.size, page.type);
    const updatedPage = {
      ...page,
      blob,
      size: page.size || blob.size,
      storageSyncedAt: new Date().toISOString(),
      storageUploadVersion: STORAGE_UPLOAD_VERSION,
      syncStatus: SYNC_STATUS_SYNCED,
    };
    await putScorePage(updatedPage);
    replaceLocalPage(updatedPage);
    refreshPageImages(updatedPage);
  } catch (error) {
    console.warn(error);
  } finally {
    state.pageDownloads.delete(page.id);
  }
}

function replaceLocalPage(updatedPage) {
  const existingPage = state.scorePages.some((page) => page.id === updatedPage.id);
  state.scorePages = existingPage
    ? state.scorePages.map((page) => (page.id === updatedPage.id ? updatedPage : page))
    : [...state.scorePages, updatedPage];
  state.scores = state.scores.map((score) => {
    if (score.id !== updatedPage.scoreId) {
      return score;
    }

    const scorePages = score.pages || [];
    const existingScorePage = scorePages.some((page) => page.id === updatedPage.id);
    const pages = existingScorePage
      ? scorePages.map((page) => (page.id === updatedPage.id ? updatedPage : page))
      : [...scorePages, updatedPage];

    return {
      ...score,
      pages: pages.sort((a, b) => a.pageIndex - b.pageIndex),
    };
  });
}

function refreshPageImages(page) {
  const src = getScoreUrl(page);
  document.querySelectorAll("img[data-page-id]").forEach((image) => {
    if (image.dataset.pageId === page.id) {
      image.src = src;
    }
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
  });
}

function revokeScoreUrlForPage(pageId) {
  const url = state.scoreUrls.get(pageId);
  if (url) {
    URL.revokeObjectURL(url);
    state.scoreUrls.delete(pageId);
  }
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
  state.pageTempUrls.clear();
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
