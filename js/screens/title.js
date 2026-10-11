(function () {
  const P5 = window.P5;
  P5.screens = P5.screens || {};
  const { h } = P5.ui;
  let el, blink, router, started;

  P5.screens.title = {
    transition: 'flash',

    mount(root, data, r) {
      router = r;
      started = false;
      el = h('section', 'screen title', root);
      h('div', 'title__grain', el);
      const name = h('h1', 'title__name', el);
      P5.ransom.render(name, P5.content.name, { theme: 'light', maxWidth: 1600 });
      const start = h('button', 'title__start', el);
      start.type = 'button';
      P5.ransom.render(start, 'PRESS START', { theme: 'light', seed: 'start' });
      start.addEventListener('click', go);
      el.addEventListener('click', e => { if (e.target === el) go(); });
    },

    enter() {
      const tl = gsap.timeline();
      tl.from(el.querySelectorAll('.title__name .rl'), { opacity: 0, y: -40, rotation: () => gsap.utils.random(-40, 40), duration: 0.35, stagger: 0.04, ease: 'back.out(3)' })
        .from('.title__start', { opacity: 0, duration: 0.3 }, '-=0.1');
      blink = gsap.to(el.querySelectorAll('.title__name, .title__start'), { opacity: 0.15, duration: 0.55, repeat: -1, yoyo: true, ease: 'steps(1)', delay: 1 });
      return null;
    },

    exit() {
      if (blink) blink.kill();
      return gsap.to(el.querySelectorAll('.title__name, .title__start'), { opacity: 1, scale: 1.08, duration: 0.12 });
    },

    onAction(a) {
      if (a === 'confirm') go();
    },

    unmount() {
      if (blink) blink.kill();
      el.remove();
    },
  };

  function go() {
    if (started || router.busy) return;
    started = true;
    P5.audio.unlock();
    P5.audio.play('confirm');
    P5.audio.music(true, P5.content.audio.music);
    router.go('menu', null, 'flash');
  }
})();
