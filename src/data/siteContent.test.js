import assert from 'node:assert/strict';
import test from 'node:test';
import {
  commercializationStages,
  ecosystemEnablers,
  industries,
  navItems,
  nationalPrograms,
  platformBrands,
  technologyLayers,
  technologyProducts,
} from './siteContent.js';

test('the current investment taxonomy has the 11 user-approved focus areas in order', () => {
  assert.deepEqual(industries.map(({ title }) => title), [
    'آموزش',
    'انرژی',
    'خدمات مالی',
    'مسکن',
    'سلامت',
    'صنعت و معدن',
    'خدمات اجتماعی',
    'کشاورزی',
    'طراحی صنعتی',
    'لجستیک',
    'محتوا و رسانه',
  ]);
  assert.equal(industries.find(({ id }) => id === 'social-services').description, 'پلتفرم‌های هوشمند برای خدمات رفاهی، حمایتی و عمومی');
});

test('the public national-program section contains the six requested items and scales', () => {
  assert.equal(nationalPrograms.length, 6);
  assert.equal(nationalPrograms[3].scale, '۲ میلیون+ دانش‌آموز');
  assert.equal(nationalPrograms[5].scale, '۳۰٬۰۰۰ رأس دام');
  assert.doesNotMatch(nationalPrograms[3].description, /پروفایل|نمایه/);
});

test('the site uses one shared primary navigation across all main routes', () => {
  assert.deepEqual(navItems.map(({ route }) => route), [
    'investment',
    'approach',
    'portfolio',
    'news',
    'about',
    'contact',
  ]);
  assert.equal(new Set(navItems.map(({ route }) => route)).size, navItems.length);
});

test('site content keeps the architecture and portfolio counts accurate', () => {
  assert.equal(technologyLayers.length, 5);
  assert.equal(ecosystemEnablers.length, 5);
  assert.equal(commercializationStages.length, 6);
  assert.equal(technologyProducts.length, 35);
  assert.equal(platformBrands.length, 20);
  assert.equal(new Set(technologyProducts).size, technologyProducts.length);
  assert.equal(new Set(platformBrands).size, platformBrands.length);
});
