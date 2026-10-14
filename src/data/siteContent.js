import {
  Activity,
  BookOpen,
  Building2,
  ChartNoAxesCombined,
  Cloud,
  Compass,
  Factory,
  FileText,
  GraduationCap,
  HeartHandshake,
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
  { label: 'نمای کلی', route: 'investment' },
  { label: 'مدل فعالیت', route: 'approach' },
  { label: 'پرتفوی فناوری', route: 'portfolio' },
  { label: 'تجربه‌ها', route: 'news' },
  { label: 'درباره‌ی پارس', route: 'about' },
  { label: 'تماس و همکاری', route: 'contact' },
];

// The current website taxonomy follows the 11 focus areas supplied by the user.
// Several labels consolidate the 12 verticals listed in the 2026 corporate profile.
export const industries = [
  {
    id: 'education', title: 'آموزش', english: 'Education', icon: GraduationCap,
    tone: 'mint', description: 'پلتفرم‌های یادگیری هوشمند و شخصی‌سازی‌شده.',
    image: 'pars-photo-learning.webp', brandColor: '#68A6D9',
  },
  {
    id: 'energy', title: 'انرژی', english: 'Energy', icon: Zap,
    tone: 'blue', description: 'مدیریت هوشمند انرژی، هوشمندی عملیات و تحلیل پیش‌بینانه.',
    image: 'pars-photo-energy.webp', brandColor: '#5CC6D9',
  },
  {
    id: 'financial-services', title: 'خدمات مالی', english: 'Financial Services', icon: WalletCards,
    tone: 'blue', description: 'زیرساخت مالی دیجیتال، کیف پول، خدمات مالی تعبیه‌شده و بانکداری دیجیتال.',
    image: 'pars-photo-finance.webp', brandColor: '#68A6D9',
  },
  {
    id: 'housing', title: 'مسکن', english: 'Housing', icon: Building2,
    tone: 'amber', description: 'پلتفرم‌های دیجیتال املاک، هوشمندی ساخت‌وساز و اکوسیستم‌های مسکن هوشمند.',
    image: 'pars-photo-housing.webp', brandColor: '#6166AA',
  },
  {
    id: 'health', title: 'سلامت', english: 'Health', icon: HeartPulse,
    tone: 'rose', description: 'پلتفرم‌های سلامت دیجیتال، داده‌ی سلامت، تعامل با بیمار و مراقبت با پشتیبانی هوش مصنوعی.',
    image: 'pars-photo-health.webp', brandColor: '#592C7A',
  },
  {
    id: 'industry-mining', title: 'صنعت و معدن', english: 'Industry & Mining', icon: Factory,
    tone: 'copper', description: 'هوش مصنوعی صنعتی، نگهداری پیش‌بینانه و کنترل کیفیت؛ همراه با هوشمندی و بهینه‌سازی عملیات معدن.',
    image: 'pars-photo-industry.webp', brandColor: '#592C7A',
  },
  {
    id: 'social-services', title: 'خدمات اجتماعی', english: 'Social Services', icon: UsersRound,
    tone: 'violet', description: 'پلتفرم‌های هوشمند برای خدمات رفاهی، حمایتی و عمومی',
    image: 'pars-photo-social.webp', brandColor: '#6166AA',
  },
  {
    id: 'agriculture', title: 'کشاورزی', english: 'Agriculture', icon: Leaf,
    tone: 'green', description: 'کشاورزی هوشمند، راهکارهای هوشمندیِ کشاورزی، بازارگاه‌ها و بهینه‌سازی زنجیره‌ی تأمین.',
    image: 'pars-sector-agriculture.webp', brandColor: '#5CC6D9',
  },
  {
    id: 'industrial-design', title: 'طراحی صنعتی', english: 'Industrial Design', icon: Compass,
    tone: 'mint', description: 'طراحی با پشتیبانی هوش مصنوعی، هوشمندی مهندسی، شبیه‌سازی و توسعه‌ی محصول.',
    image: 'pars-journey-prototype.webp', brandColor: '#68A6D9',
  },
  {
    id: 'logistics', title: 'لجستیک', english: 'Logistics', icon: Truck,
    tone: 'lime', description: 'بهینه‌سازی زنجیره‌ی تأمین، مسیریابی، هوشمندی ناوگان و خودکارسازی عملیات.',
    image: 'pars-photo-logistics.webp', brandColor: '#68A6D9',
  },
  {
    id: 'content-media', title: 'محتوا و رسانه', english: 'Content & Media', icon: FileText,
    tone: 'mint', description: 'تولید محتوا با هوش مصنوعی، هوشمندی محتوا، شخصی‌سازی و پیشنهاددهی.',
    image: 'pars-photo-content.webp', brandColor: '#6166AA',
  },
];

export const capabilities = [
  {
    id: 'technology-company', title: 'شرکت فناوری', english: 'Technology Company', icon: Network,
    description: 'طراحی و توسعه‌ی هوش مصنوعی، پلتفرم‌های دیجیتال، زیرساخت داده، سامانه‌های سازمانی و کاربردهای هوشمند.',
  },
  {
    id: 'transformation-partner', title: 'شریک تحول دیجیتال', english: 'Transformation Partner', icon: Activity,
    description: 'کمک به سازمان‌ها برای گذار از الگوهای عملیاتی سنتی به سازمان‌های یکپارچه‌ی دیجیتال و هوشمندی‌محور.',
  },
  {
    id: 'technology-investor', title: 'سرمایه‌گذار فناوری', english: 'Technology Investor', icon: WalletCards,
    description: 'سرمایه‌گذاری در شرکت‌های فناوری و ایجاد پیوند میان دارایی‌های فناورانه و فرصت‌های بازار.',
  },
  {
    id: 'venture-builder', title: 'سازنده‌ی کسب‌وکار', english: 'Venture Builder', icon: Rocket,
    description: 'تبدیل فناوری، مالکیت فکری، پژوهش و فرصت‌های بازار به محصول، استارتاپ، پلتفرم و کسب‌وکار.',
  },
];

export const technologyLayers = [
  {
    number: '۰۱', title: 'زیرساخت', english: 'Infrastructure', icon: Cloud,
    description: 'رایانش، ابر و ابر ترکیبی، ذخیره‌سازی، شبکه، امنیت سایبری، DevOps، MLOps و زیرساخت هوش مصنوعی و اپلیکیشن.',
  },
  {
    number: '۰۲', title: 'توسعه و داده', english: 'Development & Data', icon: Network,
    description: 'پلتفرم‌های توسعه‌ی نرم‌افزار و داده، یکپارچه‌سازی داده، مدیریت API، یکپارچه‌سازی سامانه‌ها، حاکمیت داده، مدیریت دانش و ابزارهای توسعه‌دهنده.',
  },
  {
    number: '۰۳', title: 'پروتکل‌های هوشمندی', english: 'Intelligence Protocols', icon: ShieldCheck,
    description: 'درگاه مدل‌های زبانی، تعامل‌پذیری مدل‌ها، ارکستراسیون هوش مصنوعی و عامل‌ها، فراخوانی ابزار، زمینه و حافظه، RAG، هویت و دسترسی و حاکمیت هوش مصنوعی.',
  },
  {
    number: '۰۴', title: 'پلتفرم‌های هوشمندی', english: 'Intelligence Platforms', icon: ChartNoAxesCombined,
    description: 'پلتفرم سازمانی هوش مصنوعی، AI Fabric، پلتفرم عامل‌ها، هوشمندی دانش، پلتفرم هوش مالی، مرکز فرماندهی هوش مصنوعی، کمک‌یار سازمانی و خودکارسازی هوشمند.',
  },
  {
    number: '۰۵', title: 'خدمات هوشمند', english: 'Intelligent Services', icon: Building2,
    description: 'محصول‌های هوش مصنوعیِ حوزه‌ای، پلتفرم‌های صنعتی و خدمات کسب‌وکار هوشمند در حوزه‌های تمرکز پارس.',
  },
];

export const ecosystemEnablers = [
  {
    id: 'human-capital', number: '۰۱', title: 'مرکز سرمایه‌ی انسانی', english: 'Human Capital Hub', icon: UsersRound,
    description: 'شناسایی، پرورش، سازمان‌دهی و به‌کارگیری استعدادهای تخصصی فناوری و هوش مصنوعی.',
    sequence: 'استعداد ← پروژه ← محصول ← کسب‌وکار',
  },
  {
    id: 'data', number: '۰۲', title: 'مرکز داده', english: 'Data Hub', icon: Cloud,
    description: 'تبدیل داده به دارایی راهبردی فناوری و کسب‌وکار؛ از گردآوری و یکپارچه‌سازی تا حاکمیت، کیفیت و داده‌ی آماده‌ی هوش مصنوعی.',
    sequence: 'گردآوری ← یکپارچه‌سازی ← حاکمیت ← محصول داده',
  },
  {
    id: 'research', number: '۰۳', title: 'مرکز پژوهش', english: 'Research Hub', icon: BookOpen,
    description: 'پیوند پژوهش و نوآوری با توسعه‌ی فناوری تجاری؛ با پژوهش هوش مصنوعی، تحلیل بازار، رصد فناوری، اثبات مفهوم و انتقال فناوری.',
    sequence: 'پژوهش ← رصد فناوری ← اثبات مفهوم ← انتقال فناوری',
  },
  {
    id: 'venture-studio', number: '۰۴', title: 'استودیوی سرمایه‌گذاری جسورانه', english: 'Venture Studio', icon: Rocket,
    description: 'ساخت کسب‌وکارهای تازه بر پایه‌ی فناوری، مالکیت فکری، پژوهش و فرصت‌های بازار.',
    sequence: 'ایده ← نمونه‌ی اولیه ← محصول ← استارتاپ ← مقیاس',
  },
  {
    id: 'market-growth', number: '۰۵', title: 'شتاب‌دهنده‌ی رشد بازار', english: 'Market Growth Accelerator', icon: ChartNoAxesCombined,
    description: 'پیوند فناوری با بازار از راهبرد ورود به بازار تا فروش سازمانی، کانال‌ها، مشارکت‌ها و رشد درآمد.',
    sequence: 'راهبرد بازار ← فروش سازمانی ← تناسب محصول و بازار ← رشد درآمد',
  },
];

export const commercializationStages = [
  { number: '۰۱', title: 'فناوری و پژوهش', english: 'Technology & Research', description: 'پژوهش کاربردی، رصد فناوری و بررسی فناوری‌های نوظهور.' },
  { number: '۰۲', title: 'اثبات مفهوم', english: 'Proof of Concept', description: 'سنجش امکان‌پذیری فنی در برابر یک مسئله‌ی واقعی سازمانی.' },
  { number: '۰۳', title: 'تبدیل به محصول', english: 'Productization', description: 'بسته‌بندی فناوریِ اعتبارسنجی‌شده در قالب محصولی تکرارپذیر.' },
  { number: '۰۴', title: 'تبدیل به پلتفرم', english: 'Platformization', description: 'گسترش محصول به زیرساختی قابل استفاده برای ساخت راهکارهای دیگر.' },
  { number: '۰۵', title: 'کسب‌وکار تجاری', english: 'Commercial Business', description: 'طراحی مدل درآمد، فروش سازمانی و توسعه‌ی بازار.' },
  { number: '۰۶', title: 'اکوسیستم', english: 'Ecosystem', description: 'همراهی شرکا، کسب‌وکارها و بازیگران دیگر در ساخت بر بستر پلتفرم.' },
];

export const businessMarkets = [
  { title: 'فناوری هوش مصنوعی', english: 'AI Technology', icon: Network, description: 'زیرساخت هوش مصنوعی، پلتفرم‌ها، عامل‌ها و کاربردهای هوشمند.' },
  { title: 'تحول دیجیتال', english: 'Digital Transformation', icon: Activity, description: 'تحول سازمانی و شکل‌دهی به الگوهای عملیاتی دیجیتال.' },
  { title: 'سرمایه‌گذاری فناوری', english: 'Technology Investment', icon: WalletCards, description: 'سرمایه‌گذاری راهبردی و تملک دارایی‌های فناوری.' },
  { title: 'ساخت کسب‌وکار', english: 'Venture Building', icon: Rocket, description: 'ساخت محصول‌ها، استارتاپ‌ها و کسب‌وکارهای پلتفرمی.' },
];

export const customerSegments = [
  'سازمان‌ها و بنگاه‌ها',
  'نهادهای مالی',
  'دولت و بخش عمومی',
  'شرکت‌های فناوری',
  'استارتاپ‌ها و شرکت‌های در حال رشد',
  'سازمان‌های صنعتی',
];

export const revenueStreams = [
  'خدمات فناوری',
  'درآمد محصول',
  'درآمد پلتفرم',
  'نرم‌افزار و پلتفرم به‌عنوان خدمت (SaaS / PaaS)',
  'مجوز بهره‌برداری از فناوری',
  'خدمات مدیریت‌شده',
  'کیف پول و زیرساخت مالی به‌عنوان خدمت (WaaS / FIaaS)',
  'کسب‌وکارهای مشترک',
  'سرمایه‌گذاری راهبردی',
  'ساخت کسب‌وکار',
];

export const whyParsFeatures = [
  { number: '۰۱', title: 'توانمندی فناوری یکپارچه', description: 'از زیرساخت و داده تا پلتفرم‌های هوش مصنوعی و خدمات هوشمند.' },
  { number: '۰۲', title: 'تجربه‌ی چندحوزه‌ای', description: 'توسعه‌ی راهکارها در حوزه‌های مختلف اقتصادی و صنعتی.' },
  { number: '۰۳', title: 'راهبرد هوش مصنوعی', description: 'حرکت از تحول دیجیتال سنتی به سازمان‌هایی که هوش مصنوعی در هسته‌ی عملیاتشان است.' },
  { number: '۰۴', title: 'فناوری در کنار سرمایه', description: 'پیوند توان توسعه‌ی فناوری با سرمایه‌گذاری فناوری.' },
  { number: '۰۵', title: 'ساخت کسب‌وکار', description: 'تبدیل فناوری، پژوهش و فرصت بازار به محصول و کسب‌وکار.' },
  { number: '۰۶', title: 'دسترسی به بازار', description: 'روابط سازمانی و توانمندی تجاری‌سازی متناسب با هر حوزه.' },
  { number: '۰۷', title: 'نگاه اکوسیستمی', description: 'قرارگرفتن استعداد، داده، پژوهش، ساخت کسب‌وکار و رشد بازار در یک مدل.' },
  { number: '۰۸', title: 'افق اپراتوری هوش مصنوعی', description: 'پیگیری مجوز موردنیاز برای فعالیت به‌عنوان AI Operator در ایران.' },
];

export const partnershipModels = [
  { number: '۰۱', title: 'شراکت فناوری', english: 'Technology Partnership', icon: Network, description: 'یکپارچه‌سازی فناوری و توسعه‌ی مشترک راهکار.' },
  { number: '۰۲', title: 'انتقال فناوری', english: 'Technology Transfer', icon: Cloud, description: 'انتقال و بومی‌سازی فناوری برای بازار ایران.' },
  { number: '۰۳', title: 'توسعه‌ی مشترک', english: 'Co-Development', icon: ChartNoAxesCombined, description: 'توسعه‌ی مشترک محصول و پلتفرم.' },
  { number: '۰۴', title: 'کسب‌وکار مشترک', english: 'Joint Venture', icon: HeartHandshake, description: 'ساخت کسب‌وکاری با مالکیت مشترک و ترکیب توان فناوری و بازار.' },
  { number: '۰۵', title: 'سرمایه‌گذاری راهبردی', english: 'Strategic Investment', icon: WalletCards, description: 'سرمایه‌گذاری سهامی در شرکت‌ها و پلتفرم‌های فناوری.' },
  { number: '۰۶', title: 'مجوز فناوری', english: 'Licensing', icon: ShieldCheck, description: 'صدور مجوز استفاده از فناوری و مالکیت فکری.' },
  { number: '۰۷', title: 'ورود به بازار', english: 'Market Entry Partnership', icon: Building2, description: 'پشتیبانی از ورود شرکت‌های بین‌المللی به بازار ایران، در چارچوب قوانین قابل اجرا.' },
  { number: '۰۸', title: 'توسعه‌ی منطقه‌ای', english: 'Regional Expansion', icon: Compass, description: 'توسعه‌ی مشترک محصول‌های فناورانه برای بازارهای منطقه.' },
];

export const aiFabricConsumers = [
  'اپلیکیشن‌های سازمانی',
  'کمک‌یارهای هوشمند',
  'عامل‌های خودکار',
  'خدمات حوزه‌ای',
];

export const aiFabricComponents = [
  'درگاه مدل‌های زبانی (LLM Gateway)',
  'مدیریت پرامپت',
  'مدیریت مدل',
  'دانش سازمانی',
  'بازیابی افزوده (RAG)',
  'حافظه',
  'محیط اجرای عامل',
  'یکپارچه‌سازی ابزارها',
  'ارکستراسیون هوش مصنوعی',
  'حاکمیت هوش مصنوعی',
  'رابط‌های برنامه‌نویسی هوش مصنوعی (AI APIs)',
  'پروتکل‌های زمینه',
];

export const financialInfrastructureBlocks = [
  'هویت',
  'کیف پول',
  'دفترکل',
  'پرداخت',
  'رضایت و مجوز دسترسی',
  'موتور قواعد',
  'درگاه API',
  'اعلان‌ها',
  'گزارش‌گیری',
  'خدمات هوش مصنوعی',
];

export const walletModels = [
  'کیف پول مصرف‌کننده',
  'کیف پول شرکتی',
  'کیف پول پذیرنده',
  'کیف پول کارکنان',
  'کیف پول اکوسیستم',
  'خدمات مالی تعبیه‌شده',
];

export const experienceAreas = [
  'تحول بانکداری',
  'تحول بیمه',
  'سازمان هوش‌مصنوعی‌محور',
  'زیرساخت مالی',
  'پلتفرم‌های کیف پول دیجیتال',
  'دستیارهای هوش مصنوعی سازمانی',
  'فناوری آموزشی',
  'فناوری سلامت',
  'ورزش و تندرستی',
  'تحول تجارت الکترونیک',
  'صنعت هوشمند',
  'اکوسیستم‌های دیجیتال',
  'دولت و بخش عمومی',
];

export const technologyProducts = [
  'Iran Digital',
  'Smart School & Mandegar Alborz National Campaign',
  'Algonet APS',
  'Okyan',
  'Janfada Suite',
  'C-Gate & Refah Yar',
  'Enterprise Device',
  'Sepidor (Revised)',
  'Okyan Console',
  'Shahrag Service',
  'Ava & Smart Call Center',
  'Kardano',
  'Finka',
  'Global Supply Chain',
  'Kaya Freelancing Platform',
  'Sinus Vibration Monitoring Suite',
  'Sharif Clinic',
  'Smart Vehicle Maintenance Management',
  'Budget Assistant',
  'AlloyAI',
  'Integrated Energy Suite — Power, Gas & Fuel',
  'Karvan Marketing Base Platform',
  'Decentralized Banking',
  'Observable Smart Meters',
  'Internal Smart Dispatching',
  'Smart Local Renewable Power Management',
  'Micro Energy Trading Market',
  'Smart Energy Assistant',
  'AI Agent Studio',
  'Kaya Pay',
  'Delta AI',
  'Bourse Tech',
  'Kesht Net (Agri OS)',
  'Mooniva',
  'Tebify',
];

export const platformBrands = [
  'Sepidor (Betacore)',
  'Algonet APS',
  'AI Agent Studio',
  'Aither & Argus',
  'IDO Center',
  'D.G.X Enterprise Device',
  'Sinus Suite',
  'Smart Parking',
  'Smart School',
  'Smart Call Center',
  'Sharif Clinic (H.OS)',
  'CredIQ',
  'Pisheh',
  'Smart Banking (B.OS)',
  'C-Gate',
  'Smart Pathology',
  'Energy Inbox',
  'Sanagen',
  'Super Rose',
  'Sad Board',
];

export const nationalPrograms = [
  {
    number: '۰۱', title: 'خدمات اپراتور زیرساخت هوش مصنوعی', icon: Network,
    description: 'توسعه و ارائه‌ی خدمات اپراتور زیرساخت ملی هوش مصنوعی.',
    partners: 'وزارت ارتباطات و فناوری اطلاعات',
  },
  {
    number: '۰۲', title: 'خدمات هوشمند زنجیره‌ی تأمین', icon: Truck,
    description: 'مدیریت لجستیک واردات و صادرات در کریدورهای ملی تجارت.',
    partners: 'سازمان برنامه و بودجه · وزارتخانه‌های راه، کشاورزی و صنعت',
  },
  {
    number: '۰۳', title: 'برنامه‌ریزی هوشمند سرزمینی و پایش سوخت', icon: Compass,
    description: 'برنامه‌ریزی هوشمند کاربری زمین و پایش مصرف سوخت در مقیاس ملی.',
    partners: 'سازمان برنامه و بودجه',
  },
  {
    number: '۰۴', title: 'خدمات مدرسه‌ی هوشمند دیجیتال', icon: GraduationCap,
    description: 'خدمات دیجیتال آموزشی برای بیش از ۲ میلیون دانش‌آموز.',
    scale: '۲ میلیون+ دانش‌آموز',
    partners: 'وزارت آموزش‌وپرورش',
  },
  {
    number: '۰۵', title: 'خدمات برنامه‌ریزی پیشرفته با هوش مصنوعی', icon: ChartNoAxesCombined,
    description: 'برنامه‌ریزی و زمان‌بندی پیشرفته با بهره‌گیری از هوش مصنوعی.',
    partners: 'وزارت راه و شهرسازی',
  },
  {
    number: '۰۶', title: 'مدیریت هوشمند دام', icon: Leaf,
    description: 'پایلوتِ طرح ملی مدیریت شیر، لبنیات و پروتئین.',
    scale: '۳۰٬۰۰۰ رأس دام',
    partners: 'آستان قدس رضوی · شرکت میهن',
  },
];

export const valuePillars = ecosystemEnablers;

// This four-step sequence describes the website's application form, not an
// investment evaluation process or a commitment to accept submissions.
export const processSteps = [
  { number: '۰۱', title: 'اطلاعات تماس', description: 'اطلاعات راه ارتباطی و نقش شما در تیم.' },
  { number: '۰۲', title: 'ایده و محصول', description: 'معرفی مسئله، محصول و مرحله‌ی کسب‌وکار.' },
  { number: '۰۳', title: 'نیاز سرمایه', description: 'مبلغ درخواستی و برنامه‌ی مصرف آن.' },
  { number: '۰۴', title: 'مدارک و تأیید', description: 'افزودن فایل اختیاری و تأیید اطلاعات فرم.' },
];

export const stageOptions = ['ایده', 'نمونه‌ی اولیه (MVP)', 'درآمدزا', 'رشد'];

export const navSections = [
  'home', 'investment', 'approach', 'portfolio', 'news', 'about', 'contact', 'tools', 'apply', 'track',
];
