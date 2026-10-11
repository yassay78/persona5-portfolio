(function (root) {
  const NS = 'http://www.w3.org/2000/svg';

  function h(tag, cls, parent, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  function svg(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function starPath(cx, cy, r, inner, rot) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * (inner || 0.45) : r;
      const a = (rot || 0) + (Math.PI / 5) * i - Math.PI / 2;
      d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  }

  function starPattern(w, h2, seed) {
    const rand = root.P5.ransom.rng(seed || 'stars');
    const s = svg('svg', { viewBox: `0 0 ${w} ${h2}`, width: w, height: h2, class: 'star-pattern' });
    svg('rect', { width: w, height: h2, fill: '#f6f6f2' }, s);
    const count = Math.round((w * h2) / 15000);
    for (let i = 0; i < count; i++) {
      const cx = rand() * w, cy = rand() * h2, r = 50 + rand() * 150, rot = rand() * Math.PI;
      for (let k = 0; k < 7; k++) {
        const rr = r * (1 - k * 0.15);
        if (rr < 8) break;
        svg('path', { d: starPath(cx, cy, rr, 0.42, rot), fill: k % 2 ? '#f6f6f2' : '#0b0b0b' }, s);
      }
    }
    return s;
  }

  function redBackground(parent) {
    const bg = h('div', 'p5-redbg', parent);
    h('div', 'p5-redbg__tex', bg);
    h('div', 'p5-redbg__shapes', bg);
    return bg;
  }

  function keyhints(parent, pairs) {
    const k = h('div', 'keyhints', parent);
    pairs.forEach(([key, label]) => {
      const s = h('span', null, k);
      h('kbd', null, s, key);
      s.appendChild(document.createTextNode(label));
    });
    return k;
  }

  function img(src, cls, parent, fallback) {
    if (!src) { const f = fallback && fallback(); if (f) { f.classList.add(...(cls || '').split(' ').filter(Boolean)); parent.appendChild(f); } return f; }
    const i = h('img', cls, parent);
    i.alt = '';
    i.onerror = () => {
      console.warn('[img] missing', src);
      const f = fallback && fallback();
      if (f) { f.classList.add(...(cls || '').split(' ').filter(Boolean)); i.replaceWith(f); } else i.remove();
    };
    i.src = src;
    return i;
  }

  function silhouette() {
    const s = svg('svg', { viewBox: '0 0 400 500', class: 'silhouette' });
    svg('rect', { width: 400, height: 500, fill: '#0b0b0b' }, s);
    svg('path', { d: 'M200 90c55 0 90 40 90 100s-35 110-90 110-90-50-90-110 35-100 90-100zM40 500c10-120 80-170 160-170s150 50 160 170z', fill: '#e60012' }, s);
    svg('path', { d: 'M110 170c30-70 150-80 185 0-40-20-60-30-90-5-25-25-60-20-95 5z', fill: '#f6f6f2' }, s);
    return s;
  }

  function wrap(i, n) { return n ? ((i % n) + n) % n : 0; }

  const AFFINITY = {
    phys: ['#f39a1e', 'PHY'], gun: ['#e8d43a', 'GUN'], fire: ['#ff4a1c', 'FIR'], ice: ['#4fd8ff', 'ICE'],
    elec: ['#ffe51e', 'ELC'], wind: ['#4fe36a', 'WND'], psy: ['#ff5ac8', 'PSY'], nuke: ['#3fb2ff', 'NUK'],
    bless: ['#fff3a8', 'BLS'], curse: ['#b25aff', 'CRS'], almighty: ['#f6f6f2', 'ALM'], heal: ['#7dffb0', 'HEA'],
    support: ['#9ad0ff', 'SUP'],
  };
  function affinityIcon(type) {
    const [color, code] = AFFINITY[type] || AFFINITY.almighty;
    const s = svg('svg', { viewBox: '0 0 120 70', class: 'affinity' });
    svg('path', { d: 'M8 8 L112 0 L104 62 L0 70Z', fill: '#0b0b0b' }, s);
    svg('path', { d: 'M14 13 L104 7 L98 56 L7 62Z', fill: color }, s);
    const t = svg('text', { x: 56, y: 47, 'text-anchor': 'middle', 'font-family': 'Anton, sans-serif', 'font-size': 36, fill: '#0b0b0b', transform: 'rotate(-4 56 40)' }, s);
    t.textContent = code;
    return s;
  }

  const GLYPHS = {
    web: 'M50 12a38 38 0 1 0 0.1 0zM12 50h76M50 12c-16 18-16 58 0 76M50 12c16 18 16 58 0 76M18 30h64M18 70h64',
    app: 'M32 10h36a6 6 0 0 1 6 6v68a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6zM42 80h16M26 22h48',
    game: 'M24 34h52a16 16 0 0 1 16 16v6a14 14 0 0 1-26 6l-4-6H38l-4 6a14 14 0 0 1-26-6v-6a16 16 0 0 1 16-16zM28 44v16M20 52h16M66 48h2M74 56h2',
    tool: 'M66 10a20 20 0 0 0-22 27L14 67a8 8 0 0 0 11 11l30-30a20 20 0 0 0 27-22l-12 12-12-4-4-12z',
    api: 'M36 14c-12 0-12 8-12 18s-4 18-12 18c8 0 12 8 12 18s0 18 12 18M64 14c12 0 12 8 12 18s4 18 12 18c-8 0-12 8-12 18s0 18-12 18',
    design: 'M70 10l20 20-48 48-26 6 6-26zM60 20l20 20M22 62l16 16',
  };
  const ICON_COLORS = { web: '#3fb2ff', app: '#4fe36a', game: '#ff5ac8', tool: '#f39a1e', api: '#b25aff', design: '#ffe51e' };
  function projectIcon(icon) {
    if (icon && /[./]/.test(icon)) {
      const wrapEl = h('div', 'picon picon--img');
      img(icon, null, wrapEl, () => projectIcon('web'));
      return wrapEl;
    }
    const key = GLYPHS[icon] ? icon : 'web';
    const s = svg('svg', { viewBox: '0 0 100 100', class: 'picon' });
    svg('path', { d: 'M50 2 L96 26 L90 82 L44 98 L4 70 L10 20Z', fill: '#0b0b0b' }, s);
    svg('path', { d: 'M50 10 L88 30 L83 77 L45 90 L12 66 L17 24Z', fill: ICON_COLORS[key] }, s);
    svg('path', { d: GLYPHS[key], fill: 'none', stroke: '#0b0b0b', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(15 15) scale(.7)' }, s);
    return s;
  }

  const ARCANA = ['FOOL', 'MAGICIAN', 'PRIESTESS', 'EMPRESS', 'EMPEROR', 'HIEROPHANT', 'LOVERS', 'CHARIOT', 'JUSTICE', 'HERMIT', 'FORTUNE',
    'STRENGTH', 'HANGED MAN', 'DEATH', 'TEMPERANCE', 'DEVIL', 'TOWER', 'STAR', 'MOON', 'SUN', 'JUDGEMENT', 'WORLD'];
  function roman(n) {
    if (n === 0) return '0';
    const t = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let s = '';
    t.forEach(([v, r]) => { while (n >= v) { s += r; n -= v; } });
    return s;
  }
  function tarotCard(name) {
    const label = String(name || 'THE FOOL').toUpperCase();
    const idx = ARCANA.findIndex(a => label.replace(/^THE /, '') === a);
    const s = svg('svg', { viewBox: '0 0 260 420', class: 'tarot' });
    svg('rect', { x: 4, y: 4, width: 252, height: 412, rx: 10, fill: '#0b0b0b' }, s);
    svg('rect', { x: 18, y: 18, width: 224, height: 384, fill: '#f6f6f2' }, s);
    svg('rect', { x: 30, y: 74, width: 200, height: 260, fill: '#e60012' }, s);
    svg('path', { d: starPath(130, 204, 92, 0.42, 0), fill: '#0b0b0b' }, s);
    svg('path', { d: starPath(130, 204, 58, 0.42, 0.3), fill: '#f6f6f2' }, s);
    svg('path', { d: starPath(130, 204, 30, 0.42, 0), fill: '#0b0b0b' }, s);
    const num = svg('text', { x: 130, y: 60, 'text-anchor': 'middle', 'font-family': 'Anton, sans-serif', 'font-size': 44, fill: '#0b0b0b' }, s);
    num.textContent = idx >= 0 ? roman(idx) : '?';
    const nm = svg('text', { x: 130, y: 384, 'text-anchor': 'middle', 'font-family': 'Anton, sans-serif', 'font-size': label.length > 12 ? 26 : 34, fill: '#0b0b0b' }, s);
    nm.textContent = label;
    return s;
  }

  function header(parent, text, sub) {
    const hd = h('header', 'sub-header', parent);
    const plate = h('div', 'sub-header__plate', hd);
    root.P5.ransom.render(plate, text, { theme: 'light', seed: 'hdr-' + text });
    if (sub) h('div', 'sub-header__sub', hd, sub);
    return hd;
  }

  const api = { h, svg, starPath, starPattern, redBackground, keyhints, img, silhouette, wrap, affinityIcon, projectIcon, tarotCard, header, AFFINITY };
  if (root) { root.P5 = root.P5 || {}; root.P5.ui = api; }
})(typeof window !== 'undefined' ? window : null);
