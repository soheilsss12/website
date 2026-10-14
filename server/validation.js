export class InputError extends Error {
  constructor(message, code = 'invalid_input', statusCode = 400) {
    super(message);
    this.name = 'InputError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

function stringField(value, label, { required = false, max = 200, multiline = false } = {}) {
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new InputError(`فیلد «${label}» معتبر نیست.`);
  }
  const text = String(value).normalize('NFC').replaceAll('\u0000', '').trim();
  if (required && !text) throw new InputError(`تکمیل فیلد «${label}» لازم است.`);
  if (Array.from(text).length > max) throw new InputError(`فیلد «${label}» طولانی‌تر از حد مجاز است.`);
  if (!multiline && /[\r\n]/.test(text)) throw new InputError(`فیلد «${label}» معتبر نیست.`);
  return text;
}

export function asciiDigits(value) {
  return String(value)
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}

function emailField(value) {
  const email = stringField(value, 'ایمیل', { required: true, max: 254 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new InputError('نشانی ایمیل معتبر نیست.');
  return email;
}

function websiteField(value) {
  const raw = stringField(value, 'وب‌سایت', { max: 300 });
  if (!raw) return '';
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) throw new Error('invalid');
    return url.toString();
  } catch {
    throw new InputError('نشانی وب‌سایت معتبر نیست.');
  }
}

export function validateApplication(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new InputError('داده‌ی فرم معتبر نیست.');
  const fullName = stringField(body.fullName, 'نام و نام خانوادگی', { required: true, max: 120 });
  const role = stringField(body.role, 'سمت در تیم', { required: true, max: 100 });
  const mobile = stringField(body.mobile, 'شماره‌ی موبایل', { required: true, max: 32 });
  const mobileDigits = asciiDigits(mobile).replace(/\D/g, '');
  if (mobileDigits.length < 8 || mobileDigits.length > 18) throw new InputError('شماره‌ی موبایل معتبر نیست.');

  const amountRaw = asciiDigits(stringField(body.amount, 'مبلغ درخواستی', { required: true, max: 32 }))
    .replace(/[٬,\s]/g, '')
    .replace(/٫/g, '.');
  const amount = Number(amountRaw);
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new InputError('مبلغ درخواستی باید یک عدد صحیح و بزرگ‌تر از صفر باشد.');

  const teamSizeRaw = asciiDigits(stringField(body.teamSize, 'تعداد اعضای تیم', { required: true, max: 8 }));
  const teamSize = Number(teamSizeRaw);
  if (!Number.isSafeInteger(teamSize) || teamSize < 1 || teamSize > 10000) throw new InputError('تعداد اعضای تیم معتبر نیست.');
  if (body.agreed !== true) throw new InputError('تأیید شرایط برای ثبت درخواست لازم است.');

  return {
    fullName,
    role,
    mobile,
    email: emailField(body.email),
    city: stringField(body.city, 'شهر محل فعالیت', { required: true, max: 100 }),
    projectName: stringField(body.projectName, 'نام استارتاپ یا محصول', { required: true, max: 160 }),
    website: websiteField(body.website),
    stage: stringField(body.stage, 'مرحله‌ی کسب‌وکار', { required: true, max: 100 }),
    industry: stringField(body.industry, 'حوزه‌ی فعالیت', { required: true, max: 120 }),
    oneLiner: stringField(body.oneLiner, 'معرفی یک‌جمله‌ای', { required: true, max: 500, multiline: true }),
    description: stringField(body.description, 'شرح محصول', { required: true, max: 5000, multiline: true }),
    fundingReason: stringField(body.fundingReason, 'دلیل نیاز به سرمایه', { required: true, max: 3000, multiline: true }),
    amount,
    useOfFunds: stringField(body.useOfFunds, 'برنامه‌ی مصرف سرمایه', { required: true, max: 3000, multiline: true }),
    traction: stringField(body.traction, 'وضعیت فروش یا کاربران', { max: 3000, multiline: true }),
    teamSize,
    previousInvestors: stringField(body.previousInvestors, 'سرمایه‌گذاران قبلی', { max: 1000, multiline: true }),
    links: stringField(body.links, 'لینک‌های مرتبط', { max: 3000, multiline: true }),
  };
}

export function validateContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new InputError('داده‌ی فرم معتبر نیست.');
  const name = stringField(body.name, 'نام', { required: true, max: 120 });
  const contact = stringField(body.contact, 'راه ارتباطی', { required: true, max: 254 });
  if (contact.includes('@')) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)) throw new InputError('نشانی ایمیل یا شماره‌ی تماس معتبر نیست.');
  } else {
    const digits = asciiDigits(contact).replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 18) throw new InputError('نشانی ایمیل یا شماره‌ی تماس معتبر نیست.');
  }
  const topic = stringField(body.topic, 'موضوع', { required: true, max: 80 });
  const allowedTopics = new Set([
    'همکاری',
    'رسانه',
    'پرسش عمومی',
    'پیشنهاد شراکت',
    'شراکت فناوری',
    'انتقال و بومی‌سازی فناوری',
    'توسعه‌ی مشترک',
    'کسب‌وکار مشترک',
    'سرمایه‌گذاری راهبردی',
    'مجوز فناوری',
    'ورود به بازار ایران',
    'توسعه‌ی منطقه‌ای',
  ]);
  if (!allowedTopics.has(topic)) throw new InputError('موضوع پیام معتبر نیست.');
  const message = stringField(body.message, 'پیام', { required: true, max: 5000, multiline: true });
  return { name, contact, topic, message };
}

export function validateStatus(kind, value) {
  const status = stringField(value, 'وضعیت', { required: true, max: 32 });
  const valid = kind === 'applications'
    ? new Set(['new', 'reviewing', 'needs_info', 'accepted', 'declined', 'archived'])
    : new Set(['new', 'in_progress', 'closed', 'archived']);
  if (!valid.has(status)) throw new InputError('وضعیت انتخاب‌شده معتبر نیست.');
  return status;
}
