import React, { useState } from 'react';
import TrendsPanel from './components/TrendsPanel';
import ControlPanel from './components/ControlPanel';
import { PanelSettings, DashboardMetrics } from './types';
import { INITIAL_SETTINGS, MOCK_METRICS } from './constants';

const App: React.FC = () => {
  const [settings, setSettings] = useState<PanelSettings>(INITIAL_SETTINGS);
  const [metrics] = useState<DashboardMetrics>(MOCK_METRICS);
  const [showControls, setShowControls] = useState(true);

  const updateSettings = (newSettings: Partial<PanelSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black z-0 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-900/10 blur-[120px] pointer-events-none"></div>

      {/* Control Panel Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${showControls ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <ControlPanel settings={settings} updateSettings={updateSettings} />
        
        {/* Toggle Button */}
        <button 
            onClick={() => setShowControls(!showControls)}
            className="absolute top-1/2 -right-8 w-8 h-16 bg-slate-800 rounded-r-lg flex items-center justify-center border-y border-r border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
            {showControls ? '‹' : '›'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex items-center justify-center p-8 transition-all duration-300 ${showControls ? 'ml-80' : 'ml-0'} z-10`}>
        <div className="relative group">
             {/* Glow Effect behind the card */}
            <div 
                className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
                style={{ borderRadius: `${settings.borderRadius + 4}px` }}
            ></div>
            
            <TrendsPanel settings={settings} metrics={metrics} />
            
            {/* Disclaimer */}
            <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-widest font-mono">
                Real-time Data Visualization • TrendPulse v1.0
            </p>
        </div>
      </div>
    </div>
  );
};

export default App;