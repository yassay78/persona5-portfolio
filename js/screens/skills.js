(function () {
  const P5 = window.P5;
  P5.screens = P5.screens || {};
  const { h, svg, header, keyhints, affinityIcon } = P5.ui;
  let el, list, descEl, router;

  P5.screens.skills = {
    transition: 'slash',
    backTransition: 'slash',

    mount(root, data, r) {
      router = r;
      const skills = P5.content.skills;
      el = h('section', 'screen sub skills', root);
      P5.ui.redBackground(el);
      h('div', 'skills__diag', el);
      const joker = h('div', 'skills__joker', el);
      P5.ui.img('assets/img/joker-skill.png', 'skills__joker-img', joker, P5.ui.silhouette);
      header(el, (data && data.label) || 'SKILLS', 'Joker · Lv ' + (P5.content.about.level || '??'));

      descEl = h('div', 'sub-desc', el);
      const panel = h('div', 'skills__panel', el);
      const cols = h('div', 'skills__cols', panel);
      h('span', null, cols, 'Skill');
      h('span', null, cols, 'Level');
      if (!skills.length) h('div', 'sub-empty', panel, 'Aucune compétence dans content.js');
      list = P5.list.create(panel, skills, {
        className: 'skills__list',
        rowHeight: 86,
        visible: 7,
        slant: -9,
        renderRow(row, s) {
          row.appendChild(affinityIcon(s.affinity));
          h('span', 'skills__name', row, s.name);
          const pips = h('span', 'skills__pips', row);
          for (let i = 1; i <= 10; i++) h('i', i <= s.level ? 'on' : '', pips);
          h('span', 'skills__lv', row, String(s.level));
        },
        onSelect(i) { showDesc(skills[i]); },
      });

      if (P5.content.stats.length) drawPentagon(h('div', 'skills__stats', el), P5.content.stats);
      keyhints(el, [['Esc', 'Back'], ['↑↓', 'Select']]);
    },

    enter() {
      const tl = gsap.timeline();
      tl.from('.skills__diag', { xPercent: -100, duration: 0.25, ease: 'power4.out' })
        .from('.skills__joker', { x: -400, opacity: 0, duration: 0.35, ease: 'power4.out' }, 0.05)
        .from('.skills .sub-header', { x: -300, rotation: -10, opacity: 0, duration: 0.25, ease: 'back.out(2)' }, 0.1)
        .from('.skills .plist__row', { x: 400, opacity: 0, duration: 0.25, stagger: 0.03, ease: 'power3.out' }, 0.12)
        .from('.skills__cols', { opacity: 0, duration: 0.2 }, 0.2)
        .from('.skills__stats', { scale: 0, rotation: 90, duration: 0.4, ease: 'back.out(1.6)' }, 0.25)
        .from('.skills .sub-desc', { y: 120, duration: 0.25, ease: 'power3.out' }, 0.25)
        .from('.skills__stats polygon.value', { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 0.5);
      return tl;
    },

    exit() {
      return gsap.to('.skills > *:not(.p5-redbg)', { x: -120, opacity: 0, duration: 0.14, stagger: 0.01, ease: 'power2.in' });
    },

    onAction(a) {
      if (a === 'up') list.move(-1);
      else if (a === 'down') list.move(1);
      else if (a === 'back') { P5.audio.play('back'); router.back(); }
    },

    unmount() { el.remove(); },
  };

  function showDesc(s) {
    descEl.textContent = '';
    h('span', 'sub-desc__name', descEl, s.name);
    h('span', 'sub-desc__text', descEl, s.desc || '');
    gsap.fromTo(descEl.children, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.18, stagger: 0.03 });
  }

  function drawPentagon(parent, stats) {
    const s = svg('svg', { viewBox: '-260 -250 520 520', class: 'pentagon' }, parent);
    const n = stats.length;
    const pt = (i, r) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [Math.cos(a) * r, Math.sin(a) * r];
    };
    const ring = r => stats.map((_, i) => pt(i, r).join(',')).join(' ');
    svg('polygon', { points: ring(205), fill: '#0b0b0b', stroke: '#f6f6f2', 'stroke-width': 10 }, s);
    for (let k = 5; k >= 1; k--) svg('polygon', { points: ring(k * 36), fill: k % 2 ? '#1a1a1a' : '#2a2a2a', stroke: '#444', 'stroke-width': 2 }, s);
    stats.forEach((_, i) => {
      const [x, y] = pt(i, 180);
      svg('line', { x1: 0, y1: 0, x2: x, y2: y, stroke: '#555', 'stroke-width': 2 }, s);
    });
    svg('polygon', { class: 'value', points: stats.map((st, i) => pt(i, st.value * 36).join(',')).join(' '), fill: 'rgba(255,233,74,.85)', stroke: '#0b0b0b', 'stroke-width': 6 }, s);
    stats.forEach((st, i) => {
      const [x, y] = pt(i, 232);
      const g = svg('g', { transform: `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${i % 2 ? 6 : -6})` }, s);
      svg('rect', { x: -86, y: -22, width: 172, height: 40, fill: '#f6f6f2', stroke: '#0b0b0b', 'stroke-width': 4 }, g);
      const t = svg('text', { x: 0, y: 9, 'text-anchor': 'middle', 'font-family': 'Anton, sans-serif', 'font-size': 26, fill: '#0b0b0b' }, g);
      t.textContent = st.label + ' ' + st.value;
    });
  }
})();
