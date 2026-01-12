import React, { useState } from 'react';
import { Target, Save, Flag, Trophy } from 'lucide-react';
import { Goals, GoalMetrics } from '../types';

interface SettingsProps {
  goals: Goals;
  onUpdateGoals: (goals: Goals) => void;
}

export const Settings: React.FC<SettingsProps> = ({ goals, onUpdateGoals }) => {
  const [formGoals, setFormGoals] = useState<Goals>(goals);
  const [activeTab, setActiveTab] = useState<'intermediate' | 'final'>('intermediate');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'intermediate' | 'final') => {
    const { name, value } = e.target;
    setFormGoals(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: parseFloat(value) || 0
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoals(formGoals);
  };

  const renderInputs = (type: 'intermediate' | 'final') => {
    const data = formGoals[type];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Peso Objetivo (lbs)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              name="weight"
              value={data.weight}
              onChange={(e) => handleChange(e, type)}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-medium"
            />
            <span className="absolute right-4 top-3 text-slate-400 text-sm">lbs</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Grasa Corporal (%)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              name="bodyFat"
              value={data.bodyFat}
              onChange={(e) => handleChange(e, type)}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-medium"
            />
            <span className="absolute right-4 top-3 text-slate-400 text-sm">%</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Grasa Visceral (Nivel)</label>
          <div className="relative">
            <input
              type="number"
              step="1"
              name="visceralFat"
              value={data.visceralFat}
              onChange={(e) => handleChange(e, type)}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-medium"
            />
            <span className="absolute right-4 top-3 text-slate-400 text-sm">Lvl</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Cintura (cm)</label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              name="waist"
              value={data.waist}
              onChange={(e) => handleChange(e, type)}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-medium"
            />
            <span className="absolute right-4 top-3 text-slate-400 text-sm">cm</span>
          </div>
        </div>
        
         <div className="space-y-2 col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Masa Magra Estimada</label>
          <div className="relative">
             <div className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-500 font-medium border border-transparent">
                ~{(data.weight * (1 - data.bodyFat/100)).toFixed(1)} lbs
             </div>
          </div>
           <p className="text-xs text-slate-400">Basado en peso y % grasa objetivo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-emerald-600" />
        <h2 className="text-xl font-bold text-slate-800">Mis Objetivos</h2>
      </div>

      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('intermediate')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'intermediate' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Flag className="w-4 h-4" />
          Meta Intermedia
        </button>
        <button
          onClick={() => setActiveTab('final')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'final' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Meta Final
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderInputs(activeTab)}

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Guardar Todos los Objetivos
          </button>
        </div>
      </form>
    </div>
  );
};