import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = path.join(projectRoot, 'src', 'index.template.html');
const template = await readFile(templatePath, 'utf8');
const defaultDescription = 'پارس، گروه فناوری و نوآوری ایرانی؛ پیونددهنده‌ی زیرساخت، داده، هوش مصنوعی، سرمایه‌گذاری فناوری و ساخت کسب‌وکار.';

const pages = [
  { folder: '', title: 'پارس | فناوری، سرمایه‌گذاری و ساخت کسب‌وکار', description: defaultDescription },
  { folder: 'investment', title: 'سرمایه‌گذاری فناوری | پارس', description: 'مدل سرمایه‌گذاری فناوری و مسیرهای تبدیل پژوهش و فناوری به محصول، پلتفرم و کسب‌وکار در پارس.' },
  { folder: 'approach', title: 'مدل فناوری و تجاری‌سازی | پارس', description: 'از پژوهش و فناوری تا محصول، بازار و ساخت کسب‌وکار؛ مسیر همراهی پارس را ببینید.' },
  { folder: 'portfolio', title: 'پرتفوی فناوری | پارس', description: 'آشنایی با محصولات، راهکارها و پلتفرم‌های فناوری پارس.' },
  { folder: 'stories', title: 'تجربه‌های سازمانی | پارس', description: 'حوزه‌های تجربه‌ی سازمانی پارس در بانکداری، بیمه، فناوری و بخش عمومی.' },
  { folder: 'about', title: 'درباره‌ی پارس', description: 'پارس در چهار نقش فناوری، تحول سازمانی، سرمایه‌گذاری فناوری و ساخت کسب‌وکار فعالیت می‌کند.' },
  { folder: 'contact', title: 'تماس و همکاری با پارس', description: 'مدل‌های مشارکت راهبردی و راه ارتباط با گروه فناوری و سرمایه‌گذاری پارس.' },
  { folder: 'tools', title: 'ابزارهای مالی و استارتاپی | پارس', description: 'ابزارهای برآورد مالی برای بنیان‌گذاران؛ محاسبه‌ها در مرورگر انجام می‌شوند و توصیه‌ی سرمایه‌گذاری نیستند.' },
  { folder: 'apply', title: 'درخواست سرمایه | پارس', description: 'فرم چهارمرحله‌ای معرفی تیم، محصول و نیاز سرمایه به پارس.' },
  { folder: 'track', title: 'پیگیری درخواست | پارس', description: 'پیگیری وضعیت درخواست ثبت‌شده در سامانه‌ی پارس.' },
  { folder: 'terms', title: 'قوانین و مقررات | پارس', description: 'قوانین و مقررات سایت پارس؛ متن نهایی هنوز منتشر نشده است.' },
  { folder: 'privacy', title: 'حریم خصوصی | پارس', description: 'اطلاعات درباره‌ی حریم خصوصی و محرمانگی داده‌ها در سایت پارس.' },
  { folder: 'admin', title: 'پنل مدیریت | پارس', description: 'پنل مدیریت درخواست‌ها و پیام‌های ثبت‌شده در سامانه‌ی پارس.' },
];

const pageImagePreloads = {
  investment: ['pars-home-hero', '100vw', 1672],
  approach: ['pars-journey-discovery', '(max-width: 760px) 92vw, 48vw'],
  portfolio: ['pars-portfolio-cinematic', '100vw'],
  stories: ['pars-news-editorial', '100vw'],
  about: ['pars-about-editorial', '100vw'],
  contact: ['pars-contact-editorial', '100vw'],
  tools: ['pars-tools-analysis', '100vw'],
};

function imagePreload([stem, sizes, fullWidth = 1536]) {
  return `    <link rel="preload" href="%BASE_URL%${stem}-1024.webp" imagesrcset="%BASE_URL%${stem}-640.webp 640w, %BASE_URL%${stem}-1024.webp 1024w, %BASE_URL%${stem}.webp ${fullWidth}w" imagesizes="${sizes}" as="image" type="image/webp" fetchpriority="high" />`;
}

function renderPage({ title, description, folder }) {
  const preloads = [
    ...(folder === '' ? [
      '    <link rel="preload" href="%BASE_URL%pars-home-hero-1024.webp" imagesrcset="%BASE_URL%pars-home-hero-640.webp 640w, %BASE_URL%pars-home-hero-1024.webp 1024w, %BASE_URL%pars-home-hero.webp 1672w" imagesizes="100vw" as="image" type="image/webp" fetchpriority="high" />',
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
  renderPage({ folder: '404', title: 'صفحه پیدا نشد | پارس', description: 'این صفحه در سایت پارس پیدا نشد.' }),
  'utf8',
);
