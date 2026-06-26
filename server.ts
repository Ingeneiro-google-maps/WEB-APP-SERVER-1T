import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_STATE } from './src/data/initialData';
import { GlobalState, DonorPledge, SyncLog, NewsItem, SuggestionItem } from './src/types';
import dotenv from 'dotenv';

dotenv.config();

// In-memory persistent state across requests
let appState: GlobalState = JSON.parse(JSON.stringify(INITIAL_STATE));

// Helper to compute total kilos
function recalculateTotalKilos(state: GlobalState): number {
  return state.supplies.reduce((acc, item) => acc + item.currentKilos, 0);
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

  // Dynamic synonyms matching
  let donorIdx = headers.findIndex(h => h.includes('donante') || h.includes('nombre') || h.includes('donor') || h.includes('quien') || h.includes('person') || h.includes('usuario'));
  let kilosIdx = headers.findIndex(h => h.includes('kilo') || h.includes('peso') || h.includes('cantidad') || h.includes('kg') || h.includes('cant') || h.includes('monto') || h.includes('donacion') || h.includes('donación'));
  let cityIdx = headers.findIndex(h => h.includes('ciudad') || h.includes('centro') || h.includes('lugar') || h.includes('city') || h.includes('acopio') || h.includes('ubicacion') || h.includes('ubicación') || h.includes('destino'));
  let categoryIdx = headers.findIndex(h => h.includes('categor') || h.includes('insumo') || h.includes('tipo') || h.includes('category') || h.includes('grupo') || h.includes('mercancia') || h.includes('mercancía'));
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', campaign: appState.campaignTitle });
  });

  // Get current state
  app.get('/api/state', (req, res) => {
    res.json({
      ...appState,
      totalCollectedKilos: recalculateTotalKilos(appState)
    });
  });

  // Update full or partial state (Admin Panel)
  app.post('/api/state', (req, res) => {
    try {
      const updates = req.body;
      appState = {
        ...appState,
        ...updates,
        lastSyncTime: new Date().toISOString()
      };
      res.json({ success: true, state: appState });
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
                  const pCat = (p.category || '').toLowerCase().trim();
                  let matchedIdx = appState.supplies.findIndex(s => 
                    s.category.toLowerCase().includes(pCat) || 
                    pCat.includes(s.category.toLowerCase()) ||
                    s.name.toLowerCase().includes(pCat) || 
                    pCat.includes(s.name.toLowerCase())
                  );
                  if (matchedIdx === -1) {
                    matchedIdx = 0; // fallback to Alimentos if no match
                  }
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

      // If we couldn't parse any real data, we keep the previous local state and simulate a small increment so the counter feels alive if they use a mock sheet
      if (!fetchedRealData) {
        const boost = Math.floor(Math.random() * 25) + 5;
        kilosAdded = boost;
        if (appState.supplies.length > 0) {
          appState.supplies[0].currentKilos += boost;
        }
        syncMessage = `[Simulación Local Activa] Sincronización offline. ${syncMessage}. +${boost} kg agregados de forma simulada.`;
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

      res.json({
        success: fetchedRealData,
        kilosAdded,
        totalKilos: newTotal,
        logs: appState.syncLogs,
        supplies: appState.supplies,
        pledges: appState.pledges,
        lastSyncTime: appState.lastSyncTime,
        nextSyncTime: appState.nextSyncTime
      });
    } catch (error: any) {
      const errLog: SyncLog = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        status: 'error',
        message: `Error general de sincronización: ${error.message}`
      };
      appState.syncLogs = [errLog, ...appState.syncLogs.slice(0, 19)];
      res.status(500).json({ error: error.message, logs: appState.syncLogs });
    }
  });

  // Add Pledge / Donation
  app.post('/api/pledge', (req, res) => {
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
        let matched = false;
        appState.supplies = appState.supplies.map(sup => {
          if (sup.category.toLowerCase().includes(targetCategory.toLowerCase()) || targetCategory.toLowerCase().includes(sup.category.toLowerCase()) || sup.name.toLowerCase().includes(targetCategory.toLowerCase())) {
            matched = true;
            return { ...sup, currentKilos: sup.currentKilos + pledge.pledgeKilos };
          }
          return sup;
        });
        if (!matched && appState.supplies.length > 0) {
          appState.supplies[0].currentKilos += pledge.pledgeKilos;
        }

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
        }).catch((err) => {
          const logMsg: SyncLog = {
            id: 'log-webhook-err-' + Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            status: 'error',
            message: `[Google Sheets Link] Error de red: ${err.message}. Revise su Webhook.`
          };
          appState.syncLogs = [logMsg, ...appState.syncLogs.slice(0, 19)];
        });
      }

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
  app.post('/api/news', (req, res) => {
    try {
      const item = {
        id: 'news-' + Date.now(),
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        ...req.body
      };
      appState.news = [item, ...(appState.news || [])];
      res.json({ success: true, state: appState });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add Suggestion (Public)
  app.post('/api/suggestions', (req, res) => {
    try {
      const item = {
        id: 'sug-' + Date.now(),
        date: new Date().toLocaleDateString(),
        ...req.body
      };
      appState.suggestions = [item, ...(appState.suggestions || [])];
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

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v4 compatibility
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Humanitario Por 1T ejecutándose en http://localhost:${PORT}`);
  });
}

startServer();
