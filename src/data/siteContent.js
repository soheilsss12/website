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
  { label: 'درباره‌ی پارس', route: 'about' },
  { label: 'روایت‌ها', route: 'news' },
  { label: 'تماس', route: 'contact' },
];

export const investmentNavItems = [
  { label: 'نمای کلی', route: 'investment' },
  { label: 'رویکرد', route: 'approach' },
  { label: 'حوزه‌ها', route: 'industries' },
  { label: 'پرتفوی', route: 'portfolio' },
  { label: 'ابزارها', route: 'tools' },
];

export const industries = [
  { id: 'energy', title: 'انرژی', english: 'Energy', icon: Zap, tone: 'blue', description: 'راهکارها و کسب‌وکارهای حوزه‌ی انرژی', image: 'pars-photo-energy.webp', brandColor: '#5CC6D9' },
  { id: 'education', title: 'آموزش', english: 'Education', icon: GraduationCap, tone: 'mint', description: 'محصول‌ها و خدمات حوزه‌ی آموزش', image: 'pars-photo-learning.webp', brandColor: '#68A6D9' },
  { id: 'social-services', title: 'خدمات اجتماعی', english: 'Social Services', icon: UsersRound, tone: 'violet', description: 'محصول‌ها و خدمات اجتماعی', image: 'pars-photo-social.webp', brandColor: '#6166AA' },
  { id: 'health', title: 'سلامت', english: 'Health', icon: HeartPulse, tone: 'rose', description: 'راهکارها و کسب‌وکارهای حوزه‌ی سلامت', image: 'pars-photo-health.webp', brandColor: '#592C7A' },
  { id: 'agriculture', title: 'کشاورزی', english: 'Agriculture', icon: Leaf, tone: 'green', description: 'محصول‌ها و خدمات حوزه‌ی کشاورزی', image: 'pars-sector-agriculture.webp', brandColor: '#5CC6D9' },
  { id: 'finance', title: 'مالی', english: 'Finance', icon: WalletCards, tone: 'blue', description: 'راهکارها و کسب‌وکارهای حوزه‌ی مالی', image: 'pars-photo-finance.webp', brandColor: '#68A6D9' },
  { id: 'housing', title: 'مسکن', english: 'Housing', icon: Building2, tone: 'amber', description: 'محصول‌ها و خدمات حوزه‌ی مسکن', image: 'pars-photo-housing.webp', brandColor: '#6166AA' },
  { id: 'industry', title: 'صنعت', english: 'Industry', icon: Factory, tone: 'copper', description: 'راهکارها و کسب‌وکارهای صنعتی', image: 'pars-photo-industry.webp', brandColor: '#592C7A' },
  { id: 'credit', title: 'اعتباری', english: 'Credit', icon: CreditCard, tone: 'violet', description: 'محصول‌ها و خدمات اعتباری', image: 'pars-photo-credit.webp', brandColor: '#5CC6D9' },
  { id: 'logistics', title: 'لجستیک', english: 'Logistics', icon: Truck, tone: 'lime', description: 'راهکارها و خدمات حوزه‌ی لجستیک', image: 'pars-photo-logistics.webp', brandColor: '#68A6D9' },
  { id: 'content', title: 'محتوا', english: 'Content', icon: FileText, tone: 'mint', description: 'محصول‌ها و خدمات حوزه‌ی محتوا', image: 'pars-photo-content.webp', brandColor: '#6166AA' },
];

export const valuePillars = [
  { id: 'market-access', title: 'دسترسی به بازار', icon: ChartNoAxesCombined, description: 'مسیر رسیدن به مشتری و شریک تجاری را کوتاه می‌کنیم' },
  { id: 'network', title: 'شبکه‌ی حرفه‌ای', icon: Network, description: 'ارتباط با افرادی که گام بعدی را ممکن می‌کنند' },
  { id: 'pilot', title: 'مشتری و پایلوت', icon: Building2, description: 'کمک به یافتن اولین مشتریان و اجرای پایلوت' },
  { id: 'mentoring', title: 'منتورینگ', icon: UsersRound, description: 'گفت‌وگوی صریح با افراد باتجربه در تصمیم‌های دشوار' },
  { id: 'operations', title: 'پشتیبانی اجرایی', icon: Cloud, description: 'ابزار، تخصص و ظرفیت اجرایی متناسب با نیاز تیم' },
  { id: 'go-to-market', title: 'راهبرد ورود به بازار', icon: Rocket, description: 'از جایگاه‌یابی و قیمت‌گذاری تا برنامه‌ی اجرا' },
  { id: 'next-round', title: 'آمادگی برای دور بعدی', icon: Activity, description: 'تدوین روایت، داده و ساختار لازم برای جذب سرمایه‌ی بعدی' },
  { id: 'trust', title: 'اعتبار', icon: ShieldCheck, description: 'حضور یک سرمایه‌گذار معتبر در کنار شما، گفت‌وگو با مشتریان و سرمایه‌گذاران بعدی را آسان‌تر می‌کند' },
];

export const processSteps = [
  { number: '۰۱', title: 'اطلاعات تماس', description: 'اطلاعات راه ارتباطی و نقش شما در تیم' },
  { number: '۰۲', title: 'ایده و محصول', description: 'معرفی مسئله، محصول و مرحله‌ی کسب‌وکار' },
  { number: '۰۳', title: 'نیاز سرمایه', description: 'مبلغ درخواستی و برنامه‌ی مصرف آن' },
  { number: '۰۴', title: 'مدارک و تأیید', description: 'افزودن فایل اختیاری و تأیید اطلاعات فرم' },
];

export const stageOptions = ['ایده', 'نمونه‌ی اولیه (MVP)', 'درآمدزا', 'رشد'];

export const navSections = [
  'home', 'investment', 'approach', 'industries', 'portfolio', 'news', 'about', 'contact', 'tools', 'apply', 'track',
];
