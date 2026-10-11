(function (root) {
  function create({ screens, runTransition, root: mountRoot }) {
    const router = {
      state: null,
      busy: false,
      current: null,
      go,
      back,
      handle,
    };

    function go(id, data, transitionName) {
      if (router.busy) return null;
      const next = screens[id];
      if (!next) {
        console.warn(`[router] unknown screen "${id}"`);
        return null;
      }
      router.busy = true;
      return run(id, next, data, transitionName || next.transition || 'slash');
    }

    async function run(id, next, data, name) {
      const prev = router.current;
      let swapped = false;
      const swap = () => {
        if (swapped) return;
        swapped = true;
        next.mount(mountRoot, data, router);
        if (prev) prev.unmount();
        router.current = next;
      };
      try {
        if (prev) await prev.exit();
        await runTransition(name, swap);
      } catch (err) {
        console.warn('[router] transition failed', err);
      }
      try {
        swap();
        router.state = id;
        await next.enter();
      } catch (err) {
        console.warn('[router] screen enter failed', err);
      } finally {
        router.busy = false;
      }
    }

    function back() {
      if (router.state === 'menu' || router.state === 'title') return null;
      const cur = router.current;
      return go('menu', { returning: true }, (cur && cur.backTransition) || 'slash');
    }

    function handle(action) {
      if (router.busy || !router.current) return;
      router.current.onAction(action);
    }

    return router;
  }

  const api = { create };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) { root.P5 = root.P5 || {}; root.P5.router = api; }
})(typeof window !== 'undefined' ? window : null);
