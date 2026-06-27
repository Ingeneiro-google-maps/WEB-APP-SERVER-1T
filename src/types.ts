export interface SupplyItem {
  id: string;
  category: 'Alimentos no perecederos' | 'Ropa y Abrigo' | 'Medicinas e Insumos' | 'Agua Potable' | 'Kits Infantiles';
  name: string;
  currentKilos: number;
  targetKilos: number;
  unit: 'kg' | 'litros' | 'unidades';
  iconName: string;
}

export interface CollectionCenter {
  id: string;
  city: string;
  country: string;
  name: string;
  address: string;
  contact: string;
  hours: string;
  acceptedItems: string[];
  urgentNeeds: string[];
  mapsUrl: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Donaciones' | 'Logística' | 'Voluntariado' | 'Transparencia';
}

export interface DonorPledge {
  id: string;
  donorName: string;
  email: string;
  city: string;
  pledgeKilos: number;
  category: string;
  description?: string;
  message: string;
  date: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  status: 'success' | 'error' | 'info';
  message: string;
  kilosUpdated?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  severity: 'green' | 'orange' | 'red';
  author: string;
}

export interface SuggestionItem {
  id: string;
  userName: string;
  email: string;
  type: 'sugerencia' | 'informacion' | 'logistica';
  message: string;
  date: string;
}

export interface GlobalState {
  codeVersion?: string;
  campaignTitle: string;
  emergencySubtitle: string;
  headerAlertText?: string;
  heroBadgeText?: string;
  heroTitleRow1?: string;
  heroTitleRow2?: string;
  heroTitleRow3?: string;
  globalTargetTons: number; // e.g. 1, 5, 10, 50 tons
  lastSyncTime: string;
  nextSyncTime: string;
  googleSheetUrl: string;
  googleSheetWebhookUrl?: string;
  autoSyncEnabled: boolean;
  syncIntervalMinutes: number; // 60 mins = 1 hour
  supplies: SupplyItem[];
  centers: CollectionCenter[];
  faqs: FAQItem[];
  pledges: DonorPledge[];
  syncLogs: SyncLog[];
  news: NewsItem[];
  suggestions: SuggestionItem[];
  hasNewDonationAlert?: boolean;
  supabaseActive?: boolean;
  supabaseTableMissing?: boolean;
  adminUsers?: AdminUser[];
  userChangeLogs?: UserChangeLog[];
  visibleBlocks?: {
    suppliesGrid?: boolean;
    centersGrid?: boolean;
    donationsList?: boolean;
    newsSection?: boolean;
    faqSection?: boolean;
    suggestionsSection?: boolean;
  };
  donationPassword?: string;
  webAccessLogs?: WebAccessLog[];
  headerVideoEnabled?: boolean;
  headerVideoYoutubeUrl?: string;
  introVideoEnabled?: boolean;
  introVideoYoutubeUrl?: string;
  introVideoBadgeText?: string;
  introVideoTitle?: string;
  introVideoSubtitle?: string;
  introVideoBtnText?: string;
}

export interface WebAccessLog {
  id: string;
  timestamp: string;      // ISO string
  ip?: string;            // Visitor IP
  device: string;         // Device description / Browser / Operating System
  location: string;       // Country, city, or approximation
  page: string;           // Page path (e.g. "/" or "/admin")
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string; // e.g. "Super Admin", "Coordinador", "Voluntario"
  avatar?: string;
  createdAt: string;
}

export interface UserChangeLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string; // e.g. "26/06/2026"
  time: string; // e.g. "11:52:00"
  action: string; // e.g. "Actualizó la meta global a 5 Toneladas"
}

