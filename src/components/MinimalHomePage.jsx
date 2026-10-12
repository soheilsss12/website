import { useEffect, useState } from 'react';
import { ArrowUpLeft, Menu, X } from 'lucide-react';
import { industries, valuePillars } from '../data/siteContent.js';
import ParsLogoMark from './ParsLogoMark.jsx';

const asset = (name) => `${import.meta.env.BASE_URL}${name}`;

const links = [
  { label: 'تصاویر', href: '#gallery' },
  { label: 'حوزه‌ها', href: '#industries' },
  { label: 'استراتژی', href: '#strategy' },
  { label: 'درباره‌ی پارس', href: '#about' },
];

function ParsBrand({ footer = false }) {
  return (
    <a className={`pars-brand ${footer ? 'pars-brand--footer' : ''}`} href="#home" aria-label="صفحه‌ی اصلی پارس">
      <ParsLogoMark decorative className="pars-brand-mark" />
      <span>پارس</span>
    </a>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="pars-header">
      <div className="pars-header-inner">
        <ParsBrand />
        <nav className={`pars-nav ${menuOpen ? 'is-open' : ''}`} id="pars-navigation" aria-label="منوی اصلی">
          {links.map((link) => (
            <a href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
          <a className="pars-nav-track" href="#track" onClick={() => setMenuOpen(false)}>پیگیری درخواست</a>
          <a className="pars-button pars-button--mobile" href="#apply" onClick={() => setMenuOpen(false)}>
            درخواست سرمایه <ArrowUpLeft size={16} />
          </a>
        </nav>
        <div className="pars-header-actions">
          <a className="pars-track-link" href="#track">پیگیری درخواست</a>
          <a className="pars-button pars-button--header" href="#apply">درخواست سرمایه <ArrowUpLeft size={16} /></a>
          <button
            className="pars-menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="pars-navigation"
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroPhotoStage() {
  return (
    <div className="pars-hero-visual" data-reveal>
      <span className="pars-hero-art-wash" aria-hidden="true" />
      <span className="pars-hero-pixel-field" aria-hidden="true" />
      <figure className="pars-hero-photo">
        <img src={asset('trust-prototype.webp')} alt="" fetchPriority="high" />
        <figcaption><span>فناوری</span><small>تصویر مفهومی</small></figcaption>
      </figure>
      <div className="pars-hero-logo-card" role="img" aria-label="نشان پارس">
        <span className="pars-logo-card-orbit" aria-hidden="true" />
        <ParsLogoMark animated decorative className="pars-hero-logo" />
      </div>
      <span className="pars-hero-art-dot pars-hero-art-dot--one" aria-hidden="true" />
      <span className="pars-hero-art-dot pars-hero-art-dot--two" aria-hidden="true" />
    </div>
  );
}

function PhotoGallery() {
  const photos = [
    { src: 'trust-growth.webp', label: 'زیرساخت', className: 'pars-photo-card--wide' },
    { src: 'crystal-environment.jpg', label: 'فضای فناوری', className: 'pars-photo-card--ambient' },
    { src: 'trust-dialogue.webp', label: 'فضای همکاری', className: 'pars-photo-card--portrait' },
  ];

  return (
    <section className="pars-section pars-gallery" id="gallery" aria-labelledby="pars-gallery-title">
      <div className="pars-gallery-heading" data-reveal>
        <div>
          <span className="pars-section-kicker">تصاویر مفهومی</span>
          <h2 id="pars-gallery-title">جایی برای ساختن</h2>
        </div>
        <span className="pars-gallery-index" aria-hidden="true">P / ۰۱</span>
      </div>
      <div className="pars-photo-grid">
        {photos.map((photo, index) => (
          <figure className={`pars-photo-card ${photo.className}`} key={photo.src} data-reveal>
            <img src={asset(photo.src)} alt="" loading="lazy" />
            <figcaption><span>{photo.label}</span><i aria-hidden="true" /><small>۰{index + 1}</small></figcaption>
          </figure>
        ))}
        <div className="pars-photo-note" data-reveal>
          <ParsLogoMark decorative className="pars-photo-note-mark" />
          <span>از ایده<br />تا اثر</span>
        </div>
      </div>
    </section>
  );
}

function IndustryGrid() {
  return (
    <section className="pars-section pars-industries" id="industries" aria-labelledby="pars-industries-title">
      <div className="pars-section-heading" data-reveal>
        <div>
          <span className="pars-section-kicker">حوزه‌های منتخب</span>
          <h2 id="pars-industries-title">جایی که فناوری<br /><em>اثر می‌گذارد</em></h2>
        </div>
        <span className="pars-heading-note">سرمایه‌گذاری روی مسئله‌های واقعی</span>
      </div>
      <div className="pars-industry-grid">
        {industries.map((industry) => {
          const Icon = industry.icon;
          return (
            <a className="pars-industry-card" href="#apply" key={industry.title} data-reveal>
              <span className="pars-industry-icon"><Icon size={22} strokeWidth={1.55} /></span>
              <strong>{industry.title}</strong>
              <ArrowUpLeft className="pars-industry-arrow" size={17} aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

function StrategySection() {
  return (
    <section className="pars-strategy" id="strategy" aria-labelledby="pars-strategy-title">
      <div className="pars-strategy-head" data-reveal>
        <span className="pars-section-kicker">رویکرد پارس</span>
        <h2 id="pars-strategy-title">سرمایه، همراهِ<br /><em>مسیر رشد</em></h2>
        <ParsLogoMark decorative className="pars-strategy-mark" />
      </div>
      <div className="pars-strategy-grid">
        {valuePillars.slice(0, 4).map((item, index) => {
          const Icon = item.icon;
          return (
            <article className="pars-strategy-card" key={item.number} data-reveal>
              <span className="pars-strategy-count">۰{index + 1}</span>
              <span className="pars-strategy-icon"><Icon size={22} strokeWidth={1.5} /></span>
              <h3>{item.title}</h3>
              <i className="pars-strategy-rule" aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AboutPars() {
  return (
    <section className="pars-about" id="about" aria-labelledby="pars-about-title">
      <div className="pars-about-copy" data-reveal>
        <span className="pars-section-kicker">درباره‌ی پارس</span>
        <h2 id="pars-about-title">همراهِ ایده‌های<br /><em>موفق</em></h2>
        <div className="pars-facts" aria-label="پارس در یک نگاه">
          <div className="pars-fact"><strong>۱۱</strong><span>بازوی سرمایه‌گذاری</span></div>
          <div className="pars-fact"><strong>ده‌ها</strong><span>شرکت زیرمجموعه</span></div>
        </div>
      </div>
      <div className="pars-about-mark" data-reveal>
        <span className="pars-about-mark-wash" aria-hidden="true" />
        <ParsLogoMark decorative className="pars-about-logo" />
      </div>
    </section>
  );
}

export default function MinimalHomePage() {
  useEffect(() => {
    const targets = document.querySelectorAll('.pars-home [data-reveal]');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pars-home" dir="rtl">
      <SiteHeader />
      <main>
        <section className="pars-hero pars-container" id="home" aria-labelledby="pars-hero-title">
          <div className="pars-hero-copy" data-reveal>
            <span className="pars-hero-kicker"><i aria-hidden="true" /> گروه سرمایه‌گذاری فناوری پارس</span>
            <h1 id="pars-hero-title">سرمایه برای<br /><em>ایده‌های موفق</em></h1>
            <p className="pars-hero-subtitle">از ایده‌های جسورانه تا کسب‌وکارهای رو به رشد</p>
            <div className="pars-hero-actions">
              <a className="pars-button pars-button--large" href="#apply">درخواست سرمایه <ArrowUpLeft size={19} /></a>
              <a className="pars-text-link" href="#track">پیگیری درخواست <ArrowUpLeft size={15} /></a>
            </div>
            <span className="pars-hero-footnote"><i aria-hidden="true" /> همراهِ مسیرِ رشد</span>
          </div>
          <HeroPhotoStage />
        </section>

        <PhotoGallery />
        <IndustryGrid />
        <StrategySection />
        <AboutPars />

        <section className="pars-final pars-container" aria-labelledby="pars-final-title" data-reveal>
          <div className="pars-final-mark"><ParsLogoMark decorative className="pars-final-logo" /></div>
          <div>
            <span className="pars-section-kicker">قدم بعدی</span>
            <h2 id="pars-final-title">آماده‌ی شروعید؟</h2>
          </div>
          <a className="pars-button pars-button--large" href="#apply">شروع درخواست <ArrowUpLeft size={18} /></a>
        </section>
      </main>
      <footer className="pars-footer">
        <div className="pars-footer-inner pars-container">
          <ParsBrand footer />
          <div className="pars-footer-links">
            <a href="#track">پیگیری درخواست</a>
            <a href="#privacy">حریم خصوصی</a>
            <a href="#terms">قوانین</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
