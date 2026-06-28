import { GlobalState } from '../types';

export const INITIAL_STATE: GlobalState = {
  "codeVersion": "1.5",
  "autoUpdateActive": true,
  "campaignTitle": "Por 1T — Ayuda Humanitaria Emergencia Venezuela",
  "emergencySubtitle": "Respuesta Operativa de Emergencia por el Terremoto en Mérida, Trujillo y Táchira. Cada kilo suma para salvar vidas.",
  "headerAlertText": "Emergencia Nacional #VEN-2026: Terremoto en Los Andes (Mérida, Trujillo, Táchira)",
  "heroBadgeText": "🇻🇪 Emergencia Humanitaria • Terremoto Venezuela",
  "heroTitleRow1": "AYUDA VITAL",
  "heroTitleRow2": "POR 1 TONELADA",
  "heroTitleRow3": "DESDE ESPAÑA",
  "globalTargetTons": 1,
  "lastSyncTime": "2026-06-27T19:57:56.376Z",
  "nextSyncTime": "2026-06-27T20:05:52.405Z",
  "googleSheetUrl": "https://docs.google.com/spreadsheets/d/1PukE4Ns_98aDcHbsTth3Mx6_tJNQcFmC/edit?gid=762536088#gid=762536088",
  "googleSheetWebhookUrl": "https://script.google.com/macros/s/AKfycbxfiM27NiOzQx9FWqn2AFG6IeaG_MyCcNKTjiA29YF8MZ9NObXDlSUG7bLqWl_rHiw/exec",
  "autoSyncEnabled": true,
  "syncIntervalMinutes": 10,
  "supplies": [
    {
      "id": "sup-1",
      "category": "Alimentos no perecederos",
      "name": "Harina de Maíz, Arroz y Pasta",
      "currentKilos": 48,
      "targetKilos": 500,
      "unit": "kg",
      "iconName": "Utensils"
    },
    {
      "id": "sup-2",
      "category": "Alimentos no perecederos",
      "name": "Granos (Caraotas/Lentejas) y Enlatados",
      "currentKilos": 0,
      "targetKilos": 300,
      "unit": "kg",
      "iconName": "PackageOpen"
    },
    {
      "id": "sup-3",
      "category": "Agua Potable",
      "name": "Agua Embotellada y Sales de Rehidratación",
      "currentKilos": 0,
      "targetKilos": 400,
      "unit": "kg",
      "iconName": "Droplets"
    },
    {
      "id": "sup-4",
      "category": "Ropa y Abrigo",
      "name": "Mantas Térmicas y Ropa de Abrigo (Todas las tallas)",
      "currentKilos": 45,
      "targetKilos": 200,
      "unit": "kg",
      "iconName": "Shirt"
    },
    {
      "id": "sup-5",
      "category": "Medicinas e Insumos",
      "name": "Kits de Primeros Auxilios y Analgésicos",
      "currentKilos": 126,
      "targetKilos": 100,
      "unit": "kg",
      "iconName": "Cross"
    }
  ],
  "centers": [
    {
      "id": "cent-1782565319291",
      "city": "Ribeira",
      "country": "España",
      "name": "O Delas (Cafetería)",
      "address": "laza Uxío Novoneyra, Bajo 2, 15960, Ribeira (A Coruña)",
      "contact": "711 51 18 50",
      "hours": "7:30–22:00",
      "acceptedItems": ["Alimentos no perecederos", "Medicinas", "Mantas"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782565378800",
      "city": "Ribeira",
      "country": "España",
      "name": "Café Bar A Pequecha",
      "address": "Avda. do Malecón, 10, 15960, Ribeira (A Coruña)",
      "contact": "881 092 153",
      "hours": "Lunes cerrado. Martes a jueves 9:00–15:30 y 18:00–23:00. Viernes 9:30–15:30 y 18:00–00:00. Sábado 9:00–00:00. Domingo 9:00–16:00.",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782565426082",
      "city": "Ribeira",
      "country": "España",
      "name": "Cafetería Flor de Toxo",
      "address": "Rua Galicia 99",
      "contact": "",
      "hours": "Alimentos no perecederos, baterías, ropa, insumos médicos",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": [],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782565572397",
      "city": "Ribeira",
      "country": "España",
      "name": "A Cabaña Brasería",
      "address": "Avda. Rosalía de Castro, 37, 15960, Ribeira (A Coruña)",
      "contact": "881 121 172",
      "hours": "8:00–00:00 la mayoría de días",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782565661090",
      "city": "A Coruña",
      "country": "España",
      "name": "Bar Venus (Café Bar Venus)",
      "address": "Rúa Ramón Menéndez Pidal, 16, 15007 A Coruña",
      "contact": "",
      "hours": "11:00- 3:30 am",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782565735698",
      "city": "A Coruña",
      "country": "España",
      "name": "Flor de Azúcar (panadería-pastelería)",
      "address": "Calle Juan Díaz Porlier, 9 (barrio Matogrande), 15009, A Coruña",
      "contact": "662 25 11 89",
      "hours": "10:00-21:00",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566116421",
      "city": "A Coruña",
      "country": "España",
      "name": "Gomías Golosinas",
      "address": "Fuente Álamo, 22 Bajo, 15010, A Coruña",
      "contact": "633 900 116",
      "hours": "Lunes a domingo de 10:00 a 14:00 y de 16:00 a 21:00",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566161037",
      "city": "A Coruña",
      "country": "España",
      "name": "Sugary Club (Repostería Creativa)",
      "address": "Emilio González López, 53 Bajo, 15011, A Coruña",
      "contact": "624 189 825",
      "hours": "Lunes a viernes de 9:30 a 14:00 y de 16:30 a 19:00",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566196935",
      "city": "A Coruña",
      "country": "España",
      "name": "Van Barber's",
      "address": "Travesía de Rianxo, 7 Bajo, 15009, A Coruña",
      "contact": "",
      "hours": "No especificado",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566429878",
      "city": "A Coruña",
      "country": "España",
      "name": "Margarida Xoguetes",
      "address": "C. Paraíso, 26, 15175 Carral, A Coruña",
      "contact": "641 88 71 39",
      "hours": "10:00 AM – 2:00 PM, 5:00 – 8:00 PM",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566566226",
      "city": "Milladoiro",
      "country": "España",
      "name": "O Recuncho de Adrián",
      "address": "Rúa Agro do Medio, 13 Bajo, 15895, O Milladoiro, Ames (A Coruña)",
      "contact": "610 476 840",
      "hours": "Lunes a jueves 9:00–23:00. Viernes a domingo y festivos 9:00–23:30.",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566655789",
      "city": "Milladoiro",
      "country": "España",
      "name": "Korizza (Café/Brunch House)",
      "address": "Avda. Rosalía de Castro, 29, 15895, O Milladoiro, Ames (A Coruña)",
      "contact": "641 240 580",
      "hours": "Lunes 9:00–14:00 y 17:00–21:00. Martes cerrado. Miércoles a domingo 9:00–14:00 y 17:00–21:00.",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566757670",
      "city": "Sada",
      "country": "España",
      "name": "Supermarkt",
      "address": "Avenida Mariñas 7",
      "contact": "",
      "hours": "No especificado",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566892734",
      "city": "Rois",
      "country": "España",
      "name": "El Malecón",
      "address": "Lugar antequeira, 15, 15911 Antequeira, A Coruña",
      "contact": "612 56 59 77",
      "hours": "12:00 PM - 3:00 AM",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566963091",
      "city": "Bertamirans",
      "country": "España",
      "name": "Denny Barber Broth",
      "address": "Avenida da Maía, 63, 15220 Bertamiráns, A Coruña",
      "contact": "695 58 65 10",
      "hours": "9:30 AM – 2:00 PM, 4:00 – 8:30 PM",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782566999943",
      "city": "Vigo",
      "country": "España",
      "name": "Carrefour Express Teixugueiras",
      "address": "Calle Teixugueiras, 23, 36212, Vigo",
      "contact": "",
      "hours": "Lunes a sábado de 9:00 a 22:00. Festivos algunos días de 10:00 a 22:00 (o 9:00–14:00).",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782567047792",
      "city": "Santiago de Compostela",
      "country": "España",
      "name": "Lirio Studio Creativo",
      "address": "Romero donallo 23, Bajo",
      "contact": "625 42 93 97",
      "hours": "Domingo 16:00- 20:00 Lunes a viernes 17:00-20:00",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782567132794",
      "city": "Milladoiro",
      "country": "España",
      "name": "Go Compostela",
      "address": "Rua Palmeira 22A",
      "contact": "",
      "hours": "Sábado 12:30- 17:00. Domingo 12:30-00:00. Lunes a viernes: 12:30- 17:00",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782567317286",
      "city": "A Coruña",
      "country": "España",
      "name": "Hairlis",
      "address": "Rúa Agra do Orzán, 32, Bajo, 15010, A Coruña",
      "contact": "",
      "hours": "10:00- 20:00 excepto domingo",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782567656475",
      "city": "Ourense",
      "country": "España",
      "name": "Gozza!",
      "address": "Rúa Benito Vicetto, 1, 32004 Ourense",
      "contact": "698 13 77 30",
      "hours": "10:00 AM - 8:00 PM",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782572135741",
      "city": "Monforte de Lemos",
      "country": "España",
      "name": "A Nosa Bodeguilla",
      "address": "Praza campo San Antonio, #37",
      "contact": "",
      "hours": "8:00 AM – 12:00 AM",
      "acceptedItems": ["Alimentos no perecederos", "Medicinas", "Mantas"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782572254123",
      "city": "Brión",
      "country": "España",
      "name": "Café bar la terraza",
      "address": "C.c monte balado planta 3. Local 2",
      "contact": "",
      "hours": "10:00 AM – 1:00 AM Lunes cerrado",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782572529842",
      "city": "Ordes",
      "country": "España",
      "name": "Piscina Municipal de Ordes \"O Muiño\"",
      "address": "Piscina Municipal de Ordes \"O Muiño\", 15689 Ordes, A Coruña",
      "contact": "",
      "hours": "10:00 AM – 9:00 PM",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782572842899",
      "city": "Santiago de Compostela",
      "country": "España",
      "name": "Pollos y pepitos +58",
      "address": "Av. de Barcelona, 33, 15706 Santiago de Compostela, A Coruña",
      "contact": "",
      "hours": "Sábado: 10:00-16:00, 19:30-23:00 | Domingo: 11:00-16:00 | Lunes: 8:30-16:00, 19:30-23:00 | Martes y Miércoles: 8:30-17:00 | Jueves y Viernes: 8:30-16:00, 19:30-23:00",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782586913216",
      "city": "Chantada- Lugo",
      "country": "España",
      "name": "Pastelería Gofer",
      "address": "Avenida de Monforte 13 Bajo",
      "contact": "",
      "hours": "No especificado",
      "acceptedItems": ["Alimentos no perecederos", "Medicinas", "Mantas"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782588031649",
      "city": "Ribeira",
      "country": "España",
      "name": "Mj Tecsystem Ribeira",
      "address": "Avenida Rosalía De Castro número 2 , Ribeira 15960",
      "contact": "",
      "hours": "De 10:00 a 14:00 y de 17:00 a 20:30",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    },
    {
      "id": "cent-1782588076544",
      "city": "Santiago de Compostela",
      "country": "España",
      "name": "Phone Factory",
      "address": "avenida romero Donallo 25",
      "contact": "",
      "hours": "De 9:00 a 20:00 (Horario continuo)",
      "acceptedItems": ["Alimentos no perecederos"],
      "urgentNeeds": ["Alimentos no perecederos", "baterías", "ropa", "insumos médicos"],
      "mapsUrl": "https://maps.google.com"
    }
  ],
  "faqs": [
    {
      "id": "faq-1",
      "category": "Donaciones",
      "question": "¿Qué significa la campaña \"Por 1T\" y cómo se calcula el progreso?",
      "answer": "La iniciativa \"Por 1T\" (Por 1 Tonelada) nace con la misión de movilizar rápidamente bloques de 1,000 kilogramos de ayuda vital hacia las zonas afectadas por el sismo en Venezuela. Cada paquete de arroz, botella de agua o caja de medicinas que entra a nuestros centros de acopio es pesado y registrado en un archivo Excel conectado en tiempo real con esta plataforma."
    },
    {
      "id": "faq-2",
      "category": "Donaciones",
      "question": "¿Cuáles son los insumos MÁS críticos que puedo llevar hoy mismo?",
      "answer": "Actualmente nuestra prioridad absoluta son: 1) Alimentos no perecederos de fácil cocición (arroz, harina de maíz, pasta, granos), 2) Comida enlatada lista para consumir (atún, sardinas), 3) Agua embotellada y pastillas potabilizadoras, 4) Fármacos de urgencia (analgésicos, antibióticos, alcohol, gasas) y 5) Mantas térmicas."
    },
    {
      "id": "faq-3",
      "category": "Logística",
      "question": "¿Cómo garantizan que la ayuda llegue directamente a los damnificados?",
      "answer": "Trabajamos bajo estrictos protocolos de la ONU y Cruz Roja Internacional, en coordinación directa con parroquias locales, cuerpos de bomberos y redes médicas comunitarias en Mérida, Táchira y Trujillo. No aceptamos intermediarios políticos ni cobramos por la distribución."
    },
    {
      "id": "faq-4",
      "category": "Transparencia",
      "question": "¿Cómo funciona la actualización automática cada hora desde Google Drive (Excel)?",
      "answer": "Nuestros jefes de almacén en cada centro de acopio actualizan una hoja de cálculo en Google Drive. El servidor de \"Por 1T\" consulta dicho Excel automáticamente cada 60 minutos (o mediante sincronización manual instantánea de los administradores) para reflejar los kilos exactos en la barra de progreso pública."
    },
    {
      "id": "faq-5",
      "category": "Voluntariado",
      "question": "No tengo dinero ni insumos en este momento, ¿puedo ayudar como voluntario?",
      "answer": "¡Por supuesto! Necesitamos manos urgentes en Caracas, Maracaibo y San Cristóbal para clasificar ropa, embalar kits familiares de alimentos y etiquetar medicinas. Puedes registrarte haciendo clic en el botón \"Ser Voluntario\"."
    }
  ],
  "pledges": [
    {
      "id": "excel-1-48",
      "donorName": "Pollos y pepitos +58",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 48,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-2-35",
      "donorName": "Cotelga sl",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 35,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-3-7",
      "donorName": "Johana carvajal",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 7,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-4-60",
      "donorName": "Johana carvajal",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 60,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-5-20",
      "donorName": "Cotelga sl",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 20,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-6-4",
      "donorName": "Joana a carvajal",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 4,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-7-10",
      "donorName": "Anonimo",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 10,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-8-4",
      "donorName": "Anonimo",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 4,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-9-2",
      "donorName": "Cotelga sl",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 2,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-10-3",
      "donorName": "Anonimo",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 3,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-11-5",
      "donorName": "Adonis soto",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 5,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-12-8",
      "donorName": "Cotelga sl",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 8,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-13-8",
      "donorName": "Corelga",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 8,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-14-5",
      "donorName": "Anonimo",
      "email": "holla@pollospepitos58.com",
      "city": "Pollos y pepitos +58 (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 5,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    }
  ],
  "syncLogs": [
    {
      "id": "log-1782590152405",
      "timestamp": "7:55:52 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 14 donaciones de la hoja de cálculo. Peso total acumulado: 219 kg.",
      "kilosUpdated": 219
    },
    {
      "id": "log-1782589559555",
      "timestamp": "7:45:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 14 donaciones de la hoja de cálculo. Peso total acumulado: 219 kg.",
      "kilosUpdated": 219
    },
    {
      "id": "log-1782588960980",
      "timestamp": "7:36:00 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 12 donaciones de la hoja de cálculo. Peso total acumulado: 206 kg.",
      "kilosUpdated": 206
    },
    {
      "id": "log-1782588360008",
      "timestamp": "7:26:00 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 10 donaciones de la hoja de cálculo. Peso total acumulado: 193 kg.",
      "kilosUpdated": 193
    },
    {
      "id": "log-1782587759514",
      "timestamp": "7:15:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 7 donaciones de la hoja de cálculo. Peso total acumulado: 184 kg.",
      "kilosUpdated": 184
    },
    {
      "id": "log-1782587159517",
      "timestamp": "7:05:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 5 donaciones de la hoja de cálculo. Peso total acumulado: 170 kg.",
      "kilosUpdated": 170
    },
    {
      "id": "log-1782586559367",
      "timestamp": "6:55:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 4 donaciones de la hoja de cálculo. Peso total acumulado: 100 kg.",
      "kilosUpdated": 100
    },
    {
      "id": "log-1782585959505",
      "timestamp": "6:45:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 2 donaciones de la hoja de cálculo. Peso total acumulado: 58 kg.",
      "kilosUpdated": 58
    },
    {
      "id": "log-1782585359387",
      "timestamp": "6:35:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 2 donaciones de la hoja de cálculo. Peso total acumulado: 58 kg.",
      "kilosUpdated": 58
    },
    {
      "id": "log-1782584759578",
      "timestamp": "6:25:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 2 donaciones de la hoja de cálculo. Peso total acumulado: 58 kg.",
      "kilosUpdated": 58
    },
    {
      "id": "log-1782584159734",
      "timestamp": "6:15:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    },
    {
      "id": "log-1782583559367",
      "timestamp": "6:05:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    },
    {
      "id": "log-1782582959477",
      "timestamp": "5:55:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    },
    {
      "id": "log-1782582360174",
      "timestamp": "5:46:00 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    },
    {
      "id": "log-1782581759311",
      "timestamp": "5:35:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    },
    {
      "id": "log-1782581162805",
      "timestamp": "5:26:02 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    },
    {
      "id": "log-1782580559328",
      "timestamp": "5:15:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    },
    {
      "id": "log-1782579959343",
      "timestamp": "5:05:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    },
    {
      "id": "log-1782579359214",
      "timestamp": "4:55:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    },
    {
      "id": "log-1782578759422",
      "timestamp": "4:45:59 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 1 donaciones de la hoja de cálculo. Peso total acumulado: 10 kg.",
      "kilosUpdated": 10
    }
  ],
  "news": [
    {
      "id": "news-1",
      "title": "🔴 Alerta Logística: Despacho aéreo urgente hacia la Zona Cero",
      "content": "El convoy coordinado desde el Almacén de Madrid (España) ha partido cargado con 450 kg de alimentos no perecederos y medicinas de urgencia para el Hospital de Mérida. Reiteramos el llamado a la diáspora en Europa.",
      "date": "6/27/2026 07:25 AM",
      "severity": "red",
      "author": "Coordinación Central Madrid"
    },
    {
      "id": "news-2",
      "title": "🟠 Aviso Operativo: Recepción continua en Almacenes de España y Colombia",
      "content": "Nuestros centros de recogida en Cuatro Caminos (Madrid) y Parque 93 (Bogotá) están recibiendo ropa limpia de abrigo y kits infantiles. Faltan apenas kilos para superar la primera tonelada métrica.",
      "date": "6/27/2026 04:25 AM",
      "severity": "orange",
      "author": "Almacén Red Internacional"
    },
    {
      "id": "news-3",
      "title": "🟢 Logro Dinámico: Superados los 800 kg en el Contador Global",
      "content": "Gracias a las actualizaciones en tiempo real desde nuestro archivo Excel en Google Drive, confirmamos que estamos en fase Naranja/Amarilla avanzando firmemente hacia el Verde (1 Tonelada). ¡Cada gramo cuenta para Venezuela!",
      "date": "6/27/2026 01:25 AM",
      "severity": "green",
      "author": "Sistema Automático Por 1T"
    }
  ],
  "suggestions": [
    {
      "id": "sug-1",
      "userName": "Elena Martínez",
      "email": "elena@ejemplo.es",
      "type": "logistica",
      "message": "¿Podrían habilitar recogida de ropa térmica los domingos por la mañana en la sede de Madrid?",
      "date": "6/27/2026"
    }
  ],
  "hasNewDonationAlert": false,
  "adminUsers": [
    {
      "id": "usr-orlando",
      "name": "Ing. Orlando Galdámez",
      "email": "eng.orlandogaldamez@gmail.com",
      "role": "Super Admin",
      "avatar": "👨‍💻",
      "createdAt": "26/06/2026"
    },
    {
      "id": "usr-maria",
      "name": "María Corina",
      "email": "maria.corina@por1t.org",
      "role": "Coordinadora de Campaña",
      "avatar": "👩‍💼",
      "createdAt": "26/06/2026"
    },
    {
      "id": "usr-carlos",
      "name": "Carlos Mendoza",
      "email": "carlos.mendoza@por1t.org",
      "role": "Coordinador de Logística",
      "avatar": "🚛",
      "createdAt": "26/06/2026"
    }
  ],
  "userChangeLogs": [
    {
      "id": "ulog-1782590276100-8m6i",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "27/06/2026",
      "time": "21:57:56",
      "action": "Actualizó la configuración de estados, leyendas y visibilidad del contador en vivo de Navarra"
    },
    {
      "id": "ulog-1782570039652-6gjf",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "27/06/2026",
      "time": "16:20:39",
      "action": "Eliminó la categoría de donación \"Agua Potable Embotellada\""
    },
    {
      "id": "ulog-1",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "26/06/2026",
      "time": "09:15:30",
      "action": "Configuró la meta global de recolección en 1 Tonelada y vinculó el webhook de escritura de Google Sheets."
    },
    {
      "id": "ulog-2",
      "userId": "usr-maria",
      "userName": "María Corina",
      "userEmail": "maria.corina@por1t.org",
      "date": "26/06/2026",
      "time": "10:02:15",
      "action": "Actualizó los centros de acopio autorizados en Madrid y Barcelona, y verificó las necesidades urgentes de agua potable."
    },
    {
      "id": "ulog-3",
      "userId": "usr-carlos",
      "userName": "Carlos Mendoza",
      "userEmail": "carlos.mendoza@por1t.org",
      "date": "26/06/2026",
      "time": "11:10:45",
      "action": "Publicó aviso urgente de envío de convoy humanitario cargado con 450 kg de alimentos no perecederos."
    }
  ],
  "visibleBlocks": {
    "suppliesGrid": true,
    "centersGrid": true,
    "donationsList": true,
    "newsSection": true,
    "faqSection": true,
    "suggestionsSection": true
  },
  "donationPassword": "VENEZUELAVIVE2026",
  "headerVideoEnabled": true,
  "headerVideoYoutubeUrl": "https://www.youtube.com/watch?v=kYv_I-g_M5w",
  "introVideoEnabled": true,
  "introVideoYoutubeUrl": "https://youtube.com/shorts/LT90TVjBYv0",
  "introVideoBadgeText": "Video de Presentación Oficial de la Campaña 🇻🇪",
  "introVideoTitle": "¿Estás Listo para Solidarizarte?",
  "introVideoSubtitle": "Conoce más de nuestra iniciativa en marcha por 1 Tonelada.",
  "introVideoBtnText": "Ingresar a la Web de la Campaña ➔",
  "webAccessLogs": [
    {
      "id": "acc_6jkwm0tiz",
      "timestamp": "2026-06-28T04:05:53.823Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1638x907] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_bpt8e2nzk",
      "timestamp": "2026-06-27T19:56:41.152Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1760x889] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_k3nmwgkre",
      "timestamp": "2026-06-27T14:44:08.635Z",
      "ip": "90.160.203.220",
      "device": "💻 Escritorio (macOS) [Pantalla: 1798x894] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_zzi70psyq",
      "timestamp": "2026-06-27T14:42:06.459Z",
      "ip": "90.160.203.220",
      "device": "💻 Escritorio (macOS) [Pantalla: 375x667] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_hgvuoa1ox",
      "timestamp": "2026-06-27T14:36:45.121Z",
      "ip": "90.160.203.220",
      "device": "💻 Escritorio (macOS) [Pantalla: 1798x894] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_e1a1x5myc",
      "timestamp": "2026-06-27T14:32:28.186Z",
      "ip": "90.160.203.220",
      "device": "💻 Escritorio (macOS) [Pantalla: 375x667] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_ps99wbjyd",
      "timestamp": "2026-06-27T14:27:29.276Z",
      "ip": "90.160.203.220",
      "device": "💻 Escritorio (macOS) [Pantalla: 1798x894] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_6zzw1qhmq",
      "timestamp": "2026-06-27T14:27:24.097Z",
      "ip": "90.160.203.220",
      "device": "💻 Escritorio (macOS) [Pantalla: 1798x894] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_1qehvbyfq",
      "timestamp": "2026-06-27T14:24:05.343Z",
      "ip": "90.160.203.220",
      "device": "💻 Escritorio (macOS) [Pantalla: 375x667] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_jbqo92l4c",
      "timestamp": "2026-06-27T14:23:47.255Z",
      "ip": "90.160.203.220",
      "device": "💻 Escritorio (macOS) [Pantalla: 375x667] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_kc5rqkjqt",
      "timestamp": "2026-06-27T14:20:00.478Z",
      "ip": "90.160.203.220",
      "device": "💻 Escritorio (macOS) [Pantalla: 1798x894] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_45dbf0has",
      "timestamp": "2026-06-27T14:05:07.563Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1651x894] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_vzj6sm934",
      "timestamp": "2026-06-27T13:53:57.976Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1616x894] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_fk3h9qhc9",
      "timestamp": "2026-06-27T08:56:18.049Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1632x914] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_exwz5wv3u",
      "timestamp": "2026-06-27T08:44:48.972Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1534x914] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_a4qnhu0m6",
      "timestamp": "2026-06-27T08:33:28.043Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1534x914] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_7a2v7692v",
      "timestamp": "2026-06-27T08:23:54.784Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1534x914] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_85mkrh1x0",
      "timestamp": "2026-06-27T08:13:53.926Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1695x909] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_nrdd5vlmp",
      "timestamp": "2026-06-27T08:05:45.431Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1695x909] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_p0xh7n185",
      "timestamp": "2026-06-27T08:03:12.811Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1695x909] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_yib97mwgc",
      "timestamp": "2026-06-27T07:53:08.879Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1695x909] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_b2q0gk71n",
      "timestamp": "2026-06-27T07:30:13.532Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1695x909] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_sn17w34vm",
      "timestamp": "2026-06-27T07:25:44.800Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1695x909] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    }
  ],
  "donationCategories": [
    "Alimentos no perecederos",
    "Ropa y Abrigo",
    "Baterías y Pilas",
    "Medicinas e Insumos Médicos",
    "Kits Infantiles y Fórmulas"
  ],
  "liveCounterStateRedLabel": "ROJO — DÉFICIT CRÍTICO INICIAL",
  "liveCounterStateOrangeLabel": "NARANJA / AMARILLO — EN PROGRESO CONSTANTE",
  "liveCounterStateGreenLabel": "VERDE — ¡META PRÓXIMA / ALCANZADA!",
  "liveCounterShowStateBadge": true,
  "liveCounterLegend0": "0% Rojo",
  "liveCounterLegend30": "30% Naranja",
  "liveCounterLegend70": "70% Amarillo",
  "liveCounterLegend100": "100% Verde",
  "liveCounterShowLegends": false,
  "maintenanceModeEnabled": false,
  "maintenanceReason": "Actualización y optimización de base de datos relacional de acopio",
  "maintenanceEndTimestamp": ""
};
