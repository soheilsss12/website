import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const isGitHubActionsBuild = process.env.GITHUB_ACTIONS === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const siteBase = isGitHubActionsBuild && repositoryName ? `/${repositoryName}/` : '/';
const htmlPages = [
  'index.html',
  'investment/index.html',
  'approach/index.html',
  'sectors/index.html',
  'portfolio/index.html',
  'stories/index.html',
  'about/index.html',
  'contact/index.html',
  'tools/index.html',
  'apply/index.html',
  'track/index.html',
  'terms/index.html',
  'privacy/index.html',
  'sitemap/index.html',
  'admin/index.html',
  '404.html',
];

export default defineConfig({
  base: siteBase,
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: Object.fromEntries(
        htmlPages.map((page) => [page.replaceAll('/', '_').replaceAll('.html', ''), path.resolve(projectRoot, page)]),
      ),
      output: {
        codeSplitting: {
          groups: [{ name: 'three', test: /node_modules[\\/]three[\\/]/ }],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: false,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
