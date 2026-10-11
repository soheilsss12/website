import {
  Activity,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  Cloud,
  GraduationCap,
  HeartPulse,
  Leaf,
  Network,
  Rocket,
  ShieldCheck,
  Truck,
  UsersRound,
  WalletCards,
  Zap,
} from 'lucide-react';

export const navItems = [
  { label: 'رویکرد ما', href: '#approach' },
  { label: 'پرتفوی', href: '#portfolio' },
  { label: 'ابزارها', href: '#tools' },
  { label: 'مرکز دانش', href: '#knowledge' },
  { label: 'درباره‌ی پارس', href: '#about' },
];

export const industries = [
  { number: '۰۱', title: 'هوش مصنوعی و داده', english: 'AI & Data', icon: BrainCircuit, tone: 'mint', description: 'محصول‌ها و زیرساخت‌های مبتنی بر هوش مصنوعی و داده' },
  { number: '۰۲', title: 'سلامت دیجیتال', english: 'HealthTech', icon: HeartPulse, tone: 'rose', description: 'فناوری برای دسترسی آسان‌تر و خدمات سلامتِ باکیفیت‌تر' },
  { number: '۰۳', title: 'فناوری مالی', english: 'FinTech', icon: WalletCards, tone: 'violet', description: 'خدمات مالی ساده‌تر، فراگیرتر و شفاف‌تر' },
  { number: '۰۴', title: 'نرم‌افزار و SaaS', english: 'Software', icon: Cloud, tone: 'blue', description: 'نرم‌افزارهای مقیاس‌پذیر برای کسب‌وکارها و کاربران' },
  { number: '۰۵', title: 'آموزش و مهارت', english: 'EdTech', icon: GraduationCap, tone: 'amber', description: 'یادگیری مستمر و مهارت‌آموزی در دسترس همه' },
  { number: '۰۶', title: 'کشاورزی و غذا', english: 'Agri & Food', icon: Leaf, tone: 'green', description: 'فناوری برای زنجیره‌ی غذایی پایدارتر' },
  { number: '۰۷', title: 'انرژی و اقلیم', english: 'ClimateTech', icon: Zap, tone: 'lime', description: 'بهینه‌سازی مصرف انرژی و راهکارهای زیست‌محیطی' },
  { number: '۰۸', title: 'صنعت و لجستیک', english: 'Industry', icon: Truck, tone: 'copper', description: 'تولید هوشمند، زیرساخت و حمل‌ونقل کارآمد' },
];

export const valuePillars = [
  { number: '۰۱', title: 'دسترسی به بازار', icon: ChartNoAxesCombined, description: 'مسیر رسیدن به مشتری و شریک تجاری را کوتاه می‌کنیم' },
  { number: '۰۲', title: 'شبکه‌ی حرفه‌ای', icon: Network, description: 'ارتباط با افرادی که گام بعدی را ممکن می‌کنند' },
  { number: '۰۳', title: 'مشتری و پایلوت', icon: Building2, description: 'کمک به یافتن اولین مشتریان و اجرای پایلوت' },
  { number: '۰۴', title: 'منتورینگ', icon: UsersRound, description: 'گفت‌وگوی صریح با افراد باتجربه در تصمیم‌های دشوار' },
  { number: '۰۵', title: 'پشتیبانی اجرایی', icon: Cloud, description: 'ابزار، تخصص و ظرفیت اجرایی متناسب با نیاز تیم' },
  { number: '۰۶', title: 'راهبرد ورود به بازار', icon: Rocket, description: 'از جایگاه‌یابی و قیمت‌گذاری تا برنامه‌ی اجرا' },
  { number: '۰۷', title: 'آمادگی برای دور بعدی', icon: Activity, description: 'تدوین روایت، داده و ساختار لازم برای جذب سرمایه‌ی بعدی' },
  { number: '۰۸', title: 'اعتبار', icon: ShieldCheck, description: 'حضور یک سرمایه‌گذار معتبر در کنار شما، گفت‌وگو با مشتریان و سرمایه‌گذاران بعدی را آسان‌تر می‌کند' },
];

export const processSteps = [
  { number: '۰۱', title: 'ثبت درخواست', description: 'معرفی مسئله، تیم و مسیری که در پیش دارید' },
  { number: '۰۲', title: 'بررسی اولیه', description: 'سنجش تناسب طرح با حوزه‌ها و شرایط دوره' },
  { number: '۰۳', title: 'جلسه‌ی تخصصی', description: 'گفت‌وگوی دوطرفه درباره‌ی بازار، محصول و اولویت‌های تیم' },
  { number: '۰۴', title: 'ارزیابی نهایی', description: 'بررسی داده‌ها، ریسک‌ها و شرایط همکاری' },
  { number: '۰۵', title: 'توافق و آغاز همکاری', description: 'امضای توافق‌نامه، سرمایه‌گذاری و شروع کار مشترک' },
];

export const stageOptions = ['ایده', 'نمونه‌ی اولیه (MVP)', 'درآمدزا', 'رشد'];

export const articles = [
  {
    id: 'a1', category: 'جذب سرمایه', readTime: '۷ دقیقه مطالعه', title: 'پیش از جذب سرمایه، چه چیزهایی باید روشن باشد؟',
    excerpt: 'از مسئله و بازار تا ساختار تیم؛ چک‌لیستی برای گفت‌وگویی دقیق‌تر با سرمایه‌گذار',
    body: 'جذب سرمایه مقصد نیست؛ ابزاری برای رسیدن به گام بعدی است. پیش از مذاکره، مسئله‌ای را که حل می‌کنید در یک جمله توضیح دهید، اندازه‌ی بازار را با فرض‌های قابل‌بررسی نشان دهید و بگویید چرا تیم شما برای این فرصت مناسب است. سپس مبلغ درخواستی را به برنامه‌ی مصرف، زمان‌بندی و شاخص‌های سنجش‌پذیر پیوند دهید. یک روایت روشن همراه با داده‌ی قابل‌اتکا، از ارائه‌ی پرزرق‌وبرق مؤثرتر است',
    tool: 'valuation',
  },
  {
    id: 'a2', category: 'مدیریت مالی', readTime: '۵ دقیقه مطالعه', title: 'Runway چیست و چگونه محاسبه می‌شود؟',
    excerpt: 'با یک محاسبه‌ی ساده، مدت‌زمان کفایت منابع نقدی را برآورد کنید',
    body: 'Runway مدت‌زمانی است که منابع نقدی شرکت با هزینه‌های جاری دوام می‌آورد. تقسیم نقدینگی در دسترس بر هزینه‌ی خالص ماهانه، برآورد اولیه را می‌دهد. این عدد را در چند سناریو بسنجید: اگر درآمد دیرتر برسد، هزینه‌ها تغییر کند یا جذب سرمایه طول بکشد چه می‌شود؟ برنامه‌ی مناسب باید چند مسیر جایگزین و نقطه‌ی تصمیم روشن داشته باشد',
    tool: 'runway',
  },
  {
    id: 'a3', category: 'رشد محصول', readTime: '۸ دقیقه مطالعه', title: 'شاخص‌هایی که مسیر رشد را بهتر نشان می‌دهند',
    excerpt: 'از درآمد تکرارشونده تا حفظ مشتری؛ انتخاب شاخص درست مهم‌تر از زیاد بودن داشبورد است',
    body: 'شاخص خوب به یک تصمیم مشخص کمک می‌کند. کسب‌وکار اشتراکی می‌تواند درآمد تکرارشونده، نرخ ریزش و رشد خالص درآمد را کنار هم بررسی کند؛ کسب‌وکار تراکنشی باید کیفیت تکرار خرید و هزینه‌ی جذب را بسنجد. شاخص‌ها را با تعریف دقیق، بازه‌ی زمانی یکسان و منبع داده‌ی روشن ارائه کنید؛ مقایسه‌ی دو عدد با تعریف‌های متفاوت معمولاً گمراه‌کننده است',
    tool: 'saas',
  },
];

export const faqItems = [
  { question: 'طرح من باید در چه مرحله‌ای باشد؟', answer: 'درخواست‌ها در مرحله‌های ایده، نمونه‌ی اولیه، درآمدزایی و رشد بررسی می‌شوند؛ اولویت هر دوره در اطلاعیه‌ی رسمی همان دوره اعلام می‌شود' },
  { question: 'حداقل و حداکثر مبلغ سرمایه‌گذاری چقدر است؟', answer: 'حداقل و حداکثر مبلغ و نوع سرمایه‌گذاری در اطلاعیه‌ی رسمی هر دوره اعلام می‌شود' },
  { question: 'چه تیم‌هایی مناسب‌تر هستند؟', answer: 'تیم‌هایی که مسئله‌ای روشن را حل می‌کنند، بازار خود را می‌شناسند و برای گفت‌وگوی شفاف درباره‌ی داده‌ها و ریسک‌ها آماده‌اند' },
  { question: 'آیا فقط درخواست‌های شهرهای خاصی بررسی می‌شود؟', answer: 'محدوده‌ی جغرافیایی هر دوره در اطلاعیه‌ی رسمی همان دوره اعلام می‌شود' },
  { question: 'آیا ثبت درخواست هزینه‌ای دارد؟', answer: 'شرایط مالی ثبت درخواست، در صورت وجود، در اطلاعیه‌ی رسمی همان دوره اعلام می‌شود' },
];

export const navSections = [
  'home', 'approach', 'portfolio', 'tools', 'knowledge', 'news', 'about', 'partners', 'contact', 'criteria', 'map', 'process', 'industries', 'benefits',
];
