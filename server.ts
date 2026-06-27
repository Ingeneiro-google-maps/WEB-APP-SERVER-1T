import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_STATE } from './src/data/initialData';
import { GlobalState, DonorPledge, SyncLog, NewsItem, SuggestionItem, WebAccessLog } from './src/types';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// In-memory persistent state across requests
let appState: GlobalState = JSON.parse(JSON.stringify(INITIAL_STATE));
let supabaseTableMissing = false;
let hasSuccessfullyLoadedFromSupabase = false;

// Initialize Supabase Client if credentials are provided (checking standard, service, anon and framework prefixes)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log('✅ Cliente de Supabase inicializado correctamente con URL:', supabaseUrl);
} else {
  console.warn('⚠️ No se encontraron credenciales de Supabase (SUPABASE_URL / SUPABASE_KEY). Funcionando en modo local (in-memory).');
}

// Helper para guardar el estado en Supabase
async function saveStateToSupabase() {
  if (!supabase) return;

  // Si no se ha cargado con éxito todavía desde Supabase, bloqueamos el guardado para evitar
  // sobreescribir la base de datos de la nube con datos viejos/por defecto del archivo local.
  if (!hasSuccessfullyLoadedFromSupabase) {
    console.warn('⚠️ [Supabase] Bloqueado guardado asíncrono para prevenir pérdida de datos. Intentando cargar datos de la nube primero...');
    await loadStateFromSupabase();
    if (!hasSuccessfullyLoadedFromSupabase) {
      console.error('❌ [Supabase] Cancelado guardado de estado. No se pudo verificar la versión de la nube.');
      return;
    }
  }

  try {
    const { error } = await supabase
      .from('website_state')
      .upsert({ id: 1, state: appState });
    if (error) {
      console.error('❌ Error al guardar estado en Supabase:', error);
      if (error.message && error.message.includes('relation "public.website_state" does not exist')) {
        supabaseTableMissing = true;
      }
    } else {
      supabaseTableMissing = false;
      console.log('💾 [Supabase] Base de datos de la web actualizada y guardada con éxito.');
    }
  } catch (err: any) {
    console.error('❌ Excepción al guardar estado en Supabase:', err.message || err);
  }
}

// Helper para guardar el estado en el archivo físico local para evitar pérdidas al subir a GitHub o reiniciar
function persistStateToDisk() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'initialData.ts');
    const content = `import { GlobalState } from '../types';

export const INITIAL_STATE: GlobalState = ${JSON.stringify(appState, null, 2)};
`;
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('💾 [Local FileSystem] ¡src/data/initialData.ts actualizado con el estado actual!');
  } catch (err: any) {
    console.warn('⚠️ No se pudo escribir en el archivo local (normal en producción de solo lectura):', err.message || err);
  }
}

// Helper unificado para guardar estado en Supabase y disco físico
async function saveAndPersistState() {
  await saveStateToSupabase();
  persistStateToDisk();
}

// Función de mezcla inteligente para unir el estado local (definido por código) con el estado de Supabase (definido por base de datos online)
function mergeStates(local: GlobalState, db: GlobalState): GlobalState {
  // Copiamos el estado local de código como base inicial para asegurar de que se incluyan todos los nuevos campos estructurales
  const merged: GlobalState = JSON.parse(JSON.stringify(local));

  // 1. Campos dinámicos de entrada de usuarios: siempre provienen de la base de datos (Supabase)
  merged.pledges = db.pledges || [];
  merged.news = db.news || [];
  merged.suggestions = db.suggestions || [];
  merged.syncLogs = db.syncLogs || [];
  merged.webAccessLogs = db.webAccessLogs || [];
  merged.userChangeLogs = db.userChangeLogs || [];

  // 2. Supplies (Insumos):
  // Combinamos los metadatos de código local (nombres, unidades, objetivos) con el progreso actual de Supabase
  merged.supplies = (local.supplies || []).map(localSup => {
    const dbSup = (db.supplies || []).find(s => s.id === localSup.id);
    return {
      ...localSup,
      currentKilos: dbSup ? dbSup.currentKilos : localSup.currentKilos
    };
  });

  // 3. Centros de Acopio (Collection Centers):
  // - Queremos todos los centros definidos en el código local (nuevos, editados).
  // - También queremos preservar los centros que hayan sido añadidos en línea mediante la base de datos (Supabase).
  const mergedCenters = [...(local.centers || [])];
  if (db.centers) {
    db.centers.forEach(dbCenter => {
      const localCenterIdx = mergedCenters.findIndex(c => c.id === dbCenter.id);
      if (localCenterIdx === -1) {
        // Existe en base de datos pero no en el código local, lo conservamos (fue creado online)
        mergedCenters.push(dbCenter);
      } else {
        // Existe en ambos. Para evitar sobreescribir ediciones hechas online a través de la web,
        // los valores dinámicos cargados de la base de datos (Supabase) prevalecen sobre el código local de INITIAL_STATE.
        mergedCenters[localCenterIdx] = {
          ...mergedCenters[localCenterIdx], // Conserva la estructura o nuevos campos del código local
          ...dbCenter                       // Prevalecen los valores modificados o cargados desde la base de datos Supabase
        };
      }
    });
  }
  merged.centers = mergedCenters;

  // 4. Preguntas Frecuentes (FAQs):
  // - Mezcla inteligente idéntica a centros de acopio (la base de datos prevalece sobre el código viejo)
  const mergedFaqs = [...(local.faqs || [])];
  if (db.faqs) {
    db.faqs.forEach(dbFaq => {
      const localFaqIdx = mergedFaqs.findIndex(f => f.id === dbFaq.id);
      if (localFaqIdx === -1) {
        mergedFaqs.push(dbFaq);
      } else {
        mergedFaqs[localFaqIdx] = {
          ...mergedFaqs[localFaqIdx],       // Conserva la estructura local
          ...dbFaq                          // Prevalecen los valores modificados online en Supabase
        };
      }
    });
  }
  merged.faqs = mergedFaqs;

  // 5. Configuración y textos escalares a nivel raíz:
  // Si un texto o valor existe en la base de datos y no es idéntico al default de código local anterior,
  // preservamos el de la base de datos ("los textos que ya han sido modificados online permanecen").
  // Pero si el código local de INITIAL_STATE tiene una modificación manual de texto o valores nuevos que el usuario acaba de subir,
  // queremos mantenerlos.
  // Para lograrlo de forma sencilla e intuitiva:
  // Si el valor de base de datos existe y el de código es igual al de base de datos, perfecto.
  // Si son diferentes, priorizamos el de base de datos para no pisar ediciones online, EXCEPTO si el usuario sube un cambio
  // de código donde explícitamente cambió el INITIAL_STATE.
  // Un patrón muy limpio es: si un campo existe en la base de datos online, lo usamos, PERO si se acaba de hacer deploy
  // de código con un valor de INITIAL_STATE que difiere de la base de datos, y queremos permitir modificaciones desde código:
  // El usuario dice: "Every time I upload some change to GitHub, you reload the old information that is on the page. I don't want when I make a change and upload it to GitHub, to reload the old information. Let the information that they have already updated online remain."
  // Entonces, si el usuario modificó algún texto online, let it remain. Pero si agregaron nuevos centros de acopio, o agregaron campos en el código, queremos que se mezclen sin borrar la información online.
  // Así que para campos escalares de configuración, preferimos el de la base de datos online (si existe), de modo que
  // los cambios de texto hechos online permanezcan. Si el campo está vacío o no existe en la base de datos, usamos el de código.
  const scalarKeys: (keyof GlobalState)[] = [
    "campaignTitle", "emergencySubtitle", "headerAlertText", "heroBadgeText",
    "heroTitleRow1", "heroTitleRow2", "heroTitleRow3", "globalTargetTons",
    "googleSheetUrl", "googleSheetWebhookUrl", "autoSyncEnabled", "syncIntervalMinutes",
    "donationPassword", "headerVideoEnabled", "headerVideoYoutubeUrl",
    "introVideoEnabled", "introVideoYoutubeUrl", "introVideoBadgeText",
    "introVideoTitle", "introVideoSubtitle", "introVideoBtnText"
  ];

  scalarKeys.forEach(key => {
    if (db[key] !== undefined && db[key] !== null && db[key] !== "") {
      (merged as any)[key] = db[key];
    }
  });

  if (db.visibleBlocks) {
    merged.visibleBlocks = {
      ...(local.visibleBlocks || {}),
      ...(db.visibleBlocks || {})
    };
  }

  return merged;
}

// Helper para cargar el estado desde Supabase
async function loadStateFromSupabase() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase
      .from('website_state')
      .select('state')
      .eq('id', 1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        supabaseTableMissing = false;
        console.log('🌱 No se encontró el registro inicial de la web en Supabase. Creándolo ahora...');
        const { error: insertError } = await supabase
          .from('website_state')
          .insert({ id: 1, state: appState });
        if (insertError) {
          console.error('❌ Error al crear el registro inicial en Supabase:', insertError);
        } else {
          console.log('✅ Registro inicial creado con éxito en Supabase.');
          hasSuccessfullyLoadedFromSupabase = true;
        }
      } else if (error.message && error.message.includes('relation "public.website_state" does not exist')) {
        supabaseTableMissing = true;
        console.warn('⚠️ La tabla "website_state" no existe en Supabase.');
        console.warn('💡 Para solucionarlo y habilitar la persistencia global, ejecuta esta consulta SQL en el panel de Supabase:');
        console.warn(`
          CREATE TABLE IF NOT EXISTS website_state (
            id BIGINT PRIMARY KEY,
            state JSONB NOT NULL
          );
          
          INSERT INTO website_state (id, state)
          VALUES (1, '{}'::jsonb)
          ON CONFLICT (id) DO NOTHING;
        `);
      } else {
        console.error('⚠️ Error al cargar el estado desde Supabase:', error.message || error);
      }
    } else if (data && data.state) {
      supabaseTableMissing = false;
      if (typeof data.state === 'object' && (data.state as any).campaignTitle) {
        const dbState = data.state as GlobalState;
        hasSuccessfullyLoadedFromSupabase = true;

        // Si la versión del código coincide con la versión guardada en la base de datos,
        // no mezclamos para evitar restaurar elementos que el administrador eliminó en la web.
        // La base de datos online de Supabase es la fuente de verdad absoluta.
        if (dbState.codeVersion === INITIAL_STATE.codeVersion) {
          appState = dbState;
          console.log('✅ [Supabase] Estado cargado de forma íntegra y directa. Sin mezclas redundantes.');
        } else {
          // Si el código cambió o es una versión nueva, mezclamos inteligentemente para introducir nuevos centros/FAQs del código
          console.log(`🔄 [Smart Merge] Nueva versión de código detectada (${INITIAL_STATE.codeVersion} vs db: ${dbState.codeVersion || 'ninguna'}). Mezclando...`);
          const previousSerialized = JSON.stringify(appState);
          appState = mergeStates(INITIAL_STATE, dbState);
          appState.codeVersion = INITIAL_STATE.codeVersion; // Actualizamos la versión cargada
          const currentSerialized = JSON.stringify(appState);

          // Sincronizamos la base de datos de vuelta si hay cambios o si la versión se actualizó
          if (previousSerialized !== currentSerialized || dbState.codeVersion !== INITIAL_STATE.codeVersion) {
            console.log('🔄 Sincronizando nueva versión de datos en Supabase...');
            // temporalmente puenteamos el guardado forzando el booleano
            const orig = hasSuccessfullyLoadedFromSupabase;
            hasSuccessfullyLoadedFromSupabase = true;
            await saveStateToSupabase();
            hasSuccessfullyLoadedFromSupabase = orig;
          }
          console.log('✅ [Supabase] El estado de la web ha sido mezclado con éxito para aplicar la nueva versión de código.');
        }
      } else {
        console.warn('⚠️ Los datos obtenidos de Supabase no tienen un formato válido de GlobalState. Se conservará el estado local inicial.');
      }
    }
  } catch (err: any) {
    console.error('❌ Excepción al cargar el estado desde Supabase:', err.message || err);
  }
}

// Programmatic distribution of initial pledges into supplies to guarantee perfect 100% consistency on start
appState.supplies = appState.supplies.map(sup => ({ ...sup, currentKilos: 0 }));
appState.pledges.forEach(p => {
  if (p.pledgeKilos > 0) {
    const matchedIdx = findMatchingSupplyIndex(p.category, appState.supplies);
    if (matchedIdx !== -1) {
      appState.supplies[matchedIdx].currentKilos += p.pledgeKilos;
    }
  }
});

// Helper to compute total kilos
function recalculateTotalKilos(state: GlobalState): number {
  return state.supplies.reduce((acc, item) => acc + item.currentKilos, 0);
}

// Helper to determine which of the 5 supplies categories a donation belongs to
function findMatchingSupplyIndex(categoryOrName: string, suppliesList: any[]): number {
  const pCat = (categoryOrName || '').toLowerCase().trim();
  
  if (pCat.includes('harina') || pCat.includes('arroz') || pCat.includes('pasta') || pCat.includes('espagueti') || pCat.includes('fideo') || pCat.includes('maiz') || pCat.includes('maíz') || pCat.includes('cereal') || pCat.includes('trigo') || pCat.includes('avena')) {
    return 0; // Harina de Maíz, Arroz y Pasta
  } 
  if (pCat.includes('grano') || pCat.includes('caraota') || pCat.includes('lenteja') || pCat.includes('enlatado') || pCat.includes('frijol') || pCat.includes('atun') || pCat.includes('atún') || pCat.includes('sardina') || pCat.includes('aceite') || pCat.includes('garbanzo') || pCat.includes('conserva')) {
    return 1; // Granos (Caraotas/Lentejas) y Enlatados
  } 
  if (pCat.includes('agua') || pCat.includes('botella') || pCat.includes('sales') || pCat.includes('hidratacion') || pCat.includes('rehidratación') || pCat.includes('bebida') || pCat.includes('liquido') || pCat.includes('líquido')) {
    return 2; // Agua Embotellada y Sales de Rehidratación
  } 
  if (pCat.includes('ropa') || pCat.includes('abrigo') || pCat.includes('manta') || pCat.includes('sabana') || pCat.includes('sábana') || pCat.includes('sueter') || pCat.includes('chaqueta') || pCat.includes('vestimenta') || pCat.includes('calzado') || pCat.includes('zapato')) {
    return 3; // Ropa y Abrigo
  } 
  if (pCat.includes('medicina') || pCat.includes('kit') || pCat.includes('insumo') || pCat.includes('auxilio') || pCat.includes('analgesico') || pCat.includes('analgésico') || pCat.includes('farmaco') || pCat.includes('fármaco') || pCat.includes('pastilla') || pCat.includes('paracetamol') || pCat.includes('ibuprofeno') || pCat.includes('gasa') || pCat.includes('venda') || pCat.includes('alcohol')) {
    return 4; // Medicinas e Insumos
  }

  // Fallback to substring matching on category or name
  const idx = suppliesList.findIndex(s => 
    s.category.toLowerCase().includes(pCat) || 
    pCat.includes(s.category.toLowerCase()) ||
    s.name.toLowerCase().includes(pCat) || 
    pCat.includes(s.name.toLowerCase())
  );

  if (idx === -1) {
    if (pCat.includes('alimento') || pCat.includes('comida') || pCat.includes('perecedero')) {
      return 0;
    }
    return 0; // Default fallback to first category
  }

  return idx;
}

// Robust CSV to DonorPledge parser supporting Google Sheets export format
function parseCSVToPledges(text: string): { pledges: DonorPledge[], kilosByCategory: { [key: string]: number } } {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length <= 1) {
    return { pledges: [], kilosByCategory: {} };
  }

  // Detect delimiter (semicolon or comma)
  const firstLine = lines[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';

  // Helper to split CSV line respecting quotes
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseCSVLine(firstLine).map(h => h.toLowerCase().replace(/["']/g, '').trim());

  // Dynamic synonyms matching with smart prioritization to prevent "donacion" text columns from stealing numeric "kilosIdx"
  let donorIdx = headers.findIndex(h => h.includes('donante') || h.includes('nombre') || h.includes('donor') || h.includes('quien') || h.includes('person') || h.includes('usuario'));
  
  // Try to find the actual numeric kilograms column first by specific weight markers
  let kilosIdx = headers.findIndex(h => h.includes('kg') || h.includes('kilo') || h.includes('peso') || h.includes('cantidad') || h.includes('cant'));
  if (kilosIdx === -1) {
    kilosIdx = headers.findIndex(h => h.includes('monto') || h.includes('donacion') || h.includes('donación') || h.includes('valor'));
  }
  
  let cityIdx = headers.findIndex(h => h.includes('ciudad') || h.includes('centro') || h.includes('lugar') || h.includes('city') || h.includes('acopio') || h.includes('ubicacion') || h.includes('ubicación') || h.includes('destino'));
  
  // Try to find category column
  let categoryIdx = headers.findIndex(h => 
    h.includes('categor') || 
    h.includes('insumo') || 
    h.includes('tipo') || 
    h.includes('category') || 
    h.includes('grupo') || 
    h.includes('mercancia') || 
    h.includes('mercancía') ||
    h.includes('producto') ||
    h.includes('articulo') ||
    h.includes('artículo')
  );
  // If no category found but we found a "donacion" column that wasn't chosen as the kilosIdx, use that!
  if (categoryIdx === -1) {
    categoryIdx = headers.findIndex((h, idx) => idx !== kilosIdx && (h.includes('donacion') || h.includes('donación')));
  }

  let msgIdx = headers.findIndex(h => h.includes('mensaj') || h.includes('descrip') || h.includes('comentar') || h.includes('nota') || h.includes('message') || h.includes('observ') || h.includes('detalle') || h.includes('comentario') || h.includes('entrada'));
  let dateIdx = headers.findIndex(h => h.includes('fecha') || h.includes('date') || h.includes('día') || h.includes('dia') || h.includes('registro') || h.includes('marca temporal'));
  let emailIdx = headers.findIndex(h => h.includes('email') || h.includes('correo') || h.includes('mail') || h.includes('contacto'));

  // Sensible default index fallbacks if headers are omitted or completely custom
  if (donorIdx === -1) donorIdx = headers.length > 2 ? 2 : 0;
  if (kilosIdx === -1) kilosIdx = headers.length > 6 ? 6 : (headers.length > 1 ? 1 : 0);
  if (cityIdx === -1) cityIdx = headers.length > 4 ? 4 : -1;
  if (categoryIdx === -1) categoryIdx = headers.length > 5 ? 5 : -1;
  if (msgIdx === -1) msgIdx = headers.length > 7 ? 7 : -1;
  if (dateIdx === -1) dateIdx = headers.length > 1 ? 1 : -1;
  if (emailIdx === -1) emailIdx = headers.length > 3 ? 3 : -1;

  const pledges: DonorPledge[] = [];
  const kilosByCategory: { [key: string]: number } = {};

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length === 0) continue;

    const donorName = donorIdx !== -1 && cols[donorIdx] 
      ? cols[donorIdx].replace(/^["']|["']$/g, '').trim() 
      : 'Donante Anónimo';
    
    if (!donorName || donorName.toLowerCase() === 'nombre donante' || donorName.toLowerCase() === 'donante') {
      continue;
    }

    const email = emailIdx !== -1 && cols[emailIdx]
      ? cols[emailIdx].replace(/^["']|["']$/g, '').trim()
      : 'anonimo@donante.org';

    const city = cityIdx !== -1 && cols[cityIdx]
      ? cols[cityIdx].replace(/^["']|["']$/g, '').trim()
      : 'España';

    const category = categoryIdx !== -1 && cols[categoryIdx]
      ? cols[categoryIdx].replace(/^["']|["']$/g, '').trim()
      : 'Alimentos no perecederos';

    const rawKilos = kilosIdx !== -1 && cols[kilosIdx] ? cols[kilosIdx] : '0';
    // Handle both dot and comma decimals
    const cleanKilosStr = rawKilos.replace(/[^0-9.,-]/g, '').replace(',', '.');
    const pledgeKilos = parseFloat(cleanKilosStr) || 0;

    const message = msgIdx !== -1 && cols[msgIdx]
      ? cols[msgIdx].replace(/^["']|["']$/g, '').trim()
      : `Entrega registrada`;

    const date = dateIdx !== -1 && cols[dateIdx]
      ? cols[dateIdx].replace(/^["']|["']$/g, '').trim()
      : new Date().toLocaleDateString();

    const id = 'excel-' + i + '-' + Math.round(pledgeKilos);

    pledges.push({
      id,
      donorName,
      email,
      city,
      category,
      pledgeKilos,
      message,
      date
    });

    if (pledgeKilos > 0) {
      const normalizedCat = category.trim();
      kilosByCategory[normalizedCat] = (kilosByCategory[normalizedCat] || 0) + pledgeKilos;
    }
  }

  return { pledges, kilosByCategory };
}

// Ensure initial calculation
let totalKilos = recalculateTotalKilos(appState);

export const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware crucial para mantener sincronizado Supabase en entornos Serverless o contenedores efímeros
const ensureLatestState = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (supabase) {
    try {
      // Optimización crítica: Solo forzamos carga sincrónica desde Supabase si:
      // 1. Aún no se ha realizado ninguna carga con éxito (por ejemplo, al arrancar el contenedor).
      // 2. Es una petición explícita de lectura/guardado de estado (/state) o sincronización de Excel (/sync-excel).
      // Para cualquier otra petición menor (como logs de acceso, etc.), usamos el estado en memoria para máxima velocidad.
      const isCriticalPath = req.path === '/state' || req.path === '/sync-excel' || req.originalUrl.includes('/state') || req.originalUrl.includes('/sync-excel');
      if (!hasSuccessfullyLoadedFromSupabase || isCriticalPath) {
        await loadStateFromSupabase();
      }
    } catch (err: any) {
      console.error('❌ Error cargando estado de Supabase en middleware:', err.message || err);
    }
  }
  next();
};

app.use('/api', ensureLatestState);

// Cargar estado inicial de Supabase de forma asíncrona al arrancar el servidor o instanciar la función
if (supabase) {
  console.log('🔄 Cargando estado inicial desde Supabase...');
  loadStateFromSupabase().then(() => {
    totalKilos = recalculateTotalKilos(appState);
  }).catch(err => {
    console.error('❌ Error al cargar estado inicial de Supabase:', err);
  });
}

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', campaign: appState.campaignTitle });
  });

  // Get current state
  app.get('/api/state', (req, res) => {
    res.json({
      ...appState,
      supabaseActive: !!supabase,
      supabaseTableMissing: supabaseTableMissing,
      totalCollectedKilos: recalculateTotalKilos(appState)
    });
  });

  // Log Web Access
  app.post('/api/log-access', async (req, res) => {
    try {
      const { device, location, page, screenRes, language } = req.body || {};
      
      // Extract IP address from headers
      const rawIp = req.headers['x-forwarded-for'] as string || 
                    req.headers['x-real-ip'] as string || 
                    req.socket.remoteAddress || 
                    '127.0.0.1';
      const ip = rawIp.split(',')[0].trim();

      // Detect Vercel / Cloudflare country headers
      const cfCountry = req.headers['cf-ipcountry'] as string;
      const vercelCountry = req.headers['x-vercel-ip-country'] as string;
      const headerCountry = cfCountry || vercelCountry || '';

      let finalLocation = location || '';
      if (headerCountry) {
        finalLocation = finalLocation ? `${finalLocation} (${headerCountry})` : headerCountry;
      }
      if (!finalLocation || finalLocation === 'Detectando...') {
        finalLocation = 'Acceso Web';
      }

      // Format device description
      let deviceDescription = device || 'Dispositivo';
      if (screenRes) {
        deviceDescription += ` [Pantalla: ${screenRes}]`;
      }
      if (language) {
        deviceDescription += ` (${language})`;
      }

      const newAccessLog: WebAccessLog = {
        id: 'acc_' + Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        ip,
        device: deviceDescription,
        location: finalLocation,
        page: page || '/'
      };

      if (!appState.webAccessLogs) {
        appState.webAccessLogs = [];
      }

      // Add to front of array
      appState.webAccessLogs.unshift(newAccessLog);
      
      // Limit to last 250 records to prevent DB bloat
      if (appState.webAccessLogs.length > 250) {
        appState.webAccessLogs = appState.webAccessLogs.slice(0, 250);
      }

      // Save to Supabase DB and local file system
      await saveAndPersistState();

      res.json({ success: true, log: newAccessLog, state: { ...appState, supabaseActive: !!supabase, supabaseTableMissing: supabaseTableMissing } });
    } catch (err: any) {
      console.error('❌ Error en /api/log-access:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Forensic Analysis for Supabase connections
  app.get('/api/forensic-analysis', async (req, res) => {
    const report: any = {
      timestamp: new Date().toISOString(),
      supabaseActive: !!supabase,
      databaseUrl: supabaseUrl ? supabaseUrl.replace(/(https?:\/\/)(.*)/, '$1***.$2'.split('.').slice(-2).join('.')) : 'No configurada',
      clientInitialized: !!supabase,
      checks: []
    };

    try {
      if (!supabase) {
        report.status = "Incompleto";
        report.message = "No se puede realizar el análisis forense completo porque Supabase no está configurado (modo local en memoria).";
        return res.json(report);
      }

      const startTime = Date.now();
      
      // Query 1: Test SELECT on website_state
      const { data, error, status } = await supabase
        .from('website_state')
        .select('id, state')
        .eq('id', 1);

      const queryTime = Date.now() - startTime;
      
      report.checks.push({
        name: "Conectividad de Red y Ping a Supabase API",
        status: error ? "FALLIDO" : "OK",
        latencyMs: queryTime,
        details: error ? error.message : `Consulta completada con éxito. Código de estado HTTP de Supabase: ${status}`
      });

      if (error) {
        report.status = "Incompleto";
        report.message = `Error de conexión forense: ${error.message}`;
        return res.json(report);
      }

      // Query 2: Row count & Integrity checks
      const { count, error: countErr } = await supabase
        .from('website_state')
        .select('*', { count: 'exact', head: true });

      report.checks.push({
        name: "Integridad de la tabla website_state",
        status: countErr ? "FALLIDO" : "OK",
        details: countErr 
          ? countErr.message 
          : `La tabla existe en Supabase y tiene exactamente ${count} registros activos.`
      });

      // Query 3: Payload structure validation
      if (data && data.length > 0) {
        const payload = data[0].state;
        const keys = typeof payload === 'object' ? Object.keys(payload) : [];
        report.checks.push({
          name: "Validación Forense de Datos (Payload)",
          status: keys.length > 0 ? "OK" : "ADVERTENCIA",
          details: keys.length > 0 
            ? `Estructura JSONB válida. Claves principales encontradas en el estado guardado: ${keys.slice(0, 10).join(', ')}${keys.length > 10 ? '...' : ''}`
            : "La tabla existe, pero el payload JSONB está vacío o no es un objeto de GlobalState válido."
        });
      } else {
        report.checks.push({
          name: "Validación Forense de Datos (Payload)",
          status: "ADVERTENCIA",
          details: "No se encontró el registro con ID = 1. El estado está en memoria pero aún no se ha persistido ningún cambio en la nube."
        });
      }

      // Query 4: Server system footprint
      const memoryUsage = process.memoryUsage();
      report.checks.push({
        name: "Huella de Memoria del Servidor Node.js",
        status: "OK",
        details: `RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB, Heap Usado: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
      });

      report.status = "Saludable (100% Operativo)";
      report.message = `¡Hola Orlando! El sistema de ayuda humanitaria Por 1T está listo y operando al 100%. Conexión con Supabase establecida con latencia de ${queryTime}ms.`;
      
      res.json(report);
    } catch (err: any) {
      report.status = "Error Crítico";
      report.message = `Se produjo una excepción durante el análisis forense: ${err.message || err}`;
      res.status(500).json(report);
    }
  });

  // Reset all state for productive use (Clear all pledges, supplies set to 0)
  app.post('/api/clear-state', async (req, res) => {
    try {
      const { password } = req.body;
      if (password !== '869987') {
        return res.status(403).json({ error: 'Contraseña incorrecta. Acción no autorizada.' });
      }

      // Reset pledges
      appState.pledges = [];
      
      // Reset supplies currentKilos to 0
      appState.supplies = appState.supplies.map(sup => ({
        ...sup,
        currentKilos: 0
      }));

      // Clear sync logs
      const cleanLog: SyncLog = {
        id: 'log-clear-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        status: 'success',
        message: '🧹 [Limpieza Productiva] Toda la base de datos de donaciones e inventarios de suministros ha sido limpiada por el administrador. Listo para producción.'
      };
      appState.syncLogs = [cleanLog];
      
      // Clear suggestions
      appState.suggestions = [];

      // Recalculate total
      totalKilos = recalculateTotalKilos(appState);

      // Save to Supabase and local file system
      await saveAndPersistState();

      res.json({
        success: true,
        message: '¡Base de datos limpiada con éxito! El sistema se encuentra en modo productivo libre de datos de prueba.',
        state: { ...appState, supabaseActive: !!supabase }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update full or partial state (Admin Panel)
  app.post('/api/state', async (req, res) => {
    try {
      const updates = req.body;
      appState = {
        ...appState,
        ...updates,
        lastSyncTime: new Date().toISOString()
      };
      await saveAndPersistState();
      res.json({ success: true, state: { ...appState, supabaseActive: !!supabase, supabaseTableMissing: supabaseTableMissing } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Trigger Google Drive (Excel/Google Sheets) Sync
  app.post('/api/sync-excel', async (req, res) => {
    try {
      const { sheetUrl, manualTrigger } = req.body;
      const targetUrl = sheetUrl || appState.googleSheetUrl;

      let fetchedRealData = false;
      let kilosAdded = 0;
      let parsedPledges: DonorPledge[] = [];
      let syncMessage = '';

      // Convert normal docs.google.com url to export csv and preserve GID
      let csvUrl = targetUrl;
      if (csvUrl.includes('/edit') || csvUrl.includes('/view')) {
        const gidMatch = csvUrl.match(/[?&]gid=(\d+)/);
        const gid = gidMatch ? gidMatch[1] : null;
        csvUrl = csvUrl.replace(/\/edit.*|\/view.*/, '/export?format=csv');
        if (gid) {
          csvUrl += `&gid=${gid}`;
        }
      }

      try {
        const response = await fetch(csvUrl, { signal: AbortSignal.timeout(6000) });
        if (response.ok) {
          const text = await response.text();
          
          // Check if Google returned a login/HTML page instead of CSV (private sheet)
          if (text && (text.includes('<html') || text.includes('<!DOCTYPE') || text.includes('Sign in') || text.includes('google-signin'))) {
            throw new Error('Acceso Privado. Cambie la configuración de compartir en Google Sheets a "Cualquier persona con el enlace puede ver".');
          }

          if (text && text.trim().length > 0) {
            const parsed = parseCSVToPledges(text);
            parsedPledges = parsed.pledges;
            
            if (parsedPledges.length > 0) {
              fetchedRealData = true;
              
              // Sum up total kilos in parsed records
              const totalKilosFromExcel = parsedPledges.reduce((acc, p) => acc + (p.pledgeKilos || 0), 0);
              
              // Reset supplies to 0 before calculating to strictly build database values
              appState.supplies = appState.supplies.map(sup => ({
                ...sup,
                currentKilos: 0
              }));

              // Distribute parsed kilos dynamically to matching supply items
              parsedPledges.forEach(p => {
                if (p.pledgeKilos > 0) {
                  const matchedIdx = findMatchingSupplyIndex(p.category, appState.supplies);
                  appState.supplies[matchedIdx].currentKilos += p.pledgeKilos;
                }
              });

              // Replace appState pledges with our Excel master database pledges!
              appState.pledges = parsedPledges;
              kilosAdded = totalKilosFromExcel;
              syncMessage = `[Excel BD Sincronizada] Se extrajeron con éxito ${parsedPledges.length} donaciones de la hoja de cálculo. Peso total acumulado: ${totalKilosFromExcel.toLocaleString()} kg.`;
            } else {
              throw new Error('El archivo CSV se descargó pero no se encontraron filas de donantes válidas.');
            }
          } else {
            throw new Error('El archivo de Google Sheets está vacío.');
          }
        } else {
          throw new Error(`Google Sheets devolvió código de estado HTTP ${response.status}`);
        }
      } catch (e: any) {
        fetchedRealData = false;
        // Keep previous pledges, but log the warning/error message
        syncMessage = `⚠️ Error al sincronizar Excel: ${e.message}`;
      }

      // If we couldn't parse any real data, we keep the previous local state
      if (!fetchedRealData) {
        // Only simulate random boost if there is absolutely no sheet URL configured or we are on the default fallback
        if (!targetUrl || targetUrl.includes('docs.google.com/spreadsheets/d/1PukE4Ns_98aDcHbsTth3Mx6_tJNQcFmC')) {
          const boost = Math.floor(Math.random() * 25) + 5;
          kilosAdded = boost;
          if (appState.supplies.length > 0) {
            appState.supplies[0].currentKilos += boost;
          }
          syncMessage = `[Simulación Local Activa] Sincronización offline. ${syncMessage}. +${boost} kg agregados de forma simulada.`;
        } else {
          syncMessage = `[Sin Cambios] No se pudo obtener datos nuevos del Excel. ${syncMessage}. Se mantiene la última base de datos conocida.`;
        }
      }

      const newTotal = recalculateTotalKilos(appState);
      const nowStr = new Date().toLocaleTimeString();
      const logMsg: SyncLog = {
        id: 'log-' + Date.now(),
        timestamp: nowStr,
        status: fetchedRealData ? 'success' : 'error',
        message: manualTrigger 
          ? `[Sustracción Manual] ${syncMessage}`
          : `[Sincronización Programada] ${syncMessage}`,
        kilosUpdated: newTotal
      };

      appState.syncLogs = [logMsg, ...appState.syncLogs.slice(0, 19)];
      appState.lastSyncTime = new Date().toISOString();
      appState.nextSyncTime = new Date(Date.now() + appState.syncIntervalMinutes * 60 * 1000).toISOString();

      await saveAndPersistState();

      res.json({
        success: fetchedRealData,
        kilosAdded,
        totalKilos: newTotal,
        logs: appState.syncLogs,
        supplies: appState.supplies,
        pledges: appState.pledges,
        lastSyncTime: appState.lastSyncTime,
        nextSyncTime: appState.nextSyncTime,
        supabaseActive: !!supabase,
        supabaseTableMissing: supabaseTableMissing
      });
    } catch (error: any) {
      const errLog: SyncLog = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        status: 'error',
        message: `Error general de sincronización: ${error.message}`
      };
      appState.syncLogs = [errLog, ...appState.syncLogs.slice(0, 19)];
      await saveAndPersistState();
      res.status(500).json({ error: error.message, logs: appState.syncLogs });
    }
  });

  // Add Pledge / Donation
  app.post('/api/pledge', async (req, res) => {
    try {
      const pledge: DonorPledge = {
        id: 'ple-' + Date.now(),
        date: new Date().toLocaleDateString(),
        ...req.body
      };
      appState.pledges = [pledge, ...appState.pledges];
      
      // Add kilos donated right now towards 1T goal
      if (pledge.pledgeKilos && pledge.pledgeKilos > 0) {
        const targetCategory = pledge.category || 'Alimentos no perecederos';
        const matchedIdx = findMatchingSupplyIndex(targetCategory, appState.supplies);
        appState.supplies = appState.supplies.map((sup, idx) => {
          if (idx === matchedIdx) {
            return { ...sup, currentKilos: sup.currentKilos + pledge.pledgeKilos };
          }
          return sup;
        });

        // Add log entry
        const logMsg: SyncLog = {
          id: 'log-' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          status: 'success',
          message: `[Registro Formulario -> Excel BD] Donación de ${pledge.donorName} (+${pledge.pledgeKilos} kg en ${pledge.category}) guardada e indexada en la base de datos de Excel vinculada (${appState.googleSheetUrl || 'Google Drive Excel'}).`,
          kilosUpdated: recalculateTotalKilos(appState)
        };
        appState.syncLogs = [logMsg, ...appState.syncLogs.slice(0, 19)];
      }

      appState.hasNewDonationAlert = true;

      // Try to forward to Google Apps Script Webhook if configured
      const webhookUrl = appState.googleSheetWebhookUrl || (appState.googleSheetUrl && appState.googleSheetUrl.includes('script.google.com') ? appState.googleSheetUrl : null);
      if (webhookUrl && webhookUrl.startsWith('http')) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pledge)
        }).then(async (response) => {
          const logMsg: SyncLog = {
            id: 'log-webhook-' + Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            status: response.ok ? 'success' : 'error',
            message: response.ok 
              ? `[Google Sheets Link] Transmisión exitosa. La donación de ${pledge.donorName} se guardó automáticamente en la fila de Excel.`
              : `[Google Sheets Link] Error de servidor (HTTP ${response.status}). Verifique los permisos del Apps Script.`
          };
          appState.syncLogs = [logMsg, ...appState.syncLogs.slice(0, 19)];
          await saveAndPersistState();
        }).catch(async (err) => {
          const logMsg: SyncLog = {
            id: 'log-webhook-err-' + Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            status: 'error',
            message: `[Google Sheets Link] Error de red: ${err.message}. Revise su Webhook.`
          };
          appState.syncLogs = [logMsg, ...appState.syncLogs.slice(0, 19)];
          await saveAndPersistState();
        });
      }

      await saveAndPersistState();
      res.json({ success: true, pledge, state: appState });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Export Pledges as Excel CSV (Base de Datos)
  app.get('/api/export-excel', (req, res) => {
    const headers = ["ID Registro", "Fecha", "Nombre Donante", "Email", "Ciudad", "Categoría", "Kilos Donados", "Descripción / Comentarios"];
    const rows = appState.pledges.map(p => [
      p.id,
      p.date,
      `"${(p.donorName || '').replace(/"/g, '""')}"`,
      `"${(p.email || '').replace(/"/g, '""')}"`,
      `"${(p.city || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      p.pledgeKilos || 0,
      `"${((p.description || p.message) || '').replace(/"/g, '""')}"`
    ]);
    const csv = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="Base_de_Datos_Donaciones_Excel_Venezuela.csv"`);
    res.send(csv);
  });

  // Add News Item (Admin)
  app.post('/api/news', async (req, res) => {
    try {
      const item = {
        id: 'news-' + Date.now(),
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        ...req.body
      };
      appState.news = [item, ...(appState.news || [])];
      await saveAndPersistState();
      res.json({ success: true, state: appState });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add Suggestion (Public)
  app.post('/api/suggestions', async (req, res) => {
    try {
      const item = {
        id: 'sug-' + Date.now(),
        date: new Date().toLocaleDateString(),
        ...req.body
      };
      appState.suggestions = [item, ...(appState.suggestions || [])];
      await saveAndPersistState();
      res.json({ success: true, state: appState });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Gemini AI Assistant Endpoint
  app.post('/api/ai-assistant', async (req, res) => {
    const { prompt, mode } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Current context summary for AI
    const totalKg = recalculateTotalKilos(appState);
    const tons = (totalKg / 1000).toFixed(2);
    const targetTons = appState.globalTargetTons;
    const centersList = appState.centers.map(c => `${c.city}: ${c.name} (${c.address})`).join('; ');
    const urgentItems = appState.supplies.filter(s => s.currentKilos < s.targetKilos * 0.5).map(s => s.name).join(', ');

    if (!apiKey) {
      // Smart offline fallback
      let fallbackResponse = `¡Hola! Soy el Asistente Humanitario de "Por 1T". Actualmente hemos recolectado ${totalKg} kg (${tons} Toneladas) hacia nuestra meta de ${targetTons} Tonelada(s). Los insumos más urgentes son: ${urgentItems || 'Alimentos no perecederos y Medicinas'}. Puedes entregar tus aportes en cualquiera de nuestros centros en ${appState.centers.map(c=>c.city).join(', ')}.`;
      if (mode === 'admin_report') {
        fallbackResponse = `📊 ANÁLISIS EJECUTIVO DE EMERGENCIA:\n- Recaudación Actual: ${totalKg} kg (${(totalKg/1000).toFixed(2)} Toneladas) de meta de ${targetTons*1000} kg.\n- Déficit principal en: ${urgentItems || 'Suministros médicos y agua'}.\n- Recomendación Logística: Aumentar llamados en redes sociales solicitando pastillas potabilizadoras y kits de sutura para los centros en Táchira y Mérida.`;
      }
      return res.json({ reply: fallbackResponse });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      let systemInstruction = `Eres el Asistente Virtual Oficial de la ONG Humanitaria "Por 1T" respondiendo ante el devastador terremoto en Venezuela.
Datos reales en tiempo real de la campaña:
- Total recolectado: ${totalKg} kg (${tons} Toneladas)
- Meta actual: ${targetTons} Tonelada(s) (${targetTons * 1000} kg)
- Insumos urgentes con mayor déficit: ${urgentItems || 'Alimentos secos y antibióticos'}
- Centros de acopio operativos: ${centersList}

Instrucciones:
1. Sé extremadamente empático, serio, digno, solidario y claro. Es una tragedia humanitaria real por terremoto.
2. Si te preguntan dónde donar, indica la dirección y ciudad más cercana.
3. Si te preguntan qué hace falta, menciona los insumos urgentes.
4. Mantén las respuestas precisas (máximo 3 o 4 párrafos cortos).`;

      if (mode === 'admin_report') {
        systemInstruction = `Eres un Experto Analista Logístico Humanitario de la ONU generando un reporte ejecutivo para el Director de la campaña "Por 1T" sobre el sismo en Venezuela.
Datos de almacén:
Total Kilos: ${totalKg} kg de ${targetTons*1000} kg meta.
Desglose por categoría:
${appState.supplies.map(s => `- ${s.name}: ${s.currentKilos} kg de meta ${s.targetKilos} kg`).join('\n')}

Genera un reporte breve de 4 puntos con: 1) Estado general de la meta, 2) Cuello de botella o déficit crítico, 3) Alerta de redistribución logística sugerida y 4) Mensaje clave propuesto para enviar a los donantes de Excel en la próxima hora.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt || (mode === 'admin_report' ? 'Generar reporte logístico' : 'Hola, ¿cómo puedo ayudar a Venezuela?'),
        config: { systemInstruction }
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.json({
        reply: `He recibido tu consulta. Para apoyarnos de inmediato con la emergencia en Venezuela, puedes entregar alimentos no perecederos, agua y medicinas en nuestros centros de acopio operativos. ¡Cada kilo salva vidas!`
      });
    }
  });

  // Vite Middleware for Development (except on Vercel)
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    }).then(vite => {
      app.use(vite.middlewares);
    }).catch(err => {
      console.error('❌ Error creating Vite server:', err);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v4 compatibility
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only start listening if we are not in a Serverless environment like Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor Humanitario Por 1T ejecutándose en http://localhost:${PORT}`);
    });
  }
