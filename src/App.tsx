import React, { useState, useEffect } from 'react';
import { INITIAL_STATE } from './data/initialData';
import { GlobalState } from './types';
import { Header } from './components/Header';
import { HeroCounter } from './components/HeroCounter';
import { CollectionCenters } from './components/CollectionCenters';
import { DonationList } from './components/DonationList';
import { NewsSection } from './components/NewsSection';
import { FAQSection } from './components/FAQSection';
import { SuggestionsSection } from './components/SuggestionsSection';
import { AdminPanel } from './components/AdminPanel';
import { DonationModal } from './components/DonationModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Footer } from './components/Footer';
import { IntroVideoModal } from './components/IntroVideoModal';

export default function App() {
  const [state, setState] = useState<GlobalState>(INITIAL_STATE);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [viewMode] = useState<'normal' | 'all-centers'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'centros' ? 'all-centers' : 'normal';
    }
    return 'normal';
  });

  // Fetch initial state from server
  useEffect(() => {
    fetch('/api/state')
      .then(res => res.json())
      .then(data => {
        if (data && data.supplies) {
          setState(data);
        }
      })
      .catch(err => console.error('Error fetching state:', err));

    // Log access of this user
    const gatherAndLogAccess = async () => {
      try {
        const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
        const isTablet = /Tablet|iPad/i.test(navigator.userAgent);
        const deviceType = isMobile ? '📱 Móvil' : isTablet ? '📟 Tablet' : '💻 Escritorio';

        let os = 'Desconocido';
        const ua = navigator.userAgent;
        if (ua.indexOf('Win') !== -1) os = 'Windows';
        else if (ua.indexOf('Mac') !== -1) os = 'macOS';
        else if (ua.indexOf('Linux') !== -1) os = 'Linux';
        else if (ua.indexOf('Android') !== -1) os = 'Android';
        else if (ua.indexOf('like Mac') !== -1) os = 'iOS';

        const screenRes = `${window.innerWidth}x${window.innerHeight}`;
        const location = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Detectando...';
        const language = navigator.language || 'es';
        const page = window.location.pathname;

        const res = await fetch('/api/log-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            device: `${deviceType} (${os})`,
            location,
            page,
            screenRes,
            language
          })
        });
        const data = await res.json();
        if (data && data.state) {
          setState(prev => ({
            ...prev,
            webAccessLogs: data.state.webAccessLogs || prev.webAccessLogs
          }));
        }
      } catch (err) {
        console.error('Error logging access:', err);
      }
    };

    const timer = setTimeout(gatherAndLogAccess, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Automatic Hourly Sync with Google Drive Excel
  useEffect(() => {
    if (!state.autoSyncEnabled) return;

    const interval = setInterval(() => {
      handleTriggerSync(false);
    }, state.syncIntervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.autoSyncEnabled, state.syncIntervalMinutes]);

  const handleTriggerSync = async (manual = true) => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch('/api/sync-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualTrigger: manual })
      });
      const data = await res.json();
      if (data) {
        setState(prev => ({
          ...prev,
          pledges: data.pledges || prev.pledges,
          supplies: data.supplies || prev.supplies,
          syncLogs: data.logs || prev.syncLogs,
          lastSyncTime: data.lastSyncTime || prev.lastSyncTime,
          nextSyncTime: data.nextSyncTime || prev.nextSyncTime,
          supabaseActive: data.supabaseActive !== undefined ? data.supabaseActive : prev.supabaseActive,
          supabaseTableMissing: data.supabaseTableMissing !== undefined ? data.supabaseTableMissing : prev.supabaseTableMissing
        }));
      }
    } catch (err) {
      console.error('Drive Sync Error:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdateState = async (newPartial: Partial<GlobalState>) => {
    const nextState = { ...state, ...newPartial };
    setState(nextState);

    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartial)
      });
      const data = await res.json();
      if (data && data.state) {
        setState(data.state);
      }
    } catch (e) {
      console.error('State Update Error:', e);
    }
  };

  const handleSelectTargetTons = (tons: number) => {
    handleUpdateState({ globalTargetTons: tons });
  };

  const handlePledgeSubmitted = async (pledgeData: any) => {
    try {
      const res = await fetch('/api/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pledgeData)
      });
      const data = await res.json();
      if (data && data.state) {
        setState(data.state);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const centersCities = Array.from(new Set(state.centers.map(c => c.city)));

  if (viewMode === 'all-centers') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F7F9] text-[#1A202C] font-sans">
        <Header
          state={state}
          onOpenAdmin={() => {
            window.location.href = '/';
          }}
          onOpenAi={() => setIsAiOpen(true)}
          isAdminView={false}
          lastSyncTime={state.lastSyncTime}
          onTriggerSync={() => handleTriggerSync(true)}
          syncing={syncing}
        />

        <main className="flex-1 bg-white">
          <CollectionCenters centers={state.centers} showAll={true} />
        </main>

        <Footer onUnlockAdmin={() => {
          window.location.href = '/';
        }} />

        <AiAssistantModal
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          campaignTitle={state.campaignTitle}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F9] text-[#1A202C] font-sans">
      <Header
        state={state}
        onOpenAdmin={() => setIsAdminView(!isAdminView)}
        onOpenAi={() => setIsAiOpen(true)}
        isAdminView={isAdminView}
        lastSyncTime={state.lastSyncTime}
        onTriggerSync={() => handleTriggerSync(true)}
        syncing={syncing}
      />

      <main className="flex-1">
        {isAdminView ? (
          <AdminPanel
            state={state}
            onUpdateState={handleUpdateState}
            onTriggerSync={() => handleTriggerSync(true)}
            syncing={syncing}
            onExitAdmin={() => setIsAdminView(false)}
          />
        ) : (
          <div>
            <HeroCounter
              state={state}
              onSelectTargetTons={handleSelectTargetTons}
              onOpenDonation={() => setIsDonationOpen(true)}
              onTriggerSync={() => handleTriggerSync(true)}
              syncing={syncing}
            />

            {state.visibleBlocks?.centersGrid !== false && (
              <CollectionCenters centers={state.centers} />
            )}

            {state.visibleBlocks?.donationsList !== false && (
              <DonationList
                pledges={state.pledges || []}
                onTriggerSync={() => handleTriggerSync(true)}
                syncing={syncing}
              />
            )}

            {state.visibleBlocks?.newsSection !== false && (
              <NewsSection news={state.news || []} />
            )}

            {state.visibleBlocks?.faqSection !== false && (
              <FAQSection faqs={state.faqs} />
            )}

            {state.visibleBlocks?.suggestionsSection !== false && (
              <SuggestionsSection suggestions={state.suggestions || []} />
            )}
          </div>
        )}
      </main>

      <Footer onUnlockAdmin={() => setIsAdminView(true)} />

      {/* Modals */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        onPledgeSubmitted={handlePledgeSubmitted}
        centersCities={centersCities}
        correctPassword={state.donationPassword || 'VENEZUELAVIVE2026'}
      />

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        campaignTitle={state.campaignTitle}
      />

      <IntroVideoModal
        enabled={state.introVideoEnabled !== false}
        youtubeUrl={state.introVideoYoutubeUrl || ''}
        onClose={() => {}}
      />
    </div>
  );
}
