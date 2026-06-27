import React, { useState, useEffect } from 'react';
import { X, HeartHandshake, CheckCircle2, Package, Scale, FileText, User, MapPin, Lock } from 'lucide-react';
import { CollectionCenter } from '../types';
import { getCategoryEmoji } from '../utils';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPledgeSubmitted: (pledgeData: any) => Promise<void>;
  centersCities: string[];
  centers?: CollectionCenter[];
  donationCategories?: string[];
  correctPassword?: string;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onPledgeSubmitted,
  centersCities,
  centers = [],
  donationCategories = [],
  correctPassword = 'VENEZUELAVIVE2026'
}) => {
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    city: '',
    category: donationCategories[0] || 'Alimentos no perecederos',
    description: '',
    pledgeKilos: 10,
    message: ''
  });
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const defaultCategory = donationCategories[0] || 'Alimentos no perecederos';
      if (centers && centers.length > 0) {
        setFormData(prev => ({
          ...prev,
          city: `${centers[0].name} (${centers[0].city})`,
          category: defaultCategory
        }));
      } else if (centersCities && centersCities.length > 0) {
        setFormData(prev => ({
          ...prev,
          city: centersCities[0],
          category: defaultCategory
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          city: 'Madrid',
          category: defaultCategory
        }));
      }
    }
  }, [isOpen, centers, centersCities, donationCategories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName.trim() || formData.pledgeKilos <= 0) return;

    // Validate donation password
    if (inputPassword.trim() !== correctPassword) {
      setPasswordError('La contraseña de registro es incorrecta.');
      return;
    }
    setPasswordError('');

    setSubmitting(true);
    try {
      await onPledgeSubmitted({
        donorName: formData.donorName,
        email: formData.email || 'anonimo@donante.org',
        city: formData.city,
        category: formData.category,
        description: formData.description,
        pledgeKilos: Number(formData.pledgeKilos),
        message: formData.description || formData.message || `Entrega registrada en ${formData.city}`
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          donorName: '',
          email: '',
          city: centers && centers.length > 0 ? `${centers[0].name} (${centers[0].city})` : (centersCities[0] || 'Madrid'),
          category: donationCategories[0] || 'Alimentos no perecederos',
          description: '',
          pledgeKilos: 10,
          message: ''
        });
        setInputPassword('');
        onClose();
      }, 2800);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A202C]/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-[#1A202C]">
        
        {/* Top Header with ONG Blue & Venezuela Tricolor Accent */}
        <div className="bg-[#008CBA] text-white p-6 relative overflow-hidden flex items-center justify-between">
          <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
            <div className="w-1/2 bg-[#FFCC00]"></div>
            <div className="w-1/4 bg-[#00247D]"></div>
            <div className="w-1/4 bg-[#CF142B]"></div>
          </div>

          <div className="flex items-center gap-3.5 z-10">
            <div className="w-12 h-12 bg-white text-[#008CBA] rounded-2xl flex items-center justify-center font-black italic shadow-md">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase tracking-tight">
                Registrar Donación (kg)
              </h3>
              <p className="text-xs text-blue-100 font-bold">Campaña de Ayuda Humanitaria Venezuela</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-10 text-center space-y-4 animate-fade-in my-4">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              ¡DONACIÓN REGISTRADA CON ÉXITO!
            </h4>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-1.5 font-medium text-slate-700">
              <p>📦 <strong>Donante:</strong> {formData.donorName}</p>
              <p>⚖️ <strong>Cantidad:</strong> +{formData.pledgeKilos} kg ({formData.category})</p>
              <p>📍 <strong>Centro de Acopio:</strong> {formData.city}</p>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              ¡Reflejado en el contador global e informado al Administrador!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4.5 max-h-[80vh] overflow-y-auto">
            
            {/* Notice */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs font-semibold text-blue-900 flex items-center gap-2.5">
              <Package className="w-5 h-5 text-[#008CBA] shrink-0" />
              <span>Complete este formulario al depositar su ayuda en un punto de recogida en España. Los kilos se sumarán al objetivo de 1 Tonelada.</span>
            </div>

            {/* Field 1: Nombre del Donante */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#008CBA]" />
                Nombre del Donante / Organización *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. José, hhh o Asociación Solidaria"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#008CBA] focus:bg-white transition"
              />
            </div>

            {/* Field 2 & 3: Categoría + Cantidad (kg) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="sm:col-span-7">
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#008CBA]" />
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#008CBA] cursor-pointer"
                >
                  {donationCategories.map(cat => (
                    <option key={cat} value={cat}>{getCategoryEmoji(cat)} {cat}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#008CBA]" />
                  Cantidad (kg) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    max="1000"
                    required
                    value={formData.pledgeKilos}
                    onChange={(e) => setFormData({ ...formData, pledgeKilos: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-lg font-black font-mono text-slate-900 focus:outline-none focus:border-[#008CBA]"
                  />
                  <span className="font-bold text-sm text-slate-600 font-mono">kg</span>
                </div>
              </div>
            </div>

            {/* Field 4: Descripción */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#008CBA]" />
                Descripción detallada (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Baterías AA precintadas, paquetes de arroz de 1kg..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#008CBA] focus:bg-white"
              />
            </div>

            {/* Field 5: Centro de Acopio de Entrega (Full width for long warehouse names) */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#008CBA]" />
                Centro de Acopio de Entrega *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#008CBA] cursor-pointer"
              >
                {centers && centers.length > 0 ? (
                  centers.map(center => {
                    const label = `${center.name} (${center.city})`;
                    return (
                      <option key={center.id} value={label}>
                        📍 {label}
                      </option>
                    );
                  })
                ) : (
                  centersCities.map(c => (
                    <option key={c} value={c}>📍 {c} (España)</option>
                  ))
                )}
              </select>
              <p className="text-[10px] text-slate-500 font-medium mt-1 leading-normal">
                💡 Seleccione el punto de acopio oficial donde depositó o enviará su ayuda. Todos los centros están operativos con scroll para fácil selección.
              </p>
            </div>

            {/* Field 5b: Email de contacto */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                Email de Contacto (Opcional)
              </label>
              <input
                type="email"
                placeholder="donante@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#008CBA] focus:bg-white"
              />
            </div>

            {/* Field 6: Contraseña de Registro de la Campaña */}
            <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl">
              <label className="block text-xs font-black uppercase text-amber-800 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Contraseña de Seguridad de la Campaña *
              </label>
              <input
                type="password"
                required
                placeholder="Introduzca la contraseña autorizada"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setPasswordError('');
                }}
                className={`w-full px-4 py-3 rounded-xl bg-white border ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-amber-500'} text-sm font-bold text-slate-900 focus:outline-none transition`}
              />
              {passwordError && (
                <p className="text-xs text-red-600 font-bold mt-1.5">{passwordError}</p>
              )}
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Para registrar donaciones, introduzca la clave establecida por el coordinador de campaña.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#008CBA] hover:bg-[#007299] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/25 transition transform active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
            >
              {submitting ? 'Registrando Kilos...' : '➕ Registrar Donación en el Sistema'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
