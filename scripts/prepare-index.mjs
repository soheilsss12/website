import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = path.join(projectRoot, 'src', 'index.template.html');
const template = await readFile(templatePath, 'utf8');
const defaultDescription = 'پارس؛ سرمایه‌گذاری خطرپذیر در کنار تیم‌های نوآور، از ایده تا رشد کسب‌وکار.';

const pages = [
  { folder: '', title: 'پارس | سرمایه‌گذاری خطرپذیر', description: defaultDescription },
  { folder: 'approach', title: 'رویکرد سرمایه‌گذاری | پارس', description: 'نگاه پارس به همراهی با تیم‌ها، از شناخت مسئله تا آمادگی برای رشد.' },
  { folder: 'sectors', title: 'حوزه‌های سرمایه‌گذاری | پارس', description: 'مرور ۱۱ حوزه‌ی تأییدشده‌ی سرمایه‌گذاری پارس.' },
  { folder: 'portfolio', title: 'پرتفوی | پارس', description: 'اطلاعات پرتفوی پارس پس از تأیید و اعلام رسمی منتشر می‌شود.' },
  { folder: 'stories', title: 'خبرها و دیدگاه‌ها | پارس', description: 'خبرها و دیدگاه‌های پارس؛ محتوا پس از تأیید رسمی منتشر می‌شود.' },
  { folder: 'about', title: 'درباره‌ی پارس', description: 'آشنایی با پارس، ارزش‌ها و اطلاعات رسمی تیم.' },
  { folder: 'contact', title: 'تماس با پارس', description: 'راه‌های ارتباط و فرم تماس پارس.' },
  { folder: 'tools', title: 'ابزارهای استارتاپی | پارس', description: 'ابزارهای مالی و مدیریتی برای تصمیم‌های استارتاپی.' },
  { folder: 'apply', title: 'درخواست سرمایه | پارس', description: 'فرم مرحله‌ای درخواست سرمایه پارس.' },
  { folder: 'track', title: 'پیگیری درخواست | پارس', description: 'پیگیری درخواست سرمایه در سامانه‌ی پارس.' },
  { folder: 'terms', title: 'قوانین و مقررات | پارس', description: 'قوانین و مقررات رسمی پارس.' },
  { folder: 'privacy', title: 'حریم خصوصی | پارس', description: 'حریم خصوصی و محرمانگی اطلاعات در پارس.' },
  { folder: 'sitemap', title: 'نقشه‌ی سایت | پارس', description: 'فهرست صفحه‌های مستقل سایت پارس.' },
  { folder: 'admin', title: 'پنل مدیریت | پارس', description: 'پنل خصوصی مدیریت درخواست‌های پارس.' },
];

const pageImagePreloads = {
  approach: ['pars-journey-discovery', '(max-width: 760px) 92vw, 48vw'],
  sectors: ['pars-industries-showcase', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
  portfolio: ['pars-portfolio-editorial', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
  stories: ['pars-news-editorial', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
  about: ['pars-about-editorial', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
  contact: ['pars-contact-editorial', '(max-width: 760px) calc(100vw - 40px), 48vw'],
  tools: ['pars-tools-analysis', '(max-width: 760px) calc(100vw - 40px), (max-width: 1320px) calc(100vw - 96px), 1320px'],
};

function imagePreload([stem, sizes]) {
  return `    <link rel="preload" href="%BASE_URL%${stem}-1024.webp" imagesrcset="%BASE_URL%${stem}-640.webp 640w, %BASE_URL%${stem}-1024.webp 1024w, %BASE_URL%${stem}.webp 1536w" imagesizes="${sizes}" as="image" type="image/webp" fetchpriority="high" />`;
}

function renderPage({ title, description, folder }) {
  const preloads = [
    ...(folder === '' ? [
      '    <link rel="preload" href="%BASE_URL%pars-home-hero-1024.webp" imagesrcset="%BASE_URL%pars-home-hero-640.webp 640w, %BASE_URL%pars-home-hero-1024.webp 1024w, %BASE_URL%pars-home-hero.webp 1672w" imagesizes="100vw" as="image" type="image/webp" fetchpriority="high" />',
      '    <link rel="preload" href="%BASE_URL%pars-mark.svg" as="image" type="image/svg+xml" />',
    ] : []),
    ...(pageImagePreloads[folder] ? [imagePreload(pageImagePreloads[folder])] : []),
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
