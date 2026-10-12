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
  { label: 'رویکرد پارس', href: '#approach' },
  { label: 'حوزه‌های منتخب', href: '#industries' },
  { label: 'پشتیبانی', href: '#benefits' },
  { label: 'مسیر درخواست', href: '#process' },
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
  { number: '۰۱', title: 'اطلاعات تماس', description: 'اطلاعات راه ارتباطی و نقش شما در تیم' },
  { number: '۰۲', title: 'ایده و محصول', description: 'معرفی مسئله، محصول و مرحله‌ی کسب‌وکار' },
  { number: '۰۳', title: 'نیاز سرمایه', description: 'مبلغ درخواستی و برنامه‌ی مصرف آن' },
  { number: '۰۴', title: 'مدارک و تأیید', description: 'افزودن فایل اختیاری و تأیید اطلاعات فرم' },
];

export const stageOptions = ['ایده', 'نمونه‌ی اولیه (MVP)', 'درآمدزا', 'رشد'];

export const navSections = [
  'home', 'approach', 'industries', 'benefits', 'process', 'portfolio', 'map', 'tools', 'partners', 'news', 'about', 'team', 'contact', 'campaign', 'track',
];
