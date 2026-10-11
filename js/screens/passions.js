(function () {
  const P5 = window.P5;
  P5.screens = P5.screens || {};
  const { h, header, keyhints } = P5.ui;
  let el, router, list, detail, photoIndex = 0;

  P5.screens.passions = {
    transition: 'slash',
    backTransition: 'slash',

    mount(root, data, r) {
      router = r;
      const passions = P5.content.passions;
      el = h('section', 'screen sub passions', root);
      P5.ui.redBackground(el);
      h('div', 'passions__stars', el).appendChild(P5.ui.starPattern(1100, 1080, 'confidant'));
      header(el, (data && data.label) || 'PASSIONS', 'Confidants');

      detail = h('div', 'passions__detail', el);
      const panel = h('div', 'passions__panel', el);
      if (!passions.length) h('div', 'sub-empty', panel, 'Aucune passion dans content.js');
      list = P5.list.create(panel, passions, {
        className: 'passions__list',
        rowHeight: 120,
        visible: 6,
        slant: -14,
        renderRow(row, p) {
          const mini = h('span', 'passions__mini', row);
          mini.appendChild(P5.ui.tarotCard(p.arcana));
          h('span', 'passions__name', row, p.name);
          const rank = h('span', 'passions__rank', row);
          h('small', null, rank, 'RANK');
          h('b', null, rank, p.rank >= 10 ? 'MAX' : String(p.rank));
        },
        onSelect(i) { photoIndex = 0; show(passions[i]); },
      });
      keyhints(el, [['Esc', 'Back'], ['↑↓', 'Confidant'], ['←→', 'Photos']]);
    },

    enter() {
      const tl = gsap.timeline();
      tl.from('.passions__stars', { xPercent: 60, opacity: 0, duration: 0.3, ease: 'power4.out' })
        .from('.passions .sub-header', { x: -300, opacity: 0, duration: 0.25, ease: 'back.out(2)' }, 0)
        .from('.passions .plist__row', { x: -500, opacity: 0, duration: 0.28, stagger: 0.05, ease: 'power3.out' }, 0.05)
        .from('.passions__detail', { x: 300, opacity: 0, duration: 0.3, ease: 'power3.out' }, 0.12);
      return tl;
    },

    exit() {
      return gsap.to('.passions > *:not(.p5-redbg)', { x: -140, opacity: 0, duration: 0.14, stagger: 0.01, ease: 'power2.in' });
    },

    onAction(a) {
      if (a === 'up') list.move(-1);
      else if (a === 'down') list.move(1);
      else if (a === 'left') flip(-1);
      else if (a === 'right') flip(1);
      else if (a === 'back') { P5.audio.play('back'); router.back(); }
    },

    unmount() { el.remove(); },
  };

  function show(p) {
    detail.textContent = '';
    const stack = h('div', 'passions__photos', detail);
    const photos = p.photos.length ? p.photos : [null];
    photos.forEach((src, i) => {
      const card = h('div', 'passions__photo', stack);
      card.dataset.i = i;
      if (src) P5.ui.img(src, 'passions__photo-img', card, () => placeholder(p));
      else card.appendChild(placeholder(p));
    });
    layoutPhotos(stack, true);
    if (photos.length > 1) h('div', 'passions__count', detail, `${photoIndex + 1} / ${photos.length}`);

    const meter = h('div', 'passions__meter', detail);
    for (let i = 1; i <= 10; i++) {
      const s = P5.ui.svg('svg', { viewBox: '0 0 100 100', class: i <= p.rank ? 'on' : '' }, meter);
      P5.ui.svg('path', { d: P5.ui.starPath(50, 52, 46, 0.45, 0) }, s);
    }
    const title = h('div', 'passions__title', detail);
    P5.ransom.render(title, p.name, { theme: 'light', maxWidth: 400 });
    if (p.desc) h('p', 'passions__desc', detail, p.desc);
    gsap.from(detail.querySelectorAll('.passions__meter svg'), { scale: 0, duration: 0.25, stagger: 0.03, ease: 'back.out(3)' });
  }

  function placeholder(p) {
    const ph = h('div', 'passions__ph');
    const word = h('div', null, ph);
    P5.ransom.render(word, p.name, { theme: 'dark', maxWidth: 340 });
    h('small', null, ph, 'Ajoute tes photos dans content.js');
    return ph;
  }

  function layoutPhotos(stack, instant) {
    const cards = [...stack.children];
    cards.forEach((c, i) => {
      const k = (i - photoIndex + cards.length) % cards.length;
      gsap.to(c, {
        zIndex: cards.length - k,
        x: k * 46, y: k * 24, rotation: k === 0 ? -5 : 4 + k * 5,
        scale: 1 - k * 0.06, filter: k === 0 ? 'none' : 'brightness(.6)',
        duration: instant ? 0 : 0.3, ease: 'back.out(1.6)',
      });
    });
  }

  function flip(d) {
    const stack = detail.querySelector('.passions__photos');
    const n = stack ? stack.children.length : 0;
    if (n < 2) return;
    photoIndex = P5.ui.wrap(photoIndex + d, n);
    P5.audio.play('cursor');
    layoutPhotos(stack);
    const count = detail.querySelector('.passions__count');
    if (count) count.textContent = `${photoIndex + 1} / ${n}`;
  }
})();
