(function (root) {
  const KEYS = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
    Enter: 'confirm', ' ': 'confirm',
    Escape: 'back', Backspace: 'back',
  };

  function init(target, dispatch) {
    target.addEventListener('keydown', e => {
      const action = KEYS[e.key];
      if (!action) return;
      e.preventDefault();
      dispatch(action);
    });
    target.addEventListener('contextmenu', e => {
      e.preventDefault();
      dispatch('back');
    });
  }

  const api = { init, KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) { root.P5 = root.P5 || {}; root.P5.input = api; }
})(typeof window !== 'undefined' ? window : null);
