import {
  Activity,
  Building2,
  ChartNoAxesCombined,
  Cloud,
  CreditCard,
  Factory,
  FileText,
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
  { label: 'رویکرد', route: 'approach' },
  { label: 'حوزه‌ها', route: 'industries' },
  { label: 'پرتفوی', route: 'portfolio' },
  { label: 'خبرها و دیدگاه‌ها', route: 'news' },
  { label: 'درباره‌ی ما', route: 'about' },
  { label: 'تماس', route: 'contact' },
];

export const industries = [
  { number: '۰۱', title: 'انرژی', english: 'Energy', icon: Zap, tone: 'blue', description: 'راهکارها و کسب‌وکارهای حوزه‌ی انرژی' },
  { number: '۰۲', title: 'آموزش', english: 'Education', icon: GraduationCap, tone: 'mint', description: 'محصول‌ها و خدمات حوزه‌ی آموزش' },
  { number: '۰۳', title: 'خدمات اجتماعی', english: 'Social Services', icon: UsersRound, tone: 'violet', description: 'محصول‌ها و خدمات اجتماعی' },
  { number: '۰۴', title: 'سلامت', english: 'Health', icon: HeartPulse, tone: 'rose', description: 'راهکارها و کسب‌وکارهای حوزه‌ی سلامت' },
  { number: '۰۵', title: 'کشاورزی', english: 'Agriculture', icon: Leaf, tone: 'green', description: 'محصول‌ها و خدمات حوزه‌ی کشاورزی' },
  { number: '۰۶', title: 'مالی', english: 'Finance', icon: WalletCards, tone: 'blue', description: 'راهکارها و کسب‌وکارهای حوزه‌ی مالی' },
  { number: '۰۷', title: 'مسکن', english: 'Housing', icon: Building2, tone: 'amber', description: 'محصول‌ها و خدمات حوزه‌ی مسکن' },
  { number: '۰۸', title: 'صنعت', english: 'Industry', icon: Factory, tone: 'copper', description: 'راهکارها و کسب‌وکارهای صنعتی' },
  { number: '۰۹', title: 'اعتباری', english: 'Credit', icon: CreditCard, tone: 'violet', description: 'محصول‌ها و خدمات اعتباری' },
  { number: '۱۰', title: 'لجستیک', english: 'Logistics', icon: Truck, tone: 'lime', description: 'راهکارها و خدمات حوزه‌ی لجستیک' },
  { number: '۱۱', title: 'محتوا', english: 'Content', icon: FileText, tone: 'mint', description: 'محصول‌ها و خدمات حوزه‌ی محتوا' },
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
  'home', 'approach', 'industries', 'portfolio', 'news', 'about', 'contact', 'tools', 'apply', 'track',
];
