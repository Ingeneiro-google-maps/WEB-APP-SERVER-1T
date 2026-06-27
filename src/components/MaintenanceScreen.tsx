import React, { useState, useEffect } from 'react';
import { Wrench, Clock, Server, Database, Cpu, ShieldAlert, KeyRound, RefreshCw } from 'lucide-react';

interface MaintenanceScreenProps {
  reason?: string;
  endTimestamp?: string;
  onUnlockAdmin: () => void;
}

export function MaintenanceScreen({ reason, endTimestamp, onUnlockAdmin }: MaintenanceScreenProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true
  });
  const [isChecking, setIsChecking] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!endTimestamp) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(endTimestamp).getTime();
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
  }, [endTimestamp]);

  const handleRefreshState = () => {
    setIsChecking(true);
    // Reload state after 1 second
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  // Determine icon based on the professional reason text
  const getReasonIcon = () => {
    const text = (reason || '').toLowerCase();
    if (text.includes('base de datos') || text.includes('database')) {
      return <Database className="w-12 h-12 text-amber-400 animate-pulse" />;
    }
    if (text.includes('servidor') || text.includes('server') || text.includes('infraestructura')) {
      return <Server className="w-12 h-12 text-amber-400 animate-bounce" />;
    }
    if (text.includes('procesamiento') || text.includes('datos') || text.includes('procesamiento de datos')) {
      return <Cpu className="w-12 h-12 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />;
    }
    return <Wrench className="w-12 h-12 text-amber-400 animate-pulse" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-6 font-sans select-none relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Decorative ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center py-4 border-b border-slate-900/80 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xl">🇻🇪</span>
          <span className="font-black tracking-widest text-xs uppercase text-slate-400">Acción humanitaria: Emergencia Venezuela</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Offline por Mantenimiento</span>
        </div>
      </div>

      {/* Main Card Section */}
      <div className="w-full max-w-2xl mx-auto py-12 text-center space-y-8 z-10">
        <div className="mx-auto w-24 h-24 bg-slate-900/90 rounded-3xl border border-slate-800/80 flex items-center justify-center shadow-2xl relative">
          {getReasonIcon()}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-500 rounded-xl flex items-center justify-center border-4 border-slate-950 shadow">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-950" />
          </div>
        </div>

        <div className="space-y-3">
          <span className="px-3 py-1 bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-black uppercase tracking-widest rounded-full">
            Ventana de Intervención Técnica
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
            🛠️ CUANDO USTED ESTÉ BLOQUEADO POR EL MANTENIMIENTO, SEA POR 1T
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Optimización y Aseguramiento de Calidad en Curso
          </p>
        </div>

        {/* Motivo Detallado Box */}
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/60 shadow-xl space-y-2 max-w-lg mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block">
            MOTIVO DE LA SUSPENSIÓN TEMPORAL
          </span>
          <p className="text-sm text-slate-200 font-black uppercase leading-relaxed font-sans">
            "{reason || 'Actualización y optimización de base de datos relacional de acopio'}"
          </p>
          <p className="text-[10px] text-slate-500 leading-normal pt-1">
            Nuestros ingenieros de infraestructura están implementando mejoras para asegurar un procesamiento de donaciones de alta fidelidad, baja latencia y máxima seguridad relacional.
          </p>
        </div>

        {/* Dynamic Countdown Timer Section */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-wider">Tiempo Estimado de Retorno</span>
          </div>

          {!endTimestamp ? (
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-widest">
              ⏳ Periodo de Mantenimiento Indefinido
            </div>
          ) : timeLeft.isExpired ? (
            <div className="bg-emerald-900/20 p-5 rounded-2xl border border-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-widest animate-pulse space-y-2">
              <span>🎉 ¡Actualización técnica completada!</span>
              <p className="text-[10px] text-slate-400 font-medium normal-case">El sistema se encuentra en proceso de reapertura. Por favor, refresque la página para acceder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 bg-slate-900/40 p-6 rounded-3xl border border-slate-900/80 shadow-inner">
              <div className="flex flex-col items-center p-3 bg-slate-950/80 rounded-2xl border border-slate-900">
                <span className="text-4xl font-black font-mono leading-none text-white tracking-widest">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider mt-2">Horas</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-slate-950/80 rounded-2xl border border-slate-900">
                <span className="text-4xl font-black font-mono leading-none text-white tracking-widest">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider mt-2">Minutos</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-slate-950/80 rounded-2xl border border-slate-900">
                <span className="text-4xl font-black font-mono leading-none text-amber-400 tracking-widest animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider mt-2">Segundos</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleRefreshState}
            disabled={isChecking}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest border border-slate-800 hover:border-slate-700 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-400 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Comprobando Conexión...' : 'Comprobar Estado En Línea'}</span>
          </button>
        </div>
      </div>

      {/* Footer / Admin Access Trigger */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center py-6 border-t border-slate-900/60 text-[10px] text-slate-600 font-bold uppercase tracking-wider z-10 gap-4">
        <span>Todos los derechos reservados por el desarrollo de este sistema al ingeniero Orlando Galdámez.</span>
        
        <button
          onClick={() => {
            setShowPasswordModal(true);
            setErrorMsg('');
            setPasswordAttempt('');
          }}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition font-black bg-transparent border-0 cursor-pointer py-1 px-2.5 rounded hover:bg-slate-900/50"
        >
          <KeyRound className="w-3.5 h-3.5 text-slate-600" />
          <span>Ingreso de Operadores</span>
        </button>
      </div>

      {/* Sleek, secure password verification modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full space-y-6 shadow-2xl relative animate-fade-in">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-center shadow-lg">
                <KeyRound className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-wide">Acceso de Operadores</h3>
              <p className="text-[11px] text-slate-400">Ingrese la clave de seguridad para ingresar al Panel de Administración.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordAttempt === 'Isabella2015$') {
                setErrorMsg('');
                setShowPasswordModal(false);
                onUnlockAdmin();
              } else {
                setErrorMsg('❌ Clave incorrecta. Acceso denegado.');
              }
            }} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Clave de Seguridad:</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passwordAttempt}
                  onChange={(e) => setPasswordAttempt(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 font-mono text-center tracking-widest"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-rose-500 text-xs font-bold text-center">{errorMsg}</p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="py-3 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest transition cursor-pointer text-center"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
