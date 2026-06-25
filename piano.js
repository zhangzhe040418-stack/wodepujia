(() => {
  "use strict";

  const A4 = 440;
  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const SOLFEGE = ["do", "do", "re", "re", "mi", "fa", "fa", "sol", "sol", "la", "la", "si"];
  const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
  const SCALE_NUMBERS = ["1", "2", "3", "4", "5", "6", "7"];
  const MIN_MIDI = 21;
  const MAX_MIDI = 108;
  const KEY_NAME_TO_PC = {
    C: 0,
    "C#": 1,
    DB: 1,
    D: 2,
    "D#": 3,
    EB: 3,
    E: 4,
    F: 5,
    "F#": 6,
    GB: 6,
    G: 7,
    "G#": 8,
    AB: 8,
    A: 9,
    "A#": 10,
    BB: 10,
    B: 11,
  };

  const allWhite = [];
  const instances = new WeakMap();

  const midiToFreq = (midi) => A4 * Math.pow(2, (midi - 69) / 12);
  const isBlack = (midi) => NOTE_NAMES[midi % 12].includes("#");
  const octaveOf = (midi) => Math.floor(midi / 12) - 1;
  const noteName = (midi) => NOTE_NAMES[midi % 12] + octaveOf(midi);
  const solfege = (midi) => SOLFEGE[midi % 12];

  for (let midi = MIN_MIDI; midi <= MAX_MIDI; midi += 1) {
    if (!isBlack(midi)) {
      allWhite.push(midi);
    }
  }

  function normalizeKeySignature(value) {
    let raw = String(value || "").trim();
    if (!raw) {
      return 0;
    }

    raw = raw
      .replace(/\s+/g, "")
      .replace(/♯/g, "#")
      .replace(/♭/g, "b")
      .replace(/^升/, "#")
      .replace(/^降/, "b")
      .replace(/升/g, "#")
      .replace(/降/g, "b");

    let key = raw.toUpperCase();
    if (/^#[A-G]$/.test(key)) {
      key = key.slice(1) + "#";
    } else if (/^B[A-G]$/.test(key)) {
      key = key.slice(1) + "B";
    } else if (/^[A-G]#$/.test(key)) {
      key = key[0] + "#";
    } else if (/^[A-G]B$/.test(key)) {
      key = key[0] + "B";
    } else {
      key = key[0] || "C";
    }

    return KEY_NAME_TO_PC[key] ?? 0;
  }

  // 调根音“1”所在的参考 MIDI：放在最接近中央 C 的八度。
  // C–F#（pc 0–6）用第 4 八度（C4–F#4）；G–B（pc 7–11）降到第 3 八度（G3–B3），
  // 使 G/降A/A/降B/B 这些高调号的简谱整体低一个八度（例如 A 调时 A3 = 1）。
  function keyRootReferenceMidi(keyRootPc) {
    return keyRootPc >= 7 ? 48 + keyRootPc : 60 + keyRootPc;
  }

  function numberedForKey(midi, keyRootPc) {
    const pc = midi % 12;
    const rel = (pc - keyRootPc + 12) % 12;
    const scaleIndex = MAJOR_SCALE.indexOf(rel);
    const sharpMap = {
      1: "#1",
      3: "#2",
      6: "#4",
      8: "#5",
      10: "#6",
    };
    let label = scaleIndex >= 0 ? SCALE_NUMBERS[scaleIndex] : sharpMap[rel] || "?";
    const octaveOffset = Math.floor((midi - keyRootReferenceMidi(keyRootPc)) / 12);

    if (octaveOffset > 0) {
      label += "\u0307".repeat(octaveOffset);
    } else if (octaveOffset < 0) {
      label += "\u0323".repeat(-octaveOffset);
    }

    return label;
  }

  function resolveRoot(rootOrId) {
    if (!rootOrId) {
      return null;
    }
    if (typeof rootOrId === "string") {
      return document.getElementById(rootOrId) || document.querySelector(rootOrId);
    }
    return rootOrId instanceof Element ? rootOrId : null;
  }

  // ---- Web Audio engine (shared across piano instances) ----
  let audioContext = null;
  let audioUnlocked = false;

  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        return null;
      }
      try {
        audioContext = new AudioCtx();
      } catch (error) {
        console.warn("[piano] create AudioContext failed", error);
        return null;
      }
    }
    return audioContext;
  }

  async function unlockAudio() {
    const ctx = getAudioContext();
    if (!ctx) {
      return false;
    }

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // iOS/Safari 兜底：播放一个极短静音 buffer，解锁音频输出。
      if (!audioUnlocked) {
        const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        gain.gain.value = 0;
        source.buffer = buffer;
        source.connect(gain).connect(ctx.destination);
        source.start(0);
        audioUnlocked = true;
      }

      return true;
    } catch (error) {
      console.warn("[piano] unlock audio failed", error);
      return false;
    }
  }

  // ---- Shared piano audio bus: master → body EQ → compressor → dry + tiny reverb ----
  let pianoMaster = null;
  let pianoCompressor = null;
  let pianoBody = null;
  let pianoReverb = null;
  let pianoWetGain = null;
  let pianoDryGain = null;

  const MAX_POLYPHONY = 12;

  // 不依赖任何文件的极短混响脉冲（噪声指数衰减）。
  function createTinyReverbImpulse(ctx) {
    const seconds = 0.75;
    const length = Math.floor(ctx.sampleRate * seconds);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i += 1) {
        const t = i / length;
        const decay = Math.pow(1 - t, 3.2);
        data[i] = (Math.random() * 2 - 1) * decay * 0.35;
      }
    }

    return impulse;
  }

  function setupPianoAudioGraph() {
    const ctx = getAudioContext();
    if (!ctx || pianoMaster) {
      return;
    }

    pianoMaster = ctx.createGain();
    pianoMaster.gain.value = 0.85;

    pianoCompressor = ctx.createDynamicsCompressor();
    pianoCompressor.threshold.value = -18;
    pianoCompressor.knee.value = 18;
    pianoCompressor.ratio.value = 3;
    pianoCompressor.attack.value = 0.003;
    pianoCompressor.release.value = 0.18;

    // 琴体共鸣：低中频轻微提升。
    pianoBody = ctx.createBiquadFilter();
    pianoBody.type = "peaking";
    pianoBody.frequency.value = 380;
    pianoBody.Q.value = 0.7;
    pianoBody.gain.value = 2.2;

    pianoDryGain = ctx.createGain();
    pianoDryGain.gain.value = 0.88;

    pianoWetGain = ctx.createGain();
    pianoWetGain.gain.value = 0.12;

    pianoReverb = ctx.createConvolver();
    pianoReverb.buffer = createTinyReverbImpulse(ctx);

    pianoMaster.connect(pianoBody);
    pianoBody.connect(pianoCompressor);
    pianoCompressor.connect(pianoDryGain);
    pianoDryGain.connect(ctx.destination);

    pianoCompressor.connect(pianoReverb);
    pianoReverb.connect(pianoWetGain);
    pianoWetGain.connect(ctx.destination);
  }

  // 钢琴音色的核心：percussive 起音 + 连续指数衰减（无 sustain 平台），
  // 高频泛音衰减更快、低音整体衰减更久。参数取自钢琴声学分析（2dB/100Hz 滚降、轻微 inharmonicity）。
  function getPianoToneProfile(midi) {
    const t = Math.max(0, Math.min(1, (midi - MIN_MIDI) / (MAX_MIDI - MIN_MIDI))); // 0 低音 .. 1 高音

    // 整体基频衰减时间（秒）：低音长、高音短。
    const decay = 1.4 + 5.6 * Math.pow(1 - t, 1.7);
    // 松键阻尼释放：高音略快。
    const release = 0.32 - t * 0.16;
    // 起音瞬态噪声（琴槌），高音更明显。
    const hammer = 0.14 + t * 0.16;
    // 亮度：泛音整体增益随音区微调，低音更厚。
    const brightness = 0.95 + (1 - t) * 0.18;

    return { attack: 0.004, decay, release, hammer, brightness };
  }

  function getPianoPartials(midi) {
    // 轻微 inharmonicity：弦的张力使高次泛音偏高（高音、极低音更明显）。
    const B = 0.0004 + Math.max(0, 48 - midi) * 0.00002 + Math.max(0, midi - 84) * 0.00003;

    // amp = 起音相对幅度（高次快速滚降）；d = 该泛音衰减时间相对基频的比例（越高越短）。
    return [
      { n: 1, amp: 1.0, d: 1.0 },
      { n: 2, amp: 0.55, d: 0.7 },
      { n: 3, amp: 0.32, d: 0.52 },
      { n: 4, amp: 0.18, d: 0.4 },
      { n: 5, amp: 0.1, d: 0.3 },
      { n: 6, amp: 0.06, d: 0.24 },
      { n: 7, amp: 0.035, d: 0.18 },
    ].map((partial) => ({
      ...partial,
      ratio: partial.n * Math.sqrt(1 + B * partial.n * partial.n),
    }));
  }

  // 琴槌敲击噪声：极短、带通，不使用任何音频文件。
  function createHammerNoise(ctx, freq, profile) {
    const duration = 0.03;
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i += 1) {
      const t = i / length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 6);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = Math.min(6500, Math.max(1200, freq * 4));
    bandpass.Q.value = 0.9;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(profile.hammer * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(bandpass).connect(gain);

    return {
      output: gain,
      sources: [source],
      gains: [gain],
      start: (time) => source.start(time),
    };
  }

  function createPianoVoice(midi) {
    const ctx = getAudioContext();
    if (!ctx) {
      return null;
    }

    setupPianoAudioGraph();
    if (!pianoMaster) {
      return null;
    }

    const now = ctx.currentTime;
    const freq = midiToFreq(midi);
    const profile = getPianoToneProfile(midi);
    const partials = getPianoPartials(midi);

    // 每声部主增益：演奏期间保持 1，松键时由 noteOff 做阻尼释放；衰减完全交给各泛音包络。
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(1, now);

    // 轻柔低通去毛刺（高频泛音本就快速衰减，这里只做防刺耳兜底）。
    const toneFilter = ctx.createBiquadFilter();
    toneFilter.type = "lowpass";
    toneFilter.frequency.setValueAtTime(Math.min(11000, Math.max(2400, freq * 8 + 1800)), now);
    toneFilter.Q.value = 0.4;

    const highShelf = ctx.createBiquadFilter();
    highShelf.type = "highshelf";
    highShelf.frequency.value = 3200;
    highShelf.gain.value = -1.5;

    voiceGain.connect(toneFilter);
    toneFilter.connect(highShelf);
    highShelf.connect(pianoMaster);

    const oscillators = [];
    const gains = [];
    let longestStop = now + profile.release;

    partials.forEach((partial) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * partial.ratio, now);

      // 该泛音的起音峰值与连续指数衰减时间。
      const peak = partial.amp * profile.brightness * 0.16;
      const decayTime = Math.max(0.12, profile.decay * partial.d);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + profile.attack);
      // 指数衰减到极小值（≈ 真实钢琴弦的自由衰减）。
      gain.gain.exponentialRampToValueAtTime(0.00006, now + profile.attack + decayTime);

      osc.connect(gain).connect(voiceGain);
      osc.start(now);

      const stopAt = now + profile.attack + decayTime + 0.05;
      osc.stop(stopAt); // 衰减结束自动停止：按住不放也会像真钢琴一样自然消音。
      if (stopAt > longestStop) {
        longestStop = stopAt;
      }

      oscillators.push(osc);
      gains.push(gain);
    });

    // 琴槌敲击噪声：极短、带通，不要太明显。
    const hammer = createHammerNoise(ctx, freq, profile);
    if (hammer) {
      hammer.output.connect(voiceGain);
      hammer.start(now);
      oscillators.push(...hammer.sources);
      gains.push(...hammer.gains);
    }

    return {
      midi,
      voiceGain,
      toneFilter,
      oscillators,
      gains,
      startedAt: now,
      longestStop,
      released: false,
    };
  }

  function createPiano(root) {
    if (!root) {
      return null;
    }
    if (instances.has(root)) {
      return instances.get(root);
    }

    const noteEl = root.querySelector(".piano-note, #viewerPianoNote, #pianoNote");
    const freqEl = root.querySelector(".piano-freq, #viewerPianoFreq, #pianoFreq");
    const rangeEl = root.querySelector(".piano-range, #viewerPianoRange, #pianoRange");
    const labelEl = root.querySelector(".piano-label, #viewerPianoLabel, #pianoLabel");
    const downEl = root.querySelector(".piano-down, #viewerPianoDown, #pianoDown");
    const upEl = root.querySelector(".piano-up, #viewerPianoUp, #pianoUp");
    const keysEl = root.querySelector(".piano-keys, #viewerPianoKeys, #pianoKeys");

    if (!keysEl) {
      return null;
    }

    const voices = new Map();          // voiceId -> { midi, voiceGain, oscillators, gains, startedAt }
    const onCount = new Map();
    const keyEls = new Map();
    const pointerNotes = new Map();
    const heldKeys = new Set();
    let labelMode = "note";
    let keyRootPc = 0;

    // ---- 完整键盘轨道 + 上方音区滑动条 ----
    let stripTranslateX = 0;
    let whiteKeyWidth = 52;
    let stripWidth = 0;
    let maxTranslateX = 0;
    let initialZoneApplied = false;

    // 内部长键盘轨道：所有 .pk-w / .pk-b 放进去，靠 transform 横向平移。
    let stripEl = keysEl.querySelector(".piano-key-strip");
    if (!stripEl) {
      stripEl = document.createElement("div");
      stripEl.className = "piano-key-strip";
      keysEl.appendChild(stripEl);
    }

    // 音区滑动条：单独一行，插入到 keysEl 前面（在 .piano-bar 与 .piano-keys 之间）。
    let zoneSliderEl = root.querySelector(".piano-range-slider, #viewerPianoZoneSlider, #pianoZoneSlider");
    let sliderWrapEl = zoneSliderEl
      ? zoneSliderEl.closest(".piano-range-slider-wrap") || zoneSliderEl.parentNode
      : null;
    if (!zoneSliderEl) {
      sliderWrapEl = document.createElement("div");
      sliderWrapEl.className = "piano-range-slider-wrap";

      const lowLabel = document.createElement("span");
      lowLabel.className = "piano-slider-label";
      lowLabel.textContent = "低音";

      zoneSliderEl = document.createElement("input");
      zoneSliderEl.className = "piano-range-slider";
      zoneSliderEl.type = "range";
      zoneSliderEl.setAttribute("aria-label", "滑动切换钢琴音区");

      const highLabel = document.createElement("span");
      highLabel.className = "piano-slider-label";
      highLabel.textContent = "高音";

      sliderWrapEl.appendChild(lowLabel);
      sliderWrapEl.appendChild(zoneSliderEl);
      sliderWrapEl.appendChild(highLabel);

      keysEl.parentNode?.insertBefore(sliderWrapEl, keysEl);
    }
    zoneSliderEl.min = "0";
    zoneSliderEl.max = "10000";
    zoneSliderEl.step = "1";
    if (!zoneSliderEl.value) {
      zoneSliderEl.value = "0";
    }

    function readout(midi) {
      if (noteEl) {
        noteEl.textContent = `${noteName(midi)}  ${solfege(midi)}`;
      }
      if (freqEl) {
        freqEl.textContent = `${midiToFreq(midi).toFixed(1)} Hz`;
      }
    }

    function setOn(midi, delta) {
      const countForMidi = (onCount.get(midi) || 0) + delta;
      if (countForMidi <= 0) {
        onCount.delete(midi);
        keyEls.get(midi)?.classList.remove("is-on");
      } else {
        onCount.set(midi, countForMidi);
        keyEls.get(midi)?.classList.add("is-on");
      }
    }

    function limitPolyphony(exceptId) {
      if (voices.size <= MAX_POLYPHONY) {
        return;
      }
      let oldestId = null;
      let oldestTime = Infinity;
      voices.forEach((voice, vid) => {
        if (vid === exceptId) {
          return;
        }
        const startedAt = voice.startedAt || 0;
        if (startedAt < oldestTime) {
          oldestTime = startedAt;
          oldestId = vid;
        }
      });
      if (oldestId != null) {
        noteOff(oldestId);
      }
    }

    function noteOn(midi, id) {
      unlockAudio();
      if (voices.has(id)) {
        noteOff(id);
      }

      // 视觉反馈与读数立即显示。
      setOn(midi, 1);
      readout(midi);

      // createPianoVoice 失败（无 Web Audio）时存一个占位声部，保证 noteOff 能清除高亮。
      const ctx = getAudioContext();
      const voice = createPianoVoice(midi) || {
        midi,
        voiceGain: null,
        oscillators: [],
        gains: [],
        startedAt: ctx ? ctx.currentTime : 0,
        released: false,
      };

      voices.set(id, voice);
      limitPolyphony(id);
    }

    function noteOff(id) {
      const voice = voices.get(id);
      if (!voice) {
        return;
      }
      voices.delete(id);

      const ctx = getAudioContext();
      if (ctx && voice.voiceGain) {
        const now = ctx.currentTime;
        const release = getPianoToneProfile(voice.midi).release;
        try {
          voice.voiceGain.gain.cancelScheduledValues(now);
          voice.voiceGain.gain.setValueAtTime(Math.max(0.0001, voice.voiceGain.gain.value || 0.0001), now);
          voice.voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + release);

          voice.oscillators.forEach((osc) => {
            try {
              osc.stop(now + release + 0.04);
            } catch {}
          });
        } catch (error) {
          console.warn("[piano] noteOff failed", error);
        }
      }

      setOn(voice.midi, -1);
    }

    function prepare() {
      unlockAudio();
      setupPianoAudioGraph();
      // 每次打开钢琴面板都回到 C4 附近（下一次渲染会重新定位到 C4）。
      initialZoneApplied = false;
    }

    function stopAll() {
      Array.from(voices.keys()).forEach(noteOff);
      pointerNotes.clear();
      heldKeys.clear();
    }

    function getWhiteKeyWidth() {
      const width = keysEl.clientWidth || root.clientWidth || window.innerWidth;
      return Math.max(42, Math.min(58, Math.round(width / 7.2)));
    }

    function getWhiteIndexForMidi(midi) {
      let index = allWhite.findIndex((value) => value >= midi);
      if (index < 0) {
        index = allWhite.length - 1;
      }
      return index;
    }

    // 当前轨道最左侧可见白键索引（供电脑键盘演奏定位）。
    function getLeftWhiteIndex() {
      if (!whiteKeyWidth) {
        return 0;
      }
      return Math.max(0, Math.min(allWhite.length - 1, Math.round(stripTranslateX / whiteKeyWidth)));
    }

    function getSliderProgress() {
      if (!zoneSliderEl) {
        return 0;
      }
      const min = Number(zoneSliderEl.min) || 0;
      const max = Number(zoneSliderEl.max) || 10000;
      const value = Number(zoneSliderEl.value) || 0;
      return Math.max(0, Math.min(1, (value - min) / Math.max(1, max - min)));
    }

    function setStripTranslate(x, options = {}) {
      stripTranslateX = Math.max(0, Math.min(Number(x) || 0, maxTranslateX));
      stripEl.style.transform = `translate3d(${-stripTranslateX}px, 0, 0)`;

      if (options.updateSlider !== false && zoneSliderEl) {
        const progress = maxTranslateX > 0 ? stripTranslateX / maxTranslateX : 0;
        zoneSliderEl.value = String(Math.round(progress * 10000));
      }

      updateRangeLabel();
    }

    function setZoneByMidi(midi, options = {}) {
      const index = getWhiteIndexForMidi(midi);
      const targetX = Math.max(0, index * whiteKeyWidth - keysEl.clientWidth * 0.28);
      setStripTranslate(targetX, options);
    }

    function handleZoneSliderInput(event) {
      event.stopPropagation();
      const progress = getSliderProgress();
      const targetX = progress * maxTranslateX;
      setStripTranslate(targetX, { updateSlider: false });
    }

    function getCenterVisibleMidi() {
      if (!keyEls.size || !keysEl) {
        return 60;
      }
      const rect = keysEl.getBoundingClientRect();
      const centerX = rect.left + keysEl.clientWidth / 2;
      const y = rect.top + keysEl.clientHeight * 0.7;
      return midiAt(centerX, y) || 60;
    }

    function getFirstVisibleMidi() {
      const rect = keysEl.getBoundingClientRect();
      const leftX = rect.left + 10;
      const y = rect.top + keysEl.clientHeight * 0.7;
      return midiAt(leftX, y) || 60;
    }

    function getLastVisibleMidi() {
      const rect = keysEl.getBoundingClientRect();
      const rightX = rect.right - 10;
      const y = rect.top + keysEl.clientHeight * 0.7;
      return midiAt(rightX, y) || 72;
    }

    function updateRangeLabel() {
      if (!rangeEl) {
        return;
      }
      const start = getFirstVisibleMidi();
      const end = getLastVisibleMidi();
      rangeEl.textContent = `${noteName(start)}-${noteName(end)}`;
    }

    // 一次性渲染完整键盘轨道（MIN_MIDI..MAX_MIDI），之后只靠 transform 平移，不再重建 DOM。
    function renderFullKeyboard() {
      // 记录重渲染前“视口中心”所在的连续白键位置，用于切标签/调号/缩放时保持音区不变。
      const prevWhiteKeyWidth = whiteKeyWidth;
      const centerWhiteFloat = prevWhiteKeyWidth
        ? (stripTranslateX + keysEl.clientWidth / 2) / prevWhiteKeyWidth
        : null;

      whiteKeyWidth = getWhiteKeyWidth();
      stripEl.innerHTML = "";
      keyEls.clear();
      stripEl.style.setProperty("--white-key-width", `${whiteKeyWidth}px`);

      allWhite.forEach((midi, index) => {
        const el = document.createElement("div");
        el.className = "pk-w";
        el.dataset.midi = String(midi);
        el.dataset.whiteIndex = String(index);
        if (midi === 60) {
          el.classList.add("is-c4");
        }
        el.appendChild(makeLabel(midi));
        stripEl.appendChild(el);
        keyEls.set(midi, el);
      });

      for (let i = 0; i < allWhite.length - 1; i += 1) {
        if (allWhite[i + 1] - allWhite[i] !== 2) {
          continue;
        }
        const blackMidi = allWhite[i] + 1;
        const el = document.createElement("div");
        el.className = "pk-b";
        el.dataset.midi = String(blackMidi);
        el.style.left = `${(i + 1) * whiteKeyWidth}px`;
        el.appendChild(makeLabel(blackMidi));
        stripEl.appendChild(el);
        keyEls.set(blackMidi, el);
      }

      stripWidth = allWhite.length * whiteKeyWidth;
      stripEl.style.width = `${stripWidth}px`;
      maxTranslateX = Math.max(0, stripWidth - keysEl.clientWidth);

      onCount.forEach((_, midi) => keyEls.get(midi)?.classList.add("is-on"));

      // 默认定位到 C4 附近；只有在能真正测量到宽度（面板可见）时才锁定，
      // 避免面板隐藏（宽度为 0）时的首次渲染把错误中心固化下来。
      const hasWidth = keysEl.clientWidth > 0;
      if (!initialZoneApplied) {
        setZoneByMidi(60, { updateSlider: true });
        if (hasWidth) {
          initialZoneApplied = true;
        }
      } else if (centerWhiteFloat != null) {
        // 保持原有中心位置不变：切标签 / 调号联动 / 缩放都不会跳音区。
        setStripTranslate(centerWhiteFloat * whiteKeyWidth - keysEl.clientWidth / 2, { updateSlider: true });
      }

      updateRangeLabel();
    }

    function makeLabel(midi) {
      const label = document.createElement("span");
      label.className = "pk-label";
      if (labelMode === "note") {
        label.textContent = noteName(midi);
      } else if (labelMode === "solfege") {
        label.textContent = solfege(midi);
      } else if (labelMode === "numbered") {
        // 只显示低八度 1（1 下加一点）到高八度 7（7 上加一点）这三个八度的简谱，其余琴键留空。
        const octaveOffset = Math.floor((midi - keyRootReferenceMidi(keyRootPc)) / 12);
        if (octaveOffset < -1 || octaveOffset > 1) {
          label.classList.add("is-off");
        } else {
          label.textContent = numberedForKey(midi, keyRootPc);
        }
      } else {
        label.classList.add("is-off");
      }
      return label;
    }

    function midiAt(x, y) {
      const element = document.elementFromPoint(x, y);
      const key = element?.closest?.(".pk-w, .pk-b");
      return key && keysEl.contains(key) ? Number(key.dataset.midi) : null;
    }

    function handlePointerDown(event) {
      event.preventDefault();
      event.stopPropagation();
      unlockAudio();
      const midi = midiAt(event.clientX, event.clientY);
      if (midi == null) {
        return;
      }
      try {
        keysEl.setPointerCapture(event.pointerId);
      } catch {}
      pointerNotes.set(event.pointerId, midi);
      noteOn(midi, `p${event.pointerId}`);
    }

    function handlePointerMove(event) {
      event.stopPropagation();
      if (!pointerNotes.has(event.pointerId)) {
        return;
      }
      event.preventDefault();
      const midi = midiAt(event.clientX, event.clientY);
      const currentMidi = pointerNotes.get(event.pointerId);
      if (midi == null || midi === currentMidi) {
        return;
      }
      noteOff(`p${event.pointerId}`);
      pointerNotes.set(event.pointerId, midi);
      noteOn(midi, `p${event.pointerId}`);
    }

    function releasePointer(event) {
      event.stopPropagation();
      if (!pointerNotes.has(event.pointerId)) {
        return;
      }
      event.preventDefault();
      pointerNotes.delete(event.pointerId);
      noteOff(`p${event.pointerId}`);
    }

    const keyboardCodes = [
      "KeyA", "KeyW", "KeyS", "KeyE", "KeyD", "KeyF", "KeyT", "KeyG",
      "KeyY", "KeyH", "KeyU", "KeyJ", "KeyK", "KeyO", "KeyL", "KeyP", "Semicolon",
    ];

    function handleKeyDown(event) {
      if (event.repeat || heldKeys.has(event.code)) {
        return;
      }
      if (document.activeElement?.matches?.("input, textarea, select, [contenteditable='true']")) {
        return;
      }
      const index = keyboardCodes.indexOf(event.code);
      if (index === -1 || root.closest("[hidden]")) {
        return;
      }
      const midi = allWhite[getLeftWhiteIndex()] + index;
      if (midi > MAX_MIDI) {
        return;
      }
      heldKeys.add(event.code);
      noteOn(midi, `k${event.code}`);
    }

    function handleKeyUp(event) {
      if (!heldKeys.has(event.code)) {
        return;
      }
      heldKeys.delete(event.code);
      noteOff(`k${event.code}`);
    }

    function setKeySignature(keySignature) {
      keyRootPc = normalizeKeySignature(keySignature);
      if (labelMode === "numbered") {
        // 调号变化只重画标签，renderFullKeyboard 内部会保持当前音区不变。
        renderFullKeyboard();
      }
    }

    const modes = ["note", "solfege", "numbered", "none"];
    const labels = { note: "音名", solfege: "唱名", numbered: "简谱", none: "隐藏" };

    keysEl.addEventListener("pointerdown", handlePointerDown, { passive: false });
    keysEl.addEventListener("pointermove", handlePointerMove, { passive: false });
    keysEl.addEventListener("pointerup", releasePointer, { passive: false });
    keysEl.addEventListener("pointercancel", releasePointer, { passive: false });
    keysEl.addEventListener("lostpointercapture", releasePointer, { passive: false });

    // 音区滑动条：实时更新轨道位移；并阻断冒泡，避免触发歌谱翻页/标注/缩放。
    zoneSliderEl.addEventListener("input", handleZoneSliderInput);
    const stopSliderEvent = (event) => event.stopPropagation();
    ["pointerdown", "pointermove", "pointerup", "pointercancel", "click"].forEach((name) => {
      zoneSliderEl.addEventListener(name, stopSliderEvent);
      sliderWrapEl?.addEventListener(name, stopSliderEvent);
    });
    zoneSliderEl.addEventListener("touchstart", stopSliderEvent, { passive: true });
    zoneSliderEl.addEventListener("touchmove", stopSliderEvent, { passive: true });
    sliderWrapEl?.addEventListener("touchstart", stopSliderEvent, { passive: true });
    sliderWrapEl?.addEventListener("touchmove", stopSliderEvent, { passive: true });

    downEl?.addEventListener("click", (event) => {
      event.stopPropagation();
      setStripTranslate(stripTranslateX - keysEl.clientWidth * 0.45, { updateSlider: true });
    });
    upEl?.addEventListener("click", (event) => {
      event.stopPropagation();
      setStripTranslate(stripTranslateX + keysEl.clientWidth * 0.45, { updateSlider: true });
    });
    labelEl?.addEventListener("click", (event) => {
      event.stopPropagation();
      labelMode = modes[(modes.indexOf(labelMode) + 1) % modes.length];
      labelEl.textContent = labels[labelMode];
      // 重画标签但保持当前音区（renderFullKeyboard 内部已保持中心不变）。
      renderFullKeyboard();
    });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      let raf = 0;
      resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          // renderFullKeyboard 内部按连续中心位置保持音区，缩放后不跳。
          renderFullKeyboard();
        });
      });
      resizeObserver.observe(keysEl);
    } else {
      window.addEventListener("resize", renderFullKeyboard);
    }

    const api = {
      render: renderFullKeyboard,
      stopAll,
      setKeySignature,
      prepare,
      destroy() {
        stopAll();
        resizeObserver?.disconnect?.();
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        instances.delete(root);
        delete root.dataset.pianoReady;
        delete root.__myScorePiano;
      },
    };

    renderFullKeyboard();
    root.dataset.pianoReady = "1";
    root.__myScorePiano = api;
    instances.set(root, api);
    return api;
  }

  function initAll() {
    document.querySelectorAll(".piano").forEach((element) => {
      if (!instances.has(element)) {
        createPiano(element);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  window.Piano = { init: createPiano, initAll };
  window.MyScorePiano = window.MyScorePiano || {};
  window.MyScorePiano.init = createPiano;
  window.MyScorePiano.initAll = initAll;
  window.MyScorePiano.normalizeKeySignature = normalizeKeySignature;   
  window.MyScorePiano.numberedForKey = numberedForKey;
  window.MyScorePiano.setKeySignature = (rootOrId, keySignature) => {
    const root = resolveRoot(rootOrId);
    if (!root) {
      return;
    }
    const api = instances.get(root) || createPiano(root);
    api?.setKeySignature(keySignature || "C");
  };
  window.MyScorePiano.stopAll = (rootOrId) => {
    const root = resolveRoot(rootOrId);
    if (!root) {
      return;
    }
    instances.get(root)?.stopAll();
  };
  window.MyScorePiano.prepare = (rootOrId) => {
    const root = resolveRoot(rootOrId);
    if (!root) {
      return;
    }
    const api = instances.get(root) || createPiano(root);
    api?.prepare?.();
  };
})();
