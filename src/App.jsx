import { useEffect, useState } from 'react';
import { ArrowUpLeft } from 'lucide-react';
import AdminPage from './components/AdminPage.jsx';
import ApplicationPage from './components/ApplicationPage.jsx';
import LogoOptionsPage from './components/LogoOptions.jsx';
import MinimalHomePage from './components/MinimalHomePage.jsx';
import ParsLogoMark from './components/ParsLogoMark.jsx';
import TrackingPage from './components/TrackingPage.jsx';

const homeAnchors = new Set(['home', 'gallery', 'industries', 'about']);
const applicationAnchors = new Set(['apply', 'application-form']);
const pageRoutes = new Set(['track', 'terms', 'privacy', 'sitemap', 'logo-options', 'admin']);

function resolveRoute() {
  if (window.location.hostname.toLowerCase().startsWith('apply.')) return 'apply';
  const basePath = new URL(import.meta.env.BASE_URL, window.location.origin).pathname.replace(/\/+$/, '');
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  const path = (currentPath.startsWith(basePath) ? currentPath.slice(basePath.length) : currentPath)
    .replace(/^\/+|\/+$/g, '');
  if (path && path !== 'index.html') {
    if (path === 'apply') return 'apply';
    if (pageRoutes.has(path)) return path;
    return 'not-found';
  }
  const hash = decodeURIComponent(window.location.hash.slice(1)).split('?')[0];
  if (applicationAnchors.has(hash)) return 'apply';
  if (pageRoutes.has(hash)) return hash;
  if (!hash || homeAnchors.has(hash)) return 'home';
  return 'not-found';
}

function SiteBrand({ href = '#home' }) {
  return (
    <a className="pars-brand" href={href} aria-label="صفحه‌ی اصلی پارس">
      <ParsLogoMark decorative className="pars-brand-mark" />
      <span>پارس</span>
    </a>
  );
}

function SimplePage({ title, eyebrow, children }) {
  return (
    <main className="pars-simple-page" dir="rtl">
      <header className="pars-simple-header pars-container">
        <SiteBrand />
        <a className="pars-simple-back" href="#home">بازگشت به سایت</a>
      </header>
      <section className="pars-simple-content pars-container">
        <span className="pars-section-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        {children}
      </section>
    </main>
  );
}

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';
  return (
    <SimplePage
      title={isPrivacy ? 'حریم خصوصی' : 'قوانین'}
      eyebrow={isPrivacy ? 'حریم خصوصی' : 'اطلاعات حقوقی'}
    >
      <p>{isPrivacy ? 'اطلاعیه‌ی حریم خصوصی در دست تکمیل است.' : 'متن قوانین در دست تکمیل است.'}</p>
      <a className="pars-button" href="#apply">درخواست سرمایه <ArrowUpLeft size={16} /></a>
    </SimplePage>
  );
}

function SiteMapPage() {
  const items = [
    ['صفحه‌ی اصلی', '#home'],
    ['حوزه‌ها', '#industries'],
    ['تصاویر', '#gallery'],
    ['درباره‌ی پارس', '#about'],
    ['درخواست سرمایه', '#apply'],
    ['پیگیری درخواست', '#track'],
    ['حریم خصوصی', '#privacy'],
    ['قوانین', '#terms'],
  ];
  return (
    <SimplePage title="نقشه‌ی سایت" eyebrow="دسترسی">
      <nav className="pars-sitemap-links" aria-label="بخش‌های سایت">
        {items.map(([label, href]) => <a href={href} key={href}>{label}<ArrowUpLeft size={16} /></a>)}
      </nav>
    </SimplePage>
  );
}

function NotFoundPage() {
  return (
    <SimplePage title="این صفحه پیدا نشد" eyebrow="۴۰۴">
      <a className="pars-button" href="#home">بازگشت به صفحه‌ی اصلی <ArrowUpLeft size={16} /></a>
    </SimplePage>
  );
}

export default function App() {
  const [route, setRoute] = useState(resolveRoute);

  useEffect(() => {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
    const onLocationChange = () => setRoute(resolveRoute());
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  useEffect(() => {
    const titles = {
      home: 'پارس | گروه سرمایه‌گذاری فناوری',
      apply: 'درخواست سرمایه | پارس',
      track: 'پیگیری درخواست | پارس',
      terms: 'قوانین | پارس',
      privacy: 'حریم خصوصی | پارس',
      sitemap: 'نقشه‌ی سایت | پارس',
      'logo-options': 'نشان پارس',
      admin: 'پنل مدیریت | پارس',
      'not-found': 'صفحه پیدا نشد | پارس',
    };
    document.title = titles[route] || titles.home;
    const hash = decodeURIComponent(window.location.hash.slice(1)).split('?')[0];
    window.requestAnimationFrame(() => {
      if (route === 'home' && hash && homeAnchors.has(hash)) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else if (route === 'apply' && hash && hash !== 'apply') {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
  }, [route]);

  if (route === 'apply') return <ApplicationPage />;
  if (route === 'track') return <TrackingPage />;
  if (route === 'admin') return <AdminPage />;
  if (route === 'logo-options') return <LogoOptionsPage />;
  if (route === 'terms' || route === 'privacy') return <LegalPage type={route} />;
  if (route === 'sitemap') return <SiteMapPage />;
  if (route === 'not-found') return <NotFoundPage />;
  return <MinimalHomePage />;
}
