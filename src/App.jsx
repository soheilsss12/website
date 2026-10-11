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
import CalculatorLab, { calculatorTools } from './components/CalculatorLab.jsx';
import LogoOptionsPage from './components/LogoOptions.jsx';
import CrystalMark from './components/CrystalMark.jsx';
import {
  AboutSection,
  ArticleDetail,
  BenefitsSection,
  ContactSection,
  CookieNotice,
  CriteriaSection,
  FinalCallout,
  FooterSection,
  HeroSection,
  IndustriesSection,
  KnowledgeSection,
  ManifestoSection,
  MapSection,
  NewsSection,
  PartnersSection,
  PortfolioSection,
  ProcessSection,
  StatsRibbon,
  ToolsSection,
} from './components/SiteSections.jsx';
import { articles, navItems } from './data/siteContent.js';

const siteAnchors = new Set([
  'home', 'manifesto', 'industries', 'benefits', 'process', 'portfolio', 'map', 'approach', 'criteria', 'faq',
  'tools', 'partners', 'knowledge', 'news', 'about', 'team', 'contact', 'campaign',
]);
const applyAnchors = new Set(['campaign-criteria', 'application-form', 'applicant-access']);
const routeViews = new Set(['apply', 'terms', 'privacy', 'sitemap', 'logo-options']);

function resolveRoute() {
  if (window.location.hostname.toLowerCase().startsWith('apply.')) return 'apply';
  const basePath = new URL(import.meta.env.BASE_URL, window.location.origin).pathname.replace(/\/+$/, '');
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  const relativePath = (currentPath.startsWith(basePath) ? currentPath.slice(basePath.length) : currentPath).replace(/^\/+|\/+$/g, '');
  if (relativePath && relativePath !== 'index.html') return relativePath === 'apply' ? 'apply' : 'not-found';
  const hash = decodeURIComponent(window.location.hash.slice(1)).split('?')[0];
  if (!hash || hash === 'home' || siteAnchors.has(hash)) return 'home';
  if (routeViews.has(hash)) return hash;
  if (applyAnchors.has(hash)) return 'apply';
  return 'not-found';
}

function BrandLockup() {
  return (
    <a className="brand-lockup" href="#home" aria-label="صفحه‌ی اصلی پارس">
      <span className="brand-symbol"><CrystalMark /></span>
      <span className="brand-name-stack"><strong>پارس</strong><small>سرمایه‌گذاری خطرپذیر</small></span>
    </a>
  );
}

function SiteHeader({ menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <div className="site-header-inner site-container">
        <BrandLockup />
        <nav className="desktop-nav" aria-label="منوی اصلی">
          {navItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <span className="header-status"><i className="status-indicator" /> پذیرش دوره‌ی بعد: به‌زودی اعلام می‌شود</span>
          <a className="button button-lime header-apply" href="#apply">درخواست سرمایه <ArrowUpLeft size={15} /></a>
          <button className="menu-trigger" type="button" aria-expanded={menuOpen} aria-controls="full-menu" onClick={() => setMenuOpen(true)}>منو <Menu size={18} /></button>
        </div>
      </div>
    </header>
  );
}

function FullMenu({ open, onClose }) {
  const links = [
    ['رویکرد ما', '#approach'], ['حوزه‌های سرمایه‌گذاری', '#industries'], ['بیشتر از سرمایه', '#benefits'],
    ['مسیر سرمایه‌گذاری', '#process'], ['پرتفوی', '#portfolio'], ['گستره‌ی جغرافیایی', '#map'],
    ['معیارهای ارزیابی', '#approach'], ['ابزارهای استارتاپ', '#tools'], ['مرکز دانش', '#knowledge'],
    ['اخبار و رویدادها', '#news'], ['درباره‌ی پارس', '#about'], ['همکاران', '#partners'],
    ['تماس با ما', '#contact'], ['گزینه‌های لوگوی پارس', '#logo-options'],
  ];
  useEffect(() => {
    const onEscape = (event) => { if (event.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open, onClose]);
  return (
    <div className={`full-menu ${open ? 'is-open' : ''}`} id="full-menu" aria-hidden={!open} inert={!open}>
      <div className="full-menu-inner site-container">
        <div className="full-menu-head"><BrandLockup /><span className="full-menu-coordinate">ایران · سرمایه‌ی هوشمند · رشد بلندمدت</span><button type="button" className="full-menu-close" onClick={onClose}>بستن <X size={18} /></button></div>
        <div className="full-menu-body"><div className="full-menu-label"><span className="eyebrow">دسترسی سریع</span><p>از شناخت رویکرد تا شروع درخواست؛ از هرجا که هستید</p><a href="#apply" className="button button-lime" onClick={onClose}>شروع درخواست سرمایه <ArrowUpLeft size={15} /></a></div><nav className="full-menu-links" aria-label="همه‌ی بخش‌های سایت">{links.map((item, index) => <a href={item[1]} key={item[1] + item[0]} onClick={onClose}><span>{new Intl.NumberFormat('fa-IR').format(index + 1)}</span>{item[0]}<ArrowUpLeft size={17} /></a>)}</nav></div>
        <div className="full-menu-foot"><span>پارس / سرمایه‌گذاری خطرپذیر</span><span>شرایط پذیرش در اطلاعیه‌ی هر دوره اعلام می‌شود</span></div>
      </div>
    </div>
  );
}

function MobileApplyBar() {
  return <a className="mobile-apply-bar" href="#apply"><span><small>فراخوان سرمایه‌گذاری</small><strong>شروع درخواست</strong></span><span className="mobile-apply-arrow"><ArrowUpLeft size={18} /></span></a>;
}

function SiteMapPage() {
  const groups = [
    { title: 'سرمایه‌گذاری', links: [['رویکرد ما', '#approach'], ['حوزه‌های تمرکز', '#industries'], ['حمایت‌های پارس', '#benefits'], ['مسیر سرمایه‌گذاری', '#process'], ['پرتفوی', '#portfolio'], ['محدوده‌ی جغرافیایی', '#map']] },
    { title: 'ابزار و دانش', links: [['ابزارها', '#tools'], ['مرکز دانش', '#knowledge'], ['اخبار و رویدادها', '#news']] },
    { title: 'درباره و ارتباط', links: [['درباره‌ی پارس', '#about'], ['همکاران', '#partners'], ['تماس با ما', '#contact']] },
  ];
  return <SubPage title="نقشه‌ی سایت" eyebrow="دسترسی روشن" description="همه‌ی مسیرهای سایت پارس در یک نگاه" icon={Network}><div className="sitemap-grid">{groups.map((group) => <div className="sitemap-group" key={group.title}><h3>{group.title}</h3>{group.links.map((link) => <a href={link[1]} key={link[0]}>{link[0]} <ArrowUpLeft size={14} /></a>)}</div>)}<div className="sitemap-group"><h3>متقاضیان</h3><a href="#apply">صفحه‌ی کمپین <ArrowUpLeft size={14} /></a><a href="#privacy">حریم خصوصی <ArrowUpLeft size={14} /></a><a href="#terms">قوانین و مقررات <ArrowUpLeft size={14} /></a></div></div></SubPage>;
}

function SubPage({ title, eyebrow, description, icon: Icon = FileText, children }) {
  return (
    <main className="subpage-shell" dir="rtl">
      <header className="subpage-header site-container"><BrandLockup /><a href="#home" className="text-link"><ArrowLeft size={15} /> بازگشت به صفحه‌ی اصلی</a></header>
      <section className="subpage-hero site-container"><div className="subpage-icon"><Icon size={25} /></div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></section>
      <section className="subpage-content site-container">{children}</section>
      <footer className="subpage-footer site-container"><BrandLockup /><span>پارس · سرمایه‌گذاری خطرپذیر</span><a href="#contact">تماس با ما</a></footer>
    </main>
  );
}

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'حریم خصوصی و محرمانگی اطلاعات' : 'قوانین و مقررات';
  const description = isPrivacy
    ? 'اطلاعات مربوط به حریم خصوصی به‌زودی منتشر می‌شود'
    : 'متن نهایی قوانین و مقررات به‌زودی منتشر می‌شود';
  return (
    <SubPage title={title} eyebrow={isPrivacy ? 'اعتماد و محرمانگی' : 'چارچوب همکاری'} description={description} icon={isPrivacy ? LockKeyhole : ShieldCheck}>
      <div className="legal-preview-alert"><ShieldCheck size={19} /><span><strong>اطلاعات رسمی به‌زودی منتشر می‌شود</strong><small>{isPrivacy ? 'تا زمان فعال‌شدن سامانه‌ی درخواست، اطلاعات واردشده در فرم به سرور ارسال نمی‌شود' : 'شرایط پذیرش، سرمایه‌گذاری و همکاری فقط از مسیر اطلاعیه‌ها و توافق‌های رسمی اعلام می‌شود'}</small></span></div>
      <a href="#contact" className="button button-dark">تماس با پارس <ArrowUpLeft size={15} /></a>
    </SubPage>
  );
}

function NotFoundPage() {
  return <SubPage title="این مسیر را پیدا نکردیم" eyebrow="خطای ۴۰۴" description="ممکن است آدرس جابه‌جا شده باشد یا هنوز در سایت وجود نداشته باشد" icon={CircleHelp}><div className="not-found-mark">۴۰۴</div><a className="button button-lime" href="#home">بازگشت به صفحه‌ی اصلی <ArrowUpLeft size={15} /></a></SubPage>;
}

function HomePage({ onOpenTool, onOpenArticle, menuOpen, setMenuOpen, cookieChoice, onSaveCookie }) {
  return (
    <div className="home-page" dir="rtl">
      <SiteHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <FullMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <HeroSection />
        <StatsRibbon />
        <ManifestoSection />
        <IndustriesSection />
        <BenefitsSection />
        <ProcessSection />
        <PortfolioSection />
        <MapSection />
        <CriteriaSection />
        <ToolsSection onOpenTool={onOpenTool} />
        <PartnersSection />
        <KnowledgeSection onOpenArticle={onOpenArticle} onOpenTool={onOpenTool} />
        <NewsSection />
        <AboutSection />
        <ContactSection />
        <FinalCallout />
      </main>
      <FooterSection />
      <MobileApplyBar />
      <CookieNotice choice={cookieChoice} onSave={onSaveCookie} />
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(resolveRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  const [cookieChoice, setCookieChoice] = useState(() => {
    try { return window.localStorage.getItem('pars-cookie-choice') || ''; } catch { return ''; }
  });

  useEffect(() => {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
    const onHashChange = () => { setRoute(resolveRoute()); setMenuOpen(false); };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    return () => { window.removeEventListener('hashchange', onHashChange); window.removeEventListener('popstate', onHashChange); };
  }, []);

  useEffect(() => {
    const titles = {
      home: 'پارس | سرمایه‌گذاری خطرپذیر', apply: 'درخواست سرمایه | پارس', terms: 'قوانین و مقررات | پارس',
      privacy: 'حریم خصوصی | پارس', sitemap: 'نقشه‌ی سایت | پارس', 'logo-options': 'گزینه‌های لوگو | پارس', 'not-found': 'صفحه پیدا نشد | پارس',
    };
    document.title = titles[route] || titles.home;
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
    if (route !== 'home' || !('IntersectionObserver' in window)) {
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
      if (event.key === 'Escape') { setActiveArticle(null); setActiveTool(''); setMenuOpen(false); }
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  useEffect(() => {
    if (!activeArticle && !activeTool) return undefined;
    document.body.classList.add('has-modal');
    return () => document.body.classList.remove('has-modal');
  }, [activeArticle, activeTool]);

  const openTool = useCallback((toolId) => { setActiveArticle(null); setActiveTool(toolId); }, []);
  const openArticle = useCallback((article) => { setActiveTool(''); setActiveArticle(article); }, []);
  const saveCookieChoice = (choice) => {
    setCookieChoice(choice);
    try { window.localStorage.setItem('pars-cookie-choice', choice); } catch { /* Consent remains for this visit. */ }
  };

  if (route === 'apply') return <ApplicationPage />;
  if (route === 'terms' || route === 'privacy') return <LegalPage type={route} />;
  if (route === 'sitemap') return <SiteMapPage />;
  if (route === 'logo-options') return <LogoOptionsPage />;
  if (route === 'not-found') return <NotFoundPage />;

  const activeToolConfig = calculatorTools.find((tool) => tool.id === activeTool);
  const relatedArticle = activeToolConfig ? articles.find((article) => article.title === activeToolConfig.related) || articles[0] : null;
  return (
    <>
      <HomePage onOpenTool={openTool} onOpenArticle={openArticle} menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={saveCookieChoice} />
      {activeTool && <CalculatorLab toolId={activeTool} onClose={() => setActiveTool('')} onOpenArticle={() => openArticle(relatedArticle)} />}
      {activeArticle && <ArticleDetail article={activeArticle} onClose={() => setActiveArticle(null)} onOpenTool={openTool} />}
    </>
  );
}
