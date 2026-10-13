const requiredFieldsByStep = [
  ['fullName', 'role', 'mobile', 'email', 'city'],
  ['projectName', 'stage', 'industry', 'oneLiner', 'description'],
  ['fundingReason', 'amount', 'useOfFunds', 'teamSize'],
  ['agreed'],
];

function asciiDigits(value) {
  return String(value)
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}

function validMobile(value) {
  const digits = asciiDigits(value).replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 18;
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
}

function validWebsite(value) {
  const raw = String(value).trim();
  if (!raw) return true;
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.');
  } catch {
    return false;
  }
}

function validPositiveInteger(value, { maximum = Number.MAX_SAFE_INTEGER } = {}) {
  const normalized = asciiDigits(value)
    .replace(/[٬,\s]/g, '')
    .replace(/٫/g, '.');
  const number = Number(normalized);
  return Number.isSafeInteger(number) && number > 0 && number <= maximum;
}

export function validateApplicationStep(form, step) {
  const errors = {};
  const requiredFields = requiredFieldsByStep[step] || [];

  for (const field of requiredFields) {
    if (field === 'agreed') {
      if (!form.agreed) errors.agreed = 'برای ادامه، تأیید قوانین و حریم خصوصی لازم است.';
    } else if (!String(form[field] ?? '').trim()) {
      errors[field] = 'تکمیل این مورد لازم است.';
    }
  }

  if (step === 0) {
    if (form.mobile && !validMobile(form.mobile)) errors.mobile = 'شماره‌ی موبایل معتبر نیست.';
    if (form.email && !validEmail(form.email)) errors.email = 'نشانی ایمیل معتبر نیست.';
  }

  if (step === 1 && !validWebsite(form.website)) {
    errors.website = 'نشانی وب‌سایت را به شکل معتبر وارد کنید.';
  }

  if (step === 2) {
    if (form.amount && !validPositiveInteger(form.amount)) {
      errors.amount = 'مبلغ را به‌صورت عدد صحیح و بزرگ‌تر از صفر وارد کنید.';
    }
    if (form.teamSize && !validPositiveInteger(form.teamSize, { maximum: 10000 })) {
      errors.teamSize = 'تعداد اعضا باید عددی بین ۱ تا ۱۰٬۰۰۰ باشد.';
    }
  }

  return errors;
}
