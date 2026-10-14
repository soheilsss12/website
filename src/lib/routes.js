const routeSlugs = {
  home: '',
  investment: 'investment',
  approach: 'approach',
  portfolio: 'portfolio',
  news: 'stories',
  about: 'about',
  contact: 'contact',
  tools: 'tools',
  apply: 'apply',
  track: 'track',
  terms: 'terms',
  privacy: 'privacy',
  sitemap: 'sitemap',
  admin: 'admin',
};

const slugRoutes = Object.fromEntries(
  Object.entries(routeSlugs)
    .filter(([, slug]) => slug)
    .map(([route, slug]) => [slug, route]),
);

export function pageHref(route) {
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  const slug = routeSlugs[route];
  if (slug === undefined) return `${prefix}404.html`;
  return slug ? `${prefix}${slug}/` : prefix;
}

export function routeFromPath(path) {
  const normalized = path.replace(/^\/+|\/+$/g, '').replace(/\/index\.html$/i, '');
  if (!normalized || normalized.toLowerCase() === 'index.html') return 'home';
  if (normalized.toLowerCase() === '404.html') return 'not-found';
  return slugRoutes[normalized.split('/')[0].toLowerCase()] || 'not-found';
}

export function routeFromLegacyHash(hash) {
  const legacyRoutes = {
    home: 'home',
    approach: 'approach',
    journey: 'approach',
    industries: 'home',
    benefits: 'approach',
    process: 'approach',
    portfolio: 'portfolio',
    map: 'home',
    tools: 'tools',
    partners: 'about',
    news: 'news',
    about: 'about',
    team: 'about',
    contact: 'contact',
    campaign: 'apply',
    apply: 'apply',
    track: 'track',
    terms: 'terms',
    privacy: 'privacy',
    sitemap: 'sitemap',
    admin: 'admin',
    'campaign-criteria': 'apply',
    'application-form': 'apply',
    'applicant-access': 'apply',
  };
  return legacyRoutes[hash] || 'not-found';
}
