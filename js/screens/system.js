(function () {
  const P5 = window.P5;
  P5.screens = P5.screens || {};
  const { h, keyhints } = P5.ui;
  let el, router, list, rows;

  const ITEMS = [
    { id: 'sound', label: 'SOUND' },
    { id: 'music', label: 'MUSIC' },
    { id: 'sfx', label: 'SFX' },
    { id: 'title', label: 'RETURN TO TITLE' },
  ];

  P5.screens.system = {
    transition: 'slash',
    backTransition: 'slash',

    mount(root, data, r) {
      router = r;
      el = h('section', 'screen sub system', root);
      P5.ui.redBackground(el);
      h('div', 'menu__panel-edge', el);
      const panel = h('div', 'menu__panel system__panel', el);
      panel.appendChild(P5.ui.starPattern(900, 1080, 'menu-system'));
      const label = h('div', 'menu__label', panel);
      P5.ransom.render(h('div', 'menu__label-title', label), 'MENU: SYSTEM', { theme: 'light', seed: 'menusys' });
      h('div', 'menu__label-sub', label, 'SELECT A COMMAND');
      const jump = h('div', 'system__joker', el);
      P5.ui.img('assets/img/joker-skill.png', 'system__joker-img', jump, P5.ui.silhouette);

      const wrapEl = h('div', 'system__listwrap', el);
      list = P5.list.create(wrapEl, ITEMS, {
        className: 'system__list',
        rowHeight: 110,
        visible: 4,
        slant: 18,
        renderRow(row, it) {
          const lab = h('span', 'system__label', row);
          P5.ransom.render(lab, it.label, { theme: 'light', seed: 'sys' + it.id });
          h('span', 'system__value', row);
        },
        onConfirm(i) { activate(ITEMS[i].id); },
      });
      rows = list.rows;
      refresh();
      h('div', 'system__hint', el, 'Change game settings');
      keyhints(el, [['Esc', 'Back'], ['←→', 'Adjust'], ['Enter', 'Confirm']]);
    },

    enter() {
      const tl = gsap.timeline();
      tl.from('.system__panel', { xPercent: 70, rotation: 8, duration: 0.35, ease: 'power4.out' })
        .from('.system__joker', { x: 700, y: -300, rotation: 30, duration: 0.45, ease: 'power3.out' }, 0.05)
        .from('.system .plist__row', { x: 300, opacity: 0, rotation: () => gsap.utils.random(-20, 20), duration: 0.28, stagger: 0.05, ease: 'back.out(2)' }, 0.1)
        .from('.system__hint', { opacity: 0, duration: 0.2 }, 0.4);
      return tl;
    },

    exit() {
      return gsap.to('.system > *:not(.p5-redbg)', { x: 200, opacity: 0, duration: 0.14, ease: 'power2.in' });
    },

    onAction(a) {
      const id = ITEMS[list.index].id;
      if (a === 'up') list.move(-1);
      else if (a === 'down') list.move(1);
      else if (a === 'left') adjust(id, -1);
      else if (a === 'right') adjust(id, 1);
      else if (a === 'confirm') activate(id);
      else if (a === 'back') { P5.audio.play('back'); router.back(); }
    },

    unmount() { el.remove(); },
  };

  function adjust(id, d) {
    const s = P5.audio.settings;
    if (id === 'sound') s.set('muted', !s.muted);
    else if (id === 'music' || id === 'sfx') s.set(id, Math.round((s[id] + d * 0.1) * 10) / 10);
    else return;
    P5.audio.refresh();
    P5.audio.play('cursor');
    refresh();
  }

  function activate(id) {
    if (id === 'title') {
      P5.audio.play('back');
      router.go('title', null, 'slash');
    } else if (id === 'sound') adjust('sound', 0);
    else adjust(id, 1);
  }

  function refresh() {
    const s = P5.audio.settings;
    rows.forEach((row, i) => {
      const v = row.querySelector('.system__value');
      const id = ITEMS[i].id;
      v.textContent = '';
      if (id === 'sound') {
        h('b', s.muted ? '' : 'on', v, 'ON');
        h('b', s.muted ? 'on' : '', v, 'OFF');
      } else if (id === 'music' || id === 'sfx') {
        const bar = h('span', 'system__bar', v);
        const n = Math.round(s[id] * 10);
        for (let k = 1; k <= 10; k++) h('i', k <= n ? 'on' : '', bar);
      }
    });
  }
})();
