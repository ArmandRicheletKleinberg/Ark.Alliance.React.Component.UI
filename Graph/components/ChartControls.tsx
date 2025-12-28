import React, { useRef } from 'react';
import { Settings, Image as ImageIcon, Sliders, Activity, Plus, Trash2, Maximize2, Minimize2, TrendingUp, Search } from 'lucide-react';
import { ChartStyleSettings, ThresholdLine } from '../types';

interface ChartControlsProps {
  settings: ChartStyleSettings;
  updateSettings: (s: Partial<ChartStyleSettings>) => void;
  thresholds: ThresholdLine[];
  addThreshold: (t: ThresholdLine) => void;
  removeThreshold: (id: string) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  currentInterval: string;
  setInterval: (i: string) => void;
  currentSymbol: string;
  setSymbol: (s: string) => void;
}

const TOP_50_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'SHIBUSDT', 'DOTUSDT',
  'LINKUSDT', 'TRXUSDT', 'MATICUSDT', 'BCHUSDT', 'LTCUSDT', 'ETCUSDT', 'UNIUSDT', 'NEARUSDT', 'ALGOUSDT', 'FILUSDT',
  'STXUSDT', 'VETUSDT', 'XLMUSDT', 'ATOMUSDT', 'ICPUSDT', 'HBARUSDT', 'FTMUSDT', 'SANDUSDT', 'MANAUSDT', 'AAVEUSDT',
  'AXSUSDT', 'THETAUSDT', 'EGLDUSDT', 'XTZUSDT', 'EOSUSDT', 'XMRUSDT', 'GRTUSDT', 'MKRUSDT', 'BSVUSDT', 'KCSUSDT',
  'NEOUSDT', 'CHZUSDT', 'CRVUSDT', 'RUNEUSDT', 'ZECUSDT', 'IOTAUSDT', 'KLAYUSDT', 'GALAUSDT', 'LUNCUSDT', 'APTUSDT'
];

export const ChartControls: React.FC<ChartControlsProps> = ({
  settings,
  updateSettings,
  thresholds,
  addThreshold,
  removeThreshold,
  isFullscreen,
  toggleFullscreen,
  currentInterval,
  setInterval,
  currentSymbol,
  setSymbol,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLine = () => {
    const price = prompt("Enter price threshold:");
    if (price && !isNaN(parseFloat(price))) {
        const label = prompt("Label (e.g. Stop Loss):") || "Line";
        const type = prompt("Type (solid, dashed, dotted):") || "dashed";
        addThreshold({
            id: Date.now().toString(),
            price: parseFloat(price),
            label,
            color: '#f87171',
            style: type as 'solid' | 'dashed' | 'dotted'
        });
    }
  };

  return (
    <div className="bg-slate-900 border-l border-slate-800 p-4 w-full md:w-80 h-full overflow-y-auto text-slate-200 shadow-2xl z-20 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-700">
        <Settings className="w-5 h-5 text-indigo-400" />
        <h2 className="font-bold text-lg">Control Panel</h2>
      </div>

      {/* Main Actions */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">View Actions</label>
        <div className="flex gap-2">
            <button 
                onClick={toggleFullscreen}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2 rounded-md transition-colors text-sm"
            >
                {isFullscreen ? <Minimize2 size={16}/> : <Maximize2 size={16} />}
                {isFullscreen ? 'Exit Full' : 'Fullscreen'}
            </button>
        </div>
      </div>

       {/* Symbol Selection */}
       <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Search size={14} /> Symbol
        </label>
        <div className="relative">
            <select
                value={currentSymbol.toUpperCase()}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-slate-800 text-white text-sm rounded-md px-3 py-2 border border-slate-700 focus:border-indigo-500 outline-none appearance-none"
            >
                {TOP_50_SYMBOLS.map(sym => (
                    <option key={sym} value={sym}>{sym}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
            </div>
        </div>
      </div>

       {/* Timeframe */}
       <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Timeframe</label>
        <div className="flex bg-slate-800 rounded-md p-1">
            {['1s', '1m', '15m', '1h', '4h'].map(int => (
                <button
                    key={int}
                    onClick={() => setInterval(int)}
                    className={`flex-1 py-1 text-xs rounded ${currentInterval === int ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    {int}
                </button>
            ))}
        </div>
      </div>

      {/* Axis Configuration */}
      <div className="flex flex-col gap-3">
         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={14}/> Axis Options
         </label>
         <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
             <span className="text-sm text-slate-300">Logarithmic Scale</span>
             <button
                 onClick={() => updateSettings({ useLogScale: !settings.useLogScale })}
                 className={`w-10 h-5 rounded-full transition-colors relative ${settings.useLogScale ? 'bg-indigo-600' : 'bg-slate-700'}`}
             >
                 <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.useLogScale ? 'translate-x-5' : 'translate-x-0'}`} />
             </button>
         </div>
      </div>

      {/* Styling Section */}
      <div className="space-y-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Sliders size={14}/> Appearance
        </label>
        
        <div className="space-y-2">
            <span className="text-sm text-slate-400">Header Title</span>
            <input 
                type="text" 
                value={settings.headerTitle}
                onChange={(e) => updateSettings({ headerTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm focus:border-indigo-500 outline-none"
            />
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
                <span className="text-xs text-slate-400">Border Width</span>
                <input 
                    type="number" 
                    value={settings.borderWidth}
                    onChange={(e) => updateSettings({ borderWidth: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm"
                />
            </div>
            <div className="space-y-1">
                <span className="text-xs text-slate-400">Radius</span>
                <input 
                    type="number" 
                    value={settings.borderRadius}
                    onChange={(e) => updateSettings({ borderRadius: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm"
                />
            </div>
        </div>
        
        <div className="space-y-1">
             <span className="text-xs text-slate-400">Shadow Intensity</span>
             <input 
                type="range" min="0" max="50"
                value={settings.boxShadowIntensity}
                onChange={(e) => updateSettings({ boxShadowIntensity: Number(e.target.value) })}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
             />
        </div>
        
         <div className="space-y-1">
             <span className="text-xs text-slate-400">Panel Height (px)</span>
             <input 
                type="range" min="400" max="1200"
                value={settings.height}
                onChange={(e) => updateSettings({ height: Number(e.target.value) })}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
             />
        </div>
      </div>

      {/* Background Image */}
      <div className="space-y-3 border-t border-slate-800 pt-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon size={14}/> Background
        </label>
        
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-xs border border-slate-700 transition-colors"
        >
            {settings.backgroundImage ? 'Change Image' : 'Upload Image'}
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload}
        />

        {settings.backgroundImage && (
            <>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400"><span>Opacity</span> <span>{settings.bgImageOpacity}%</span></div>
                    <input 
                        type="range" min="0" max="100"
                        value={settings.bgImageOpacity}
                        onChange={(e) => updateSettings({ bgImageOpacity: Number(e.target.value) })}
                        className="w-full h-1 bg-indigo-500 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                 <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400"><span>Zoom</span> <span>{settings.bgImageZoom}x</span></div>
                    <input 
                        type="range" min="0.5" max="3" step="0.1"
                        value={settings.bgImageZoom}
                        onChange={(e) => updateSettings({ bgImageZoom: Number(e.target.value) })}
                        className="w-full h-1 bg-indigo-500 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <button 
                    onClick={() => updateSettings({ backgroundImage: null })}
                    className="text-xs text-red-400 hover:text-red-300 w-full text-right"
                >
                    Remove Image
                </button>
            </>
        )}
      </div>

      {/* Thresholds */}
      <div className="space-y-3 border-t border-slate-800 pt-4">
         <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Activity size={14}/> Thresholds
            </label>
            <button onClick={handleAddLine} className="bg-indigo-600 hover:bg-indigo-500 p-1 rounded text-white">
                <Plus size={14} />
            </button>
         </div>

         <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {thresholds.length === 0 && <span className="text-xs text-slate-600 italic">No lines added.</span>}
            {thresholds.map(t => (
                <div key={t.id} className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                    <div>
                        <div className="text-xs font-bold text-slate-300">{t.label}</div>
                        <div className="text-[10px] text-slate-500">{t.price} • {t.style}</div>
                    </div>
                    <button onClick={() => removeThreshold(t.id)} className="text-slate-600 hover:text-red-500">
                        <Trash2 size={14}/>
                    </button>
                </div>
            ))}
         </div>
      </div>

    </div>
  );
};