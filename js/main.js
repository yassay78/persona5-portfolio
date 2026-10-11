(function () {
  const P5 = window.P5;
  gsap.config({ nullTargetWarn: false });
  const checked = P5.contentCheck(window.CONTENT);
  checked.warnings.forEach(w => console.warn('[content.js]', w));
  P5.content = checked.content;

  P5.stage.init(document.getElementById('stage'));
  P5.audio.init(P5.audio.createSettings(window.localStorage || { getItem() { return null; }, setItem() {} }));

  const router = P5.router.create({
    screens: P5.screens,
    root: document.getElementById('screen'),
    runTransition: (name, swap) => P5.transitions.run(name, swap),
  });
  P5.app = router;

  P5.input.init(window, action => router.handle(action));

  const params = new URLSearchParams(location.search);
  const start = params.get('screen');
  if (params.get('fast')) gsap.globalTimeline.timeScale(20);
  const boot = () => {
    if (start && P5.screens[start]) {
      P5.audio.unlock();
      const item = P5.content.menu.find(m => m.type === start);
      router.go(start, item, 'none');
    } else {
      router.go('title', null, 'none');
    }
  };
  const fontsReady = document.fonts && document.fonts.load
    ? Promise.all(P5.ransom.DEFAULT_FONTS.concat('Kanit').map(f => document.fonts.load(`40px "${f}"`).catch(() => null)))
    : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1500))]).then(boot);

  if (params.get('debug') === 'transitions') {
    let i = 0;
    const next = () => {
      const name = P5.transitions.names[i++ % P5.transitions.names.length];
      console.log('[debug] transition', name);
      P5.transitions.run(name, null, { text: 'GITHUB' }).then(() => setTimeout(next, 600));
    };
    setTimeout(next, 800);
  }
})();
