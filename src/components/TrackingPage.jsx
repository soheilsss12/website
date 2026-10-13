import { ArrowRight, ArrowUpLeft } from 'lucide-react';
import ParsLogoMark from './ParsLogoMark.jsx';
import { pageHref } from '../lib/routes.js';

export default function TrackingPage() {
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
        <p>سامانه‌ی پیگیری آنلاین هنوز فعال نیست.</p>
        <a className="pars-button pars-button--large" href={pageHref('apply')}>ثبت درخواست <ArrowUpLeft size={18} /></a>
      </section>
    </main>
  );
}
