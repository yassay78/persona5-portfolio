(function () {
  const P5 = window.P5;
  P5.screens = P5.screens || {};
  const { h, header, keyhints } = P5.ui;
  let el, router, idle;

  P5.screens.about = {
    transition: 'stretch-line',
    backTransition: 'slash',

    mount(root, data, r) {
      router = r;
      const a = P5.content.about;
      el = h('section', 'screen sub about', root);
      P5.ui.redBackground(el);
      h('div', 'about__diag', el);
      header(el, (data && data.label) || 'ABOUT ME');

      const frame = h('div', 'about__photo', el);
      P5.ui.img(a.photo, 'about__photo-img', frame, P5.ui.silhouette);

      const info = h('div', 'about__info', el);
      const name = h('div', 'about__name', info);
      P5.ransom.render(name, P5.content.name, { theme: 'light', seed: 'about-name', maxWidth: 740 });
      const lv = h('div', 'about__lv', info);
      h('span', 'about__lv-label', lv, 'Lv');
      h('span', 'about__lv-num', lv, String(a.level != null ? a.level : '??'));
      if (a.title) h('div', 'about__title', info, a.title);
      if (a.bio) h('p', 'about__bio', info, a.bio);

      if (a.traits.length) {
        const traits = h('div', 'about__traits', info);
        a.traits.forEach(t => {
          const row = h('div', 'about__trait', traits);
          h('span', 'about__trait-label', row, t.label);
          const bar = h('span', 'about__trait-bar', row);
          const fill = h('i', null, bar);
          fill.style.width = Math.min(5, Math.max(0, Number(t.value) || 0)) * 20 + '%';
          h('span', 'about__trait-val', row, String(t.value));
        });
      }

      if (a.arcana) {
        const card = h('div', 'about__arcana', el);
        card.appendChild(P5.ui.tarotCard(a.arcana));
        h('div', 'about__arcana-tag', card, 'ARCANA');
      } else {
        el.classList.add('about--wide');
      }

      keyhints(el, [['Esc', 'Back']]);
    },

    enter() {
      const tl = gsap.timeline();
      tl.from('.about__diag', { xPercent: 100, duration: 0.25, ease: 'power4.out' })
        .from('.about .sub-header', { x: -300, opacity: 0, duration: 0.25, ease: 'back.out(2)' }, 0)
        .from('.about__photo', { x: -500, rotation: -20, duration: 0.35, ease: 'power4.out' }, 0.05)
        .from('.about__name .rl', { y: -80, opacity: 0, rotation: () => gsap.utils.random(-50, 50), duration: 0.25, stagger: 0.025, ease: 'back.out(3)' }, 0.1)
        .from('.about__lv', { scale: 3, opacity: 0, duration: 0.25, ease: 'power4.in' }, 0.25)
        .from('.about__title, .about__bio', { x: 120, opacity: 0, duration: 0.25, stagger: 0.06 }, 0.3)
        .from('.about__trait i', { width: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, 0.4)
        .from('.about__arcana', { rotationY: 180, y: -300, rotation: 40, opacity: 0, duration: 0.5, ease: 'back.out(1.4)' }, 0.2);
      idle = gsap.to('.about__arcana', { y: -14, rotation: 9, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.8 });
      return tl;
    },

    exit() {
      if (idle) idle.kill();
      return gsap.to('.about > *:not(.p5-redbg)', { x: 140, opacity: 0, duration: 0.14, stagger: 0.01, ease: 'power2.in' });
    },

    onAction(a) {
      if (a === 'back') { P5.audio.play('back'); router.back(); }
    },

    unmount() { if (idle) idle.kill(); el.remove(); },
  };
})();
