import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUpLeft,
  ArrowUpRight,
  Banknote,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  FileCheck2,
  Globe2,
  Gauge,
  HeartHandshake,
  Landmark,
  LineChart,
  Link2,
  MapPin,
  Network,
  PieChart,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import {
  articles,
  faqItems,
  industries,
  partnerCategories,
  pendingMetrics,
  portfolioCases,
  processSteps,
  sampleQuotes,
  stageOptions,
  valuePillars,
} from '../data/siteContent.js';

const faNumber = (value) => new Intl.NumberFormat('fa-IR').format(value);

function SectionEyebrow({ index, children, light = false }) {
  return <div className={`section-eyebrow ${light ? 'is-light' : ''}`}><span>{index}</span><i />{children}</div>;
}

function SectionHeading({ index, eyebrow, title, emphasis, copy, light = false, className = '' }) {
  return (
    <div className={`section-heading ${light ? 'is-light' : ''} ${className}`} data-reveal>
      <SectionEyebrow index={index} light={light}>{eyebrow}</SectionEyebrow>
      <h2>{title}{emphasis && <> <em>{emphasis}</em></>}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function XGlyph({ className = '' }) {
  return <span className={`x-glyph ${className}`} aria-hidden="true"><i /><i /></span>;
}

function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual-grid" />
      <div className="hero-halo hero-halo-one" />
      <div className="hero-halo hero-halo-two" />
      <svg className="hero-network-svg" viewBox="0 0 700 680" fill="none">
        <defs>
          <linearGradient id="orbit-stroke" x1="130" y1="104" x2="603" y2="568" gradientUnits="userSpaceOnUse"><stop stopColor="#D7FF76" stopOpacity=".8"/><stop offset="1" stopColor="#D7FF76" stopOpacity=".04"/></linearGradient>
          <radialGradient id="core-glow"><stop stopColor="#CBFF62" stopOpacity=".37"/><stop offset="1" stopColor="#CBFF62" stopOpacity="0"/></radialGradient>
        </defs>
        <ellipse cx="350" cy="340" rx="276" ry="184" transform="rotate(-27 350 340)" stroke="url(#orbit-stroke)" strokeDasharray="2 12" />
        <ellipse cx="350" cy="340" rx="226" ry="294" transform="rotate(34 350 340)" stroke="#F4F1E6" strokeOpacity=".12" />
        <ellipse cx="350" cy="340" rx="166" ry="166" stroke="#D7FF76" strokeOpacity=".26" />
        <path d="M91 468 222 403l113 73 140-204 122 66M176 193l156 87 139-97 118 41" stroke="#D7FF76" strokeOpacity=".27" strokeWidth="1" />
        <circle cx="222" cy="403" r="5" fill="#D7FF76"/><circle cx="335" cy="476" r="6" fill="#D7FF76"/><circle cx="475" cy="272" r="5" fill="#D7FF76"/><circle cx="597" cy="338" r="4" fill="#E58D63"/><circle cx="176" cy="193" r="4" fill="#E58D63"/><circle cx="471" cy="183" r="5" fill="#D7FF76"/>
        <circle cx="350" cy="340" r="138" fill="url(#core-glow)" />
        <path d="M350 81v114M350 485v111M92 340h108M500 340h110" stroke="#F1EEE4" strokeOpacity=".12" />
      </svg>
      <div className="hero-core"><div className="hero-core-orbit" /><XGlyph className="hero-x" /><span>ایکس / سرمایه</span></div>
      <div className="hero-float-card hero-float-card-top"><span className="float-card-icon"><ChartNoAxesCombined size={16} /></span><span><small>مسیر همراهی</small><strong>از ایده تا رشد</strong></span><i className="float-live-dot" /></div>
      <div className="hero-float-card hero-float-card-bottom"><span className="float-card-signal"><Network size={15} /></span><span><small>سرمایه فقط آغاز است</small><strong>شبکه · تجربه · بازار</strong></span></div>
      <div className="hero-coordinate">۳۵°۴۱′ شمالی <i /> ۵۱°۲۵′ شرقی</div>
      <div className="hero-visual-caption"><span>سرمایه‌ی هوشمند</span><span>همراهی واقعی</span></div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-layout site-container">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="signal-dot" /> سرمایه‌گذاری جسورانه، با نگاه همراه</div>
          <h1 id="hero-title">آینده را<br /><em>با هم می‌سازیم.</em></h1>
          <p className="hero-description">ایکس در کنار تیم‌هایی می‌ایستد که برای حل مسئله‌های واقعی، محصول می‌سازند؛ با سرمایه، شبکه و همراهی در مسیر رشد.</p>
          <div className="hero-actions">
            <a className="button button-lime button-large" href="#apply">شروع درخواست سرمایه <ArrowUpLeft size={17} /></a>
            <a className="button button-outline button-large" href="#approach">رویکرد ایکس <ArrowDown size={15} /></a>
          </div>
          <div className="hero-status-line"><span className="status-pill status-pending"><i /> وضعیت دوره: در انتظار اعلام رسمی</span><span className="hero-status-note">شرایط هر فراخوان پیش از شروع ثبت‌نام منتشر می‌شود.</span></div>
        </div>
        <HeroVisual />
      </div>
      <div className="hero-bottomline site-container"><span>از ایده تا رشد، کنار تیم‌های بلندپرواز</span><a href="#industries">حوزه‌های سرمایه‌گذاری <ArrowDown size={14} /></a><span className="hero-bottom-index">X / ۰۱</span></div>
    </section>
  );
}

export function StatsRibbon() {
  const stats = [
    { value: '۰۸', title: 'حوزه‌ی فناوری', note: 'مسیرهای مسئله‌محور', icon: Compass },
    { value: '۰۴', title: 'مرحله‌ی رشد', note: 'از ایده تا مقیاس', icon: ChartNoAxesCombined },
    { value: '۰۸', title: 'مزیت همراهی', note: 'فراتر از سرمایه', icon: HeartHandshake },
  ];
  return (
    <section className="stats-ribbon site-container" aria-label="چارچوب همکاری ایکس">
      <div className="stats-ribbon-label"><span className="signal-dot" /> چارچوب همکاری ایکس</div>
      <div className="stats-ribbon-items">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return <div className="stats-ribbon-item" key={item.title} data-reveal><span className="stats-number">{item.value}</span><span className="stats-copy"><strong>{item.title}</strong><small>{item.note}</small></span><Icon size={20} strokeWidth={1.45} /><i className="stats-ribbon-divider" />{index < stats.length - 1 && <span className="stats-mobile-separator" />}</div>;
        })}
      </div>
    </section>
  );
}

export function ManifestoSection() {
  return (
    <section className="manifesto-section" id="manifesto">
      <div className="manifesto-inner site-container">
        <div className="manifesto-aside" data-reveal><span>نگاه ایکس</span><span className="manifesto-asterisk">✳</span><small>سرمایه، وقتی معنا دارد<br />که به رشد واقعی برسد.</small></div>
        <div className="manifesto-copy" data-reveal>
          <SectionEyebrow index="۰۱">مانیفست ما</SectionEyebrow>
          <h2>سرمایه فقط پول نیست؛<br /> <em>شتاب‌دهنده‌ی اثر است.</em></h2>
          <p>ما باور داریم کسب‌وکارهای ماندگار با یک تصمیم ساخته نمی‌شوند. سرمایه باید کنار تجربه، ارتباط و پاسخ‌گویی قرار بگیرد تا تیم‌ها بتوانند مسئله‌های مهم را به محصول‌هایی پایدار تبدیل کنند.</p>
          <a href="#approach" className="text-link text-link-dark">فلسفه‌ی سرمایه‌گذاری ایکس <ArrowUpLeft size={16} /></a>
        </div>
        <div className="manifesto-mark" aria-hidden="true"><XGlyph /><span>ایکس / سرمایه‌گذاری جسورانه</span></div>
      </div>
    </section>
  );
}

export function IndustriesSection() {
  return (
    <section className="industries-section section-space" id="industries">
      <div className="site-container">
        <div className="section-heading-row">
          <SectionHeading index="۰۲" eyebrow="حوزه‌های تمرکز" title="جایی برای ایده‌های" emphasis="جسورانه." copy="هشت مسیر فناوری که در آن‌ها به‌دنبال تیم‌های مسئله‌محور و بازارهای رو به رشد هستیم." />
          <span className="heading-side-note">حوزه‌ها، اولویت و شرایط پذیرش در هر فراخوان به‌روزرسانی می‌شوند.</span>
        </div>
        <div className="industry-grid">
          {industries.map((item) => {
            const Icon = item.icon;
            return (
              <a href="#approach" className={`industry-card tone-${item.tone}`} key={item.number} data-reveal>
                <span className="industry-card-top"><span>{item.number}</span><Icon size={21} strokeWidth={1.45} /></span>
                <span className="industry-card-english" dir="ltr">{item.english}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span className="industry-card-arrow"><ArrowUpLeft size={16} /></span>
              </a>
            );
          })}
        </div>
        <div className="industry-footnote"><span className="footnote-line" /><span>تناسب هر طرح با اولویت‌های دوره‌ی جاری بررسی می‌شود.</span><a href="#apply">بررسی شرایط <ArrowUpLeft size={14} /></a></div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="benefits-section section-space" id="benefits">
      <div className="site-container benefits-layout">
        <div className="benefits-intro">
          <SectionHeading index="۰۳" eyebrow="بیشتر از سرمایه" title="ارزش، در" emphasis="همراهی است." copy="هر تیم به چیزی متفاوت نیاز دارد. ما مسیر همکاری را حول گلوگاه واقعی رشد طراحی می‌کنیم." light />
          <div className="benefits-statement"><XGlyph /><p>سرمایه‌ی مالی<br />به‌اضافه‌ی <em>سرمایه‌ی رابطه.</em></p></div>
          <a href="#approach" className="button button-outline-light">همه‌ی مزیت‌های همراهی <ArrowUpLeft size={16} /></a>
        </div>
        <div className="benefits-grid">
          {valuePillars.map((item) => {
            const Icon = item.icon;
            return <article className="benefit-card" key={item.number} data-reveal><span className="benefit-number">{item.number}</span><Icon size={22} strokeWidth={1.35} /><h3>{item.title}</h3><p>{item.description}</p><span className="benefit-card-line" /></article>;
          })}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="process-section section-space" id="process">
      <div className="site-container">
        <div className="section-heading-row process-heading-row">
          <SectionHeading index="۰۴" eyebrow="مسیر سرمایه‌گذاری" title="شفاف از اولین" emphasis="گفت‌وگو." copy="برای هر مرحله می‌دانید چه چیزی بررسی می‌شود و قدم بعدی چیست." />
          <div className="process-time-note"><Clock3 size={18} /><span>زمان‌بندی دقیق در اطلاعیه‌ی هر دوره اعلام می‌شود.</span></div>
        </div>
        <div className="process-timeline">
          <div className="process-timeline-line"><i /></div>
          {processSteps.map((step, index) => <article className="process-step" key={step.number} data-reveal><span className="process-node"><i /></span><span className="process-step-number">{step.number} / ۰۵</span><h3>{step.title}</h3><p>{step.description}</p><span className="process-step-duration">{index === 0 ? 'شروع مسیر' : index === processSteps.length - 1 ? 'همراهی مستمر' : 'زمان‌بندی دوره‌ای'}</span></article>)}
        </div>
        <div className="process-cta"><span>آماده‌ی گفت‌وگوی اول هستید؟</span><a href="#apply" className="button button-dark">شروع درخواست <ArrowUpLeft size={16} /></a></div>
      </div>
    </section>
  );
}

export function ImpactSection() {
  return (
    <section className="impact-section section-space" id="impact">
      <div className="impact-geometry" aria-hidden="true"><span /><span /><span /></div>
      <div className="site-container impact-layout">
        <div className="impact-intro" data-reveal><SectionEyebrow index="۰۵" light>اثر در مقیاس</SectionEyebrow><h2>اعداد، وقتی<br /><em>داستان دارند.</em></h2><p>داده‌های رسمی شرکت در این بخش نمایش داده می‌شوند؛ تا زمان تأیید، عددی جایگزین نشده است.</p><span className="impact-honesty"><ShieldCheck size={15} /> شفافیت، پیش‌شرط اعتماد است.</span></div>
        <div className="impact-grid">
          {pendingMetrics.map((metric, index) => <article className="impact-metric" key={metric.label} data-reveal><span className="impact-metric-number">{metric.value}</span><span className="impact-metric-label">{metric.label}</span><span className="impact-metric-note">عدد رسمی پس از تأیید درج می‌شود</span><i>۰{index + 1}</i></article>)}
        </div>
      </div>
    </section>
  );
}

export function PortfolioSection({ onOpenCase }) {
  const [sector, setSector] = useState('همه‌ی حوزه‌ها');
  const [stage, setStage] = useState('همه‌ی مراحل');
  const [year, setYear] = useState('همه‌ی سال‌ها');
  const [city, setCity] = useState('همه‌ی شهرها');
  const filtered = useMemo(() => portfolioCases.filter((item) => (sector === 'همه‌ی حوزه‌ها' || item.sector === sector) && (stage === 'همه‌ی مراحل' || item.stage === stage) && (year === 'همه‌ی سال‌ها' || item.year === year) && (city === 'همه‌ی شهرها' || item.city === city)), [sector, stage, year, city]);
  return (
    <section className="portfolio-section section-space" id="portfolio">
      <div className="site-container">
        <div className="section-heading-row portfolio-heading-row"><SectionHeading index="۰۶" eyebrow="پرتفوی ایکس" title="همراهی، در" emphasis="دنیای واقعی." copy="هر پروفایل، داستان تیمی است که با مسئله‌ای واقعی روبه‌رو شده و برای رشد آماده است." /><span className="sample-disclosure"><Sparkles size={15} /> کارت‌ها نمونه‌ی طراحی هستند؛ اطلاعات پرتفوی واقعی جایگزین می‌شود.</span></div>
        <div className="portfolio-toolbar" aria-label="فیلتر شرکت‌ها">
          <span className="portfolio-result-count">{faNumber(filtered.length)} پرونده‌ی نمونه</span>
          <div className="portfolio-filters">
            <label><span className="sr-only">فیلتر حوزه</span><select value={sector} onChange={(event) => setSector(event.target.value)}><option>همه‌ی حوزه‌ها</option>{industries.map((item) => <option key={item.title}>{item.title}</option>)}</select><ChevronDown size={13} /></label>
            <label><span className="sr-only">فیلتر مرحله</span><select value={stage} onChange={(event) => setStage(event.target.value)}><option>همه‌ی مراحل</option>{stageOptions.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label>
            <label><span className="sr-only">فیلتر سال</span><select value={year} onChange={(event) => setYear(event.target.value)}><option>همه‌ی سال‌ها</option><option>—</option></select><ChevronDown size={13} /></label>
            <label><span className="sr-only">فیلتر شهر</span><select value={city} onChange={(event) => setCity(event.target.value)}><option>همه‌ی شهرها</option><option>—</option></select><ChevronDown size={13} /></label>
          </div>
        </div>
        {filtered.length ? <div className="portfolio-grid">{filtered.map((item) => {
          const Icon = item.icon;
          return <button type="button" className={`portfolio-card ${item.tone}`} key={item.id} onClick={() => onOpenCase(item)} data-reveal>
            <span className="portfolio-card-art"><span className="portfolio-art-circle" /><span className="portfolio-art-grid" /><Icon size={46} strokeWidth={1.15} /><i className="portfolio-card-number">{item.id}</i><span className="portfolio-card-demo-tag">نمونه‌ی طراحی</span></span>
            <span className="portfolio-card-content"><span className="portfolio-card-meta"><span>{item.sector}</span><span>{item.stage}</span></span><strong>{item.title}</strong><span className="portfolio-card-copy">{item.description}</span><span className="portfolio-card-link">مشاهده‌ی پرونده‌ی نمونه <ArrowUpLeft size={15} /></span></span>
          </button>;
        })}</div> : <div className="empty-state"><CircleHelp size={22} /><p>با این فیلتر، پرونده‌ای پیدا نشد.</p><button type="button" onClick={() => { setSector('همه‌ی حوزه‌ها'); setStage('همه‌ی مراحل'); setYear('همه‌ی سال‌ها'); setCity('همه‌ی شهرها'); }}>پاک‌کردن فیلترها</button></div>}
        <div className="portfolio-bottomline"><span>داده‌های سال، شهر و شاخص‌ها پس از تأیید تیم درج می‌شوند.</span><a href="#apply" className="text-link">شاید پرونده‌ی بعدی، شما باشید <ArrowUpLeft size={16} /></a></div>
      </div>
    </section>
  );
}

export function MapSection() {
  return (
    <section className="map-section section-space" id="map">
      <div className="site-container map-layout">
        <div className="map-copy"><SectionHeading index="۰۷" eyebrow="گستره‌ی جغرافیایی" title="ایده‌های بزرگ،" emphasis="مرز نمی‌شناسند." copy="محدوده‌ی پذیرش و شهرهای فعال در هر دوره، در اطلاعیه‌ی رسمی همان کمپین مشخص می‌شود." /><div className="map-note-card"><Globe2 size={20} /><span><strong>پوشش دوره‌ای</strong><small>شهرهای تأییدشده پس از اعلام شرایط نمایش داده می‌شوند.</small></span></div><a href="#apply" className="text-link">دیدن شرایط فراخوان <ArrowUpLeft size={16} /></a></div>
        <div className="map-art-card" data-reveal>
          <div className="map-card-head"><span><MapPin size={15} /> نقشه‌ی همکاری</span><span className="map-sample-tag">نمایش نمونه</span></div>
          <svg className="iran-map" viewBox="0 0 460 410" role="img" aria-label="نمای گرافیکی ایران با نقاط شبکه‌ی سرمایه‌گذاری">
            <defs><linearGradient id="iranFill" x1="90" y1="30" x2="360" y2="355" gradientUnits="userSpaceOnUse"><stop stopColor="#D7FF76" stopOpacity=".2"/><stop offset="1" stopColor="#D7FF76" stopOpacity=".015"/></linearGradient><filter id="mapGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
            <path className="iran-outline" d="M117 26 158 32 184 17 216 30 243 24 269 42 300 39 316 60 348 67 355 95 386 115 375 144 395 169 372 196 384 223 358 247 352 278 329 297 309 330 281 346 255 329 230 350 207 333 179 342 159 320 132 310 122 281 99 266 84 238 64 217 70 190 53 169 65 145 58 121 78 99 80 71 101 52Z" fill="url(#iranFill)" stroke="#d7ff76" strokeOpacity=".62" strokeWidth="1.4" />
            <path d="M111 80 184 122l81-29 76 37M83 177l88-7 60 66 78-43 59 29M130 280l87-44 52 93M184 122l-13 48m94-77 3 118m76-81-37 81" stroke="#e8e5da" strokeOpacity=".15" strokeDasharray="3 7" />
            <g filter="url(#mapGlow)"><circle cx="253" cy="139" r="5" fill="#e8ffb2"/><circle cx="229" cy="236" r="4" fill="#e58d63"/><circle cx="331" cy="129" r="4" fill="#d7ff76"/><circle cx="183" cy="269" r="4" fill="#d7ff76"/><circle cx="158" cy="127" r="3" fill="#e58d63"/></g>
            <circle className="map-pulse" cx="253" cy="139" r="14" stroke="#d7ff76" strokeOpacity=".6" />
          </svg>
          <div className="map-legend"><span><i className="legend-lime" /> نمونه‌ی نقاط شبکه</span><span>اطلاعات واقعی پس از تأیید</span></div>
          <div className="map-coordinate">ایران / شبکه‌ی فرصت‌ها</div>
        </div>
      </div>
    </section>
  );
}

export function CriteriaSection() {
  const criteria = [
    { icon: Sparkles, title: 'حوزه‌های مورد پذیرش', value: '۸ حوزه‌ی فناوری', note: 'اولویت دقیق در اطلاعیه‌ی هر دوره' },
    { icon: Banknote, title: 'نوع و بازه‌ی سرمایه', value: 'اعلام در کمپین', note: 'حداقل و حداکثر پس از تأیید منتشر می‌شود' },
    { icon: ChartNoAxesCombined, title: 'مرحله‌ی کسب‌وکار', value: 'ایده تا رشد', note: 'تناسب با اولویت دوره بررسی می‌شود' },
    { icon: UsersRound, title: 'اندازه‌ی تیم', value: 'در حال تعیین', note: 'شرط نهایی در فراخوان درج می‌شود' },
    { icon: MapPin, title: 'محدوده‌ی جغرافیایی', value: 'دوره‌محور', note: 'شهرهای مجاز در اطلاعیه مشخص می‌شوند' },
    { icon: ShieldCheck, title: 'اولویت‌ها و Red Flagها', value: 'بررسی شفاف', note: 'فهرست قطعی پس از تأیید تیم منتشر می‌شود' },
  ];
  const redFlags = ['مسئله یا مشتری هدف نامشخص', 'ادعاهای بدون پشتوانه‌ی داده', 'تیم بدون تعهد یا نقش‌های روشن', 'ابهام در مالکیت فکری و حقوقی'];
  return (
    <section className="criteria-section section-space" id="approach">
      <div className="site-container">
        <div className="criteria-intro-row"><SectionHeading index="۰۸" eyebrow="رویکرد و معیارها" title="شفافیت، قبل از" emphasis="سرمایه‌گذاری." copy="چه چیزی را بررسی می‌کنیم، چه چیزی را هنوز باید اعلام کنیم و چرا؛ همه‌چیز روشن و بی‌وعده‌ی مبهم." /><div className="criteria-side-note"><span className="criteria-side-mark">X</span><p>شرایط قطعی فقط از مسیر اطلاعیه‌ی رسمی هر دوره اعلام خواهد شد.</p></div></div>
        <div className="criteria-grid">{criteria.map((item, index) => {
          const Icon = item.icon;
          return <article className="criteria-card" key={item.title} data-reveal><span className="criteria-card-index">۰{index + 1}</span><Icon size={20} /><small>{item.title}</small><strong>{item.value}</strong><p>{item.note}</p></article>;
        })}</div>
        <div className="criteria-details-grid">
          <div className="priority-panel"><span className="eyebrow">اولویت‌های سرمایه‌گذاری</span><h3>بازار بزرگ،<br /><em>تیم متعهد، مسئله‌ی روشن.</em></h3><p>این‌ها نقطه‌ی شروع ارزیابی‌اند، نه تضمین پذیرش. اولویت‌های دوره پس از نهایی‌شدن در کمپین اعلام می‌شوند.</p><div className="priority-pills">{['اندازه‌ی فرصت', 'تناسب مسئله و راهکار', 'سرعت یادگیری', 'پتانسیل مقیاس'].map((item) => <span key={item}>{item}</span>)}</div><a href="#industries" className="text-link">هشت حوزه‌ی فناوری <ArrowUpLeft size={15} /></a></div>
          <div className="redflags-panel"><span className="eyebrow"><ShieldCheck size={14} /> ارزیابی مسئولانه</span><h3>چه چیزهایی<br /><em>نگران‌مان می‌کند؟</em></h3><p>این فهرست، نمونه‌های رایج برای گفت‌وگوی اولیه است و جایگزین معیارهای رسمی شرکت نیست.</p><ul>{redFlags.map((item) => <li key={item}><span><X size={12} /></span>{item}</li>)}</ul></div>
        </div>
        <div className="faq-block" id="faq"><div className="faq-heading"><SectionEyebrow index="۰۹">پرسش‌های پرتکرار</SectionEyebrow><h3>قبل از شروع،<br /><em>اگر سؤالی دارید.</em></h3><a href="#contact" className="text-link">پرسش دیگری دارید؟ <ArrowUpLeft size={14} /></a></div><div className="faq-list">{faqItems.map((item, index) => <details className="faq-item" key={item.question} data-reveal><summary><span>{item.question}</span><i>{faNumber(index + 1)}</i><ChevronDown size={17} /></summary><p>{item.answer}</p></details>)}</div></div>
      </div>
    </section>
  );
}

export function ToolsSection({ onOpenTool }) {
  const tools = [
    { id: 'valuation', code: '۰۱', title: 'ارزش‌گذاری استارتاپ', description: 'مبلغ جذب و سهم پیشنهادی را به یک برآورد تبدیل کنید.', icon: ChartNoAxesCombined, tag: 'ارزش‌گذاری' },
    { id: 'runway', code: '۰۲', title: 'Runway', description: 'زمان باقی‌مانده با نقدینگی و هزینه‌ی فعلی.', icon: Activity, tag: 'مدیریت نقدینگی' },
    { id: 'dilution', code: '۰۳', title: 'رقیق‌شدن سهام', description: 'اثر جذب سرمایه بر سهم بنیان‌گذاران.', icon: PieChart, tag: 'سهام‌داری' },
    { id: 'captable', code: '۰۴', title: 'Cap Table', description: 'ساختار سهام‌داری پیش و پس از دور جدید.', icon: WalletCards, tag: 'سهم‌داران' },
    { id: 'cac', code: '۰۵', title: 'CAC', description: 'هزینه‌ی جذب هر مشتری جدید.', icon: Gauge, tag: 'اقتصاد واحد' },
    { id: 'ltv', code: '۰۶', title: 'LTV', description: 'ارزش تقریبی مشتری در طول رابطه.', icon: LineChart, tag: 'درآمد' },
    { id: 'saas', code: '۰۷', title: 'شاخص‌های SaaS', description: 'درآمد تکرارشونده و نرخ رشد ماهانه.', icon: BarChart3, tag: 'درآمد تکرارشونده' },
    { id: 'maturity', code: '۰۸', title: 'سنجش آمادگی', description: 'چک‌لیست کوتاه بلوغ و آمادگی تیم.', icon: Sparkles, tag: 'ارزیابی تیم' },
  ];
  return (
    <section className="tools-section section-space" id="tools">
      <div className="site-container">
        <div className="section-heading-row"><SectionHeading index="۱۰" eyebrow="آزمایشگاه ابزارها" title="تصمیم بهتر، با" emphasis="عدد روشن." copy="محاسبه‌گرهای ساده برای سؤال‌هایی که پیش از رشد، جذب سرمایه یا مذاکره پیش می‌آیند." /><div className="tools-data-note"><ShieldCheck size={18} /><span>محاسبه‌ها در همین مرورگر انجام می‌شوند؛ هیچ ورودی به سرور نمی‌رود.</span></div></div>
        <div className="tools-grid">{tools.map((tool) => {
          const Icon = tool.icon;
          return <button type="button" className="tool-card" key={tool.id} onClick={() => onOpenTool(tool.id)} data-reveal><span className="tool-card-top"><span>{tool.code} / ۰۸</span><Icon size={21} strokeWidth={1.5} /></span><span className="tool-card-tag">{tool.tag}</span><strong>{tool.title}</strong><p>{tool.description}</p><span className="tool-card-action">بازکردن ابزار <ArrowUpLeft size={15} /></span></button>;
        })}</div>
        <div className="tools-bottom"><span>ابزارها برای آگاهی‌اند، نه پیش‌بینی قطعی آینده.</span><a href="#knowledge" className="text-link">دانش‌نامه‌ی مالی و رشد <ArrowUpLeft size={15} /></a></div>
      </div>
    </section>
  );
}

export function QuotesSection() {
  return (
    <section className="quotes-section section-space" id="voices">
      <div className="site-container quotes-layout"><div className="quotes-intro"><SectionHeading index="۱۱" eyebrow="صدای بنیان‌گذاران" title="همکاری را،" emphasis="از نگاه آن‌ها ببینید." copy="تجربه‌ی واقعی تیم‌ها مهم‌تر از هر ادعایی است؛ نقل‌قول‌ها پس از تأیید بنیان‌گذاران منتشر می‌شوند." light /><span className="sample-disclosure sample-disclosure-light"><Sparkles size={14} /> متن‌های این کارت‌ها نمونه‌ی طراحی‌اند.</span></div><div className="quotes-grid">{sampleQuotes.map((item, index) => <article className="quote-card" key={item.initials} data-reveal><span className="quote-mark">“</span><p>{item.quote}</p><div className="quote-attribution"><span className="quote-avatar">{item.initials}</span><span><strong>{item.role}</strong><small>نمونه‌ی متن؛ جایگزین با نقل‌قول واقعی</small></span><span className="quote-card-index">۰{index + 1}</span></div></article>)}</div></div>
    </section>
  );
}

export function PartnersSection() {
  return (
    <section className="partners-section section-space" id="partners">
      <div className="site-container"><div className="partners-top"><SectionHeading index="۱۲" eyebrow="شبکه‌ی همکاران" title="رشد، کارِ" emphasis="یک شبکه است." copy="همکاری‌های راهبردی با نهادهای مالی، مراکز فناوری و جامعه‌ی کارآفرینی." /><span className="partners-disclosure">دسته‌بندی‌های پیشنهادی در سند مبنا<br />نام شرکای تأییدشده بعداً درج می‌شود.</span></div><div className="partners-ticker"><div className="partners-list">{partnerCategories.map((item, index) => {
        const Icon = item.icon;
        return <div className="partner-pill" key={item.title} data-reveal><span className="partner-pill-index">۰{index + 1}</span><Icon size={20} strokeWidth={1.45} /><strong>{item.title}</strong><span className="partner-pill-status">شبکه‌ی همکاری</span></div>;
      })}</div></div><a href="#contact" className="text-link">پیشنهاد همکاری دارید؟ <ArrowUpLeft size={15} /></a></div>
    </section>
  );
}

export function KnowledgeSection({ onOpenArticle, onOpenTool }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('همه');
  const categories = ['همه', ...new Set(articles.map((item) => item.category))];
  const results = articles.filter((item) => (category === 'همه' || item.category === category) && `${item.title} ${item.excerpt} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <section className="knowledge-section section-space" id="knowledge">
      <div className="site-container">
        <div className="knowledge-heading-row"><SectionHeading index="۱۳" eyebrow="مرکز دانش" title="دانش را،" emphasis="با هم گسترش می‌دهیم." copy="راهنماهای کوتاه برای تصمیم‌های مهم در مسیر ساخت و رشد یک کسب‌وکار." /><a href="#news" className="button button-outline">خبرها و رویدادها <ArrowUpLeft size={15} /></a></div>
        <div className="knowledge-tools"><div className="knowledge-search"><Search size={17} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجو در مقاله‌ها..." aria-label="جست‌وجو در مقاله‌ها" /></div><div className="knowledge-categories" role="group" aria-label="دسته‌بندی مقاله‌ها">{categories.map((item) => <button type="button" className={category === item ? 'is-active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
        {results.length ? <div className="articles-grid">{results.map((item, index) => <article className="article-card" key={item.id} data-reveal><div className={`article-art article-art-${index + 1}`}><BookOpen size={28} strokeWidth={1.3} /><span>{item.id.toUpperCase()} / یادداشت ایکس</span><i /></div><div className="article-card-content"><div className="article-meta"><span>{item.category}</span><span><Clock3 size={13} /> {item.readTime}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><div className="article-actions"><button type="button" className="text-link" onClick={() => onOpenArticle(item)}>خواندن مقاله <ArrowUpLeft size={15} /></button><button type="button" className="article-tool-link" onClick={() => onOpenTool(item.tool)}>ابزار مرتبط <ArrowUpLeft size={13} /></button></div></div></article>)}</div> : <div className="empty-state"><Search size={20} /><p>مقاله‌ای با این عبارت پیدا نشد.</p></div>}
        <div className="knowledge-disclosure"><span>مقاله‌ها در این نمونه‌ی طراحی، محتوای آموزشی پیشنهادی هستند.</span><span>موضوع‌های تازه به‌صورت پیوسته اضافه می‌شوند.</span></div>
      </div>
    </section>
  );
}

export function NewsSection() {
  const [tab, setTab] = useState('اخبار ایکس');
  const tabs = ['اخبار ایکس', 'رسانه‌ها درباره‌ی ما', 'رویدادها و فراخوان‌ها'];
  return (
    <section className="news-section section-space" id="news">
      <div className="site-container"><div className="section-heading-row"><SectionHeading index="۱۴" eyebrow="خبر و رویداد" title="در جریانِ" emphasis="اتفاق‌های مهم بمانید." copy="خبرهای شرکت، پوشش رسانه‌ای، رویدادها و فراخوان‌ها در یک‌جا." /><a href="#apply" className="text-link">اطلاعیه‌ی کمپین <ArrowUpLeft size={15} /></a></div><div className="news-tabs" role="tablist">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'is-active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div><div className="news-empty"><div className="news-empty-icon"><CalendarDays size={24} /></div><div><span className="eyebrow">{tab}</span><h3>خبر تازه‌ای برای انتشار نداریم.</h3><p>اطلاعات تأییدشده‌ی این بخش پس از آماده‌شدن محتوا منتشر می‌شود. برای اطلاع از وضعیت پذیرش، صفحه‌ی کمپین را ببینید.</p></div><a href="#apply" className="button button-outline">رفتن به صفحه‌ی کمپین <ArrowUpLeft size={14} /></a></div></div>
    </section>
  );
}

export function AboutSection() {
  const values = [
    { title: 'شفافیت', description: 'گفت‌وگوی صریح درباره‌ی فرصت‌ها، ریسک‌ها و انتظارها.', icon: ShieldCheck },
    { title: 'همراهی', description: 'کنار تیم می‌مانیم؛ نه فقط در لحظه‌ی سرمایه‌گذاری.', icon: HeartHandshake },
    { title: 'یادگیری', description: 'تصمیم‌ها را با داده، کنجکاوی و بازنگری بهتر می‌کنیم.', icon: Sparkles },
  ];
  const roles = [
    { title: 'سرمایه‌گذاری', description: 'ارزیابی فرصت و ساخت مسیر همکاری', icon: Landmark },
    { title: 'محصول و بازار', description: 'شناخت مشتری، محصول و رشد', icon: BriefcaseBusiness },
    { title: 'شبکه و اکوسیستم', description: 'پیوند تیم‌ها با فرصت‌های درست', icon: Network },
  ];
  return (
    <section className="about-section section-space" id="about">
      <div className="site-container"><div className="about-top"><SectionHeading index="۱۵" eyebrow="درباره‌ی ایکس" title="یک تیم سرمایه‌گذاری،" emphasis="برای مسیرهای بلندمدت." copy="ایکس برای هم‌مسیرشدن با کسب‌وکارهایی شکل گرفته که می‌خواهند مسئله‌های واقعی را حل کنند و رشد پایدار بسازند." /><div className="about-history-card"><span className="about-history-symbol"><XGlyph /></span><span className="eyebrow">تاریخچه و معرفی</span><strong>داده‌های رسمی شرکت<br />به این بخش اضافه می‌شود.</strong><small>سال آغاز فعالیت، مأموریت و روایت شکل‌گیری پس از تأیید درج خواهد شد.</small></div></div>
        <div className="about-values-grid">{values.map((item, index) => {
          const Icon = item.icon;
          return <article className="about-value-card" key={item.title} data-reveal><span className="about-value-number">۰{index + 1}</span><Icon size={21} /><h3>{item.title}</h3><p>{item.description}</p></article>;
        })}</div>
        <div className="team-section" id="team"><div className="team-heading"><SectionEyebrow index="۱۶">تیم همراه ایکس</SectionEyebrow><h3>تخصص‌های مکمل،<br /><em>هدف مشترک.</em></h3><p>معرفی اعضا و تجربه‌های حرفه‌ای پس از تأیید اطلاعات هر فرد منتشر می‌شود.</p></div><div className="team-role-list">{roles.map((item, index) => {
          const Icon = item.icon;
          return <div className="team-role-card" key={item.title} data-reveal><span className="team-role-avatar"><Icon size={20} /></span><span className="team-role-meta"><strong>{item.title}</strong><small>{item.description}</small></span><span className="team-role-index">۰{index + 1}</span></div>;
        })}</div></div>
      </div>
    </section>
  );
}

export function LicensesSection() {
  const licenses = [
    { title: 'عنوان مجوز', issuer: 'مرجع صادرکننده', date: 'تاریخ صدور', number: 'شماره‌ی مجوز' },
    { title: 'عنوان مجوز', issuer: 'مرجع صادرکننده', date: 'تاریخ صدور', number: 'شماره‌ی مجوز' },
    { title: 'عنوان مجوز', issuer: 'مرجع صادرکننده', date: 'تاریخ صدور', number: 'شماره‌ی مجوز' },
  ];
  return (
    <section className="licenses-section section-space" id="licenses">
      <div className="site-container"><div className="section-heading-row"><SectionHeading index="۱۷" eyebrow="اعتبار و مجوزها" title="اعتماد، با" emphasis="اطلاعات روشن." copy="فهرست مجوزها همراه با تصویر، شماره، مرجع صادرکننده و تاریخ؛ پس از دریافت مدارک رسمی تکمیل می‌شود." /><span className="license-lock"><FileCheck2 size={18} /> اطلاعات تأییدشده</span></div><div className="licenses-grid">{licenses.map((item, index) => <article className="license-card" key={index} data-reveal><div className="license-document"><div className="license-document-top"><XGlyph /><span>مجوز رسمی</span></div><div className="license-document-seal"><Landmark size={29} /><small>تصویر مدرک<br />پس از بارگذاری</small></div><div className="license-document-lines"><i /><i /><i /></div><span className="license-document-stamp">X / {new Intl.NumberFormat('fa-IR').format(index + 1)}</span></div><div className="license-card-content"><span className="license-index">۰{index + 1} / ۰۳</span><strong>{item.title}</strong><dl><div><dt>شماره</dt><dd>پس از تأیید</dd></div><div><dt>مرجع</dt><dd>پس از تأیید</dd></div><div><dt>تاریخ</dt><dd>پس از تأیید</dd></div></dl></div></article>)}</div></div>
    </section>
  );
}

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event) => { event.preventDefault(); setSubmitted(true); };
  return (
    <section className="contact-section section-space" id="contact">
      <div className="site-container contact-layout"><div className="contact-copy"><SectionHeading index="۱۸" eyebrow="تماس با ایکس" title="یک گفت‌وگوی" emphasis="خوب از این‌جا شروع می‌شود." copy="برای پرسش درباره‌ی همکاری، رسانه یا اکوسیستم پیام بگذارید. اطلاعات تماس رسمی پس از تأیید در همین بخش قرار می‌گیرد." /><div className="contact-details"><div><span className="contact-detail-icon"><Link2 size={17} /></span><span><small>ایمیل شرکت</small><strong>در انتظار تأیید اطلاعات رسمی</strong></span></div><div><span className="contact-detail-icon"><MapPin size={17} /></span><span><small>نشانی و ساعات پاسخ‌گویی</small><strong>در صفحه‌ی نهایی درج می‌شود</strong></span></div><div><span className="contact-detail-icon"><Building2 size={17} /></span><span><small>لینکدین و رسانه‌های اجتماعی</small><strong>پیوند رسمی پس از تأیید اضافه می‌شود</strong></span></div></div></div>
        <form className="contact-form" onSubmit={submit}><div className="contact-form-top"><span className="eyebrow">فرم تماس کوتاه</span><span>پاسخ‌گویی در نخستین فرصت</span></div><label><span>نام شما</span><input required name="contactName" placeholder="نام و نام خانوادگی" /></label><label><span>ایمیل یا شماره‌ی تماس</span><input required name="contactWay" dir="auto" placeholder="راه ارتباطی شما" /></label><label><span>موضوع پیام</span><select name="contactTopic" defaultValue="همکاری"><option>همکاری</option><option>رسانه</option><option>پرسش عمومی</option><option>پیشنهاد شراکت</option></select></label><label><span>پیام</span><textarea required name="contactMessage" rows="3" placeholder="چه چیزی در ذهن دارید؟" /></label>{submitted && <div className="form-inline-notice" role="status"><Check size={15} /> پیش‌نمایش پیام ثبت شد؛ برای ارسال واقعی باید سرویس فرم متصل شود.</div>}<button type="submit" className="button button-lime">ثبت پیام <ArrowUpLeft size={15} /></button><small className="contact-form-disclaimer"><ShieldCheck size={13} /> اطلاعات این پیش‌نمایش به سرور ارسال نمی‌شود.</small></form>
      </div>
    </section>
  );
}

export function FinalCallout() {
  return (
    <section className="final-callout" id="campaign">
      <div className="final-callout-orbit" aria-hidden="true"><XGlyph /></div>
      <div className="site-container final-callout-content"><SectionEyebrow index="۱۹" light>مسیر بعدی</SectionEyebrow><h2>ایده‌تان آماده‌ی<br /><em>قدم بعدی است؟</em></h2><p>شرایط دوره را بخوانید، مسیر ارزیابی را بشناسید و با آمادگی بیشتر درخواستتان را ثبت کنید.</p><div className="final-callout-actions"><a href="#apply" className="button button-lime button-large">شروع درخواست سرمایه <ArrowUpLeft size={17} /></a><a href="#faq" className="button button-outline-light">پرسش‌های پرتکرار <ArrowUpLeft size={15} /></a></div><span className="final-callout-note">اطلاعات رسمی دوره پیش از شروع پذیرش منتشر می‌شود.</span></div>
    </section>
  );
}

export function FooterSection() {
  const year = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date());
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <a className="brand-lockup" href="#home">
            <span className="brand-symbol">X</span>
            <span className="brand-name-stack"><strong>ایکس</strong><small>سرمایه‌گذاری جسورانه</small></span>
          </a>
          <p>سرمایه‌ی هوشمند،<br /><em>همراهی واقعی.</em></p>
          <a href="#apply" className="button button-outline-light">درخواست سرمایه <ArrowUpLeft size={15} /></a>
        </div>
        <div className="footer-main">
          <div className="footer-sitemap">
            <div><strong>کشف ایکس</strong><a href="#approach">رویکرد ما</a><a href="#portfolio">پرتفوی</a><a href="#about">درباره‌ی ما</a><a href="#partners">همکاران</a></div>
            <div><strong>منابع</strong><a href="#tools">ابزارهای استارتاپ</a><a href="#knowledge">مرکز دانش</a><a href="#news">اخبار و رویدادها</a><a href="#licenses">مجوزها</a></div>
            <div><strong>ارتباط</strong><a href="#contact">تماس با ما</a><a href="#apply">صفحه‌ی کمپین</a><a href="#admin">ورود اعضای تیم</a><a href="#sitemap">نقشه‌ی سایت</a></div>
          </div>
          <div className="footer-status">
            <span className="eyebrow">دوره‌ی پذیرش</span>
            <strong><i className="status-indicator" /> شرایط در انتظار اعلام رسمی</strong>
            <small>برای اطلاع از جزئیات، صفحه‌ی کمپین را ببینید.</small>
            <a href="#apply">رفتن به صفحه‌ی کمپین <ArrowUpLeft size={13} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} ایکس · تمام حقوق محفوظ است.</span>
          <div><a href="#terms">قوانین و مقررات</a><a href="#privacy">حریم خصوصی</a><a href="#contact">پشتیبانی</a></div>
          <span className="footer-made">با فکرِ بلندمدت، برای آینده.</span>
        </div>
      </div>
    </footer>
  );
}

export function PortfolioDetail({ item, onClose, onStartApplication }) {
  const Icon = item.icon;
  return (
    <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="case-dialog" role="dialog" aria-modal="true" aria-labelledby="case-title" dir="rtl">
        <button className="icon-button modal-dismiss" type="button" onClick={onClose} aria-label="بستن"><X size={20} /></button>
        <div className={`case-dialog-art ${item.tone}`}><Icon size={56} strokeWidth={1.2} /><span>پرونده‌ی نمونه / {item.id}</span><i /></div>
        <div className="case-dialog-content"><span className="sample-disclosure"><Sparkles size={14} /> نمونه‌ی طراحی</span><h2 id="case-title">{item.title}</h2><p>{item.description}</p><div className="case-facts"><div><small>حوزه</small><strong>{item.sector}</strong></div><div><small>مرحله</small><strong>{item.stage}</strong></div><div><small>سال / شهر</small><strong>پس از تأیید</strong></div></div><div className="case-story"><span className="eyebrow">روایت همکاری</span><p>{item.story}</p></div><div className="case-quote"><span>“</span><p>نقل‌قول بنیان‌گذار این شرکت پس از تأیید در این بخش قرار می‌گیرد.</p></div><button type="button" className="button button-lime" onClick={onStartApplication}>شروع درخواست سرمایه <ArrowUpLeft size={15} /></button></div>
      </section>
    </div>
  );
}

export function ArticleDetail({ article, onClose, onOpenTool }) {
  return (
    <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <article className="article-dialog" role="dialog" aria-modal="true" aria-labelledby="article-title" dir="rtl"><header className="dialog-header"><div className="dialog-brand"><span className="dialog-brand-mark">X</span><span>مرکز دانش ایکس</span></div><button type="button" className="icon-button dialog-close" onClick={onClose} aria-label="بستن"><X size={20} /></button></header><div className="article-dialog-meta"><span>{article.category}</span><span><Clock3 size={14} /> {article.readTime}</span></div><h2 id="article-title">{article.title}</h2><p className="article-dialog-excerpt">{article.excerpt}</p><div className="article-dialog-body">{article.body.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="article-related-tool"><div><span className="eyebrow">ابزار مرتبط</span><strong>محاسبه‌گر برای تصمیم بعدی</strong></div><button type="button" className="button button-dark" onClick={() => onOpenTool(article.tool)}>بازکردن ابزار <ArrowUpLeft size={15} /></button></div><small className="article-dialog-note">یادداشت آموزشی پیشنهادی؛ پیش از انتشار نهایی بازبینی می‌شود.</small></article>
    </div>
  );
}

export function CookieNotice({ choice, onSave }) {
  const [open, setOpen] = useState(false);
  if (choice || open) return null;
  return (
    <aside className="cookie-notice" aria-label="تنظیمات حریم خصوصی"><div className="cookie-notice-symbol">X</div><div className="cookie-notice-copy"><strong>حریم خصوصی، انتخاب شماست.</strong><p>این پیش‌نمایش از ابزارهای تحلیلی استفاده نمی‌کند. فقط تنظیم انتخاب شما ذخیره می‌شود.</p></div><div className="cookie-notice-actions"><button type="button" onClick={() => onSave('essential')}>فقط ضروری</button><button type="button" className="cookie-accept" onClick={() => onSave('all')}>متوجه شدم <Check size={13} /></button></div><button className="cookie-dismiss" type="button" onClick={() => { onSave('essential'); setOpen(true); }} aria-label="بستن پیام"><X size={14} /></button></aside>
  );
}
