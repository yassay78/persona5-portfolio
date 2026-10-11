(function () {
  const P5 = window.P5;
  P5.screens = P5.screens || {};
  const { h, header, keyhints, projectIcon } = P5.ui;
  let el, list, router, preview, descEl;

  P5.screens.projects = {
    transition: 'spin-line',
    backTransition: 'spin-line',

    mount(root, data, r) {
      router = r;
      const projects = P5.content.projects;
      el = h('section', 'screen sub projects', root);
      P5.ui.redBackground(el);
      h('div', 'projects__diag', el);
      header(el, (data && data.label) || 'PROJECTS', projects.length + ' items');

      preview = h('div', 'projects__preview', el);
      descEl = h('div', 'sub-desc', el);

      const panel = h('div', 'projects__panel', el);
      if (!projects.length) h('div', 'sub-empty', panel, 'Aucun projet dans content.js');
      list = P5.list.create(panel, projects, {
        className: 'projects__list',
        rowHeight: 84,
        visible: 8,
        slant: -8,
        renderRow(row, p) {
          row.appendChild(projectIcon(p.icon));
          h('span', 'projects__name', row, p.name);
          if (p.year) h('span', 'projects__qty', row, '× ' + p.year);
        },
        onSelect(i) { show(projects[i]); },
        onConfirm(i) { open(projects[i]); },
      });
      keyhints(el, [['Esc', 'Back'], ['Enter', 'Open']]);
    },

    enter() {
      const tl = gsap.timeline();
      tl.from('.projects__diag', { opacity: 0, duration: 0.15 })
        .from('.projects .sub-header', { x: -300, opacity: 0, duration: 0.25, ease: 'back.out(2)' }, 0)
        .from('.projects .plist__row', { x: 500, rotation: 6, opacity: 0, duration: 0.28, stagger: 0.035, ease: 'power3.out' }, 0.05)
        .from('.projects__preview', { rotation: -30, scale: 0.4, opacity: 0, duration: 0.35, ease: 'back.out(1.8)' }, 0.1)
        .from('.projects .sub-desc', { y: 120, duration: 0.25, ease: 'power3.out' }, 0.2);
      return tl;
    },

    exit() {
      return gsap.to('.projects > *:not(.p5-redbg)', { scale: 0.92, opacity: 0, duration: 0.14, ease: 'power2.in' });
    },

    onAction(a) {
      if (a === 'up') list.move(-1);
      else if (a === 'down') list.move(1);
      else if (a === 'confirm') open(P5.content.projects[list.index]);
      else if (a === 'back') { P5.audio.play('back'); router.back(); }
    },

    unmount() { el.remove(); },
  };

  function show(p) {
    preview.textContent = '';
    h('div', 'projects__card', preview);
    const icon = h('div', 'projects__icon', preview);
    icon.appendChild(projectIcon(p.icon));
    const name = h('div', 'projects__pname', preview);
    P5.ransom.render(name, p.name, { theme: 'dark', maxWidth: 680 });
    if (p.year) h('div', 'projects__year', preview, String(p.year));
    gsap.fromTo(preview, { rotation: -10, scale: 0.9 }, { rotation: -4, scale: 1, duration: 0.25, ease: 'back.out(3)' });

    descEl.textContent = '';
    h('span', 'sub-desc__text', descEl, p.desc || '');
    const links = h('span', 'projects__links', descEl);
    p.links.forEach(l => {
      const a = h('a', null, links, l.label || 'Lien');
      a.href = l.url;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    gsap.fromTo(descEl.children, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.18, stagger: 0.04 });
  }

  function open(p) {
    if (!p || !p.links.length) return;
    P5.audio.play('confirm');
    window.open(p.links[0].url, '_blank', 'noopener');
  }
})();
