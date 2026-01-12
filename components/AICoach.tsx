import React, { useState } from 'react';
import { Sparkles, RefreshCw, MessageSquareQuote } from 'lucide-react';
import { Measurement, Goals } from '../types';
import { analyzeProgress } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AICoachProps {
  measurements: Measurement[];
  goals: Goals;
}

export const AICoach: React.FC<AICoachProps> = ({ measurements, goals }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (measurements.length < 2) {
      setAnalysis("Necesito al menos 2 registros para analizar tu progreso.");
      return;
    }
    
    setLoading(true);
    const result = await analyzeProgress(measurements, goals);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10 blur-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <h3 className="font-semibold text-lg">Entrenador Gemini AI</h3>
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors backdrop-blur-sm disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MessageSquareQuote className="w-4 h-4" />}
            {loading ? "Analizando..." : "Analizar Progreso"}
          </button>
        </div>

        <div className="min-h-[100px] bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
          {analysis ? (
             <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/60 text-center py-4">
              <Sparkles className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">
                Haz clic en "Analizar Progreso" para recibir consejos personalizados basados en tus últimos datos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};