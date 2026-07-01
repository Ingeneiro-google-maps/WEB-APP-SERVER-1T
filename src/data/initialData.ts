import { GlobalState } from '../types';

export const INITIAL_STATE: GlobalState = {
  "codeVersion": "1.8",
  "autoUpdateActive": true,
  "campaignTitle": "Por 1T — Ayuda Humanitaria Emergencia Venezuela",
  "emergencySubtitle": "Respuesta Operativa de Emergencia por el Terremoto . Cada kilo suma para salvar vidas.",
  "headerAlertText": "Emergencia Nacional #VEN-2026: Terremoto",
  "heroBadgeText": "🇻🇪 Emergencia Humanitaria • Terremoto Venezuela",
  "heroTitleRow1": "AYUDA VITAL",
  "heroTitleRow2": "POR 1 TONELADA",
  "heroTitleRow3": "DESDE ESPAÑA",
  "globalTargetTons": 10,
  "celebrationType": "fireworks",
  "progressBarStyle": "default",
  "donationsEurosEnabled": true,
  "donationsEuros": 17010,
  "donationsEurosPhase1": 10000,
  "donationsEurosPhase2": 200000,
  "donationsEurosPhase3": 300000,
  "donationPotTemplate": "template8",
  "showRecentDonors": true,
  "publicVisitCounterEnabled": true,
  "publicVisitCounterBase": 15000,
  "publicVisitCounterStartDate": "2026-07-01T00:00:00.000Z",
  "publicVisitCounterUpdateInterval": 4500,
  "lastSyncTime": "2026-07-01T17:44:46.079Z",
  "nextSyncTime": "2026-07-01T17:54:46.079Z",
  "googleSheetUrl": "https://docs.google.com/spreadsheets/d/1PukE4Ns_98aDcHbsTth3Mx6_tJNQcFmC/edit?gid=762536088#gid=762536088",
  "googleSheetWebhookUrl": "https://script.google.com/macros/s/AKfycbxfiM27NiOzQx9FWqn2AFG6IeaG_MyCcNKTjiA29YF8MZ9NObXDlSUG7bLqWl_rHiw/exec",
  "autoSyncEnabled": true,
  "syncIntervalMinutes": 10,
  "supplies": [
    {
      "id": "sup-1",
      "category": "Alimentos no perecederos",
      "name": "Harina de Maíz, Arroz y Pasta",
      "currentKilos": 2788.270000000001,
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
      "currentKilos": 1587.9499999999998,
      "targetKilos": 200,
      "unit": "kg",
      "iconName": "Shirt"
    },
    {
      "id": "sup-5",
      "category": "Medicinas e Insumos",
      "name": "Kits de Primeros Auxilios y Analgésicos",
      "currentKilos": 1088.1699999999998,
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
      "acceptedItems": [
        "Alimentos no perecederos",
        "Medicinas",
        "Mantas"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos",
        "Medicinas",
        "Mantas"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos",
        "Medicinas",
        "Mantas"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
      "acceptedItems": [
        "Alimentos no perecederos"
      ],
      "urgentNeeds": [
        "Alimentos no perecederos",
        "baterías",
        "ropa",
        "insumos médicos"
      ],
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
    },
    {
      "id": "excel-15-160",
      "donorName": "Ruby Vargas. A Pequecha café bar",
      "email": "apequecha10@gmail.com",
      "city": "O Delas (Cafetería) (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 160,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-16-2",
      "donorName": "Natalia",
      "email": "anonimo@donante.org",
      "city": "O Delas (Cafetería) (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 2,
      "message": "Entrega registrada",
      "date": "6/27/2026"
    },
    {
      "id": "excel-17-6",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 6,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-18-5",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-19-5",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-20-9",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 9,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-21-30",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 30,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-22-13",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 13,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-23-22",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 22,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-24-10",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 10,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-25-13",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "O Delas (Cafetería) (Ribeira)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 13,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-26-17",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 17,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-27-8",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-28-14",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 14,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-29-10",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 10,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-30-89",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 89,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-31-53",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 53,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-32-19",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 18.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-33-16",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 16,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-34-13",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 13,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-35-14",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 13.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-36-11",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 10.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-37-18",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 18,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-38-24",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 24,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-39-17",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 17.3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-40-21",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 20.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-41-19",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 19,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-42-20",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 20,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-43-19",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 18.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-44-54",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 54,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-45-10",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 10,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-46-50",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 50,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-47-34",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 34,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-48-48",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 48,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-49-20",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 20.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-50-15",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 15,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-51-6",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 5.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-52-7",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 7,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-53-32",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 32,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-54-11",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 11,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-55-352",
      "donorName": "CONJUNTO",
      "email": "anonimo@donante.org",
      "city": "A Nosa Bodeguilla (Monforte de Lemos)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 352.17,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-56-13",
      "donorName": "Dayana",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 13.02,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-57-32",
      "donorName": "Gofer",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 31.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-58-22",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 22,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-59-12",
      "donorName": "Paola",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 12.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-60-10",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 9.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-61-8",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 8.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-62-11",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 11,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-63-5",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 5.4,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-64-40",
      "donorName": "alimentos varios",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 40,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-65-32",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 31.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-66-48",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 48.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-67-69",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 69.1,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-68-7",
      "donorName": "ropa varia",
      "email": "anonimo@donante.org",
      "city": "O Delas (Cafetería) (Ribeira)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 6.9,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-69-11",
      "donorName": "ropa varia",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 10.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-70-59",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 58.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-71-12",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "O Delas (Cafetería) (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 11.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-72-10",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 10,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-73-8",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-74-48",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 48.3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-75-10",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "Pastelería Gofer (Chantada- Lugo)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 10,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-76-3",
      "donorName": "Chantada",
      "email": "dashafg7@gmail.com",
      "city": "O Delas (Cafetería) (Ribeira)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-77-23",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 23,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-78-19",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 18.7,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-79-12",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 12.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-80-14",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 14.4,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-81-12",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 12.3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-82-14",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 14,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-83-12",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 12.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-84-16",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 16,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-85-26",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 25.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-86-43",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 43.3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-87-641",
      "donorName": "Anónimo varios",
      "email": "holla@pollospepitos58.com",
      "city": "Piscina Municipal de Ordes O Muiño (Ordes)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 641.3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-88-32",
      "donorName": "lirio studio",
      "email": "anonimo@donante.org",
      "city": "O Delas (Cafetería) (Ribeira)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 32.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-89-50",
      "donorName": "Anonimomordes",
      "email": "holla@pollospepitos58.com",
      "city": "Piscina Municipal de Ordes O Muiño (Ordes)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 50,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-90-29",
      "donorName": "lirio studio",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 29.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-91-45",
      "donorName": "lirio studio",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 45.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-92-27",
      "donorName": "lirio studio",
      "email": "anonimo@donante.org",
      "city": "O Delas (Cafetería) (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 27.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-93-83",
      "donorName": "Anónimo ordes",
      "email": "holla@pollospepitos58.com",
      "city": "Piscina Municipal de Ordes O Muiño (Ordes)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 82.55,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-94-14",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 14.4,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-95-9",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 9.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-96-20",
      "donorName": "ALIMENTOS VARIOS",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 20,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-97-290",
      "donorName": "Anónimo ordes",
      "email": "holla@pollospepitos58.com",
      "city": "Piscina Municipal de Ordes O Muiño (Ordes)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 290.15,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-98-13",
      "donorName": "LIRIOS STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 12.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-99-112",
      "donorName": "Anónimo ordes",
      "email": "holla@pollospepitos58.com",
      "city": "Piscina Municipal de Ordes O Muiño (Ordes)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 112.3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-100-30",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 30.1,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-101-8",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 8.3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-102-27",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 27,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-103-96",
      "donorName": "Anónimo ordes",
      "email": "holla@pollospepitos58.com",
      "city": "Piscina Municipal de Ordes O Muiño (Ordes)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 96.15,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-104-6",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 5.6,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-105-8",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 7.9,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-106-22",
      "donorName": "LIRIO DE STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 22,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-107-3",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 2.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-108-472",
      "donorName": "Anónimo ordes",
      "email": "holla@pollospepitos58.com",
      "city": "Piscina Municipal de Ordes O Muiño (Ordes)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 471.75,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-109-24",
      "donorName": "Anónimo ordes",
      "email": "holla@pollospepitos58.com",
      "city": "Piscina Municipal de Ordes O Muiño (Ordes)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 24,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-110-15",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 15,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-111-88",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 88,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-112-7",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 7.4,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-113-16",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 15.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-114-5",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 5.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-115-9",
      "donorName": "LIRIO STUDIOS",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 9.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-116-14",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 13.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-117-8",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 8.3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-118-13",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 12.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-119-10",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 10.4,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-120-14",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 13.7,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-121-6",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 5.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-122-12",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 11.9,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-123-11",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 10.9,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-124-14",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 13.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-125-16",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 16.4,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-126-29",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 28.6,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-127-12",
      "donorName": "Lirio Studio",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 12.1,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-128-12",
      "donorName": "lirio studio",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 11.6,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-129-8",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-130-8",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 7.6,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-131-28",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 27.7,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-132-18",
      "donorName": "LIIRO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 18,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-133-17",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "O Delas (Cafetería) (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 16.5,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-134-6",
      "donorName": "LIRIOS STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 6.2,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-135-16",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 15.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-136-15",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 15.1,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-137-19",
      "donorName": "LIRIOS STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 19.4,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-138-14",
      "donorName": "LIRIOS STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 13.7,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-139-7",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 7.3,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-140-11",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 10.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-141-9",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 9,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-142-14",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 13.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-143-12",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 11.9,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-144-12",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 11.8,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-145-5",
      "donorName": "LIRIO STUDIO",
      "email": "anonimo@donante.org",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 5.4,
      "message": "Entrega registrada",
      "date": "6/28/2026"
    },
    {
      "id": "excel-146-21",
      "donorName": "Gozza",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 21,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-147-38",
      "donorName": "OMAYRA PEREIRA IGLESIAS",
      "email": "margaridaxoguetescarral@gmail.com",
      "city": "Margarida Xoguetes (A Coruña)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 38.2,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-148-13",
      "donorName": "OMAYRA PEREIRA IGLESIAS",
      "email": "margaridaxoguetescarral@gmail.com",
      "city": "Margarida Xoguetes (A Coruña)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 13.4,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-149-13",
      "donorName": "Mj Tecsystem",
      "email": "mjtecsystem@gmail.com",
      "city": "Mj Tecsystem Ribeira   (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 13,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-150-21",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 21,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-151-5",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 5,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-152-25",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 25,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-153-13",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 13,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-154-13",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 13,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-155-15",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 15,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-156-17",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 17,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-157-20",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 20,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-158-18",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 18,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-159-8",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 8,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-160-3",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 3,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-161-8",
      "donorName": "Sabela Pérez Navarro",
      "email": "sabelaperez1718@gmail.com",
      "city": "Lirio Studio Creativo (Santiago de Compostela)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 8,
      "message": "Entrega registrada",
      "date": "6/29/2026"
    },
    {
      "id": "excel-162-37",
      "donorName": "OMAYRA PEREIRA IGLESIAS",
      "email": "margaridaxoguetescarral@gmail.com",
      "city": "Margarida Xoguetes (A Coruña)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 36.5,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-163-3",
      "donorName": "MJ TECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 2.5,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-164-5",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 5,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-165-2",
      "donorName": "MJTECSYSTEM",
      "email": "anonimo@donante.org",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 2,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-166-2",
      "donorName": "MJTECSYSTEM",
      "email": "anonimo@donante.org",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 2,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-167-9",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 9,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-168-10",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 10,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-169-7",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 7,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-170-10",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 10,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-171-6",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 6,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-172-9",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 9,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-173-3",
      "donorName": "MJTECSYSTEM",
      "email": "anonimo@donante.org",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 2.5,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-174-10",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 9.9,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-175-10",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 9.8,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-176-10",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTE@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 9.8,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-177-7",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 7,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-178-10",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 9.7,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-179-5",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 5,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-180-6",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 6,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-181-12",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 12,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-182-7",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 7,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-183-18",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTME@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 18.2,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-184-5",
      "donorName": "MJTECSYSTEM",
      "email": "MJTECSYSTEM@GMAIL.COM",
      "city": "Mj Tecsystem Ribeira (Ribeira)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 4.5,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-185-13",
      "donorName": "OMAYRA PEREIRA IGLESIAS",
      "email": "margaridaxoguetescarral@gmail.com",
      "city": "Margarida Xoguetes (A Coruña)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 12.7,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-186-85",
      "donorName": "Katherine",
      "email": "anonimo@donante.org",
      "city": "Carrefour Express Teixugueiras (Vigo)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 85.4,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-187-28",
      "donorName": "KATHERINE",
      "email": "anonimo@donante.org",
      "city": "Carrefour Express Teixugueiras (Vigo)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 27.6,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-188-23",
      "donorName": "KATHERINE",
      "email": "anonimo@donante.org",
      "city": "Carrefour Express Teixugueiras (Vigo)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 22.5,
      "message": "Entrega registrada",
      "date": "6/30/2026"
    },
    {
      "id": "excel-189-15",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 15,
      "message": "Entrega registrada",
      "date": "7/1/2026"
    },
    {
      "id": "excel-190-10",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Kits Infantiles y Fórmulas",
      "pledgeKilos": 10,
      "message": "Entrega registrada",
      "date": "7/1/2026"
    },
    {
      "id": "excel-191-5",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 5,
      "message": "Entrega registrada",
      "date": "7/1/2026"
    },
    {
      "id": "excel-192-8",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Ropa y Abrigo",
      "pledgeKilos": 8,
      "message": "Entrega registrada",
      "date": "7/1/2026"
    },
    {
      "id": "excel-193-5",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 5,
      "message": "Entrega registrada",
      "date": "7/1/2026"
    },
    {
      "id": "excel-194-23",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 23,
      "message": "Entrega registrada",
      "date": "7/1/2026"
    },
    {
      "id": "excel-195-12",
      "donorName": "GOZZA",
      "email": "gozza.ou@gmail.com",
      "city": "Gozza! (Ourense)",
      "category": "Alimentos no perecederos",
      "pledgeKilos": 12,
      "message": "Entrega registrada",
      "date": "7/1/2026"
    },
    {
      "id": "excel-196-3",
      "donorName": "OMAYRA PEREIRA IGLESIAS",
      "email": "margaridaxoguetescarral@gmail.com",
      "city": "Margarida Xoguetes (A Coruña)",
      "category": "Medicinas e Insumos Médicos",
      "pledgeKilos": 2.8,
      "message": "Entrega registrada",
      "date": "7/1/2026"
    }
  ],
  "syncLogs": [
    {
      "id": "log-1782927886079",
      "timestamp": "5:44:46 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782927809150",
      "timestamp": "5:43:29 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782927765158",
      "timestamp": "5:42:45 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782927286378",
      "timestamp": "5:34:46 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782927165976",
      "timestamp": "5:32:45 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782926685876",
      "timestamp": "5:24:45 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782926564661",
      "timestamp": "5:22:44 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782926085790",
      "timestamp": "5:14:45 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782926056026",
      "timestamp": "5:14:16 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782925965249",
      "timestamp": "5:12:45 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782925486411",
      "timestamp": "5:04:46 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782925364423",
      "timestamp": "5:02:44 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782925244969",
      "timestamp": "5:00:44 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782924885834",
      "timestamp": "4:54:45 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782924764714",
      "timestamp": "4:52:44 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782924645756",
      "timestamp": "4:50:45 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782924285975",
      "timestamp": "4:44:45 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782924165798",
      "timestamp": "4:42:45 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782923687108",
      "timestamp": "4:34:47 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
    },
    {
      "id": "log-1782923564420",
      "timestamp": "4:32:44 PM",
      "status": "success",
      "message": "[Sincronización Programada] [Excel BD Sincronizada] Se extrajeron con éxito 196 donaciones de la hoja de cálculo. Peso total acumulado: 5,464.39 kg.",
      "kilosUpdated": 5464.390000000001
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
      "id": "ulog-1782927165465-a825",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "01/07/2026",
      "time": "19:32:45",
      "action": "Actualizó la configuración del Fondo de Asistencia Humanitaria (Plantillas y Donantes)"
    },
    {
      "id": "ulog-1782926850158-9gr1",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "01/07/2026",
      "time": "19:27:30",
      "action": "Actualizó la configuración del Fondo de Asistencia Humanitaria (Plantillas y Donantes)"
    },
    {
      "id": "ulog-1782923825324-7tbd",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "01/07/2026",
      "time": "18:37:05",
      "action": "Modificó la meta global en vivo de la campaña a: 10 Toneladas (10000 kg)"
    },
    {
      "id": "ulog-1782923823458-4j4p",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "01/07/2026",
      "time": "18:37:03",
      "action": "Modificó la meta global en vivo de la campaña a: 4 Toneladas (4000 kg)"
    },
    {
      "id": "ulog-1782922976464-cpy8",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "01/07/2026",
      "time": "18:22:56",
      "action": "Actualizó la configuración de estados, leyendas, animaciones, barras y fondo de euros del contador en vivo"
    },
    {
      "id": "ulog-1782922599834-un72",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "01/07/2026",
      "time": "18:16:39",
      "action": "Actualizó la configuración de estados, leyendas, animaciones, barras y fondo de euros del contador en vivo"
    },
    {
      "id": "ulog-1782620895862-jwt9",
      "userId": "usr-orlando",
      "userName": "Ing. Orlando Galdámez",
      "userEmail": "eng.orlandogaldamez@gmail.com",
      "date": "28/06/2026",
      "time": "06:28:15",
      "action": "Actualizó la configuración de estados, leyendas, animaciones y barras del contador en vivo de Navarra"
    },
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
  "whatsappMessages": [
    {
      "id": "msg-1",
      "senderName": "Coordinador Carlos",
      "senderRole": "Admin",
      "text": "Acaba de salir un camión hacia el centro de acopio de Madrid. Necesitamos 3 voluntarios más para descargar.",
      "timestamp": "10:24 AM",
      "isOfficial": true
    },
    {
      "id": "msg-2",
      "senderName": "María L.",
      "text": "¡Yo puedo ir a ayudar! Llego en 15 minutos.",
      "timestamp": "10:25 AM"
    }
  ],
  "volunteers": [
    {
      "id": "vol-1",
      "name": "Christian Venegalle",
      "role": "Coordinador General",
      "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    {
      "id": "vol-2",
      "name": "Jesy Liriostudio",
      "role": "Coordinación Logística",
      "photoUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
    },
    {
      "id": "vol-3",
      "name": "Jose Magan",
      "role": "Logística y Almacén",
      "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    {
      "id": "vol-4",
      "name": "Kelly Morales",
      "role": "Apoyo Logístico Santiago",
      "photoUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
    }
  ],
  "visibleBlocks": {
    "suppliesGrid": true,
    "centersGrid": true,
    "donationsList": true,
    "newsSection": true,
    "faqSection": true,
    "suggestionsSection": true,
    "whatsappSection": false,
    "volunteersSection": true
  },
  "donationPassword": "VENEZUELAVIVE2026",
  "headerVideoEnabled": true,
  "headerVideoYoutubeUrl": "https://www.youtube.com/watch?v=vvMuOIXMzkI&t=167s",
  "introVideoEnabled": true,
  "introVideoYoutubeUrl": "https://youtube.com/shorts/LT90TVjBYv0",
  "introVideoBadgeText": "Video de Presentación Oficial de la Campaña 🇻🇪",
  "introVideoTitle": "¿Estás Listo para Solidarizarte?",
  "introVideoSubtitle": "Conoce más de nuestra iniciativa en marcha por 1 Tonelada.",
  "introVideoBtnText": "Ingresar a la Web de la Campaña ➔",
  "webAccessLogs": [
    {
      "id": "acc_nokzijjho",
      "timestamp": "2026-07-01T17:48:16.606Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 0x0] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_ngch4e09l",
      "timestamp": "2026-07-01T17:33:28.040Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 1163x609] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_dsf7rub7o",
      "timestamp": "2026-07-01T17:26:33.363Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 1163x609] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_e7tx70i3o",
      "timestamp": "2026-07-01T17:19:24.090Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 1135x609] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_nvxavth6q",
      "timestamp": "2026-07-01T17:04:16.937Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 1135x609] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_1nvtpvyhl",
      "timestamp": "2026-07-01T16:40:44.358Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 1130x609] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_tfm86t838",
      "timestamp": "2026-07-01T16:35:56.676Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 0x0] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_hiwhgc8ab",
      "timestamp": "2026-07-01T16:26:36.661Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 1130x609] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_ckhiw0lwk",
      "timestamp": "2026-07-01T16:18:09.358Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_utzc0s39l",
      "timestamp": "2026-07-01T16:14:15.598Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_hb8ygtae5",
      "timestamp": "2026-07-01T16:01:20.627Z",
      "ip": "90.166.153.203",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_63s8sslvc",
      "timestamp": "2026-07-01T13:49:14.191Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_j305ijg77",
      "timestamp": "2026-07-01T13:42:22.289Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 0x0] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_jilvb3yay",
      "timestamp": "2026-07-01T13:34:19.856Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_xm58fvqtj",
      "timestamp": "2026-07-01T13:31:36.871Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_qkmjxdwco",
      "timestamp": "2026-07-01T13:30:35.860Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 0x0] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_n0ajg76fp",
      "timestamp": "2026-07-01T13:28:10.482Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_glvuwx3fe",
      "timestamp": "2026-07-01T13:24:51.762Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_sltogv02t",
      "timestamp": "2026-07-01T13:21:28.302Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_525bozksn",
      "timestamp": "2026-07-01T13:15:00.574Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 1180x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_esvmcvj7m",
      "timestamp": "2026-07-01T13:02:09.820Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 0x0] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_eernsb93y",
      "timestamp": "2026-07-01T12:45:21.845Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 0x0] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_s4k3q547s",
      "timestamp": "2026-07-01T12:33:32.209Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 944x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_ncui9lbzh",
      "timestamp": "2026-07-01T12:32:37.282Z",
      "ip": "90.160.203.197",
      "device": "💻 Escritorio (macOS) [Pantalla: 944x608] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_p3lpjlgkw",
      "timestamp": "2026-06-30T13:47:17.753Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 0x0] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_degjq52x1",
      "timestamp": "2026-06-30T13:37:50.489Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1638x907] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_n803l0obq",
      "timestamp": "2026-06-30T13:35:18.573Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1638x907] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_z49h52mc8",
      "timestamp": "2026-06-29T15:08:57.056Z",
      "ip": "90.166.156.254",
      "device": "💻 Escritorio (macOS) [Pantalla: 944x603] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_tx28hsu5f",
      "timestamp": "2026-06-29T15:08:06.467Z",
      "ip": "90.166.156.254",
      "device": "💻 Escritorio (macOS) [Pantalla: 944x603] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_2gsr9cjm4",
      "timestamp": "2026-06-28T04:26:15.696Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1638x907] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_7lfv9wmlm",
      "timestamp": "2026-06-28T04:16:49.986Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1638x907] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_wkj182phg",
      "timestamp": "2026-06-28T04:11:38.326Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1638x907] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
    {
      "id": "acc_fe8mvjjso",
      "timestamp": "2026-06-28T04:11:26.033Z",
      "ip": "84.77.212.187",
      "device": "💻 Escritorio (macOS) [Pantalla: 1638x907] (es-GT)",
      "location": "Europe/Madrid",
      "page": "/"
    },
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
  "maintenanceEndTimestamp": "",
  "supabaseActive": false,
  "supabaseTableMissing": false
};
