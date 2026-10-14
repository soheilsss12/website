import assert from 'node:assert/strict';
import test from 'node:test';
import {
  commercializationStages,
  ecosystemEnablers,
  industries,
  navItems,
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
});

test('the site uses one shared primary navigation across all main routes', () => {
  assert.deepEqual(navItems.map(({ route }) => route), [
    'investment',
    'approach',
    'industries',
    'portfolio',
    'news',
    'about',
    'contact',
  ]);
  assert.equal(new Set(navItems.map(({ route }) => route)).size, navItems.length);
});

test('the profile content keeps its reported architecture and portfolio list sizes', () => {
  assert.equal(technologyLayers.length, 5);
  assert.equal(ecosystemEnablers.length, 5);
  assert.equal(commercializationStages.length, 6);
  assert.equal(technologyProducts.length, 35);
  assert.equal(platformBrands.length, 20);
  assert.equal(new Set(technologyProducts).size, technologyProducts.length);
  assert.equal(new Set(platformBrands).size, platformBrands.length);
});
