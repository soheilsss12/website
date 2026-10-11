import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Archive,
  ArrowDownToLine,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Inbox,
  LoaderCircle,
  LogOut,
  Mail,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react';
import { ApiError, apiFetch, apiUrl } from '../lib/api.js';
import CrystalMark from './CrystalMark.jsx';

const labels = {
  applications: 'درخواست‌های سرمایه',
  contacts: 'پیام‌های تماس',
  new: 'جدید',
  reviewing: 'در حال بررسی',
  needs_info: 'نیازمند اطلاعات',
  accepted: 'پذیرفته‌شده',
  declined: 'ردشده',
  in_progress: 'در حال پیگیری',
  closed: 'بسته‌شده',
  archived: 'بایگانی‌شده',
  pending: 'در صف ارسال',
  sent: 'ارسال‌شده',
  failed: 'ارسال ناموفق',
  blocked: 'پیکربندی‌نشده',
  none: 'بدون اعلان',
};

const statuses = {
  applications: ['new', 'reviewing', 'needs_info', 'accepted', 'declined', 'archived'],
  contacts: ['new', 'in_progress', 'closed', 'archived'],
};

function errorText(error) {
  if (error instanceof ApiError) return error.message;
  return 'ارتباط با سامانه برقرار نشد. دوباره تلاش کنید.';
}

function formatDate(timestamp) {
  if (!timestamp) return '—';
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

function StatusPill({ value, className = '' }) {
  return <span className={`admin-status-pill status-${value || 'none'} ${className}`}>{labels[value] || value || '—'}</span>;
}

function LoginForm({ onLogin, busy, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <section className="admin-login-card" aria-labelledby="admin-login-title">
      <div className="admin-login-mark"><CrystalMark /></div>
      <span className="eyebrow">دسترسی محدود</span>
      <h1 id="admin-login-title">ورود به پنل مدیریت</h1>
      <p>نام کاربری و گذرواژه‌ی مدیریتی را که در تنظیمات امن سرور تعریف شده وارد کنید.</p>
      <form onSubmit={(event) => { event.preventDefault(); onLogin(username, password); }}>
        <label><span>نام کاربری</span><input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required maxLength={64} /></label>
        <label><span>گذرواژه</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required maxLength={256} /></label>
        {error && <div className="admin-inline-error" role="alert"><AlertCircle size={16} />{error}</div>}
        <button className="button button-lime" type="submit" disabled={busy}>
          {busy ? <LoaderCircle size={16} className="admin-spinner" /> : <ShieldCheck size={16} />}
          {busy ? 'در حال ورود…' : 'ورود امن'}
        </button>
      </form>
      <small className="admin-login-footnote">حساب پیش‌فرض یا نمایشی ساخته نمی‌شود. دسترسی فعال فقط با تنظیم سرور ممکن است.</small>
    </section>
  );
}

function DataValue({ label, children, wide = false }) {
  if (children === undefined || children === null || children === '') return null;
  return <div className={`admin-data-value ${wide ? 'is-wide' : ''}`}><small>{label}</small><p>{children}</p></div>;
}

function SubmissionDetails({ kind, record, csrfToken, onSaved, onDeleted, onRetryNotification }) {
  const [status, setStatus] = useState(record.status);
  const [adminNote, setAdminNote] = useState(record.adminNote || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deckBusy, setDeckBusy] = useState(false);

  useEffect(() => {
    setStatus(record.status);
    setAdminNote(record.adminNote || '');
    setError('');
    setNotice('');
  }, [record.id, record.status, record.adminNote]);

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const { data } = await apiFetch(`/api/admin/submissions/${kind}/${record.id}`, {
        method: 'PATCH',
        headers: { 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({ status, adminNote }),
      });
      setNotice('تغییرات ذخیره شد.');
      onSaved(data.record);
    } catch (caught) {
      setError(errorText(caught));
    } finally {
      setBusy(false);
    }
  };

  const removeSubmission = async () => {
    const confirmed = window.confirm('این مورد، فایل پیوست و اعلان‌های مرتبط برای همیشه حذف شوند؟ این کار قابل بازگشت نیست.');
    if (!confirmed) return;
    setBusy(true);
    setError('');
    try {
      await apiFetch(`/api/admin/submissions/${kind}/${record.id}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-Token': csrfToken },
      });
      onDeleted(record.id);
    } catch (caught) {
      setError(errorText(caught));
      setBusy(false);
    }
  };

  const downloadDeck = async () => {
    setDeckBusy(true);
    setError('');
    try {
      const response = await fetch(apiUrl(`/api/admin/submissions/applications/${record.id}/deck`), { credentials: 'include' });
      if (!response.ok) {
        let payload = null;
        try { payload = await response.json(); } catch { /* A text response has no details. */ }
        throw new Error(payload?.error || 'دریافت فایل انجام نشد.');
      }
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = record.deckName || 'pitch-deck.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (caught) {
      setError(caught.message || 'دریافت فایل انجام نشد.');
    } finally {
      setDeckBusy(false);
    }
  };

  const fieldRows = kind === 'applications'
    ? [
      ['نام و نام خانوادگی', record.fullName], ['سمت در تیم', record.role],
      ['شماره‌ی موبایل', record.mobile], ['ایمیل', record.email], ['شهر اعلام‌شده', record.city],
      ['نام استارتاپ یا محصول', record.projectName], ['وب‌سایت', record.website],
      ['مرحله‌ی کسب‌وکار', record.stage], ['حوزه‌ی فعالیت', record.industry],
      ['مبلغ درخواستی (تومان)', Number(record.amount || 0).toLocaleString('fa-IR')],
      ['تعداد اعضای تیم', Number(record.teamSize || 0).toLocaleString('fa-IR')],
      ['سرمایه‌گذاران قبلی', record.previousInvestors], ['معرفی یک‌جمله‌ای', record.oneLiner],
      ['شرح محصول', record.description], ['دلیل نیاز به سرمایه', record.fundingReason],
      ['برنامه‌ی مصرف سرمایه', record.useOfFunds], ['وضعیت فروش یا کاربران', record.traction],
      ['لینک‌های مرتبط', record.links],
    ]
    : [
      ['نام فرستنده', record.name], ['راه ارتباطی', record.contact], ['موضوع', record.topic],
      ['متن پیام', record.message],
    ];

  return (
    <article className="admin-detail-card" aria-labelledby="admin-detail-title">
      <header className="admin-detail-head">
        <div><span className="eyebrow">{kind === 'applications' ? 'درخواست سرمایه' : 'پیام تماس'}</span><h2 id="admin-detail-title">{kind === 'applications' ? record.projectName : record.topic}</h2></div>
        <StatusPill value={record.status} />
      </header>
      <div className="admin-detail-meta"><span><Clock3 size={14} />{formatDate(record.createdAt)}</span><code>{record.id}</code></div>
      {kind === 'applications' && record.hasDeck && <button className="admin-download-button" type="button" onClick={downloadDeck} disabled={deckBusy}><ArrowDownToLine size={16} />{deckBusy ? 'در حال دریافت…' : `دریافت فایل PDF · ${record.deckName}`}</button>}
      <div className="admin-data-grid">
        {fieldRows.map(([label, value]) => <DataValue label={label} key={label} wide={String(value || '').length > 90}>{value}</DataValue>)}
      </div>
      <section className="admin-notification-box" aria-label="وضعیت اعلان ایمیلی">
        <div><Mail size={17} /><span><strong>اعلان ایمیلی</strong><small>{labels[record.notification?.status] || 'وضعیت نامشخص'}</small></span></div>
        {record.notification?.lastError && <p>{record.notification.lastError}</p>}
        {record.notification?.sentAt && <small>ارسال در {formatDate(record.notification.sentAt)}</small>}
        {['failed', 'blocked'].includes(record.notification?.status) && <button type="button" className="button button-quiet" onClick={() => onRetryNotification(record.id)}>قرار دادن دوباره در صف</button>}
      </section>
      <form className="admin-manage-form" onSubmit={save}>
        <label><span>وضعیت پیگیری</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses[kind].map((item) => <option value={item} key={item}>{labels[item]}</option>)}</select></label>
        <label><span>یادداشت داخلی</span><textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} rows={4} maxLength={5000} placeholder="یادداشت داخلی؛ برای متقاضی نمایش داده نمی‌شود" /></label>
        {error && <div className="admin-inline-error" role="alert"><AlertCircle size={16} />{error}</div>}
        {notice && <div className="admin-inline-success" role="status"><Check size={16} />{notice}</div>}
        <button className="button button-lime" type="submit" disabled={busy}>{busy ? <LoaderCircle size={16} className="admin-spinner" /> : <CheckCircle2 size={16} />}{busy ? 'در حال ذخیره…' : 'ذخیره‌ی تغییرات'}</button>
        <button className="admin-delete-button" type="button" onClick={removeSubmission} disabled={busy}><Trash2 size={15} />حذف دائمی اطلاعات و فایل پیوست</button>
      </form>
    </article>
  );
}

export default function AdminPage() {
  const [authState, setAuthState] = useState('checking');
  const [csrfToken, setCsrfToken] = useState('');
  const [username, setUsername] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [kind, setKind] = useState('applications');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [listBusy, setListBusy] = useState(false);
  const [listError, setListError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [record, setRecord] = useState(null);
  const [detailBusy, setDetailBusy] = useState(false);
  const [dashboardNotice, setDashboardNotice] = useState('');
  const [dashboardError, setDashboardError] = useState('');
  const pageSize = 30;

  const acceptSession = useCallback((data) => {
    setUsername(data.username);
    setCsrfToken(data.csrfToken);
    setAuthState('authenticated');
    setAuthError('');
  }, []);

  useEffect(() => {
    let active = true;
    apiFetch('/api/admin/session')
      .then(({ data }) => { if (active) acceptSession(data); })
      .catch((error) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) setAuthState('anonymous');
        else {
          setAuthState('offline');
          setAuthError(errorText(error));
        }
      });
    return () => { active = false; };
  }, [acceptSession]);

  const loadList = useCallback(async () => {
    setListBusy(true);
    setListError('');
    const params = new URLSearchParams({ kind, limit: String(pageSize), offset: String(page * pageSize) });
    if (status !== 'all') params.set('status', status);
    if (search.trim()) params.set('q', search.trim());
    try {
      const { data } = await apiFetch(`/api/admin/submissions?${params.toString()}`);
      setItems(data.items || []);
      setTotal(data.total || 0);
      if (selectedId && !(data.items || []).some((item) => item.id === selectedId)) {
        setSelectedId('');
        setRecord(null);
      }
    } catch (error) {
      setListError(errorText(error));
    } finally {
      setListBusy(false);
    }
  }, [kind, page, pageSize, search, selectedId, status]);

  useEffect(() => {
    if (authState !== 'authenticated') return undefined;
    const timer = window.setTimeout(() => { void loadList(); }, 220);
    return () => window.clearTimeout(timer);
  }, [authState, loadList]);

  useEffect(() => {
    if (authState !== 'authenticated' || !selectedId) {
      setRecord(null);
      return undefined;
    }
    let active = true;
    setDetailBusy(true);
    apiFetch(`/api/admin/submissions/${kind}/${selectedId}`)
      .then(({ data }) => { if (active) setRecord(data.record); })
      .catch((error) => { if (active) setDashboardError(errorText(error)); })
      .finally(() => { if (active) setDetailBusy(false); });
    return () => { active = false; };
  }, [authState, kind, selectedId]);

  const signIn = async (nextUsername, password) => {
    setLoginBusy(true);
    setAuthError('');
    try {
      const { data } = await apiFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username: nextUsername, password }),
      });
      acceptSession(data);
    } catch (error) {
      setAuthError(errorText(error));
    } finally {
      setLoginBusy(false);
    }
  };

  const signOut = async () => {
    try {
      await apiFetch('/api/admin/logout', { method: 'POST', headers: { 'X-CSRF-Token': csrfToken }, body: '{}' });
    } catch {
      // The local page is still locked; an expired server session cannot be reused.
    }
    setAuthState('anonymous');
    setCsrfToken('');
    setUsername('');
    setItems([]);
    setRecord(null);
    setSelectedId('');
  };

  const retryNotification = async (id) => {
    setDashboardError('');
    setDashboardNotice('');
    try {
      const { data } = await apiFetch(`/api/admin/submissions/${kind}/${id}/notification/retry`, {
        method: 'POST',
        headers: { 'X-CSRF-Token': csrfToken },
        body: '{}',
      });
      setDashboardNotice(data.configured ? 'اعلان برای ارسال دوباره در صف قرار گرفت.' : 'اعلان در صف ثبت شد؛ ابتدا تنظیمات ایمیل سرور را کامل کنید.');
      await loadList();
      const { data: detail } = await apiFetch(`/api/admin/submissions/${kind}/${id}`);
      setRecord(detail.record);
    } catch (error) {
      setDashboardError(errorText(error));
    }
  };

  const selectKind = (nextKind) => {
    setKind(nextKind);
    setStatus('all');
    setPage(0);
    setSelectedId('');
    setRecord(null);
    setDashboardError('');
    setDashboardNotice('');
  };

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentRange = useMemo(() => total === 0 ? '۰ مورد' : `${(page * pageSize + 1).toLocaleString('fa-IR')}–${Math.min(total, (page + 1) * pageSize).toLocaleString('fa-IR')} از ${total.toLocaleString('fa-IR')}`, [page, pageSize, total]);

  if (authState === 'checking') {
    return <main className="admin-page" dir="rtl"><div className="admin-loading"><LoaderCircle className="admin-spinner" size={24} />در حال بررسی نشست مدیریتی…</div></main>;
  }
  if (authState === 'offline') {
    return <main className="admin-page" dir="rtl"><div className="admin-offline-card"><span className="admin-login-mark"><CrystalMark /></span><span className="eyebrow">سامانه‌ی مدیریت</span><h1>بک‌اند در دسترس نیست</h1><p>{authError}</p><p>پنل مدیریت و فرم‌ها تنها زمانی داده‌ای دریافت می‌کنند که API روی یک میزبان فعال و پیکربندی‌شده اجرا شود.</p><a className="button button-quiet" href="#home">بازگشت به سایت</a></div></main>;
  }
  if (authState === 'anonymous') {
    return <main className="admin-page" dir="rtl"><header className="admin-public-header"><a className="brand-lockup" href="#home"><span className="brand-symbol"><CrystalMark /></span><span className="brand-name-stack"><strong>پارس</strong><small>پنل مدیریت</small></span></a><a href="#home">بازگشت به سایت</a></header><div className="admin-login-wrap"><LoginForm onLogin={signIn} busy={loginBusy} error={authError} /></div></main>;
  }

  return (
    <main className="admin-page" dir="rtl">
      <header className="admin-topbar">
        <a className="brand-lockup" href="#admin" aria-label="پنل مدیریت پارس"><span className="brand-symbol"><CrystalMark /></span><span className="brand-name-stack"><strong>پارس</strong><small>مدیریت درخواست‌ها</small></span></a>
        <div className="admin-topbar-actions"><span><UserRound size={15} />{username}</span><button type="button" onClick={signOut}><LogOut size={15} />خروج</button><a href="#home">مشاهده‌ی سایت</a></div>
      </header>
      <section className="admin-dashboard site-container">
        <div className="admin-page-intro"><div><span className="eyebrow"><ShieldCheck size={14} /> پنل خصوصی پارس</span><h1>صندوق ورودی</h1><p>درخواست‌ها و پیام‌های ثبت‌شده در پایگاه داده‌ی سامانه</p></div><button className="button button-quiet" type="button" onClick={() => { void loadList(); }} disabled={listBusy}>{listBusy ? <LoaderCircle size={15} className="admin-spinner" /> : <RefreshCw size={15} />}به‌روزرسانی</button></div>
      {dashboardError && <div className="admin-inline-error" role="alert"><AlertCircle size={16} />{dashboardError}</div>}
      {dashboardNotice && <div className="admin-inline-success" role="status"><Check size={16} />{dashboardNotice}</div>}
      <div className="admin-workspace">
        <section className="admin-inbox-panel" aria-label="فهرست پیام‌ها و درخواست‌ها">
          <div className="admin-inbox-tabs" role="tablist" aria-label="نوع پیام">
            <button type="button" role="tab" aria-selected={kind === 'applications'} className={kind === 'applications' ? 'is-active' : ''} onClick={() => selectKind('applications')}><Inbox size={16} />درخواست‌ها</button>
            <button type="button" role="tab" aria-selected={kind === 'contacts'} className={kind === 'contacts' ? 'is-active' : ''} onClick={() => selectKind('contacts')}><MessageSquareText size={16} />پیام‌های تماس</button>
          </div>
          <div className="admin-filters">
            <label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="جست‌وجو در داده‌های ثبت‌شده" /></label>
            <select aria-label="فیلتر وضعیت" value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}><option value="all">همه‌ی وضعیت‌ها</option>{statuses[kind].map((value) => <option key={value} value={value}>{labels[value]}</option>)}</select>
          </div>
          <div className="admin-list-header"><span>{kind === 'applications' ? 'درخواست' : 'پیام'}</span><span>{currentRange}</span></div>
          <div className="admin-submission-list" aria-live="polite">
            {listBusy && items.length === 0 && <div className="admin-list-empty"><LoaderCircle size={20} className="admin-spinner" />در حال دریافت داده‌ها…</div>}
            {!listBusy && listError && <div className="admin-list-empty is-error"><AlertCircle size={19} /><span>{listError}</span><button type="button" onClick={() => { void loadList(); }}>تلاش دوباره</button></div>}
            {!listBusy && !listError && items.length === 0 && <div className="admin-list-empty"><FileText size={23} /><strong>داده‌ای برای نمایش نیست</strong><span>درخواست‌ها یا پیام‌های ثبت‌شده در این فهرست ظاهر می‌شوند.</span></div>}
            {items.map((item) => <button type="button" key={item.id} className={`admin-submission-row ${selectedId === item.id ? 'is-selected' : ''}`} onClick={() => { setSelectedId(item.id); setDashboardError(''); setDashboardNotice(''); }}>
              <span className="admin-row-icon">{kind === 'applications' ? <FileText size={17} /> : <MessageSquareText size={17} />}</span>
              <span className="admin-row-copy"><strong>{item.name || 'بدون نام'}</strong><small>{item.subtitle || item.contact || ''}</small><span>{formatDate(item.created_at)}</span></span>
              <span className="admin-row-state"><StatusPill value={item.status} /><i className={`admin-mail-dot mail-${item.notification_status}`} title={`اعلان ایمیلی: ${labels[item.notification_status] || item.notification_status}`} /></span>
            </button>)}
          </div>
          <footer className="admin-list-footer"><span>{currentRange}</span><div><button type="button" disabled={page <= 0 || listBusy} onClick={() => setPage((current) => Math.max(0, current - 1))}>قبلی</button><button type="button" disabled={page + 1 >= pageCount || listBusy} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>بعدی</button></div></footer>
        </section>
        <section className="admin-detail-panel" aria-label="جزئیات انتخاب‌شده">
          {detailBusy && <div className="admin-detail-empty"><LoaderCircle size={21} className="admin-spinner" />در حال دریافت جزئیات…</div>}
          {!detailBusy && record && <SubmissionDetails kind={kind} record={record} csrfToken={csrfToken} onSaved={(nextRecord) => { setRecord(nextRecord); void loadList(); }} onDeleted={() => { setSelectedId(''); setRecord(null); setDashboardNotice('اطلاعات، فایل و اعلان‌های این مورد حذف شد.'); void loadList(); }} onRetryNotification={retryNotification} />}
          {!detailBusy && !record && <div className="admin-detail-empty"><Inbox size={26} /><strong>یک مورد را برای مشاهده انتخاب کنید</strong><span>فقط داده‌های واقعی ثبت‌شده در پایگاه داده در این پنل نمایش داده می‌شوند.</span></div>}
        </section>
      </div>
      <footer className="admin-dashboard-foot"><span><ShieldCheck size={14} />دسترسی محافظت‌شده با نشست سرور</span><span>باقی‌مانده‌ی داده‌ها از طریق پایگاه داده‌ی پایدار نگه‌داری می‌شود.</span></footer>
      <div className="sr-only" aria-live="polite">{listBusy ? 'در حال به‌روزرسانی فهرست' : ''}</div>
    </section>
    </main>
  );
}
