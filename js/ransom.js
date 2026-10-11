(function (root) {
  const DEFAULT_FONTS = ['Anton', 'Archivo Black', 'Rubik Mono One', 'Bowlby One SC', 'P5UX'];

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    let a = hash(String(seed));
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function layout(text, opts) {
    opts = opts || {};
    const fonts = opts.fonts || DEFAULT_FONTS;
    const rand = rng(opts.seed != null ? opts.seed : text);
    let first = true;
    return Array.from(String(text)).map(ch => {
      if (ch === ' ') return { ch: ' ' };
      const r = rand();
      const box = r < 0.28;
      const pool = /^[\x20-\x7e]$/.test(ch) ? fonts : fonts.filter(f => f !== 'P5UX');
      const pick = Math.floor(rand() * fonts.length);
      const l = {
        ch,
        font: pool.length ? pool[pick % pool.length] : 'Anton',
        box,
        invert: box && rand() < 0.45,
        rot: Math.round((rand() * 24 - 12) * 10) / 10,
        scale: first ? 1.3 + rand() * 0.15 : 0.82 + rand() * 0.3,
        dy: Math.round((rand() * 10 - 5) * 10) / 10,
      };
      first = false;
      return l;
    });
  }

  function fitScale(textWidth, boxWidth) {
    return Math.min(1, boxWidth / textWidth);
  }

  function render(el, text, opts) {
    opts = opts || {};
    const word = document.createElement('span');
    word.className = 'ransom ransom--' + (opts.theme || 'light');
    word.setAttribute('aria-label', text);
    layout(text, opts).forEach((l, i) => {
      const s = document.createElement('span');
      s.setAttribute('aria-hidden', 'true');
      if (l.ch === ' ') {
        s.className = 'rl rl--space';
        s.textContent = ' ';
      } else {
        s.className = 'rl' + (l.box ? (l.invert ? ' rl--inv' : ' rl--box') : '') + (i === opts.accentIndex ? ' rl--accent' : '');
        s.textContent = l.ch;
        s.style.fontFamily = `'${l.font}', 'Anton', sans-serif`;
        s.style.transform = `translateY(${l.dy}%) rotate(${l.rot}deg) scale(${l.scale})`;
      }
      word.appendChild(s);
    });
    el.textContent = '';
    el.appendChild(word);
    if (opts.maxWidth) {
      const w = word.scrollWidth;
      const k = fitScale(w, opts.maxWidth);
      if (k < 1) word.style.fontSize = (k * 100) + '%';
    }
    return word;
  }

  const api = { rng, layout, fitScale, render, DEFAULT_FONTS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) { root.P5 = root.P5 || {}; root.P5.ransom = api; }
})(typeof window !== 'undefined' ? window : null);
