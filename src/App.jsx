import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpLeft,
  CircleHelp,
  FileText,
  LockKeyhole,
  Menu,
  Network,
  ShieldCheck,
  X,
} from 'lucide-react';
import ApplicationPage from './components/ApplicationPage.jsx';
import AdminPage from './components/AdminPage.jsx';
import CalculatorLab from './components/CalculatorLab.jsx';
import LogoOptionsPage from './components/LogoOptions.jsx';
import CrystalMark from './components/CrystalMark.jsx';
import TrackingPage from './components/TrackingPage.jsx';
import {
  AboutSection,
  BenefitsSection,
  ContactSection,
  CookieNotice,
  FinalCallout,
  FooterSection,
  HeroSection,
  HomeHighlightsSection,
  IndustriesSection,
  JourneySection,
  ManifestoSection,
  MapSection,
  NewsSection,
  PartnersSection,
  PortfolioSection,
  ProcessSection,
  StatsRibbon,
  ToolsSection,
} from './components/SiteSections.jsx';
import { navItems } from './data/siteContent.js';
import { pageHref, routeFromLegacyHash, routeFromPath } from './lib/routes.js';

function resolveRoute() {
  if (window.location.hostname.toLowerCase().startsWith('apply.')) return 'apply';

  const basePath = new URL(import.meta.env.BASE_URL, window.location.origin).pathname.replace(/\/+$/, '');
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  const relativePath = (currentPath.startsWith(basePath) ? currentPath.slice(basePath.length) : currentPath)
    .replace(/^\/+|\/+$/g, '');

  if (relativePath && relativePath.toLowerCase() !== 'index.html') return routeFromPath(relativePath);

  const hash = decodeURIComponent(window.location.hash.slice(1)).split('?')[0];
  return hash ? routeFromLegacyHash(hash) : routeFromPath(relativePath);
}

function BrandLockup({ descriptor = 'سرمایه‌گذاری خطرپذیر' }) {
  return (
    <a className="brand-lockup" href={pageHref('home')} aria-label="صفحه‌ی اصلی پارس">
      <span className="brand-symbol"><CrystalMark /></span>
      <span className="brand-name-stack"><strong>پارس</strong><small>{descriptor}</small></span>
    </a>
  );
}

function SiteHeader({ activeRoute, menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <div className="site-header-inner site-container">
        <BrandLockup descriptor="سرمایه‌گذاری" />
        <nav className="desktop-nav" aria-label="منوی اصلی">
          {navItems.map((item) => (
            <a
              href={pageHref(item.route)}
              key={item.route}
              aria-current={activeRoute === item.route ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-track-link" href={pageHref('track')}>پیگیری درخواست</a>
          <a className="button button-lime header-apply" href={pageHref('apply')}>درخواست سرمایه <ArrowUpLeft size={15} /></a>
          <button
            className="menu-trigger"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="full-menu"
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
            <span>{menuOpen ? 'بستن' : 'منو'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function FullMenu({ open, onClose }) {
  const links = [
    ...navItems,
    { label: 'ابزارهای استارتاپی', route: 'tools' },
    { label: 'پیگیری درخواست', route: 'track' },
    { label: 'قوانین و مقررات', route: 'terms' },
    { label: 'حریم خصوصی', route: 'privacy' },
    { label: 'نقشه‌ی سایت', route: 'sitemap' },
  ];

  useEffect(() => {
    const onEscape = (event) => { if (event.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open, onClose]);

  return (
    <div className={`full-menu ${open ? 'is-open' : ''}`} id="full-menu" aria-hidden={!open} inert={!open}>
      <div className="full-menu-inner site-container">
        <div className="full-menu-head">
          <BrandLockup descriptor="سرمایه‌گذاری" />
          <span className="full-menu-coordinate">پارس / سرمایه‌گذاری خطرپذیر</span>
          <button type="button" className="full-menu-close" onClick={onClose}>بستن <X size={18} /></button>
        </div>
        <div className="full-menu-body">
          <div className="full-menu-label">
            <span className="eyebrow">پارس</span>
            <p>هر موضوع، در صفحه‌ی خودش؛ هر درخواست، در مسیری جداگانه.</p>
            <a href={pageHref('apply')} className="button button-lime" onClick={onClose}>شروع درخواست سرمایه <ArrowUpLeft size={15} /></a>
          </div>
          <nav className="full-menu-links" aria-label="همه‌ی صفحه‌های سایت">
            {links.map((item, index) => (
              <a href={pageHref(item.route)} key={item.route} onClick={onClose}>
                <span>{new Intl.NumberFormat('fa-IR').format(index + 1)}</span>
                {item.label}
                <ArrowUpLeft size={17} />
              </a>
            ))}
          </nav>
        </div>
        <div className="full-menu-foot"><span>پارس / سرمایه‌گذاری خطرپذیر</span><span>شرایط پذیرش در اطلاعیه‌ی رسمی هر دوره اعلام می‌شود</span></div>
      </div>
    </div>
  );
}

function MobileApplyBar() {
  return (
    <a className="mobile-apply-bar" href={pageHref('apply')}>
      <span><small>فراخوان سرمایه‌گذاری</small><strong>شروع درخواست</strong></span>
      <span className="mobile-apply-arrow"><ArrowUpLeft size={18} /></span>
    </a>
  );
}

function SiteMapPage() {
  const groups = [
    { title: 'سرمایه‌گذاری', links: [['رویکرد ما', 'approach'], ['حوزه‌های سرمایه‌گذاری', 'industries'], ['پرتفوی', 'portfolio']] },
    { title: 'خبر و ابزار', links: [['خبرها و دیدگاه‌ها', 'news'], ['ابزارهای استارتاپی', 'tools']] },
    { title: 'پارس', links: [['درباره‌ی ما', 'about'], ['تماس با ما', 'contact']] },
  ];
  return (
    <SubPage title="نقشه‌ی سایت" eyebrow="دسترسی روشن" description="صفحه‌های مستقل سایت پارس در یک نگاه" icon={Network}>
      <div className="sitemap-grid">
        {groups.map((group) => (
          <div className="sitemap-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map(([label, route]) => <a href={pageHref(route)} key={route}>{label} <ArrowUpLeft size={14} /></a>)}
          </div>
        ))}
        <div className="sitemap-group">
          <h3>متقاضیان</h3>
          <a href={pageHref('apply')}>درخواست سرمایه <ArrowUpLeft size={14} /></a>
          <a href={pageHref('track')}>پیگیری درخواست <ArrowUpLeft size={14} /></a>
          <a href={pageHref('privacy')}>حریم خصوصی <ArrowUpLeft size={14} /></a>
          <a href={pageHref('terms')}>قوانین و مقررات <ArrowUpLeft size={14} /></a>
        </div>
      </div>
    </SubPage>
  );
}

function SubPage({ title, eyebrow, description, icon: Icon = FileText, children }) {
  return (
    <main className="subpage-shell" dir="rtl">
      <header className="subpage-header site-container"><BrandLockup descriptor="سرمایه‌گذاری" /><a href={pageHref('home')} className="text-link"><ArrowLeft size={15} /> بازگشت به صفحه‌ی اصلی</a></header>
      <section className="subpage-hero site-container"><div className="subpage-icon"><Icon size={25} /></div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></section>
      <section className="subpage-content site-container">{children}</section>
      <footer className="subpage-footer site-container"><BrandLockup /><span>پارس · سرمایه‌گذاری خطرپذیر</span><a href={pageHref('contact')}>تماس با ما</a></footer>
    </main>
  );
}

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'حریم خصوصی و محرمانگی اطلاعات' : 'قوانین و مقررات';
  const description = isPrivacy ? 'متن نهایی حریم خصوصی هنوز منتشر نشده است' : 'متن نهایی قوانین و مقررات هنوز منتشر نشده است';
  return (
    <SubPage title={title} eyebrow={isPrivacy ? 'اعتماد و محرمانگی' : 'چارچوب همکاری'} description={description} icon={isPrivacy ? LockKeyhole : ShieldCheck}>
      <div className="legal-preview-alert">
        <ShieldCheck size={19} />
        <span>
          <strong>{isPrivacy ? 'متن نهایی حریم خصوصی هنوز منتشر نشده است' : 'متن نهایی قوانین و مقررات هنوز منتشر نشده است'}</strong>
          <small>{isPrivacy ? 'درخواست فقط پس از پاسخ موفق API در پایگاه داده ثبت می‌شود؛ شرایط نگه‌داری و حذف داده پیش از بهره‌برداری عمومی باید در سیاست نهایی اعلام شود' : 'شرایط پذیرش، سرمایه‌گذاری و همکاری فقط از مسیر اطلاعیه‌ها و توافق‌های رسمی اعلام می‌شود'}</small>
        </span>
      </div>
      <a href={pageHref('contact')} className="button button-dark">تماس با پارس <ArrowUpLeft size={15} /></a>
    </SubPage>
  );
}

function NotFoundPage() {
  return (
    <SubPage title="این مسیر را پیدا نکردیم" eyebrow="خطای ۴۰۴" description="ممکن است آدرس جابه‌جا شده باشد یا هنوز در سایت وجود نداشته باشد" icon={CircleHelp}>
      <div className="not-found-mark">۴۰۴</div>
      <a className="button button-lime" href={pageHref('home')}>بازگشت به صفحه‌ی اصلی <ArrowUpLeft size={15} /></a>
    </SubPage>
  );
}

function SiteShell({ children, activeRoute, menuOpen, setMenuOpen, cookieChoice, onSaveCookie }) {
  return (
    <div className="home-page" dir="rtl">
      <SiteHeader activeRoute={activeRoute} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <FullMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>{children}</main>
      <FooterSection />
      <MobileApplyBar />
      <CookieNotice choice={cookieChoice} onSave={onSaveCookie} />
    </div>
  );
}

function HomePage({ menuOpen, setMenuOpen, cookieChoice, onSaveCookie }) {
  return (
    <SiteShell activeRoute="home" menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={onSaveCookie}>
      <HeroSection />
      <StatsRibbon />
      <HomeHighlightsSection />
      <FinalCallout />
    </SiteShell>
  );
}

function ContentPage({ route, onOpenTool, menuOpen, setMenuOpen, cookieChoice, onSaveCookie }) {
  let content;
  switch (route) {
    case 'approach':
      content = <><ManifestoSection /><JourneySection /><BenefitsSection /><ProcessSection /></>;
      break;
    case 'industries':
      content = <><IndustriesSection /><MapSection /></>;
      break;
    case 'portfolio':
      content = <PortfolioSection />;
      break;
    case 'news':
      content = <NewsSection />;
      break;
    case 'about':
      content = <><AboutSection /><PartnersSection /></>;
      break;
    case 'contact':
      content = <ContactSection />;
      break;
    case 'tools':
      content = <ToolsSection onOpenTool={onOpenTool} />;
      break;
    default:
      return <NotFoundPage />;
  }

  return (
    <SiteShell activeRoute={route} menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={onSaveCookie}>
      {content}
    </SiteShell>
  );
}

const pageTitles = {
  home: 'پارس | سرمایه‌گذاری خطرپذیر',
  approach: 'رویکرد سرمایه‌گذاری | پارس',
  industries: 'حوزه‌های سرمایه‌گذاری | پارس',
  portfolio: 'پرتفوی | پارس',
  news: 'خبرها و دیدگاه‌ها | پارس',
  about: 'درباره‌ی پارس',
  contact: 'تماس با پارس',
  tools: 'ابزارهای استارتاپی | پارس',
  apply: 'درخواست سرمایه | پارس',
  track: 'پیگیری درخواست | پارس',
  terms: 'قوانین و مقررات | پارس',
  privacy: 'حریم خصوصی | پارس',
  sitemap: 'نقشه‌ی سایت | پارس',
  admin: 'پنل مدیریت | پارس',
  'logo-options': 'نشان پارس',
  'not-found': 'صفحه پیدا نشد | پارس',
};

const standaloneRoutes = new Set(['apply', 'track', 'admin', 'terms', 'privacy', 'sitemap', 'logo-options', 'not-found']);

export default function App() {
  const [route, setRoute] = useState(resolveRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState('');
  const [cookieChoice, setCookieChoice] = useState(() => {
    try { return window.localStorage.getItem('pars-cookie-choice') || ''; } catch { return ''; }
  });

  useEffect(() => {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
    const onLocationChange = () => { setRoute(resolveRoute()); setMenuOpen(false); };
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  useEffect(() => {
    document.title = pageTitles[route] || pageTitles.home;
    if (route === 'apply') {
      const hash = decodeURIComponent(window.location.hash.slice(1)).split('?')[0];
      if (hash && hash !== 'apply') {
        window.requestAnimationFrame(() => {
          const target = document.getElementById(hash);
          if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
          else window.scrollTo({ top: 0, behavior: 'instant' });
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else if (route !== 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [route]);

  useEffect(() => {
    if (standaloneRoutes.has(route) || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }
    const targets = document.querySelectorAll('.home-page [data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [route]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') { setActiveTool(''); setMenuOpen(false); }
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  useEffect(() => {
    if (!activeTool) return undefined;
    document.body.classList.add('has-modal');
    return () => document.body.classList.remove('has-modal');
  }, [activeTool]);

  const openTool = useCallback((toolId) => { setActiveTool(toolId); }, []);
  const saveCookieChoice = (choice) => {
    setCookieChoice(choice);
    try { window.localStorage.setItem('pars-cookie-choice', choice); } catch { /* Consent remains for this visit. */ }
  };

  if (route === 'apply') return <ApplicationPage />;
  if (route === 'track') return <TrackingPage />;
  if (route === 'admin') return <AdminPage />;
  if (route === 'terms' || route === 'privacy') return <LegalPage type={route} />;
  if (route === 'sitemap') return <SiteMapPage />;
  if (route === 'logo-options') return <LogoOptionsPage />;
  if (route === 'not-found') return <NotFoundPage />;

  return (
    <>
      {route === 'home'
        ? <HomePage menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={saveCookieChoice} />
        : <ContentPage route={route} onOpenTool={openTool} menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={saveCookieChoice} />}
      {activeTool && <CalculatorLab toolId={activeTool} onClose={() => setActiveTool('')} />}
    </>
  );
}
