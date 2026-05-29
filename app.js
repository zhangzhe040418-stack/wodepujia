const DB_NAME = "my-score-folder";
const DB_VERSION = 2;
const STORE_NAME = "scores";
const FOLDER_STORE_NAME = "folders";
const VIEWER_MIN_ZOOM = 1;
const VIEWER_MAX_ZOOM = 4;
const VIEWER_DOUBLE_TAP_ZOOM = 2;
const VIEWER_TAP_MAX_DISTANCE = 10;
const VIEWER_DOUBLE_TAP_DELAY = 320;

const state = {
  db: null,
  scores: [],
  folders: [],
  pendingPages: [],
  scoreUrls: new Map(),
  pendingUrls: new Map(),
  installPrompt: null,
  addScreenOpen: false,
  currentFolderId: null,
  appTouchY: 0,
  deleteDialogResolve: null,
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
    await loadScores();
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

async function loadScores() {
  const [scores, folders] = await Promise.all([getAllScores(), getAllFolders()]);
  state.scores = scores;
  state.folders = folders;
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

      if (!db.objectStoreNames.contains(FOLDER_STORE_NAME)) {
        const folderStore = db.createObjectStore(FOLDER_STORE_NAME, { keyPath: "id" });
        folderStore.createIndex("normalizedName", "normalizedName", { unique: false });
        folderStore.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllScores() {
  return new Promise((resolve, reject) => {
    const transaction = state.db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();
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
    const request = transaction.objectStore(STORE_NAME).put(score);
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
    const transaction = state.db.transaction(STORE_NAME, "readwrite");
    const request = transaction.objectStore(STORE_NAME).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function addPendingFiles(fileList) {
  const files = Array.from(fileList || []);
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  if (!imageFiles.length) {
    setStatus("请选择图片文件。", true);
    return;
  }

  imageFiles.forEach((file) => {
    state.pendingPages.push({
      id: createId(),
      name: file.name,
      type: file.type || "image/jpeg",
      size: file.size,
      blob: file,
    });
  });

  if (imageFiles.length !== files.length) {
    setStatus("已跳过非图片文件。", true);
  } else {
    setStatus(`已选择 ${state.pendingPages.length} 张图片。`);
  }

  renderPending();
  updateSaveState();
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
    meta.textContent = `${index + 1} / ${state.pendingPages.length} · ${formatBytes(page.size)}`;
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
  const score = {
    id: createId(),
    name,
    normalizedName: normalizeText(name),
    folderId: state.currentFolderId || null,
    createdAt: now,
    updatedAt: now,
    pages: state.pendingPages.map((page) => ({
      id: page.id,
      name: page.name,
      type: page.type,
      size: page.size,
      blob: page.blob,
    })),
  };

  elements.saveButton.disabled = true;
  setStatus("正在保存...");

    try {
      await putScore(score);
      resetForm(false);
      elements.searchInput.value = "";
      await loadScores();
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
  const folder = {
    id: createId(),
    name,
    normalizedName: normalizeText(name),
    createdAt: now,
    updatedAt: now,
  };

  elements.saveFolderButton.disabled = true;

  try {
    await putFolder(folder);
    state.currentFolderId = folder.id;
    elements.searchInput.value = "";
    closeFolderDialog();
    await loadScores();
    elements.appShell.scrollTo({ top: 0 });
  } catch (error) {
    console.error(error);
    elements.saveFolderButton.disabled = false;
  }
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
  return value.trim().toLocaleLowerCase("zh-CN");
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
