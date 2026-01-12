import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Measurement } from '../types';

interface AddMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (measurement: Measurement) => void;
}

export const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [weight, setWeight] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [visceralFat, setVisceralFat] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setWeight('');
      setBodyFat('');
      setVisceralFat('');
      setWaist('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !bodyFat || !visceralFat || !waist) return;

    const weightNum = parseFloat(weight);
    const bodyFatNum = parseFloat(bodyFat);
    const visceralNum = parseFloat(visceralFat);
    const waistNum = parseFloat(waist);
    
    // Calculate lean mass: Weight - (Weight * Fat%)
    const fatMass = weightNum * (bodyFatNum / 100);
    const leanMass = weightNum - fatMass;

    const newMeasurement: Measurement = {
      id: crypto.randomUUID(),
      date: new Date(date).toISOString(),
      weight: weightNum,
      bodyFatPercentage: bodyFatNum,
      visceralFatLevel: visceralNum,
      leanMass: leanMass,
      waist: waistNum
    };

    onSave(newMeasurement);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Nueva Medición</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Peso (lbs)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="0.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Grasa Corporal (%)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="0.0"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Grasa Visceral</label>
              <input
                type="number"
                step="0.5"
                required
                placeholder="Nivel"
                value={visceralFat}
                onChange={(e) => setVisceralFat(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cintura (cm)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="cm"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {weight && bodyFat && (
             <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center text-sm text-slate-600">
               <span>Masa Magra Calculada:</span>
               <span className="font-bold">
                 {(parseFloat(weight) * (1 - parseFloat(bodyFat) / 100)).toFixed(1)} lbs
               </span>
             </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
            >
              <Save className="w-5 h-5" />
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};