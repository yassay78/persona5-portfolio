(function (root) {
  const TYPES = ['skills', 'projects', 'about', 'passions', 'link', 'contact', 'system'];
  const arr = v => (Array.isArray(v) ? v : []);
  const obj = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  const clamp = (v, lo, hi, dflt) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : dflt;
  };

  function contentCheck(raw) {
    const c = obj(raw);
    const warnings = [];

    const menu = arr(c.menu).filter(m => {
      if (m && TYPES.includes(m.type)) return true;
      warnings.push(`menu item "${m && m.label}" has unknown type "${m && m.type}" — ignored`);
      return false;
    });

    const about = obj(c.about);
    const contact = obj(c.contact);
    const content = {
      name: typeof c.name === 'string' ? c.name : 'YOUR NAME',
      tagline: typeof c.tagline === 'string' ? c.tagline : '',
      menu,
      skills: arr(c.skills).map(s => ({ ...s, level: clamp(s.level, 1, 10, 1) })),
      stats: arr(c.stats).map(s => ({ ...s, value: clamp(s.value, 1, 5, 1) })),
      projects: arr(c.projects).map(p => ({ ...p, links: arr(p.links) })),
      about: { ...about, traits: arr(about.traits) },
      passions: arr(c.passions).map(p => ({ ...p, rank: clamp(p.rank, 1, 10, 1), photos: arr(p.photos) })),
      contact: { ...contact, links: arr(contact.links) },
      audio: obj(c.audio),
    };
    return { content, warnings };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = contentCheck;
  if (root) { root.P5 = root.P5 || {}; root.P5.contentCheck = contentCheck; }
})(typeof window !== 'undefined' ? window : null);
