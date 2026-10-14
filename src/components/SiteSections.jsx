import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUpLeft,
  BarChart3,
  BookOpen,
  Building2,
  ChartNoAxesCombined,
  Check,
  Compass,
  Globe2,
  Gauge,
  HeartHandshake,
  Info,
  LineChart,
  MapPin,
  Network,
  PieChart,
  ShieldCheck,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import { apiFetch } from '../lib/api.js';
import { pageHref } from '../lib/routes.js';
import {
  aiFabricComponents,
  aiFabricConsumers,
  businessMarkets,
  capabilities,
  commercializationStages,
  customerSegments,
  ecosystemEnablers,
  experienceAreas,
  financialInfrastructureBlocks,
  industries,
  investmentStructures,
  nationalPrograms,
  partnershipModels,
  platformBrands,
  revenueStreams,
  technologyLayers,
  technologyProducts,
  ventureOutcomes,
  walletModels,
  whyParsFeatures,
} from '../data/siteContent.js';
import { iranCityMarkers, iranOutlinePath, iranOutlineViewBox } from '../data/iranMap.js';
import CrystalMark from './CrystalMark.jsx';


function responsiveImageProps(filename, sizes = '100vw') {
  const baseUrl = import.meta.env.BASE_URL;
  const stem = filename.replace(/\.webp$/i, '');
  return {
    src: `${baseUrl}${stem}-1024.webp`,
    srcSet: [
      `${baseUrl}${stem}-640.webp 640w`,
      `${baseUrl}${stem}-1024.webp 1024w`,
      `${baseUrl}${filename} 1536w`,
    ].join(', '),
    sizes,
  };
}

const HERO_TITLE_LINE_ONE = 'از زیرساخت تا هوشمندی';
const HERO_TITLE_LINE_TWO = 'از فناوری تا کسب‌وکار';
const HERO_TITLE_TEXT = `${HERO_TITLE_LINE_ONE} ${HERO_TITLE_LINE_TWO}`;
const HERO_TITLE_LINE_ONE_CHARS = Array.from(HERO_TITLE_LINE_ONE);
const HERO_TITLE_LINE_TWO_CHARS = Array.from(HERO_TITLE_LINE_TWO);
const HERO_DIALOGUE_STEPS = [
  { key: 'name', placeholder: 'نام و نام خانوادگی', autoComplete: 'name', required: true },
  { key: 'company', placeholder: 'نام شرکت یا تیم', autoComplete: 'organization', required: true },
  { key: 'focus', placeholder: 'خلاصه‌ی ایده یا مسئله‌ی محوری', autoComplete: 'off', required: false },
];

function getHeroDialoguePrompt(step, answers) {
  if (step < 0) return HERO_TITLE_TEXT;
  if (step === 0) return 'برای شروع، نام خود را بنویسید';
  if (step === 1) return `${answers.name} گرامی، نام شرکت یا تیم شما چیست؟`;
  if (step === 2) return `شرکت یا تیم ${answers.company} چه مسئله‌ای را حل می‌کند؟`;
  return `سپاس ${answers.name}؛ برای ثبت درخواست، فرم رسمی را در صفحه‌ی مربوط تکمیل کنید`;
}

const journeyChapters = [
  {
    stage: 'پژوهش و فناوری',
    image: 'pars-journey-discovery.webp',
    title: 'فناوری را از مسئله‌ی واقعی آغاز کنیم',
    description: 'پژوهش کاربردی، رصد فناوری و بررسی فناوری‌های نوظهور؛ با تمرکز بر مسئله‌های سازمانی و فرصت‌های بازار.',
  },
  {
    stage: 'محصول و پلتفرم',
    image: 'pars-journey-prototype.webp',
    title: 'راهکار را به محصولی تکرارپذیر برسانیم',
    description: 'اعتبارسنجی امکان فنی، ساخت اثبات مفهوم و تبدیل فناوریِ آزموده‌شده به محصول و زیرساختی قابل استفاده‌ی دوباره.',
  },
  {
    stage: 'بازار و اکوسیستم',
    image: 'pars-journey-growth.webp',
    title: 'محصول را به کسب‌وکار پیوند دهیم',
    description: 'مدل درآمد، فروش سازمانی و توسعه‌ی بازار؛ سپس همراهی شرکا و کسب‌وکارهایی که بر بستر پلتفرم شکل می‌گیرند.',
  },
];

function SectionEyebrow({ children, light = false }) {
  return <div className={`section-eyebrow ${light ? 'is-light' : ''}`}><i aria-hidden="true" />{children}</div>;
}

function SectionHeading({ eyebrow, title, emphasis, copy, light = false, className = '' }) {
  return (
    <div className={`section-heading ${light ? 'is-light' : ''} ${className}`} data-reveal>
      <SectionEyebrow light={light}>{eyebrow}</SectionEyebrow>
      <h2>{title}{emphasis && <> <em>{emphasis}</em></>}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function ParsGlyph({ className = '' }) {
  return <span className={`pars-glyph ${className}`} aria-hidden="true"><CrystalMark /></span>;
}

export function BrandHomeHeroSection() {
  return (
    <section className="brand-home-hero" id="home" aria-labelledby="brand-home-title">
      <picture className="brand-home-hero-picture" aria-hidden="true">
        <source
          srcSet={`${import.meta.env.BASE_URL}pars-brand-home-hero-640.webp 640w, ${import.meta.env.BASE_URL}pars-brand-home-hero-1024.webp 1024w, ${import.meta.env.BASE_URL}pars-brand-home-hero.webp 1672w`}
          sizes="100vw"
          type="image/webp"
        />
        <img
          className="brand-home-hero-image"
          src={`${import.meta.env.BASE_URL}pars-brand-home-hero-1024.webp`}
          alt=""
          width="1672"
          height="941"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>
      <span className="brand-home-hero-shade" aria-hidden="true" />
      <div className="brand-home-hero-content site-container">
        <div className="brand-home-copy">
          <h1 id="brand-home-title">از زیرساخت<br /><em>تا هوشمندی</em></h1>
          <p>از فناوری تا کسب‌وکار، و از پروژه‌ها تا اکوسیستم‌ها؛ مدل یکپارچه‌ی پارس را بشناسید.</p>
          <div className="brand-home-actions">
            <a href={pageHref('about')} className="button button-lime button-large">درباره‌ی پارس <ArrowUpLeft size={17} /></a>
            <a href={pageHref('investment')} className="button button-outline-light button-large">سرمایه‌گذاری خطرپذیر <ArrowUpLeft size={15} /></a>
          </div>
        </div>
        <a className="brand-home-scroll" href="#home-highlights-title" aria-label="رفتن به بخش‌های پارس">
          <span><ArrowDown size={14} /></span>
          مسیرهای پارس
        </a>
      </div>
    </section>
  );
}

export function HeroSection() {
  const prefersReducedMotion = () => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isMotionReduced, setIsMotionReduced] = useState(() => prefersReducedMotion());
  const startingStep = isMotionReduced ? 0 : -1;
  const startingAnswers = { name: '', company: '', focus: '' };
  const startingPrompt = getHeroDialoguePrompt(startingStep, startingAnswers);
  const [dialogueStep, setDialogueStep] = useState(startingStep);
  const [dialoguePhase, setDialoguePhase] = useState(isMotionReduced ? 'ready' : 'typing');
  const [typingState, setTypingState] = useState(() => ({
    prompt: startingPrompt,
    length: isMotionReduced ? Array.from(startingPrompt).length : 0,
  }));
  const [history, setHistory] = useState(() => (
    isMotionReduced ? [{ prompt: HERO_TITLE_TEXT, answer: '' }] : []
  ));
  const [answers, setAnswers] = useState(startingAnswers);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [nextStep, setNextStep] = useState(null);

  const activePrompt = getHeroDialoguePrompt(dialogueStep, answers);
  const activePromptCharacters = Array.from(activePrompt);
  const typedLength = typingState.prompt === activePrompt
    ? Math.min(typingState.length, activePromptCharacters.length)
    : 0;
  const visiblePrompt = activePromptCharacters.slice(0, typedLength).join('');
  const currentField = dialogueStep >= 0 && dialogueStep < HERO_DIALOGUE_STEPS.length
    ? HERO_DIALOGUE_STEPS[dialogueStep]
    : null;
  const isIntro = dialogueStep < 0;
  const isComplete = dialogueStep >= HERO_DIALOGUE_STEPS.length;
  const isPromptTyping = dialoguePhase === 'typing';
  const lineOneLength = HERO_TITLE_LINE_ONE_CHARS.length;
  const titleLineTwoStart = lineOneLength + 1;
  const typedLineOne = HERO_TITLE_LINE_ONE_CHARS.slice(0, Math.min(typedLength, lineOneLength)).join('');
  const typedLineTwoLength = Math.min(
    Math.max(0, typedLength - titleLineTwoStart),
    HERO_TITLE_LINE_TWO_CHARS.length,
  );
  const visibleLineTwo = HERO_TITLE_LINE_TWO_CHARS.slice(0, typedLineTwoLength).join('');

  useEffect(() => {
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!motionQuery) return undefined;
    const updateMotionPreference = (event) => {
      setIsMotionReduced(event.matches);
      setDialoguePhase(event.matches ? 'ready' : 'typing');
    };
    motionQuery.addEventListener?.('change', updateMotionPreference);
    return () => motionQuery.removeEventListener?.('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    const characters = Array.from(activePrompt);
    if (isMotionReduced) {
      if (dialogueStep < 0) {
        setHistory((items) => (
          items.some((turn) => turn.prompt === HERO_TITLE_TEXT)
            ? items
            : [...items, { prompt: HERO_TITLE_TEXT, answer: '' }]
        ));
        setDialogueStep(0);
        return undefined;
      }
      setTypingState({ prompt: activePrompt, length: characters.length });
      setDialoguePhase('ready');
      return undefined;
    }

    setTypingState({ prompt: activePrompt, length: 0 });
    const timers = [];
    let characterInterval;
    const clearSequence = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      if (characterInterval !== undefined) window.clearInterval(characterInterval);
    };

    timers.push(window.setTimeout(() => {
      let currentLength = 0;
      characterInterval = window.setInterval(() => {
        currentLength = Math.min(currentLength + 1, characters.length);
        setTypingState({ prompt: activePrompt, length: currentLength });
        if (currentLength >= characters.length) {
          window.clearInterval(characterInterval);
          if (dialogueStep === -1) {
            setDialoguePhase('holding');
            timers.push(window.setTimeout(() => {
              setHistory((items) => (
                items.some((turn) => turn.prompt === HERO_TITLE_TEXT)
                  ? items
                  : [...items, { prompt: HERO_TITLE_TEXT, answer: '' }]
              ));
              setDialoguePhase('receding');
            }, 900));
          } else {
            setDialoguePhase('ready');
          }
        }
      }, 32);
    }, 120));

    return clearSequence;
  }, [activePrompt, dialogueStep, isMotionReduced]);

  useEffect(() => {
    if (dialoguePhase !== 'arriving' || isMotionReduced) return undefined;
    let firstFrame = null;
    let secondFrame = null;
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setDialoguePhase('typing'));
    });
    return () => {
      if (firstFrame !== null) window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) window.cancelAnimationFrame(secondFrame);
    };
  }, [dialoguePhase, isMotionReduced]);

  useEffect(() => {
    if (!isMotionReduced || nextStep === null) return;
    setDialogueStep(nextStep);
    setNextStep(null);
    setDialoguePhase('ready');
  }, [isMotionReduced, nextStep]);

  const handlePromptTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform' || dialoguePhase !== 'receding') return;
    if (dialogueStep < 0) {
      setDialoguePhase('arriving');
      setDialogueStep(0);
      return;
    }
    if (nextStep === null) return;
    setDialoguePhase('arriving');
    setDialogueStep(nextStep);
    setNextStep(null);
  };

  const advanceConversation = (answer) => {
    const cleanAnswer = answer.trim();
    setAnswers((current) => ({ ...current, [currentField.key]: cleanAnswer }));
    setHistory((current) => ([
      ...current,
      { prompt: activePrompt, answer: cleanAnswer || 'فعلاً رد شد' },
    ]));
    setInputValue('');
    setInputError('');
    if (isMotionReduced) {
      setDialogueStep(dialogueStep + 1);
    } else {
      setDialoguePhase('receding');
      setNextStep(dialogueStep + 1);
    }
  };

  const handleDialogueSubmit = (event) => {
    event.preventDefault();
    if (!currentField) return;
    const answer = inputValue.trim();
    if (currentField.required && !answer) {
      setInputError('برای ادامه، پاسخ این مورد را وارد کنید');
      return;
    }
    advanceConversation(answer);
  };

  const handleSkipQuestion = () => {
    if (currentField?.required) return;
    advanceConversation('');
  };

  const restartConversation = () => {
    setAnswers({ name: '', company: '', focus: '' });
    setInputValue('');
    setInputError('');
    setNextStep(null);
    if (isMotionReduced) {
      const firstPrompt = getHeroDialoguePrompt(0, { name: '', company: '', focus: '' });
      setHistory([{ prompt: HERO_TITLE_TEXT, answer: '' }]);
      setDialogueStep(0);
      setTypingState({ prompt: firstPrompt, length: Array.from(firstPrompt).length });
      setDialoguePhase('ready');
    } else {
      setHistory([]);
      setDialogueStep(-1);
      setTypingState({ prompt: HERO_TITLE_TEXT, length: 0 });
      setDialoguePhase('typing');
    }
  };

  return (
    <section className="hero hero-pars" id="home" aria-labelledby="hero-title">
      <picture className="hero-backdrop-picture" aria-hidden="true">
        <source
          srcSet={`${import.meta.env.BASE_URL}pars-home-hero-640.webp 640w, ${import.meta.env.BASE_URL}pars-home-hero-1024.webp 1024w, ${import.meta.env.BASE_URL}pars-home-hero.webp 1672w`}
          sizes="100vw"
          type="image/webp"
        />
        <img
          className="hero-backdrop"
          src={`${import.meta.env.BASE_URL}pars-home-hero-fallback.jpg`}
          alt=""
          width="1672"
          height="941"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>
      <div className="hero-layout hero-pars-layout site-container">
        <div className="hero-copy hero-pars-copy">
          <div className="hero-brand-lockup">
            <img
              className="hero-brand-mark"
              src={`${import.meta.env.BASE_URL}pars-mark.svg`}
              alt="نشان پارس"
              width="616"
              height="466"
              decoding="async"
            />
          </div>
          <div className="hero-kicker hero-kicker-pars"><span className="hero-kicker-icon"><ChartNoAxesCombined size={14} /></span> سرمایه‌گذاری خطرپذیر در فناوری</div>
          <div className={`hero-dialogue-stage ${isIntro ? 'is-intro' : ''} ${currentField ? 'has-input' : ''} ${isComplete ? 'is-complete' : ''} phase-${dialoguePhase}`}>
            <div className="hero-dialogue-history" aria-hidden="true">
              {history.slice(-2).map((turn, index) => (
                <div className="hero-dialogue-echo" key={`${turn.prompt}-${index}`}>
                  <span>{turn.prompt}</span>
                  {turn.answer && <strong>{turn.answer}</strong>}
                </div>
              ))}
            </div>
            <h1
              key={dialogueStep}
              id="hero-title"
              className={`hero-dialogue-prompt ${isIntro ? 'is-intro' : ''}`}
              aria-label={activePrompt}
              onTransitionEnd={handlePromptTransitionEnd}
            >
              {isIntro ? (
                <span className="hero-dialogue-prompt-visual" aria-hidden="true">
                  <span className="hero-dialogue-title-line">
                    {typedLineOne || '\u00a0'}
                    {isPromptTyping && typedLength <= titleLineTwoStart && <span className="hero-type-caret" />}
                  </span>
                  <span className="hero-dialogue-title-line">
                    <em>{visibleLineTwo || '\u00a0'}</em>
                    {isPromptTyping && typedLength > titleLineTwoStart && typedLength < activePromptCharacters.length && <span className="hero-type-caret" />}
                  </span>
                </span>
              ) : (
                <span className="hero-dialogue-prompt-visual" aria-hidden="true">
                  {visiblePrompt || '\u00a0'}
                  {isPromptTyping && <span className="hero-type-caret" />}
                </span>
              )}
            </h1>

            {currentField && (
              <form
                className={`hero-dialogue-form ${dialoguePhase === 'ready' ? 'is-ready' : ''}`}
                onSubmit={handleDialogueSubmit}
                noValidate
              >
                <label className="sr-only" htmlFor="hero-dialogue-input">{currentField.placeholder}</label>
                <input
                  id="hero-dialogue-input"
                  name={currentField.key}
                  type="text"
                  value={inputValue}
                  placeholder={currentField.placeholder}
                  autoComplete={currentField.autoComplete}
                  maxLength={currentField.key === 'focus' ? 180 : 100}
                  required={currentField.required}
                  disabled={dialoguePhase !== 'ready'}
                  dir="auto"
                  aria-required={currentField.required}
                  aria-label={currentField.placeholder}
                  onChange={(event) => {
                    setInputValue(event.target.value);
                    if (inputError) setInputError('');
                  }}
                />
                {currentField.key === 'focus' && (
                  <button className="hero-dialogue-skip" type="button" onClick={handleSkipQuestion} disabled={dialoguePhase !== 'ready'}>
                    بعداً پاسخ می‌دهم
                  </button>
                )}
                <button className="hero-dialogue-send" type="submit" aria-label="ادامه" disabled={dialoguePhase !== 'ready'}>
                  <ArrowUpLeft size={15} />
                </button>
              </form>
            )}
            {inputError && <p className="hero-dialogue-error" role="alert">{inputError}</p>}
            {isComplete && dialoguePhase === 'ready' && (
              <button className="hero-dialogue-restart" type="button" onClick={restartConversation}>
                شروع دوباره‌ی گفت‌وگو
              </button>
            )}
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {dialoguePhase === 'ready' ? activePrompt : ''}
            </span>
          </div>
          <p className="hero-dialogue-local-note">پاسخ‌های این گفت‌وگو فقط در همین صفحه می‌مانند و ارسال یا ذخیره نمی‌شوند.</p>
          <p className="hero-description">پارس، شرکت فناوری و نوآوری ایرانی، زیرساخت دیجیتال، داده و هوش مصنوعی را با تحول سازمانی، سرمایه‌گذاری فناوری و ساخت کسب‌وکار پیوند می‌دهد.</p>
          <div className="hero-actions hero-pars-actions">
            <a className="button button-lime button-large" href={pageHref('apply')}>شروع درخواست <ArrowUpLeft size={17} /></a>
            <a className="button button-outline-light button-large" href={pageHref('approach')}>با رویکرد ما آشنا شوید <ArrowDown size={15} /></a>
          </div>
          <div className="hero-value-strip">
            <div><span><small>فناوری</small><strong>زیرساخت، داده و هوش مصنوعی</strong></span></div>
            <div><span><small>سرمایه‌گذاری</small><strong>پیوند سرمایه با فناوری</strong></span></div>
            <div><span><small>ساخت کسب‌وکار</small><strong>از محصول تا اکوسیستم</strong></span></div>
          </div>
          <div className="hero-campaign-note"><span><i /></span> پروفایل شرکتی پارس · ۲۰۲۶</div>
        </div>
      </div>
      <div className="hero-bottomline hero-pars-bottomline site-container">
        <a href={pageHref('industries')} className="hero-scroll-cue"><span><ArrowDown size={14} /></span> حوزه‌های سرمایه‌گذاری را ببینید</a>
        <span className="hero-bottomline-note">از پروژه‌ی فناورانه تا محصول، بازار و کسب‌وکار</span>
        <span className="hero-bottom-index">پارس</span>
      </div>
    </section>
  );
}
export function StatsRibbon() {
  const stats = [
    { value: '۲۰۰+', title: 'ابتکار هوش مصنوعی و فناوری', note: 'در نمایه‌ی شرکتی ۲۰۲۶', icon: Activity },
    { value: '۱۰۰+', title: 'محصول و راهکار محصول‌محور', note: 'در نمایه‌ی شرکتی ۲۰۲۶', icon: Network },
    { value: '۵', title: 'توانمندساز اکوسیستم', note: 'سرمایه‌ی انسانی، داده، پژوهش، ساخت کسب‌وکار و رشد بازار', icon: UsersRound },
    { value: '۵', title: 'لایه‌ی معماری فناوری', note: 'از زیرساخت تا خدمات هوشمند', icon: ChartNoAxesCombined },
  ];
  return (
    <section className="stats-ribbon site-container" aria-label="آمار معرفی‌شده در پروفایل پارس ۲۰۲۶">
      <div className="stats-ribbon-label"><span className="signal-dot" /> نمایه‌ی شرکتی · ۲۰۲۶</div>
      <div className="stats-ribbon-items">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return <div className="stats-ribbon-item" key={item.title} data-reveal><span className="stats-number">{item.value}</span><span className="stats-copy"><strong>{item.title}</strong>{item.note && <small>{item.note}</small>}</span><Icon size={20} strokeWidth={1.45} /><i className="stats-ribbon-divider" />{index < stats.length - 1 && <span className="stats-mobile-separator" />}</div>;
        })}
      </div>
    </section>
  );
}
export function HomeHighlightsSection() {
  const highlights = [
    {
      route: 'about', label: 'گروه پارس', title: 'چهار قابلیت، یک مدل عملیاتی',
      description: 'فناوری، تحول دیجیتال، سرمایه‌گذاری و ساخت کسب‌وکار.',
      image: 'pars-highlight-domains.webp', layout: 'feature',
    },
    {
      route: 'approach', label: 'مدل فناوری', title: 'از زیرساخت تا خدمات هوشمند',
      description: 'معماری پنج‌لایه و مسیر تجاری‌سازی فناوری را ببینید.',
      image: 'pars-highlight-approach.webp', layout: 'compact',
    },
    {
      route: 'industries', label: 'حوزه‌های تمرکز', title: '۱۱ حوزه‌ی سرمایه‌گذاری',
      description: 'فهرست حوزه‌های به‌روز پارس و برنامه‌های معرفی‌شده.',
      image: 'pars-highlight-portfolio.webp', layout: 'compact',
    },
    {
      route: 'portfolio', label: 'پرتفوی فناوری', title: 'محصول‌ها و پلتفرم‌ها',
      description: 'نام‌های درج‌شده در پروفایل شرکتی پارس ۲۰۲۶.',
      image: 'pars-highlight-stories.webp', layout: 'wide',
    },
  ];

  return (
    <section className="home-highlights section-space" id="home-highlights" aria-labelledby="home-highlights-title">
      <div className="site-container">
        <div className="home-highlights-heading" data-reveal>
          <div>
            <span className="journey-eyebrow"><i aria-hidden="true" /> گروه فناوری و سرمایه‌گذاری پارس</span>
            <h2 id="home-highlights-title">از فناوری، <em>تا کسب‌وکار</em></h2>
          </div>
          <p>مدل، حوزه‌ها و دارایی‌های فناورانه‌ی معرفی‌شده در پروفایل پارس را مرور کنید.</p>
        </div>
        <div className="home-highlights-grid">
          {highlights.map((item, index) => (
            <a
              className={`home-highlight-card home-highlight-card--${item.layout}`}
              href={pageHref(item.route)}
              key={item.route}
              data-reveal
              style={{ '--image-reveal-delay': `${index * 70}ms` }}
            >
              <img
                {...responsiveImageProps(item.image, item.layout === 'compact' ? '(max-width: 560px) 100vw, (max-width: 760px) 50vw, 25vw' : '(max-width: 560px) 100vw, 50vw')}
                alt=""
                width="1536"
                height="1024"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
              <span className="home-highlight-shade" aria-hidden="true" />
              <span className="home-highlight-copy">
                <small>{item.label}</small>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
                <i>دیدن <ArrowUpLeft size={15} /></i>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
export function InvestmentOverviewSection() {
  const paths = [
    { route: 'approach', label: 'معماری فناوری', title: 'پنج لایه؛ از زیرساخت تا هوشمندی', description: 'زنجیره‌ی فناوری و مدل تجاری‌سازی پارس.', icon: Network },
    { route: 'industries', label: 'حوزه‌های تمرکز', title: '۱۱ حوزه‌ی سرمایه‌گذاری', description: 'فهرست حوزه‌های به‌روز پارس را ببینید.', icon: Compass },
    { route: 'portfolio', label: 'پرتفوی فناوری', title: 'محصول‌ها و پلتفرم‌ها', description: 'نام‌های درج‌شده در پروفایل شرکتی ۲۰۲۶.', icon: Building2 },
    { route: 'contact', label: 'مشارکت راهبردی', title: 'هشت مدل همکاری', description: 'از شراکت فناوری تا توسعه‌ی منطقه‌ای.', icon: HeartHandshake },
  ];
  return (
    <section className="investment-overview section-space" aria-labelledby="investment-overview-title">
      <div className="site-container">
        <div className="investment-overview-heading" data-reveal>
          <span className="journey-eyebrow"><i aria-hidden="true" /> سرمایه‌گذاری فناوری و ساخت کسب‌وکار</span>
          <h2 id="investment-overview-title">مدل پارس را <em>بشناسید</em></h2>
          <p>از معماری و حوزه‌های تمرکز تا محصول‌ها و شیوه‌های مشارکت.</p>
        </div>
        <div className="investment-overview-grid">
          {paths.map((item) => {
            const Icon = item.icon;
            return (
              <a className="investment-overview-card" href={pageHref(item.route)} key={item.route} data-reveal>
                <span className="investment-overview-icon"><Icon size={21} strokeWidth={1.5} /></span>
                <small>{item.label}</small>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
                <i>ورود به صفحه <ArrowUpLeft size={15} /></i>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function BrandClosingSection() {
  return (
    <section className="brand-home-closing">
      <div className="site-container brand-home-closing-content" data-reveal>
        <span className="brand-home-closing-mark" aria-hidden="true"><ParsGlyph /></span>
        <span className="journey-eyebrow"><i aria-hidden="true" /> پارس · فناوری و سرمایه‌گذاری</span>
        <h2>زیرساخت، داده و هوش مصنوعی؛<br /><em>در مسیر ساخت کسب‌وکار</em></h2>
        <a href={pageHref('approach')} className="button button-lime button-large">مرور مدل فعالیت پارس <ArrowUpLeft size={16} /></a>
      </div>
    </section>
  );
}
export function ManifestoSection() {
  return (
    <section className="manifesto-section" id="approach">
      <div className="manifesto-inner site-container">
        <div className="manifesto-aside" data-reveal><span>مدل فعالیت پارس</span><span className="manifesto-asterisk">✳</span><small>از پژوهش و فناوری<br />تا بازار و اکوسیستم</small></div>
        <div className="manifesto-copy" data-reveal>
          <SectionEyebrow>از پروژه تا دارایی فناورانه</SectionEyebrow>
          <h2>فناوری زمانی کسب‌وکار می‌شود؛<br /> <em>که زنجیره‌ی آن کامل باشد</em></h2>
          <p>پارس در مدل معرفی‌شده‌ی خود، زیرساخت، داده، هوشمندی و خلق کسب‌وکار را در یک معماری به هم پیوند می‌دهد؛ مسیری از پژوهش و فناوری تا محصول، بازار، سرمایه‌گذاری و مقیاس.</p>
          <a href={pageHref('about')} className="text-link text-link-dark">چهار قابلیت پارس <ArrowUpLeft size={16} /></a>
        </div>
        <div className="manifesto-mark" aria-hidden="true"><ParsGlyph /><span>فناوری · سرمایه‌گذاری · ساخت کسب‌وکار</span></div>
      </div>
    </section>
  );
}
export function JourneySection() {
  const chapterRefs = useRef([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const activeStory = journeyChapters[activeChapter] ?? journeyChapters[0];

  useEffect(() => {
    const chapters = chapterRefs.current.filter(Boolean);
    if (!chapters.length || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const mostVisible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (mostVisible) setActiveChapter(Number(mostVisible.target.dataset.storyIndex));
    }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-18% 0px -24% 0px' });

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="journey-section" id="journey" aria-labelledby="journey-title">
      <div className="site-container">
        <div className="journey-heading" data-reveal>
          <div>
            <span className="journey-eyebrow"><i aria-hidden="true" /> مسیر همراهی پارس</span>
            <h2 id="journey-title">از پژوهش و فناوری<br /><em>تا بازار و اکوسیستم</em></h2>
          </div>
          <p>نمایی فشرده از مسیر معرفی‌شده‌ی پارس: فناوری، محصول، بازار و ساخت کسب‌وکار.</p>
        </div>
        <div className="journey-layout" style={{ '--journey-progress': `${((activeChapter + 1) / journeyChapters.length) * 100}%` }}>
          <div className="journey-chapters">
            {journeyChapters.map((item, index) => {
              const isActive = index === activeChapter;
              return (
                <article
                  className={`journey-chapter ${isActive ? 'is-active' : ''}`}
                  key={item.image}
                  ref={(node) => { chapterRefs.current[index] = node; }}
                  data-story-index={index}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <figure className="journey-chapter-media" data-reveal style={{ '--image-reveal-delay': `${index * 60}ms` }}>
                    <img
                      {...responsiveImageProps(item.image, '(max-width: 760px) 92vw, 46vw')}
                      alt=""
                      width="1536"
                      height="1024"
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption><span>{item.stage}</span></figcaption>
                  </figure>
                  <div className="journey-chapter-copy">
                    <div>
                      <span className="journey-chapter-stage">{item.stage}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <figure className="journey-art" aria-hidden="true">
            <div className="journey-art-images">
              {journeyChapters.map((item, index) => (
                <img
                  {...responsiveImageProps(item.image, '(max-width: 760px) 1px, 48vw')}
                  className={`journey-art-image ${index === activeChapter ? 'is-active' : ''}`}
                  key={item.image}
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <figcaption className="journey-art-caption">
              <span><i aria-hidden="true" />{activeStory.stage}</span>
            </figcaption>
            <span className="journey-art-progress"><i /></span>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function TechnologyArchitectureSection() {
  return (
    <section className="technology-architecture-section section-space" id="architecture" aria-label="معماری فناوری پارس در پنج لایه">
      <div className="site-container">
        <SectionHeading
          eyebrow="معماری فناوری پارس"
          title="پنج لایه؛"
          emphasis="از زیرساخت تا خدمت هوشمند"
          copy="این معماری، زیرساخت، داده و هوشمندی را به خدمات کسب‌وکار متصل می‌کند؛ ارزش هر لایه بر ظرفیت لایه‌ی پیش از خود تکیه دارد."
          className="technology-architecture-heading"
        />
        <ol className="technology-layer-list" aria-label="پنج لایه‌ی معماری فناوری">
          {technologyLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <li className="technology-layer-card" key={layer.number} data-reveal>
                <span className="technology-layer-number">{layer.number}</span>
                <span className="technology-layer-icon"><Icon size={22} strokeWidth={1.45} /></span>
                <div className="technology-layer-copy">
                  <h3>{layer.title}</h3>
                  <span dir="ltr">{layer.english}</span>
                  <p>{layer.description}</p>
                </div>
                {layer.number !== '۰۵' && <ArrowDown className="technology-layer-arrow" size={18} aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
        <p className="section-source-note">نام لایه‌ها و نمونه‌ی قابلیت‌ها بر پایه‌ی معماری پنج‌لایه‌ی درج‌شده در پروفایل شرکتی پارس · ۲۰۲۶</p>
      </div>
    </section>
  );
}

export function CorePlatformsSection() {
  return (
    <section className="core-platforms-section section-space" id="platforms">
      <div className="site-container">
        <SectionHeading
          eyebrow="پلتفرم‌های فناوری"
          title="زیرساخت‌های" emphasis="مشترک و ماژولار"
          copy="پروفایل پارس دو معماری پلتفرمی را معرفی می‌کند: لایه‌ی مشترک هوش مصنوعی برای سازمان و زیرساخت مالیِ قابل ترکیب برای خدمات و کیف پول."
        />
        <div className="platform-feature-grid">
          <article className="platform-feature-card" id="ai-fabric" data-reveal>
            <div className="platform-feature-kicker"><Network size={19} /><span>لایه‌ی مشترک هوشمندی</span></div>
            <h3>PARS AI Fabric</h3>
            <p>معماری معرفی‌شده، اپلیکیشن‌های سازمانی، کمک‌یارها، عامل‌های خودکار و خدمات حوزه‌ای را به زیرساخت هوشمندی مشترک متصل می‌کند.</p>
            <h4>اجزای کلیدی</h4>
            <ul className="content-chip-list">
              {aiFabricComponents.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <h4>مصرف‌کنندگان این لایه</h4>
            <ul className="content-chip-list content-chip-list--muted">
              {aiFabricConsumers.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article className="platform-feature-card" id="financial-infrastructure" data-reveal>
            <div className="platform-feature-kicker"><WalletCards size={19} /><span>خدمات مالی به‌مثابه زیرساخت</span></div>
            <h3>زیرساخت مالی و کیف پول به‌عنوان خدمت</h3>
            <p>یک معماری ماژولار برای ارائه‌ی قابلیت‌های مالیِ قابل استفاده‌ی مجدد به بانک‌ها، نهادهای مالی، سازمان‌ها و اکوسیستم‌ها.</p>
            <h4>بلوک‌های زیرساخت مالی</h4>
            <ul className="content-chip-list">
              {financialInfrastructureBlocks.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <h4>مدل‌های کیف پول</h4>
            <p className="platform-feature-detail">Wallet Studio / Wallet Factory</p>
            <ul className="content-chip-list content-chip-list--muted">
              {walletModels.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
        <p className="section-source-note">این بخش، اجزا و معماری‌های معرفی‌شده در پروفایل شرکتی را شرح می‌دهد؛ جزئیات فنی و تجاری تفصیلی تابع الزامات محرمانگی است.</p>
      </div>
    </section>
  );
}

export function OperatorStatusSection() {
  const steps = ['زیرساخت هوش مصنوعی', 'پلتفرم‌های هوش مصنوعی', 'خدمات هوش مصنوعی', 'اپراتور هوش مصنوعی', 'اکوسیستم‌های هوش مصنوعی'];
  return (
    <section className="operator-status-section section-space" id="ai-operator">
      <div className="site-container">
        <SectionHeading
          eyebrow="جهت‌گیری راهبردی"
          title="از ارائه‌ی هوش مصنوعی"
          emphasis="تا اپراتوری هوش مصنوعی"
          copy="پارس اعلام می‌کند که در حال پیگیری مجوز موردنیاز برای فعالیت به‌عنوان AI Operator در ایران است."
        />
        <div className="operator-status-panel" data-reveal>
          <div className="operator-status-label"><span className="signal-dot" /> مجوز در دست پیگیری</div>
          <ol className="operator-flow" aria-label="مسیر راهبردی اپراتوری هوش مصنوعی">
            {steps.map((step, index) => <li key={step}><span>{step}</span>{index < steps.length - 1 && <ArrowUpLeft size={16} aria-hidden="true" />}</li>)}
          </ol>
          <p>این موضوع در پروفایل به‌عنوان مسیر راهبردی و مجوزِ در حال پیگیری مطرح شده است؛ نه مجوز اخذشده.</p>
        </div>
      </div>
    </section>
  );
}

export function IndustriesSection() {
  return (
    <section className="industries-section section-space" id="industries">
      <div className="site-container">
        <div className="industries-showcase industries-showcase--bleed" data-reveal>
          <img
            {...responsiveImageProps('pars-industries-showcase.webp', '100vw')}
            alt=""
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="industries-showcase-content">
            <SectionHeading eyebrow="سرمایه‌گذاری خطرپذیر در فناوری" title="۱۱ حوزه‌ی تمرکز" emphasis="پارس" copy="حوزه‌ها مطابق فهرست به‌روز سرمایه‌گذاری پارس نمایش داده شده‌اند." light className="industries-showcase-heading" />
            <div className="industries-showcase-count"><strong>۱۱</strong><span>حوزه‌ی تمرکز<br />در فهرست جاری سایت</span></div>
          </div>
        </div>
        <div className="industry-grid">
          {industries.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                className={`industry-card tone-${item.tone}`}
                key={item.id}
                data-reveal
                style={{ '--industry-image-delay': `${(index % 6) * 45}ms`, '--industry-accent': item.brandColor, '--industry-accent-ink': ['#592C7A', '#6166AA'].includes(item.brandColor) ? '#fff' : '#17151D', '--industry-accent-text': ['#592C7A', '#6166AA'].includes(item.brandColor) ? '#fff' : item.brandColor }}
              >
                <img
                  {...responsiveImageProps(item.image, '(max-width: 560px) 50vw, (max-width: 900px) 50vw, 34vw')}
                  className="industry-card-image"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
                <span className="industry-card-top"><Icon size={21} strokeWidth={1.45} /></span>
                <span className="industry-card-english" dir="ltr">{item.english}</span>
                <strong>{item.title}</strong>
                {item.description && <p>{item.description}</p>}
              </article>
            );
          })}
        </div>
        <div className="industry-footnote">
          <span className="footnote-line" />
          <span>فهرست این صفحه مطابق طبقه‌بندی به‌روز حوزه‌های تمرکز پارس است.</span>
          <a href={pageHref('apply')}>ثبت درخواست سرمایه <ArrowUpLeft size={14} /></a>
        </div>
      </div>
    </section>
  );
}
export function InvestmentModelsSection() {
  return (
    <section className="investment-models-section section-space" id="investment-models">
      <div className="site-container">
        <SectionHeading
          eyebrow="سرمایه‌گذاری و ساخت کسب‌وکار"
          title="سرمایه در کنار فناوری،"
          emphasis="استعداد، داده و بازار"
          copy="پروفایل پارس، سرمایه‌گذاری و ساخت کسب‌وکار را در کنار فناوری، استعداد، داده و دسترسی به بازار قرار می‌دهد."
        />
        <div className="investment-model-equation" dir="rtl" data-reveal>
          <span>سرمایه</span><b>+</b><span>فناوری</span><b>+</b><span>استعداد</span><b>+</b><span>داده</span><b>+</b><span>دسترسی به بازار</span><ArrowLeft size={19} /><strong>کسب‌وکارهای تازه</strong>
        </div>
        <div className="investment-model-columns">
          <section className="investment-model-card" aria-labelledby="investment-structures-title">
            <h3 id="investment-structures-title">ساختارهای معرفی‌شده</h3>
            <ul className="content-chip-list">
              {investmentStructures.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="investment-model-card" aria-labelledby="venture-outcomes-title">
            <h3 id="venture-outcomes-title">خروجی‌های کسب‌وکار</h3>
            <ul className="content-chip-list content-chip-list--muted">
              {ventureOutcomes.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </div>
        <p className="section-source-note">این‌ها ساختارها و خروجی‌های کلی مندرج در پروفایل‌اند، نه فهرست شرکت‌ها یا معاملات انجام‌شده. معرفی سرمایه‌گذاری‌های منتخب تابع مجوز افشاست.</p>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="benefits-section section-space" id="benefits">
      <div className="site-container benefits-layout">
        <div className="benefits-intro">
          <SectionHeading eyebrow="توانمندسازهای اکوسیستم" title="پنج سازوکار" emphasis="برای پیوند فناوری و بازار" copy="پروفایل پارس پنج توانمندساز را معرفی می‌کند که مسیر استعداد، داده و پژوهش را به محصول، کسب‌وکار و رشد بازار پیوند می‌دهند." light />
          <div className="benefits-statement"><ParsGlyph /><p>از پژوهش<br />تا <em>رشد بازار</em></p></div>
          <a href={pageHref('approach')} className="button button-outline-light">مرور مدل فعالیت <ArrowUpLeft size={16} /></a>
        </div>
        <div className="benefits-grid">
          {ecosystemEnablers.map((item) => {
            const Icon = item.icon;
            return (
              <article className="benefit-card" key={item.id} data-reveal>
                <span className="benefit-number">{item.number}</span>
                <Icon size={22} strokeWidth={1.35} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="benefit-card-sequence">{item.sequence}</span>
                <span className="benefit-card-line" />
              </article>
            );
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
          <SectionHeading eyebrow="الگوی تجاری‌سازی فناوری" title="از پژوهش" emphasis="تا اکوسیستم" copy="پروفایل پارس، تبدیل فناوری‌های دارای ظرفیت به کسب‌وکارهای مقیاس‌پذیر را در شش مرحله توضیح می‌دهد." />
          <div className="process-time-note"><Info size={18} /><span>شش مرحله‌ی معرفی‌شده در پروفایل شرکتی پارس · ۲۰۲۶</span></div>
        </div>
        <div className="process-timeline process-timeline--six">
          <div className="process-timeline-line"><i /></div>
          {commercializationStages.map((step) => (
            <article className="process-step" key={step.number} data-reveal>
              <span className="process-node"><i /></span>
              <span className="process-step-number">مرحله‌ی {step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className="process-step-duration" dir="ltr">{step.english}</span>
            </article>
          ))}
        </div>
        <div className="process-cta"><span>برای گفت‌وگو درباره‌ی همکاری یا سرمایه‌گذاری</span><a href={pageHref('contact')} className="button button-dark">ارتباط با پارس <ArrowUpLeft size={16} /></a></div>
      </div>
    </section>
  );
}
export function PortfolioSection() {
  return (
    <section className="portfolio-section section-space" id="portfolio">
      <div className="site-container">
        <div className="section-heading-row portfolio-heading-row">
          <SectionHeading eyebrow="پرتفوی فناوری · نمایه‌ی ۲۰۲۶" title="محصول‌ها و پلتفرم‌ها" emphasis="در یک نگاه" copy="پروفایل شرکتی پارس، بیش از ۱۰۰ محصول و راهکار محصول‌محور را گزارش می‌کند و بخشی از نام‌های این سبد را فهرست کرده است." />
        </div>
        <figure className="editorial-visual editorial-visual--bleed portfolio-visual" data-reveal style={{ '--visual-delay': '70ms', '--visual-accent': '#592C7A' }}>
          <img
            {...responsiveImageProps('pars-portfolio-cinematic.webp', '100vw')}
            alt=""
            width="1536"
            height="864"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="editorial-visual-copy">
            <span className="eyebrow">پرتفوی فناوری</span>
            <strong>از محصول تا پلتفرم</strong>
          </figcaption>
        </figure>
        <section className="portfolio-inventory" aria-labelledby="portfolio-products-title">
          <div className="portfolio-inventory-heading">
            <span className="journey-eyebrow"><i aria-hidden="true" /> فهرست نام‌های درج‌شده در پروفایل</span>
            <h3 id="portfolio-products-title">محصول‌ها و راهکارها</h3>
            <p>نام‌های زیر در نمایه‌ی شرکتی پارس به‌عنوان محصول یا راهکار آمده‌اند.</p>
          </div>
          <ul className="portfolio-name-grid">
            {technologyProducts.map((name) => <li key={name} dir="ltr">{name}</li>)}
          </ul>
        </section>
        <section className="portfolio-inventory portfolio-inventory--brands" aria-labelledby="portfolio-brands-title">
          <div className="portfolio-inventory-heading">
            <span className="journey-eyebrow"><i aria-hidden="true" /> پلتفرم و برند</span>
            <h3 id="portfolio-brands-title">نام‌های معرفی‌شده</h3>
            <p>پروفایل، این نام‌ها را در جایگاه پلتفرم، سیستم‌عامل یا برندهای اکوسیستم پارس معرفی می‌کند.</p>
          </div>
          <ul className="portfolio-name-grid portfolio-name-grid--brands">
            {platformBrands.map((name) => <li key={name} dir="ltr">{name}</li>)}
          </ul>
        </section>
        <p className="portfolio-disclosure">این فهرست، نام‌های درج‌شده در پروفایل را بازتاب می‌دهد و به‌تنهایی وضعیت عرضه، مالکیت یا عملکرد هر مورد را مشخص نمی‌کند. شرح فنی و تجاری تفصیلی، مطابق پروفایل، مشمول محرمانگی و ارائه‌ی اطلاعات تحت NDA است.</p>
      </div>
    </section>
  );
}
export function NationalProgramsSection() {
  return (
    <section className="national-programs-section section-space" id="national-programs">
      <div className="site-container">
        <SectionHeading
          eyebrow="برنامه‌های ملی و دولتی"
          title="محورهای معرفی‌شده"
          emphasis="در مقیاس ملی"
          copy="پروفایل شرکتی پارس شش برنامه را در زیرساخت هوش مصنوعی، زنجیره‌ی تأمین، برنامه‌ریزی، آموزش و کشاورزی فهرست می‌کند."
        />
        <div className="national-program-grid">
          {nationalPrograms.map((program) => {
            const Icon = program.icon;
            return (
              <article className="national-program-card" key={program.number} data-reveal>
                <div className="national-program-top"><span>{program.number}</span><Icon size={21} strokeWidth={1.45} /></div>
                {program.scale && <strong className="national-program-scale">{program.scale}</strong>}
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                <small>{program.partners}</small>
              </article>
            );
          })}
        </div>
        <p className="national-program-disclosure">پروفایل ۲۰۲۶ می‌گوید این برنامه‌ها در مراحل متفاوت توسعه، اخذ مجوز و اجرا هستند؛ بنابراین ارقام مقیاسِ درج‌شده را نباید معادل تکمیل یا پوشش نهایی برنامه‌ها دانست.</p>
      </div>
    </section>
  );
}

export function MapSection() {
  const labelPlacement = {
    tabriz: { dx: 1.3, dy: -1.5, anchor: 'start' },
    tehran: { dx: 0, dy: -1.7, anchor: 'middle' },
    mashhad: { dx: -1.5, dy: -1.5, anchor: 'end' },
    isfahan: { dx: -1.6, dy: 2.4, anchor: 'end' },
    shiraz: { dx: -1.5, dy: 2.5, anchor: 'end' },
    'bandar-abbas': { dx: -1.5, dy: 2.6, anchor: 'end' },
  };
  return (
    <section className="map-section section-space" id="map">
      <div className="site-container map-layout map-layout-accurate">
        <div className="map-copy">
          <SectionHeading eyebrow="نمای شماتیک" title="تصویر مفهومی" emphasis="ایران" />
        </div>
        <div className="map-art-card map-art-card-accurate" data-reveal>
          <div className="map-card-head"><span><MapPin size={15} /> نقشه‌ی شماتیک ایران</span><span className="map-sample-tag"><i /> بدون داده‌ی استقرار</span></div>
          <div className="iran-map-stage">
            <div className="iran-map-scan" />
            <div className="iran-map-crosshair iran-map-crosshair-one" />
            <div className="iran-map-crosshair iran-map-crosshair-two" />
            <svg className="iran-map iran-map-accurate" viewBox={iranOutlineViewBox} role="img" aria-label="تصویر شماتیک ایران؛ نام شهرها، نقاط و خطوط صرفاً نمایشی‌اند">
              <defs>
                <linearGradient id="iranSurface" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#592C7A" stopOpacity=".09" />
                  <stop offset=".32" stopColor="#6166AA" stopOpacity=".16" />
                  <stop offset=".67" stopColor="#68A6D9" stopOpacity=".22" />
                  <stop offset="1" stopColor="#5CC6D9" stopOpacity=".2" />
                </linearGradient>
                <linearGradient id="iranBorder" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#592C7A" />
                  <stop offset=".34" stopColor="#6166AA" />
                  <stop offset=".68" stopColor="#68A6D9" />
                  <stop offset="1" stopColor="#5CC6D9" />
                </linearGradient>
                <clipPath id="iranClip"><path d={iranOutlinePath} /></clipPath>
              </defs>
              <path className="iran-map-shadow" d={iranOutlinePath} />
              <path className="iran-map-fill" d={iranOutlinePath} fill="url(#iranSurface)" />
              <g className="iran-map-topography" clipPath="url(#iranClip)">
                <path d="M594 348 C608 348 611 359 623 358 S638 350 657 352 M596 365 C608 362 614 370 625 370 S644 362 655 365 M598 383 C609 379 615 386 628 382 S643 376 655 380" />
                <path d="M612 338 C610 350 620 357 617 367 S623 380 620 395 M632 337 C630 350 638 361 632 371 S634 385 638 395" />
              </g>
              <g className="iran-map-routes" aria-hidden="true">
                <path d="M619.1 355.5 C613 352 609 349 604.9 347.5" />
                <path d="M619.1 355.5 C628 351 635 351 642.2 353.5" />
                <path d="M619.1 355.5 C618 360 618 362 620 365.5" />
                <path d="M619.1 355.5 C615 364 618 371 622.5 375.6" />
                <path d="M619.1 355.5 C623 367 627 378 632.8 383.8" />
              </g>
              <path className="iran-map-outline" d={iranOutlinePath} />
              <g className="iran-map-markers" aria-hidden="true">
                {iranCityMarkers.map((marker) => {
                  const label = labelPlacement[marker.id];
                  return (
                    <g className={`iran-map-city ${marker.featured ? 'is-featured' : ''}`} key={marker.id}>
                      <circle className="iran-map-city-pulse" cx={marker.x} cy={marker.y} r="1.1" />
                      <circle className="iran-map-city-dot" cx={marker.x} cy={marker.y} r={marker.featured ? '0.62' : '0.43'} />
                      <circle className="iran-map-city-core" cx={marker.x} cy={marker.y} r="0.18" />
                      <text className="iran-map-city-label" x={marker.x + label.dx} y={marker.y + label.dy} textAnchor={label.anchor}>{marker.label}</text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
          <div className="map-legend"><span><i className="legend-lime" /> نام‌های نمایشی</span><span><i className="legend-copper" /> پیوندهای مفهومی</span></div>
          <p className="map-disclosure">این تصویر شماتیک است و محل اجرای برنامه‌ها، حضور عملیاتی یا مسیر جغرافیایی تأییدشده را نشان نمی‌دهد.</p>
        </div>
      </div>
    </section>
  );
}

export function PartnershipModelsSection() {
  return (
    <section className="partnership-models-section section-space" id="partnership-models">
      <div className="site-container">
        <SectionHeading
          eyebrow="همکاری راهبردی"
          title="هشت راه"
          emphasis="برای ساختن با پارس"
          copy="پروفایل پارس، مدل‌های زیر را برای همکاری فناورانه، تجاری و سرمایه‌گذاری معرفی می‌کند؛ برخی از آن‌ها می‌توانند با هم ترکیب شوند."
        />
        <div className="partnership-model-grid">
          {partnershipModels.map((model) => {
            const Icon = model.icon;
            return (
              <article className="partnership-model-card" key={model.number} data-reveal>
                <span className="partnership-model-number">{model.number}</span>
                <Icon size={22} strokeWidth={1.4} />
                <h3>{model.title}</h3>
                <small dir="ltr">{model.english}</small>
                <p>{model.description}</p>
              </article>
            );
          })}
        </div>
        <p className="section-source-note">طبق پروفایل، همکاری‌ها می‌توانند از شراکت فناوری آغاز شوند و با توافق طرفین به توسعه‌ی مشترک، کسب‌وکار مشترک یا سرمایه‌گذاری سهامی گسترش یابند.</p>
      </div>
    </section>
  );
}

export function ToolsSection({ onOpenTool }) {
  const tools = [
    { id: 'valuation', title: 'ارزش‌گذاری استارتاپ', description: 'با مبلغ جذب و سهم پیشنهادی، ارزش تقریبی شرکت را برآورد کنید', icon: ChartNoAxesCombined, tag: 'ارزش‌گذاری' },
    { id: 'runway', title: 'دوام نقدینگی (Runway)', description: 'با نقدینگی و هزینه‌ی ماهانه بدانید منابع‌تان تا چند ماه کافی است', icon: Activity, tag: 'مدیریت نقدینگی' },
    { id: 'dilution', title: 'رقیق‌شدن سهام', description: 'اثر جذب سرمایه بر سهم بنیان‌گذاران را ببینید', icon: PieChart, tag: 'سهام‌داری' },
    { id: 'captable', title: 'جدول سهامداری (Cap Table)', description: 'ساختار سهامداری پیش و پس از دور جدید', icon: WalletCards, tag: 'سهم‌داران' },
    { id: 'cac', title: 'هزینه‌ی جذب مشتری (CAC)', description: 'هزینه‌ی به‌دست‌آوردن هر مشتری جدید', icon: Gauge, tag: 'اقتصاد واحد' },
    { id: 'ltv', title: 'ارزش طول عمر مشتری (LTV)', description: 'درآمد تقریبی هر مشتری در کل دوره‌ی همکاری با شما', icon: LineChart, tag: 'درآمد' },
    { id: 'saas', title: 'شاخص‌های SaaS', description: 'درآمد تکرارشونده و نرخ رشد ماهانه', icon: BarChart3, tag: 'درآمد تکرارشونده' },
  ];
  return (
    <section className="tools-section section-space" id="tools">
      <div className="site-container">
        <div className="section-heading-row"><SectionHeading eyebrow="ابزارهای استارتاپی" title="با عدد" emphasis="تصمیم بگیرید" copy="محاسبه‌گرهای ساده برای پرسش‌هایی که پیش از جذب سرمایه، رشد یا مذاکره پیش می‌آید" /><div className="tools-data-note"><ShieldCheck size={18} /><span>محاسبه‌ها در مرورگر شما انجام می‌شود و هیچ داده‌ای به سرور ارسال نمی‌شود</span></div></div>
        <figure className="editorial-visual editorial-visual--bleed tools-visual" data-reveal style={{ '--visual-delay': '70ms', '--visual-accent': '#68A6D9' }}>
          <img
            {...responsiveImageProps('pars-tools-analysis.webp', '100vw')}
            alt=""
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="editorial-visual-copy">
            <strong>عددها را با دقت بررسی کنید</strong>
          </figcaption>
        </figure>
        <div className="tools-grid">{tools.map((tool) => {
          const Icon = tool.icon;
          return <button type="button" className="tool-card" key={tool.id} onClick={() => onOpenTool(tool.id)} data-reveal><span className="tool-card-top"><Icon size={21} strokeWidth={1.5} /></span><span className="tool-card-tag">{tool.tag}</span><strong>{tool.title}</strong><p>{tool.description}</p><span className="tool-card-action">استفاده از ابزار <ArrowUpLeft size={15} /></span></button>;
        })}</div>
        <div className="tools-bottom"><span>نتایج برآوردی‌اند و پیش‌بینی قطعی یا توصیه‌ی سرمایه‌گذاری نیستند</span><a href={pageHref('apply')} className="text-link">درخواست سرمایه <ArrowUpLeft size={15} /></a></div>
      </div>
    </section>
  );
}

export function NewsSection() {
  return (
    <section className="news-section section-space" id="news">
      <div className="site-container">
        <div className="section-heading-row">
          <SectionHeading
            eyebrow="تجربه‌های سازمانی"
            title="محورهای تجربه‌ی"
            emphasis="معرفی‌شده در پروفایل"
            copy="پروفایل پارس، نمونه‌هایی از تجربه‌ی سازمانی را در بانکداری، بیمه، فناوری و بخش عمومی فهرست می‌کند."
          />
          <a href={pageHref('contact')} className="text-link">گفت‌وگو درباره‌ی همکاری <ArrowUpLeft size={15} /></a>
        </div>
        <figure className="editorial-visual editorial-visual--bleed news-visual" data-reveal style={{ '--visual-delay': '60ms', '--visual-accent': '#6166AA' }}>
          <img
            {...responsiveImageProps('pars-news-editorial.webp', '100vw')}
            alt=""
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="editorial-visual-copy"><strong>فناوری سازمانی، از زیرساخت تا خدمات</strong></figcaption>
        </figure>
        <ul className="experience-area-grid">
          {experienceAreas.map((area) => <li key={area} data-reveal>{area}</li>)}
        </ul>
        <div className="experience-disclosure">
          <BookOpen size={20} />
          <p>پروفایل، این محورها را به‌عنوان تجربه‌ها و پروژه‌های منتخب معرفی می‌کند؛ نام مشتریان و نتایج موردی در فهرست عمومی درج نشده است. شرح فنی و تجاری پرونده‌های منتخب، با رعایت محرمانگی و NDA قابل ارائه است.</p>
        </div>
      </div>
    </section>
  );
}
export function AboutSection() {
  return (
    <section className="about-section section-space" id="about">
      <div className="site-container">
        <div className="about-top">
          <SectionHeading
            eyebrow="درباره‌ی پارس"
            title="یک گروه فناوری"
            emphasis="از زیرساخت تا کسب‌وکار"
            copy="پروفایل شرکتی ۲۰۲۶، پارس را شرکت فناوری و نوآوری ایرانی معرفی می‌کند؛ با مدلی یکپارچه در هوش مصنوعی، زیرساخت دیجیتال، داده، تحول سازمانی، سرمایه‌گذاری فناوری و ساخت کسب‌وکار."
          />
        </div>
        <figure className="editorial-visual editorial-visual--bleed about-visual" data-reveal style={{ '--visual-delay': '90ms', '--visual-accent': '#5CC6D9' }}>
          <img
            {...responsiveImageProps('pars-about-editorial.webp', '100vw')}
            alt=""
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="editorial-visual-copy"><strong>چهار قابلیت در یک مدل عملیاتی یکپارچه</strong></figcaption>
        </figure>
        <div className="about-values-grid">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="about-value-card" key={item.id} data-reveal>
                <span className="about-value-number">۰{index + 1}</span>
                <Icon size={21} />
                <span className="about-value-english" dir="ltr">{item.english}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function MarketModelSection() {
  return (
    <section className="market-model-section section-space" id="market-model">
      <div className="site-container">
        <SectionHeading
          eyebrow="جایگاه و مدل کسب‌وکار"
          title="در تقاطع چهار بازار"
          emphasis="فناوری تا سرمایه‌گذاری"
          copy="پروفایل شرکتی پارس، فعالیت گروه را در چهار بازار و چند گروه مشتری معرفی می‌کند."
        />
        <div className="business-market-grid">
          {businessMarkets.map((market) => {
            const Icon = market.icon;
            return <article className="business-market-card" key={market.title} data-reveal><Icon size={21} /><span dir="ltr">{market.english}</span><h3>{market.title}</h3><p>{market.description}</p></article>;
          })}
        </div>
        <div className="market-model-lists">
          <section>
            <h3>گروه‌های مشتری و بازار</h3>
            <ul className="content-chip-list content-chip-list--muted">{customerSegments.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h3>جریان‌های درآمدی معرفی‌شده</h3>
            <ul className="content-chip-list">{revenueStreams.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>
        <p className="section-source-note">پروفایل، مدل‌های درآمدی را فهرست می‌کند اما مبلغ، سهم یا نسبت هر جریان را اعلام نمی‌کند.</p>
      </div>
    </section>
  );
}

export function WhyParsSection() {
  return (
    <section className="why-pars-section section-space" id="why-pars">
      <div className="site-container">
        <SectionHeading
          eyebrow="ویژگی‌های مدل پارس"
          title="فناوری، سرمایه و بازار"
          emphasis="در یک مدل یکپارچه"
          copy="این هشت ویژگی، جمع‌بندیِ نحوه‌ی معرفی مدل پارس در پروفایل شرکتی ۲۰۲۶ است."
        />
        <div className="why-pars-grid">
          {whyParsFeatures.map((feature) => <article className="why-pars-card" key={feature.number} data-reveal><span>{feature.number}</span><h3>{feature.title}</h3><p>{feature.description}</p></article>)}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const values = new FormData(formElement);
    setSubmitting(true);
    setFormStatus(null);
    try {
      const { data } = await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: values.get('contactName'),
          contact: values.get('contactWay'),
          topic: values.get('contactTopic'),
          message: values.get('contactMessage'),
          companyWebsite: values.get('companyWebsite'),
        }),
      });
      if (!data?.stored || !data?.id) throw new Error('پاسخ ثبت پیام معتبر نیست؛ پیام ثبت‌شده تلقی نمی‌شود.');
      formElement.reset();
      setFormStatus({ type: 'success', message: `پیام شما با شناسه‌ی ${data.id.slice(0, 8).toUpperCase()} در سامانه ثبت شد.` });
    } catch (error) {
      setFormStatus({ type: 'error', message: error?.message || 'اتصال به سامانه برقرار نشد؛ پیام شما ثبت نشده است.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-section section-space" id="contact">
      <div className="site-container contact-layout">
        <div className="contact-copy">
          <SectionHeading eyebrow="تماس و همکاری" title="برای گفت‌وگو درباره‌ی" emphasis="فناوری و مشارکت" copy="موضوع پیام را انتخاب کنید و راه ارتباطی خود را بنویسید؛ ثبت پیام فقط پس از پاسخ موفق سامانه تأیید می‌شود." />
          <figure className="editorial-visual editorial-visual--bleed contact-visual" data-reveal style={{ '--visual-delay': '80ms', '--visual-accent': '#5CC6D9' }}>
            <img
              {...responsiveImageProps('pars-contact-editorial.webp', '100vw')}
              alt=""
              width="1536"
              height="1024"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption className="editorial-visual-copy">
              <strong>مسیر گفت‌وگو از این‌جا آغاز می‌شود</strong>
            </figcaption>
          </figure>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <div className="contact-form-top"><span className="eyebrow">فرم تماس کوتاه</span><span>ثبت پیام پس از پاسخ موفق سامانه</span></div>
          <label><span>نام شما</span><input required name="contactName" maxLength={120} placeholder="نام و نام خانوادگی" /></label>
          <label><span>ایمیل یا شماره‌ی تماس</span><input required name="contactWay" dir="auto" maxLength={254} placeholder="ایمیل یا شماره‌ای که پاسخ را دریافت کنید" /></label>
          <label><span>موضوع پیام</span><select name="contactTopic" defaultValue="شراکت فناوری">
            <option>شراکت فناوری</option>
            <option>انتقال و بومی‌سازی فناوری</option>
            <option>توسعه‌ی مشترک</option>
            <option>کسب‌وکار مشترک</option>
            <option>سرمایه‌گذاری راهبردی</option>
            <option>مجوز فناوری</option>
            <option>ورود به بازار ایران</option>
            <option>توسعه‌ی منطقه‌ای</option>
            <option>رسانه</option>
            <option>پرسش عمومی</option>
          </select></label>
          <label><span>پیام</span><textarea required name="contactMessage" rows="3" maxLength={5000} placeholder="پیام خود را بنویسید…" /></label>
          <input className="contact-honeypot" type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {formStatus && <div className={formStatus.type === 'success' ? 'form-inline-notice' : 'form-inline-error'} role={formStatus.type === 'success' ? 'status' : 'alert'}><Info size={15} />{formStatus.message}</div>}
          <button type="submit" className="button button-lime" disabled={submitting}>{submitting ? 'در حال ثبت…' : 'ارسال پیام'} <ArrowUpLeft size={15} /></button>
        </form>
      </div>
    </section>
  );
}

export function FinalCallout() {
  return (
    <section className="final-callout" id="campaign">
      <div className="final-callout-orbit" aria-hidden="true"><ParsGlyph /></div>
      <div className="site-container final-callout-content"><SectionEyebrow light>درخواست سرمایه</SectionEyebrow><h2>مسیر فناوری‌تان<br /><em>به گام بعدی رسیده است؟</em></h2><p>اطلاعات تیم، محصول و نیاز سرمایه را در فرم درخواست ثبت کنید.</p><div className="final-callout-actions"><a href={pageHref('apply')} className="button button-lime button-large">شروع درخواست سرمایه <ArrowUpLeft size={17} /></a><a href={pageHref('contact')} className="button button-outline-light">گفت‌وگو درباره‌ی همکاری <ArrowUpLeft size={15} /></a></div><span className="final-callout-note">ارسال فرم به‌تنهایی به‌معنای پذیرش یا تعهد سرمایه‌گذاری نیست.</span></div>
    </section>
  );
}
export function FooterSection() {
  const year = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date());
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <a className="brand-lockup" href={pageHref('home')}>
            <span className="brand-symbol"><CrystalMark /></span>
            <span className="brand-name-stack"><strong>پارس</strong></span>
          </a>
          <p>از زیرساخت تا هوشمندی؛ از فناوری تا کسب‌وکار</p>
          <a href={pageHref('investment')} className="button button-outline-light">سرمایه‌گذاری خطرپذیر <ArrowUpLeft size={15} /></a>
        </div>
        <div className="footer-main">
          <div className="footer-sitemap">
            <div><strong>پارس</strong><a href={pageHref('about')}>درباره‌ی پارس</a><a href={pageHref('news')}>تجربه‌ها</a><a href={pageHref('contact')}>تماس و همکاری</a></div>
            <div><strong>سرمایه‌گذاری خطرپذیر</strong><a href={pageHref('investment')}>نمای کلی</a><a href={pageHref('approach')}>مدل فعالیت</a><a href={pageHref('industries')}>حوزه‌ها</a><a href={pageHref('portfolio')}>پرتفوی فناوری</a><a href={pageHref('tools')}>ابزارها</a></div>
            <div><strong>درخواست و راهنما</strong><a href={pageHref('apply')}>درخواست سرمایه</a><a href={pageHref('track')}>پیگیری درخواست</a><a href={pageHref('sitemap')}>نقشه‌ی سایت</a></div>
          </div>
          <div className="footer-status">
            <span className="eyebrow">سرمایه‌گذاری خطرپذیر</span>
            <strong><i className="status-indicator" /> در صفحه‌ای مستقل</strong>
            <small>فناوری، حوزه‌ها و ساخت کسب‌وکار</small>
            <a href={pageHref('investment')}>ورود به این بخش <ArrowUpLeft size={13} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} پارس · کلیه‌ی حقوق محفوظ است</span>
          <div><a href={pageHref('terms')}>قوانین و مقررات</a><a href={pageHref('privacy')}>حریم خصوصی</a><a href={pageHref('contact')}>پشتیبانی</a></div>
          <span className="footer-made">از زیرساخت تا کسب‌وکار</span>
        </div>
      </div>
      <small className="footer-attribution site-container">منبع نقشه‌ی ایران: Victor Cazanave، @svg-maps/world · مجوز CC BY 4.0</small>
    </footer>
  );
}

export function CookieNotice({ choice, onSave }) {
  const [open, setOpen] = useState(false);
  if (choice || open) return null;
  return (
    <aside className="cookie-notice" aria-label="تنظیمات حریم خصوصی"><div className="cookie-notice-symbol"><CrystalMark /></div><div className="cookie-notice-copy"><strong>حریم خصوصی، انتخاب شماست</strong><p>این سایت از ابزار تحلیل بازدید استفاده نمی‌کند؛ فقط انتخاب شما درباره‌ی حریم خصوصی ذخیره می‌شود</p></div><div className="cookie-notice-actions"><button type="button" onClick={() => onSave('essential')}>فقط ضروری</button><button type="button" className="cookie-accept" onClick={() => onSave('all')}>متوجه شدم <Check size={13} /></button></div><button className="cookie-dismiss" type="button" onClick={() => { onSave('essential'); setOpen(true); }} aria-label="بستن پیام"><X size={14} /></button></aside>
  );
}
