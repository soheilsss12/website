import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const footerSource = readFileSync(new URL('./SiteSections.jsx', import.meta.url), 'utf8');

test('the footer omits the sitemap link and discontinued status promotion', () => {
  assert.doesNotMatch(footerSource, /pageHref\('sitemap'\)/);
  assert.doesNotMatch(footerSource, /className="footer-status"/);
  assert.doesNotMatch(footerSource, /فناوری و سرمایه‌گذاری، در یک مسیر/);
  assert.doesNotMatch(footerSource, /زیرساخت، حوزه‌ها و ساخت کسب‌وکار/);
});
