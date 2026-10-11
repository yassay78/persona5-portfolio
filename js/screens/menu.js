(function () {
  const P5 = window.P5;
  P5.screens = P5.screens || {};
  const { h, starPattern, redBackground, keyhints, wrap } = P5.ui;

  let el, router, items, hintEl, selected = 0, idle = [], locked = false;

  const ROW_TOP = 248, ROW_STEP = 77, RIGHT_EDGE = 1050, RIGHT_SLOPE = 0.2;
  const PANEL_FINAL = 'polygon(65.5% 0%, 100% 0%, 100% 100%, 43.9% 100%)';
  const PANEL_START = 'polygon(41.9% 0%, 100% 0%, 100% 100%, 66.1% 100%)';
  const EDGE_FINAL = 'polygon(64.6% 0%, 100% 0%, 100% 100%, 43% 100%)';
  const EDGE_START = 'polygon(41% 0%, 100% 0%, 100% 100%, 65.2% 100%)';

  P5.screens.menu = {
    transition: 'flash',
    backTransition: 'slash',

    mount(root, data, r) {
      router = r;
      locked = false;
      const menu = P5.content.menu;
      selected = Math.min(selected, Math.max(0, menu.length - 1));
      this.firstEntry = !(data && data.returning);

      el = h('section', 'screen menu', root);
      redBackground(el);

      h('div', 'menu__panel-edge', el);
      const panel = h('div', 'menu__panel', el);
      panel.appendChild(starPattern(1140, 1080, 'menu-main'));
      const dlam = h('div', 'menu__dlam', panel);
      P5.ransom.render(dlam, "DON'T LOOK AT ME", { theme: 'dark', seed: 'dlam' });
      const like = h('div', 'menu__like', panel);
      P5.ransom.render(like, 'LIKE THAT', { theme: 'dark', seed: 'likethat' });
      const phantoms = h('div', 'menu__phantoms', panel, 'The Phantoms');
      phantoms.setAttribute('aria-hidden', 'true');
      const label = h('div', 'menu__label', panel);
      P5.ransom.render(h('div', 'menu__label-title', label), 'MENU: MAIN', { theme: 'light', seed: 'menumain' });
      h('div', 'menu__label-sub', label, 'SELECT A COMMAND');
      const day = h('div', 'menu__day', panel, String(new Date().getDate()).padStart(2, '0'));
      day.setAttribute('aria-hidden', 'true');

      const joker = h('div', 'menu__joker', el);
      P5.ui.img('assets/img/joker-menu.png', 'menu__joker-img', joker, P5.ui.silhouette);

      const list = h('nav', 'menu__list', el);
      list.setAttribute('aria-label', 'Menu');
      const highlight = h('div', 'menu__hl', list);
      h('div', 'menu__hl-cyan', highlight);
      h('div', 'menu__hl-red', highlight);
      h('div', 'menu__hl-black', highlight);
      items = menu.map((m, i) => {
        const b = h('button', 'menu__item', list);
        b.type = 'button';
        const top = ROW_TOP + i * ROW_STEP;
        const rand = P5.ransom.rng(m.label + i);
        const right = RIGHT_EDGE - (top - ROW_TOP) * RIGHT_SLOPE + Math.round(rand() * 50 - 25);
        b.style.top = top + 'px';
        b.style.right = 1920 - right + 'px';
        b.style.setProperty('--tilt', (rand() * 6 - 3).toFixed(1) + 'deg');
        P5.ransom.render(b, m.label, { theme: 'light', maxWidth: 520 });
        b.addEventListener('mouseenter', () => !router.busy && !locked && select(i, true));
        b.addEventListener('click', () => { if (!router.busy && !locked) { select(i, false); confirm(); } });
        return b;
      });

      const cmd = h('div', 'menu__command', el);
      P5.ui.img('assets/img/command.png', 'menu__command-img', cmd, () => {
        const f = h('div', 'menu__command-fallback');
        P5.ransom.render(f, 'COMMAND', { theme: 'light' });
        return f;
      });
      hintEl = h('div', 'menu__hint outline', el);
      if (P5.content.tagline) {
        const tag = h('div', 'menu__tagline outline', el);
        h('span', 'menu__tagline-mark', tag, '✦');
        h('span', null, tag, P5.content.tagline);
      }

      keyhints(el, [['Esc', 'Close'], ['Enter', 'Confirm']]);
      if (items.length) select(selected, false, true);
    },

    enter() {
      if (this.firstEntry) {
        P5.audio.play('open');
        gsap.delayedCall(0.45, () => P5.audio.play('kick'));
      }
      const tl = gsap.timeline();
      tl.from('.menu .p5-redbg', { opacity: 0, duration: 0.15 })
        .fromTo('.menu__panel', { clipPath: PANEL_START }, { clipPath: PANEL_FINAL, duration: 0.7, ease: 'power3.out' }, 0)
        .fromTo('.menu__panel-edge', { clipPath: EDGE_START }, { clipPath: EDGE_FINAL, duration: 0.7, ease: 'power3.out' }, 0)
        .from('.menu__joker', { x: 260, y: 60, rotation: 4, duration: 0.42, ease: 'power4.out' }, 0)
        .from('.menu__joker', { opacity: 0, duration: 0.12 }, 0)
        .from(items, { x: 220, opacity: 0, rotation: () => gsap.utils.random(-25, 25), duration: 0.3, stagger: 0.035, ease: 'back.out(2.2)' }, 0.12)
        .from('.menu__hl', { scaleX: 0, duration: 0.2, ease: 'power3.out' }, '-=0.15')
        .from('.menu__command', { scale: 2.6, opacity: 0, rotation: -30, duration: 0.28, ease: 'power4.in' }, 0.2)
        .from('.menu__hint, .menu__tagline, .menu .keyhints', { opacity: 0, y: 20, duration: 0.2 }, 0.45)
        .from('.menu__dlam, .menu__like, .menu__phantoms, .menu__label, .menu__day', { scale: 0, opacity: 0, duration: 0.22, stagger: 0.05, ease: 'back.out(3)' }, 0.3);
      startIdle();
      return tl;
    },

    exit() {
      stopIdle();
      const tl = gsap.timeline();
      tl.to(items, { x: -80, opacity: 0, duration: 0.14, stagger: 0.015, ease: 'power2.in' })
        .to('.menu__joker', { x: -160, opacity: 0, duration: 0.16, ease: 'power2.in' }, 0)
        .to('.menu__command', { scale: 1.4, opacity: 0, duration: 0.14 }, 0)
        .to('.menu__panel, .menu__panel-edge', { clipPath: PANEL_START, opacity: 0, duration: 0.16 }, 0.02);
      return tl;
    },

    onAction(a) {
      if (locked || !items.length) return;
      if (a === 'up') select(wrap(selected - 1, items.length), true);
      else if (a === 'down') select(wrap(selected + 1, items.length), true);
      else if (a === 'confirm') confirm();
      else if (a && a.type === 'select') select(a.index, true);
    },

    unmount() {
      stopIdle();
      gsap.killTweensOf('.menu *');
      el.remove();
    },
  };

  function select(i, withSound, instant) {
    if (i === selected && !instant) return;
    selected = i;
    items.forEach((b, k) => b.classList.toggle('is-selected', k === i));
    const b = items[i];
    const m = P5.content.menu[i];
    if (withSound) P5.audio.play('cursor');

    const hl = el.querySelector('.menu__hl');
    const w = b.offsetWidth * 1.3 + 60;
    const top = parseFloat(b.style.top);
    const right = parseFloat(b.style.right);
    const tilt = parseFloat(getComputedStyle(b).getPropertyValue('--tilt')) || 0;
    gsap.to(hl, { top: top + 8, right: right - 30, width: w, rotation: tilt, duration: instant ? 0 : 0.12, ease: 'power3.out' });
    gsap.fromTo(b, { scale: 1.35 }, { scale: 1.16, duration: instant ? 0 : 0.18, ease: 'back.out(3)' });
    items.forEach((o, k) => { if (k !== i) gsap.to(o, { scale: 1, duration: 0.1 }); });

    hintEl.textContent = m.hint || '';
    if (!instant) gsap.fromTo(hintEl, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.15 });
  }

  function confirm() {
    const m = P5.content.menu[selected];
    if (!m) return;
    P5.audio.play('confirm');
    gsap.fromTo(items[selected], { scale: 1.45 }, { scale: 1.16, duration: 0.25, ease: 'back.out(3)' });
    if (m.type === 'link') {
      if (m.url) window.open(m.url, '_blank', 'noopener');
      locked = true;
      P5.transitions.run('cut-in', null, { text: m.label }).then(() => { locked = false; });
      return;
    }
    router.go(m.type, m);
  }

  function startIdle() {
    stopIdle();
    idle.push(gsap.to('.menu__hl-cyan, .menu__hl-red', {
      x: () => gsap.utils.random(-14, 14), y: () => gsap.utils.random(-3, 3),
      duration: 0.06, repeat: -1, repeatRefresh: true, ease: 'steps(1)',
    }));
  }

  function stopIdle() {
    idle.forEach(t => t.kill());
    idle = [];
  }
})();
