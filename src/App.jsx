import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  Globe2,
  LockKeyhole,
  Menu,
  Network,
  ShieldCheck,
  X,
} from 'lucide-react';
import ApplicationPage from './components/ApplicationPage.jsx';
import CalculatorLab, { calculatorTools } from './components/CalculatorLab.jsx';
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
  ImpactSection,
  IndustriesSection,
  KnowledgeSection,
  LicensesSection,
  ManifestoSection,
  MapSection,
  NewsSection,
  PartnersSection,
  PortfolioDetail,
  PortfolioSection,
  ProcessSection,
  QuotesSection,
  StatsRibbon,
  ToolsSection,
} from './components/SiteSections.jsx';
import { articles, navItems } from './data/siteContent.js';

const siteAnchors = new Set([
  'home', 'manifesto', 'industries', 'benefits', 'process', 'impact', 'portfolio', 'map', 'approach', 'criteria', 'faq',
  'tools', 'voices', 'partners', 'knowledge', 'news', 'about', 'team', 'licenses', 'contact', 'campaign',
]);
const applyAnchors = new Set(['campaign-criteria', 'application-form', 'applicant-access']);
const routeViews = new Set(['apply', 'terms', 'privacy', 'sitemap', 'admin']);

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
    <a className="brand-lockup" href="#home" aria-label="صفحه‌ی اصلی ایکس">
      <span className="brand-symbol">X</span>
      <span className="brand-name-stack"><strong>ایکس</strong><small>سرمایه‌گذاری جسورانه</small></span>
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
          <span className="header-status"><i className="status-indicator" /> وضعیت دوره: اعلام پس از تأیید</span>
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
    ['اخبار و رویدادها', '#news'], ['درباره‌ی ایکس', '#about'], ['همکاران', '#partners'],
    ['مجوزها', '#licenses'], ['تماس با ما', '#contact'],
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
        <div className="full-menu-body"><div className="full-menu-label"><span className="eyebrow">دسترسی سریع</span><p>از شناخت رویکرد تا شروع درخواست؛ از هرجا که هستید.</p><a href="#apply" className="button button-lime" onClick={onClose}>شروع درخواست سرمایه <ArrowUpLeft size={15} /></a></div><nav className="full-menu-links" aria-label="همه‌ی بخش‌های سایت">{links.map((item, index) => <a href={item[1]} key={item[1] + item[0]} onClick={onClose}><span>{new Intl.NumberFormat('fa-IR').format(index + 1)}</span>{item[0]}<ArrowUpLeft size={17} /></a>)}</nav></div>
        <div className="full-menu-foot"><span>ایکس / سرمایه‌گذاری جسورانه</span><span>شرایط پذیرش در اطلاعیه‌ی هر دوره اعلام می‌شود.</span></div>
      </div>
    </div>
  );
}

function MobileApplyBar() {
  return <a className="mobile-apply-bar" href="#apply"><span><small>فراخوان سرمایه‌گذاری</small><strong>شروع درخواست</strong></span><span className="mobile-apply-arrow"><ArrowUpLeft size={18} /></span></a>;
}

function SiteMapPage() {
  const groups = [
    { title: 'درباره‌ی سرمایه‌گذاری', links: [['رویکرد ما', '#approach'], ['حوزه‌ها', '#industries'], ['مسیر سرمایه‌گذاری', '#process'], ['پرتفوی', '#portfolio']] },
    { title: 'ابزار و دانش', links: [['ابزارها', '#tools'], ['مرکز دانش', '#knowledge'], ['اخبار و رویدادها', '#news']] },
    { title: 'شرکت', links: [['درباره‌ی ایکس', '#about'], ['همکاران', '#partners'], ['مجوزها', '#licenses'], ['تماس با ما', '#contact']] },
  ];
  return <SubPage title="نقشه‌ی سایت" eyebrow="دسترسی روشن" description="همه‌ی مسیرهای سایت ایکس در یک نگاه." icon={Network}><div className="sitemap-grid">{groups.map((group) => <div className="sitemap-group" key={group.title}><h3>{group.title}</h3>{group.links.map((link) => <a href={link[1]} key={link[0]}>{link[0]} <ArrowUpLeft size={14} /></a>)}</div>)}<div className="sitemap-group"><h3>متقاضیان</h3><a href="#apply">صفحه‌ی کمپین <ArrowUpLeft size={14} /></a><a href="#privacy">حریم خصوصی <ArrowUpLeft size={14} /></a><a href="#terms">قوانین و مقررات <ArrowUpLeft size={14} /></a></div></div></SubPage>;
}

function SubPage({ title, eyebrow, description, icon: Icon = FileText, children }) {
  return (
    <main className="subpage-shell" dir="rtl">
      <header className="subpage-header site-container"><BrandLockup /><a href="#home" className="text-link"><ArrowLeft size={15} /> بازگشت به صفحه‌ی اصلی</a></header>
      <section className="subpage-hero site-container"><div className="subpage-icon"><Icon size={25} /></div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></section>
      <section className="subpage-content site-container">{children}</section>
      <footer className="subpage-footer site-container"><BrandLockup /><span>ایکس · سرمایه‌گذاری جسورانه</span><a href="#contact">تماس با ما</a></footer>
    </main>
  );
}

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'حریم خصوصی و محرمانگی اطلاعات' : 'قوانین و مقررات';
  const description = isPrivacy ? 'اطلاعات متقاضیان باید با هدف روشن، دسترسی محدود و امنیت مناسب نگهداری شود.' : 'این صفحه پیش‌نویس ساختار حقوقی سایت است و پیش از انتشار نهایی به بازبینی حقوقی نیاز دارد.';
  return <SubPage title={title} eyebrow={isPrivacy ? 'اعتماد و محرمانگی' : 'چارچوب همکاری'} description={description} icon={isPrivacy ? LockKeyhole : ShieldCheck}>
    <div className="legal-preview-alert"><ShieldCheck size={19} /><span><strong>پیش‌نویس برای بازبینی</strong><small>متن نهایی باید با رویه‌ها و مدارک حقوقی شرکت تطبیق داده شود؛ این پیش‌نمایش تعهد حقوقی ایجاد نمی‌کند.</small></span></div>
    <div className="legal-copy"><h2>{isPrivacy ? 'اطلاعات چه زمانی دریافت می‌شود؟' : 'استفاده از سایت'}</h2><p>{isPrivacy ? 'در فرم نمونه‌ی درخواست، اطلاعات تماس، معرفی محصول، نیاز سرمایه و پیوندهای تکمیلی از متقاضی پرسیده می‌شود. در نسخه‌ی فعلی سایت هیچ داده‌ای به سرور ارسال یا در پایگاه داده ذخیره نمی‌شود.' : 'محتوای این سایت برای آشنایی اولیه با رویکرد سرمایه‌گذاری ایکس طراحی شده است. پذیرش درخواست، مبلغ سرمایه‌گذاری، زمان‌بندی و هر نوع همکاری فقط بر اساس اطلاعیه و توافق رسمی معتبر خواهد بود.'}</p><h2>{isPrivacy ? 'هدف استفاده و دسترسی' : 'درخواست سرمایه'}</h2><p>{isPrivacy ? 'در نسخه‌ی نهایی، هدف، مدت نگهداری، سطح دسترسی افراد مجاز، روش درخواست حذف اطلاعات و شیوه‌ی ارتباط برای پرسش‌های حریم خصوصی باید به‌صورت روشن اعلام شود. اطلاعات محرمانه‌ی کسب‌وکار نباید بدون مجوز در اختیار اشخاص ثالث قرار بگیرد.' : 'ارسال فرم، به‌معنای پذیرش یا تضمین سرمایه‌گذاری نیست. اطلاعات مبلغ، معیارها، حوزه‌های اولویت‌دار و مهلت هر دوره در صفحه‌ی رسمی کمپین اعلام خواهد شد.'}</p><h2>{isPrivacy ? 'امنیت و پیام‌رسانی' : 'اطلاعات و مسئولیت'}</h2><p>{isPrivacy ? 'اتصال کد تأیید موبایل، بارگذاری امن مدارک، رمزنگاری، گزارش دسترسی و بازه‌ی نگهداری اطلاعات، پیش از فعال‌شدن فرم واقعی باید پیاده‌سازی و مستند شوند.' : 'استفاده از محاسبه‌گرها و مطالب آموزشی به‌معنای مشاوره‌ی مالی، حقوقی یا تضمین نتیجه نیست. کاربران باید پیش از تصمیم‌گیری از متخصصان مربوط کمک بگیرند.'}</p></div>
    <a href="#contact" className="button button-dark">تماس برای پرسش <ArrowUpLeft size={15} /></a>
  </SubPage>;
}

function AdminPreview() {
  const menu = ['درخواست‌ها', 'محتوا', 'پرتفوی', 'گزارش‌ها', 'کاربران و دسترسی‌ها'];
  return <SubPage title="فضای مدیریت ایکس" eyebrow="پنل داخلی · پیش‌نمایش رابط" description="ساختار پیشنهادی پنل برای مدیریت درخواست‌ها، محتوا و گزارش‌ها. این صفحه به سامانه‌ی واقعی یا داده‌ی متقاضیان متصل نیست." icon={ShieldCheck}>
    <div className="admin-preview-warning"><LockKeyhole size={19} /><span><strong>محیط نمایشی، بدون داده‌ی واقعی</strong><small>برای راه‌اندازی، احراز هویت امن، نقش‌ها، ثبت رویدادها و بک‌اند اختصاصی لازم است.</small></span></div>
    <div className="admin-metric-row">{['درخواست‌های جدید', 'در حال بررسی', 'دعوت به جلسه', 'ابزارهای استفاده‌شده'].map((item) => <div key={item}><span>—</span><small>{item}</small></div>)}</div>
    <div className="admin-dashboard-preview"><nav>{menu.map((item, index) => <span className={index === 0 ? 'is-current' : ''} key={item}>{item}<i>{index === 0 ? '۰۱' : '—'}</i></span>)}</nav><div className="admin-table-panel"><div className="admin-table-head"><h2>مدیریت درخواست‌ها</h2><span>فیلتر · وضعیت · امتیازدهی · یادداشت</span></div><div className="admin-table-row"><strong>داده‌ی نمونه نمایش داده نمی‌شود</strong><span>فهرست واقعی پس از اتصال امن سامانه</span><span>—</span></div><div className="admin-table-row"><strong>مدیریت محتوای پرتفوی، مجوزها و مقاله‌ها</strong><span>پیش‌نمایش ساختار پنل</span><span>—</span></div></div></div>
  </SubPage>;
}

function NotFoundPage() {
  return <SubPage title="این مسیر را پیدا نکردیم." eyebrow="خطای ۴۰۴" description="ممکن است آدرس جابه‌جا شده باشد یا هنوز در سایت وجود نداشته باشد." icon={CircleHelp}><div className="not-found-mark">۴۰۴</div><a className="button button-lime" href="#home">بازگشت به صفحه‌ی اصلی <ArrowUpLeft size={15} /></a></SubPage>;
}

function HomePage({ onOpenTool, onOpenCase, onOpenArticle, menuOpen, setMenuOpen, cookieChoice, onSaveCookie }) {
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
        <ImpactSection />
        <PortfolioSection onOpenCase={onOpenCase} />
        <MapSection />
        <CriteriaSection />
        <ToolsSection onOpenTool={onOpenTool} />
        <QuotesSection />
        <PartnersSection />
        <KnowledgeSection onOpenArticle={onOpenArticle} onOpenTool={onOpenTool} />
        <NewsSection />
        <AboutSection />
        <LicensesSection />
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
  const [activeCase, setActiveCase] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [cookieChoice, setCookieChoice] = useState(() => {
    try { return window.localStorage.getItem('x-cookie-choice') || ''; } catch { return ''; }
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
      home: 'ایکس | سرمایه‌گذاری جسورانه', apply: 'درخواست سرمایه | ایکس', terms: 'قوانین و مقررات | ایکس',
      privacy: 'حریم خصوصی | ایکس', sitemap: 'نقشه‌ی سایت | ایکس', admin: 'پنل داخلی | ایکس', 'not-found': 'صفحه پیدا نشد | ایکس',
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
      if (event.key === 'Escape') { setActiveCase(null); setActiveArticle(null); setActiveTool(''); setMenuOpen(false); }
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  useEffect(() => {
    if (!activeCase && !activeArticle && !activeTool) return undefined;
    document.body.classList.add('has-modal');
    return () => document.body.classList.remove('has-modal');
  }, [activeCase, activeArticle, activeTool]);

  const openTool = useCallback((toolId) => { setActiveArticle(null); setActiveCase(null); setActiveTool(toolId); }, []);
  const openArticle = useCallback((article) => { setActiveTool(''); setActiveCase(null); setActiveArticle(article); }, []);
  const saveCookieChoice = (choice) => {
    setCookieChoice(choice);
    try { window.localStorage.setItem('x-cookie-choice', choice); } catch { /* Consent remains for this visit. */ }
  };
  const startApplication = () => { setActiveCase(null); setActiveArticle(null); setActiveTool(''); window.location.hash = 'apply'; };

  if (route === 'apply') return <ApplicationPage />;
  if (route === 'terms' || route === 'privacy') return <LegalPage type={route} />;
  if (route === 'sitemap') return <SiteMapPage />;
  if (route === 'admin') return <AdminPreview />;
  if (route === 'not-found') return <NotFoundPage />;

  const activeToolConfig = calculatorTools.find((tool) => tool.id === activeTool);
  const relatedArticle = activeToolConfig ? articles.find((article) => article.tool === activeToolConfig.id) || articles[0] : null;
  return (
    <>
      <HomePage onOpenTool={openTool} onOpenCase={setActiveCase} onOpenArticle={openArticle} menuOpen={menuOpen} setMenuOpen={setMenuOpen} cookieChoice={cookieChoice} onSaveCookie={saveCookieChoice} />
      {activeTool && <CalculatorLab toolId={activeTool} onClose={() => setActiveTool('')} onOpenArticle={() => openArticle(relatedArticle)} />}
      {activeCase && <PortfolioDetail item={activeCase} onClose={() => setActiveCase(null)} onStartApplication={startApplication} />}
      {activeArticle && <ArticleDetail article={activeArticle} onClose={() => setActiveArticle(null)} onOpenTool={openTool} />}
    </>
  );
}
