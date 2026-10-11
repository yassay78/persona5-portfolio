(function () {
  const params = new URLSearchParams(location.search);
  if (!params.get('demo')) return;

  const P5 = window.P5;
  window.__sfx = [];
  window.__demoDone = false;
  const play = P5.audio.play;
  P5.audio.play = (name, opts) => { window.__sfx.push({ name, t: Date.now() }); return play(name, opts); };
  window.open = () => null;

  const wait = s => new Promise(r => setTimeout(r, s * 1000));
  const key = k => window.dispatchEvent(new KeyboardEvent('keydown', { key: k }));
  const idle = async () => { await wait(0.05); while (P5.app.busy) await wait(0.05); };
  const press = async (k, after) => { key(k); await idle(); await wait(after); };

  async function goTo(type) {
    const target = P5.content.menu.findIndex(m => m.type === type);
    let cur = [...document.querySelectorAll('.menu__item')].findIndex(b => b.classList.contains('is-selected'));
    while (cur !== target) { await press(cur < target ? 'ArrowDown' : 'ArrowUp', 0.38); cur += cur < target ? 1 : -1; }
  }

  async function tour() {
    window.__demoStart = Date.now();
    await wait(2.2);
    await press('Enter', 2.0);
    await press('ArrowDown', 0.35); await press('ArrowDown', 0.35);
    await press('ArrowUp', 0.35); await press('ArrowUp', 0.5);

    await goTo('about'); await press('Enter', 3.0); await press('Escape', 0.8);

    await goTo('passions'); await press('Enter', 1.8);
    await press('ArrowDown', 1.1); await press('ArrowDown', 1.1); await press('ArrowDown', 1.4);
    await press('Escape', 1.0);

    await goTo('skills'); await press('Enter', 1.2);
    for (let i = 0; i < 3; i++) await press('ArrowDown', 0.35);
    await wait(0.6); await press('Escape', 1.0);

    await goTo('projects'); await press('Enter', 1.2);
    for (let i = 0; i < 3; i++) await press('ArrowDown', 0.5);
    await wait(0.6); await press('Escape', 1.0);

    await goTo('link'); await press('Enter', 1.8);
    await goTo('contact'); await press('Enter', 3.2);
    window.__demoDone = true;
  }

  const start = () => (P5.app && P5.app.state === 'title' && !P5.app.busy ? tour() : setTimeout(start, 100));
  setTimeout(start, 300);
})();
