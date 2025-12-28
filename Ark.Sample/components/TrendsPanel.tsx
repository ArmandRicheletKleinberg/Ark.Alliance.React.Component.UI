import React, { useState, useEffect } from 'react';
import { PanelSettings, DashboardMetrics, CryptoSymbol } from '../types';
import { MOCK_SYMBOLS } from '../constants';
import CircularGauge from './CircularGauge';
import LedBar from './LedBar';
import { Activity, Cpu, Zap, Wifi, AlertTriangle, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { analyzeMarketTrends } from '../services/geminiService';

interface TrendsPanelProps {
  settings: PanelSettings;
  metrics: DashboardMetrics;
}

const TrendsPanel: React.FC<TrendsPanelProps> = ({ settings, metrics }) => {
  const [isHoveringSymbols, setIsHoveringSymbols] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Dynamic Styles based on settings
  const containerStyle: React.CSSProperties = {
    borderRadius: `${settings.borderRadius}px`,
    boxShadow: `0 20px ${settings.shadowIntensity}px rgba(0,0,0,0.5)`,
    background: settings.backgroundImage
      ? `url(${settings.backgroundImage}) center/cover no-repeat`
      : `linear-gradient(135deg, ${settings.gradientStart}, ${settings.gradientEnd})`,
    opacity: settings.opacity / 100,
    backdropFilter: `blur(${settings.glassBlur}px)`,
    color: settings.textColor,
    border: '1px solid rgba(255,255,255,0.1)',
  };

  const accentText = { color: settings.accentColor };

  const handleAiAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    const result = await analyzeMarketTrends(MOCK_SYMBOLS);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div 
      className="relative w-[400px] min-h-[500px] p-6 transition-all duration-300 overflow-hidden"
      style={containerStyle}
    >
        {/* Optional Grid Overlay for Tech feel */}
        {settings.showGrid && (
            <div className="absolute inset-0 pointer-events-none opacity-10" 
                 style={{ 
                     backgroundImage: `linear-gradient(${settings.textColor} 1px, transparent 1px), linear-gradient(90deg, ${settings.textColor} 1px, transparent 1px)`,
                     backgroundSize: '20px 20px'
                 }} 
            />
        )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Activity size={24} style={{ color: settings.accentColor }} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Trends Overview</h2>
        </div>
        {/* Top Right Gauge (Prediction Minute) */}
        <div className="relative">
            <CircularGauge value={metrics.predictionScore} size={50} color={settings.accentColor} />
            <div className="absolute -bottom-4 right-0 text-[10px] text-gray-400 text-right w-full">Confidence</div>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="space-y-6 relative z-10">
        
        {/* 1. Active Symbols (Expandable) */}
        <div 
          className="group relative bg-black/20 rounded-xl p-4 border border-white/5 hover:bg-black/40 transition-all duration-300 cursor-default"
          onMouseEnter={() => setIsHoveringSymbols(true)}
          onMouseLeave={() => setIsHoveringSymbols(false)}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-3xl font-bold" style={accentText}>
              {metrics.activeSymbolsCount.toLocaleString()}
            </span>
            <ChevronRight className={`text-gray-500 transition-transform duration-300 ${isHoveringSymbols ? 'rotate-90' : ''}`} size={20} />
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Active Symbols</p>
          
          {/* Expanded List */}
          <div className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${isHoveringSymbols ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
          `}>
            <div className="space-y-2">
                <div className="h-[1px] w-full bg-white/10 mb-2"></div>
                {MOCK_SYMBOLS.map((sym) => (
                    <div key={sym.symbol} className="flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={14} className={sym.change > 0 ? 'text-green-400' : 'text-red-400'} />
                            <span className="font-mono text-gray-300">{sym.symbol}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-bold">${sym.price.toLocaleString()}</span>
                            <span className={sym.change > 0 ? 'text-green-400' : 'text-red-400'}>{sym.change}%</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* 2. Transaction Stats (Replicating screenshot layout) */}
        <div className="space-y-3 pl-2 border-l-2 border-white/5">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Successful</span>
                <span className="font-mono font-bold" style={{ color: '#22c55e' }}>{metrics.successful.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Failed</span>
                <span className="font-mono font-bold" style={{ color: '#ef4444' }}>{metrics.failed}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Fail Rate</span>
                <span className="font-mono font-bold" style={{ color: '#22c55e' }}>{metrics.failRate}%</span>
            </div>
        </div>

        {/* Separator */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* 3. Performance Metrics */}
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Clock size={16} style={accentText} />
                <span className="text-sm font-medium text-gray-300">{metrics.transactionTime}ms <span className="text-gray-500 text-xs ml-1">Avg Transaction Time</span></span>
            </div>
            <div className="flex items-center gap-3">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-sm font-medium text-red-400">{metrics.fraudAlerts} <span className="text-gray-500 text-xs ml-1">Fraud Alerts (1h)</span></span>
            </div>
        </div>

        {/* 4. AI & Training Status (Footer) */}
        <div className="bg-black/30 rounded-lg p-3 border border-white/5 mt-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-blue-400" />
                    <span className="text-xs font-bold text-blue-400 uppercase">Training Model</span>
                </div>
                <span className="text-[10px] text-gray-500">{metrics.trainingStatus === 'Running' ? 'EPOCH 4/10' : 'IDLE'}</span>
            </div>
            <LedBar percentage={metrics.trainingProgress} />
            
            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${metrics.aiStatus === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-xs text-gray-300">Gemini AI Status</span>
                </div>
                <button 
                    onClick={handleAiAnalysis}
                    disabled={isAnalyzing}
                    className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors flex items-center gap-1"
                >
                   {isAnalyzing ? <div className="animate-spin w-3 h-3 border-2 border-t-transparent border-white rounded-full"></div> : <Zap size={10} />}
                   {isAnalyzing ? 'Thinking...' : 'Insight'}
                </button>
            </div>
            {aiAnalysis && (
                <div className="mt-2 text-[10px] text-gray-400 italic bg-black/40 p-2 rounded border-l-2 border-blue-500">
                    "{aiAnalysis}"
                </div>
            )}
        </div>

      </div>
      
      {/* Decorative arrow from screenshot */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white/10 border-b-[10px] border-b-transparent"></div>
      </div>
    </div>
  );
};

export default TrendsPanel;