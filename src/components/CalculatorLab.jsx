import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpLeft,
  BarChart3,
  Check,
  CircleHelp,
  Copy,
  Gauge,
  LineChart,
  PieChart,
  Share2,
  ShieldCheck,
  WalletCards,
  X,
} from 'lucide-react';
import CrystalMark from './CrystalMark.jsx';
import { pageHref } from '../lib/routes.js';

const numberFormat = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 });
const numberOf = (value) => Math.max(0, Number(value) || 0);
const fmt = (value, digits = 1) => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: digits }).format(Number.isFinite(value) ? value : 0);
const percent = (value) => `${fmt(value)}٪`;

export const calculatorTools = [
  {
    id: 'valuation', title: 'ارزش‌گذاری استارتاپ', eyebrow: 'ارزش‌گذاری', icon: BarChart3,
    description: 'رابطه‌ی مبلغ جذب و درصد سهام را برای یک برآورد اولیه ببینید',
    formula: 'ارزش پس از سرمایه‌گذاری = مبلغ سرمایه ÷ درصد سهام',
    fields: [
      { key: 'amount', label: 'مبلغ سرمایه‌ی درخواستی', unit: 'میلیون تومان', type: 'number', min: 0, default: 500 },
      { key: 'equity', label: 'درصد سهام پیشنهادی', unit: 'درصد', type: 'number', min: 0.1, max: 99, step: 0.1, default: 10 },
    ],
    calculate: (v) => {
      const amount = numberOf(v.amount); const equity = Math.min(99, Math.max(0.1, numberOf(v.equity)));
      const post = amount / (equity / 100);
      return { main: `${fmt(post)} میلیون تومان`, label: 'ارزش پس از سرمایه‌گذاری', secondary: `ارزش پیش از سرمایه‌گذاری: ${fmt(Math.max(0, post - amount))} میلیون تومان`, note: 'این محاسبه فقط یک برآورد ریاضی است؛ ارزش‌گذاری نهایی به مذاکره و شرایط معامله وابسته است' };
    },
  },
  {
    id: 'runway', title: 'دوام نقدینگی (Runway)', eyebrow: 'نقدینگی', icon: Activity,
    description: 'برآورد کنید با نقدینگی و هزینه‌ی فعلی، چند ماه فرصت دارید',
    formula: 'Runway = نقدینگی در دسترس ÷ هزینه‌ی خالص ماهانه',
    fields: [
      { key: 'cash', label: 'نقدینگی در دسترس', unit: 'میلیون تومان', type: 'number', min: 0, default: 2400 },
      { key: 'burn', label: 'هزینه‌ی خالص ماهانه', unit: 'میلیون تومان', type: 'number', min: 0, default: 300 },
    ],
    calculate: (v) => {
      const cash = numberOf(v.cash); const burn = numberOf(v.burn); const months = burn ? cash / burn : 0;
      return { main: burn ? `${fmt(months)} ماه` : '—', label: 'زمان باقی‌مانده', secondary: `نقدینگی ماهانه‌ی برآوردی: ${fmt(burn)} میلیون تومان`, note: 'هزینه‌های پیش‌بینی‌نشده، تغییر درآمد و زمان جذب سرمایه را در سناریوهای جداگانه بررسی کنید' };
    },
  },
  {
    id: 'dilution', title: 'رقیق‌شدن سهام', eyebrow: 'سهام', icon: PieChart,
    description: 'اثر یک دور جذب سرمایه‌ی جدید را روی سهم فعلی خود بسنجید',
    formula: 'سهم جدید شما = سهم فعلی × (۱ − درصد سهام واگذار‌شده)',
    fields: [
      { key: 'current', label: 'سهم فعلی شما', unit: 'درصد', type: 'number', min: 0, max: 100, default: 60 },
      { key: 'round', label: 'سهام واگذارشده در دور جدید', unit: 'درصد', type: 'number', min: 0, max: 99, default: 15 },
    ],
    calculate: (v) => {
      const current = Math.min(100, numberOf(v.current)); const round = Math.min(99, numberOf(v.round));
      const result = current * (1 - round / 100);
      return { main: percent(result), label: 'سهم شما پس از جذب سرمایه', secondary: `تغییر سهم: ${percent(current - result)}`, note: 'این مدل ساده، سهام تشویقی، حق تقدم، اوراق قابل تبدیل و شروط خاص قرارداد را لحاظ نمی‌کند' };
    },
  },
  {
    id: 'captable', title: 'جدول سهامداری (Cap Table)', eyebrow: 'سهم‌داران', icon: WalletCards,
    description: 'توزیع تقریبی مالکیت را پس از ورود سرمایه‌گذار جدید ببینید',
    formula: 'سهم هر گروه پس از دور = سهم پیش از دور × (۱ − درصد دور جدید)',
    fields: [
      { key: 'founders', label: 'بنیان‌گذاران', unit: 'درصد', type: 'number', min: 0, max: 100, default: 70 },
      { key: 'early', label: 'سرمایه‌گذاران فعلی', unit: 'درصد', type: 'number', min: 0, max: 100, default: 20 },
      { key: 'pool', label: 'سهام تشویقی', unit: 'درصد', type: 'number', min: 0, max: 100, default: 10 },
      { key: 'round', label: 'سهم دور جدید', unit: 'درصد', type: 'number', min: 0, max: 99, default: 15 },
    ],
    calculate: (v) => {
      const factor = 1 - Math.min(99, numberOf(v.round)) / 100;
      const founders = numberOf(v.founders) * factor; const early = numberOf(v.early) * factor; const pool = numberOf(v.pool) * factor;
      const total = founders + early + pool + (1 - factor) * 100;
      return { main: percent(founders), label: 'سهم بنیان‌گذاران پس از دور', secondary: `سرمایه‌گذاران فعلی ${percent(early)} · سهام تشویقی ${percent(pool)} · دور جدید ${percent((1 - factor) * 100)}`, note: `جمع تقریبی جدول: ${percent(total)}؛ پیش از تصمیم، درصدها و شروط قرارداد را با مشاور حقوقی بررسی کنید` };
    },
  },
  {
    id: 'cac', title: 'هزینه‌ی جذب مشتری (CAC)', eyebrow: 'هزینه‌ی جذب', icon: Gauge,
    description: 'هزینه‌ی جذب هر مشتری را در یک بازه‌ی مشخص محاسبه کنید',
    formula: 'CAC = مجموع هزینه‌ی جذب ÷ تعداد مشتریان جدید',
    fields: [
      { key: 'spend', label: 'هزینه‌ی فروش و بازاریابی', unit: 'میلیون تومان', type: 'number', min: 0, default: 180 },
      { key: 'customers', label: 'مشتریان جدید', unit: 'نفر', type: 'number', min: 0, default: 90 },
    ],
    calculate: (v) => {
      const spend = numberOf(v.spend); const customers = numberOf(v.customers); const cac = customers ? spend / customers : 0;
      return { main: customers ? `${fmt(cac)} میلیون تومان` : '—', label: 'هزینه‌ی جذب هر مشتری', secondary: `هزینه‌ی کل بازه: ${fmt(spend)} میلیون تومان`, note: 'هزینه‌ی تیم فروش، تخفیف و کانال‌های مختلف را در صورت نیاز به محاسبه اضافه کنید' };
    },
  },
  {
    id: 'ltv', title: 'ارزش طول عمر مشتری (LTV)', eyebrow: 'ارزش طول عمر', icon: LineChart,
    description: 'یک برآورد پایه از ارزش طول عمر مشتری اشتراکی به دست آورید',
    formula: 'LTV تقریبی = درآمد ماهانه‌ی هر مشتری × حاشیه‌ی سود ناخالص ÷ ریزش ماهانه',
    fields: [
      { key: 'arpu', label: 'درآمد ماهانه از هر مشتری', unit: 'میلیون تومان', type: 'number', min: 0, default: 2.5 },
      { key: 'margin', label: 'حاشیه‌ی سود ناخالص', unit: 'درصد', type: 'number', min: 0, max: 100, default: 75 },
      { key: 'churn', label: 'ریزش ماهانه‌ی مشتری', unit: 'درصد', type: 'number', min: 0.1, max: 100, step: 0.1, default: 5 },
    ],
    calculate: (v) => {
      const arpu = numberOf(v.arpu); const margin = Math.min(100, numberOf(v.margin)); const churn = numberOf(v.churn); const ltv = churn ? arpu * (margin / 100) / (churn / 100) : 0;
      return { main: churn ? `${fmt(ltv)} میلیون تومان` : '—', label: 'ارزش طول عمر تقریبی', secondary: `دوره‌ی بازگشت سرمایه را در کنار CAC بررسی کنید`, note: 'مدل پایه است و تغییر رفتار مشتری، هزینه‌ی نگهداشت و ارزش زمانی پول را در نظر نمی‌گیرد' };
    },
  },
  {
    id: 'saas', title: 'شاخص‌های SaaS', eyebrow: 'درآمد تکرارشونده', icon: BarChart3,
    description: 'درآمد سالانه‌ی تکرارشونده و نرخ رشد ماهانه را تخمین بزنید',
    formula: 'ARR = درآمد تکرارشونده‌ی ماهانه × ۱۲',
    fields: [
      { key: 'mrr', label: 'درآمد تکرارشونده‌ی ماهانه (MRR)', unit: 'میلیون تومان', type: 'number', min: 0, default: 420 },
      { key: 'growth', label: 'رشد ماهانه‌ی MRR', unit: 'درصد', type: 'number', min: -100, max: 300, default: 8 },
    ],
    calculate: (v) => {
      const mrr = numberOf(v.mrr); const growth = Number(v.growth) || 0; const arr = mrr * 12;
      return { main: `${fmt(arr)} میلیون تومان`, label: 'ARR برآوردی', secondary: `MRR فعلی ${fmt(mrr)} میلیون تومان · رشد ماهانه ${percent(growth)}`, note: 'ARR برون‌یابی ساده‌ی MRR است؛ درآمد غیرتکرارشونده، تخفیف و ریزش باید جداگانه بررسی شوند' };
    },
  },
];

const defaultValues = (tool) => Object.fromEntries(tool.fields.map((field) => [field.key, field.default]));

function ToolInput({ field, value, onChange }) {
  const isRange = field.type === 'range';
  return (
    <label className={`tool-field ${isRange ? 'is-range-field' : ''}`}>
      <span className="tool-field-label">{field.label}</span>
      <span className="tool-field-control">
        <input
          type={field.type === 'range' ? 'range' : 'number'}
          min={field.min ?? 0}
          max={field.max}
          step={field.step ?? (isRange ? 1 : 'any')}
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
        />
        <span className="tool-field-unit">{isRange ? `${numberFormat.format(Number(value))} ${field.unit}` : field.unit}</span>
      </span>
    </label>
  );
}

export default function CalculatorLab({ toolId, onClose }) {
  const tool = useMemo(() => calculatorTools.find((item) => item.id === toolId) || calculatorTools[0], [toolId]);
  const [values, setValues] = useState(() => defaultValues(tool));
  const [shareMessage, setShareMessage] = useState('');
  const result = tool.calculate(values);
  const Icon = tool.icon;

  useEffect(() => {
    setValues(defaultValues(tool));
    setShareMessage('');
  }, [tool]);

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('has-modal');
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.classList.remove('has-modal'); };
  }, [onClose]);

  const updateValue = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const summary = `${tool.title}: ${result.label} ${result.main}. ${result.secondary}`;
  const copyResult = async (share = false) => {
    try {
      if (share && navigator.share) {
        await navigator.share({ title: 'نتیجه‌ی محاسبه در پارس', text: summary });
        setShareMessage('نتیجه به‌اشتراک گذاشته شد');
      } else {
        await navigator.clipboard.writeText(summary);
        setShareMessage('نتیجه کپی شد');
      }
    } catch {
      setShareMessage('اشتراک‌گذاری در این مرورگر در دسترس نیست');
    }
    window.setTimeout(() => setShareMessage(''), 2600);
  };

  return (
    <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="calculator-dialog" role="dialog" aria-modal="true" aria-labelledby="calculator-title" dir="rtl">
        <header className="dialog-header">
          <div className="dialog-brand"><span className="dialog-brand-mark"><CrystalMark /></span><span>ابزارهای پارس</span></div>
          <button type="button" className="icon-button dialog-close" onClick={onClose} aria-label="بستن"><X size={20} /></button>
        </header>
        <div className="calculator-layout">
          <aside className="calculator-side">
            <div className="calculator-side-icon"><Icon size={25} strokeWidth={1.5} /></div>
            <span className="eyebrow">{tool.eyebrow}</span>
            <h2 id="calculator-title">{tool.title}</h2>
            <p>{tool.description}</p>
            <div className="formula-card"><span>فرمول پایه</span><code>{tool.formula}</code></div>
            <div className="calculator-side-note"><CircleHelp size={17} /><p>نتیجه‌ی این ابزار برآورد آموزشی است و جایگزین بررسی تخصصی مالی یا حقوقی نیست</p></div>
          </aside>
          <div className="calculator-main">
            <div className="result-card">
              <div className="result-card-top"><span>نتیجه‌ی زنده</span><span className="result-live-dot"><i /> در حال محاسبه</span></div>
              <strong>{result.main}</strong>
              <span className="result-label">{result.label}</span>
              <p>{result.secondary}</p>
              <div className="result-actions">
                <button type="button" className="button button-quiet" onClick={() => copyResult()}><Copy size={15} /> کپی نتیجه</button>
                <button type="button" className="button button-quiet" onClick={() => copyResult(true)}><Share2 size={15} /> اشتراک‌گذاری</button>
                {shareMessage && <span className="copy-feedback"><Check size={13} /> {shareMessage}</span>}
              </div>
            </div>
            <div className="calculator-inputs">
              <div className="calculator-inputs-heading"><span>اطلاعات ورودی</span><span>همه‌ی اعداد در همین مرورگر پردازش می‌شوند</span></div>
              <div className={`tool-fields-grid ${tool.id === 'maturity' ? 'is-maturity' : ''}`}>
                {tool.fields.map((field) => <ToolInput key={field.key} field={field} value={values[field.key]} onChange={updateValue} />)}
              </div>
            </div>
            <div className="calculator-footer-note"><ShieldCheck size={17} /><p>{result.note}</p></div>
            <div className="calculator-dialog-footer">
              <a href={pageHref('apply')} className="button button-lime" onClick={onClose}>درخواست سرمایه <ArrowUpLeft size={15} /></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
