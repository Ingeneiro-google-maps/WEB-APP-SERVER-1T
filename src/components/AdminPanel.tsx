import React, { useState } from 'react';
import { GlobalState, SupplyItem, CollectionCenter, FAQItem, AdminUser, UserChangeLog } from '../types';
import { 
  Settings, RefreshCw, Plus, Trash2, Edit3, Save, Database, 
  FileSpreadsheet, CheckCircle2, AlertOctagon, ArrowUpRight, 
  Lock, Download, Building2, Newspaper, HelpCircle, Lightbulb, 
  Search, X, ExternalLink, Package, MapPin, Phone, Clock,
  Users, History, User, UserPlus, ShieldCheck, Calendar, Terminal, Activity
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'excel_bd' | 'centros' | 'noticias' | 'faqs' | 'sugerencias' | 'config' | 'portada' | 'usuarios' | 'cambios_web' | 'saludar_sistema'>('excel_bd');
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
  const [donationPass, setDonationPass] = useState<string>(state.donationPassword || 'VENEZUELAVIVE2026');

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

  const showToast = (txt: string) => {
    setMessage(txt);
    setTimeout(() => setMessage(null), 3500);
  };

  // --- GESTIÓN CENTROS DE ACOPIO ---
  const handleAddCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCenter.name || !newCenter.address) return;
    const item: CollectionCenter = {
      id: 'cent-' + Date.now(),
      city: newCenter.city || 'Madrid',
      country: newCenter.country || 'España',
      name: newCenter.name,
      address: newCenter.address,
      contact: newCenter.contact || '',
      hours: newCenter.hours || '',
      acceptedItems: newCenter.acceptedItems || ['Alimentos'],
      urgentNeeds: newCenter.urgentNeeds || [],
      mapsUrl: newCenter.mapsUrl || 'https://maps.google.com'
    };
    handleUpdateStateWithLog(
      { centers: [...state.centers, item] },
      `Añadió un nuevo centro de acopio en ${item.city}: "${item.name}"`
    );
    setNewCenter({ city: 'Madrid', country: 'España', name: '', address: '', contact: '', hours: '10:00 AM - 8:00 PM', acceptedItems: ['Alimentos no perecederos'], urgentNeeds: [] });
    showToast(`✅ Centro "${item.name}" añadido correctamente.`);
  };

  const handleStartEditCenter = (center: CollectionCenter) => {
    setEditingCenterId(center.id);
    setEditCenterForm({ ...center });
  };

  const handleSaveEditCenter = () => {
    if (!editingCenterId) return;
    const updated = state.centers.map(c => c.id === editingCenterId ? { ...c, ...editCenterForm } as CollectionCenter : c);
    const targetName = editCenterForm.name || editingCenterId;
    handleUpdateStateWithLog(
      { centers: updated },
      `Modificó los datos del centro de acopio en ${editCenterForm.city || ''}: "${targetName}"`
    );
    setEditingCenterId(null);
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
      heroTitleRow3: heroTitleRow3State
    }, `Personalizó y actualizó los títulos y avisos de la portada web principal`);
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

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#008CBA] hover:bg-blue-600 text-white font-black uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
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
            {state.supabaseActive ? (
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
                    ¡La sincronización en la nube está activa! Todos los textos de la portada, la información general, las noticias, el inventario y las FAQs se almacenan y replican globalmente en tiempo real para todos los visitantes del mundo.
                  </p>
                </div>
              </div>
            ) : (
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
