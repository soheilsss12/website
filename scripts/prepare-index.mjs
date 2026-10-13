import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = path.join(projectRoot, 'src', 'index.template.html');
const template = await readFile(templatePath, 'utf8');
const defaultDescription = 'پارس؛ نگاهی تازه به افق‌های پیش‌رو.';

const pages = [
  { folder: '', title: 'پارس', description: defaultDescription },
  { folder: 'investment', title: 'بخش سرمایه‌گذاری | پارس', description: 'صفحه‌ی مستقل رویکرد، حوزه‌ها و مسیرهای سرمایه‌گذاری.' },
  { folder: 'approach', title: 'رویکرد | بخش سرمایه‌گذاری پارس', description: 'نگاه بخش سرمایه‌گذاری به همراهی با تیم‌ها، از شناخت مسئله تا رشد.' },
  { folder: 'sectors', title: 'حوزه‌ها | بخش سرمایه‌گذاری پارس', description: 'مرور ۱۱ حوزه‌ی سرمایه‌گذاری.' },
  { folder: 'portfolio', title: 'پرتفوی | بخش سرمایه‌گذاری پارس', description: 'پرتفوی بخش سرمایه‌گذاری پارس.' },
  { folder: 'stories', title: 'روایت‌ها | پارس', description: 'روایت‌ها و دیدگاه‌های پارس.' },
  { folder: 'about', title: 'درباره‌ی پارس', description: 'آشنایی با نگاه و ارزش‌های پارس.' },
  { folder: 'contact', title: 'تماس با پارس', description: 'راه ارتباط با پارس.' },
  { folder: 'tools', title: 'ابزارها | بخش سرمایه‌گذاری پارس', description: 'محاسبه‌گرهای مالی و ابزارهای استارتاپی.' },
  { folder: 'apply', title: 'درخواست سرمایه | بخش سرمایه‌گذاری پارس', description: 'فرم مرحله‌ای درخواست سرمایه.' },
  { folder: 'track', title: 'پیگیری درخواست | بخش سرمایه‌گذاری پارس', description: 'پیگیری درخواست سرمایه.' },
  { folder: 'terms', title: 'قوانین و مقررات | پارس', description: 'قوانین و مقررات پارس.' },
  { folder: 'privacy', title: 'حریم خصوصی | پارس', description: 'حریم خصوصی و محرمانگی اطلاعات.' },
  { folder: 'sitemap', title: 'نقشه‌ی سایت | پارس', description: 'فهرست صفحه‌های سایت پارس.' },
  { folder: 'admin', title: 'پنل مدیریت | بخش سرمایه‌گذاری پارس', description: 'پنل مدیریت درخواست‌ها.' },
];

const pageImagePreloads = {
  investment: ['pars-home-hero', '100vw', 1672],
  approach: ['pars-journey-discovery', '(max-width: 760px) 92vw, 48vw'],
  sectors: ['pars-industries-showcase', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
  portfolio: ['pars-portfolio-editorial', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
  stories: ['pars-news-editorial', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
  about: ['pars-about-editorial', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
  contact: ['pars-contact-editorial', '(max-width: 760px) calc(100vw - 40px), 48vw'],
  tools: ['pars-tools-analysis', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
};

function imagePreload([stem, sizes, fullWidth = 1536]) {
  return `    <link rel="preload" href="%BASE_URL%${stem}-1024.webp" imagesrcset="%BASE_URL%${stem}-640.webp 640w, %BASE_URL%${stem}-1024.webp 1024w, %BASE_URL%${stem}.webp ${fullWidth}w" imagesizes="${sizes}" as="image" type="image/webp" fetchpriority="high" />`;
}

function renderPage({ title, description, folder }) {
  const preloads = [
    ...(folder === '' ? [
      '    <link rel="preload" href="%BASE_URL%pars-brand-home-hero-1024.webp" imagesrcset="%BASE_URL%pars-brand-home-hero-640.webp 640w, %BASE_URL%pars-brand-home-hero-1024.webp 1024w, %BASE_URL%pars-brand-home-hero.webp 1672w" imagesizes="100vw" as="image" type="image/webp" fetchpriority="high" />',
    ] : []),
    ...(pageImagePreloads[folder] ? [imagePreload(pageImagePreloads[folder])] : []),
    ...(folder === 'investment' ? ['    <link rel="preload" href="%BASE_URL%pars-mark.svg" as="image" type="image/svg+xml" />'] : []),
  ].join('\n');

  return template
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/\n[ \t]*<\/head>/, preloads ? `\n${preloads}\n  </head>` : '\n  </head>');
}

await Promise.all(pages.map(async (page) => {
  const destination = path.join(projectRoot, page.folder, 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, renderPage(page), 'utf8');
}));

await writeFile(
  path.join(projectRoot, '404.html'),
  renderPage({ folder: '404', title: 'صفحه پیدا نشد | پارس', description: 'صفحه‌ی درخواستی در سایت پارس پیدا نشد.' }),
  'utf8',
);
