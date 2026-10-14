import { useState } from 'react';
import { AlertCircle, ArrowRight, ArrowUpLeft, CheckCircle2, Clock3, LoaderCircle, Search } from 'lucide-react';
import { apiFetch } from '../lib/api.js';
import { pageHref } from '../lib/routes.js';
import ParsLogoMark from './ParsLogoMark.jsx';

const applicationStatuses = {
  new: {
    label: 'ثبت‌شده',
    description: 'درخواست شما در سامانه ثبت شده و در صف بررسی اولیه قرار دارد.',
    tone: 'new',
  },
  reviewing: {
    label: 'در حال بررسی',
    description: 'درخواست شما در حال بررسی است.',
    tone: 'reviewing',
  },
  needs_info: {
    label: 'نیازمند اطلاعات تکمیلی',
    description: 'برای ادامه‌ی بررسی، اطلاعات بیشتری لازم است. تیم بررسی از راه‌های ارتباطی ثبت‌شده با شما تماس می‌گیرد.',
    tone: 'needs-info',
  },
  accepted: {
    label: 'پذیرفته‌شده',
    description: 'وضعیت درخواست در سامانه به «پذیرفته‌شده» تغییر کرده است.',
    tone: 'accepted',
  },
  declined: {
    label: 'پذیرفته‌نشده',
    description: 'بررسی این درخواست به پایان رسیده و وضعیت آن در سامانه به‌روز شده است.',
    tone: 'declined',
  },
  archived: {
    label: 'بایگانی‌شده',
    description: 'پرونده‌ی درخواست بایگانی شده است.',
    tone: 'archived',
  },
};

function referenceFromLocation() {
  const fromSearch = new URLSearchParams(window.location.search).get('reference');
  if (fromSearch) return fromSearch;
  const hashQuery = window.location.hash.split('?').slice(1).join('?');
  return new URLSearchParams(hashQuery).get('reference') || '';
}

function formatDate(timestamp) {
  const value = Number(timestamp);
  if (!Number.isFinite(value) || value <= 0) return '—';
  return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' }).format(new Date(value));
}

export default function TrackingPage() {
  const [reference, setReference] = useState(referenceFromLocation);
  const [email, setEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [trackingBusy, setTrackingBusy] = useState(false);

  const updateField = (setter) => (event) => {
    setter(event.target.value);
    setTrackingResult(null);
    setTrackingError('');
  };

  const submitTracking = async (event) => {
    event.preventDefault();
    setTrackingBusy(true);
    setTrackingResult(null);
    setTrackingError('');
    try {
      const { data } = await apiFetch('/api/applications/track', {
        method: 'POST',
        body: JSON.stringify({ reference: reference.trim().toUpperCase(), email: email.trim() }),
      });
      setTrackingResult(data);
    } catch (error) {
      setTrackingError(error?.message || 'پیگیری درخواست انجام نشد. دوباره تلاش کنید.');
    } finally {
      setTrackingBusy(false);
    }
  };

  const status = trackingResult ? applicationStatuses[trackingResult.status] : null;

  return (
    <main className="pars-track-page" dir="rtl">
      <header className="pars-simple-header pars-container">
        <a className="pars-brand" href={pageHref('home')} aria-label="بازگشت به صفحه‌ی اصلی پارس">
          <ParsLogoMark decorative className="pars-brand-mark" />
          <span>پارس</span>
        </a>
        <a className="pars-simple-back" href={pageHref('home')}><ArrowRight size={17} /> بازگشت</a>
      </header>
      <section className="pars-track-content pars-container" aria-labelledby="pars-track-title">
        <ParsLogoMark decorative className="pars-track-mark" />
        <span className="pars-section-kicker">متقاضیان</span>
        <h1 id="pars-track-title">پیگیری درخواست</h1>
        <p className="pars-track-intro">برای مشاهده‌ی آخرین وضعیت، شناسه‌ی پیگیری و همان ایمیلی را وارد کنید که هنگام ثبت درخواست استفاده کردید.</p>

        <form className="pars-track-form" onSubmit={submitTracking}>
          <div className="pars-track-fields">
            <label className="pars-field" htmlFor="tracking-reference">
              <span className="pars-field-label">شناسه‌ی پیگیری <b aria-hidden="true">*</b></span>
              <input
                id="tracking-reference"
                name="reference"
                type="text"
                value={reference}
                onChange={updateField(setReference)}
                placeholder="PA-XXXXXXXXXXXXXXXX"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck="false"
                dir="ltr"
                required
                maxLength={19}
              />
            </label>
            <label className="pars-field" htmlFor="tracking-email">
              <span className="pars-field-label">ایمیل ثبت‌شده <b aria-hidden="true">*</b></span>
              <input
                id="tracking-email"
                name="email"
                type="email"
                value={email}
                onChange={updateField(setEmail)}
                placeholder="name@example.com"
                autoComplete="email"
                dir="ltr"
                required
                maxLength={254}
              />
            </label>
          </div>
          {trackingError && <div className="pars-submit-error pars-track-error" role="alert"><AlertCircle size={15} />{trackingError}</div>}
          <button className="pars-button pars-button--large pars-track-submit" type="submit" disabled={trackingBusy}>
            {trackingBusy ? <LoaderCircle size={17} className="pars-spinner" /> : <Search size={17} />}
            {trackingBusy ? 'در حال بررسی…' : 'پیگیری درخواست'}
          </button>
        </form>

        {trackingResult && status && (
          <section className="pars-track-result" aria-live="polite" aria-labelledby="pars-track-result-title">
            <div className="pars-track-result-heading">
              <span className={`pars-track-status pars-track-status--${status.tone}`}>
                {trackingResult.status === 'accepted' ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
                {status.label}
              </span>
              <h2 id="pars-track-result-title">وضعیت درخواست</h2>
            </div>
            <p>{status.description}</p>
            <dl className="pars-track-details">
              <div><dt>شناسه‌ی پیگیری</dt><dd dir="ltr">{trackingResult.reference}</dd></div>
              <div><dt>تاریخ ثبت</dt><dd>{formatDate(trackingResult.createdAt)}</dd></div>
              <div><dt>آخرین به‌روزرسانی</dt><dd>{formatDate(trackingResult.updatedAt)}</dd></div>
            </dl>
          </section>
        )}

        <p className="pars-track-privacy">برای حفظ حریم خصوصی، وضعیت فقط با شناسه‌ی پیگیری و ایمیل ثبت‌شده نمایش داده می‌شود.</p>
        <a className="pars-text-link pars-track-new" href={pageHref('apply')}>ثبت درخواست <ArrowUpLeft size={17} /></a>
      </section>
    </main>
  );
}
