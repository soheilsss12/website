import assert from 'node:assert/strict';
import test from 'node:test';
import { routeFromLegacyHash, routeFromPath } from './routes.js';

test('page paths resolve to independent routes, including directory index reloads', () => {
  const cases = [
    ['/', 'home'],
    ['index.html', 'home'],
    ['/approach/', 'approach'],
    ['/sectors/', 'industries'],
    ['/sectors/index.html', 'industries'],
    ['/portfolio/', 'portfolio'],
    ['/stories/', 'news'],
    ['/about/', 'about'],
    ['/contact/', 'contact'],
    ['/tools/', 'tools'],
    ['/apply/', 'apply'],
    ['/track/', 'track'],
    ['/terms/', 'terms'],
    ['/privacy/', 'privacy'],
    ['/sitemap/', 'sitemap'],
    ['/admin/', 'admin'],
    ['/404.html', 'not-found'],
    ['/missing-page/', 'not-found'],
  ];

  for (const [path, expected] of cases) {
    assert.equal(routeFromPath(path), expected, path);
  }
});

test('legacy section hashes now resolve to their corresponding standalone pages', () => {
  assert.equal(routeFromLegacyHash('journey'), 'approach');
  assert.equal(routeFromLegacyHash('industries'), 'industries');
  assert.equal(routeFromLegacyHash('map'), 'industries');
  assert.equal(routeFromLegacyHash('partners'), 'about');
  assert.equal(routeFromLegacyHash('campaign'), 'apply');
  assert.equal(routeFromLegacyHash('track'), 'track');
});
