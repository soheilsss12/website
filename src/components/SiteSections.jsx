import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowUpLeft,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  Compass,
  Globe2,
  Gauge,
  HeartHandshake,
  Info,
  LineChart,
  Link2,
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

const ParsLogoSculpture = lazy(() => import('./ParsLogoSculpture.jsx'));

const faNumber = (value) => new Intl.NumberFormat('fa-IR').format(value);

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
  return `سپاس ${answers.name}؛ حالا درباره‌ی ${answers.company} و مسیر پیش‌رو گفت‌وگو می‌کنیم`;
}

const journeyChapters = [
  {
    number: '۰۱',
    stage: 'شناخت مسئله',
    image: 'pars-hero-journey.jpg',
    title: 'از مسئله‌ای واقعی آغاز کنیم',
    description: 'گفت‌وگوی روشن کمک می‌کند نیاز واقعی را از فرضیه جدا کنیم و مسیر بررسی را بهتر بشناسیم.',
  },
  {
    number: '۰۲',
    stage: 'ساخت محصول',
    image: 'pars-story-build.jpg',
    title: 'راه‌حل را در عمل بسنجیم',
    description: 'شناخت محصول و توان تیم، پایه‌ی تصمیم‌های دقیق‌تر و گام‌های بعدی است.',
  },
  {
    number: '۰۳',
    stage: 'آمادگی برای رشد',
    image: 'pars-story-scale.jpg',
    title: 'برای رشد، زیرساخت بسازیم',
    description: 'سرمایه، تجربه و ارتباطات زمانی اثرگذارند که با نیاز کسب‌وکار هم‌راستا باشند.',
  },
];

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

function ParsGlyph({ className = '' }) {
  return <span className={`pars-glyph ${className}`} aria-hidden="true"><CrystalMark /></span>;
}

function HeroParsVisual() {
  const stageRef = useRef(null);
  const [isStageActive, setIsStageActive] = useState(true);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setIsStageActive(entry.isIntersecting && entry.intersectionRatio >= 0.3);
    }, { threshold: [0, 0.3] });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={stageRef} className={`hero-stage ${isStageActive ? 'is-active' : 'is-idle'}`}>
      <div className="hero-crystal-shell">
        <Suspense fallback={null}>
          <ParsLogoSculpture active={isStageActive} interactionRef={stageRef} />
        </Suspense>
      </div>
    </div>
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
      <img
        className="hero-backdrop"
        src={`${import.meta.env.BASE_URL}pars-home-hero.jpg`}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-atmosphere" aria-hidden="true"><span /><span /><i /></div>
      <div className="hero-layout hero-pars-layout site-container">
        <div className="hero-copy hero-pars-copy">
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
          <p className="hero-description">پارس در کنار تیم‌هایی می‌ایستد که مسئله‌ای واقعی را به کسب‌وکاری پایدار تبدیل می‌کنند؛ با سرمایه، تجربه و شبکه‌ی ارتباطی</p>
          <div className="hero-actions hero-pars-actions">
            <a className="button button-lime button-large" href={pageHref('apply')}>شروع درخواست <ArrowUpLeft size={17} /></a>
            <a className="button button-outline-light button-large" href={pageHref('approach')}>با رویکرد ما آشنا شوید <ArrowDown size={15} /></a>
          </div>
          <div className="hero-value-strip">
            <div><span className="hero-value-index">۰۱</span><span><small>سرمایه</small><strong>برای فرصت‌های واقعی</strong></span></div>
            <div><span className="hero-value-index">۰۲</span><span><small>تجربه و شبکه</small><strong>فراتر از تأمین مالی</strong></span></div>
            <div><span className="hero-value-index">۰۳</span><span><small>همراهی بلندمدت</small><strong>از ایده تا رشد</strong></span></div>
          </div>
          <div className="hero-campaign-note"><span><i /></span> شرایط هر دوره در اطلاعیه‌ی رسمی همان دوره اعلام می‌شود</div>
        </div>
        <HeroParsVisual />
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
    <section className="stats-ribbon site-container" aria-label="پارس در یک نگاه">
      <div className="stats-ribbon-label"><span className="signal-dot" /> پارس در یک نگاه</div>
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
      route: 'approach',
      label: 'رویکرد پارس',
      title: 'از مسئله تا آمادگی برای رشد',
      description: 'ببینید همراهی پارس چگونه از گفت‌وگوی روشن و شناخت محصول شکل می‌گیرد.',
      image: 'pars-about-constellation.jpg',
      number: '۰۱',
    },
    {
      route: 'industries',
      label: 'حوزه‌های سرمایه‌گذاری',
      title: '۱۱ حوزه، یک نگاه مسئله‌محور',
      description: 'حوزه‌های تأییدشده‌ی سرمایه‌گذاری پارس را مرور کنید.',
      image: 'pars-sector-agriculture.jpg',
      number: '۰۲',
    },
    {
      route: 'portfolio',
      label: 'پرتفوی پارس',
      title: 'اطلاعات پس از تأیید رسمی',
      description: 'نام شرکت‌ها تنها پس از تأیید و اعلام رسمی منتشر خواهد شد.',
      image: 'pars-portfolio-landscape.jpg',
      number: '۰۳',
    },
  ];

  return (
    <section className="home-highlights section-space" aria-labelledby="home-highlights-title">
      <div className="site-container">
        <div className="home-highlights-heading" data-reveal>
          <div>
            <span className="journey-eyebrow"><i aria-hidden="true" /> پارس در یک نگاه</span>
            <h2 id="home-highlights-title">مسیرها را <em>انتخاب کنید</em></h2>
          </div>
          <p>برای هر موضوع، صفحه‌ای مستقل با اطلاعات مرتبط در نظر گرفته‌ایم.</p>
        </div>
        <div className="home-highlights-grid">
          {highlights.map((item, index) => (
            <a className="home-highlight-card" href={pageHref(item.route)} key={item.route} data-reveal style={{ '--image-reveal-delay': `${index * 120}ms` }}>
              <img src={`${import.meta.env.BASE_URL}${item.image}`} alt="" width="1536" height="1024" loading="lazy" decoding="async" />
              <span className="home-highlight-shade" aria-hidden="true" />
              <span className="home-highlight-index">{item.number}</span>
              <span className="home-highlight-copy">
                <small>{item.label}</small>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
                <i>ورود به صفحه <ArrowUpLeft size={15} /></i>
              </span>
              <span className="home-highlight-disclosure">تصویر مفهومی</span>
            </a>
          ))}
        </div>
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
          <SectionEyebrow index="۰۱">مانیفست ما</SectionEyebrow>
          <h2>سرمایه فقط پول نیست؛<br /> <em>شتابی برای ساختن است</em></h2>
          <p>باور داریم کسب‌وکارهای موفق با یک تصمیم ساخته نمی‌شوند. سرمایه باید در کنار تجربه، ارتباطات و پاسخ‌گویی قرار بگیرد تا تیم‌ها بتوانند مسئله‌های مهم را به محصولاتی پایدار تبدیل کنند</p>
          <a href={pageHref('approach')} className="text-link text-link-dark">نگاه سرمایه‌گذاری پارس <ArrowUpLeft size={16} /></a>
        </div>
        <div className="manifesto-mark" aria-hidden="true"><ParsGlyph /><span>پارس / سرمایه‌گذاری خطرپذیر</span></div>
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
            <span className="journey-eyebrow"><span>۰۲</span><i aria-hidden="true" /> مسیر همراهی پارس</span>
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
                  <figure className="journey-chapter-media" data-reveal style={{ '--image-reveal-delay': `${index * 110}ms` }}>
                    <img
                      src={`${import.meta.env.BASE_URL}${item.image}`}
                      alt=""
                      width="1536"
                      height="1024"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <figcaption><span>{item.stage}</span><small>تصویر مفهومی</small></figcaption>
                  </figure>
                  <div className="journey-chapter-copy">
                    <span className="journey-chapter-index">{item.number}<i aria-hidden="true" /></span>
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
                  className={`journey-art-image ${index === activeChapter ? 'is-active' : ''}`}
                  key={item.image}
                  src={`${import.meta.env.BASE_URL}${item.image}`}
                  alt=""
                  width="1536"
                  height="1024"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ))}
            </div>
            <figcaption className="journey-art-caption">
              <span><i aria-hidden="true" />{activeStory.stage}</span>
              <small>{activeStory.number} <b>/ ۰۳</b></small>
            </figcaption>
            <span className="journey-art-progress"><i /></span>
          </figure>
        </div>
        <p className="journey-disclosure"><ShieldCheck size={15} /><span>تصاویر این روایت مفهومی‌اند و به دفتر، تیم، شریک یا شرکت مشخصی اشاره ندارند</span></p>
      </div>
    </section>
  );
}

export function IndustriesSection() {
  return (
    <section className="industries-section section-space" id="industries">
      <div className="site-container">
        <div className="industries-showcase" data-reveal>
          <img src={`${import.meta.env.BASE_URL}pars-sector-agriculture.jpg`} alt="" width="1536" height="1024" loading="eager" decoding="async" />
          <div className="industries-showcase-content">
            <SectionHeading index="۰۱" eyebrow="حوزه‌های منتخب" title="سرمایه برای" emphasis="حل مسئله‌های واقعی" copy="پارس در حوزه‌هایی سرمایه‌گذاری می‌کند که فناوری بتواند راه‌حل‌های تازه بسازد" light className="industries-showcase-heading" />
            <div className="industries-showcase-count"><strong>۱۱</strong><span>حوزه‌ی سرمایه‌گذاری<br />با یک نگاه مسئله‌محور</span></div>
          </div>
          <small className="industries-showcase-caption">تصویر مفهومی؛ نه معرفی شرکت یا پروژه‌ی مشخص</small>
        </div>
        <p className="heading-side-note industries-side-note">اولویت و شرایط پذیرش هر حوزه در اطلاعیه‌ی هر دوره مشخص می‌شود</p>
        <p className="industry-visual-disclosure"><ShieldCheck size={14} /> تصاویر مفهومی‌اند و شرکت یا پروژه‌ی مشخصی را نشان نمی‌دهند.</p>
        <div className="industry-grid">
          {industries.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                className={`industry-card tone-${item.tone}`}
                key={item.number}
                data-reveal
                style={{ '--industry-image-delay': `${(index % 6) * 70}ms` }}
              >
                <img
                  className="industry-card-image"
                  src={`${import.meta.env.BASE_URL}${item.image}`}
                  alt=""
                  width="1024"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
                <span className="industry-card-top"><span>{item.number}</span><Icon size={21} strokeWidth={1.45} /></span>
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
          <SectionHeading index="۰۳" eyebrow="بیشتر از سرمایه" title="ارزش واقعی" emphasis="در همراهی است" copy="هر تیم نیاز متفاوتی دارد؛ مسیر همکاری را بر اساس مهم‌ترین مانع رشد همان تیم طراحی می‌کنیم" light />
          <div className="benefits-statement"><ParsGlyph /><p>سرمایه‌ی مالی،<br />به‌همراه <em>شبکه‌ی ارتباطی</em></p></div>
          <a href={pageHref('approach')} className="button button-outline-light">همه‌ی پشتیبانی‌ها <ArrowUpLeft size={16} /></a>
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
          <SectionHeading index="۰۴" eyebrow="فرم درخواست" title="در چهار گام" emphasis="اطلاعات‌تان را ثبت کنید" copy="فرم مرحله‌ای اطلاعات تماس، محصول، نیاز سرمایه و مدارک را می‌گیرد" />
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
        <div className="section-heading-row portfolio-heading-row"><SectionHeading index="۰۱" eyebrow="پرتفوی پارس" title="شرکت‌های" emphasis="پرتفوی" copy="اطلاعات پرتفوی پس از تأیید رسمی در این بخش منتشر می‌شود" /></div>
        <figure className="editorial-visual portfolio-visual" data-reveal style={{ '--visual-delay': '120ms' }}>
          <img src={`${import.meta.env.BASE_URL}pars-portfolio-landscape.jpg`} alt="" width="1536" height="1024" loading="eager" decoding="async" />
          <div className="editorial-visual-copy">
            <span className="eyebrow">پرتفوی پارس</span>
            <h3>در انتظار اعلام رسمی</h3>
            <p>اطلاعات شرکت‌های پرتفوی پس از تأیید رسمی منتشر می‌شود.</p>
          </div>
          <figcaption className="editorial-visual-disclosure">تصویر مفهومی؛ هیچ شرکت یا سرمایه‌گذاری مشخصی نمایش داده نمی‌شود.</figcaption>
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
          <SectionHeading index="۰۲" eyebrow="گستره‌ی جغرافیایی" title="نگاهی به" emphasis="نقشه‌ی ایران" copy="نام شهرها و خطوط روی نقشه نمای شماتیک‌اند؛ محدوده‌ی پذیرش هر دوره فقط در اطلاعیه‌ی رسمی اعلام می‌شود" />
          <div className="map-note-card"><Globe2 size={20} /><span><strong>محدوده‌ی پذیرش</strong><small>این نقشه پوشش جغرافیایی تأییدشده‌ی پارس را نشان نمی‌دهد</small></span></div>
          <div className="map-accuracy-note"><ShieldCheck size={15} /><span>نقطه‌ها و خط‌ها نمایشی‌اند؛ حضور، دفتر یا سرمایه‌گذاری پارس در شهرها را تأیید نمی‌کنند.</span></div>
          <a href={pageHref('apply')} className="text-link">دیدن شرایط فراخوان <ArrowUpLeft size={16} /></a>
        </div>
        <div className="map-art-card map-art-card-accurate" data-reveal>
          <div className="map-card-head"><span><MapPin size={15} /> گستره‌ی ایران</span><span className="map-sample-tag"><i /> شهرها و خطوط شماتیک</span></div>
          <div className="iran-map-stage">
            <div className="iran-map-scan" />
            <div className="iran-map-crosshair iran-map-crosshair-one" />
            <div className="iran-map-crosshair iran-map-crosshair-two" />
            <svg className="iran-map iran-map-accurate" viewBox={iranOutlineViewBox} role="img" aria-label="نقشه‌ی ایران با نام چند شهر و مسیرهای شماتیک؛ نه محدوده‌ی پوشش واقعی پارس">
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
          <div className="map-legend"><span><i className="legend-lime" /> نام و نقطه‌ی شهرها</span><span><i className="legend-copper" /> مسیر شماتیک، نه پوشش واقعی</span></div>
          <div className="map-coordinate">اطلاعیه‌ی رسمی هر دوره، شهرهای مجاز و محدوده‌ی پذیرش را مشخص می‌کند.</div>
        </div>
      </div>
    </section>
  );
}

export function ToolsSection({ onOpenTool }) {
  const tools = [
    { id: 'valuation', code: '۰۱', title: 'ارزش‌گذاری استارتاپ', description: 'با مبلغ جذب و سهم پیشنهادی، ارزش تقریبی شرکت را برآورد کنید', icon: ChartNoAxesCombined, tag: 'ارزش‌گذاری' },
    { id: 'runway', code: '۰۲', title: 'دوام نقدینگی (Runway)', description: 'با نقدینگی و هزینه‌ی ماهانه بدانید منابع‌تان تا چند ماه کافی است', icon: Activity, tag: 'مدیریت نقدینگی' },
    { id: 'dilution', code: '۰۳', title: 'رقیق‌شدن سهام', description: 'اثر جذب سرمایه بر سهم بنیان‌گذاران را ببینید', icon: PieChart, tag: 'سهام‌داری' },
    { id: 'captable', code: '۰۴', title: 'جدول سهامداری (Cap Table)', description: 'ساختار سهامداری پیش و پس از دور جدید', icon: WalletCards, tag: 'سهم‌داران' },
    { id: 'cac', code: '۰۵', title: 'هزینه‌ی جذب مشتری (CAC)', description: 'هزینه‌ی به‌دست‌آوردن هر مشتری جدید', icon: Gauge, tag: 'اقتصاد واحد' },
    { id: 'ltv', code: '۰۶', title: 'ارزش طول عمر مشتری (LTV)', description: 'درآمد تقریبی هر مشتری در کل دوره‌ی همکاری با شما', icon: LineChart, tag: 'درآمد' },
    { id: 'saas', code: '۰۷', title: 'شاخص‌های SaaS', description: 'درآمد تکرارشونده و نرخ رشد ماهانه', icon: BarChart3, tag: 'درآمد تکرارشونده' },
  ];
  return (
    <section className="tools-section section-space" id="tools">
      <div className="site-container">
        <div className="section-heading-row"><SectionHeading index="۰۱" eyebrow="ابزارهای استارتاپی" title="با عدد" emphasis="تصمیم بگیرید" copy="محاسبه‌گرهای ساده برای پرسش‌هایی که پیش از جذب سرمایه، رشد یا مذاکره پیش می‌آید" /><div className="tools-data-note"><ShieldCheck size={18} /><span>محاسبه‌ها در مرورگر شما انجام می‌شود و هیچ داده‌ای به سرور ارسال نمی‌شود</span></div></div>
        <figure className="editorial-visual tools-visual" data-reveal style={{ '--visual-delay': '120ms' }}>
          <img src={`${import.meta.env.BASE_URL}pars-story-build.jpg`} alt="" width="1536" height="1024" loading="eager" decoding="async" />
          <figcaption className="editorial-visual-copy">
            <span className="eyebrow">تصویر مفهومی</span>
            <strong>عددها را با دقت بررسی کنید</strong>
          </figcaption>
          <small className="editorial-visual-disclosure">ابزارها برآوردی‌اند و داده‌ای به سرور نمی‌فرستند.</small>
        </figure>
        <div className="tools-grid">{tools.map((tool) => {
          const Icon = tool.icon;
          return <button type="button" className="tool-card" key={tool.id} onClick={() => onOpenTool(tool.id)} data-reveal><span className="tool-card-top"><span>{tool.code} / ۰۷</span><Icon size={21} strokeWidth={1.5} /></span><span className="tool-card-tag">{tool.tag}</span><strong>{tool.title}</strong><p>{tool.description}</p><span className="tool-card-action">استفاده از ابزار <ArrowUpLeft size={15} /></span></button>;
        })}</div>
        <div className="tools-bottom"><span>نتایج برآوردی‌اند و پیش‌بینی قطعی یا توصیه‌ی سرمایه‌گذاری نیستند</span><a href={pageHref('apply')} className="text-link">درخواست سرمایه <ArrowUpLeft size={15} /></a></div>
      </div>
    </section>
  );
}

export function PartnersSection() {
  return (
    <section className="partners-section section-space" id="partners">
      <div className="site-container">
        <div className="partners-top"><SectionHeading index="۰۳" eyebrow="شبکه‌ی همکاران" title="رشد" emphasis="کار جمعی است" copy="اطلاعات همکاران رسمی پارس پس از تأیید و اعلام عمومی منتشر می‌شود" /><span className="partners-disclosure">فهرست همکاران رسمی پس از تأیید منتشر می‌شود</span></div>
        <div className="partners-coming-soon" data-reveal><Network size={24} /><strong>شرکای رسمی پارس</strong><span>در انتظار اعلام رسمی</span></div>
        <a href={pageHref('contact')} className="text-link">پیشنهاد همکاری دارید؟ با ما در میان بگذارید <ArrowUpLeft size={15} /></a>
      </div>
    </section>
  );
}

export function NewsSection() {
  const [tab, setTab] = useState('اطلاعیه‌ی کمپین');
  const tabs = ['اطلاعیه‌ی کمپین', 'اخبار پارس', 'پارس در رسانه‌ها', 'رویدادها و فراخوان‌ها'];
  return (
    <section className="news-section section-space" id="news">
      <div className="site-container">
        <div className="section-heading-row">
          <SectionHeading index="۰۱" eyebrow="خبر و رویداد" title="از تازه‌ترین‌ها" emphasis="باخبر باشید" copy="اخبار شرکت، بازتاب رسانه‌ای، رویدادها و فراخوان‌ها، یک‌جا" />
          <a href={pageHref('apply')} className="text-link">اطلاعیه‌ی کمپین <ArrowUpLeft size={15} /></a>
        </div>
        <figure className="editorial-visual news-visual" data-reveal style={{ '--visual-delay': '100ms' }}>
          <img src={`${import.meta.env.BASE_URL}pars-editorial-stories.jpg`} alt="" width="1536" height="1024" loading="eager" decoding="async" />
          <figcaption className="editorial-visual-copy">
            <span className="eyebrow">تصویر مفهومی</span>
            <strong>خبرها و دیدگاه‌ها</strong>
          </figcaption>
          <small className="editorial-visual-disclosure">محتوای خبری فقط پس از تأیید رسمی منتشر می‌شود</small>
        </figure>
        <div className="news-tabs" role="tablist">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'is-active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
        <div className="news-empty">
          <div className="news-empty-icon"><CalendarDays size={24} /></div>
          <div><span className="eyebrow">{tab}</span><h3>هنوز خبری منتشر نشده است</h3><p>برای آگاهی از وضعیت پذیرش، صفحه‌ی کمپین را ببینید</p></div>
          <a href={pageHref('apply')} className="button button-outline">رفتن به صفحه‌ی کمپین <ArrowUpLeft size={14} /></a>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const values = [
    { title: 'شفافیت', description: 'گفت‌وگوی صریح درباره‌ی فرصت‌ها، ریسک‌ها و انتظارها', icon: ShieldCheck },
    { title: 'همراهی', description: 'در کنار تیم می‌مانیم؛ نه فقط در لحظه‌ی سرمایه‌گذاری', icon: HeartHandshake },
    { title: 'یادگیری', description: 'تصمیم‌هایمان را با داده، کنجکاوی و بازنگری بهتر می‌کنیم', icon: BookOpen },
  ];
  return (
    <section className="about-section section-space" id="about">
      <div className="site-container"><div className="about-top"><SectionHeading index="۰۱" eyebrow="درباره‌ی پارس" title="سرمایه‌گذاری" emphasis="با نگاه بلندمدت" copy="پارس برای همراهی با کسب‌وکارهایی شکل گرفته که می‌خواهند مسئله‌های واقعی را حل کنند و رشدی پایدار بسازند" /><div className="about-history-card"><span className="about-history-symbol"><ParsGlyph /></span><span className="eyebrow">تاریخچه و معرفی</span><strong>اطلاعات رسمی درباره‌ی سال تأسیس و تاریخچه‌ی پارس پس از تأیید منتشر می‌شود</strong></div></div>
        <figure className="editorial-visual about-visual" data-reveal style={{ '--visual-delay': '180ms' }}>
          <img src={`${import.meta.env.BASE_URL}pars-about-constellation.jpg`} alt="" width="1536" height="1024" loading="eager" decoding="async" />
          <figcaption className="editorial-visual-copy">
            <span className="eyebrow">تصویر مفهومی</span>
            <strong>پیوند تجربه و رشد</strong>
          </figcaption>
          <small className="editorial-visual-disclosure">این تصویر دفتر، تیم یا شریک واقعی پارس را نشان نمی‌دهد.</small>
        </figure>
        <div className="about-values-grid">{values.map((item, index) => {
          const Icon = item.icon;
          return <article className="about-value-card" key={item.title} data-reveal><span className="about-value-number">۰{index + 1}</span><Icon size={21} /><h3>{item.title}</h3><p>{item.description}</p></article>;
        })}</div>
        <div className="team-section" id="team">
          <div className="team-heading">
            <SectionEyebrow index="۰۲">تیم همراه پارس</SectionEyebrow>
            <h3>تیم پارس</h3>
            <p>اطلاعات اعضا و سوابق حرفه‌ای پس از تأیید رسمی منتشر می‌شود</p>
          </div>
          <div className="team-role-list" data-reveal>
            <div className="team-role-card">
              <span className="team-role-avatar"><UsersRound size={20} /></span>
              <span className="team-role-meta"><strong>اعضا و سوابق حرفه‌ای</strong><small>پس از تأیید رسمی منتشر می‌شود</small></span>
              <span className="team-role-index">پارس</span>
            </div>
          </div>
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
          <SectionHeading index="۰۱" eyebrow="تماس با پارس" title="یک گفت‌وگوی خوب" emphasis="از این‌جا شروع می‌شود" copy="برای پرسش درباره‌ی همکاری یا رسانه، پیام بگذارید" />
          <div className="contact-details">
            <div><span className="contact-detail-icon"><Link2 size={17} /></span><span><small>ایمیل شرکت</small><strong>پس از تأیید رسمی اعلام می‌شود</strong></span></div>
            <div><span className="contact-detail-icon"><MapPin size={17} /></span><span><small>نشانی و ساعت پاسخ‌گویی</small><strong>پس از تأیید رسمی اعلام می‌شود</strong></span></div>
            <div><span className="contact-detail-icon"><Building2 size={17} /></span><span><small>لینکدین و رسانه‌های اجتماعی</small><strong>پس از تأیید رسمی اعلام می‌شود</strong></span></div>
          </div>
          <figure className="editorial-visual contact-visual" data-reveal style={{ '--visual-delay': '160ms' }}>
            <img src={`${import.meta.env.BASE_URL}pars-home-hero.jpg`} alt="" width="1536" height="1024" loading="lazy" decoding="async" />
            <figcaption className="editorial-visual-copy">
              <span className="eyebrow">تصویر مفهومی</span>
              <strong>مسیر گفت‌وگو از این‌جا آغاز می‌شود</strong>
            </figcaption>
            <small className="editorial-visual-disclosure">هیچ نشانی یا محل واقعی را نشان نمی‌دهد.</small>
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
      <div className="site-container final-callout-content"><SectionEyebrow index="" light>مسیر بعدی</SectionEyebrow><h2>طرح شما برای<br /><em>گام بعدی آماده است؟</em></h2><p>شرایط هر دوره را بخوانید و فرم درخواست سرمایه را گام‌به‌گام تکمیل کنید</p><div className="final-callout-actions"><a href={pageHref('apply')} className="button button-lime button-large">شروع درخواست سرمایه <ArrowUpLeft size={17} /></a><a href={pageHref('contact')} className="button button-outline-light">پرسشی دارید؟ <ArrowUpLeft size={15} /></a></div><span className="final-callout-note">اطلاعات رسمی دوره پیش از شروع پذیرش منتشر می‌شود</span></div>
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
            <span className="brand-name-stack"><strong>پارس</strong><small>سرمایه‌گذاری خطرپذیر</small></span>
          </a>
          <p>سرمایه‌ای که کنار شما می‌ماند</p>
          <a href={pageHref('apply')} className="button button-outline-light">درخواست سرمایه <ArrowUpLeft size={15} /></a>
        </div>
        <div className="footer-main">
          <div className="footer-sitemap">
            <div><strong>آشنایی با پارس</strong><a href={pageHref('approach')}>رویکرد ما</a><a href={pageHref('portfolio')}>پرتفوی</a><a href={pageHref('about')}>درباره‌ی ما</a><a href={pageHref('about')}>همکاران</a></div>
            <div><strong>ابزارها و خبرها</strong><a href={pageHref('tools')}>ابزارهای استارتاپی</a><a href={pageHref('news')}>اخبار و رویدادها</a></div>
            <div><strong>ارتباط</strong><a href={pageHref('contact')}>تماس با ما</a><a href={pageHref('apply')}>صفحه‌ی کمپین</a><a href={pageHref('sitemap')}>نقشه‌ی سایت</a></div>
          </div>
          <div className="footer-status">
            <span className="eyebrow">پذیرش دوره‌ی بعد</span>
            <strong><i className="status-indicator" /> جزئیات در اطلاعیه‌ی رسمی اعلام می‌شود</strong>
            <small>برای اطلاع از جزئیات، صفحه‌ی کمپین را ببینید</small>
            <a href={pageHref('apply')}>رفتن به صفحه‌ی کمپین <ArrowUpLeft size={13} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} پارس · کلیه‌ی حقوق محفوظ است</span>
          <div><a href={pageHref('terms')}>قوانین و مقررات</a><a href={pageHref('privacy')}>حریم خصوصی</a><a href={pageHref('contact')}>پشتیبانی</a></div>
          <span className="footer-made">با نگاه بلندمدت، برای آینده‌ای پایدار</span>
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
