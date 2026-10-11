const configuredBase = String(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

function isGitHubPagesWithoutApi() {
  return !configuredBase
    && typeof window !== 'undefined'
    && window.location.hostname.toLowerCase().endsWith('.github.io');
}

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'request_failed', payload = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

export function apiUrl(path) {
  if (isGitHubPagesWithoutApi()) {
    throw new ApiError('بک‌اند به این نسخه از سایت متصل نشده است؛ اطلاعات شما ارسال نشده است.', {
      code: 'backend_not_configured',
    });
  }
  return `${configuredBase}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const url = apiUrl(path);
  const headers = new Headers(options.headers || {});
  const bodyIsFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body !== undefined && options.body !== null && !bodyIsFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new ApiError('اتصال به سامانه برقرار نشد؛ اطلاعات شما ارسال نشده است.', { code: 'network_error' });
  }

  const contentType = response.headers.get('content-type') || '';
  let payload = null;
  if (contentType.includes('application/json')) {
    try { payload = await response.json(); } catch { payload = null; }
  }

  if (!response.ok) {
    const message = payload?.error || (response.status >= 500
      ? 'سامانه در حال حاضر پاسخ‌گو نیست؛ اطلاعات شما ثبت نشده است.'
      : 'درخواست انجام نشد. اطلاعات شما ثبت نشده است.');
    throw new ApiError(message, { status: response.status, code: payload?.code, payload });
  }

  if (!contentType.includes('application/json')) {
    throw new ApiError('پاسخ سامانه معتبر نیست؛ اطلاعات شما ثبت‌شده تلقی نمی‌شود.', {
      status: response.status,
      code: 'invalid_response',
    });
  }
  return { response, data: payload };
}
