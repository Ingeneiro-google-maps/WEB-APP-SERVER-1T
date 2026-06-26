import { GlobalState } from '../types';

export const INITIAL_STATE: GlobalState = {
  campaignTitle: 'Por 1T — Ayuda Humanitaria Emergencia Venezuela',
  emergencySubtitle: 'Respuesta Operativa de Emergencia por el Terremoto en Mérida, Trujillo y Táchira. Cada kilo suma para salvar vidas.',
  headerAlertText: 'Emergencia Nacional #VEN-2026: Terremoto en Los Andes (Mérida, Trujillo, Táchira)',
  heroBadgeText: '🇻🇪 Emergencia Humanitaria • Terremoto Venezuela',
  heroTitleRow1: 'AYUDA VITAL',
  heroTitleRow2: 'POR 1 TONELADA',
  heroTitleRow3: 'DESDE ESPAÑA',
  globalTargetTons: 1, // Meta inicial: 1 Tonelada (1,000 kg). Puede ampliarse en el panel admin.
  lastSyncTime: new Date().toISOString(),
  nextSyncTime: new Date(Date.now() + 3600 * 1000).toISOString(),
  googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1PukE4Ns_98aDcHbsTth3Mx6_tJNQcFmC/edit?gid=762536088#gid=762536088',
  googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbxfiM27NiOzQx9FWqn2AFG6IeaG_MyCcNKTjiA29YF8MZ9NObXDlSUG7bLqWl_rHiw/exec',
  autoSyncEnabled: true,
  syncIntervalMinutes: 10,
  supplies: [
    {
      id: 'sup-1',
      category: 'Alimentos no perecederos',
      name: 'Harina de Maíz, Arroz y Pasta',
      currentKilos: 340,
      targetKilos: 500,
      unit: 'kg',
      iconName: 'Utensils'
    },
    {
      id: 'sup-2',
      category: 'Alimentos no perecederos',
      name: 'Granos (Caraotas/Lentejas) y Enlatados',
      currentKilos: 185,
      targetKilos: 300,
      unit: 'kg',
      iconName: 'PackageOpen'
    },
    {
      id: 'sup-3',
      category: 'Agua Potable',
      name: 'Agua Embotellada y Sales de Rehidratación',
      currentKilos: 210,
      targetKilos: 400,
      unit: 'kg',
      iconName: 'Droplets'
    },
    {
      id: 'sup-4',
      category: 'Ropa y Abrigo',
      name: 'Mantas Térmicas y Ropa de Abrigo (Todas las tallas)',
      currentKilos: 95,
      targetKilos: 200,
      unit: 'kg',
      iconName: 'Shirt'
    },
    {
      id: 'sup-5',
      category: 'Medicinas e Insumos',
      name: 'Kits de Primeros Auxilios y Analgésicos',
      currentKilos: 45,
      targetKilos: 100,
      unit: 'kg',
      iconName: 'Cross'
    }
  ],
  centers: [
    {
      id: 'cent-madrid',
      city: 'Madrid',
      country: 'España',
      name: 'Almacén Humanitario Central Madrid — Cuatro Caminos',
      address: 'Calle Bravo Murillo 122, Tetuán, Madrid 28020',
      contact: '+34 910-239182 / madrid@por1t.org',
      hours: 'Lunes a Sábado: 10:00 AM - 8:30 PM (Recepción continua para envío aéreo)',
      acceptedItems: ['Alimentos no perecederos', 'Fórmulas infantiles', 'Medicinas en caja original', 'Mantas térmicas'],
      urgentNeeds: ['Antibióticos de amplio espectro', 'Leche infantil en polvo', 'Pastillas potabilizadoras'],
      mapsUrl: 'https://maps.google.com/?q=Calle+Bravo+Murillo+122+Madrid'
    },
    {
      id: 'cent-barcelona',
      city: 'Barcelona',
      country: 'España',
      name: 'Almacén Solidario Barcelona — Sants',
      address: 'Carrer de Sants 340, Sants-Montjuïc, Barcelona 08028',
      contact: '+34 930-182931 / barcelona@por1t.org',
      hours: 'Lunes a Sábado: 10:00 AM - 8:30 PM',
      acceptedItems: ['Alimentos no perecederos', 'Fórmulas infantiles', 'Medicinas en caja original'],
      urgentNeeds: ['Leche en polvo', 'Conservas en lata', 'Gasas y vendajes'],
      mapsUrl: 'https://maps.google.com/?q=Carrer+de+Sants+340+Barcelona'
    },
    {
      id: 'cent-valencia',
      city: 'Valencia',
      country: 'España',
      name: 'Punto Humanitario Valencia — Ruzafa',
      address: 'Carrer de Cuba 48, Eixample, Valencia 46006',
      contact: '+34 960-492102 / valencia@por1t.org',
      hours: 'Martes a Domingo: 11:00 AM - 7:00 PM',
      acceptedItems: ['Arroz, pasta y legumbres secas', 'Pañales y artículos de higiene'],
      urgentNeeds: ['Artículos de higiene femenina', 'Jabón desinfectante', 'Comida lista para consumir'],
      mapsUrl: 'https://maps.google.com/?q=Carrer+de+Cuba+48+Valencia'
    },
    {
      id: 'cent-tenerife',
      city: 'Santa Cruz de Tenerife',
      country: 'España',
      name: 'Centro Solidario Canarias — Sede Principal',
      address: 'Calle Castillo 45, Santa Cruz de Tenerife 38002',
      contact: '+34 922-182910 / canarias@por1t.org',
      hours: 'Lunes a Viernes: 9:00 AM - 7:00 PM',
      acceptedItems: ['Alimentos secos precintados', 'Kits de primeros auxilios'],
      urgentNeeds: ['Alimentos infantiles no perecederos', 'Analgésicos'],
      mapsUrl: 'https://maps.google.com/?q=Calle+Castillo+45+Santa+Cruz+de+Tenerife'
    }
  ],
  faqs: [
    {
      id: 'faq-1',
      category: 'Donaciones',
      question: '¿Qué significa la campaña "Por 1T" y cómo se calcula el progreso?',
      answer: 'La iniciativa "Por 1T" (Por 1 Tonelada) nace con la misión de movilizar rápidamente bloques de 1,000 kilogramos de ayuda vital hacia las zonas afectadas por el sismo en Venezuela. Cada paquete de arroz, botella de agua o caja de medicinas que entra a nuestros centros de acopio es pesado y registrado en un archivo Excel conectado en tiempo real con esta plataforma.'
    },
    {
      id: 'faq-2',
      category: 'Donaciones',
      question: '¿Cuáles son los insumos MÁS críticos que puedo llevar hoy mismo?',
      answer: 'Actualmente nuestra prioridad absoluta son: 1) Alimentos no perecederos de fácil cocición (arroz, harina de maíz, pasta, granos), 2) Comida enlatada lista para consumir (atún, sardinas), 3) Agua embotellada y pastillas potabilizadoras, 4) Fármacos de urgencia (analgésicos, antibióticos, alcohol, gasas) y 5) Mantas térmicas.'
    },
    {
      id: 'faq-3',
      category: 'Logística',
      question: '¿Cómo garantizan que la ayuda llegue directamente a los damnificados?',
      answer: 'Trabajamos bajo estrictos protocolos de la ONU y Cruz Roja Internacional, en coordinación directa con parroquias locales, cuerpos de bomberos y redes médicas comunitarias en Mérida, Táchira y Trujillo. No aceptamos intermediarios políticos ni cobramos por la distribución.'
    },
    {
      id: 'faq-4',
      category: 'Transparencia',
      question: '¿Cómo funciona la actualización automática cada hora desde Google Drive (Excel)?',
      answer: 'Nuestros jefes de almacén en cada centro de acopio actualizan una hoja de cálculo en Google Drive. El servidor de "Por 1T" consulta dicho Excel automáticamente cada 60 minutos (o mediante sincronización manual instantánea de los administradores) para reflejar los kilos exactos en la barra de progreso pública.'
    },
    {
      id: 'faq-5',
      category: 'Voluntariado',
      question: 'No tengo dinero ni insumos en este momento, ¿puedo ayudar como voluntario?',
      answer: '¡Por supuesto! Necesitamos manos urgentes en Caracas, Maracaibo y San Cristóbal para clasificar ropa, embalar kits familiares de alimentos y etiquetar medicinas. Puedes registrarte haciendo clic en el botón "Ser Voluntario".'
    }
  ],
  pledges: [
    {
      id: 'ple-excel-1',
      donorName: 'José',
      email: 'jose@donante.es',
      city: 'Madrid',
      pledgeKilos: 1,
      category: 'Baterías',
      description: 'Pilas AA y baterías externas portátiles precintadas',
      message: 'Entrega en centro de acopio Cuatro Caminos, Madrid.',
      date: new Date().toLocaleDateString()
    },
    {
      id: 'ple-excel-2',
      donorName: 'hhh',
      email: 'hhh@solidario.com',
      city: 'Barcelona',
      pledgeKilos: 8,
      category: 'Alimentos no perecederos',
      description: 'Arroz, pasta, lentejas y conservas en lata',
      message: 'Donación directa para las familias en Mérida.',
      date: new Date().toLocaleDateString()
    },
    {
      id: 'ple-excel-3',
      donorName: 'Voluntario Diáspora',
      email: 'contacto@redes.org',
      city: 'Valencia',
      pledgeKilos: 9,
      category: 'Ropa',
      description: 'Ropa térmica y abrigos infantiles clasificados',
      message: 'Enviado con transportista colaborador.',
      date: new Date().toLocaleDateString()
    }
  ],
  syncLogs: [
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      status: 'success',
      message: 'Sincronización horaria con Google Drive completada. +45 kg añadidos en Alimentos.',
      kilosUpdated: 875
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 3600 * 1000).toLocaleTimeString(),
      status: 'success',
      message: 'Verificación automática de conectividad con Excel Cloud (Google Sheets): OK.',
      kilosUpdated: 830
    }
  ],
  news: [
    {
      id: 'news-1',
      title: '🔴 Alerta Logística: Despacho aéreo urgente hacia la Zona Cero',
      content: 'El convoy coordinado desde el Almacén de Madrid (España) ha partido cargado con 450 kg de alimentos no perecederos y medicinas de urgencia para el Hospital de Mérida. Reiteramos el llamado a la diáspora en Europa.',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      severity: 'red',
      author: 'Coordinación Central Madrid'
    },
    {
      id: 'news-2',
      title: '🟠 Aviso Operativo: Recepción continua en Almacenes de España y Colombia',
      content: 'Nuestros centros de recogida en Cuatro Caminos (Madrid) y Parque 93 (Bogotá) están recibiendo ropa limpia de abrigo y kits infantiles. Faltan apenas kilos para superar la primera tonelada métrica.',
      date: new Date(Date.now() - 3600 * 3000).toLocaleDateString() + ' ' + new Date(Date.now() - 3600 * 3000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      severity: 'orange',
      author: 'Almacén Red Internacional'
    },
    {
      id: 'news-3',
      title: '🟢 Logro Dinámico: Superados los 800 kg en el Contador Global',
      content: 'Gracias a las actualizaciones en tiempo real desde nuestro archivo Excel en Google Drive, confirmamos que estamos en fase Naranja/Amarilla avanzando firmemente hacia el Verde (1 Tonelada). ¡Cada gramo cuenta para Venezuela!',
      date: new Date(Date.now() - 3600 * 6000).toLocaleDateString() + ' ' + new Date(Date.now() - 3600 * 6000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      severity: 'green',
      author: 'Sistema Automático Por 1T'
    }
  ],
  suggestions: [
    {
      id: 'sug-1',
      userName: 'Elena Martínez',
      email: 'elena@ejemplo.es',
      type: 'logistica',
      message: '¿Podrían habilitar recogida de ropa térmica los domingos por la mañana en la sede de Madrid?',
      date: new Date(Date.now() - 3600 * 4000).toLocaleDateString()
    }
  ],
  hasNewDonationAlert: false,
  adminUsers: [
    {
      id: 'usr-orlando',
      name: 'Ing. Orlando Galdámez',
      email: 'eng.orlandogaldamez@gmail.com',
      role: 'Super Admin',
      avatar: '👨‍💻',
      createdAt: '26/06/2026'
    },
    {
      id: 'usr-maria',
      name: 'María Corina',
      email: 'maria.corina@por1t.org',
      role: 'Coordinadora de Campaña',
      avatar: '👩‍💼',
      createdAt: '26/06/2026'
    },
    {
      id: 'usr-carlos',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@por1t.org',
      role: 'Coordinador de Logística',
      avatar: '🚛',
      createdAt: '26/06/2026'
    }
  ],
  userChangeLogs: [
    {
      id: 'ulog-1',
      userId: 'usr-orlando',
      userName: 'Ing. Orlando Galdámez',
      userEmail: 'eng.orlandogaldamez@gmail.com',
      date: '26/06/2026',
      time: '09:15:30',
      action: 'Configuró la meta global de recolección en 1 Tonelada y vinculó el webhook de escritura de Google Sheets.'
    },
    {
      id: 'ulog-2',
      userId: 'usr-maria',
      userName: 'María Corina',
      userEmail: 'maria.corina@por1t.org',
      date: '26/06/2026',
      time: '10:02:15',
      action: 'Actualizó los centros de acopio autorizados en Madrid y Barcelona, y verificó las necesidades urgentes de agua potable.'
    },
    {
      id: 'ulog-3',
      userId: 'usr-carlos',
      userName: 'Carlos Mendoza',
      userEmail: 'carlos.mendoza@por1t.org',
      date: '26/06/2026',
      time: '11:10:45',
      action: 'Publicó aviso urgente de envío de convoy humanitario cargado con 450 kg de alimentos no perecederos.'
    }
  ],
  visibleBlocks: {
    suppliesGrid: true,
    centersGrid: true,
    donationsList: true,
    newsSection: true,
    faqSection: true,
    suggestionsSection: true
  }
};
