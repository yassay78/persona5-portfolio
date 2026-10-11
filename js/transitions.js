(function (root) {
  const W = 1920, H = 1080;

  function fxLayer() { return document.getElementById('fx'); }

  function el(cls, parent) {
    const d = document.createElement('div');
    d.className = cls;
    (parent || fxLayer()).appendChild(d);
    return d;
  }

  function done(tl, nodes) {
    return new Promise(resolve => {
      tl.eventCallback('onComplete', () => { nodes.forEach(n => n.remove()); resolve(); });
    });
  }

  function slash(swap) {
    const red = el('fx-band fx-band--red');
    const black = el('fx-band fx-band--black');
    const tl = gsap.timeline();
    tl.fromTo(red, { xPercent: -130 }, { xPercent: 0, duration: 0.2, ease: 'power3.in' })
      .fromTo(black, { xPercent: -130 }, { xPercent: 0, duration: 0.2, ease: 'power3.in' }, 0.05)
      .call(() => swap && swap())
      .to(red, { xPercent: 130, duration: 0.22, ease: 'power3.out' }, '+=0.04')
      .to(black, { xPercent: 130, duration: 0.22, ease: 'power3.out' }, '<0.03');
    return done(tl, [red, black]);
  }

  function spinLine(swap) {
    const line = el('fx-line');
    const tl = gsap.timeline();
    gsap.set(line, { rotation: -25, scaleX: 0, scaleY: 1 });
    tl.to(line, { scaleX: 1, duration: 0.12, ease: 'power2.out' })
      .to(line, { rotation: 335, duration: 0.42, ease: 'power2.inOut' }, 0.05)
      .to(line, { scaleY: 140, duration: 0.14, ease: 'power3.in' }, '-=0.06')
      .call(() => swap && swap())
      .to(line, { scaleY: 0, duration: 0.18, ease: 'power3.out' }, '+=0.03');
    return done(tl, [line]);
  }

  function stretchLine(swap) {
    const wedge = el('fx-wedge');
    const line = el('fx-line fx-line--slant');
    const tl = gsap.timeline();
    gsap.set(wedge, { clipPath: 'polygon(58% 0%, 58.4% 0%, 50.4% 100%, 50% 100%)' });
    gsap.set(line, { scaleY: 0 });
    tl.to(line, { scaleY: 1, duration: 0.16, ease: 'power3.out' })
      .to(wedge, { clipPath: 'polygon(58% 0%, 100% 0%, 100% 100%, 50% 100%)', duration: 0.32, ease: 'power3.inOut' }, 0.1)
      .to(line, { x: 300, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.12)
      .to(wedge, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.14, ease: 'power3.in' })
      .call(() => swap && swap())
      .to(wedge, { opacity: 0, duration: 0.16 }, '+=0.02');
    return done(tl, [wedge, line]);
  }

  function flash(swap) {
    const burst = el('fx-burst');
    const white = el('fx-white');
    const tl = gsap.timeline();
    gsap.set(burst, { scale: 0, rotation: -20 });
    gsap.set(white, { opacity: 0 });
    tl.to(burst, { scale: 1, rotation: 0, duration: 0.3, ease: 'power4.in' })
      .to(white, { opacity: 1, duration: 0.06 }, '-=0.05')
      .call(() => swap && swap())
      .to(white, { opacity: 0, duration: 0.25 })
      .to(burst, { opacity: 0, duration: 0.2 }, '<');
    return done(tl, [burst, white]);
  }

  function cutIn(swap, opts) {
    const band = el('fx-cutin');
    const stripes = el('fx-cutin__stripes', band);
    const text = el('fx-cutin__text', band);
    const face = el('fx-cutin__face', band);
    const faceImg = document.createElement('img');
    faceImg.src = 'assets/img/joker-skill.png';
    faceImg.alt = '';
    faceImg.onerror = () => face.remove();
    face.appendChild(faceImg);
    if (root.P5 && root.P5.ransom) root.P5.ransom.render(text, (opts && opts.text) || 'TAKE YOUR TIME', { theme: 'light' });
    const tl = gsap.timeline();
    gsap.set(band, { clipPath: 'polygon(0 50%, 100% 50%, 100% 50%, 0 50%)' });
    tl.to(band, { clipPath: 'polygon(0 0%, 100% 12%, 100% 100%, 0 88%)', duration: 0.22, ease: 'power3.out' })
      .fromTo(stripes, { x: -200 }, { x: 0, duration: 1.1, ease: 'none' }, 0)
      .fromTo(face, { x: 260, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }, 0.08)
      .fromTo(text, { x: -500, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'back.out(2)' }, 0.1)
      .call(() => swap && swap(), null, 0.6)
      .to(band, { clipPath: 'polygon(0 50%, 100% 50%, 100% 50%, 0 50%)', duration: 0.2, ease: 'power3.in' }, 0.85);
    return done(tl, [band]);
  }

  function card(swap) {
    const split = el('fx-split');
    const c = el('fx-card');
    const tl = gsap.timeline();
    gsap.set(split, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' });
    gsap.set(c, { y: -900, rotation: -540, scale: 0.6 });
    tl.to(split, { clipPath: 'polygon(0 0, 120% 0, 100% 100%, -20% 100%)', duration: 0.28, ease: 'power3.in' })
      .to(c, { y: 0, rotation: -8, scale: 1, duration: 0.42, ease: 'power3.out' }, 0.05)
      .call(() => swap && swap())
      .to(c, { y: 1200, rotation: 30, duration: 0.25, ease: 'power3.in' }, '+=0.02')
      .to(split, { clipPath: 'polygon(100% 0, 120% 0, 100% 100%, 100% 100%)', duration: 0.25, ease: 'power3.out' }, '<');
    return done(tl, [split, c]);
  }

  const NAMES = { slash, 'spin-line': spinLine, 'stretch-line': stretchLine, flash, 'cut-in': cutIn, card, none: swap => { swap && swap(); return Promise.resolve(); } };

  function run(name, swap, opts) {
    const fn = NAMES[name] || slash;
    return fn(swap, opts);
  }

  const api = { run, names: Object.keys(NAMES), W, H };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) { root.P5 = root.P5 || {}; root.P5.transitions = api; }
})(typeof window !== 'undefined' ? window : null);
