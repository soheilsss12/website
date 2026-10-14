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
import CrystalMark from './components/CrystalMark.jsx';
import TrackingPage from './components/TrackingPage.jsx';
import {
  AboutSection,
  BenefitsSection,
  BrandClosingSection,
  ContactSection,
  CookieNotice,
  CorePlatformsSection,
  FinalCallout,
  FooterSection,
  HeroSection,
  HomeHighlightsSection,
  InvestmentOverviewSection,
  IndustriesSection,
  JourneySection,
  ManifestoSection,
  MapSection,
  MarketModelSection,
  NationalProgramsSection,
  NewsSection,
  OperatorStatusSection,
  PartnershipModelsSection,
  PortfolioSection,
  PortfolioSnapshotSection,
  ProcessSection,
  TechnologyArchitectureSection,
  ToolsSection,
  WhyParsSection,
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

function BrandLockup({ descriptor = '' }) {
  return (
    <a className="brand-lockup" href={pageHref('home')} aria-label="صفحه‌ی اصلی پارس">
      <span className="brand-symbol"><CrystalMark /></span>
      <span className="brand-name-stack"><strong>پارس</strong>{descriptor && <small>{descriptor}</small>}</span>
    </a>
  );
}

function SiteHeader({ activeRoute, menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <div className="site-header-inner site-container">
        <BrandLockup />
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
          <a className="button button-lime header-apply" href={pageHref('apply')}>
            درخواست سرمایه <ArrowUpLeft size={15} />
          </a>
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
  const sections = [
    { title: 'صفحه‌های پارس', links: navItems },
    {
      title: 'ابزارها و درخواست‌ها',
      links: [
        { label: 'ابزارهای مالی', route: 'tools' },
        { label: 'درخواست سرمایه', route: 'apply' },
        { label: 'پیگیری درخواست', route: 'track' },
      ],
    },
    {
      title: 'راهنما',
      links: [
        { label: 'قوانین و مقررات', route: 'terms' },
        { label: 'حریم خصوصی', route: 'privacy' },
        { label: 'نقشه‌ی سایت', route: 'sitemap' },
      ],
    },
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
          <BrandLockup />
          <span className="full-menu-coordinate">فناوری · سرمایه‌گذاری · ساخت کسب‌وکار</span>
          <button type="button" className="full-menu-close" onClick={onClose}>بستن <X size={18} /></button>
        </div>
        <div className="full-menu-body">
          <div className="full-menu-label">
            <span className="eyebrow">پارس</span>
            <p>مدل فناوری، سرمایه‌گذاری و همکاری پارس را مرور کنید.</p>
            <a href={pageHref('investment')} className="button button-lime" onClick={onClose}>نمای کلی پارس <ArrowUpLeft size={15} /></a>
          </div>
          <nav className="full-menu-links" aria-label="همه‌ی صفحه‌های سایت">
            {sections.map((section) => (
              <div className="full-menu-link-group" key={section.title}>
                <h2>{section.title}</h2>
                {section.links.map((item) => (
                  <a href={pageHref(item.route)} key={item.route} onClick={onClose}>
                    {item.label}
                    <ArrowUpLeft size={17} />
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="full-menu-foot"><span>پارس</span><span>فناوری، سرمایه‌گذاری و ساخت کسب‌وکار</span></div>
      </div>
    </div>
  );
}

function SiteMapPage() {
  const groups = [
    { title: 'صفحه‌های پارس', links: navItems.map(({ label, route }) => [label, route]) },
    { title: 'ابزارها و درخواست‌ها', links: [['ابزارهای مالی', 'tools'], ['درخواست سرمایه', 'apply'], ['پیگیری درخواست', 'track']] },
    { title: 'راهنما', links: [['قوانین و مقررات', 'terms'], ['حریم خصوصی', 'privacy'], ['نقشه‌ی سایت', 'sitemap']] },
  ];
  return (
    <SubPage title="نقشه‌ی سایت" eyebrow="دسترسی روشن" description="بخش‌های اصلی سایت پارس و مسیرهای دسترسی" icon={Network}>
      <div className="sitemap-grid">
        {groups.map((group) => (
          <div className="sitemap-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map(([label, route]) => <a href={pageHref(route)} key={route}>{label} <ArrowUpLeft size={14} /></a>)}
          </div>
        ))}
      </div>
    </SubPage>
  );
}

function SubPage({ title, eyebrow, description, icon: Icon = FileText, children }) {
  return (
    <main className="subpage-shell" dir="rtl">
      <header className="subpage-header site-container"><BrandLockup /><a href={pageHref('home')} className="text-link"><ArrowLeft size={15} /> بازگشت به صفحه‌ی اصلی</a></header>
      <section className="subpage-hero site-container"><div className="subpage-icon"><Icon size={25} /></div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></section>
      <section className="subpage-content site-container">{children}</section>
      <footer className="subpage-footer site-container"><BrandLockup /><span>پارس</span><a href={pageHref('contact')}>تماس با ما</a></footer>
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
      <CookieNotice choice={cookieChoice} onSave={onSaveCookie} />
    </div>
  );
}

function HomePage({ menuOpen, setMenuOpen, cookieChoice, onSaveCookie }) {
  return (
    <SiteShell activeRoute="home" menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={onSaveCookie}>
      <HeroSection />
      <PortfolioSnapshotSection />
      <HomeHighlightsSection />
      <MapSection />
      <BrandClosingSection />
    </SiteShell>
  );
}

function InvestmentPage({ menuOpen, setMenuOpen, cookieChoice, onSaveCookie }) {
  return (
    <SiteShell activeRoute="investment" menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={onSaveCookie}>
      <HeroSection />
      <InvestmentOverviewSection />
      <FinalCallout />
    </SiteShell>
  );
}

function ContentPage({ route, onOpenTool, menuOpen, setMenuOpen, cookieChoice, onSaveCookie }) {
  let content;
  switch (route) {
    case 'approach':
      content = <><ManifestoSection /><JourneySection /><TechnologyArchitectureSection /><CorePlatformsSection /><BenefitsSection /><ProcessSection /><OperatorStatusSection /></>;
      break;
    case 'industries':
      content = <><IndustriesSection /><NationalProgramsSection /></>;
      break;
    case 'portfolio':
      content = <PortfolioSection />;
      break;
    case 'news':
      content = <NewsSection />;
      break;
    case 'about':
      content = <><AboutSection /><MarketModelSection /><WhyParsSection /></>;
      break;
    case 'contact':
      content = <><PartnershipModelsSection /><ContactSection /></>;
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
  home: 'پارس | فناوری، سرمایه‌گذاری و ساخت کسب‌وکار',
  investment: 'سرمایه‌گذاری فناوری | پارس',
  approach: 'مدل فناوری و تجاری‌سازی | پارس',
  industries: '۱۱ حوزه‌ی تمرکز | پارس',
  portfolio: 'پرتفوی فناوری | پارس',
  news: 'تجربه‌های سازمانی | پارس',
  about: 'درباره‌ی پارس',
  contact: 'تماس و همکاری با پارس',
  tools: 'ابزارهای مالی و استارتاپی | پارس',
  apply: 'درخواست سرمایه | پارس',
  track: 'پیگیری درخواست | پارس',
  terms: 'قوانین و مقررات | پارس',
  privacy: 'حریم خصوصی | پارس',
  sitemap: 'نقشه‌ی سایت | پارس',
  admin: 'پنل مدیریت | پارس',
  'not-found': 'صفحه پیدا نشد | پارس',
};

const pageDescriptions = {
  home: 'از زیرساخت تا هوشمندی و از فناوری تا کسب‌وکار؛ آشنایی با پارس، شرکت فناوری و نوآوری ایرانی در حوزه‌ی هوش مصنوعی، سرمایه‌گذاری فناوری و ساخت کسب‌وکار.',
  investment: 'مدل سرمایه‌گذاری فناوری و مسیرهای تبدیل پژوهش و فناوری به محصول، پلتفرم و کسب‌وکار در پارس.',
  approach: 'معماری پنج‌لایه‌ی فناوری، AI Fabric، بازوهای رشد و الگوی تجاری‌سازی معرفی‌شده در پروفایل پارس.',
  industries: 'فهرست یازده‌گانه‌ی حوزه‌های تمرکز پارس و برنامه‌های ملی و دولتی معرفی‌شده در پروفایل شرکتی ۲۰۲۶.',
  portfolio: 'مرور نام محصولات، راهکارها، پلتفرم‌ها و برندهای درج‌شده در پروفایل شرکتی پارس ۲۰۲۶.',
  news: 'حوزه‌های تجربه‌ی سازمانی معرفی‌شده در پروفایل پارس؛ شرح پرونده‌های منتخب با رعایت محرمانگی و NDA ارائه می‌شود.',
  about: 'پارس در چهار نقش فناوری، تحول سازمانی، سرمایه‌گذاری فناوری و ساخت کسب‌وکار فعالیت می‌کند.',
  contact: 'مدل‌های مشارکت راهبردی و راه ارتباط با گروه فناوری و سرمایه‌گذاری پارس.',
  tools: 'ابزارهای برآورد مالی برای بنیان‌گذاران؛ محاسبه‌ها در مرورگر انجام می‌شوند و توصیه‌ی سرمایه‌گذاری نیستند.',
  apply: 'فرم چهارمرحله‌ای معرفی تیم، محصول و نیاز سرمایه به پارس.',
  track: 'پیگیری وضعیت درخواست ثبت‌شده در سامانه‌ی پارس.',
  terms: 'قوانین و مقررات سایت پارس؛ متن نهایی هنوز منتشر نشده است.',
  privacy: 'اطلاعات درباره‌ی حریم خصوصی و محرمانگی داده‌ها در سایت پارس.',
  sitemap: 'دسترسی به صفحه‌های سایت گروه فناوری و سرمایه‌گذاری پارس.',
  admin: 'پنل مدیریت درخواست‌ها و پیام‌های ثبت‌شده در سامانه‌ی پارس.',
  'not-found': 'این صفحه در سایت پارس پیدا نشد.',
};

const standaloneRoutes = new Set(['apply', 'track', 'admin', 'terms', 'privacy', 'sitemap', 'not-found']);

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
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', pageDescriptions[route] || pageDescriptions.home);
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
  if (route === 'not-found') return <NotFoundPage />;

  return (
    <>
      {route === 'home'
        ? <HomePage menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={saveCookieChoice} />
        : route === 'investment'
          ? <InvestmentPage menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={saveCookieChoice} />
          : <ContentPage route={route} onOpenTool={openTool} menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={saveCookieChoice} />}
      {activeTool && <CalculatorLab toolId={activeTool} onClose={() => setActiveTool('')} />}
    </>
  );
}
