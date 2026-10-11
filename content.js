window.CONTENT = {

  name: 'YASSINE FALIL',

  tagline: 'Développeur',

  menu: [
    { label: 'ABOUT ME', type: 'about',    hint: 'Qui suis-je ?' },
    { label: 'PASSIONS', type: 'passions', hint: 'Ce qui me fait vibrer' },
    { label: 'SKILLS',   type: 'skills',   hint: 'Voir mes compétences' },
    { label: 'PROJECTS', type: 'projects', hint: 'Voir mes projets' },
    { label: 'GITHUB',   type: 'link',     hint: 'Ouvrir mon GitHub', url: 'https://github.com/yassay78' },
    { label: 'CONTACT',  type: 'contact',  hint: 'Me contacter' },
    { label: 'SYSTEM',   type: 'system',   hint: 'Son et options' },
  ],

  skills: [
    { name: 'JavaScript', affinity: 'fire',     level: 7, desc: 'ES2023, DOM, animations, async.' },
    { name: 'TypeScript', affinity: 'ice',      level: 5, desc: 'Typage strict, génériques.' },
    { name: 'React',      affinity: 'elec',     level: 6, desc: 'Hooks, state, composants réutilisables.' },
    { name: 'HTML / CSS', affinity: 'wind',     level: 9, desc: 'Mise en page, responsive, animations CSS.' },
    { name: 'Node.js',    affinity: 'nuke',     level: 6, desc: 'API REST, Express, scripts.' },
    { name: 'Python',     affinity: 'psy',      level: 5, desc: 'Scripts, automatisation, un RPG jouable dans le terminal.' },
    { name: 'Go',         affinity: 'phys',     level: 6, desc: 'CLI, jeux en terminal, génération de PDF.' },
    { name: 'n8n',        affinity: 'support',  level: 7, desc: 'Workflows d\'automatisation : relier les outils et les API entre eux.' },
    { name: 'Automatisation IA', affinity: 'almighty', level: 7, desc: 'Agents et workflows IA pour supprimer les tâches répétitives.' },
    { name: 'SQL',        affinity: 'bless',    level: 5, desc: 'PostgreSQL, requêtes, modélisation.' },
    { name: 'Git',        affinity: 'gun',      level: 8, desc: 'Branches, rebase, revues de code.' },
  ],

  stats: [
    { label: 'KNOWLEDGE', value: 4 },
    { label: 'GUTS',      value: 5 },
    { label: 'PROFICIENCY', value: 4 },
    { label: 'KINDNESS',  value: 3 },
    { label: 'CHARM',     value: 3 },
  ],

  projects: [
    { name: 'Portfolio Persona 5', year: 2026, icon: 'web',    desc: 'Ce site ! Le menu de Persona 5 recréé en HTML/CSS/JS avec GSAP, animations et sons.', links: [] },
    { name: 'The Productivity Engine', year: 2026, icon: 'tool', desc: 'Application d\'automatisation avec n8n et de l\'IA : workflows intelligents (analyse, réponses, traitement de données) et suivi des automatisations.', links: [{ label: 'GitHub', url: 'https://github.com/yassay78/The_Productivity_Engine' }] },
    { name: 'Hyrule Castle',       year: 2026, icon: 'game',   desc: 'RPG au tour par tour inspiré de Zelda, jouable dans le terminal : 10 étages d\'ennemis générés dynamiquement, puis le boss final.', links: [{ label: 'GitHub', url: 'https://github.com/yassay78/Hyrule-Castle' }] },
    { name: 'TaskForge',           year: 2026, icon: 'app',    desc: 'Gestion de tâches en équipe : API sécurisée en NestJS, base MariaDB et frontend Next.js (à faire, en cours, terminé).', links: [{ label: 'GitHub', url: 'https://github.com/yassay78/TaskForge' }] },
    { name: 'EcoTrack',            year: 2026, icon: 'app',    desc: 'Localise les poubelles autour de toi et indique quoi jeter dans laquelle.', links: [] },
    { name: 'Robot tank Arduino',  year: 2026, icon: 'tool',   desc: 'Un robot tank construit et programmé avec Arduino.', links: [{ label: 'GitHub', url: 'https://github.com/yassay78/Arduino_project' }] },
    { name: 'Projet Persona 3',    year: 2026, icon: 'web',    desc: 'Un autre projet inspiré de l\'univers de Persona 3.', links: [] },
    { name: 'PrimeGenerator',      year: 2026, icon: 'tool',   desc: 'Outil en ligne de commande (Go) qui génère des avis de recherche One Piece en PDF, à l\'unité ou en masse depuis un CSV.', links: [{ label: 'GitHub', url: 'https://github.com/yassay78/PrimeGenerator' }] },
    { name: 'Cloud Photo Manager', year: 2026, icon: 'api',    desc: 'Architecture cloud-native simulée avec LocalStack : stockage objet AWS, microservices asynchrones et monitoring.', links: [{ label: 'GitHub', url: 'https://github.com/yassay78/Cloud_Photo_Manager' }] },
    { name: 'Sites e-commerce',    year: 2026, icon: 'design', desc: 'Création de boutiques en ligne : design, intégration et mise en ligne.', links: [] },
    { name: 'Automatisation IA',   year: 2026, icon: 'api',    desc: 'En alternance : j\'automatise les process de mon entreprise avec l\'IA pour supprimer les actions redondantes et gagner en productivité.', links: [] },
  ],

  about: {
    photo: 'assets/photos/profil.jpg',
    level: 19,
    arcana: '',
    title: 'Développeur',
    bio: 'Bonjour, je m\'appelle Yassine et j\'ai 19 ans. Après un bac général, je suis aujourd\'hui en 2e année à l\'ETNA, '
       + 'une école d\'informatique en alternance. Dans mon entreprise, je crée des automatisations avec l\'IA et n8n '
       + 'pour aider nos clients à supprimer leurs tâches répétitives. À long terme, d\'ici cinq ans et la fin de mes études, '
       + 'mon objectif est de m\'épanouir dans une entreprise en full remote, pour découvrir le monde.',
    traits: [
      { label: 'Créativité', value: 5 },
      { label: 'Rigueur',    value: 5 },
      { label: 'Esprit d\'équipe', value: 5 },
    ],
  },

  passions: [
    { name: 'BOXE',   arcana: 'STRENGTH',  rank: 8, desc: 'Entraînement plusieurs fois par semaine. Discipline et mental.', photos: ['assets/photos/boxe.jpg'] },
    { name: 'SPORT',  arcana: 'CHARIOT',   rank: 7, desc: 'Padel, musculation, tout ce qui fait bouger.', photos: ['assets/photos/sport.jpg'] },
    { name: 'JEUX VIDÉO', arcana: 'MAGICIAN', rank: 9, desc: 'Persona 5, évidemment. Ici à l\'expo des 30 ans de la saga.', photos: ['assets/photos/jeux.jpg'] },
    { name: 'VOYAGES', arcana: 'WORLD', rank: 7, desc: 'Découvrir d\'autres pays. Mon objectif : travailler en full remote depuis l\'étranger, dans plusieurs pays.', photos: ['assets/photos/voyage.jpg'] },
  ],

  contact: {
    email: 'yassinefalil784@gmail.com',
    message: 'Ton projet a volé mon attention. Écris-moi.',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/yassine-falil' },
      { label: 'GitHub',   url: 'https://github.com/yassay78' },
    ],
  },

  audio: {
    music: '',
  },
};
