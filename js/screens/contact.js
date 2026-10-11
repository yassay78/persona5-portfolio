(function () {
  const P5 = window.P5;
  P5.screens = P5.screens || {};
  const { h, svg, header, keyhints } = P5.ui;
  let el, router, list, actions, idle;

  P5.screens.contact = {
    transition: 'card',
    backTransition: 'slash',

    mount(root, data, r) {
      router = r;
      const c = P5.content.contact;
      el = h('section', 'screen sub contact', root);
      h('div', 'contact__bg', el);
      header(el, (data && data.label) || 'CONTACT', 'Calling card');

      const card = h('div', 'contact__card', el);
      card.appendChild(topHat());
      const msg = h('div', 'contact__msg', card);
      String(c.message || 'TAKE YOUR TIME').split(/\s+/).forEach((w, i) => {
        P5.ransom.render(h('span', 'contact__word', msg), w, { theme: 'dark', seed: 'card' + i + w });
      });
      const sign = h('div', 'contact__sign', card);
      h('span', null, sign, 'From');
      P5.ransom.render(h('span', null, sign), P5.content.name, { theme: 'light', seed: 'sign', maxWidth: 520 });

      actions = [];
      if (c.email) {
        actions.push({ label: 'COPY E-MAIL', value: c.email, run: () => copy(c.email) });
        const compose = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(c.email);
        actions.push({ label: 'SEND E-MAIL', value: 'Écrire un message', run: () => window.open(compose, '_blank', 'noopener') });
      }
      c.links.forEach(l => actions.push({ label: String(l.label || 'LINK').toUpperCase(), value: l.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), run: () => window.open(l.url, '_blank', 'noopener') }));

      const panel = h('div', 'contact__panel', el);
      if (!actions.length) h('div', 'sub-empty', panel, 'Ajoute ton e-mail dans content.js');
      list = P5.list.create(panel, actions, {
        className: 'contact__list',
        rowHeight: 104,
        visible: 6,
        slant: -12,
        renderRow(row, a) {
          h('span', 'contact__label', row, a.label);
          h('span', 'contact__value', row, a.value);
        },
        onConfirm(i) { trigger(i); },
      });
      keyhints(el, [['Esc', 'Back'], ['Enter', 'Confirm']]);
    },

    enter() {
      const tl = gsap.timeline();
      tl.from('.contact__bg', { opacity: 0, duration: 0.15 })
        .from('.contact__card', { y: -900, rotation: -40, duration: 0.45, ease: 'back.out(1.2)' }, 0)
        .from('.contact__word', { scale: 0, rotation: () => gsap.utils.random(-40, 40), duration: 0.2, stagger: 0.03, ease: 'back.out(3)' }, 0.3)
        .from('.contact .sub-header', { x: -300, opacity: 0, duration: 0.25 }, 0.1)
        .from('.contact .plist__row', { x: 400, opacity: 0, duration: 0.25, stagger: 0.05, ease: 'power3.out' }, 0.2);
      idle = gsap.to('.contact__card', { rotation: -4, y: -8, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
      return tl;
    },

    exit() {
      if (idle) idle.kill();
      return gsap.to('.contact__card', { y: 1100, rotation: 25, duration: 0.25, ease: 'power3.in' });
    },

    onAction(a) {
      if (a === 'up') list.move(-1);
      else if (a === 'down') list.move(1);
      else if (a === 'confirm') trigger(list.index);
      else if (a === 'back') { P5.audio.play('back'); router.back(); }
    },

    unmount() { if (idle) idle.kill(); el.remove(); },
  };

  function trigger(i) {
    const a = actions[i];
    if (!a) return;
    P5.audio.play('confirm');
    a.run();
  }

  function copy(text) {
    const done = () => toast('COPIED!');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else fallbackCopy(text, done);
  }

  function fallbackCopy(text, done) {
    const ta = h('textarea', null, document.body);
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('CTRL+C !'); }
    ta.remove();
  }

  function toast(text) {
    const t = h('div', 'contact__toast', el);
    P5.ransom.render(t, text, { theme: 'light', seed: 'toast' });
    gsap.timeline({ onComplete: () => t.remove() })
      .from(t, { scale: 3, rotation: -30, opacity: 0, duration: 0.2, ease: 'power4.in' })
      .to(t, { opacity: 0, y: -40, duration: 0.3, delay: 0.8 });
  }

  function topHat() {
    const s = svg('svg', { viewBox: '0 0 200 160', class: 'contact__hat' });
    svg('path', { d: 'M52 14 L150 6 L156 92 L48 98 Z', fill: '#0b0b0b' }, s);
    svg('path', { d: 'M8 98 Q100 76 194 94 L190 118 Q100 104 12 124 Z', fill: '#0b0b0b' }, s);
    svg('path', { d: 'M54 72 L152 66 L153 82 L54 88 Z', fill: '#e60012' }, s);
    svg('path', { d: 'M60 130 Q100 158 150 126 Q104 140 60 130 Z', fill: '#0b0b0b' }, s);
    svg('path', { d: 'M74 40 l14 -8 l2 14 z M116 32 l14 6 l-12 10 z', fill: '#f6f6f2' }, s);
    return s;
  }
})();
