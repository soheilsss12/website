# راهنمای انتشار کامل فرانت‌اند و بک‌اند

## فرق دو روش انتشار

- **GitHub Pages:** فقط فایل‌های ایستای سایت را منتشر می‌کند. Node.js، API، SQLite، ورود مدیر و ذخیره‌ی فرم روی Pages اجرا نمی‌شوند.
- **انتشار کامل این مخزن:** با Docker Compose، برنامه‌ی Node هم‌زمان سایت و `/api` را روی یک مبدأ اجرا می‌کند؛ Caddy جلوی آن HTTPS خودکار می‌دهد و پایگاه داده و فایل‌های خصوصی را در volume پایدار نگه می‌دارد.

اگر فقط آدرس `*.github.io` را دارید و سرور یا میزبانی Node/Docker ندارید، انتشار کامل ممکن نیست. برای راهنمای حاضر به یک سرور/VPS با Docker نیاز است؛ دامنه‌ی عمومی باید به آن سرور اشاره کند. این روش جایگزین میزبانی کامل Pages برای همان دامنه است، نه افزودن API به خود Pages.

## نیازمندی‌های سرور

- Linux با Docker Engine و افزونه‌ی Docker Compose v2.
- یک دامنه یا زیردامنه که رکورد DNS آن به IP سرور اشاره کند.
- دسترسی ورودی TCP به پورت‌های ۸۰ و ۴۴۳؛ Caddy از آن‌ها برای گرفتن و تمدید گواهی HTTPS استفاده می‌کند.
- حداقل یک نمونه‌ی برنامه. فایل SQLite برای چند replica یا چند writer روی دیسک مشترک طراحی نشده است.

## نصب و راه‌اندازی

فرمان‌ها را روی همان سروری اجرا کنید که دامنه به آن اشاره می‌کند:

```bash
git clone --single-branch --branch arena/4d1d0891-website https://github.com/soheilsss12/website.git
cd website
cp deploy/production.env.example .env.production
```

فایل `.env.production` را روی سرور ویرایش کنید و مقادیر واقعی خودتان را وارد کنید:

- `PUBLIC_DOMAIN`: دامنه/زیردامنه‌ی واقعی که DNS آن به همین سرور اشاره می‌کند.
- `ADMIN_USERNAME`: نام دلخواه مدیر با ۳ تا ۶۴ نویسه؛ فقط حروف و ارقام انگلیسی و `.`, `_`, `@`, `-` پذیرفته می‌شوند.
- `ADMIN_PASSWORD`: یک رمز تصادفی منحصربه‌فرد با ۱۶ تا ۲۵۶ نویسه.
- `ADMIN_SESSION_TTL_HOURS`: مدت نشست، بین ۱ تا ۱۶۸ ساعت؛ مقدار پیشنهادی template برابر ۱۲ است.
- `ADMIN_NOTIFICATION_EMAIL`, `EMAIL_FROM`, `RESEND_API_KEY`: برای ایمیل هر سه را با تنظیمات واقعی پر کنید؛ اگر ایمیل نمی‌خواهید، هر سه را خالی بگذارید.

برای ساخت یک گذرواژه‌ی تصادفی ۶۴ رقمی hexadecimal روی سرور می‌توانید از این فرمان استفاده کنید و خروجی‌اش را مستقیماً فقط در فایل `.env.production` قرار دهید:

```bash
openssl rand -hex 32
```

نام کاربری باید بین ۳ تا ۶۴ نویسه و گذرواژه بین ۱۶ تا ۲۵۶ نویسه باشد. هیچ نام کاربری، گذرواژه یا حساب آزمایشی پیش‌فرضی وجود ندارد. فایل `.env.production` از Git و build کانتینر خارج است؛ آن را در مخزن یا پیام عمومی قرار ندهید.

وقتی DNS آماده شد و پورت‌ها باز هستند، اجرا کنید:

```bash
docker compose --env-file .env.production config
docker compose --env-file .env.production up --build -d
docker compose --env-file .env.production ps
```

`config` قبل از اجرا متغیرهای الزامی را بررسی می‌کند. Dockerfile در مرحله‌ی build، تست‌های سرور و build سایت را اجرا می‌کند؛ اگر هرکدام شکست بخورد، image جدید ساخته نمی‌شود. Caddy پس از سالم‌شدن API، سایت را پشت HTTPS در دامنه‌ی `PUBLIC_DOMAIN` منتشر می‌کند.

## اگر میزبان خودش HTTPS و reverse proxy دارد

می‌توانید به‌جای Compose+Caddy، خود `Dockerfile` را روی یک میزبان Docker اجرا کنید که دامنه و HTTPS را مدیریت می‌کند. متغیرهای زیر را در بخش امن environment آن میزبان تنظیم کنید: `NODE_ENV=production`, `HOST=0.0.0.0`, `PORT` مطابق پورت داخلی میزبان, `DATA_DIR` برابر مسیر مطلق دیسک پایدار، `PUBLIC_ORIGIN` برابر origin دقیق HTTPS مثل `https://site.example`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` و `TRUST_PROXY=true`. سه متغیر ایمیل یا هر سه خالی باشند یا هر سه مقدار واقعی داشته باشند. حجم پایدار را دقیقاً روی `DATA_DIR` mount کنید، فقط یک replica اجرا کنید و مطمئن شوید proxy هدرهای `X-Forwarded-Proto` و `X-Forwarded-For` را تنظیم می‌کند. بدون دیسک پایدار، اطلاعات پس از restart ممکن است از بین بروند.

## استقرار روی Plesk با Git و Passenger

برای این نسخه روی Plesk، `Application Root` و `Document Root` می‌توانند هر دو روی `/httpdocs` بمانند. فایل `app.js` عمداً CommonJS است تا Passenger بتواند آن را با `require()` اجرا کند؛ ماژول‌های بک‌اند زیر `server/` همچنان ESM هستند. بنابراین در صفحه‌ی Node.js، **Application Startup File باید `app.js` بماند** و نیازی به تغییر آن به `_passenger.cjs` نیست.

گردش‌کار GitHub Actions سایت را می‌سازد و در هر انتشار `tmp/restart.txt` را به‌روزرسانی می‌کند. اگر webhook موجود Plesk به همین شاخه و مسیر استقرار وصل باشد، Passenger پس از دریافت commit برنامه را خودکار restart می‌کند. هیچ فایل secret در مخزن قرار ندهید. در متغیرهای محیطی production در Plesk، `ADMIN_USERNAME` و `ADMIN_PASSWORD` باید مقدار واقعی داشته باشند؛ برنامه‌ی `app.js` پیش‌فرض‌های `DATA_DIR` و `PUBLIC_ORIGIN` را برای دامنه‌ی پارس تنظیم می‌کند. سه متغیر ایمیل یا همگی خالی باشند یا هر سه با مقدار واقعی تنظیم شوند.

## بررسی بعد از انتشار

```bash
curl -fsS https://دامنه-واقعی-شما/api/health
```

باید پاسخ JSON با `"ok":true` و `"storage":"sqlite"` بگیرید. سپس صفحه‌ی اصلی را باز کنید و برای پنل به نشانی `https://دامنه-واقعی-شما/#admin` بروید. با همان نام کاربری و گذرواژه‌ای که در فایل محیطی گذاشتید وارد شوید.

برای مشاهده‌ی گزارش اجرا:

```bash
docker compose --env-file .env.production logs --tail=100 app caddy
```

اگر `/api/health` پاسخ نمی‌دهد، اول وضعیت کانتینرها، لاگ‌ها، DNS و دسترسی ورودی پورت‌های ۸۰ و ۴۴۳ را بررسی کنید. تا وقتی health check سالم نیست، سایت را آماده‌ی دریافت فرم واقعی فرض نکنید.

## پایگاه داده، فایل‌ها و ایمیل

- SQLite و PDFهای خصوصی هر دو در volume پایدار `pars_data` زیر `/data` ذخیره می‌شوند؛ بازسازی کانتینر داده‌ها را حذف نمی‌کند.
- از volume به‌صورت منظم و خارج از همان سرور نسخه‌ی پشتیبان بگیرید و بازیابی آن را آزمایش کنید. **`docker compose down --volumes` یا حذف volumeها را اجرا نکنید**؛ با حذف `pars_data` فرم‌ها و پیوست‌ها پاک می‌شوند.
- اگر سه مقدار `ADMIN_NOTIFICATION_EMAIL`، `EMAIL_FROM` و `RESEND_API_KEY` تنظیم نشده باشند، فرم پس از ذخیره‌ی موفق در پایگاه داده در پنل دیده می‌شود اما ایمیل ارسال نمی‌شود. برای ایمیل، صندوق مقصد و فرستنده‌ی واقعی و تأییدشده در Resend لازم است؛ مقادیر ناقص باعث می‌شوند سرویس هنگام شروع خطا بدهد، نه اینکه وضعیت ارسال را مبهم گزارش کند.
- نبود ایمیل مانع ورود مدیر یا ذخیره‌ی فرم نمی‌شود؛ وضعیت اعلان در پنل «پیکربندی‌نشده» خواهد بود. پاسخ موفق فرم تنها بعد از ثبت واقعی در پایگاه داده داده می‌شود.

## انتشار نسخه‌ی بعدی

روی سرور:

```bash
git pull --ff-only origin arena/4d1d0891-website
docker compose --env-file .env.production up --build -d
```

داده‌ها در volume باقی می‌مانند. `.env.production` را حفظ کنید. قبل از به‌روزرسانی‌های مهم، backup بگیرید.

## اگر دامنه روی GitHub Pages بماند

گردش‌کار فعلی GitHub Pages همچنان نسخه‌ی فرانت‌اند ایستا را منتشر می‌کند. این به‌تنهایی API را روشن نمی‌کند. راه‌اندازی Docker بالا یک سایت کامل روی دامنه‌ای است که DNS آن را به VPS برده‌اید؛ **نمی‌توان** همین API را داخل `https://soheilsss12.github.io/website/` اجرا کرد. اتصال Pages به API روی origin جدا، نیازمند دامنه و CORS/cookie جداگانه است و برای ورود مدیر، میزبانی هم‌مبدأِ این راهنما مطمئن‌تر است.

## تنظیمات و کدهای دیپلوی

- `Dockerfile` — تست، build و image تولیدی Node.
- `compose.yaml` — برنامه، health check، volumeهای پایدار و TLS proxy.
- `Caddyfile` — reverse proxy سایت و API.
- `deploy/production.env.example` — فهرست متغیرها؛ فقط placeholder خالی، بدون secret واقعی.
- `server/config.js` — fail-fast برای تنظیمات ضروری محیط production.
