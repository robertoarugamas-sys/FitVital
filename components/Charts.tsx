import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Measurement } from '../types';

interface ChartProps {
  data: Measurement[];
}

export const WeightCompositionChart: React.FC<ChartProps> = ({ data }) => {
  // Reverse data to show oldest to newest left to right
  const chartData = [...data].reverse().map(d => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    fatMass: parseFloat((d.weight * (d.bodyFatPercentage / 100)).toFixed(1)),
    leanMass: parseFloat(d.leanMass.toFixed(1))
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Composición Corporal (lbs)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="leanMass" 
            name="Masa Magra (lbs)"
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorLean)" 
            stackId="1"
          />
          <Area 
            type="monotone" 
            dataKey="fatMass" 
            name="Masa Grasa (lbs)"
            stroke="#f59e0b" 
            fillOpacity={1} 
            fill="url(#colorFat)" 
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const VisceralFatChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = [...data].reverse().map(d => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Grasa Visceral (Nivel)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisceral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'auto']} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
             contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="visceralFatLevel" 
            name="Nivel Visceral"
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorVisceral)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const WaistChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = [...data].reverse().map(d => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Cintura (cm)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWaist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
             contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="waist" 
            name="Cintura (cm)"
            stroke="#8b5cf6" 
            fillOpacity={1} 
            fill="url(#colorWaist)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};