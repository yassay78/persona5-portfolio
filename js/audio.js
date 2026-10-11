(function (root) {
  const KEY = 'p5.audio';
  const DEFAULTS = { muted: false, music: 0.5, sfx: 0.8 };
  const SFX = { cursor: 'assets/sfx/cursor.wav', confirm: 'assets/sfx/confirm.wav', back: 'assets/sfx/back.wav', open: 'assets/sfx/open.wav', kick: 'assets/sfx/kick.wav' };

  function createSettings(storage) {
    let saved = {};
    try { saved = JSON.parse(storage.getItem(KEY)) || {}; } catch (e) { saved = {}; }
    const s = {
      muted: typeof saved.muted === 'boolean' ? saved.muted : DEFAULTS.muted,
      music: typeof saved.music === 'number' ? saved.music : DEFAULTS.music,
      sfx: typeof saved.sfx === 'number' ? saved.sfx : DEFAULTS.sfx,
      set(key, val) {
        if (key === 'muted') s.muted = !!val;
        else s[key] = Math.min(1, Math.max(0, Number(val) || 0));
        try { storage.setItem(KEY, JSON.stringify({ muted: s.muted, music: s.music, sfx: s.sfx })); } catch (e) { }
      },
    };
    return s;
  }

  let settings = null, ctx = null, master = null, musicEl = null;
  const buffers = {};

  let unlocked = false;

  function init(s) {
    settings = s;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.connect(ctx.destination);
    } catch (e) { ctx = null; }
    Object.keys(SFX).forEach(load);
  }

  function unlock() {
    unlocked = true;
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  const elements = {};
  function load(name) {
    const url = SFX[name];
    if (location.protocol === 'file:') {
      const el = new Audio(url);
      el.preload = 'auto';
      el.addEventListener('error', () => { delete elements[name]; });
      elements[name] = el;
      return;
    }
    if (!ctx) return;
    fetch(url)
      .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(url))))
      .then(buf => ctx.decodeAudioData(buf))
      .then(d => { buffers[name] = d; })
      .catch(() => {});
  }

  function play(name, opts) {
    if (!unlocked || !settings || settings.muted) return;
    if (elements[name]) {
      const el = elements[name].cloneNode();
      el.volume = Math.min(1, settings.sfx * ((opts && opts.volume) || 1));
      if (opts && opts.rate) el.playbackRate = opts.rate;
      el.play().catch(() => {});
      return;
    }
    const buf = buffers[name];
    if (!ctx || !buf) return;
    try {
      const src = ctx.createBufferSource();
      const g = ctx.createGain();
      g.gain.value = settings.sfx * ((opts && opts.volume) || 1);
      src.buffer = buf;
      if (opts && opts.rate) src.playbackRate.value = opts.rate;
      src.connect(g).connect(master);
      src.start();
    } catch (e) { }
  }

  function music(on, url) {
    if (!settings) return;
    if (url && !musicEl) {
      musicEl = new Audio(url);
      musicEl.loop = true;
      musicEl.addEventListener('error', () => { musicEl = null; });
    }
    if (!musicEl) return;
    musicEl.volume = settings.muted ? 0 : settings.music;
    if (on && !settings.muted) musicEl.play().catch(() => {});
    else musicEl.pause();
  }

  function refresh() {
    if (musicEl) {
      musicEl.volume = settings.muted ? 0 : settings.music;
      if (settings.muted) musicEl.pause(); else musicEl.play().catch(() => {});
    }
  }

  const api = { createSettings, init, unlock, play, music, refresh, get settings() { return settings; } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) { root.P5 = root.P5 || {}; root.P5.audio = api; }
})(typeof window !== 'undefined' ? window : null);
