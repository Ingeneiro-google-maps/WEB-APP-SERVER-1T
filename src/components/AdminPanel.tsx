import React, { useState } from 'react';
import { GlobalState, SupplyItem, CollectionCenter, FAQItem, AdminUser, UserChangeLog } from '../types';
import { 
  Settings, RefreshCw, Plus, Trash2, Edit3, Save, Database, 
  FileSpreadsheet, CheckCircle2, AlertOctagon, ArrowUpRight, 
  Lock, Download, Upload, Building2, Newspaper, HelpCircle, Lightbulb,  
  Search, X, ExternalLink, Package, MapPin, Phone, Clock,
  Users, History, User, UserPlus, ShieldCheck, Calendar, Terminal, Activity,
  Scale, Video, Play, Check, Sparkles
} from 'lucide-react';

function getYoutubeId(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.length === 11 && !cleanUrl.includes('/') && !cleanUrl.includes('?')) {
    return cleanUrl;
  }
  if (cleanUrl.includes('/shorts/')) {
    const parts = cleanUrl.split('/shorts/');
    if (parts[1]) {
      const id = parts[1].split(/[?#&]/)[0];
      if (id.length === 11) return id;
    }
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = cleanUrl.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

interface AdminPanelProps {
  state: GlobalState;
  onUpdateState: (newPartial: Partial<GlobalState>) => void;
  onTriggerSync: (manual: boolean) => Promise<void> | void;
  syncing: boolean;
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  state,
  onUpdateState,
  onTriggerSync,
  syncing,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'excel_bd' | 'centros' | 'categorias_donacion' | 'noticias' | 'faqs' | 'sugerencias' | 'config' | 'portada' | 'usuarios' | 'cambios_web' | 'saludar_sistema' | 'accesos_web' | 'contador_vivo' | 'videos' | 'mantenimiento'>('excel_bd');
  const [message, setMessage] = useState<string | null>(null);

  // Active User Profile management in browser session
  const [activeUser, setActiveUser] = useState<AdminUser | null>(() => {
    const cached = localStorage.getItem('active_admin_user');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const found = state.adminUsers?.find(u => u.id === parsed.id);
        if (found) return found;
      } catch (e) {}
    }
    // Default to Orlando Galdámez if found, or first user, or null
    const orlando = state.adminUsers?.find(u => u.id === 'usr-orlando');
    if (orlando) return orlando;
    return state.adminUsers && state.adminUsers.length > 0 ? state.adminUsers[0] : null;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // States for adding a new user profile
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Coordinador');
  const [newUserAvatar, setNewUserAvatar] = useState('👤');

  // Search query for user changes log
  const [logSearchQuery, setLogSearchQuery] = useState('');
  
  // Search query for web access history
  const [accessSearchQuery, setAccessSearchQuery] = useState('');

  // "Borrar todo" Password modal/input
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearPassword, setClearPassword] = useState('');
  const [clearError, setClearError] = useState<string | null>(null);
  const [clearSuccess, setClearSuccess] = useState<string | null>(null);

  // "Saluda al sistema" / Forensic states
  const [forensicData, setForensicData] = useState<any>(null);
  const [loadingForensic, setLoadingForensic] = useState(false);
  const [forensicError, setForensicError] = useState<string | null>(null);
  const [greetMessage, setGreetMessage] = useState<string | null>(null);

  const handleClearAllDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClearError(null);
    setClearSuccess(null);

    if (clearPassword !== '869987') {
      setClearError('Contraseña incorrecta. El código de seguridad 869987 es requerido para realizar esta acción destructiva.');
      return;
    }

    try {
      const res = await fetch('/api/clear-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: clearPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setClearSuccess('🧹 ¡La base de datos se ha limpiado con éxito! Se han eliminado todas las donaciones de prueba y los inventarios se han inicializado en 0.');
        if (data.state) {
          onUpdateState(data.state);
        }
        setTimeout(() => {
          setIsClearModalOpen(false);
          setClearPassword('');
          setClearSuccess(null);
        }, 2500);
      } else {
        setClearError(data.error || 'Error al intentar limpiar los datos.');
      }
    } catch (err: any) {
      setClearError(`Error de red: ${err.message || err}`);
    }
  };

  const handleFetchForensic = async () => {
    setLoadingForensic(true);
    setForensicError(null);
    setForensicData(null);
    setGreetMessage(null);

    try {
      const res = await fetch('/api/forensic-analysis');
      const data = await res.json();
      if (res.ok) {
        setForensicData(data);
        if (data.message) {
          setGreetMessage(data.message);
        }
      } else {
        setForensicError(data.message || 'Error en la respuesta del análisis forense de Supabase.');
      }
    } catch (err: any) {
      setForensicError(`Error de conexión con el servidor: ${err.message || err}`);
    } finally {
      setLoadingForensic(false);
    }
  };

  // Helper to trigger updates and save an audit log entry simultaneously
  const handleUpdateStateWithLog = (updates: Partial<GlobalState>, actionDescription: string) => {
    if (activeUser) {
      const now = new Date();
      const newLog: UserChangeLog = {
        id: 'ulog-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        userId: activeUser.id,
        userName: activeUser.name,
        userEmail: activeUser.email,
        date: now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        action: actionDescription
      };
      onUpdateState({
        ...updates,
        userChangeLogs: [newLog, ...(state.userChangeLogs || [])]
      });
    } else {
      onUpdateState(updates);
    }
  };

  // Filtros búsqueda locales
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de edición para Centros
  const [editingCenterId, setEditingCenterId] = useState<string | null>(null);
  const [editCenterForm, setEditCenterForm] = useState<Partial<CollectionCenter>>({});
  const [newCenter, setNewCenter] = useState<Partial<CollectionCenter>>({
    city: 'Madrid',
    country: 'España',
    name: '',
    address: '',
    contact: '',
    hours: '10:00 AM - 8:00 PM',
    acceptedItems: ['Alimentos no perecederos', 'Medicinas', 'Mantas'],
    urgentNeeds: ['Leche infantil', 'Pastillas potabilizadoras']
  });
  const [newUrgentNeedsStr, setNewUrgentNeedsStr] = useState<string>('Leche infantil, Pastillas potabilizadoras');
  const [editUrgentNeedsStr, setEditUrgentNeedsStr] = useState<string>('');

  // Estados de edición para Noticias
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editNewsForm, setEditNewsForm] = useState<any>({});
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    severity: 'red' as 'green' | 'orange' | 'red',
    author: 'Coordinación Central ONG España'
  });

  // Estados de edición para FAQs
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqForm, setEditFaqForm] = useState<Partial<FAQItem>>({});
  const [newFaq, setNewFaq] = useState<Partial<FAQItem>>({
    category: 'Donaciones',
    question: '',
    answer: ''
  });

  // Configuración general
  const [targetTons, setTargetTons] = useState<number>(state.globalTargetTons);
  const [sheetUrl, setSheetUrl] = useState<string>(state.googleSheetUrl || '');
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState<string>(state.googleSheetWebhookUrl || '');
  const [autoSync, setAutoSync] = useState<boolean>(state.autoSyncEnabled);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(state.autoUpdateActive !== false);
  const [donationPass, setDonationPass] = useState<string>(state.donationPassword || 'VENEZUELAVIVE2026');

  // Categorías de donación dinámicas
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');
  const [deletingCategoryIndex, setDeletingCategoryIndex] = useState<number | null>(null);

  // Estados de visibilidad de bloques de información de la web
  const [showSuppliesGrid, setShowSuppliesGrid] = useState<boolean>(state.visibleBlocks?.suppliesGrid !== false);
  const [showCentersGrid, setShowCentersGrid] = useState<boolean>(state.visibleBlocks?.centersGrid !== false);
  const [showDonationsList, setShowDonationsList] = useState<boolean>(state.visibleBlocks?.donationsList !== false);
  const [showNewsSection, setShowNewsSection] = useState<boolean>(state.visibleBlocks?.newsSection !== false);
  const [showFaqSection, setShowFaqSection] = useState<boolean>(state.visibleBlocks?.faqSection !== false);
  const [showSuggestionsSection, setShowSuggestionsSection] = useState<boolean>(state.visibleBlocks?.suggestionsSection !== false);

  // Campos de personalización de portada (100% Modificable)
  const [campaignTitleText, setCampaignTitleText] = useState<string>(state.campaignTitle || '');
  const [emergencySubtitleText, setEmergencySubtitleText] = useState<string>(state.emergencySubtitle || '');
  const [headerAlertTextState, setHeaderAlertTextState] = useState<string>(state.headerAlertText || '');
  const [heroBadgeTextState, setHeroBadgeTextState] = useState<string>(state.heroBadgeText || '');
  const [heroTitleRow1State, setHeroTitleRow1State] = useState<string>(state.heroTitleRow1 || '');
  const [heroTitleRow2State, setHeroTitleRow2State] = useState<string>(state.heroTitleRow2 || '');
  const [heroTitleRow3State, setHeroTitleRow3State] = useState<string>(state.heroTitleRow3 || '');

  // Video de fondo del encabezado
  const [headerVideoEnabledState, setHeaderVideoEnabledState] = useState<boolean>(state.headerVideoEnabled !== false);
  const [headerVideoYoutubeUrlState, setHeaderVideoYoutubeUrlState] = useState<string>(state.headerVideoYoutubeUrl || 'https://www.youtube.com/watch?v=kYv_I-g_M5w');

  // Video de introducción automático (Pop-up)
  const [introVideoEnabledState, setIntroVideoEnabledState] = useState<boolean>(state.introVideoEnabled !== false);
  const [introVideoYoutubeUrlState, setIntroVideoYoutubeUrlState] = useState<string>(state.introVideoYoutubeUrl || 'https://www.youtube.com/watch?v=kYv_I-g_M5w');
  const [introVideoBadgeTextState, setIntroVideoBadgeTextState] = useState<string>(state.introVideoBadgeText || 'Video de Presentación Oficial de la Campaña 🇻🇪');
  const [introVideoTitleState, setIntroVideoTitleState] = useState<string>(state.introVideoTitle || '¿Estás Listo para Solidarizarte?');
  const [introVideoSubtitleState, setIntroVideoSubtitleState] = useState<string>(state.introVideoSubtitle || 'Conoce más de nuestra iniciativa en marcha por 1 Tonelada.');
  const [introVideoBtnTextState, setIntroVideoBtnTextState] = useState<string>(state.introVideoBtnText || 'Ingresar a la Web de la Campaña ➔');

  const sheetIdFromUrl = state.googleSheetUrl ? (state.googleSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1] || '1PukE4Ns_98aDcHbsTth3Mx6_tJNQcFmC') : '1PukE4Ns_98aDcHbsTth3Mx6_tJNQcFmC';
  const appsScriptCode = `function doPost(e) {
  try {
    // Abre el Excel usando su ID específico
    var sheetId = "${sheetIdFromUrl}";
    var doc = SpreadsheetApp.openById(sheetId);
    var sheet = doc.getSheetByName("Donaciones") 
      || doc.getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    
    // Inserta una fila en el orden: Fecha, Donante, Email, Ciudad, Categoría, Kilos, Mensaje
    sheet.appendRow([
      data.date || new Date().toLocaleDateString(),
      data.donorName || "Anónimo",
      data.email || "",
      data.city || "",
      data.category || "",
      Number(data.pledgeKilos) || 0,
      data.description || data.message || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const [isContadorTabUnlocked, setIsContadorTabUnlocked] = useState(false);
  const [isConfigTabUnlocked, setIsConfigTabUnlocked] = useState(false);
  const [contadorPasswordAttempt, setContadorPasswordAttempt] = useState('');
  const [configPasswordAttempt, setConfigPasswordAttempt] = useState('');
  const [contadorError, setContadorError] = useState('');
  const [configError, setConfigError] = useState('');

  // Customizable live counter values states
  const [tempRedLabel, setTempRedLabel] = useState(state.liveCounterStateRedLabel || 'ROJO — DÉFICIT CRÍTICO INICIAL');
  const [tempOrangeLabel, setTempOrangeLabel] = useState(state.liveCounterStateOrangeLabel || 'NARANJA / AMARILLO — EN PROGRESO CONSTANTE');
  const [tempGreenLabel, setTempGreenLabel] = useState(state.liveCounterStateGreenLabel || 'VERDE — ¡META PRÓXIMA / ALCANZADA!');
  const [tempShowStateBadge, setTempShowStateBadge] = useState(state.liveCounterShowStateBadge !== false);
  const [tempLegend0, setTempLegend0] = useState(state.liveCounterLegend0 || '0% Rojo');
  const [tempLegend30, setTempLegend30] = useState(state.liveCounterLegend30 || '30% Naranja');
  const [tempLegend70, setTempLegend70] = useState(state.liveCounterLegend70 || '70% Amarillo');
  const [tempLegend100, setTempLegend100] = useState(state.liveCounterLegend100 || '100% Verde');
  const [tempShowLegends, setTempShowLegends] = useState(state.liveCounterShowLegends !== false);

  const [tempMaintenanceModeEnabled, setTempMaintenanceModeEnabled] = useState(state.maintenanceModeEnabled || false);
  const [tempMaintenanceReason, setTempMaintenanceReason] = useState(state.maintenanceReason || 'Actualización y optimización de base de datos relacional de acopio');
  const [tempMaintenanceEndTimestamp, setTempMaintenanceEndTimestamp] = useState(state.maintenanceEndTimestamp || '');

  React.useEffect(() => {
    if (state) {
      setTempRedLabel(state.liveCounterStateRedLabel !== undefined ? state.liveCounterStateRedLabel : 'ROJO — DÉFICIT CRÍTICO INICIAL');
      setTempOrangeLabel(state.liveCounterStateOrangeLabel !== undefined ? state.liveCounterStateOrangeLabel : 'NARANJA / AMARILLO — EN PROGRESO CONSTANTE');
      setTempGreenLabel(state.liveCounterStateGreenLabel !== undefined ? state.liveCounterStateGreenLabel : 'VERDE — ¡META PRÓXIMA / ALCANZADA!');
      setTempShowStateBadge(state.liveCounterShowStateBadge !== false);
      setTempLegend0(state.liveCounterLegend0 !== undefined ? state.liveCounterLegend0 : '0% Rojo');
      setTempLegend30(state.liveCounterLegend30 !== undefined ? state.liveCounterLegend30 : '30% Naranja');
      setTempLegend70(state.liveCounterLegend70 !== undefined ? state.liveCounterLegend70 : '70% Amarillo');
      setTempLegend100(state.liveCounterLegend100 !== undefined ? state.liveCounterLegend100 : '100% Verde');
      setTempShowLegends(state.liveCounterShowLegends !== false);
      
      setTempMaintenanceModeEnabled(state.maintenanceModeEnabled || false);
      setTempMaintenanceReason(state.maintenanceReason || 'Actualización y optimización de base de datos relacional de acopio');
      setTempMaintenanceEndTimestamp(state.maintenanceEndTimestamp || '');
    }
  }, [state]);

  const showToast = (txt: string) => {
    setMessage(txt);
    setTimeout(() => setMessage(null), 3500);
  };

  // --- GESTIÓN CENTROS DE ACOPIO ---
  const handleAddCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCenter.name || !newCenter.address) return;
    const urgentNeedsList = newUrgentNeedsStr
      ? newUrgentNeedsStr.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const item: CollectionCenter = {
      id: 'cent-' + Date.now(),
      city: newCenter.city || 'Madrid',
      country: newCenter.country || 'España',
      name: newCenter.name,
      address: newCenter.address,
      contact: newCenter.contact || '',
      hours: newCenter.hours || '',
      acceptedItems: newCenter.acceptedItems || ['Alimentos'],
      urgentNeeds: urgentNeedsList,
      mapsUrl: newCenter.mapsUrl || 'https://maps.google.com'
    };
    handleUpdateStateWithLog(
      { centers: [...state.centers, item] },
      `Añadió un nuevo centro de acopio en ${item.city}: "${item.name}"`
    );
    setNewCenter({ city: 'Madrid', country: 'España', name: '', address: '', contact: '', hours: '10:00 AM - 8:00 PM', acceptedItems: ['Alimentos no perecederos'], urgentNeeds: [] });
    setNewUrgentNeedsStr('');
    showToast(`✅ Centro "${item.name}" añadido correctamente.`);
  };

  const handleStartEditCenter = (center: CollectionCenter) => {
    setEditingCenterId(center.id);
    setEditCenterForm({ ...center });
    setEditUrgentNeedsStr(center.urgentNeeds ? center.urgentNeeds.join(', ') : '');
  };

  const handleSaveEditCenter = () => {
    if (!editingCenterId) return;
    const urgentNeedsList = editUrgentNeedsStr
      ? editUrgentNeedsStr.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const updated = state.centers.map(c => 
      c.id === editingCenterId 
        ? { ...c, ...editCenterForm, urgentNeeds: urgentNeedsList } as CollectionCenter 
        : c
    );
    const targetName = editCenterForm.name || editingCenterId;
    handleUpdateStateWithLog(
      { centers: updated },
      `Modificó los datos del centro de acopio en ${editCenterForm.city || ''}: "${targetName}"`
    );
    setEditingCenterId(null);
    setEditUrgentNeedsStr('');
    showToast('✅ Centro de acopio modificado con éxito.');
  };

  const handleDeleteCenter = (id: string) => {
    const deletedCenter = state.centers.find(c => c.id === id);
    const centerLabel = deletedCenter ? `"${deletedCenter.name}" (${deletedCenter.city})` : id;
    if (confirm('¿Está seguro de eliminar este centro de acopio?')) {
      handleUpdateStateWithLog(
        { centers: state.centers.filter(c => c.id !== id) },
        `Eliminó el centro de acopio: ${centerLabel}`
      );
      showToast('🗑️ Centro de acopio eliminado.');
    }
  };

  // --- GESTIÓN NOTICIAS ---
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.content) return;
    const item = {
      id: 'news-' + Date.now(),
      title: newNews.title,
      content: newNews.content,
      severity: newNews.severity,
      author: newNews.author,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    handleUpdateStateWithLog(
      { news: [item, ...(state.news || [])] },
      `Publicó un aviso de emergencia / noticia: "${item.title}"`
    );
    setNewNews({ title: '', content: '', severity: 'red', author: 'Coordinación Central ONG España' });
    showToast('✅ Noticia o alerta publicada exitosamente.');
  };

  const handleStartEditNews = (n: any) => {
    setEditingNewsId(n.id);
    setEditNewsForm({ ...n });
  };

  const handleSaveEditNews = () => {
    if (!editingNewsId) return;
    const updated = (state.news || []).map(n => n.id === editingNewsId ? { ...n, ...editNewsForm } : n);
    const titleLabel = editNewsForm.title || editingNewsId;
    handleUpdateStateWithLog(
      { news: updated },
      `Modificó la noticia o aviso de emergencia: "${titleLabel}"`
    );
    setEditingNewsId(null);
    showToast('✅ Noticia actualizada.');
  };

  const handleDeleteNews = (id: string) => {
    const deletedNews = (state.news || []).find(n => n.id === id);
    const newsTitle = deletedNews ? `"${deletedNews.title}"` : id;
    if (confirm('¿Desea borrar esta noticia?')) {
      handleUpdateStateWithLog(
        { news: (state.news || []).filter(n => n.id !== id) },
        `Eliminó la noticia / aviso: ${newsTitle}`
      );
      showToast('🗑️ Noticia eliminada.');
    }
  };

  // --- GESTIÓN FAQs ---
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;
    const item: FAQItem = {
      id: 'faq-' + Date.now(),
      category: newFaq.category || 'Donaciones',
      question: newFaq.question,
      answer: newFaq.answer
    };
    handleUpdateStateWithLog(
      { faqs: [...state.faqs, item] },
      `Añadió una pregunta frecuente: "${item.question}"`
    );
    setNewFaq({ category: 'Donaciones', question: '', answer: '' });
    showToast('✅ Pregunta frecuente creada con éxito.');
  };

  const handleStartEditFaq = (f: FAQItem) => {
    setEditingFaqId(f.id);
    setEditFaqForm({ ...f });
  };

  const handleSaveEditFaq = () => {
    if (!editingFaqId) return;
    const updated = state.faqs.map(f => f.id === editingFaqId ? { ...f, ...editFaqForm } as FAQItem : f);
    const questionLabel = editFaqForm.question || editingFaqId;
    handleUpdateStateWithLog(
      { faqs: updated },
      `Modificó la pregunta frecuente (FAQ): "${questionLabel}"`
    );
    setEditingFaqId(null);
    showToast('✅ FAQ actualizada.');
  };

  const handleDeleteFaq = (id: string) => {
    const deletedFaq = state.faqs.find(f => f.id === id);
    const questionLabel = deletedFaq ? `"${deletedFaq.question}"` : id;
    if (confirm('¿Desea eliminar esta pregunta frecuente?')) {
      handleUpdateStateWithLog(
        { faqs: state.faqs.filter(f => f.id !== id) },
        `Eliminó la pregunta frecuente (FAQ): ${questionLabel}`
      );
      showToast('🗑️ Pregunta frecuente borrada.');
    }
  };

  // --- GUARDAR CONFIGURACIÓN GENERAL ---
  const handleSaveConfig = () => {
    handleUpdateStateWithLog({
      globalTargetTons: Number(targetTons) || 1,
      googleSheetUrl: sheetUrl,
      googleSheetWebhookUrl: sheetWebhookUrl,
      autoSyncEnabled: autoSync,
      autoUpdateActive: autoUpdate,
      donationPassword: donationPass,
      visibleBlocks: {
        suppliesGrid: showSuppliesGrid,
        centersGrid: showCentersGrid,
        donationsList: showDonationsList,
        newsSection: showNewsSection,
        faqSection: showFaqSection,
        suggestionsSection: showSuggestionsSection
      }
    }, `Actualizó la configuración global, contraseña de donaciones y visibilidad de bloques de la web (Meta: ${targetTons}T)`);
    showToast('⚙️ Configuración y sincronización guardadas en el servidor.');
  };

  // --- GUARDAR PERSONALIZACIÓN DE PORTADA ---
  const handleSavePortada = () => {
    handleUpdateStateWithLog({
      campaignTitle: campaignTitleText,
      emergencySubtitle: emergencySubtitleText,
      headerAlertText: headerAlertTextState,
      heroBadgeText: heroBadgeTextState,
      heroTitleRow1: heroTitleRow1State,
      heroTitleRow2: heroTitleRow2State,
      heroTitleRow3: heroTitleRow3State,
      headerVideoEnabled: headerVideoEnabledState,
      headerVideoYoutubeUrl: headerVideoYoutubeUrlState
    }, `Personalizó y actualizó los títulos, avisos de la portada web y configuración de video de fondo`);
    showToast('✨ ¡Portada web personalizada y actualizada con éxito!');
  };

  // --- GESTIÓN DE PERFILES DE OPERARIOS ---
  const handleSelectActiveUser = (u: AdminUser) => {
    setActiveUser(u);
    localStorage.setItem('active_admin_user', JSON.stringify(u));
    showToast(`👤 Perfil operario cambiado a: ${u.name}`);
    setIsProfileModalOpen(false);
  };

  const handleAddUserProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const u: AdminUser = {
      id: 'usr-' + Date.now(),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      avatar: newUserAvatar,
      createdAt: new Date().toLocaleDateString('es-ES')
    };
    handleUpdateStateWithLog({
      adminUsers: [...(state.adminUsers || []), u]
    }, `Agregó un nuevo perfil de operario / administrador: "${u.name}" (${u.role})`);
    
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('Coordinador');
    setNewUserAvatar('👤');
    showToast(`👥 Perfil de ${u.name} creado.`);
  };

  const handleDeleteUserProfile = (userId: string) => {
    const targetUser = (state.adminUsers || []).find(u => u.id === userId);
    if (!targetUser) return;
    if (userId === 'usr-orlando') {
      alert('No es posible eliminar al Administrador Principal e Ingeniero del sistema.');
      return;
    }
    if (activeUser?.id === userId) {
      alert('No puede eliminar el perfil que está operando actualmente. Cambie de perfil primero.');
      return;
    }
    if (confirm(`¿Está seguro de eliminar el perfil de "${targetUser.name}"? Ya no podrá registrar operaciones bajo su nombre.`)) {
      handleUpdateStateWithLog({
        adminUsers: (state.adminUsers || []).filter(u => u.id !== userId)
      }, `Eliminó el perfil de operario / administrador: "${targetUser.name}"`);
      showToast(`🗑️ Perfil de ${targetUser.name} eliminado.`);
    }
  };

  // --- EXPORTAR E IMPORTAR CENTROS DE ACOPIO (EXCEL/CSV) ---
  const exportCentersToCSV = () => {
    const headers = [
      'ID',
      'Ciudad',
      'Almacén/Punto',
      'Dirección Completa',
      'Horario de Recepción',
      'Teléfono y Contacto',
      'Necesidades Críticas',
      'País',
      'Categorías Aceptadas',
      'Enlace de Google Maps'
    ];

    const escapeCSV = (str: string) => {
      if (str === null || str === undefined) return '';
      let value = String(str);
      if (value.includes('"') || value.includes(';') || value.includes('\n') || value.includes('\r')) {
        value = '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    };

    const rows = (state.centers || []).map(center => [
      center.id || '',
      center.city || '',
      center.name || '',
      center.address || '',
      center.hours || '',
      center.contact || '',
      center.urgentNeeds ? center.urgentNeeds.join(', ') : '',
      center.country || 'España',
      center.acceptedItems ? center.acceptedItems.join(', ') : 'Alimentos no perecederos',
      center.mapsUrl || ''
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(escapeCSV).join(';'))
    ].join('\r\n');

    // Excel UTF-8 BOM: \uFEFF para que se muestren bien las tildes y eñes
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    link.setAttribute('download', `respaldo_centros_acopio_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Respaldo de centros de acopio exportado con éxito.');
  };

  const parseCSV = (text: string): string[][] => {
    const result: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;
    
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      const nextChar = normalized[i + 1];
      
      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            cell += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cell += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ';') {
          row.push(cell);
          cell = '';
        } else if (char === '\n') {
          row.push(cell);
          result.push(row);
          row = [];
          cell = '';
        } else {
          cell += char;
        }
      }
    }
    if (cell !== '' || row.length > 0) {
      row.push(cell);
    }
    if (row.length > 0) {
      result.push(row);
    }
    
    return result;
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          alert('El archivo está vacío o no es legible.');
          return;
        }

        const rows = parseCSV(text);
        if (rows.length < 2) {
          alert('El archivo no contiene suficientes filas para importar.');
          return;
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const cityIdx = headers.indexOf('ciudad');
        const nameIdx = headers.indexOf('almacén/punto') !== -1 ? headers.indexOf('almacén/punto') : headers.indexOf('almacen/punto');
        const addressIdx = headers.indexOf('dirección completa') !== -1 ? headers.indexOf('dirección completa') : headers.indexOf('direccion completa');
        const hoursIdx = headers.indexOf('horario de recepción') !== -1 ? headers.indexOf('horario de recepción') : headers.indexOf('horario de recepcion');
        const contactIdx = headers.indexOf('teléfono y contacto') !== -1 ? headers.indexOf('teléfono y contacto') : headers.indexOf('telefono y contacto');
        const needsIdx = headers.indexOf('necesidades críticas') !== -1 ? headers.indexOf('necesidades críticas') : headers.indexOf('necesidades criticas');
        const idIdx = headers.indexOf('id');
        const countryIdx = headers.indexOf('país') !== -1 ? headers.indexOf('país') : headers.indexOf('pais');
        const categoriesIdx = headers.indexOf('categorías aceptadas') !== -1 ? headers.indexOf('categorías aceptadas') : headers.indexOf('categorias aceptadas');
        const mapsIdx = headers.indexOf('enlace de google maps') !== -1 ? headers.indexOf('enlace de google maps') : headers.indexOf('enlace de google maps');

        if (cityIdx === -1 || nameIdx === -1 || addressIdx === -1) {
          alert('Formato de archivo inválido. Asegúrese de que el archivo tenga las columnas: "Ciudad", "Almacén/Punto" y "Dirección Completa".');
          return;
        }

        const importedCenters: CollectionCenter[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length < 3) continue;

          const city = row[cityIdx]?.trim();
          const name = row[nameIdx]?.trim();
          const address = row[addressIdx]?.trim();

          if (!city && !name && !address) continue;

          if (!name || !address) {
            console.warn(`Fila ${i + 1} omitida por falta de Nombre o Dirección.`);
            continue;
          }

          const id = idIdx !== -1 && row[idIdx]?.trim() ? row[idIdx].trim() : 'cent-' + Date.now() + '-' + i;
          const hours = hoursIdx !== -1 ? row[hoursIdx]?.trim() : '';
          const contact = contactIdx !== -1 ? row[contactIdx]?.trim() : '';
          const needsStr = needsIdx !== -1 ? row[needsIdx]?.trim() : '';
          const country = countryIdx !== -1 ? row[countryIdx]?.trim() || 'España' : 'España';
          const categoriesStr = categoriesIdx !== -1 ? row[categoriesIdx]?.trim() : '';
          const mapsUrl = mapsIdx !== -1 ? row[mapsIdx]?.trim() || 'https://maps.google.com' : 'https://maps.google.com';

          const urgentNeeds = needsStr ? needsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
          const acceptedItems = categoriesStr ? categoriesStr.split(',').map(s => s.trim()).filter(Boolean) : ['Alimentos no perecederos'];

          importedCenters.push({
            id,
            city: city || 'Madrid',
            country,
            name,
            address,
            contact,
            hours,
            acceptedItems,
            urgentNeeds,
            mapsUrl
          });
        }

        if (importedCenters.length === 0) {
          alert('No se encontraron centros de acopio válidos para importar en el archivo.');
          return;
        }

        if (confirm(`Se han detectado ${importedCenters.length} centros de acopio en el archivo de respaldo.\n\n⚠️ ¡ATENCIÓN! Esto reemplazará todos los centros de acopio actuales en la web por los del archivo.\n\n¿Desea continuar con la restauración completa?`)) {
          handleUpdateStateWithLog(
            { centers: importedCenters },
            `Reimportó un total de ${importedCenters.length} centros de acopio desde un archivo de respaldo de Excel/CSV`
          );
          showToast(`✅ Sincronización exitosa: ${importedCenters.length} centros restaurados.`);
        }
      } catch (err: any) {
        alert('Error al leer o procesar el archivo de respaldo: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtrado de Pledges (Excel BD)
  const filteredPledges = (state.pledges || []).filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (p.donorName || '').toLowerCase().includes(q) ||
           (p.city || '').toLowerCase().includes(q) ||
           (p.category || '').toLowerCase().includes(q) ||
           (p.description || '').toLowerCase().includes(q);
  });

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 md:p-12 border-t-4 border-[#008CBA] select-none sm:select-auto">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Toast Notificación flotante */}
        {message && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-6 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-300 text-sm">
            <CheckCircle2 className="w-6 h-6" />
            <span>{message}</span>
          </div>
        )}

        {/* Top Encabezado Admin */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#008CBA] to-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20 shrink-0">
              <Database className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Modo Administrador</span>
                <span className="text-xl">🇻🇪 🇪🇸</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-white mt-1">
                PANEL DE CONTROL CENTRAL — AYUDA EMERGENCIA VENEZUELA
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">
                Base de datos de mercancía conectada a Excel • Control de almacenes en España • Edición completa de web
              </p>

              {/* Profile display & switch widget */}
              <div className="mt-4 flex flex-wrap items-center gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 max-w-lg shadow-inner">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block shrink-0">Operando Bajo Perfil:</span>
                {activeUser ? (
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0">{activeUser.avatar || '👤'}</span>
                    <div>
                      <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                        <span>{activeUser.name}</span>
                        {activeUser.id === 'usr-orlando' && <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 text-[8px] font-black uppercase rounded tracking-wider border border-amber-500/20">Ingeniero</span>}
                      </div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{activeUser.role} • {activeUser.email}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-red-400 font-black">Sin perfil activo</span>
                )}
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="ml-auto px-3.5 py-1.5 bg-[#008CBA] hover:bg-[#007399] text-white text-[10px] font-black uppercase rounded-lg transition transform active:scale-95 cursor-pointer shadow-md"
                >
                  Cambiar Perfil
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onTriggerSync(true)}
              disabled={syncing}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Sincronizando Excel...' : 'Sincronizar Drive Sheet'}</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="px-6 py-3 bg-slate-800 hover:bg-red-600 text-slate-200 hover:text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span>Salir al Sitio Web</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900 rounded-2xl border border-slate-800 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('excel_bd')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'excel_bd' 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5 text-amber-300" />
            <span>📦 Base de Datos Excel ({state.pledges?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('centros')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'centros' 
                ? 'bg-[#008CBA] text-white shadow-xl shadow-blue-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>🏢 AGREGAR Centro de Acopio ({state.centers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categorias_donacion')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'categorias_donacion' 
                ? 'bg-rose-700 text-white shadow-xl shadow-rose-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>🏷️ Modificar Categorías ({ (state.donationCategories || []).length })</span>
          </button>

          <button
            onClick={() => setActiveTab('noticias')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'noticias' 
                ? 'bg-amber-600 text-white shadow-xl' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Newspaper className="w-5 h-5" />
            <span>📰 Actualizar Noticias ({state.news?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'faqs' 
                ? 'bg-purple-600 text-white shadow-xl' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>❓ Editar Preguntas FAQ ({state.faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sugerencias')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 relative ${
              activeTab === 'sugerencias' 
                ? 'bg-red-600 text-white shadow-xl' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lightbulb className="w-5 h-5 text-yellow-300" />
            <span>💡 Sugerencias y Propuestas</span>
            {state.suggestions && state.suggestions.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 bg-yellow-400 text-slate-950 font-black rounded-full text-[11px]">
                {state.suggestions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('portada')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ml-auto ${
              activeTab === 'portada' 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Edit3 className="w-5 h-5 text-amber-300" />
            <span>✏️ Personalizar Portada (100% Modificable)</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'config' 
                ? 'bg-slate-700 text-white shadow-xl' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>⚙️ Configuración Sincronización</span>
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'usuarios' 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-5 h-5 text-emerald-400" />
            <span>👥 Control de Usuarios ({state.adminUsers?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('cambios_web')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'cambios_web' 
                ? 'bg-rose-600 text-white shadow-xl' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <History className="w-5 h-5 text-yellow-300" />
            <span>📜 Histórico de Cambios Web ({state.userChangeLogs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('accesos_web')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'accesos_web' 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span>🌐 Historial de Acceso a la Web ({state.webAccessLogs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('contador_vivo')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'contador_vivo' 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Scale className="w-5 h-5 text-emerald-400 animate-bounce" />
            <span>📊 Contador en vivo ({state.globalTargetTons}T)</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'videos' 
                ? 'bg-violet-600 text-white shadow-xl shadow-violet-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-5 h-5 text-violet-400" />
            <span>🎥 Categoría de Videos</span>
          </button>

          <button
            onClick={() => setActiveTab('mantenimiento')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'mantenimiento' 
                ? 'bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-5 h-5 text-amber-400" />
            <span>🛠️ Modo Mantenimiento</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('saludar_sistema');
              handleFetchForensic();
            }}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer shrink-0 ${
              activeTab === 'saludar_sistema' 
                ? 'bg-amber-600 text-white shadow-xl shadow-amber-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-5 h-5 text-amber-400" />
            <span>💻 Saluda al sistema</span>
          </button>
        </div>

        {/* --- CONTENIDO PESTAÑA 1: BASE DE DATOS EXCEL (REGISTROS DONACIONES) --- */}
        {activeTab === 'excel_bd' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-full">Base de Datos Maestra Activa</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3">
                  📦 REGISTRO DE DONACIONES E INVENTARIO DE MERCANCÍA
                </h2>
                <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
                  Cada vez que un usuario o almacén completa el formulario web de <b>Registrar Donación / Mercancía</b>, los datos se guardan instantáneamente en esta base de datos y se añaden a la suma global hacia la meta de 1 Tonelada.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <a
                  href="/api/export-excel"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition transform active:scale-95 text-sm"
                >
                  <Download className="w-6 h-6" />
                  <span>Descargar Base de Datos (.CSV Excel)</span>
                </a>

                {state.googleSheetUrl && (
                  <a
                    href={state.googleSheetUrl.replace('/export?format=csv', '/edit')}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold uppercase tracking-wider rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition text-xs"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span>Abrir Google Drive Excel</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    setClearError(null);
                    setClearSuccess(null);
                    setClearPassword('');
                    setIsClearModalOpen(true);
                  }}
                  className="px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition text-xs shadow-lg shadow-rose-600/20 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-white animate-bounce" />
                  <span>Borrar Todo (Prod)</span>
                </button>
              </div>
            </div>

            {/* Barra de búsqueda de la tabla */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-96">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar donante, ciudad, categoría..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div className="text-xs font-bold text-slate-400 font-mono">
                TOTAL REGISTRADO EN MEMORIA/EXCEL: {state.pledges?.length || 0} ENTRADAS
              </div>
            </div>

            {/* Tabla Completa */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 text-xs font-black uppercase tracking-wider border-b border-slate-700">
                      <th className="py-4 px-6">Fecha / Hora</th>
                      <th className="py-4 px-6">Donante / Responsable</th>
                      <th className="py-4 px-6">Ciudad (Almacén)</th>
                      <th className="py-4 px-6">Categoría Insumo</th>
                      <th className="py-4 px-6 text-right">Kilos Ingresados</th>
                      <th className="py-4 px-6">Descripción / Comentarios</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm font-medium">
                    {filteredPledges.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 font-bold">
                          No se encontraron donaciones registradas en la base de datos que coincidan con la búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredPledges.map((p, idx) => (
                        <tr key={p.id || idx} className="hover:bg-slate-800/50 transition">
                          <td className="py-4 px-6 font-mono text-xs text-slate-400 whitespace-nowrap">{p.date || 'Hoy'}</td>
                          <td className="py-4 px-6 font-bold text-white">
                            {p.donorName}
                            {p.email && <div className="text-xs text-slate-500 font-normal">{p.email}</div>}
                          </td>
                          <td className="py-4 px-6 text-emerald-400 font-bold">🇪🇸 {p.city || 'Madrid'}</td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-200">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-black text-amber-400 font-mono text-base">
                            +{p.pledgeKilos} kg
                          </td>
                          <td className="py-4 px-6 text-slate-300 max-w-xs truncate" title={p.description || p.message}>
                            {p.description || p.message || '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA 2: CENTROS DE ACOPIO PARA LLEVAR LA COMIDA --- */}
        {activeTab === 'centros' && (
          <div className="space-y-8">
            {/* Copia de Seguridad y Respaldo de Centros */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-black uppercase text-amber-500 flex items-center gap-2 tracking-wider">
                  <Database className="w-6 h-6 text-amber-400 animate-pulse" />
                  <span>Respaldo y Restauración de Centros de Acopio</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Descarga una copia de seguridad local de todos los centros de acopio actuales en formato Excel compatible (.csv). 
                  Si ocurre algún fallo en el servidor o base de datos, puedes volver a subir el archivo para restaurar la lista completa con total integridad.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3.5 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={exportCentersToCSV}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black uppercase text-xs tracking-wider rounded-xl shadow-lg hover:shadow-emerald-950/20 transition duration-200 cursor-pointer flex items-center justify-center gap-2 border border-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar centros de acopio</span>
                </button>

                <label className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black uppercase text-xs tracking-wider rounded-xl shadow-lg hover:shadow-amber-950/20 transition duration-200 cursor-pointer flex items-center justify-center gap-2 border border-amber-500/20">
                  <Upload className="w-4 h-4" />
                  <span>Reimportar Copia Excel</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleImportCSV}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Formulario Agregar Centro */}
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-xl font-black uppercase text-[#008CBA] mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                <span>Añadir Nuevo Centro de Acopio para Llevar la Comida (España)</span>
              </h3>

              <form onSubmit={handleAddCenter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 block mb-1">Ciudad (España)</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Madrid, Sevilla, Málaga..."
                    value={newCenter.city}
                    onChange={e => setNewCenter({ ...newCenter, city: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-[#008CBA] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black uppercase text-slate-400 block mb-1">Nombre Oficial del Almacén / Punto</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Almacén Humanitario Central Sede Sur"
                    value={newCenter.name}
                    onChange={e => setNewCenter({ ...newCenter, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-[#008CBA] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black uppercase text-slate-400 block mb-1">Dirección Completa con Código Postal</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Calle Gran Vía 45, Planta Baja, 28013 Madrid"
                    value={newCenter.address}
                    onChange={e => setNewCenter({ ...newCenter, address: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-[#008CBA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-400 block mb-1">Teléfono y Contacto</label>
                  <input
                    type="text"
                    placeholder="ej. +34 910 112 233 / info@ong.org"
                    value={newCenter.contact}
                    onChange={e => setNewCenter({ ...newCenter, contact: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-[#008CBA] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black uppercase text-slate-400 block mb-1">Horario de Recepción</label>
                  <input
                    type="text"
                    placeholder="ej. Lunes a Sábado: 10:00 AM - 8:30 PM (Recepción continua)"
                    value={newCenter.hours}
                    onChange={e => setNewCenter({ ...newCenter, hours: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-[#008CBA] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs font-black uppercase text-amber-400 block mb-1">🚨 Necesidades Críticas Específicas (Separadas por comas)</label>
                  <input
                    type="text"
                    placeholder="ej. Leche infantil, Pastillas potabilizadoras"
                    value={newUrgentNeedsStr}
                    onChange={e => setNewUrgentNeedsStr(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-amber-500/30 rounded-xl text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Escribe las necesidades específicas separadas por comas (ej: Leche infantil, Pastillas potabilizadoras). Aparecerán en rojo y alertarán a los donantes.
                  </span>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#008CBA] hover:bg-blue-600 text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
                  >
                    + Registrar Centro Acopio
                  </button>
                </div>
              </form>
            </div>

            {/* Lista de Centros para Editar y Borrar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.centers.map(center => (
                <div key={center.id} className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 relative flex flex-col justify-between">
                  {editingCenterId === center.id ? (
                    /* MODO EDICIÓN EN LÍNEA */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-amber-400 font-black text-xs uppercase tracking-widest">✏️ Modificando Centro</span>
                        <button onClick={() => setEditingCenterId(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Ciudad:</label>
                        <input
                          type="text"
                          value={editCenterForm.city || ''}
                          onChange={e => setEditCenterForm({ ...editCenterForm, city: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre Almacén:</label>
                        <input
                          type="text"
                          value={editCenterForm.name || ''}
                          onChange={e => setEditCenterForm({ ...editCenterForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Dirección:</label>
                        <input
                          type="text"
                          value={editCenterForm.address || ''}
                          onChange={e => setEditCenterForm({ ...editCenterForm, address: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Teléfono/Contacto:</label>
                          <input
                            type="text"
                            value={editCenterForm.contact || ''}
                            onChange={e => setEditCenterForm({ ...editCenterForm, contact: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Horario:</label>
                          <input
                            type="text"
                            value={editCenterForm.hours || ''}
                            onChange={e => setEditCenterForm({ ...editCenterForm, hours: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                          🚨 Necesidades Críticas (Separadas por comas):
                        </label>
                        <input
                          type="text"
                          value={editUrgentNeedsStr}
                          onChange={e => setEditUrgentNeedsStr(e.target.value)}
                          placeholder="ej. Leche infantil, Pastillas potabilizadoras"
                          className="w-full px-3 py-2 bg-slate-950 border border-amber-500/30 focus:border-amber-400 rounded text-xs text-white"
                        />
                      </div>

                      <button
                        onClick={handleSaveEditCenter}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs rounded-xl shadow cursor-pointer mt-4"
                      >
                        💾 Guardar Modificaciones
                      </button>
                    </div>
                  ) : (
                    /* MODO VISTA NORMAL TARJETA */
                    <>
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-black uppercase tracking-wider">
                            🇪🇸 {center.city}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditCenter(center)}
                              title="Modificar / Editar Centro"
                              className="p-2 bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteCenter(center.id)}
                              title="Borrar Centro"
                              className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-xl font-bold text-white mb-3 leading-snug">
                          {center.name}
                        </h4>

                        <div className="space-y-2 text-xs text-slate-400">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                            <span>{center.address}</span>
                          </div>
                          {center.contact && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                              <span>{center.contact}</span>
                            </div>
                          )}
                          {center.hours && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                              <span>{center.hours}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {center.urgentNeeds && center.urgentNeeds.length > 0 && (
                        <div className="mt-3 p-2.5 bg-red-950/40 border border-red-900/50 rounded-xl">
                          <span className="text-[10px] font-black uppercase text-red-400 tracking-wider block mb-1">
                            🚨 Necesidades Críticas Específicas:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {center.urgentNeeds.map((need, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-red-900/30 text-red-200 border border-red-900/50 rounded text-[10px] font-bold">
                                {need}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-1.5">
                        {center.acceptedItems.map((it, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[11px] font-bold">
                            📦 {it}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA: MODIFICAR CATEGORÍAS (DINÁMICAS) --- */}
        {activeTab === 'categorias_donacion' && (
          <div className="space-y-8 animate-fade-in">
            {/* Cabecera explicativa */}
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black uppercase text-rose-400 flex items-center gap-2.5">
                    <Package className="w-6 h-6 text-rose-500 animate-pulse" />
                    <span>Gestor de Categorías de Donación</span>
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Agregue, edite o elimine las categorías que los donantes ven al registrar un aporte en el formulario de la web.
                  </p>
                </div>
                <div className="px-3.5 py-1.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-[11px] font-bold text-rose-400 uppercase tracking-wider self-start sm:self-auto">
                  ⚡ Cambios en Tiempo Real
                </div>
              </div>
            </div>

            {/* Dos columnas: Añadir nueva y Listado existente */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Formulario de Agregar */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <h4 className="text-sm font-black uppercase text-slate-200 tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#008CBA]" />
                    Crear Nueva Categoría
                  </h4>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Nombre de la Categoría *</label>
                    <input
                      type="text"
                      placeholder="Ej. Artículos de Higiene, Linternas..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-rose-500 transition placeholder:text-slate-600"
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                      💡 El nombre debe ser descriptivo. Se agregará inmediatamente como una opción seleccionable por los donantes.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const trimmed = newCategoryName.trim();
                      if (!trimmed) {
                        setMessage("⚠️ El nombre de la categoría no puede estar vacío.");
                        setTimeout(() => setMessage(null), 3000);
                        return;
                      }
                      const currentCategories = state.donationCategories || [
                        "Alimentos no perecederos",
                        "Ropa y Abrigo",
                        "Baterías y Pilas",
                        "Medicinas e Insumos Médicos",
                        "Agua Potable Embotellada",
                        "Kits Infantiles y Fórmulas"
                      ];
                      if (currentCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
                        setMessage("⚠️ Esta categoría ya existe en el sistema.");
                        setTimeout(() => setMessage(null), 3000);
                        return;
                      }

                      const updated = [...currentCategories, trimmed];
                      handleUpdateStateWithLog({ donationCategories: updated }, `Agregó la categoría de donación "${trimmed}"`);
                      setNewCategoryName('');
                      setMessage("✅ Categoría agregada con éxito.");
                      setTimeout(() => setMessage(null), 3000);
                    }}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Categoría</span>
                  </button>
                </div>
              </div>

              {/* Listado de Categorías */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase text-slate-200 tracking-wider">
                      Categorías Registradas ({ (state.donationCategories || []).length })
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium font-mono">Fila editable</span>
                  </div>

                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                    { (state.donationCategories || [
                      "Alimentos no perecederos",
                      "Ropa y Abrigo",
                      "Baterías y Pilas",
                      "Medicinas e Insumos Médicos",
                      "Agua Potable Embotellada",
                      "Kits Infantiles y Fórmulas"
                    ]).map((category, index) => {
                      const isEditing = editingCategoryIndex === index;
                      const isConfirmingDelete = deletingCategoryIndex === index;

                      return (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 bg-slate-950/20 hover:bg-slate-950/60 transition">
                          <div className="flex-1">
                            {isEditing ? (
                              <div className="flex items-center gap-2 w-full">
                                <input
                                  type="text"
                                  value={editingCategoryName}
                                  onChange={(e) => setEditingCategoryName(e.target.value)}
                                  className="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                                />
                                <button
                                  onClick={() => {
                                    const trimmed = editingCategoryName.trim();
                                    if (!trimmed) {
                                      setMessage("⚠️ El nombre no puede estar vacío.");
                                      setTimeout(() => setMessage(null), 3000);
                                      return;
                                    }
                                    const currentCategories = [...(state.donationCategories || [
                                      "Alimentos no perecederos",
                                      "Ropa y Abrigo",
                                      "Baterías y Pilas",
                                      "Medicinas e Insumos Médicos",
                                      "Agua Potable Embotellada",
                                      "Kits Infantiles y Fórmulas"
                                    ])];
                                    const oldVal = currentCategories[index];
                                    currentCategories[index] = trimmed;

                                    handleUpdateStateWithLog({ donationCategories: currentCategories }, `Editó la categoría "${oldVal}" a "${trimmed}"`);
                                    setEditingCategoryIndex(null);
                                    setEditingCategoryName('');
                                    setMessage("✅ Categoría actualizada con éxito.");
                                    setTimeout(() => setMessage(null), 3000);
                                  }}
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
                                  title="Guardar"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCategoryIndex(null);
                                    setEditingCategoryName('');
                                  }}
                                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition cursor-pointer"
                                  title="Cancelar"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs sm:text-sm font-black text-slate-100 flex items-center gap-2">
                                <span className="text-rose-400 font-mono">#{index + 1}</span>
                                {category}
                              </span>
                            )}
                          </div>

                          {/* Acciones */}
                          {!isEditing && (
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              {isConfirmingDelete ? (
                                <div className="flex items-center gap-1.5 bg-rose-950/60 p-1 rounded-lg border border-rose-500/30">
                                  <span className="text-[10px] text-rose-400 font-black uppercase px-1.5">¿Seguro?</span>
                                  <button
                                    onClick={() => {
                                      const currentCategories = (state.donationCategories || [
                                        "Alimentos no perecederos",
                                        "Ropa y Abrigo",
                                        "Baterías y Pilas",
                                        "Medicinas e Insumos Médicos",
                                        "Agua Potable Embotellada",
                                        "Kits Infantiles y Fórmulas"
                                      ]).filter((_, i) => i !== index);

                                      handleUpdateStateWithLog({ donationCategories: currentCategories }, `Eliminó la categoría de donación "${category}"`);
                                      setDeletingCategoryIndex(null);
                                      setMessage("✅ Categoría eliminada.");
                                      setTimeout(() => setMessage(null), 3000);
                                    }}
                                    className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded uppercase transition cursor-pointer"
                                  >
                                    Sí
                                  </button>
                                  <button
                                    onClick={() => setDeletingCategoryIndex(null)}
                                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold rounded uppercase transition cursor-pointer"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingCategoryIndex(index);
                                      setEditingCategoryName(category);
                                      setDeletingCategoryIndex(null);
                                    }}
                                    className="p-2 bg-blue-600/30 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl transition cursor-pointer"
                                    title="Editar categoría"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeletingCategoryIndex(index);
                                      setEditingCategoryIndex(null);
                                    }}
                                    className="p-2 bg-rose-600/30 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl transition cursor-pointer"
                                    title="Eliminar categoría"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA 3: ACTUALIZAR NOTICIAS --- */}
        {activeTab === 'noticias' && (
          <div className="space-y-8">
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-xl font-black uppercase text-amber-400 mb-6 flex items-center gap-2">
                <Newspaper className="w-6 h-6" />
                <span>Publicar o Modificar Alerta / Noticia</span>
              </h3>

              <form onSubmit={handleAddNews} className="space-y-4 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="text-xs font-black uppercase text-slate-400 block mb-1">Titular de la Noticia</label>
                    <input
                      type="text"
                      required
                      placeholder="ej. 🔴 Arribo del primer avión carguero a Mérida"
                      value={newNews.title}
                      onChange={e => setNewNews({ ...newNews, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 block mb-1">Color / Severidad</label>
                    <select
                      value={newNews.severity}
                      onChange={e => setNewNews({ ...newNews, severity: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white cursor-pointer"
                    >
                      <option value="red">🔴 Rojo (Urgente)</option>
                      <option value="orange">🟠 Naranja (Importante)</option>
                      <option value="green">🟢 Verde (Informativo)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-400 block mb-1">Contenido / Descripción</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Detalles del envío de comida o actualización del terremoto en Venezuela..."
                    value={newNews.content}
                    onChange={e => setNewNews({ ...newNews, content: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-wider rounded-xl shadow transition cursor-pointer"
                >
                  📰 Publicar Noticia Oficial
                </button>
              </form>
            </div>

            {/* Lista de Noticias Publicadas */}
            <div className="space-y-4">
              {(state.news || []).map(n => (
                <div key={n.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {editingNewsId === n.id ? (
                    <div className="w-full space-y-3">
                      <div className="flex justify-between items-center"><b className="text-amber-400 text-xs">Modificando Noticia:</b></div>
                      <input type="text" value={editNewsForm.title || ''} onChange={e => setEditNewsForm({ ...editNewsForm, title: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-sm text-white font-bold"/>
                      <textarea rows={2} value={editNewsForm.content || ''} onChange={e => setEditNewsForm({ ...editNewsForm, content: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-sm text-white"></textarea>
                      <button onClick={handleSaveEditNews} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer">Guardar Noticia</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-4">
                        <span className="text-2xl">
                          {n.severity === 'red' ? '🔴' : n.severity === 'orange' ? '🟠' : '🟢'}
                        </span>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-mono">{n.date}</span>
                            <span className="text-xs font-bold text-slate-400">por {n.author}</span>
                          </div>
                          <h4 className="text-lg font-bold text-white mt-1">{n.title}</h4>
                          <p className="text-slate-300 text-sm mt-1">{n.content}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleStartEditNews(n)} className="p-2.5 bg-slate-800 hover:bg-amber-600 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"><Edit3 className="w-4 h-4"/></button>
                        <button onClick={() => handleDeleteNews(n.id)} className="p-2.5 bg-slate-800 hover:bg-red-600 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA 4: PREGUNTAS Y RESPUESTAS (FAQ) --- */}
        {activeTab === 'faqs' && (
          <div className="space-y-8">
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-xl font-black uppercase text-purple-400 mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6" />
                <span>Añadir o Editar Preguntas y Respuestas (FAQ)</span>
              </h3>

              <form onSubmit={handleAddFaq} className="space-y-4 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 block mb-1">Categoría</label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Donaciones, Logística..."
                      value={newFaq.category}
                      onChange={e => setNewFaq({ ...newFaq, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-black uppercase text-slate-400 block mb-1">Pregunta del Usuario</label>
                    <input
                      type="text"
                      required
                      placeholder="ej. ¿Aceptan ropa usada para bebés?"
                      value={newFaq.question}
                      onChange={e => setNewFaq({ ...newFaq, question: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-400 block mb-1">Respuesta Oficial de la ONG</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escriba la respuesta clara que verá el público en la sección FAQ..."
                    value={newFaq.answer}
                    onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-wider rounded-xl shadow transition cursor-pointer"
                >
                  + Guardar Pregunta FAQ
                </button>
              </form>
            </div>

            {/* Lista de FAQs para Editar / Borrar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.faqs.map(faq => (
                <div key={faq.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
                  {editingFaqId === faq.id ? (
                    <div className="space-y-3">
                      <span className="text-purple-400 font-bold text-xs">✏️ Modificando FAQ:</span>
                      <input type="text" value={editFaqForm.category || ''} onChange={e => setEditFaqForm({ ...editFaqForm, category: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-xs text-white"/>
                      <input type="text" value={editFaqForm.question || ''} onChange={e => setEditFaqForm({ ...editFaqForm, question: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-sm text-white font-bold"/>
                      <textarea rows={3} value={editFaqForm.answer || ''} onChange={e => setEditFaqForm({ ...editFaqForm, answer: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-sm text-white"></textarea>
                      <button onClick={handleSaveEditFaq} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer">💾 Guardar FAQ</button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-black uppercase tracking-widest text-[10px] rounded-full">
                            {faq.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleStartEditFaq(faq)} className="p-2 bg-slate-800 hover:bg-amber-600 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"><Edit3 className="w-3.5 h-3.5"/></button>
                            <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 bg-slate-800 hover:bg-red-600 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>
                        <h4 className="text-base font-bold text-white mb-2">{faq.question}</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">{faq.answer}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA 5: SUGERENCIAS Y PROPUESTAS EN PANTALLA COMPLETA --- */}
        {activeTab === 'sugerencias' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-red-500/40 shadow-2xl">
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-full">Buzón Abierto ONG</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3">
                💡 PROPUESTAS Y SUGERENCIAS ENVIADAS POR LA COMUNIDAD
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl">
                Lista completa de todas las iniciativas, aportes de transporte y mejoras sugeridas por la diáspora o donantes desde la sección web de <b>Enviar Propuesta o Sugerencia</b>.
              </p>
            </div>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-300 text-xs font-black uppercase tracking-wider border-b border-slate-700">
                      <th className="py-4 px-6">Fecha</th>
                      <th className="py-4 px-6">Remitente</th>
                      <th className="py-4 px-6">Correo Electrónico</th>
                      <th className="py-4 px-6">Categoría Propuesta</th>
                      <th className="py-4 px-6">Mensaje / Detalle de la Sugerencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm font-medium">
                    {!state.suggestions || state.suggestions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500 font-bold">
                          Aún no se han recibido propuestas nuevas en el servidor.
                        </td>
                      </tr>
                    ) : (
                      state.suggestions.map((s, idx) => (
                        <tr key={s.id || idx} className="hover:bg-slate-800/50 transition">
                          <td className="py-4 px-6 font-mono text-xs text-slate-400 whitespace-nowrap">{s.date || 'Reciente'}</td>
                          <td className="py-4 px-6 font-bold text-white whitespace-nowrap">{s.userName}</td>
                          <td className="py-4 px-6 text-blue-400 text-xs font-mono">{s.email || '—'}</td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
                              {s.type}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-200 leading-relaxed max-w-xl">
                            {s.message}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA 6: CONFIGURACIÓN GENERAL GOOGLE SHEET / EXCEL --- */}
        {activeTab === 'config' && (
          !isConfigTabUnlocked ? (
            <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6 my-12 font-sans">
              <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-700 shadow-lg">
                <Lock className="w-8 h-8 text-amber-500 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase text-white">⚙️ Acceso Restringido</h3>
                <p className="text-xs text-slate-400">Configuración del Servidor y Base de Datos</p>
                <p className="text-[11px] text-slate-500">Esta sección requiere autenticación por motivos de seguridad.</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (configPasswordAttempt === 'Isabella2015$') {
                  setIsConfigTabUnlocked(true);
                  setConfigError('');
                } else {
                  setConfigError('❌ Clave incorrecta. Inténtelo de nuevo.');
                }
              }} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Clave del Servidor</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={configPasswordAttempt}
                    onChange={(e) => setConfigPasswordAttempt(e.target.value)}
                    className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 font-mono text-center tracking-widest text-center"
                  />
                </div>
                {configError && <p className="text-rose-500 text-xs font-bold text-center">{configError}</p>}
                <button
                  type="submit"
                  className="w-full py-3 bg-slate-850 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-widest transition cursor-pointer border border-slate-700/50"
                >
                  Desbloquear Sección
                </button>
              </form>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl">
            <div>
              <h3 className="text-2xl font-black uppercase text-white">⚙️ Configuración del Servidor y Base de Datos</h3>
              <p className="text-slate-400 text-sm mt-1">Sincronización horaria con hoja de cálculo externa de Google Drive Excel.</p>
              
              <div className="mt-4 p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-2xl flex items-center gap-2.5 shadow-lg animate-pulse">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shrink-0"></span>
                <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                  ⚠️ "These data cannot be modified, only Orlando."
                </span>
              </div>
            </div>

            {/* Supabase Global Persistence Status */}
            {!state.supabaseActive ? (
              <div className="p-5 bg-amber-950/30 border border-amber-500/30 rounded-2xl flex items-start gap-4 shadow-lg">
                <div className="p-3 bg-amber-900/30 rounded-xl text-amber-500 shrink-0">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">Base de Datos en Modo Local</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    La aplicación funciona temporalmente en memoria del servidor. Para activar la persistencia global persistente en Supabase (y evitar que los datos se pierdan al reiniciar o varíen entre dispositivos), configure las variables de entorno en su servidor:
                  </p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1">
                    <div><b>SUPABASE_URL</b> = <span className="text-slate-300">https://your-project.supabase.co</span></div>
                    <div><b>SUPABASE_KEY</b> = <span className="text-slate-300">su_clave_secreta_api</span></div>
                  </div>
                </div>
              </div>
            ) : state.supabaseTableMissing ? (
              <div className="p-5 bg-rose-950/30 border border-rose-500/30 rounded-2xl flex flex-col gap-4 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-900/40 rounded-xl text-rose-400 shrink-0">
                    <AlertOctagon className="w-6 h-6 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-wider text-rose-400">⚠️ TABLA 'website_state' NO ENCONTRADA EN SUPABASE</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      ¡Tu cliente de Supabase se ha inicializado en Vercel, pero no se encuentra la tabla <code className="bg-slate-800 px-1 py-0.5 rounded text-rose-300 font-mono">website_state</code> en tu base de datos!
                    </p>
                    <p className="text-[11px] text-rose-300 leading-relaxed font-bold mt-1">
                      Debido a esto, los datos del Excel no se pueden guardar en la nube y se perderán cuando la función de Vercel se apague.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">¿Cómo solucionarlo en 1 minuto?</div>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <li>Abre tu panel de control de <b>Supabase</b>.</li>
                    <li>Haz clic en <b>SQL Editor</b> (icono de terminal en la barra lateral izquierda).</li>
                    <li>Haz clic en <b>"New query"</b> (Nueva consulta).</li>
                    <li>Pega la siguiente consulta SQL y haz clic en el botón <b>"Run"</b> (Ejecutar):</li>
                  </ol>

                  <div className="relative group">
                    <pre className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto select-all leading-relaxed whitespace-pre">
{`CREATE TABLE IF NOT EXISTS website_state (
  id BIGINT PRIMARY KEY,
  state JSONB NOT NULL
);

-- DESACTIVAR RLS PARA EVITAR ERRORES DE PERMISOS CON LA CLAVE PUBLIC/ANON
ALTER TABLE website_state DISABLE ROW LEVEL SECURITY;

INSERT INTO website_state (id, state)
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;`}
                    </pre>
                    <div className="text-[9px] text-slate-500 text-right mt-1">
                      Haz doble clic o arrastra para copiar todo el bloque de código SQL
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start gap-4 shadow-lg">
                <div className="p-3 bg-emerald-900/40 rounded-xl text-emerald-400 shrink-0">
                  <Database className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400">Base de Datos Supabase Conectada</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ¡La Sincronización en la nube está activa! Todos los textos de la portada, la información general, las noticias, el inventario y las FAQs se almacenan y replican globalmente en tiempo real para todos los visitantes del mundo.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase text-amber-400 block mb-2">
                  Meta Global en Toneladas (Actual: {state.globalTargetTons} T = {state.globalTargetTons * 1000} kg)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  step={0.5}
                  value={targetTons}
                  onChange={e => setTargetTons(parseFloat(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-black text-white focus:border-[#008CBA] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-amber-500 block mb-2">
                  🔐 Contraseña de Seguridad para Registro de Donaciones (Público)
                </label>
                <input
                  type="text"
                  placeholder="Ej. VENEZUELAVIVE2026"
                  value={donationPass}
                  onChange={e => setDonationPass(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-[#008CBA] focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  💡 Esta contraseña es la requerida para que los donantes y voluntarios registren donaciones de mercancía en el formulario de la web.
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-blue-400 block mb-2">
                  1. URL de Google Sheet / CSV Excel de Lectura Continua (BD Principal)
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={sheetUrl}
                  onChange={e => setSheetUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:border-[#008CBA] focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  💡 <b>Tip de Permisos:</b> El Excel debe estar compartido como <b>"Cualquier persona con el enlace puede ver"</b> para permitir que la web lea las donaciones y actualice los contadores automáticamente.
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-[#008CBA] block mb-2">
                  2. Webhook de Google Apps Script (Para Escritura Directa en tiempo real)
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={sheetWebhookUrl}
                  onChange={e => setSheetWebhookUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:border-[#008CBA] focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  🚀 Al configurar esta URL, cada donación nueva que se registre en el formulario de la web se agregará instantáneamente como una fila en su Excel de Google Drive.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="autosync_chk"
                  checked={autoSync}
                  onChange={e => setAutoSync(e.target.checked)}
                  className="w-5 h-5 accent-[#008CBA] rounded cursor-pointer"
                />
                <label htmlFor="autosync_chk" className="text-sm font-bold text-slate-200 cursor-pointer">
                  Activar consulta automática al Excel cada 10 minutos en segundo plano
                </label>
              </div>

              {/* --- CONTROL DE ACTUALIZACIÓN WEB AUTOMÁTICA --- */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black uppercase text-[#008CBA] tracking-wider">
                      🔄 Actualización Automática de la Web (Supabase)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Suspende o activa la actualización automática de la web en tiempo real con la base de datos de la nube.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${autoUpdate ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                      {autoUpdate ? '● Activa' : '⛔ Suspendida'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    id="autoupdate_chk"
                    checked={autoUpdate}
                    onChange={e => setAutoUpdate(e.target.checked)}
                    className="w-5 h-5 accent-[#008CBA] rounded cursor-pointer mt-0.5"
                  />
                  <div>
                    <label htmlFor="autoupdate_chk" className="text-sm font-bold text-slate-200 cursor-pointer block">
                      Activar Actualización de la Web Automática
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {autoUpdate 
                        ? "La web se mantendrá sincronizada continuamente con los cambios de la base de datos." 
                        : "⛔ SE SUSPENDE la actualización automática para los visitantes. Esto previene que se carguen datos antiguos accidentalmente. La web conservará el estado local en memoria del servidor."
                      }
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  🚀 <b>Garantía de Sincronización Inmediata:</b> Independientemente de esta opción, cada vez que hagas un cambio en la consola de administración y lo guardes, los datos irán <b>directamente a la Base de Datos</b> para actualizar la web a nivel mundial de forma inmediata.
                </p>
              </div>

              {/* --- DIAGNÓSTICO DE SINCRONIZACIÓN CON EXCEL --- */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-[#008CBA] tracking-wider">
                    📋 Diagnóstico de Sincronización (Excel)
                  </h4>
                  {state.lastSyncTime && (
                    <span className="text-[10px] font-bold text-slate-500">
                      Última vez: {new Date(state.lastSyncTime).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                
                {state.syncLogs && state.syncLogs.length > 0 ? (
                  <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-900 shadow-inner">
                    {state.syncLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="p-3 text-[11px] leading-relaxed flex items-start gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                          log.status === 'success' ? 'bg-emerald-500 shadow-sm' : 'bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-bold uppercase tracking-wider text-[10px] ${
                              log.status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {log.status === 'success' ? '✓ Éxito' : '✗ Error'}
                            </span>
                            <span className="text-slate-600 font-mono text-[9px]">
                              {log.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-300 mt-0.5">{log.message}</p>
                          {log.kilosUpdated !== undefined && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-[9px] text-slate-400 font-mono">
                              Kilos totales en base de datos: {log.kilosUpdated.toLocaleString()} kg
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No se registran intentos de sincronización todavía. Haz clic en el botón "Sincronizar Drive Sheet" en la esquina superior del panel de control para iniciar la prueba.</p>
                )}
              </div>

              {/* --- CONTROL DE VISIBILIDAD DE BLOQUES DE LA WEB --- */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">
                  👁️ Visibilidad de Bloques de Información de la Web
                </h4>
                <p className="text-xs text-slate-400">
                  Desactive o active los diferentes bloques y secciones informativas de la portada principal de la web según las necesidades del momento.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="blk_supplies"
                      checked={showSuppliesGrid}
                      onChange={e => setShowSuppliesGrid(e.target.checked)}
                      className="w-5 h-5 accent-[#008CBA] rounded cursor-pointer shrink-0"
                    />
                    <div>
                      <label htmlFor="blk_supplies" className="text-xs font-black uppercase text-slate-200 cursor-pointer block">
                        Suministros Recaudados por Categoría
                      </label>
                      <span className="text-[10px] text-slate-500">Muestra la meta por categorías</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="blk_centers"
                      checked={showCentersGrid}
                      onChange={e => setShowCentersGrid(e.target.checked)}
                      className="w-5 h-5 accent-[#008CBA] rounded cursor-pointer shrink-0"
                    />
                    <div>
                      <label htmlFor="blk_centers" className="text-xs font-black uppercase text-slate-200 cursor-pointer block">
                        Centros de Acopio
                      </label>
                      <span className="text-[10px] text-slate-500">Muestra los puntos autorizados</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="blk_donations"
                      checked={showDonationsList}
                      onChange={e => setShowDonationsList(e.target.checked)}
                      className="w-5 h-5 accent-[#008CBA] rounded cursor-pointer shrink-0"
                    />
                    <div>
                      <label htmlFor="blk_donations" className="text-xs font-black uppercase text-slate-200 cursor-pointer block">
                        Listado de Donaciones
                      </label>
                      <span className="text-[10px] text-slate-500">Tabla con registros de la base de datos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="blk_news"
                      checked={showNewsSection}
                      onChange={e => setShowNewsSection(e.target.checked)}
                      className="w-5 h-5 accent-[#008CBA] rounded cursor-pointer shrink-0"
                    />
                    <div>
                      <label htmlFor="blk_news" className="text-xs font-black uppercase text-slate-200 cursor-pointer block">
                        Noticias y Avances
                      </label>
                      <span className="text-[10px] text-slate-500">Muro de comunicados oficiales</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="blk_faq"
                      checked={showFaqSection}
                      onChange={e => setShowFaqSection(e.target.checked)}
                      className="w-5 h-5 accent-[#008CBA] rounded cursor-pointer shrink-0"
                    />
                    <div>
                      <label htmlFor="blk_faq" className="text-xs font-black uppercase text-slate-200 cursor-pointer block">
                        Preguntas Frecuentes (FAQ)
                      </label>
                      <span className="text-[10px] text-slate-500">Respuestas a dudas comunes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="blk_suggestions"
                      checked={showSuggestionsSection}
                      onChange={e => setShowSuggestionsSection(e.target.checked)}
                      className="w-5 h-5 accent-[#008CBA] rounded cursor-pointer shrink-0"
                    />
                    <div>
                      <label htmlFor="blk_suggestions" className="text-xs font-black uppercase text-slate-200 cursor-pointer block">
                        Buzón de Sugerencias
                      </label>
                      <span className="text-[10px] text-slate-500">Canal de retroalimentación pública</span>
                    </div>
                  </div>

                </div>
              </div>

              <button
                onClick={handleSaveConfig}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <Save className="w-5 h-5" />
                <span>Guardar Configuración en Base de Datos</span>
              </button>

              {/* Guía didáctica para configurar Apps Script */}
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                <h4 className="text-sm font-black uppercase text-amber-500 flex items-center gap-2">
                  📋 MANUAL DE INTEGRACIÓN EN 3 PASOS (Estos son los pasos que deben de seguir si necesita cualquier ingeniero en reconectar la base de datos. Les dejo esto aquí para que sepan. Atentamente, Orlando.)
                </h4>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-3">
                  <p>
                    Para hacer que su hoja de cálculo actúe como base de datos de escritura y reciba las donaciones directamente de la web, siga estos sencillos pasos:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-400">
                    <li>
                      Abra su Google Sheet y vaya a <b className="text-white">Extensiones &gt; Apps Script</b>.
                    </li>
                    <li>
                      Borre todo el código que aparezca y pegue el siguiente fragmento exacto:
                    </li>
                  </ol>

                  <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto select-all leading-tight">
{appsScriptCode}
                  </pre>

                  <ol className="list-decimal list-inside space-y-2 text-slate-400" start={3}>
                    <li>
                      Haga clic arriba en el botón azul <b className="text-white">Implementar &gt; Nueva implementación</b>.
                    </li>
                    <li>
                      Seleccione tipo: <b className="text-white">Aplicación web</b>.
                    </li>
                    <li>
                      Configuración clave:
                      <ul className="list-disc list-inside pl-5 mt-1 text-slate-400 space-y-1">
                        <li>Ejecutar como: <b className="text-emerald-400">Yo (tu correo)</b></li>
                        <li>Quién tiene acceso: <b className="text-emerald-400">Cualquiera (Anyone)</b> <span className="text-[10px] text-slate-500">(Importante para que la web pueda enviar datos)</span></li>
                      </ul>
                    </li>
                    <li>
                      Haga clic en <b className="text-white">Implementar</b>, otorgue los permisos de Google, copie la <b>URL de la aplicación web</b> generada y péguela en el campo número 2 de arriba.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          )
        )}

        {/* --- CONTENIDO PESTAÑA 7: PERSONALIZACIÓN DE PORTADA (100% MODIFICABLE) --- */}
        {activeTab === 'portada' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-blue-500/40 shadow-2xl">
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-full">Personalización Total</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3">
                🎨 DISEÑO Y EDICIÓN COMPLETA DE LA PORTADA WEB
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl">
                Modifique los encabezados, textos informativos, franja de emergencia roja y consignas principales de la campaña humanitaria en tiempo real para mantener la web 100% actualizada.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Formulario de Configuración (Columna Izquierda) */}
              <div className="lg:col-span-7 bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                
                {/* Grupo 1: Títulos y Metas SEO */}
                <div>
                  <h3 className="text-base font-black uppercase text-blue-400 mb-4 border-b border-slate-800 pb-2">
                    📌 1. Identificación y SEO de la Campaña
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-400 block mb-1">Título de la Campaña (Navegador / SEO)</label>
                      <input
                        type="text"
                        value={campaignTitleText}
                        onChange={e => setCampaignTitleText(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none"
                        placeholder="ej. Por 1T — Ayuda Humanitaria Emergencia Venezuela"
                      />
                    </div>
                  </div>
                </div>

                {/* Grupo 2: Alerta Roja */}
                <div className="pt-4">
                  <h3 className="text-base font-black uppercase text-red-400 mb-4 border-b border-slate-800 pb-2">
                    🚨 2. Cinta de Alerta Roja Superior
                  </h3>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 block mb-1">Texto de la Alerta Roja (Emergencia Activa)</label>
                    <textarea
                      rows={2}
                      value={headerAlertTextState}
                      onChange={e => setHeaderAlertTextState(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-red-500 focus:outline-none"
                      placeholder="ej. Emergencia Nacional #VEN-2026: Terremoto en Los Andes..."
                    />
                  </div>
                </div>

                {/* Grupo 3: Hero Section */}
                <div className="pt-4">
                  <h3 className="text-base font-black uppercase text-amber-400 mb-4 border-b border-slate-800 pb-2">
                    ⚡ 3. Sección de Bienvenida (HERO)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black uppercase text-slate-400 block mb-1">Etiqueta Pequeña (Hero Badge)</label>
                      <input
                        type="text"
                        value={heroBadgeTextState}
                        onChange={e => setHeroBadgeTextState(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-amber-500 focus:outline-none"
                        placeholder="ej. 🇻🇪 Emergencia Humanitaria • Terremoto Venezuela"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase text-slate-400 block mb-1">Título Row 1</label>
                        <input
                          type="text"
                          value={heroTitleRow1State}
                          onChange={e => setHeroTitleRow1State(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase text-slate-400 block mb-1">Título Row 2 (Destacado Azul)</label>
                        <input
                          type="text"
                          value={heroTitleRow2State}
                          onChange={e => setHeroTitleRow2State(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase text-slate-400 block mb-1">Título Row 3</label>
                        <input
                          type="text"
                          value={heroTitleRow3State}
                          onChange={e => setHeroTitleRow3State(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-slate-400 block mb-1">Subtítulo / Descripción Principal (Cuerpo Informativo)</label>
                      <textarea
                        rows={4}
                        value={emergencySubtitleText}
                        onChange={e => setEmergencySubtitleText(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-amber-500 focus:outline-none leading-relaxed"
                        placeholder="Detalle detallado de la logística humanitaria en Venezuela..."
                      />
                    </div>
                  </div>
                </div>

                {/* Grupo 4: Video de Fondo de YouTube */}
                <div className="pt-4 border-t border-slate-800/80">
                  <h3 className="text-base font-black uppercase text-indigo-400 mb-4 border-b border-slate-800 pb-2">
                    🎥 4. Video de Fondo del Encabezado (Espectacular)
                  </h3>
                  <div className="space-y-5">
                    {/* Toggle Button for Video Activation */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/60">
                      <div>
                        <span className="text-xs font-black uppercase text-white block">Activar Video de Fondo</span>
                        <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                          Si se desactiva, se mostrará el diseño estándar con fondo de color suave.
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setHeaderVideoEnabledState(false)}
                          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                            !headerVideoEnabledState 
                              ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          Apagado
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeaderVideoEnabledState(true)}
                          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                            headerVideoEnabledState 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          Encendido
                        </button>
                      </div>
                    </div>

                    {/* YouTube Video URL Input */}
                    <div>
                      <label className="text-xs font-black uppercase text-slate-400 block mb-1">Enlace / Link del Video de YouTube</label>
                      <input
                        type="text"
                        value={headerVideoYoutubeUrlState}
                        onChange={e => setHeaderVideoYoutubeUrlState(e.target.value)}
                        placeholder="ej. https://www.youtube.com/watch?v=kYv_I-g_M5w"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-600"
                      />
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5 font-medium">
                        💡 Admite cualquier enlace de YouTube estándar (watch?v=), corto (youtu.be/), de inserción (embed/) o directamente el código ID de 11 caracteres. El sistema reproducirá de forma automática, sin sonido (mute), en bucle infinito y con soporte nativo para visualización móvil.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botón de Guardar */}
                <button
                  onClick={handleSavePortada}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <Save className="w-5 h-5" />
                  <span>💾 Guardar Cambios en Portada y Encabezados</span>
                </button>

              </div>

              {/* Vista Previa Intelectual (Columna Derecha) */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Simulador de Vista Previa en Vivo</span>
                </div>

                {/* Cinta Roja */}
                <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 overflow-hidden text-ellipsis">
                  <span>🇻🇪</span>
                  <span className="truncate">{headerAlertTextState || 'Emergencia Nacional...'}</span>
                </div>

                {/* Preview de Tarjeta Hero */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <span className="inline-block px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded text-[9px] font-black uppercase tracking-wider">
                    {heroBadgeTextState || 'Badge de Emergencia'}
                  </span>
                  
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-none uppercase">
                      {heroTitleRow1State || 'LÍNEA 1'} <br />
                      <span className="text-[#008CBA]">{heroTitleRow2State || 'LÍNEA 2'}</span> <br />
                      {heroTitleRow3State || 'LÍNEA 3'}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                    {emergencySubtitleText || 'Descripción informativa...'}
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-xs text-slate-500 leading-relaxed">
                  💡 <b>¿Por qué es profesional?</b> Al guardar esta configuración, se actualiza el estado central del servidor y el almacenamiento persistente de forma que los cambios se reflejan al instante para todos los visitantes que entren a la web.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA 8: CONTROL DE USUARIOS Y PERFILES --- */}
        {activeTab === 'usuarios' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-blue-500/40 shadow-2xl">
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-full">Operaciones Firmadas</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3 flex items-center gap-2.5">
                <Users className="w-8 h-8 text-emerald-400" />
                <span>👥 CONTROL Y REGISTRO DE USUARIOS OPERARIOS</span>
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
                Gestione las cuentas de operarios del panel de control. Todos los usuarios registrados ven y operan sobre los mismos datos compartidos de la campaña, pero sus acciones se registran bajo su firma de perfil individual.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Listado de Usuarios Existentes (Izquierda - col-span-7) */}
              <div className="lg:col-span-7 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                <h3 className="text-lg font-black uppercase tracking-wider text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Usuarios y Perfiles Autorizados</span>
                </h3>

                <div className="space-y-4">
                  {(state.adminUsers || []).map((u) => {
                    const isActive = activeUser?.id === u.id;
                    return (
                      <div 
                        key={u.id}
                        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isActive 
                            ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                            : 'bg-slate-950 border-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="text-3xl bg-slate-900 p-2.5 rounded-2xl border border-slate-800 select-none">{u.avatar || '👤'}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-white font-black text-sm sm:text-base">{u.name}</h4>
                              {isActive && (
                                <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase rounded tracking-wider animate-pulse flex items-center gap-1">
                                  <span>● ACTIVO</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[9px] font-mono font-black uppercase border border-slate-700">{u.role}</span>
                              <span className="text-[10px] text-slate-500 font-bold">Creado: {u.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {!isActive ? (
                            <button
                              onClick={() => handleSelectActiveUser(u)}
                              className="px-3.5 py-2 bg-slate-800 hover:bg-[#008CBA] text-slate-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
                            >
                              Firmar Como
                            </button>
                          ) : (
                            <span className="px-3.5 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black uppercase tracking-wider select-none">
                              En Operación
                            </span>
                          )}

                          {u.id !== 'usr-orlando' ? (
                            <button
                              onClick={() => handleDeleteUserProfile(u.id)}
                              className="p-2 bg-slate-850 hover:bg-red-650 text-slate-400 hover:text-red-400 rounded-xl transition cursor-pointer border border-slate-800 hover:border-red-500/20"
                              title="Eliminar este perfil de usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="p-2 bg-slate-900 text-slate-600 rounded-xl cursor-not-allowed border border-slate-850"
                              title="El administrador fundador / principal no puede eliminarse"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Formulario Agregar Usuario (Derecha - col-span-5) */}
              <div className="lg:col-span-5 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                <h3 className="text-lg font-black uppercase tracking-wider text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  <span>Registrar Nuevo Operario</span>
                </h3>

                <form onSubmit={handleAddUserProfile} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-1.5">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Ing. Orlando Galdámez..."
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-1.5">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="Ej. usuario@campana.org..."
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-1.5">Cargo / Rol Operativo</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition cursor-pointer"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Coordinador General">Coordinador General</option>
                      <option value="Coordinador de Logística">Coordinador de Logística</option>
                      <option value="Operador de Almacén">Operador de Almacén</option>
                      <option value="Voluntario Oficial">Voluntario Oficial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-1.5">Avatar / Emoji Identificador</label>
                    <div className="grid grid-cols-6 gap-2">
                      {['👤', '👨‍💻', '👩‍💼', '🚛', '🏥', '📦', '🌐', '🚑', '🇪🇸', '🇻🇪', '❤️', '⚡'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewUserAvatar(emoji)}
                          className={`py-2.5 rounded-xl text-xl border transition-all duration-200 cursor-pointer ${
                            newUserAvatar === emoji 
                              ? 'bg-blue-600/30 border-blue-500 text-white scale-105 shadow-md shadow-blue-500/20' 
                              : 'bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-400'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-500/10"
                  >
                    <UserPlus className="w-4 h-4 shrink-0" />
                    <span>Añadir Perfil Autorizado</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA 9: HISTÓRICO DE CAMBIOS --- */}
        {activeTab === 'cambios_web' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-rose-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-rose-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black uppercase tracking-widest rounded-full">Auditoría del Sistema</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3 flex items-center gap-2.5">
                  <History className="w-8 h-8 text-yellow-400 animate-pulse" />
                  <span>📜 HISTÓRICO DE CAMBIOS WEB POR USUARIOS</span>
                </h2>
                <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
                  Consulte el registro histórico y la traza de auditoría en tiempo real de todas las modificaciones y configuraciones guardadas en este sitio web, catalogadas por día, hora y perfil de operación.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              
              {/* Barra de Filtro y Buscador */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="relative max-w-md w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar cambios por usuario, acción, rol..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:bg-slate-900 focus:border-rose-500 focus:outline-none transition font-medium"
                  />
                  {logSearchQuery && (
                    <button 
                      onClick={() => setLogSearchQuery('')} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Total Registros: <b className="text-white">{(state.userChangeLogs || []).length} cambios</b>
                </div>
              </div>

              {/* Línea de Tiempo / Tabla de Auditoría */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest select-none">
                      <th className="p-4 sm:p-5">Día / Hora</th>
                      <th className="p-4 sm:p-5">Operario / Perfil</th>
                      <th className="p-4 sm:p-5">Modificación Realizada</th>
                      <th className="p-4 sm:p-5">ID Cambio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 text-slate-300">
                    {(() => {
                      const logs = (state.userChangeLogs || []).filter(l => {
                        if (!logSearchQuery) return true;
                        const query = logSearchQuery.toLowerCase();
                        return (l.userName || '').toLowerCase().includes(query) ||
                               (l.action || '').toLowerCase().includes(query) ||
                               (l.userEmail || '').toLowerCase().includes(query);
                      });

                      if (logs.length === 0) {
                        return (
                          <tr>
                            <td colSpan={4} className="p-10 text-center text-slate-500 text-sm font-bold uppercase tracking-wider bg-slate-950/40">
                              No se encontraron registros de auditoría que coincidan.
                            </td>
                          </tr>
                        );
                      }

                      return logs.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-800/20 transition-all duration-150">
                          <td className="p-4 sm:p-5 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-white font-mono font-bold text-xs flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-rose-500" />
                                {l.date}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {l.time}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 sm:p-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-base shrink-0 select-none">
                                {((state.adminUsers || []).find(u => u.id === l.userId)?.avatar) || '👤'}
                              </div>
                              <div>
                                <span className="text-white font-black text-xs sm:text-sm block leading-none">{l.userName}</span>
                                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{l.userEmail}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 sm:p-5 leading-relaxed text-xs sm:text-sm max-w-md">
                            <span className="text-slate-100 font-semibold bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-850 block shadow-inner">
                              {l.action}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-slate-950 text-slate-600 rounded text-[9px] font-mono border border-slate-850 select-all uppercase">
                              {l.id}
                            </span>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA: HISTORIAL DE ACCESO A LA WEB --- */}
        {activeTab === 'accesos_web' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 font-sans">
              <div>
                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-full">Tráfico en Tiempo Real</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3 flex items-center gap-2.5">
                  <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
                  <span>🌐 HISTORIAL DE ACCESO A LA WEB</span>
                </h2>
                <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
                  Registro detallado de acceso y tráfico a nivel de usuario. Monitorea en tiempo real el tiempo de conexión, ubicación aproximada (zona horaria/país), dispositivo, sistema operativo, resolución de pantalla y dirección IP de los visitantes.
                </p>
              </div>
            </div>

            {/* Tarjetas de Estadísticas de Tráfico */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
                <div className="text-slate-400 text-xs font-black uppercase tracking-wider">Total Accesos</div>
                <div className="text-2xl font-black text-white mt-1">{(state.webAccessLogs || []).length}</div>
                <div className="text-[10px] text-slate-500 mt-1">Registros en caché de base de datos</div>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
                <div className="text-slate-400 text-xs font-black uppercase tracking-wider">Móvil (Teléfonos)</div>
                <div className="text-2xl font-black text-indigo-400 mt-1">
                  {(state.webAccessLogs || []).filter(l => (l.device || '').includes('📱')).length}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Accesos desde smartphones</div>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
                <div className="text-slate-400 text-xs font-black uppercase tracking-wider">Escritorio (PCs)</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {(state.webAccessLogs || []).filter(l => (l.device || '').includes('💻')).length}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Accesos desde computadoras</div>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
                <div className="text-slate-400 text-xs font-black uppercase tracking-wider">Tablets y Otros</div>
                <div className="text-2xl font-black text-amber-400 mt-1">
                  {(state.webAccessLogs || []).filter(l => (l.device || '').includes('📟') || (!(l.device || '').includes('📱') && !(l.device || '').includes('💻'))).length}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Otros navegadores y agentes</div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              
              {/* Barra de Filtro y Buscador */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="relative max-w-md w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por IP, dispositivo, ubicación, página..."
                    value={accessSearchQuery}
                    onChange={(e) => setAccessSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm focus:bg-slate-900 focus:border-indigo-500 focus:outline-none transition font-medium text-white"
                  />
                  {accessSearchQuery && (
                    <button 
                      onClick={() => setAccessSearchQuery('')} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Resultados: <b className="text-white">
                    {(state.webAccessLogs || []).filter(l => {
                      if (!accessSearchQuery) return true;
                      const q = accessSearchQuery.toLowerCase();
                      return (l.ip || '').toLowerCase().includes(q) ||
                             (l.device || '').toLowerCase().includes(q) ||
                             (l.location || '').toLowerCase().includes(q) ||
                             (l.page || '').toLowerCase().includes(q);
                    }).length}
                  </b> de <b className="text-slate-400">{(state.webAccessLogs || []).length}</b>
                </div>
              </div>

              {/* Tabla de Registros de Acceso */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
                <table className="w-full border-collapse text-left font-sans">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest select-none">
                      <th className="p-4 sm:p-5">Día y Hora</th>
                      <th className="p-4 sm:p-5">Ubicación / Región</th>
                      <th className="p-4 sm:p-5">Equipo / Pantalla / Entorno</th>
                      <th className="p-4 sm:p-5">Página</th>
                      <th className="p-4 sm:p-5">Dirección IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 text-slate-300">
                    {(() => {
                      const logs = (state.webAccessLogs || []).filter(l => {
                        if (!accessSearchQuery) return true;
                        const q = accessSearchQuery.toLowerCase();
                        return (l.ip || '').toLowerCase().includes(q) ||
                               (l.device || '').toLowerCase().includes(q) ||
                               (l.location || '').toLowerCase().includes(q) ||
                               (l.page || '').toLowerCase().includes(q);
                      });

                      if (logs.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="p-10 text-center text-slate-500 text-sm font-bold uppercase tracking-wider bg-slate-950/40">
                              No se encontraron registros de accesos que coincidan.
                            </td>
                          </tr>
                        );
                      }

                      return logs.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-800/20 transition-all duration-150">
                          <td className="p-4 sm:p-5 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-white font-mono font-bold text-xs flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                {new Date(l.timestamp).toLocaleDateString()}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                {new Date(l.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 sm:p-5">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              <div>
                                <span className="text-white font-bold text-xs sm:text-sm block">{l.location}</span>
                                <span className="text-[9px] text-slate-400 font-medium block">Geolocalización aproximada</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 sm:p-5">
                            <span className="text-slate-100 font-semibold bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-850 block shadow-inner text-xs">
                              {l.device}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5">
                            <span className="px-2 py-1 bg-slate-950 text-indigo-400 font-mono font-black text-[10px] rounded border border-slate-850">
                              {l.page}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 whitespace-nowrap">
                            <span className="px-2 py-1 bg-slate-950 text-slate-400 rounded text-[11px] font-mono border border-slate-850 select-all font-bold">
                              {l.ip}
                            </span>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA: CONTADOR EN VIVO --- */}
        {activeTab === 'contador_vivo' && (
          !isContadorTabUnlocked ? (
            <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6 my-12 font-sans">
              <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-950/20">
                <Lock className="w-8 h-8 text-emerald-450 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase text-white">🔐 Acceso Restringido</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contador en Vivo y Metas de Navarra</p>
                <p className="text-[11px] text-slate-500 font-medium">Esta sección requiere autenticación por motivos de seguridad.</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (contadorPasswordAttempt === 'Isabella2015$') {
                  setIsContadorTabUnlocked(true);
                  setContadorError('');
                } else {
                  setContadorError('❌ Clave incorrecta. Inténtelo de nuevo.');
                }
              }} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Clave de Acceso</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={contadorPasswordAttempt}
                    onChange={(e) => setContadorPasswordAttempt(e.target.value)}
                    className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono text-center tracking-widest text-center"
                  />
                </div>
                {contadorError && <p className="text-rose-500 text-xs font-bold text-center">{contadorError}</p>}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-widest transition cursor-pointer"
                >
                  Confirmar Clave
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 font-sans">
              <div>
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-full">Progresión de la Campaña</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3 flex items-center gap-2.5">
                  <Scale className="w-8 h-8 text-emerald-400 animate-pulse" />
                  <span>📊 CONTADOR EN VIVO Y CONTROL DE METAS</span>
                </h2>
                <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
                  Establece el objetivo de peso (Toneladas) activo para la campaña en tiempo real. Cuando se cumpla el hito de una tonelada, puedes habilitar y expandir el ranking a dos toneladas, tres toneladas, o más, motivando a los donantes con nuevas metas progresivas.
                </p>
              </div>
            </div>

            {/* Live Progress Info Card */}
            <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-black uppercase text-white">Estado de Recolección en Tiempo Real</h3>
                <p className="text-slate-400 text-xs mt-1">Cálculo en base a las donaciones registradas en el sistema.</p>
                
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-black text-emerald-400">
                    {((state.pledges || []).reduce((acc, p) => acc + (p.pledgeKilos || 0), 0) / 1000).toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-slate-400">Toneladas recolectadas</span>
                  <span className="text-slate-500 text-xs ml-2">
                    ({(state.pledges || []).reduce((acc, p) => acc + (p.pledgeKilos || 0), 0).toLocaleString()} kg)
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-950 rounded-2xl border border-slate-800 text-center shrink-0">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider block">Meta Actual Seleccionada</span>
                <span className="text-3xl font-black text-sky-400 mt-1 block">{state.globalTargetTons} Toneladas</span>
                <span className="text-xs text-slate-400">({state.globalTargetTons * 1000} kg)</span>
              </div>
            </div>

            {/* Ranking Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7].map((tons) => {
                const targetWeightKg = tons * 1000;
                const currentWeightKg = (state.pledges || []).reduce((acc, p) => acc + (p.pledgeKilos || 0), 0);
                const isCurrentActive = state.globalTargetTons === tons;
                const isCompleted = currentWeightKg >= targetWeightKg;
                
                let subtitle = "Meta de Lanzamiento";
                if (tons === 2) subtitle = "Meta de Expansión";
                if (tons === 3) subtitle = "Meta Intermedia";
                if (tons === 4) subtitle = "Gran Convocatoria";
                if (tons === 5) subtitle = "Hito Humanitario";
                if (tons === 6) subtitle = "Solidaridad Máxima";
                if (tons === 7) subtitle = "Éxito Absoluto";

                return (
                  <button
                    key={tons}
                    onClick={() => {
                      handleUpdateStateWithLog(
                        { globalTargetTons: tons },
                        `Modificó la meta global en vivo de la campaña a: ${tons} Toneladas (${targetWeightKg} kg)`
                      );
                      showToast(`✨ Meta global actualizada a ${tons} Toneladas`);
                    }}
                    className={`text-left p-6 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between h-48 ${
                      isCurrentActive
                        ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/20 ring-2 ring-emerald-500/30'
                        : isCompleted
                        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-900/30 border-slate-950 hover:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          isCurrentActive
                            ? 'bg-emerald-600 text-white'
                            : isCompleted
                            ? 'bg-slate-800 text-emerald-400'
                            : 'bg-slate-950 text-slate-500'
                        }`}>
                          {isCurrentActive ? 'Meta Activa' : isCompleted ? 'Completado' : 'Habilitar'}
                        </span>
                        
                        {isCompleted && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>

                      <h4 className="text-xl font-black text-white mt-4 uppercase tracking-wider">
                        {tons} {tons === 1 ? 'Tonelada' : 'Toneladas'}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Equivale a: <b>{targetWeightKg.toLocaleString()} kg</b></span>
                      <span className="text-emerald-400 group-hover:translate-x-1 transition duration-150">➔</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Status Config Section */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 font-sans">
              <div>
                <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>🎨 CONFIGURACIÓN DE ESTADOS, LEYENDAS Y VISIBILIDAD (NAVARRA)</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Modifica los textos de alerta correspondientes a cada fase del progreso, ajusta las etiquetas de la leyenda o desactívalas completamente de la portada.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
                {/* 1. CONFIGURACIÓN DE ESTADOS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400">🚨 Configuración de Alertas de Estado</h4>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={tempShowStateBadge}
                        onChange={(e) => setTempShowStateBadge(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-850 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-2 text-xs font-black uppercase text-slate-400">MOSTRAR</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fase Roja (0% - 29.9%):</label>
                        <button
                          type="button"
                          onClick={() => setTempRedLabel('')}
                          className="text-[9px] text-rose-400 hover:underline uppercase font-bold"
                        >
                          Limpiar / Ocultar Texto
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tempRedLabel}
                        onChange={(e) => setTempRedLabel(e.target.value)}
                        placeholder="Ej. ROJO — DÉFICIT CRÍTICO INICIAL"
                        className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fase Naranja/Amarilla (30% - 74.9%):</label>
                        <button
                          type="button"
                          onClick={() => setTempOrangeLabel('')}
                          className="text-[9px] text-rose-400 hover:underline uppercase font-bold"
                        >
                          Limpiar / Ocultar Texto
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tempOrangeLabel}
                        onChange={(e) => setTempOrangeLabel(e.target.value)}
                        placeholder="Ej. NARANJA / AMARILLO — EN PROGRESO CONSTANTE"
                        className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fase Verde (75% o superior):</label>
                        <button
                          type="button"
                          onClick={() => setTempGreenLabel('')}
                          className="text-[9px] text-rose-400 hover:underline uppercase font-bold"
                        >
                          Limpiar / Ocultar Texto
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tempGreenLabel}
                        onChange={(e) => setTempGreenLabel(e.target.value)}
                        placeholder="Ej. VERDE — ¡META PRÓXIMA / ALCANZADA!"
                        className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CONFIGURACIÓN DE LEYENDAS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400">📊 Leyendas del Progreso (Rangos)</h4>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={tempShowLegends}
                        onChange={(e) => setTempShowLegends(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-850 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-2 text-xs font-black uppercase text-slate-400">MOSTRAR</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Leyenda 0%:</label>
                        <button
                          type="button"
                          onClick={() => setTempLegend0('')}
                          className="text-[9px] text-rose-400 hover:underline font-bold"
                        >
                          Limpiar
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tempLegend0}
                        onChange={(e) => setTempLegend0(e.target.value)}
                        placeholder="0% Rojo"
                        className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Leyenda 30%:</label>
                        <button
                          type="button"
                          onClick={() => setTempLegend30('')}
                          className="text-[9px] text-rose-400 hover:underline font-bold"
                        >
                          Limpiar
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tempLegend30}
                        onChange={(e) => setTempLegend30(e.target.value)}
                        placeholder="30% Naranja"
                        className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Leyenda 70%:</label>
                        <button
                          type="button"
                          onClick={() => setTempLegend70('')}
                          className="text-[9px] text-rose-400 hover:underline font-bold"
                        >
                          Limpiar
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tempLegend70}
                        onChange={(e) => setTempLegend70(e.target.value)}
                        placeholder="70% Amarillo"
                        className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Leyenda 100%:</label>
                        <button
                          type="button"
                          onClick={() => setTempLegend100('')}
                          className="text-[9px] text-rose-400 hover:underline font-bold"
                        >
                          Limpiar
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tempLegend100}
                        onChange={(e) => setTempLegend100(e.target.value)}
                        placeholder="100% Verde"
                        className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardar cambios */}
              <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTempRedLabel('ROJO — DÉFICIT CRÍTICO INICIAL');
                    setTempOrangeLabel('NARANJA / AMARILLO — EN PROGRESO CONSTANTE');
                    setTempGreenLabel('VERDE — ¡META PRÓXIMA / ALCANZADA!');
                    setTempShowStateBadge(true);
                    setTempLegend0('0% Rojo');
                    setTempLegend30('30% Naranja');
                    setTempLegend70('70% Amarillo');
                    setTempLegend100('100% Verde');
                    setTempShowLegends(true);
                    showToast('🔄 Se han restablecido los valores por defecto locales (Haga clic en Guardar para aplicarlos)');
                  }}
                  className="px-4 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Restablecer Predeterminados
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStateWithLog({
                      liveCounterStateRedLabel: tempRedLabel,
                      liveCounterStateOrangeLabel: tempOrangeLabel,
                      liveCounterStateGreenLabel: tempGreenLabel,
                      liveCounterShowStateBadge: tempShowStateBadge,
                      liveCounterLegend0: tempLegend0,
                      liveCounterLegend30: tempLegend30,
                      liveCounterLegend70: tempLegend70,
                      liveCounterLegend100: tempLegend100,
                      liveCounterShowLegends: tempShowLegends
                    }, 'Actualizó la configuración de estados, leyendas y visibilidad del contador en vivo de Navarra');
                    showToast('💾 ¡Configuración del contador en vivo guardada correctamente!');
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black uppercase tracking-widest rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>
          </div>
          )
        )}

        {/* --- CONTENIDO PESTAÑA: CATEGORÍA DE VIDEOS --- */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-violet-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-violet-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 font-sans">
              <div>
                <span className="px-3 py-1 bg-violet-600 text-white text-xs font-black uppercase tracking-widest rounded-full">Material Audiovisual</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3 flex items-center gap-2.5 font-sans">
                  <Video className="w-8 h-8 text-violet-400" />
                  <span>🎥 CATEGORÍA DE VIDEOS DE LA WEB</span>
                </h2>
                <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
                  Administra las experiencias visuales de la campaña. Configura el video de introducción que se reproduce automáticamente en un pop-up cuando la página carga por primera vez, o gestiona el video cinematográfico que se reproduce en bucle en el encabezado de la página de inicio.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Box 1: Video de Introducción Autoplay */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black uppercase text-white flex items-center gap-2">
                      <Play className="w-5 h-5 text-indigo-400" />
                      <span>1. Video de Entrada (Autoplay Pop-up)</span>
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">Al Cargar la Web</span>
                  </div>
                  
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Este video cubre la pantalla con un elegante efecto de atenuación en negro y fondo difuminado al ingresar al portal web por primera vez. El usuario puede disfrutarlo o saltarlo rápidamente con un botón.
                  </p>

                  {/* Toggle Switch */}
                  <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                    <div>
                      <span className="text-xs font-black uppercase text-white block">Estado del Pop-up</span>
                      <span className="text-[10px] text-slate-500 block">Activar/Desactivar reproducción automática</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIntroVideoEnabledState(false)}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer ${
                          !introVideoEnabledState 
                            ? 'bg-red-600 text-white shadow-md' 
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        Desactivar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIntroVideoEnabledState(true)}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer ${
                          introVideoEnabledState 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        Activar
                      </button>
                    </div>
                  </div>

                  {/* YouTube Link Input */}
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 block mb-1">Enlace de YouTube</label>
                    <input
                      type="text"
                      value={introVideoYoutubeUrlState}
                      onChange={e => setIntroVideoYoutubeUrlState(e.target.value)}
                      placeholder="ej. https://www.youtube.com/watch?v=kYv_I-g_M5w"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-slate-700"
                    />
                  </div>

                  {/* Custom Pop-up Texts customization */}
                  <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                    <span className="text-[10px] font-black uppercase text-[#008CBA] tracking-wider block border-b border-slate-800 pb-1">
                      ✍️ Personalizar Textos del Pop-up
                    </span>
                    
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Distintivo Superior (Badge)</label>
                      <input
                        type="text"
                        value={introVideoBadgeTextState}
                        onChange={e => setIntroVideoBadgeTextState(e.target.value)}
                        placeholder="ej. Video de Presentación Oficial de la Campaña 🇻🇪"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Título de Invitación</label>
                      <input
                        type="text"
                        value={introVideoTitleState}
                        onChange={e => setIntroVideoTitleState(e.target.value)}
                        placeholder="ej. ¿Estás Listo para Solidarizarte?"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Subtítulo / Descripción corta</label>
                      <textarea
                        value={introVideoSubtitleState}
                        onChange={e => setIntroVideoSubtitleState(e.target.value)}
                        placeholder="ej. Conoce más de nuestra iniciativa en marcha por 1 Tonelada."
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-white focus:border-indigo-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Texto del Botón de Entrada</label>
                      <input
                        type="text"
                        value={introVideoBtnTextState}
                        onChange={e => setIntroVideoBtnTextState(e.target.value)}
                        placeholder="ej. Ingresar a la Web de la Campaña ➔"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Video Live Preview */}
                  {introVideoYoutubeUrlState && getYoutubeId(introVideoYoutubeUrlState) && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video bg-black relative shadow-inner">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(introVideoYoutubeUrlState)}?controls=0&mute=1`}
                        className="w-full h-full"
                        frameBorder="0"
                        title="Vista Previa Intro"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: Video de Fondo en el Encabezado */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black uppercase text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <span>2. Video de Fondo (Header Cinematográfico)</span>
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-[#008CBA]/10 text-sky-400 border border-[#008CBA]/20 px-2 py-0.5 rounded">En Portada</span>
                  </div>
                  
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Reemplaza el fondo de la sección principal (Hero) por un video cinematográfico de YouTube en bucle continuo, silenciado (mute) de forma nativa para mayor espectacularidad.
                  </p>

                  {/* Toggle Switch */}
                  <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                    <div>
                      <span className="text-xs font-black uppercase text-white block">Estado de Video de Fondo</span>
                      <span className="text-[10px] text-slate-500 block">Activar/Desactivar video en cabecera</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setHeaderVideoEnabledState(false)}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer ${
                          !headerVideoEnabledState 
                            ? 'bg-red-600 text-white shadow-md' 
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        Desactivar
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeaderVideoEnabledState(true)}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer ${
                          headerVideoEnabledState 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        Activar
                      </button>
                    </div>
                  </div>

                  {/* YouTube Link Input */}
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 block mb-1">Enlace de YouTube</label>
                    <input
                      type="text"
                      value={headerVideoYoutubeUrlState}
                      onChange={e => setHeaderVideoYoutubeUrlState(e.target.value)}
                      placeholder="ej. https://www.youtube.com/watch?v=kYv_I-g_M5w"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-slate-700"
                    />
                  </div>

                  {/* Video Live Preview */}
                  {headerVideoYoutubeUrlState && getYoutubeId(headerVideoYoutubeUrlState) && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video bg-black relative shadow-inner">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(headerVideoYoutubeUrlState)}?controls=0&mute=1`}
                        className="w-full h-full"
                        frameBorder="0"
                        title="Vista Previa Fondo"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* General Save Button for Videos */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  handleUpdateStateWithLog({
                    headerVideoEnabled: headerVideoEnabledState,
                    headerVideoYoutubeUrl: headerVideoYoutubeUrlState,
                    introVideoEnabled: introVideoEnabledState,
                    introVideoYoutubeUrl: introVideoYoutubeUrlState,
                    introVideoBadgeText: introVideoBadgeTextState,
                    introVideoTitle: introVideoTitleState,
                    introVideoSubtitle: introVideoSubtitleState,
                    introVideoBtnText: introVideoBtnTextState
                  }, `Actualizó configuraciones del video de introducción, video en cabecera y textos personalizados del pop-up`);
                  showToast('✨ ¡Configuraciones de video y textos guardadas con éxito!');
                }}
                className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase text-xs sm:text-sm tracking-widest rounded-2xl shadow-xl shadow-violet-500/20 transition cursor-pointer flex items-center gap-2.5"
              >
                <Save className="w-5 h-5" />
                <span>Guardar Cambios de Video</span>
              </button>
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA: MODO MANTENIMIENTO --- */}
        {activeTab === 'mantenimiento' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 font-sans">
              <div>
                <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-full">Control de Infraestructura</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3 flex items-center gap-2.5 font-sans">
                  <Settings className="w-8 h-8 text-amber-400" />
                  <span>🛠️ GESTIÓN DEL MODO MANTENIMIENTO GLOBAL</span>
                </h2>
                <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
                  Active el bloqueo de mantenimiento para suspender temporalmente el acceso público a la plataforma mientras se realizan actualizaciones en el servidor. Los visitantes verán un contador regresivo de alta fidelidad y un motivo sumamente profesional.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Izquierda: Activar & Motivo */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Toggle */}
                <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black uppercase text-white flex items-center gap-2">
                        <AlertOctagon className={`w-5 h-5 ${tempMaintenanceModeEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                        <span>1. Bloqueo de Mantenimiento</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Activar este interruptor desconectará la plataforma de forma inmediata para todos los usuarios normales.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                      <input
                        type="checkbox"
                        checked={tempMaintenanceModeEnabled}
                        onChange={(e) => setTempMaintenanceModeEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-slate-950 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  {tempMaintenanceModeEnabled ? (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-3">
                      <span className="text-xl">⚠️</span>
                      <p className="text-xs text-amber-300 leading-relaxed font-semibold">
                        <strong className="text-white block uppercase mb-1">MODO MANTENIMIENTO ACTIVO:</strong>
                        Los usuarios normales que ingresen al portal web no podrán ver el contador ni realizar registros de donación. Serán redirigidos a la pantalla de espera hasta que desactive esta opción o expire el temporizador regresivo.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-start gap-3">
                      <span className="text-xl">✅</span>
                      <p className="text-xs text-emerald-300 leading-relaxed font-semibold">
                        <strong className="text-white block uppercase mb-1">SISTEMA EN LÍNEA:</strong>
                        La web se encuentra totalmente accesible. Todos los acopios, mapas, noticias e inteligencia artificial están operando de forma óptima.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Motivo */}
                <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <h3 className="text-base sm:text-lg font-black uppercase text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    <span>2. Motivo Técnico del Mantenimiento (Súper Profesionales)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Seleccione uno de los motivos de nivel de ingeniería para la desconexión o ingrese uno personalizado:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      {
                        label: '🗄️ Actualización de Base de Datos',
                        desc: 'Actualización de base de datos relacional y migración de esquemas',
                        text: 'Actualización de base de datos y migración de esquemas'
                      },
                      {
                        label: '🖥️ Servidor Principal',
                        desc: 'Mantenimiento preventivo de infraestructura y Servidor Principal',
                        text: 'Mantenimiento del servidor principal'
                      },
                      {
                        label: '🤖 Automatización',
                        desc: 'Sincronización automatizada y optimización de procesos',
                        text: 'Automatización de procesos'
                      },
                      {
                        label: '📊 Procesamiento de Datos',
                        desc: 'Actualizando procesos de procesamiento de datos masivos',
                        text: 'Actualizando procesos de procesamiento de datos'
                      }
                    ].map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTempMaintenanceReason(opt.text)}
                        className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-28 ${
                          tempMaintenanceReason === opt.text
                            ? 'bg-slate-850 border-amber-500/50 shadow-md'
                            : 'bg-slate-950 border-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-black uppercase text-white block">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 leading-snug line-clamp-2 mt-1.5 font-medium">{opt.desc}</span>
                        <span className="text-[9px] text-amber-400 font-bold tracking-wider mt-2 block text-right">
                          {tempMaintenanceReason === opt.text ? '✓ SELECCIONADO' : 'SELECCIONAR'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Otro Motivo Personalizado Profesional:</label>
                    <textarea
                      rows={2}
                      value={tempMaintenanceReason}
                      onChange={(e) => setTempMaintenanceReason(e.target.value)}
                      placeholder="Ingrese una descripción técnica detallada..."
                      className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Temporizador & Guardar */}
              <div className="space-y-6">
                <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-black uppercase text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                      <span>3. Temporizador de Cuenta Regresiva</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Especifique la fecha y hora estimada de finalización. El contador en la web de inicio irá restando de forma dinámica segundo a segundo.
                    </p>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Fecha y Hora de Finalización:</label>
                      <input
                        type="datetime-local"
                        value={tempMaintenanceEndTimestamp}
                        onChange={(e) => setTempMaintenanceEndTimestamp(e.target.value)}
                        className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-amber-500 font-mono text-center tracking-wider"
                      />
                    </div>

                    {/* Quick presets */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Atajos Rápidos (Sumar Tiempo):</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: '+15 min', min: 15 },
                          { label: '+30 min', min: 30 },
                          { label: '+1 Hora', min: 60 },
                          { label: '+2 Horas', min: 120 },
                          { label: '+4 Horas', min: 240 },
                          { label: '+12 Horas', min: 720 }
                        ].map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const now = new Date();
                              const future = new Date(now.getTime() + p.min * 60 * 1000);
                              const year = future.getFullYear();
                              const month = String(future.getMonth() + 1).padStart(2, '0');
                              const day = String(future.getDate()).padStart(2, '0');
                              const hours = String(future.getHours()).padStart(2, '0');
                              const minutes = String(future.getMinutes()).padStart(2, '0');
                              setTempMaintenanceEndTimestamp(`${year}-${month}-${day}T${hours}:${minutes}`);
                              showToast(`⏰ Temporizador configurado para finalizar en ${p.label}`);
                            }}
                            className="bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-850 hover:border-slate-750 text-[10px] font-bold py-2 rounded-lg cursor-pointer transition text-center"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Real-time Countdown Live Preview */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-center space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">Vista Previa Regresiva en Vivo</span>
                      <CountdownPreview targetTimestamp={tempMaintenanceEndTimestamp} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateStateWithLog({
                          maintenanceModeEnabled: tempMaintenanceModeEnabled,
                          maintenanceReason: tempMaintenanceReason,
                          maintenanceEndTimestamp: tempMaintenanceEndTimestamp
                        }, `Configuró modo mantenimiento: ${tempMaintenanceModeEnabled ? 'ACTIVADO' : 'DESACTIVADO'} | Motivo: "${tempMaintenanceReason}" | Finaliza: ${tempMaintenanceEndTimestamp || 'Indefinido'}`);
                        showToast(`💾 ¡Estado de mantenimiento guardado con éxito!`);
                      }}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black uppercase tracking-widest text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <Save className="w-5 h-5" />
                      <span>Guardar Estado</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTempMaintenanceModeEnabled(false);
                        setTempMaintenanceReason('Actualización y optimización de base de datos relacional de acopio');
                        setTempMaintenanceEndTimestamp('');
                        showToast('🔄 Se han restablecido los valores por defecto locales (Recuerde hacer clic en Guardar)');
                      }}
                      className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
                    >
                      Limpiar Configuración
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CONTENIDO PESTAÑA 10: SALUDA AL SISTEMA & ANÁLISIS FORENSE --- */}
        {activeTab === 'saludar_sistema' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-full">Consola de Diagnóstico</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-3 flex items-center gap-2.5 font-sans">
                  <Terminal className="w-8 h-8 text-amber-400 animate-pulse" />
                  <span>💻 SALUDA AL SISTEMA Y ANÁLISIS FORENSE</span>
                </h2>
                <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
                  Realice diagnósticos del sistema, latencia de conexión, integridad de tablas y validación de esquemas en caliente de la base de datos de producción Supabase.
                </p>
              </div>

              <button
                onClick={handleFetchForensic}
                disabled={loadingForensic}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition cursor-pointer shrink-0 text-sm font-bold"
              >
                <RefreshCw className={`w-5 h-5 ${loadingForensic ? 'animate-spin' : ''}`} />
                <span>{loadingForensic ? 'Analizando...' : 'Iniciar Análisis Forense'}</span>
              </button>
            </div>

            {/* Saludo formal del sistema */}
            {greetMessage && (
              <div className="bg-slate-900 p-6 rounded-3xl border border-emerald-500/40 shadow-xl bg-gradient-to-r from-slate-950 to-slate-900">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Respuesta del Sistema</h4>
                    <p className="text-white text-base font-bold mt-1.5 leading-relaxed italic">
                      "{greetMessage}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {forensicError && (
              <div className="bg-rose-950/40 p-6 rounded-3xl border border-rose-500/40 text-rose-200 text-sm font-medium flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-rose-500 shrink-0" />
                <span>{forensicError}</span>
              </div>
            )}

            {forensicData && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Panel lateral: Metadatos del Sistema */}
                <div className="lg:col-span-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Información del Entorno</h3>
                  
                  <div className="space-y-4 font-mono text-xs text-slate-300">
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500">CLIENTE SUPABASE</span>
                      <span className={forensicData.clientInitialized ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {forensicData.clientInitialized ? 'INICIALIZADO' : 'NULO'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500">ESTADO SUPABASE</span>
                      <span className={forensicData.supabaseActive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {forensicData.supabaseActive ? 'CONECTADO (CLOUD)' : 'DESCONECTADO'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500">BASE DE DATOS URL</span>
                      <span className="text-slate-100 font-bold select-all">{forensicData.databaseUrl}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500">HORA DE AUDITORÍA</span>
                      <span className="text-slate-100 font-bold">{new Date(forensicData.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed font-mono">
                    <span className="text-[#008CBA] font-bold uppercase block mb-1">Nota del Auditor Forense:</span>
                    Este análisis valida la conectividad mediante un túnel HTTP a Supabase. Si las credenciales no son válidas, la consulta lanzará un error de autenticación con código de excepción API.
                  </div>
                </div>

                {/* Checks List */}
                <div className="lg:col-span-8 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Pruebas de Integridad Ejecutadas</h3>
                  
                  <div className="space-y-3">
                    {forensicData.checks?.map((check: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          check.status === 'OK' 
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        }`}>
                          {check.status === 'OK' ? <CheckCircle2 className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                        </div>
                        
                        <div className="grow">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm text-white">{check.name}</span>
                            {check.latencyMs !== undefined && (
                              <span className="text-[10px] font-mono text-slate-400 font-bold">Latencia: {check.latencyMs} ms</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed font-mono">
                            {check.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- MODAL PARA CONFIRMACIÓN DE BORRADO DE BASE DE DATOS (CONTRASENA 869987) --- */}
        {isClearModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fade-in text-[#1A202C]">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
                <Trash2 className="w-8 h-8 animate-bounce" />
              </div>

              <h4 className="text-xl font-black uppercase tracking-tight text-center text-slate-900 mb-1">
                ⚠️ CONFIRMACIÓN DE OPERACIÓN CRÍTICA
              </h4>
              <p className="text-xs text-rose-600 text-center font-bold uppercase tracking-wider mb-6">
                ESTA ACCIÓN ELIMINARÁ TODA LA BASE DE DATOS E INVENTARIO
              </p>

              <form onSubmit={handleClearAllDataSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    Contraseña de Seguridad Requerida
                  </label>
                  <input
                    type="password"
                    required
                    value={clearPassword}
                    onChange={(e) => setClearPassword(e.target.value)}
                    placeholder="Ingrese la contraseña para continuar..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none transition font-medium"
                  />
                </div>

                {clearError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 leading-relaxed">
                    {clearError}
                  </div>
                )}

                {clearSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 leading-relaxed">
                    {clearSuccess}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsClearModalOpen(false)}
                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase tracking-wider rounded-2xl text-xs transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-wider rounded-2xl text-xs shadow-lg shadow-rose-600/20 transition cursor-pointer"
                  >
                    Confirmar Borrado
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      {/* --- MODAL PARA CAMBIO RÁPIDO DE PERFIL DE OPERARIO --- */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in text-[#1A202C]">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-blue-50 text-[#008CBA] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-black uppercase tracking-tight text-center text-slate-900 mb-1">
              Firma de Operario de Turno
            </h4>
            <p className="text-xs text-slate-500 text-center font-medium mb-6">
              Seleccione bajo qué perfil operará en esta consola. Cada cambio guardado quedará registrado en la base de datos de auditoría con su firma.
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {(state.adminUsers || []).map((u) => {
                const isActive = activeUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSelectActiveUser(u)}
                    className="w-full p-4 rounded-2xl border text-left transition duration-200 flex items-center gap-3 cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-850 group"
                  >
                    <span className="text-2xl bg-white p-2 rounded-xl border border-slate-200 shrink-0 select-none">{u.avatar || '👤'}</span>
                    <div className="grow">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-slate-900">{u.name}</span>
                        {isActive && <span className="px-1.5 py-0.2 bg-emerald-500/15 text-emerald-700 text-[8px] font-black uppercase rounded tracking-wider border border-emerald-500/20">Activo</span>}
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{u.role}</span>
                    </div>
                    {!isActive && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#008CBA] opacity-0 group-hover:opacity-100 transition">
                        Seleccionar →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>* Para dar de alta nuevos perfiles, acceda a la pestaña <b>Control de Usuarios</b>.</span>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

// Componente para vista previa del temporizador en el panel administrativo
function CountdownPreview({ targetTimestamp }: { targetTimestamp: string }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true
  });

  React.useEffect(() => {
    if (!targetTimestamp) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(targetTimestamp).getTime();
      const diff = target - now;

      if (isNaN(diff) || diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isExpired: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  if (!targetTimestamp) {
    return <span className="text-[11px] text-slate-500 font-bold block py-1">⏳ SIN CONFIGURAR</span>;
  }

  if (timeLeft.isExpired) {
    return <span className="text-xs text-rose-500 font-black uppercase tracking-wider block py-1 animate-pulse">⏱️ EXPIRADO / EN LÍNEA</span>;
  }

  return (
    <div className="flex justify-center gap-3 text-white py-1">
      <div className="flex flex-col items-center">
        <span className="text-xl font-black font-mono leading-none text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[8px] font-black uppercase text-slate-500 mt-1">Horas</span>
      </div>
      <span className="text-xl font-black text-amber-500 animate-pulse">:</span>
      <div className="flex flex-col items-center">
        <span className="text-xl font-black font-mono leading-none text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[8px] font-black uppercase text-slate-500 mt-1">Minutos</span>
      </div>
      <span className="text-xl font-black text-amber-500 animate-pulse">:</span>
      <div className="flex flex-col items-center">
        <span className="text-xl font-black font-mono leading-none text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[8px] font-black uppercase text-slate-500 mt-1">Segundos</span>
      </div>
    </div>
  );
}

