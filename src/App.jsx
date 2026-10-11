import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  ExternalLink,
  MessageCircle,
  RotateCcw,
  Send,
  UsersRound,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
const AssistantScene = lazy(() => import('./components/AssistantScene.jsx'));

const FIRST_GREETING = 'There you are! I’ve been waiting and these heels are killing me. What can I do for you?';
const QUICK_PROMPTS = [
  { title: 'Start a project', prompt: 'I have a project in mind', icon: MessageCircle, number: '01' },
  { title: 'Join the team', prompt: 'I’m interested in working with Locomotive', icon: UsersRound, number: '02' },
  { title: 'Drop a quick word', prompt: 'I have a quick question for Locomotive', icon: MessageCircle, number: '03' },
  { title: 'Discover our culture', prompt: 'Tell me about Locomotive’s culture', icon: Compass, number: '04' },
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getReply(message) {
  const text = message.toLowerCase();

  if (/career|job|join|work with|hiring|apply|team/.test(text)) {
    return 'Wonderful. We’re always glad to meet thoughtful people. You can share a little about yourself with the team at careers@locomotive.ca, or tell me what kind of work you do and I’ll point you in the right direction.';
  }

  if (/project|brief|brand|website|build|budget|business|launch|client/.test(text)) {
    return 'I’d love to hear about it. Start with what you’re trying to make possible, who it’s for, and when you hope to launch. The studio team can take it from there at hello@locomotive.ca.';
  }

  if (/locomotive|studio|about|who are you|what do you do/.test(text)) {
    return 'Locomotive is an independent, digital-first design agency made in Montréal. Strategy, identity, design and development come together here to make digital experiences people want to spend time with.';
  }

  if (/contact|email|reach|talk|hello/.test(text)) {
    return 'The best first hello is hello@locomotive.ca. Or keep the conversation here and tell me a little more about what you have in mind.';
  }

  return 'I can help with projects, the studio, or finding your way to the right people. Give me a little more context and I’ll make a good introduction.';
}

function Header({ onStartConversation }) {
  return (
    <header className="reference-header">
      <a className="reference-wordmark" href="#top" aria-label="Locomotive — back to L.I.S.A.">
        Locomotive<sup>®</sup>
      </a>
      <span className="reference-mark" aria-hidden="true"><i /><i /></span>
      <button className="reference-talk" type="button" onClick={onStartConversation}>
        Let’s talk <ArrowUpRight size={18} strokeWidth={1.35} />
      </button>
    </header>
  );
}

function Hero({ onStartConversation, onQuickPrompt, isSpeaking, soundEnabled, onToggleSound, onReset }) {
  const [emailCopied, setEmailCopied] = useState(false);
  const [projectStep, setProjectStep] = useState(-1);
  const [projectStartedAt, setProjectStartedAt] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [showCompanyInputs, setShowCompanyInputs] = useState(false);

  useEffect(() => {
    if (projectStep === 0) {
      const timer = window.setTimeout(() => setProjectStep(1), 6000);
      return () => window.clearTimeout(timer);
    }
    if (projectStep === 1) {
      setShowNameInput(false);
      const revealTimer = window.setTimeout(() => setShowNameInput(true), 4000);
      const advanceTimer = window.setTimeout(() => setProjectStep(2), 8000);
      return () => {
        window.clearTimeout(revealTimer);
        window.clearTimeout(advanceTimer);
      };
    }
    if (projectStep === 2) {
      setShowNameInput(false);
      const timer = window.setTimeout(() => setProjectStep(3), 4000);
      return () => window.clearTimeout(timer);
    }
    if (projectStep === 3) {
      setShowCompanyInputs(false);
      const timer = window.setTimeout(() => setShowCompanyInputs(true), 2000);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [projectStep]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('info@locomotive.ca');
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1500);
    } catch {
      window.location.href = 'mailto:info@locomotive.ca';
    }
  };

  const beginProject = () => {
    setNameInput('');
    setCompanyInput('');
    setTitleInput('');
    setShowNameInput(false);
    setShowCompanyInputs(false);
    setProjectStartedAt(performance.now());
    setProjectStep(0);
  };

  const resetStage = () => {
    setProjectStep(-1);
    setProjectStartedAt(null);
    setShowNameInput(false);
    setShowCompanyInputs(false);
    setNameInput('');
    setCompanyInput('');
    setTitleInput('');
    onReset();
  };

  const submitName = (event) => {
    event.preventDefault();
    if (!nameInput.trim()) return;
    setProjectStep(2);
  };

  const submitCompany = (event) => {
    event.preventDefault();
    setProjectStep(4);
  };

  const greeting = projectStep < 0
    ? FIRST_GREETING
    : projectStep === 0
      ? 'Ooooh, a fresh project? Now we’re talking. Time to stir up some digital trouble.'
      : projectStep === 1
        ? 'I need something to whisper dramatically when I talk about this project later. Name, please.'
        : projectStep === 2
          ? 'We’re gonna make *somebody* jealous with what we build.'
          : projectStep === 3
            ? 'Who’s the lucky brand we’re about to turn into a digital icon?'
            : 'Beautiful. I’ll make sure the right people see it.';

  const whisper = projectStep < 0
    ? 'Oh, hi! I’m L.I.S.A., your friendly guide at Locomotive.'
    : projectStep === 0
      ? 'A new project? That’s exactly the sort of trouble I like.'
      : projectStep === 1
        ? 'Ooooh, a fresh project? Now we’re talking. Time to stir up some digital trouble.'
        : projectStep === 2
          ? 'I need something to whisper dramatically when I talk about this project later. Name, please.'
          : 'We’re gonna make *somebody* jealous with what we build.';

  return (
    <section className="reference-stage" id="top" aria-labelledby="stage-title">
      <div className="stage-atmosphere" aria-hidden="true" />
      <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
        <AssistantScene isSpeaking={isSpeaking} projectStartedAt={projectStartedAt} />
      </Suspense>
      <Header onStartConversation={onStartConversation} />

      <div className="stage-conversation">
        <p className="stage-whisper stage-dialogue-enter" key={`whisper-${projectStep}`}>{whisper}</p>
        <h1 id="stage-title" className="stage-greeting stage-dialogue-enter" key={`greeting-${projectStep}`}>
          {projectStep === 2 ? <>We’re gonna make <em>somebody</em> jealous with what we build.</> : greeting}
        </h1>

        {projectStep < 0 ? (
          <>
            <div className="stage-choices" aria-label="Choose a conversation">
              {QUICK_PROMPTS.map((item) => (
                <button key={item.number} type="button" onClick={() => item.number === '01' ? beginProject() : onQuickPrompt(item.prompt)}>
                  {item.title}
                </button>
              ))}
            </div>
            <button className="stage-email" type="button" onClick={copyEmail}>
              <span>{emailCopied ? 'Copied to clipboard:' : 'Write us:'}</span>
              <u>info@locomotive.ca</u>
              {emailCopied ? <Check size={13} /> : <ExternalLink size={12} />}
            </button>
          </>
        ) : null}

        {projectStep === 1 && showNameInput ? (
          <form className="stage-form stage-dialogue-enter" onSubmit={submitName}>
            <label className="stage-form-row">
              <span className="sr-only">Your name</span>
              <input value={nameInput} onChange={(event) => setNameInput(event.target.value)} placeholder="Your name" autoComplete="name" />
              <button type="submit" aria-label="Continue project conversation"><ArrowRight size={16} /></button>
            </label>
          </form>
        ) : null}

        {projectStep === 3 && showCompanyInputs ? (
          <form className="stage-form stage-dialogue-enter" onSubmit={submitCompany}>
            <label className="stage-form-row">
              <span className="sr-only">Company name</span>
              <input value={companyInput} onChange={(event) => setCompanyInput(event.target.value)} placeholder="Company Name" autoComplete="organization" />
            </label>
            <label className="stage-form-row">
              <span className="sr-only">Your job title</span>
              <input value={titleInput} onChange={(event) => setTitleInput(event.target.value)} placeholder="Your job title" autoComplete="organization-title" />
              <button type="submit" aria-label="Continue project conversation"><ArrowRight size={16} /></button>
            </label>
          </form>
        ) : null}

        {projectStep === 4 ? (
          <button className="stage-email stage-dialogue-enter" type="button" onClick={resetStage}>
            Start another conversation <ArrowRight size={13} />
          </button>
        ) : null}
      </div>

      <div className="stage-controls">
        <button className="stage-back" type="button" onClick={resetStage} aria-label="Reset the conversation">
          <RotateCcw size={19} strokeWidth={1.5} />
        </button>
        <div className="stage-audio" aria-label="Voice settings">
          <button
            className={soundEnabled ? 'is-active' : ''}
            type="button"
            onClick={() => onToggleSound(true)}
            aria-label="Turn L.I.S.A. voice on"
            aria-pressed={soundEnabled}
          >
            <Volume2 size={17} strokeWidth={1.5} />
          </button>
          <button
            className={!soundEnabled ? 'is-active' : ''}
            type="button"
            onClick={() => onToggleSound(false)}
            aria-label="Mute L.I.S.A. voice"
            aria-pressed={!soundEnabled}
          >
            <VolumeX size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ onQuickPrompt }) {
  return (
    <section className="about-section" id="about" aria-labelledby="about-heading">
      <div className="about-topline" data-reveal>
        <span>MADE IN MONTRÉAL. OPEN TO EVERYWHERE.</span>
        <span>LOC. / 2026</span>
      </div>
      <div className="about-main">
        <div className="about-kicker" data-reveal>
          <span className="section-index">02</span>
          <span>THE STUDIO, AT YOUR PACE</span>
        </div>
        <h2 id="about-heading" data-reveal>
          Good work starts<br />with a <em>good conversation.</em>
        </h2>
        <div className="about-copy" data-reveal>
          <p>
            Think of me as your first hello to Locomotive. No perfect prompt, no polished brief, no wrong door. Tell me what you’re curious about and I’ll help you find the right people.
          </p>
          <button className="text-link" type="button" onClick={() => onQuickPrompt('Tell me about Locomotive')}>
            A little about the studio <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
      <div className="about-stamp" aria-hidden="true">
        <span>DESIGN</span><span>THINKING</span><span>×</span><span>TECHNICAL</span><span>KNOW-HOW</span>
      </div>
    </section>
  );
}

function PathwaysSection({ onQuickPrompt }) {
  return (
    <section className="pathways-section" id="pathways" aria-labelledby="pathways-heading">
      <div className="pathways-heading" data-reveal>
        <div className="about-kicker dark-kicker">
          <span className="section-index">03</span>
          <span>THREE GOOD PLACES TO BEGIN</span>
        </div>
        <h2 id="pathways-heading">Where would you<br /><em>like to go?</em></h2>
      </div>

      <div className="pathway-grid">
        {QUICK_PROMPTS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className="pathway-card"
              key={item.number}
              type="button"
              onClick={() => onQuickPrompt(item.prompt)}
              data-reveal
            >
              <span className="pathway-card-top">
                <span>{item.number} / 03</span>
                <Icon size={18} strokeWidth={1.35} />
              </span>
              <span className="pathway-card-title">{item.title}</span>
              <span className="pathway-card-bottom">
                <span>{item.number === '01' ? 'Let’s talk about what’s next.' : item.number === '02' ? 'Bring your point of view.' : 'A little context, a lot of heart.'}</span>
                <span className="pathway-arrow"><ArrowUpRight size={17} strokeWidth={1.5} /></span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Footer({ onStartConversation, onCookieSettings }) {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-topline">
        <span>LOC. / DIGITAL-FIRST DESIGN</span>
        <a href="https://locomotive.ca/en" target="_blank" rel="noreferrer">MONTRÉAL, CANADA <ArrowUpRight size={12} /></a>
      </div>
      <div className="footer-main">
        <div>
          <p className="footer-kicker">IF YOU’VE GOT A QUESTION,</p>
          <h2>We’re all ears.</h2>
        </div>
        <button className="footer-contact" type="button" onClick={onStartConversation}>
          <span>Start a conversation</span><ArrowUpRight size={20} />
        </button>
      </div>
      <div className="footer-bottom">
        <a className="footer-brand" href="#top">L.I.S.A.<span>®</span></a>
        <span>INDEPENDENT BY NATURE. DIGITAL BY DESIGN.</span>
        <div className="footer-links">
          <a href="mailto:hello@locomotive.ca">EMAIL THE STUDIO</a>
          <button type="button" onClick={onCookieSettings}>COOKIE SETTINGS</button>
          <a href="https://locomotive.ca/en/privacy-policy" target="_blank" rel="noreferrer">PRIVACY</a>
        </div>
        <span>© LOCOMOTIVE 2026</span>
      </div>
    </footer>
  );
}

function ChatPanel({ open, messages, isSpeaking, input, setInput, onClose, onSubmit, onQuickPrompt, bottomRef }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 280);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  return (
    <>
      <button
        className={`chat-backdrop ${open ? 'is-visible' : ''}`}
        type="button"
        onClick={onClose}
        aria-label="Close conversation"
        tabIndex={open ? 0 : -1}
      />
      <aside
        className={`chat-panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Chat with L.I.S.A."
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
      >
        <div className="chat-panel-header">
          <div className="chat-assistant-id">
            <span className="chat-avatar">L<span>.</span></span>
            <span>
              <strong>L.I.S.A.</strong>
              <small><span className="live-dot" /> HERE WITH YOU</small>
            </span>
          </div>
          <button className="icon-button chat-close" type="button" onClick={onClose} aria-label="Close conversation">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="chat-intro-line">
          <span>LOC. / INTERACTIVE SUPER ASSISTANT</span>
          <span>PRIVATE CONVERSATION</span>
        </div>

        <div className="chat-transcript" aria-live="polite" aria-relevant="additions text">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <p className="chat-time">A GOOD PLACE TO START</p>
              <p className="chat-first-line">What brings you<br /><em>this way?</em></p>
              <p className="chat-empty-copy">Pick a direction, or ask me anything about Locomotive.</p>
              <div className="chat-suggestions">
                {QUICK_PROMPTS.map((item) => (
                  <button key={item.number} type="button" onClick={() => onQuickPrompt(item.prompt)}>
                    <span>{item.title}</span><ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div className={`chat-message-row ${message.role === 'user' ? 'from-user' : 'from-assistant'}`} key={message.id}>
                  {message.role === 'assistant' && <span className="message-avatar">L.</span>}
                  <div className="chat-message">
                    <span className="message-role">{message.role === 'assistant' ? 'L.I.S.A.' : 'YOU'}</span>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
              {isSpeaking && (
                <div className="chat-message-row from-assistant typing-row">
                  <span className="message-avatar">L.</span>
                  <div className="typing-indicator" aria-label="L.I.S.A. is replying">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <form className="chat-composer" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="chat-message">Write a message to L.I.S.A.</label>
          <input
            ref={inputRef}
            id="chat-message"
            name="message"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Write a message…"
            maxLength={500}
            disabled={isSpeaking}
          />
          <button type="submit" aria-label="Send message" disabled={!input.trim() || isSpeaking}>
            <Send size={16} strokeWidth={1.65} />
          </button>
          <span className="chat-composer-foot">A LITTLE CONTEXT GOES A LONG WAY <span>↵</span></span>
        </form>
        <div className="chat-panel-bottom">
          <span>BUILT WITH CURIOSITY IN MONTRÉAL</span>
          <span>EST. 2008</span>
        </div>
      </aside>
    </>
  );
}

function MenuOverlay({ open, onClose, onStartConversation }) {
  return (
    <div className={`menu-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={!open}>
      <div className="menu-overlay-inner">
        <div className="menu-overlay-header">
          <div className="menu-overlay-meta"><span>THE LOCOMOTIVE UNIVERSE</span><span>45°31′N / 73°34′W</span></div>
          <button className="menu-overlay-close" type="button" onClick={onClose} aria-label="Close navigation menu">
            CLOSE <X size={15} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="menu-nav" aria-label="Main navigation">
          <a href="#top" onClick={onClose}><span>01</span> Meet L.I.S.A. <ArrowUpRight size={22} /></a>
          <a href="#about" onClick={onClose}><span>02</span> The studio <ArrowUpRight size={22} /></a>
          <a href="#pathways" onClick={onClose}><span>03</span> Find your way <ArrowUpRight size={22} /></a>
          <button type="button" onClick={onStartConversation}><span>04</span> Start a conversation <ArrowUpRight size={22} /></button>
        </nav>
        <div className="menu-overlay-footer">
          <span>INDEPENDENT BY NATURE. DIGITAL BY DESIGN.</span>
          <a href="https://locomotive.ca/en" target="_blank" rel="noreferrer" onClick={onClose}>VISIT LOCOMOTIVE.CA <ExternalLink size={13} /></a>
        </div>
      </div>
    </div>
  );
}

function CookieConsent({ choice, onSave, onReopen, settingsOpen, visible = true }) {
  const [showSettings, setShowSettings] = useState(settingsOpen);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (settingsOpen) setShowSettings(true);
  }, [settingsOpen]);

  if (choice || !visible) return null;

  const accept = (value) => {
    onSave(value);
    setShowSettings(false);
  };

  return (
    <aside className={`cookie-card ${showSettings ? 'has-settings' : ''}`} aria-label="Cookie consent">
      <div className="cookie-card-heading">
        <span className="cookie-symbol">L.</span>
        <div>
          <strong>{showSettings ? 'Your privacy, your call.' : 'We use cookies.'}</strong>
          <p>{showSettings ? 'Essential cookies are always on. Choose whether to allow anonymous analytics.' : 'Essential cookies keep this experience working. Analytics only begin with your consent.'}</p>
        </div>
        <button className="cookie-close" type="button" onClick={() => accept('necessary')} aria-label="Accept necessary cookies and close">
          <X size={15} />
        </button>
      </div>

      {showSettings && (
        <label className="cookie-toggle-row">
          <span><strong>Anonymous analytics</strong><small>Help us understand how the site is used.</small></span>
          <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
          <span className="toggle-track" aria-hidden="true"><span /></span>
        </label>
      )}

      <div className="cookie-actions">
        {showSettings ? (
          <>
            <button className="cookie-button cookie-button-primary" type="button" onClick={() => accept(analytics ? 'custom-analytics' : 'necessary')}>
              Save my choice <Check size={14} />
            </button>
            <button className="cookie-text-button" type="button" onClick={() => setShowSettings(false)}>Back</button>
          </>
        ) : (
          <>
            <button className="cookie-button cookie-button-primary" type="button" onClick={() => accept('all')}>Accept all</button>
            <button className="cookie-button cookie-button-outline" type="button" onClick={() => accept('necessary')}>Necessary only</button>
            <button className="cookie-text-button" type="button" onClick={() => setShowSettings(true)}>Let me choose</button>
          </>
        )}
      </div>
      <div className="cookie-bottom-row">
        <a href="https://locomotive.ca/en/privacy-policy" target="_blank" rel="noreferrer">PRIVACY POLICY <ArrowUpRight size={11} /></a>
        <button type="button" onClick={onReopen}>COOKIE SETTINGS</button>
      </div>
    </aside>
  );
}

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const replyTimer = useRef(null);
  const bottomRef = useRef(null);
  const utteranceRef = useRef(null);
  const soundEnabledRef = useRef(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setChatOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.reference-header',
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out', delay: 0.12 },
      );
      gsap.fromTo(
        '.stage-conversation > *',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.28 },
      );
      gsap.fromTo(
        '.stage-controls > *',
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.75 },
      );
    });

    return () => context.revert();
  }, []);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    if (!soundEnabled) {
      window.speechSynthesis?.cancel();
      utteranceRef.current = null;
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (!chatOpen || messages.length === 0) return undefined;
    const frame = window.requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }));
    return () => window.cancelAnimationFrame(frame);
  }, [chatOpen, messages, isSpeaking]);

  useEffect(() => () => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    window.speechSynthesis?.cancel();
  }, []);

  const speakReply = (text) => {
    const SynthUtterance = window.SpeechSynthesisUtterance;
    if (!soundEnabledRef.current || !window.speechSynthesis || !SynthUtterance) {
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SynthUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.94;
    utterance.pitch = 1.02;
    utterance.onend = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        setIsSpeaking(false);
      }
    };
    utterance.onerror = () => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        setIsSpeaking(false);
      }
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const openConversation = () => {
    setChatOpen(true);
    if (messages.length === 0) {
      setMessages([{ id: makeId(), role: 'assistant', text: FIRST_GREETING }]);
    }
  };

  const startWithPrompt = (prompt) => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    window.speechSynthesis?.cancel();
    setChatOpen(true);
    setMessages([
      { id: makeId(), role: 'assistant', text: FIRST_GREETING },
      { id: makeId(), role: 'user', text: prompt },
    ]);
    setIsSpeaking(true);
    replyTimer.current = window.setTimeout(() => {
      const reply = getReply(prompt);
      setMessages((current) => [...current, { id: makeId(), role: 'assistant', text: reply }]);
      replyTimer.current = null;
      speakReply(reply);
    }, 780);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || isSpeaking) return;

    const additions = [];
    if (messages.length === 0) additions.push({ id: makeId(), role: 'assistant', text: FIRST_GREETING });
    additions.push({ id: makeId(), role: 'user', text: message });
    setMessages((current) => [...current, ...additions]);
    setInput('');
    setIsSpeaking(true);

    replyTimer.current = window.setTimeout(() => {
      const reply = getReply(message);
      setMessages((current) => [...current, { id: makeId(), role: 'assistant', text: reply }]);
      replyTimer.current = null;
      speakReply(reply);
    }, 850);
  };

  const closeChat = () => setChatOpen(false);
  const resetExperience = () => {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setChatOpen(false);
    setMessages([]);
    setInput('');
    setIsSpeaking(false);
  };
  const toggleSound = (enabled) => {
    soundEnabledRef.current = enabled;
    setSoundEnabled(enabled);
    if (!enabled) {
      window.speechSynthesis?.cancel();
      utteranceRef.current = null;
      setIsSpeaking(false);
    }
  };

  return (
    <>
      <main className="site-shell">
        <Hero
          onStartConversation={openConversation}
          onQuickPrompt={startWithPrompt}
          isSpeaking={isSpeaking}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onReset={resetExperience}
        />
      </main>

      <ChatPanel
        open={chatOpen}
        messages={messages}
        isSpeaking={isSpeaking}
        input={input}
        setInput={setInput}
        onClose={closeChat}
        onSubmit={handleSubmit}
        onQuickPrompt={startWithPrompt}
        bottomRef={bottomRef}
      />
      <div className="assistant-speaking-state" aria-hidden="true" data-speaking={isSpeaking} />
    </>
  );
}
