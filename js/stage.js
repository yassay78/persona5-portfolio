(function (root) {
  const W = 1920, H = 1080;

  function fit(winW, winH) {
    const scale = Math.min(winW / W, winH / H);
    return { scale, x: (winW - W * scale) / 2, y: (winH - H * scale) / 2 };
  }

  function init(el) {
    const apply = () => {
      const f = fit(window.innerWidth, window.innerHeight);
      el.style.transform = `translate(${f.x}px, ${f.y}px) scale(${f.scale})`;
    };
    window.addEventListener('resize', apply);
    apply();
  }

  const api = { fit, init, W, H };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) { root.P5 = root.P5 || {}; root.P5.stage = api; }
})(typeof window !== 'undefined' ? window : null);
