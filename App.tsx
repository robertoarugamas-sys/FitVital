import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  History, 
  Settings as SettingsIcon, 
  Plus, 
  Scale, 
  Activity, 
  Flame, 
  Dumbbell,
  Ruler,
  PartyPopper
} from 'lucide-react';
import { Measurement, Goals, ViewState, GoalMetrics } from './types';
import { MetricCard } from './components/MetricCard';
import { AddMeasurementModal } from './components/AddMeasurementModal';
import { WeightCompositionChart, VisceralFatChart, WaistChart } from './components/Charts';
import { AICoach } from './components/AICoach';
import { Settings } from './components/Settings';

// Helper to get local storage data
const getStoredData = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const DEFAULT_GOALS: Goals = {
  intermediate: {
    weight: 180,
    bodyFat: 20,
    visceralFat: 8,
    waist: 90
  },
  final: {
    weight: 160,
    bodyFat: 15,
    visceralFat: 5,
    waist: 80
  }
};

const getMotivationalPhrase = (current?: Measurement, previous?: Measurement): string => {
  if (!current) return "¡Bienvenido! Tu viaje hacia una mejor salud comienza hoy.";
  if (!previous) return "¡Primer registro guardado! La constancia es el secreto del éxito.";

  const weightDiff = current.weight - previous.weight;
  const waistDiff = current.waist - previous.waist;
  const muscleDiff = current.leanMass - previous.leanMass;

  if (weightDiff < 0 && waistDiff < 0) return "¡Increíble! Estás bajando peso y reduciendo cintura simultáneamente. 🔥";
  if (weightDiff < 0) return "¡Esas libras están desapareciendo! Sigue con este ritmo. 📉";
  if (waistDiff < 0) return "¡Tu cintura se está afinando! Tu ropa te lo agradecerá. 👖";
  if (muscleDiff > 0) return "¡Estás ganando músculo! Tu metabolismo está ardiendo. 💪";
  if (weightDiff > 0 && muscleDiff > 0) return "El peso subió, pero es músculo. ¡Te estás volviendo más fuerte! 🏋️‍♂️";
  
  return "El progreso no siempre es lineal. ¡Mantén la disciplina y los resultados llegarán! 🚀";
};

const App: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS);
  const [view, setView] = useState<ViewState>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMeasurements(getStoredData<Measurement[]>('fitvital_measurements', []));
    setGoals(getStoredData<Goals>('fitvital_goals', DEFAULT_GOALS));
  }, []);

  useEffect(() => {
    localStorage.setItem('fitvital_measurements', JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem('fitvital_goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddMeasurement = (m: Measurement) => {
    setMeasurements(prev => [m, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleUpdateGoals = (newGoals: Goals) => {
    setGoals(newGoals);
    alert('Objetivos actualizados correctamente');
  };

  const latest = measurements[0];
  const previous = measurements[1];

  const calculateTrend = (current: number, prev: number) => {
    if (!prev) return 0;
    return ((current - prev) / prev) * 100;
  };

  // Logic to determine which goal to display (Intermediate or Final)
  // If we haven't reached intermediate, show intermediate. Else show Final.
  const getActiveTarget = (currentVal: number, intermediateVal: number, finalVal: number, lowerIsBetter: boolean): { val: number, label: string } => {
    if (!currentVal) return { val: intermediateVal, label: 'Meta Intermedia' };
    
    const intermediateMet = lowerIsBetter ? currentVal <= intermediateVal : currentVal >= intermediateVal;
    
    if (intermediateMet) {
       return { val: finalVal, label: 'Meta Final' };
    }
    return { val: intermediateVal, label: 'Meta Intermedia' };
  };

  const weightTarget = getActiveTarget(latest?.weight, goals.intermediate.weight, goals.final.weight, true);
  const fatTarget = getActiveTarget(latest?.bodyFatPercentage, goals.intermediate.bodyFat, goals.final.bodyFat, true);
  const visceralTarget = getActiveTarget(latest?.visceralFatLevel, goals.intermediate.visceralFat, goals.final.visceralFat, true);
  const waistTarget = getActiveTarget(latest?.waist, goals.intermediate.waist, goals.final.waist, true);
  
  // Lean mass is usually higher is better, but depends on user. Assuming higher/maintenance is better for fitness app.
  // We'll just calculate a target based on final weight * final lean %.
  const finalLeanMassTarget = goals.final.weight * (1 - goals.final.bodyFat/100);

  const motivationalPhrase = getMotivationalPhrase(latest, previous);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 md:pl-20">
      
      {/* Sidebar / Mobile Bottom Nav */}
      <nav className="fixed bottom-0 md:top-0 md:left-0 w-full md:w-20 md:h-screen bg-white md:border-r border-t md:border-t-0 border-slate-200 z-40 flex md:flex-col justify-around md:justify-start md:pt-8 items-center md:gap-8 px-4 md:px-0 py-3 md:py-0">
        <div className="hidden md:flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-xl mb-4 shadow-lg shadow-emerald-600/20">
          <Activity className="text-white w-6 h-6" />
        </div>
        
        <button 
          onClick={() => setView('dashboard')}
          className={`p-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setView('history')}
          className={`p-3 rounded-xl transition-all ${view === 'history' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <History className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`p-3 rounded-xl transition-all ${view === 'settings' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <SettingsIcon className="w-6 h-6" />
        </button>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="md:mt-auto md:mb-8 md:mx-auto bg-emerald-600 text-white p-3 rounded-full shadow-lg shadow-emerald-600/20 hover:scale-105 transition-transform active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {view === 'dashboard' && 'Panel Principal'}
              {view === 'history' && 'Historial y Tendencias'}
              {view === 'settings' && 'Ajustes y Objetivos'}
            </h1>
            <p className="text-slate-500 mt-1">
              {view === 'dashboard' && `Bienvenido de nuevo. Último registro: ${latest ? new Date(latest.date).toLocaleDateString() : 'Ninguno'}`}
              {view === 'history' && 'Visualiza tu progreso a lo largo del tiempo'}
              {view === 'settings' && 'Define tus metas intermedias y finales'}
            </p>
          </div>
          <div className="hidden md:block">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Medida
            </button>
          </div>
        </header>

        {view === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Motivational Banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start md:items-center gap-3 shadow-sm">
              <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm shrink-0">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-emerald-800 font-medium text-sm md:text-base">
                   "{motivationalPhrase}"
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard 
                title={`Peso (${weightTarget.label})`}
                current={latest?.weight || 0}
                target={weightTarget.val}
                unit="lbs"
                icon={<Scale />}
                colorClass="text-blue-600"
                trend={latest && previous ? calculateTrend(latest.weight, previous.weight) : 0}
                inverse={true}
              />
              <MetricCard 
                title={`Grasa (${fatTarget.label})`}
                current={latest?.bodyFatPercentage || 0}
                target={fatTarget.val}
                unit="%"
                icon={<Activity />}
                colorClass="text-orange-500"
                trend={latest && previous ? calculateTrend(latest.bodyFatPercentage, previous.bodyFatPercentage) : 0}
                inverse={true}
              />
              <MetricCard 
                title={`Visceral (${visceralTarget.label})`}
                current={latest?.visceralFatLevel || 0}
                target={visceralTarget.val}
                unit="lvl"
                icon={<Flame />}
                colorClass="text-red-500"
                trend={latest && previous ? calculateTrend(latest.visceralFatLevel, previous.visceralFatLevel) : 0}
                inverse={true}
              />
               <MetricCard 
                title={`Cintura (${waistTarget.label})`}
                current={latest?.waist || 0}
                target={waistTarget.val}
                unit="cm"
                icon={<Ruler />}
                colorClass="text-purple-500"
                trend={latest && previous ? calculateTrend(latest.waist, previous.waist) : 0}
                inverse={true}
              />
              <MetricCard 
                title="Masa Magra"
                current={latest ? parseFloat(latest.leanMass.toFixed(1)) : 0}
                target={parseFloat(finalLeanMassTarget.toFixed(1))}
                unit="lbs"
                icon={<Dumbbell />}
                colorClass="text-indigo-500"
                trend={latest && previous ? calculateTrend(latest.leanMass, previous.leanMass) : 0}
              />
            </div>

            <AICoach measurements={measurements} goals={goals} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <WeightCompositionChart data={measurements} />
               <WaistChart data={measurements} />
            </div>
          </div>
        )}

        {view === 'history' && (
           <div className="space-y-6">
             <div className="grid grid-cols-1 gap-6">
               <WeightCompositionChart data={measurements} />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <WaistChart data={measurements} />
                 <VisceralFatChart data={measurements} />
               </div>
             </div>
             
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="p-6 border-b border-slate-100">
                 <h3 className="font-bold text-slate-800">Registro Detallado</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium">
                     <tr>
                       <th className="px-6 py-4">Fecha</th>
                       <th className="px-6 py-4">Peso (lbs)</th>
                       <th className="px-6 py-4">Cintura (cm)</th>
                       <th className="px-6 py-4">Grasa %</th>
                       <th className="px-6 py-4">Grasa Visc.</th>
                       <th className="px-6 py-4">Masa Magra</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {measurements.length === 0 ? (
                       <tr>
                         <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                           No hay registros aún.
                         </td>
                       </tr>
                     ) : (
                       measurements.map((m) => (
                         <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium text-slate-900">{new Date(m.date).toLocaleDateString()}</td>
                           <td className="px-6 py-4">{m.weight} lbs</td>
                           <td className="px-6 py-4">{m.waist || '-'} cm</td>
                           <td className="px-6 py-4">{m.bodyFatPercentage}%</td>
                           <td className="px-6 py-4">{m.visceralFatLevel}</td>
                           <td className="px-6 py-4 text-indigo-600 font-medium">{m.leanMass.toFixed(1)} lbs</td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
           </div>
        )}

        {view === 'settings' && (
          <Settings goals={goals} onUpdateGoals={handleUpdateGoals} />
        )}
      </main>

      <AddMeasurementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMeasurement}
      />
    </div>
  );
};

export default App;