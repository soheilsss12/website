import { useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

const RAW_VERTICES = [
  [-1, 1.618, 0], [1, 1.618, 0], [-1, -1.618, 0], [1, -1.618, 0],
  [0, -1, 1.618], [0, 1, 1.618], [0, -1, -1.618], [0, 1, -1.618],
  [1.618, 0, -1], [1.618, 0, 1], [-1.618, 0, -1], [-1.618, 0, 1],
];
const ICO_FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];
const LOGO_COLORS = ['#d6ff74', '#8ce3bd', '#4fb99f', '#e9ffd1', '#317e72', '#a9eaa4'];
const LOGO_VERTICES = RAW_VERTICES.map((vertex) => {
  const length = Math.hypot(...vertex);
  return vertex.map((coordinate) => coordinate / length);
});
const CRYSTAL_FACETS = (() => {
  const rx = -0.48; const ry = 0.62;
  const rotated = LOGO_VERTICES.map(([x, y, z]) => {
    const y1 = y * Math.cos(rx) - z * Math.sin(rx);
    const z1 = y * Math.sin(rx) + z * Math.cos(rx);
    return [x * Math.cos(ry) + z1 * Math.sin(ry), y1, -x * Math.sin(ry) + z1 * Math.cos(ry)];
  });
  const projected = rotated.map(([x, y, z]) => {
    const scale = 3.8 / (3.8 - z);
    return [60 + x * 47 * scale, 60 + y * 47 * scale];
  });
  return ICO_FACES.map((face, index) => ({
    index,
    depth: face.reduce((sum, vertexIndex) => sum + rotated[vertexIndex][2], 0) / 3,
    points: face.map((vertexIndex) => projected[vertexIndex].map((point) => point.toFixed(1)).join(',')).join(' '),
  })).sort((left, right) => left.depth - right.depth);
})();

const concepts = [
  { id: 'crystal', title: 'بلور پارس', subtitle: 'هندسه‌ی دقیق، هوش شفاف', description: 'بیست وجه بلوری با برش‌های نورانی؛ نشان شاخص و آینده‌نگر برای یک شرکت هوش مصنوعی' },
  { id: 'neural', title: 'شبکه‌ی یادگیرنده', subtitle: 'پِه در پیوند با داده', description: 'حرف «پ» با سه نقطه‌ی فارسی و شاخه‌های شبکه‌ی عصبی؛ ترکیبی بومی و فناورانه' },
  { id: 'ai', title: 'هوش در جریان', subtitle: 'امضای روشن و جهانی', description: 'مونوگرام AI با خطوط مداری و گره‌های داده؛ ساده، خوانا و مناسب محصولات دیجیتال' },
  { id: 'arch', title: 'ریشه و آینده', subtitle: 'الهام از معماری ایران', description: 'قوس هندسی ایرانی در کنار مسیرهای داده؛ هویتی ریشه‌دار با پرداخت مدرن' },
  { id: 'orbit', title: 'مدار پارسی', subtitle: 'هوش، در حرکت', description: 'مدارهای متقاطع و هسته‌ی مرکزی؛ نمادی از ارتباط، یادگیری و مقیاس‌پذیری' },
];

function CrystalMark() {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="نشان بلوری بیست‌وجهی">
      {CRYSTAL_FACETS.map(({ index, points }) => (
        <polygon key={index} points={points} fill={LOGO_COLORS[index % LOGO_COLORS.length]} fillOpacity="0.73" stroke="#eaffd9" strokeWidth="0.75" strokeOpacity="0.78" strokeLinejoin="round" />
      ))}
      <circle cx="60" cy="60" r="2.2" fill="#f4ffd9" />
    </svg>
  );
}

function NeuralMark() {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="نشان پِه و شبکه‌ی عصبی">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M31 37h48v14c0 17-11 27-29 27H34" stroke="#d6ff74" strokeWidth="5" />
        <path d="M43 34 28 19M75 34l15-15M51 79l-10 16M68 78l11 17" stroke="#83dfbd" strokeWidth="2.5" />
        <path d="M28 19h-8M90 19h9M41 95h-8M79 95h8" stroke="#d6ff74" strokeWidth="2" />
      </g>
      <circle cx="18" cy="19" r="4" fill="#e58d63" /><circle cx="100" cy="19" r="4" fill="#d6ff74" />
      <circle cx="29" cy="95" r="4" fill="#d6ff74" /><circle cx="90" cy="95" r="4" fill="#83dfbd" />
      <circle cx="46" cy="91" r="3.5" fill="#d6ff74" /><circle cx="60" cy="96" r="3.5" fill="#d6ff74" /><circle cx="74" cy="91" r="3.5" fill="#d6ff74" />
    </svg>
  );
}

function AiMark() {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="مونوگرام هوش مصنوعی">
      <path d="M20 89 49 27 78 89M32 64h35" fill="none" stroke="#d6ff74" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M92 38v51M84 38h16" fill="none" stroke="#8ce3bd" strokeWidth="5" strokeLinecap="round" />
      <path d="M49 27V15M92 27V17M20 89h-8M78 89h9" fill="none" stroke="#83dfbd" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="49" cy="14" r="4" fill="#e58d63" /><circle cx="92" cy="14" r="4" fill="#d6ff74" />
      <circle cx="11" cy="89" r="3.5" fill="#d6ff74" /><circle cx="90" cy="92" r="3.5" fill="#8ce3bd" />
    </svg>
  );
}

function ArchMark() {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="نشان قوس ایرانی و مسیر داده">
      <path d="M23 91V60a37 37 0 0 1 74 0v31" fill="none" stroke="#d6ff74" strokeWidth="4" strokeLinecap="round" />
      <path d="M39 91V61a21 21 0 0 1 42 0v30" fill="none" stroke="#82dfbb" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 22v17M25 80h14M81 80h14M60 82v16" fill="none" stroke="#e6ffd4" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="18" r="5" fill="#e58d63" /><circle cx="60" cy="101" r="4" fill="#d6ff74" />
      <circle cx="22" cy="82" r="3.5" fill="#d6ff74" /><circle cx="98" cy="82" r="3.5" fill="#82dfbb" />
      <path d="M60 55v21m-10-11h20" stroke="#d6ff74" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function OrbitMark() {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="نشان مدارها و هسته‌ی هوشمند">
      <ellipse cx="60" cy="60" rx="45" ry="17" fill="none" stroke="#d6ff74" strokeWidth="2.5" transform="rotate(-34 60 60)" />
      <ellipse cx="60" cy="60" rx="45" ry="17" fill="none" stroke="#79d9b5" strokeWidth="2.5" transform="rotate(34 60 60)" />
      <ellipse cx="60" cy="60" rx="46" ry="17" fill="none" stroke="#e7f9d3" strokeWidth="1.2" transform="rotate(90 60 60)" />
      <circle cx="60" cy="60" r="14" fill="#14251d" stroke="#d6ff74" strokeWidth="2" />
      <circle cx="60" cy="60" r="5" fill="#d6ff74" />
      <circle cx="18" cy="38" r="4" fill="#e58d63" /><circle cx="102" cy="83" r="4" fill="#d6ff74" />
      <circle cx="76" cy="18" r="3.5" fill="#8ce3bd" />
    </svg>
  );
}

function LogoMark({ concept }) {
  if (concept === 'crystal') return <CrystalMark />;
  if (concept === 'neural') return <NeuralMark />;
  if (concept === 'ai') return <AiMark />;
  if (concept === 'arch') return <ArchMark />;
  return <OrbitMark />;
}

export default function LogoOptionsPage() {
  const [selected, setSelected] = useState(() => {
    if (typeof window === 'undefined') return '';
    try { return window.localStorage.getItem('pars-ai-logo-choice') || ''; } catch { return ''; }
  });
  const selectedIndex = concepts.findIndex((concept) => concept.id === selected);
  const selectedNumber = selectedIndex >= 0 ? new Intl.NumberFormat('fa-IR').format(selectedIndex + 1) : '';

  const chooseConcept = (id) => {
    setSelected(id);
    try { window.localStorage.setItem('pars-ai-logo-choice', id); } catch { /* local demo only */ }
  };

  return (
    <main className="logo-options-page" dir="rtl">
      <header className="logo-options-header site-container">
        <a className="logo-options-brand" href="#home"><span className="brand-symbol">پ</span><span><strong>پارس</strong><small>سرمایه‌گذاری جسورانه</small></span></a>
        <a className="logo-options-back" href="#home"><ArrowLeft size={16} /> بازگشت به سایت</a>
      </header>
      <section className="logo-options-intro site-container">
        <span className="logo-options-kicker"><Sparkles size={15} /> هویت بصری · پارس ایرانیان</span>
        <h1>پنج مسیر برای<br /><em>هوش مصنوعی پارس ایرانیان</em></h1>
        <p>پنج نشان برداری با زبان‌های بصری متفاوت؛ یکی را انتخاب کنید تا به‌عنوان هویت نهایی پرداخت و در سایت جایگزین شود</p>
        <div className={`logo-choice-status ${selected ? 'is-selected' : ''}`} aria-live="polite">
          <span className="logo-choice-status-icon">{selected ? <Check size={16} /> : <Sparkles size={16} />}</span>
          <span>{selected ? `گزینه‌ی ${selectedNumber} انتخاب شد؛ شماره‌ی طرح را برای اعمال نهایی اعلام کنید` : 'روی هر گزینه بزنید تا انتخاب محلی ذخیره شود؛ سپس شماره‌ی آن را اعلام کنید'}</span>
        </div>
      </section>
      <section className="logo-options-grid site-container" aria-label="پنج گزینه‌ی لوگو">
        {concepts.map((concept, index) => (
          <article className={`logo-option-card ${selected === concept.id ? 'is-selected' : ''}`} key={concept.id}>
            <div className="logo-option-art">
              <div className={`logo-option-mark logo-option-mark-${concept.id}`}><LogoMark concept={concept.id} /></div>
              <div className="logo-option-wordmark"><strong>پارس ایرانیان</strong><span>هوش مصنوعی</span></div>
            </div>
            <div className="logo-option-copy">
              <div className="logo-option-heading"><span>{new Intl.NumberFormat('fa-IR').format(index + 1)}</span><h2>{concept.title}</h2></div>
              <small>{concept.subtitle}</small>
              <p>{concept.description}</p>
            </div>
            <button type="button" className="logo-option-select" aria-pressed={selected === concept.id} onClick={() => chooseConcept(concept.id)}>
              {selected === concept.id ? <><Check size={16} /> انتخاب شد</> : <>انتخاب این طرح <ArrowLeft size={15} /></>}
            </button>
          </article>
        ))}
      </section>
      <p className="logo-options-note site-container">انتخاب فقط در همین مرورگر ذخیره می‌شود؛ برای نهایی‌کردن، شماره‌ی گزینه را در گفتگو بفرستید</p>
    </main>
  );
}
