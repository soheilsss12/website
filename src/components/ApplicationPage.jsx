import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpLeft, Check, FileUp, LoaderCircle, LockKeyhole, Upload } from 'lucide-react';
import { corporateName, industries, stageOptions } from '../data/siteContent.js';
import { validateApplicationStep } from '../lib/applicationValidation.js';
import { apiFetch } from '../lib/api.js';
import { pageHref } from '../lib/routes.js';
import ParsLogoMark from './ParsLogoMark.jsx';

const steps = [
  { title: 'اطلاعات تماس', short: 'تماس' },
  { title: 'ایده و محصول', short: 'محصول' },
  { title: 'نیاز سرمایه', short: 'سرمایه' },
  { title: 'مدارک و تأیید', short: 'مدارک' },
];

const initialForm = {
  fullName: '', role: '', mobile: '', email: '', city: '',
  projectName: '', website: '', stage: '', industry: '', oneLiner: '', description: '',
  fundingReason: '', amount: '', useOfFunds: '', traction: '', teamSize: '', previousInvestors: '',
  deckName: '', links: '', agreed: false,
};

const MAX_DECK_BYTES = 20 * 1024 * 1024;

function toPersianNumber(value) {
  return new Intl.NumberFormat('fa-IR').format(value);
}

async function fileToBase64(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chunkSize = 0x8000;
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return window.btoa(binary);
}

function Field({ label, name, value, onChange, errors, type = 'text', placeholder = '', required = false, dir, rows = 3, inputMode }) {
  const error = errors[name];
  const invalid = Boolean(error);
  const common = {
    id: name,
    name,
    value,
    onChange: (event) => onChange(name, event.target.value),
    placeholder,
    required,
    dir: dir || 'auto',
    inputMode,
    'aria-invalid': invalid,
    'aria-describedby': invalid ? `${name}-error` : undefined,
  };

  return (
    <label className={`pars-field ${invalid ? 'is-invalid' : ''}`} htmlFor={name}>
      <span className="pars-field-label">{label}{required && <b aria-hidden="true">*</b>}</span>
      {type === 'textarea'
        ? <textarea {...common} rows={rows} />
        : <input {...common} type={type} />}
      {invalid && <small id={`${name}-error`} className="pars-field-error">{error}</small>}
    </label>
  );
}

function SelectField({ label, name, value, onChange, errors, options, required = false }) {
  const error = errors[name];
  const invalid = Boolean(error);
  return (
    <label className={`pars-field ${invalid ? 'is-invalid' : ''}`} htmlFor={name}>
      <span className="pars-field-label">{label}{required && <b aria-hidden="true">*</b>}</span>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        required={required}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${name}-error` : undefined}
      >
        <option value="">انتخاب کنید</option>
        {options.map((option) => <option value={option} key={option}>{option}</option>)}
      </select>
      {invalid && <small id={`${name}-error`} className="pars-field-error">{error}</small>}
    </label>
  );
}

function SiteBrand({ href, legalName = false }) {
  return (
    <a className="pars-brand" href={href} aria-label="بازگشت به صفحه‌ی اصلی پارس">
      <ParsLogoMark decorative className="pars-brand-mark" />
      <span className={legalName ? 'pars-brand-name' : undefined}>{legalName ? corporateName : 'پارس'}</span>
    </a>
  );
}

export default function ApplicationPage() {
  const applyHost = window.location.hostname.toLowerCase().startsWith('apply.');
  const homeHref = applyHost
    ? `${window.location.protocol}//${window.location.hostname.replace(/^apply\./i, '')}/`
    : pageHref('home');
  const routeHref = (route) => applyHost ? `${homeHref}#${route}` : pageHref(route);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [deckFile, setDeckFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [submissionBusy, setSubmissionBusy] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setSubmissionError('');
  };

  const goNext = async (event) => {
    event.preventDefault();
    const nextErrors = validateApplicationStep(form, step);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      setErrors(nextErrors);
      document.querySelector(`[name="${firstError}"]`)?.focus();
      return;
    }
    setErrors({});
    setSubmissionError('');
    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmissionBusy(true);
    try {
      const deck = deckFile
        ? { name: deckFile.name, mimeType: 'application/pdf', dataBase64: await fileToBase64(deckFile) }
        : null;
      const { data } = await apiFetch('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ ...form, deck, companyWebsite: '' }),
      });
      if (!data?.stored || !data?.reference) {
        throw new Error('پاسخ ثبت درخواست معتبر نیست؛ درخواست ثبت‌شده تلقی نمی‌شود.');
      }
      setSubmissionReceipt(data);
      setSubmitted(true);
    } catch (error) {
      setSubmissionError(error?.message || 'اتصال به سامانه برقرار نشد؛ اطلاعات شما ثبت نشده است.');
    } finally {
      setSubmissionBusy(false);
    }
  };

  const saveUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) || file.size > MAX_DECK_BYTES) {
      setDeckFile(null);
      update('deckName', '');
      setUploadError('فقط فایل PDF تا ۲۰ مگابایت پذیرفته می‌شود.');
      event.target.value = '';
      return;
    }
    setDeckFile(file);
    setUploadError('');
    update('deckName', file.name);
  };

  const restart = () => {
    setStep(0);
    setForm(initialForm);
    setDeckFile(null);
    setErrors({});
    setUploadError('');
    setSubmissionError('');
    setSubmissionReceipt(null);
    setSubmitted(false);
  };

  return (
    <main className="pars-apply-page" dir="rtl">
      <header className="pars-form-header pars-container">
        <SiteBrand href={homeHref} legalName />
        <span className="pars-form-header-title">درخواست سرمایه</span>
        <a className="pars-form-header-link" href={routeHref('track')}>پیگیری درخواست <ArrowUpLeft size={15} /></a>
      </header>

      <section className="pars-apply-layout pars-container" id="application-form">
        <aside className="pars-apply-aside" aria-hidden="true">
          <span className="pars-section-kicker">سرمایه‌گذاری فناوری</span>
          <h1>از فناوری<br /><em>تا کسب‌وکار</em></h1>
          <ParsLogoMark decorative className="pars-apply-aside-mark" />
        </aside>

        <div className="pars-form-panel">
          {!submitted ? (
            <>
              <div className="pars-progress-top">
                <span>فرم درخواست</span>
                <span>گام {toPersianNumber(step + 1)} از {toPersianNumber(steps.length)}</span>
              </div>
              <nav className="pars-step-progress" aria-label="گام‌های درخواست سرمایه">
                {steps.map((item, index) => (
                  <button
                    className="pars-progress-button"
                    type="button"
                    key={item.short}
                    aria-label={`${item.title}${index < step ? '، بازگشت به این گام' : index === step ? '، گام فعلی' : '، در انتظار'}`}
                    aria-current={index === step ? 'step' : undefined}
                    disabled={index >= step || submissionBusy}
                    onClick={() => { setStep(index); setErrors({}); setSubmissionError(''); }}
                  >
                    <span className={`pars-progress-segment ${index <= step ? 'is-active' : ''}`} />
                  </button>
                ))}
              </nav>
              <form className="pars-application-form" onSubmit={goNext} noValidate>
                <div className="pars-form-heading">
                  <span>{steps[step].short}</span>
                  <h2>{steps[step].title}</h2>
                </div>

                {step === 0 && (
                  <div className="pars-form-grid">
                    <Field label="نام و نام خانوادگی" name="fullName" value={form.fullName} onChange={update} errors={errors} placeholder="نام شما" required />
                    <Field label="سمت در تیم" name="role" value={form.role} onChange={update} errors={errors} placeholder="هم‌بنیان‌گذار" required />
                    <Field label="شماره‌ی موبایل" name="mobile" value={form.mobile} onChange={update} errors={errors} type="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr" required />
                    <Field label="ایمیل" name="email" value={form.email} onChange={update} errors={errors} type="email" placeholder="name@example.com" dir="ltr" required />
                    <Field label="شهر محل فعالیت" name="city" value={form.city} onChange={update} errors={errors} placeholder="نام شهر" required />
                  </div>
                )}

                {step === 1 && (
                  <div className="pars-form-grid">
                    <Field label="نام استارتاپ یا محصول" name="projectName" value={form.projectName} onChange={update} errors={errors} placeholder="نام محصول" required />
                    <Field label="وب‌سایت محصول" name="website" value={form.website} onChange={update} errors={errors} type="url" placeholder="https://" dir="ltr" />
                    <SelectField label="مرحله‌ی کسب‌وکار" name="stage" value={form.stage} onChange={update} errors={errors} options={stageOptions} required />
                    <SelectField label="حوزه‌ی فعالیت" name="industry" value={form.industry} onChange={update} errors={errors} options={industries.map((item) => item.title)} required />
                    <Field label="محصول در یک جمله" name="oneLiner" value={form.oneLiner} onChange={update} errors={errors} placeholder="چه مسئله‌ای را حل می‌کنید؟" required />
                    <Field label="شرح کوتاه محصول" name="description" value={form.description} onChange={update} errors={errors} type="textarea" placeholder="مسئله و راهکار" required rows={3} />
                  </div>
                )}

                {step === 2 && (
                  <div className="pars-form-grid">
                    <Field label="دلیل نیاز به سرمایه" name="fundingReason" value={form.fundingReason} onChange={update} errors={errors} type="textarea" placeholder="گام بعدی چیست؟" required rows={3} />
                    <Field label="مبلغ درخواستی (تومان)" name="amount" value={form.amount} onChange={update} errors={errors} type="text" inputMode="numeric" placeholder="مبلغ" dir="ltr" required />
                    <Field label="برنامه‌ی مصرف سرمایه" name="useOfFunds" value={form.useOfFunds} onChange={update} errors={errors} type="textarea" placeholder="برنامه‌ی استفاده از سرمایه" required rows={3} />
                    <Field label="فروش یا کاربران فعلی" name="traction" value={form.traction} onChange={update} errors={errors} type="textarea" placeholder="اختیاری" rows={2} />
                    <Field label="تعداد اعضای تیم" name="teamSize" value={form.teamSize} onChange={update} errors={errors} type="text" inputMode="numeric" placeholder="تعداد" dir="ltr" required />
                    <Field label="سرمایه‌گذاران قبلی" name="previousInvestors" value={form.previousInvestors} onChange={update} errors={errors} placeholder="اختیاری" />
                  </div>
                )}

                {step === 3 && (
                  <div className="pars-form-grid pars-form-grid--last">
                    <div className="pars-upload-field">
                      <label className="pars-upload-card" htmlFor="deck-upload">
                        <span className="pars-upload-icon"><FileUp size={21} /></span>
                        <span><strong>{form.deckName || 'پیچ‌دک'}</strong><small>PDF · حداکثر ۲۰ مگابایت · اختیاری</small></span>
                        <span className="pars-upload-action"><Upload size={15} /> انتخاب</span>
                      </label>
                      <input id="deck-upload" type="file" accept=".pdf,application/pdf" onChange={saveUpload} />
                      {uploadError && <small className="pars-field-error" role="alert">{uploadError}</small>}
                    </div>
                    <Field label="پیوندهای مرتبط" name="links" value={form.links} onChange={update} errors={errors} type="textarea" placeholder="پیوندها (اختیاری)" dir="ltr" rows={3} />
                    <label className={`pars-consent ${Boolean(errors.agreed) ? 'is-invalid' : ''}`}>
                      <input type="checkbox" name="agreed" checked={form.agreed} onChange={(event) => update('agreed', event.target.checked)} />
                      <span className="pars-consent-box"><Check size={13} /></span>
                      <span>با <a href={routeHref('terms')}>قوانین</a> و <a href={routeHref('privacy')}>حریم خصوصی</a> موافقم</span>
                    </label>
                    {errors.agreed && <small className="pars-field-error" role="alert">{errors.agreed}</small>}
                  </div>
                )}

                {submissionError && <div className="pars-submit-error" role="alert">{submissionError}</div>}
                <div className="pars-form-actions">
                  {step > 0 ? (
                    <button className="pars-back-step" type="button" onClick={() => { setStep((current) => current - 1); setErrors({}); }} disabled={submissionBusy}>
                      <ArrowRight size={16} /> مرحله‌ی قبل
                    </button>
                  ) : <span className="pars-form-privacy"><LockKeyhole size={14} /> ثبت پس از پاسخ سامانه</span>}
                  <button className="pars-button pars-button--large" type="submit" disabled={submissionBusy}>
                    {submissionBusy ? <LoaderCircle size={16} className="pars-spinner" /> : null}
                    {submissionBusy ? 'در حال ثبت…' : step === steps.length - 1 ? 'ثبت درخواست' : 'ادامه'}
                    {!submissionBusy && <ArrowLeft size={16} />}
                  </button>
                </div>
                {Object.keys(errors).length > 0 && <p className="pars-error-summary" role="alert">موارد مشخص‌شده را بررسی کنید.</p>}
              </form>
            </>
          ) : (
            <div className="pars-success" role="status" aria-live="polite">
              <ParsLogoMark decorative className="pars-success-mark" />
              <span className="pars-section-kicker">ثبت درخواست</span>
              <h2>درخواست شما ثبت شد.</h2>
              <p>اطلاعات در سامانه ذخیره شد.</p>
              <div className="pars-receipt"><span>شناسه‌ی پیگیری</span><code dir="ltr">{submissionReceipt?.reference}</code></div>
              {submissionReceipt?.notification === 'blocked' && <small className="pars-notice">اعلان ایمیلی برای تیم پیکربندی نشده است.</small>}
              {submissionReceipt?.notification === 'pending' && <small className="pars-notice">اعلان برای تیم در صف ارسال قرار گرفت.</small>}
              <div className="pars-success-actions">
                <a
                  className="pars-button"
                  href={`${routeHref('track')}?reference=${encodeURIComponent(submissionReceipt?.reference || '')}`}
                >پیگیری درخواست <ArrowUpLeft size={16} /></a>
                <button type="button" className="pars-back-step" onClick={restart}>ثبت درخواست دیگر</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="pars-form-footer pars-container">
        <SiteBrand href={homeHref} />
        <div><a href={routeHref('terms')}>قوانین</a><a href={routeHref('privacy')}>حریم خصوصی</a><a href={routeHref('track')}>پیگیری</a></div>
      </footer>
    </main>
  );
}
