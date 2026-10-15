import assert from 'node:assert/strict';
import test from 'node:test';
import { validateApplicationStep } from './applicationValidation.js';

const emptyForm = {
  fullName: '', role: '', mobile: '', email: '', city: '',
  projectName: '', website: '', stage: '', industry: '', oneLiner: '', description: '',
  fundingReason: '', amount: '', useOfFunds: '', traction: '', teamSize: '', previousInvestors: '',
  deckName: '', links: '', agreed: false,
};

test('application wizard identifies the required fields for the active step', () => {
  assert.deepEqual(Object.keys(validateApplicationStep(emptyForm, 0)).sort(), ['city', 'email', 'fullName', 'mobile', 'role']);
  assert.deepEqual(Object.keys(validateApplicationStep(emptyForm, 1)).sort(), ['description', 'industry', 'oneLiner', 'projectName', 'stage']);
  assert.deepEqual(Object.keys(validateApplicationStep(emptyForm, 2)).sort(), ['amount', 'fundingReason', 'teamSize', 'useOfFunds']);
  assert.deepEqual(Object.keys(validateApplicationStep(emptyForm, 3)), ['agreed']);
});

test('valid contact details and Persian mobile digits pass the first step', () => {
  const form = { ...emptyForm, fullName: 'آرمان', role: 'هم‌بنیان‌گذار', mobile: '۰۹۱۲۱۲۳۴۵۶۷', email: 'arman@example.com', city: 'تهران' };
  assert.deepEqual(validateApplicationStep(form, 0), {});
});

test('malformed email and mobile values get specific field errors', () => {
  const form = { ...emptyForm, fullName: 'آرمان', role: 'مدیر', mobile: '۱۲۳', email: 'not-an-email', city: 'تهران' };
  const errors = validateApplicationStep(form, 0);
  assert.equal(errors.mobile, 'شماره‌ی موبایل معتبر نیست.');
  assert.equal(errors.email, 'نشانی ایمیل معتبر نیست.');
});

test('optional websites may be omitted but malformed links are rejected', () => {
  assert.deepEqual(validateApplicationStep({ ...emptyForm, website: '' }, 1), {
    projectName: 'تکمیل این مورد لازم است.',
    stage: 'تکمیل این مورد لازم است.',
    industry: 'تکمیل این مورد لازم است.',
    oneLiner: 'تکمیل این مورد لازم است.',
    description: 'تکمیل این مورد لازم است.',
  });
  assert.equal(validateApplicationStep({ ...emptyForm, website: 'not a url' }, 1).website, 'نشانی وب‌سایت را به شکل معتبر وارد کنید.');
});

test('localized numerals are accepted while zero, fractions, and oversized teams are rejected', () => {
  const validFunding = { ...emptyForm, fundingReason: 'گام بعدی', amount: '۱۲٬۵۰۰٬۰۰۰', useOfFunds: 'توسعه محصول', teamSize: '۵' };
  assert.deepEqual(validateApplicationStep(validFunding, 2), {});

  const invalidFunding = { ...validFunding, amount: '۰', teamSize: '۱۰۰۰۱' };
  const errors = validateApplicationStep(invalidFunding, 2);
  assert.match(errors.amount, /عدد صحیح/);
  assert.match(errors.teamSize, /۱ تا ۱۰٬۰۰۰/);
});

test('the final wizard step requires an explicit consent', () => {
  assert.equal(validateApplicationStep({ ...emptyForm, agreed: false }, 3).agreed, 'برای ادامه، تأیید قوانین و حریم خصوصی لازم است.');
  assert.deepEqual(validateApplicationStep({ ...emptyForm, agreed: true }, 3), {});
});
