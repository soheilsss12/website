import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowDown,
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
  industries,
  processSteps,
  valuePillars,
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

const HERO_TITLE_LINE_ONE = 'در کنار کسانی';
const HERO_TITLE_LINE_TWO = 'که آینده می‌سازند';
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
    stage: 'شناخت مسئله',
    image: 'pars-journey-discovery.webp',
    title: 'از مسئله‌ای واقعی آغاز کنیم',
    description: 'گفت‌وگوی روشن کمک می‌کند نیاز واقعی را از فرضیه جدا کنیم و مسیر بررسی را بهتر بشناسیم.',
  },
  {
    stage: 'ساخت محصول',
    image: 'pars-journey-prototype.webp',
    title: 'راه‌حل را در عمل بسنجیم',
    description: 'شناخت محصول و توان تیم، پایه‌ی تصمیم‌های دقیق‌تر و گام‌های بعدی است.',
  },
  {
    stage: 'آمادگی برای رشد',
    image: 'pars-journey-growth.webp',
    title: 'برای رشد، زیرساخت بسازیم',
    description: 'سرمایه، تجربه و ارتباطات زمانی اثرگذارند که با نیاز کسب‌وکار هم‌راستا باشند.',
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
          <h1 id="brand-home-title">پارس، رو به<br /><em>افق‌های تازه</em></h1>
          <p>هر افق تازه، از یک نگاه روشن آغاز می‌شود.</p>
          <div className="brand-home-actions">
            <a href={pageHref('about')} className="button button-lime button-large">آشنایی با پارس <ArrowUpLeft size={17} /></a>
            <a href={pageHref('investment')} className="button button-outline-light button-large">بخش سرمایه‌گذاری <ArrowUpLeft size={15} /></a>
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
          <div className="hero-kicker hero-kicker-pars"><span className="hero-kicker-icon"><ChartNoAxesCombined size={14} /></span> سرمایه‌گذاری</div>
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
          <p className="hero-description">پارس در کنار تیم‌هایی می‌ایستد که مسئله‌ای واقعی را به کسب‌وکاری پایدار تبدیل می‌کنند؛ با سرمایه، تجربه و شبکه‌ی ارتباطی</p>
          <div className="hero-actions hero-pars-actions">
            <a className="button button-lime button-large" href={pageHref('apply')}>شروع درخواست <ArrowUpLeft size={17} /></a>
            <a className="button button-outline-light button-large" href={pageHref('approach')}>با رویکرد ما آشنا شوید <ArrowDown size={15} /></a>
          </div>
          <div className="hero-value-strip">
            <div><span><small>سرمایه</small><strong>برای فرصت‌های واقعی</strong></span></div>
            <div><span><small>تجربه و شبکه</small><strong>فراتر از تأمین مالی</strong></span></div>
            <div><span><small>همراهی بلندمدت</small><strong>از ایده تا رشد</strong></span></div>
          </div>
          <div className="hero-campaign-note"><span><i /></span> شرایط هر دوره در اطلاعیه‌ی رسمی همان دوره اعلام می‌شود</div>
        </div>
      </div>
      <div className="hero-bottomline hero-pars-bottomline site-container">
        <a href={pageHref('industries')} className="hero-scroll-cue"><span><ArrowDown size={14} /></span> حوزه‌های سرمایه‌گذاری را ببینید</a>
        <span className="hero-bottomline-note">سرمایه وقتی ارزش دارد که به رشدی واقعی برسد</span>
        <span className="hero-bottom-index">پارس</span>
      </div>
    </section>
  );
}
export function StatsRibbon() {
  const stats = [
    { value: '۱۱', title: 'حوزه‌ی سرمایه‌گذاری', note: 'از انرژی تا محتوا', icon: Compass },
    { value: '۰۴', title: 'گام در فرم درخواست', note: 'از اطلاعات تماس تا تأیید', icon: ChartNoAxesCombined },
  ];
  return (
    <section className="stats-ribbon site-container" aria-label="بخش سرمایه‌گذاری در یک نگاه">
      <div className="stats-ribbon-label"><span className="signal-dot" /> بخش سرمایه‌گذاری</div>
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
      route: 'about',
      label: 'پارس',
      title: 'نگاهی به پارس',
      description: 'با نگاه و ارزش‌های پارس آشنا شوید.',
      image: 'pars-highlight-domains.webp',
      layout: 'feature',
    },
    {
      route: 'news',
      label: 'روایت‌ها',
      title: 'یادداشت‌ها و دیدگاه‌ها',
      description: 'نگاهی به روایت‌ها و دیدگاه‌های پارس.',
      image: 'pars-highlight-approach.webp',
      layout: 'compact',
    },
    {
      route: 'contact',
      label: 'ارتباط',
      title: 'گفت‌وگو از همین‌جا',
      description: 'راهی برای تماس با پارس.',
      image: 'pars-highlight-portfolio.webp',
      layout: 'compact',
    },
    {
      route: 'investment',
      label: 'بخش سرمایه‌گذاری',
      title: 'مسیر مستقل سرمایه‌گذاری',
      description: 'رویکرد، حوزه‌ها و ابزارها را در یک بخش جداگانه ببینید.',
      image: 'pars-highlight-stories.webp',
      layout: 'wide',
    },
  ];

  return (
    <section className="home-highlights section-space" id="home-highlights" aria-labelledby="home-highlights-title">
      <div className="site-container">
        <div className="home-highlights-heading" data-reveal>
          <div>
            <span className="journey-eyebrow"><i aria-hidden="true" /> مسیرهای پارس</span>
            <h2 id="home-highlights-title">یک نام، <em>چندین افق</em></h2>
          </div>
          <p>از آشنایی با پارس تا دسترسی به بخش سرمایه‌گذاری.</p>
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
                {...responsiveImageProps(item.image, '(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 42vw')}
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
    { route: 'approach', label: 'رویکرد', title: 'از شناخت مسئله تا رشد', description: 'نگاهی به مسیر همراهی با تیم‌ها.', icon: Compass },
    { route: 'industries', label: 'حوزه‌ها', title: '۱۱ حوزه‌ی سرمایه‌گذاری', description: 'حوزه‌های تأییدشده را یک‌جا ببینید.', icon: Network },
    { route: 'portfolio', label: 'پرتفوی', title: 'پرتفوی پارس', description: 'مرور بخش پرتفوی.', icon: Building2 },
    { route: 'tools', label: 'ابزارها', title: 'برای تصمیم‌های روشن‌تر', description: 'محاسبه‌گرها و ابزارهای استارتاپی.', icon: ChartNoAxesCombined },
  ];
  return (
    <section className="investment-overview section-space" aria-labelledby="investment-overview-title">
      <div className="site-container">
        <div className="investment-overview-heading" data-reveal>
          <span className="journey-eyebrow"><i aria-hidden="true" /> بخش سرمایه‌گذاری</span>
          <h2 id="investment-overview-title">از کجا <em>شروع کنیم؟</em></h2>
          <p>هر مسیر را در صفحه‌ی مستقل خودش دنبال کنید.</p>
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
        <span className="journey-eyebrow"><i aria-hidden="true" /> پارس</span>
        <h2>هر گفت‌وگوی خوب،<br /><em>آغازی برای افق تازه</em></h2>
        <a href={pageHref('contact')} className="button button-lime button-large">با پارس در تماس باشید <ArrowUpLeft size={16} /></a>
      </div>
    </section>
  );
}

export function ManifestoSection() {
  return (
    <section className="manifesto-section" id="approach">
      <div className="manifesto-inner site-container">
        <div className="manifesto-aside" data-reveal><span>نگاه پارس</span><span className="manifesto-asterisk">✳</span><small>سرمایه وقتی ارزش دارد<br />که به رشدی واقعی برسد</small></div>
        <div className="manifesto-copy" data-reveal>
          <SectionEyebrow>مانیفست ما</SectionEyebrow>
          <h2>سرمایه فقط پول نیست؛<br /> <em>شتابی برای ساختن است</em></h2>
          <p>باور داریم کسب‌وکارهای موفق با یک تصمیم ساخته نمی‌شوند. سرمایه باید در کنار تجربه، ارتباطات و پاسخ‌گویی قرار بگیرد تا تیم‌ها بتوانند مسئله‌های مهم را به محصولاتی پایدار تبدیل کنند</p>
          <a href={pageHref('approach')} className="text-link text-link-dark">نگاه سرمایه‌گذاری پارس <ArrowUpLeft size={16} /></a>
        </div>
        <div className="manifesto-mark" aria-hidden="true"><ParsGlyph /><span>بخش سرمایه‌گذاری</span></div>
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
            <h2 id="journey-title">از شناخت مسئله<br /><em>تا آمادگی برای رشد</em></h2>
          </div>
          <p>روایتی سه‌مرحله‌ای از فهم مسئله تا ساختن راهی برای رشد.</p>
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

export function IndustriesSection() {
  return (
    <section className="industries-section section-space" id="industries">
      <div className="site-container">
        <div className="industries-showcase" data-reveal>
          <img
            {...responsiveImageProps('pars-industries-showcase.webp', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px')}
            alt=""
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="industries-showcase-content">
            <SectionHeading eyebrow="بخش سرمایه‌گذاری" title="سرمایه برای" emphasis="حل مسئله‌های واقعی" copy="۱۱ حوزه برای ساخت راه‌حل‌های تازه" light className="industries-showcase-heading" />
            <div className="industries-showcase-count"><strong>۱۱</strong><span>حوزه‌ی سرمایه‌گذاری<br />با یک نگاه مسئله‌محور</span></div>
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
                  {...responsiveImageProps(item.image, '(max-width: 560px) 92vw, (max-width: 900px) 44vw, 30vw')}
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
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
        <div className="industry-footnote"><span className="footnote-line" /><a href={pageHref('apply')}>شرایط پذیرش <ArrowUpLeft size={14} /></a></div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="benefits-section section-space" id="benefits">
      <div className="site-container benefits-layout">
        <div className="benefits-intro">
          <SectionHeading eyebrow="بیشتر از سرمایه" title="ارزش واقعی" emphasis="در همراهی است" copy="هر تیم نیاز متفاوتی دارد؛ مسیر همکاری را بر اساس مهم‌ترین مانع رشد همان تیم طراحی می‌کنیم" light />
          <div className="benefits-statement"><ParsGlyph /><p>سرمایه‌ی مالی،<br />به‌همراه <em>شبکه‌ی ارتباطی</em></p></div>
          <a href={pageHref('approach')} className="button button-outline-light">همه‌ی پشتیبانی‌ها <ArrowUpLeft size={16} /></a>
        </div>
        <div className="benefits-grid">
          {valuePillars.map((item) => {
            const Icon = item.icon;
            return <article className="benefit-card" key={item.id} data-reveal><Icon size={22} strokeWidth={1.35} /><h3>{item.title}</h3><p>{item.description}</p><span className="benefit-card-line" /></article>;
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
          <SectionHeading eyebrow="فرم درخواست" title="در چهار گام" emphasis="اطلاعات‌تان را ثبت کنید" copy="فرم مرحله‌ای اطلاعات تماس، محصول، نیاز سرمایه و مدارک را می‌گیرد" />
          <div className="process-time-note"><Check size={18} /><span>ارسال فرم فقط پس از پاسخ موفق سامانه تأیید می‌شود</span></div>
        </div>
        <div className="process-timeline">
          <div className="process-timeline-line"><i /></div>
          {processSteps.map((step) => <article className="process-step" key={step.number} data-reveal><span className="process-node"><i /></span><span className="process-step-number">{step.number} / ۰۴</span><h3>{step.title}</h3><p>{step.description}</p><span className="process-step-duration">گام {step.number} از ۰۴</span></article>)}
        </div>
        <div className="process-cta"><span>برای ثبت درخواست آماده‌اید؟</span><a href={pageHref('apply')} className="button button-dark">شروع درخواست <ArrowUpLeft size={16} /></a></div>
      </div>
    </section>
  );
}

export function PortfolioSection() {
  return (
    <section className="portfolio-section section-space" id="portfolio">
      <div className="site-container">
        <div className="section-heading-row portfolio-heading-row">
          <SectionHeading eyebrow="بخش سرمایه‌گذاری" title="پرتفوی" emphasis="پارس" />
        </div>
        <figure className="editorial-visual portfolio-visual" data-reveal style={{ '--visual-delay': '70ms', '--visual-accent': '#592C7A' }}>
          <img
            {...responsiveImageProps('pars-portfolio-editorial.webp', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px')}
            alt=""
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="editorial-visual-copy">
            <span className="eyebrow">پرتفوی</span>
            <strong>مسیرهای رشد</strong>
          </figcaption>
        </figure>
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
          <SectionHeading eyebrow="گستره‌ی جغرافیایی" title="نقشه‌ی" emphasis="ایران" />
        </div>
        <div className="map-art-card map-art-card-accurate" data-reveal>
          <div className="map-card-head"><span><MapPin size={15} /> گستره‌ی ایران</span><span className="map-sample-tag"><i /> نمای شماتیک</span></div>
          <div className="iran-map-stage">
            <div className="iran-map-scan" />
            <div className="iran-map-crosshair iran-map-crosshair-one" />
            <div className="iran-map-crosshair iran-map-crosshair-two" />
            <svg className="iran-map iran-map-accurate" viewBox={iranOutlineViewBox} role="img" aria-label="نقشه‌ی شماتیک ایران و نام چند شهر">
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
          <div className="map-legend"><span><i className="legend-lime" /> شهرها</span><span><i className="legend-copper" /> مسیرها</span></div>
        </div>
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
        <figure className="editorial-visual tools-visual" data-reveal style={{ '--visual-delay': '70ms', '--visual-accent': '#68A6D9' }}>
          <img
            {...responsiveImageProps('pars-tools-analysis.webp', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px')}
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
          <SectionHeading eyebrow="روایت‌ها" title="نگاهی تازه" emphasis="به جهان پیرامون" copy="یادداشت‌ها و دیدگاه‌های پارس." />
          <a href={pageHref('contact')} className="text-link">با پارس گفت‌وگو کنید <ArrowUpLeft size={15} /></a>
        </div>
        <figure className="editorial-visual news-visual" data-reveal style={{ '--visual-delay': '60ms', '--visual-accent': '#6166AA' }}>
          <img
            {...responsiveImageProps('pars-news-editorial.webp', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px')}
            alt=""
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="editorial-visual-copy">
            <strong>روایت‌ها و دیدگاه‌ها</strong>
          </figcaption>
        </figure>
        <div className="news-empty">
          <div className="news-empty-icon"><BookOpen size={24} /></div>
          <div><span className="eyebrow">روایت‌ها</span><h3>روایت تازه‌ای این‌جا نیست</h3></div>
          <a href={pageHref('contact')} className="button button-outline">با پارس در تماس باشید <ArrowUpLeft size={14} /></a>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const values = [
    { title: 'نگاه بلندمدت', description: 'دیدن مسیر، نه فقط لحظه.', icon: Compass },
    { title: 'گفت‌وگوی روشن', description: 'پرسیدن، شنیدن و دقیق‌تر دیدن.', icon: HeartHandshake },
    { title: 'افق‌های تازه', description: 'جست‌وجوی راه‌های ممکن.', icon: BookOpen },
  ];
  return (
    <section className="about-section section-space" id="about">
      <div className="site-container">
        <div className="about-top">
          <SectionHeading eyebrow="درباره‌ی پارس" title="پارس، رو به" emphasis="افق‌های تازه" copy="نگاهی به مسیرها و پرسش‌هایی که آینده را پیش روی ما می‌گذارند." />
        </div>
        <figure className="editorial-visual about-visual" data-reveal style={{ '--visual-delay': '90ms', '--visual-accent': '#5CC6D9' }}>
          <img
            {...responsiveImageProps('pars-about-editorial.webp', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px')}
            alt=""
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="editorial-visual-copy">
            <strong>هر مسیر تازه، با نگاهی روشن</strong>
          </figcaption>
        </figure>
        <div className="about-values-grid">{values.map((item) => {
          const Icon = item.icon;
          return <article className="about-value-card" key={item.title} data-reveal><Icon size={21} /><h3>{item.title}</h3><p>{item.description}</p></article>;
        })}</div>
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
          <SectionHeading eyebrow="تماس با پارس" title="یک گفت‌وگوی خوب" emphasis="از این‌جا شروع می‌شود" copy="برای پرسش درباره‌ی همکاری یا رسانه، پیام بگذارید" />
          <figure className="editorial-visual contact-visual" data-reveal style={{ '--visual-delay': '80ms', '--visual-accent': '#5CC6D9' }}>
            <img
              {...responsiveImageProps('pars-contact-editorial.webp', '(max-width: 760px) calc(100vw - 40px), 48vw')}
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
          <label><span>موضوع پیام</span><select name="contactTopic" defaultValue="همکاری"><option>همکاری</option><option>رسانه</option><option>پرسش عمومی</option><option>پیشنهاد شراکت</option></select></label>
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
      <div className="site-container final-callout-content"><SectionEyebrow light>مسیر بعدی</SectionEyebrow><h2>طرح شما برای<br /><em>گام بعدی آماده است؟</em></h2><p>شرایط هر دوره را بخوانید و فرم درخواست سرمایه را گام‌به‌گام تکمیل کنید</p><div className="final-callout-actions"><a href={pageHref('apply')} className="button button-lime button-large">شروع درخواست سرمایه <ArrowUpLeft size={17} /></a><a href={pageHref('contact')} className="button button-outline-light">پرسشی دارید؟ <ArrowUpLeft size={15} /></a></div><span className="final-callout-note">شرایط هر دوره را در صفحه‌ی درخواست بخوانید</span></div>
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
          <p>پارس، رو به افق‌های تازه</p>
          <a href={pageHref('investment')} className="button button-outline-light">بخش سرمایه‌گذاری <ArrowUpLeft size={15} /></a>
        </div>
        <div className="footer-main">
          <div className="footer-sitemap">
            <div><strong>پارس</strong><a href={pageHref('about')}>درباره‌ی پارس</a><a href={pageHref('news')}>روایت‌ها</a><a href={pageHref('contact')}>تماس</a></div>
            <div><strong>بخش سرمایه‌گذاری</strong><a href={pageHref('investment')}>نمای کلی</a><a href={pageHref('approach')}>رویکرد</a><a href={pageHref('industries')}>حوزه‌ها</a><a href={pageHref('portfolio')}>پرتفوی</a><a href={pageHref('tools')}>ابزارها</a></div>
            <div><strong>درخواست و راهنما</strong><a href={pageHref('apply')}>درخواست سرمایه</a><a href={pageHref('track')}>پیگیری درخواست</a><a href={pageHref('sitemap')}>نقشه‌ی سایت</a></div>
          </div>
          <div className="footer-status">
            <span className="eyebrow">بخش سرمایه‌گذاری</span>
            <strong><i className="status-indicator" /> در صفحه‌ای مستقل</strong>
            <small>رویکرد، حوزه‌ها و ابزارها</small>
            <a href={pageHref('investment')}>ورود به این بخش <ArrowUpLeft size={13} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} پارس · کلیه‌ی حقوق محفوظ است</span>
          <div><a href={pageHref('terms')}>قوانین و مقررات</a><a href={pageHref('privacy')}>حریم خصوصی</a><a href={pageHref('contact')}>پشتیبانی</a></div>
          <span className="footer-made">با نگاهی رو به آینده</span>
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
