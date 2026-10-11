import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  Bell,
  Check,
  CircleHelp,
  FileUp,
  FolderOpen,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
} from 'lucide-react';
import { industries, stageOptions, valuePillars } from '../data/siteContent.js';
import CrystalMark from './CrystalMark.jsx';

const steps = [
  { title: 'اطلاعات تماس', short: 'تماس' },
  { title: 'ایده و محصول', short: 'محصول' },
  { title: 'نیاز سرمایه', short: 'سرمایه' },
  { title: 'مدارک و تأیید', short: 'مدارک' },
];

const initialForm = {
  fullName: '', role: '', mobile: '', verificationCode: '', email: '', city: '',
  projectName: '', website: '', stage: '', industry: '', oneLiner: '', description: '',
  fundingReason: '', amount: '', useOfFunds: '', traction: '', teamSize: '', previousInvestors: '',
  deckName: '', links: '', agreed: false,
};

const requiredFields = [
  ['fullName', 'role', 'mobile', 'email', 'city'],
  ['projectName', 'stage', 'industry', 'oneLiner', 'description'],
  ['fundingReason', 'amount', 'useOfFunds', 'teamSize'],
  ['agreed'],
];

function Field({ label, name, value, onChange, type = 'text', placeholder = '', required = false, dir, help, children }) {
  const common = { id: name, name, value, onChange: (event) => onChange(name, event.target.value), placeholder, required, dir: dir || 'auto' };
  return (
    <label className="application-field" htmlFor={name}>
      <span className="application-field-label">{label}{required && <b aria-hidden="true">*</b>}</span>
      {children || (type === 'textarea'
        ? <textarea {...common} rows="4" />
        : <input {...common} type={type} />)}
      {help && <small>{help}</small>}
    </label>
  );
}

function SelectField({ label, name, value, onChange, options, placeholder = 'انتخاب کنید', required = false }) {
  return (
    <label className="application-field" htmlFor={name}>
      <span className="application-field-label">{label}{required && <b aria-hidden="true">*</b>}</span>
      <select id={name} name={name} value={value} onChange={(event) => onChange(name, event.target.value)} required={required}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option value={option} key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function BrandLink({ href = '#home' }) {
  return (
    <a className="brand-lockup" href={href} aria-label="بازگشت به صفحه‌ی اصلی پارس">
      <span className="brand-symbol"><CrystalMark /></span>
      <span className="brand-name-stack"><strong>پارس</strong><small>سرمایه‌گذاری جسورانه</small></span>
    </a>
  );
}

export default function ApplicationPage() {
  const applyHost = window.location.hostname.toLowerCase().startsWith('apply.');
  const primaryOrigin = applyHost
    ? `${window.location.protocol}//${window.location.hostname.replace(/^apply\./i, '')}`
    : '';
  const rootHref = applyHost ? `${primaryOrigin}/` : '#home';
  const homeHref = (hash) => applyHost ? `${primaryOrigin}/#${hash}` : `#${hash}`;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [portalPhone, setPortalPhone] = useState('');
  const [portalCode, setPortalCode] = useState('');
  const [portalMessage, setPortalMessage] = useState('');
  const [portalRequested, setPortalRequested] = useState(false);
  const reference = useMemo(() => `PARS-${new Intl.NumberFormat('fa-IR').format(Math.floor(100000 + Math.random() * 899999))}`, []);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => current.filter((error) => error !== key));
  };

  const goNext = (event) => {
    event.preventDefault();
    const missing = requiredFields[step].filter((key) => key === 'agreed' ? !form.agreed : !String(form[key] || '').trim());
    if (missing.length) {
      setErrors(missing);
      document.querySelector(`[name="${missing[0]}"]`)?.focus();
      return;
    }
    setErrors([]);
    if (step < steps.length - 1) setStep((current) => current + 1);
    else setSubmitted(true);
  };

  const saveUploadName = (event) => {
    const file = event.target.files?.[0];
    if (file) update('deckName', file.name);
  };

  const requestPortalAccess = (event) => {
    event.preventDefault();
    setPortalRequested(true);
    setPortalMessage('این بخش پیش‌نمایش است؛ پیامک ارسال نمی‌شود و برای ورود واقعی به اتصال امن احراز هویت نیاز دارد');
  };

  const submitPortalCode = (event) => {
    event.preventDefault();
    setPortalMessage(portalCode.trim()
      ? 'ورود آزمایشی است؛ تا اتصال سامانه، وضعیت یا اطلاعات متقاضی نمایش داده نمی‌شود'
      : 'برای ادامه، کد تأیید را وارد کنید');
  };

  return (
    <main className="apply-page" dir="rtl">
      <header className="apply-header">
        <BrandLink href={rootHref} />
        <div className="apply-header-center"><span className="signal-dot" /> فراخوان سرمایه‌گذاری پارس</div>
        <div className="apply-header-actions"><a className="apply-profile-link" href="#applicant-access" aria-label="پیگیری درخواست"><UserRound size={17} /><span>پیگیری درخواست</span></a><a className="apply-back-link" href={rootHref}><ArrowRight size={17} /><span className="apply-back-copy">بازگشت به سایت</span><span className="apply-back-short">بازگشت</span></a></div>
      </header>

      <section className="apply-hero">
        <div className="apply-hero-copy">
          <span className="eyebrow"><span className="signal-dot" /> مسیر درخواست سرمایه</span>
          <h1>برای قدم بعدیِ رشد<br /><em>از همین‌جا شروع کنید</em></h1>
          <p>در چهار مرحله‌ی کوتاه، تیم، محصول و نیاز سرمایه‌ی خود را معرفی کنید؛ پاسخ‌های روشن و دقیق، گفت‌وگوی اولیه را مفیدتر می‌کنند</p>
          <div className="apply-hero-actions">
            <a className="button button-lime button-large" href="#application-form">شروع فرم اولیه <ArrowUpLeft size={17} /></a>
            <a className="apply-hero-secondary" href="#campaign-criteria">بررسی شرایط دوره <ArrowUpLeft size={15} /></a>
          </div>
          <div className="campaign-status-card">
            <span className="status-rings"><i /><i /></span>
            <span><small>وضعیت دوره</small><strong>اطلاعیه‌ی رسمی هنوز منتشر نشده</strong></span>
            <span className="status-card-arrow"><ArrowUpLeft size={17} /></span>
          </div>
        </div>
        <div className="apply-hero-aside">
          <span className="aside-index">پ / ۰۱</span>
          <span className="apply-aside-kicker">پیش از ثبت درخواست</span>
          <p>شرایط، اولویت‌ها و محدوده‌ی هر دوره فقط در اطلاعیه‌ی رسمی اعلام می‌شود</p>
          <a href="#campaign-criteria" className="text-link">رفتن به اطلاعیه‌ی دوره <ArrowUpLeft size={16} /></a>
          <div className="apply-aside-orbit" aria-hidden="true"><CrystalMark /><i /><i /></div>
        </div>
      </section>

      <section className="campaign-criteria" id="campaign-criteria">
        <div className="campaign-criteria-intro">
          <div className="eyebrow">پیش از شروع</div>
          <h2>اطلاعیه‌ی کمپین</h2>
          <p>جزئیات زیر پس از تأیید تیم در صفحه‌ی کمپین درج می‌شوند؛ برای جلوگیری از ابهام، در این نسخه عدد یا شرط تأییدنشده‌ای اعلام نشده است</p>
        </div>
        <div className="campaign-facts-grid">
          <div><small>حوزه‌های مورد پذیرش</small><strong>۸ حوزه‌ی فناوری</strong><span>از سلامت تا صنعت و انرژی</span></div>
          <div><small>نوع و مبلغ سرمایه</small><strong>در حال تعیین</strong><span>در اطلاعیه‌ی رسمی دوره اعلام می‌شود</span></div>
          <div><small>مراحل رشد</small><strong>ایده تا رشد</strong><span>بررسی تناسب با هر دوره</span></div>
          <div><small>محدوده‌ی جغرافیایی</small><strong>در حال تعیین</strong><span>بر اساس شرایط هر کمپین</span></div>
        </div>
        <div className="campaign-benefit-strip">
          <span>همراهی فراتر از سرمایه</span>
          {valuePillars.slice(0, 4).map((item) => <span key={item.number}>{item.title}</span>)}
          <span className="campaign-benefit-more">+۴ مزیت دیگر</span>
        </div>
      </section>

      <section className="application-area" id="application-form">
        <div className="application-intro">
          <span className="eyebrow">فرم چندمرحله‌ای</span>
          <h2>شناخت اولیه‌ی<br /><em>تیم شما</em></h2>
          <p>با پاسخ‌های روشن و کوتاه شروع کنید؛ در صورت تناسب، اطلاعات تکمیلی در مرحله‌ی بعد دریافت می‌شود</p>
          <div className="application-privacy-note"><LockKeyhole size={17} /><span>اطلاعات این پیش‌نمایش به سرور ارسال یا ذخیره نمی‌شود</span></div>
          <div className="application-side-stats">
            <span><strong>۰۴</strong><small>مرحله‌ی کوتاه</small></span>
            <span><strong>۰۱</strong><small>مسیر روشن</small></span>
          </div>
        </div>

        <div className="application-card">
          {!submitted ? (
            <>
              <div className="application-progress" aria-label={`مرحله‌ی ${step + 1} از ${steps.length}`}>
                {steps.map((item, index) => (
                  <button type="button" className={`progress-step ${index === step ? 'is-current' : ''} ${index < step ? 'is-complete' : ''}`} key={item.short} onClick={() => index < step && setStep(index)} disabled={index > step} aria-current={index === step ? 'step' : undefined} aria-label={`مرحله‌ی ${new Intl.NumberFormat('fa-IR').format(index + 1)}: ${item.title}`}>
                    <span className="progress-number">{index < step ? <Check size={14} /> : new Intl.NumberFormat('fa-IR').format(index + 1)}</span>
                    <span className="progress-label">{item.short}</span>
                  </button>
                ))}
                <span className="progress-track"><i style={{ width: `${(step / (steps.length - 1)) * 100}%` }} /></span>
              </div>

              <form className="application-form" onSubmit={goNext} noValidate aria-labelledby="application-step-title">
                <div className="application-form-heading">
                  <span className="form-step-index">مرحله‌ی {new Intl.NumberFormat('fa-IR').format(step + 1)} از {new Intl.NumberFormat('fa-IR').format(steps.length)}</span>
                  <h3 id="application-step-title">{steps[step].title}</h3>
                  <p>{step === 0 ? 'اطلاعاتی برای شروع گفت‌وگو' : step === 1 ? 'محصول، مسئله و مرحله‌ی کسب‌وکار' : step === 2 ? 'میزان نیاز و برنامه‌ی مصرف سرمایه' : 'لینک‌ها و تأیید شرایط'}</p>
                </div>

                {step === 0 && (
                  <div className="application-fields-grid">
                    <Field label="نام و نام خانوادگی" name="fullName" value={form.fullName} onChange={update} placeholder="نام شما" required />
                    <Field label="سمت در تیم" name="role" value={form.role} onChange={update} placeholder="برای مثال: هم‌بنیان‌گذار" required />
                    <Field label="شماره‌ی موبایل" name="mobile" value={form.mobile} onChange={update} type="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr" required help="اتصال واقعی کد پیامکی در نسخه‌ی نهایی انجام می‌شود" />
                    <Field label="ایمیل" name="email" value={form.email} onChange={update} type="email" placeholder="name@example.com" dir="ltr" required />
                    <Field label="شهر محل فعالیت" name="city" value={form.city} onChange={update} placeholder="نام شهر" required />
                    <div className="verification-placeholder"><ShieldCheck size={17} /><span>تأیید موبایل</span><small>پس از اتصال سرویس پیامک فعال می‌شود</small></div>
                  </div>
                )}

                {step === 1 && (
                  <div className="application-fields-grid">
                    <Field label="نام استارتاپ یا محصول" name="projectName" value={form.projectName} onChange={update} placeholder="نام محصول" required />
                    <Field label="وب‌سایت محصول" name="website" value={form.website} onChange={update} placeholder="https://" dir="ltr" />
                    <SelectField label="مرحله‌ی کسب‌وکار" name="stage" value={form.stage} onChange={update} options={stageOptions} required />
                    <SelectField label="حوزه‌ی اصلی" name="industry" value={form.industry} onChange={update} options={industries.map((item) => item.title)} required />
                    <Field label="محصول شما در یک جمله" name="oneLiner" value={form.oneLiner} onChange={update} placeholder="برای چه کسی، چه مسئله‌ای را حل می‌کنید؟" required />
                    <Field label="شرح کوتاه محصول" name="description" value={form.description} onChange={update} type="textarea" placeholder="مسئله، راهکار و وضعیت فعلی محصول را توضیح دهید" required />
                  </div>
                )}

                {step === 2 && (
                  <div className="application-fields-grid">
                    <Field label="چرا به سرمایه نیاز دارید؟" name="fundingReason" value={form.fundingReason} onChange={update} type="textarea" placeholder="نقطه‌ی عطف بعدی شما چیست؟" required />
                    <Field label="مبلغ درخواستی" name="amount" value={form.amount} onChange={update} type="number" placeholder="مبلغ به تومان" dir="ltr" required />
                    <Field label="برنامه‌ی مصرف سرمایه" name="useOfFunds" value={form.useOfFunds} onChange={update} type="textarea" placeholder="محصول، تیم، فروش، زیرساخت و موارد دیگر" required />
                    <Field label="وضعیت فعلی فروش یا کاربران" name="traction" value={form.traction} onChange={update} type="textarea" placeholder="شاخص‌ها، روند و بازه‌ی زمانی" />
                    <Field label="تعداد اعضای تیم" name="teamSize" value={form.teamSize} onChange={update} type="number" placeholder="تعداد نفرات" dir="ltr" required />
                    <Field label="سرمایه‌گذاران قبلی" name="previousInvestors" value={form.previousInvestors} onChange={update} placeholder="در صورت وجود" />
                  </div>
                )}

                {step === 3 && (
                  <div className="application-fields-grid">
                    <div className="deck-upload-field">
                      <label htmlFor="deck-upload" className="deck-upload-label">
                        <span className="upload-icon"><FileUp size={23} /></span>
                        <strong>{form.deckName || 'بارگذاری پیچ‌دک'}</strong>
                        <small>فایل PDF · تا ۲۰ مگابایت</small>
                        <span className="button button-quiet"><Upload size={14} /> انتخاب فایل</span>
                      </label>
                      <input id="deck-upload" type="file" accept=".pdf,application/pdf" onChange={saveUploadName} />
                      <span className="upload-disclaimer">در این پیش‌نمایش فایل به جایی ارسال نمی‌شود</span>
                    </div>
                    <Field label="لینک‌های مرتبط" name="links" value={form.links} onChange={update} type="textarea" placeholder="ویدئو، نمونه‌کار، شبکه‌ی اجتماعی و موارد دیگر" dir="ltr" />
                    <label className={`application-consent ${errors.includes('agreed') ? 'has-error' : ''}`}>
                      <input type="checkbox" name="agreed" checked={form.agreed} onChange={(event) => update('agreed', event.target.checked)} />
                      <span className="custom-check"><Check size={13} /></span>
                      <span>با <a href={homeHref('terms')}>قوانین</a> و <a href={homeHref('privacy')}>حفظ محرمانگی اطلاعات</a> موافقم</span>
                    </label>
                  </div>
                )}

                {errors.length > 0 && <div className="form-error" role="alert">لطفاً موارد ستاره‌دار را کامل کنید</div>}
                <div className="application-form-actions">
                  {step > 0
                    ? <button type="button" className="button button-quiet" onClick={() => { setStep((current) => current - 1); setErrors([]); }}><ArrowRight size={16} /> مرحله‌ی قبل</button>
                    : <span className="form-privacy-micro"><LockKeyhole size={13} /> اطلاعات محرمانه می‌ماند</span>}
                  <button className="button button-lime" type="submit">{step === steps.length - 1 ? 'ثبت پیش‌نمایش درخواست' : 'ادامه'} <ArrowLeft size={16} /></button>
                </div>
              </form>
            </>
          ) : (
            <div className="application-success">
              <div className="success-mark"><Check size={28} /></div>
              <span className="eyebrow">پیش‌نمایش تکمیل فرم</span>
              <h3>قدم اول<br /><em>برداشته شد</em></h3>
              <p>شماره‌ی نمایشی درخواست شما</p>
              <strong className="reference-code" dir="ltr">{reference}</strong>
              <div className="demo-warning"><CircleHelp size={17} /><span>این یک نمونه‌ی نمایشی است؛ اطلاعات جایی ارسال یا ذخیره نشده است؛ اتصال سامانه و زمان پاسخ‌گویی باید پیش از راه‌اندازی نهایی شود</span></div>
              <button type="button" className="button button-lime" onClick={() => { setSubmitted(false); setStep(0); setForm(initialForm); }}>ثبت درخواست نمونه‌ی دیگر <ArrowLeft size={16} /></button>
            </div>
          )}
        </div>
      </section>

      <section className="applicant-portal" id="applicant-access">
        <div className="site-container applicant-portal-layout">
          <div className="applicant-portal-intro">
            <span className="eyebrow"><UserRound size={14} /> فضای متقاضیان</span>
            <h2>درخواستت را<br /><em>از همین‌جا پیگیری کن</em></h2>
            <p>پس از راه‌اندازی سامانه، ورود با شماره‌ی موبایل امکان مشاهده‌ی وضعیت، ویرایش اطلاعات، تکمیل مدارک و دریافت پیام‌ها را فراهم می‌کند</p>
            <div className="portal-security-note"><LockKeyhole size={16} /><span>ورود امن و کد یک‌بارمصرف در این طرح به سرویس احراز هویت متصل نیست</span></div>
          </div>
          <div className="applicant-portal-card">
            <div className="portal-card-heading"><span className="portal-card-icon"><Bell size={18} /></span><span><strong>ورود و پیگیری درخواست</strong><small>با شماره‌ی موبایلی که در فرم ثبت کرده‌اید</small></span></div>
            <form className="portal-login-form" onSubmit={portalRequested ? submitPortalCode : requestPortalAccess}>
              <label><span>شماره‌ی موبایل</span><input type="tel" dir="ltr" required value={portalPhone} onChange={(event) => setPortalPhone(event.target.value)} placeholder="۰۹۱۲۱۲۳۴۵۶۷" /></label>
              {portalRequested && <label><span>کد یک‌بارمصرف</span><input type="text" dir="ltr" inputMode="numeric" required value={portalCode} onChange={(event) => setPortalCode(event.target.value)} placeholder="کد تأیید" /></label>}
              <button type="submit" className="button button-lime">{portalRequested ? 'ورود نمایشی' : 'درخواست کد ورود'} <ArrowLeft size={15} /></button>
            </form>
            {portalMessage && <div className="portal-demo-message" role="status">{portalMessage}</div>}
            <div className="portal-features-grid">
              <div><Check size={14} /><span>وضعیت درخواست</span><small>پس از اتصال سامانه</small></div>
              <div><UserRound size={14} /><span>ویرایش اطلاعات</span><small>پس از اتصال سامانه</small></div>
              <div><FolderOpen size={14} /><span>مدارک و فرم‌های تکمیلی</span><small>پس از اتصال سامانه</small></div>
              <div><Bell size={14} /><span>پیام‌ها و اعلان‌ها</span><small>پس از اتصال سامانه</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="apply-support-row">
        <div className="apply-support-card"><span className="support-card-icon"><CircleHelp size={21} /></span><span><small>به راهنمایی نیاز دارید؟</small><strong>پرسش‌های پرتکرار متقاضیان</strong></span><a href={homeHref('faq')} aria-label="رفتن به پرسش‌های پرتکرار"><ArrowUpLeft size={18} /></a></div>
        <div className="apply-support-card"><span className="support-card-icon"><Sparkles size={21} /></span><span><small>پیش از ثبت نهایی</small><strong>اطلاعیه‌ی رسمی کمپین را بخوانید</strong></span><a href="#campaign-criteria" aria-label="رفتن به شرایط کمپین"><ArrowUpLeft size={18} /></a></div>
      </section>

      <footer className="apply-footer"><BrandLink href={rootHref} /><span>پارس · سرمایه‌گذاری جسورانه</span><a href={homeHref('privacy')}>حریم خصوصی و محرمانگی</a><span>پیش‌نمایش فرم · بدون ارسال اطلاعات</span></footer>
    </main>
  );
}
