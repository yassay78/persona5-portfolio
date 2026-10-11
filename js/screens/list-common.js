(function (root) {
  function scrollStart(index, total, visible, start) {
    if (total <= visible) return 0;
    if (index < start) return index;
    if (index >= start + visible) return index - visible + 1;
    return Math.min(start, total - visible);
  }

  function create(parent, items, opts) {
    const P5 = root.P5;
    const rowH = opts.rowHeight || 84;
    const visible = opts.visible || 8;
    const slant = opts.slant == null ? -10 : opts.slant;
    const el = P5.ui.h('div', 'plist ' + (opts.className || ''), parent);
    el.style.height = rowH * Math.min(visible, items.length || 1) + 'px';
    const track = P5.ui.h('div', 'plist__track', el);
    let start = 0;

    const rows = items.map((item, i) => {
      const r = P5.ui.h('div', 'plist__row', track);
      r.style.top = i * rowH + 'px';
      r.style.height = rowH + 'px';
      r.style.left = i * slant + 'px';
      opts.renderRow(r, item, i);
      r.addEventListener('mouseenter', () => { if (!P5.app.busy && api.index !== i) { api.select(i); P5.audio.play('cursor'); } });
      r.addEventListener('click', () => { if (P5.app.busy) return; api.select(i); opts.onConfirm && opts.onConfirm(i); });
      return r;
    });

    let thumb = null;
    if (items.length > visible) {
      thumb = P5.ui.h('div', 'plist__scroll-thumb', P5.ui.h('div', 'plist__scroll', el));
      thumb.style.height = (visible / items.length) * 100 + '%';
    }

    const api = {
      el, rows, index: -1,
      select(i, instant) {
        if (!items.length) return;
        api.index = i;
        rows.forEach((r, k) => r.classList.toggle('is-selected', k === i));
        const ns = scrollStart(i, items.length, visible, start);
        if (ns !== start || instant) {
          start = ns;
          gsap.to(track, { y: -start * rowH, x: -start * slant, duration: instant ? 0 : 0.18, ease: 'power3.out' });
          if (thumb) gsap.to(thumb, { top: (start / items.length) * 100 + '%', duration: instant ? 0 : 0.18 });
        }
        gsap.fromTo(rows[i], { x: 26 }, { x: 0, duration: instant ? 0 : 0.18, ease: 'back.out(3)' });
        opts.onSelect && opts.onSelect(i);
      },
      move(d) {
        if (!items.length) return;
        api.select(P5.ui.wrap(api.index + d, items.length));
        P5.audio.play('cursor');
      },
    };
    if (items.length) api.select(0, true);
    return api;
  }

  const api = { scrollStart, create };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) { root.P5 = root.P5 || {}; root.P5.list = api; }
})(typeof window !== 'undefined' ? window : null);
