import React from 'react';
import { PanelSettings } from '../types';
import { Settings, Sliders, Palette, Image as ImageIcon, Grid } from 'lucide-react';

interface ControlPanelProps {
  settings: PanelSettings;
  updateSettings: (newSettings: Partial<PanelSettings>) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, updateSettings }) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateSettings({ backgroundImage: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-700 h-screen p-6 overflow-y-auto text-slate-300 shadow-xl z-50">
      <div className="flex items-center gap-2 mb-8 text-white">
        <Settings className="animate-spin-slow" />
        <h1 className="text-xl font-bold">UI Controls</h1>
      </div>

      <div className="space-y-8">
        {/* Geometry Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-100 font-semibold text-sm uppercase tracking-wide">
            <Sliders size={16} /> Geometry
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label>Border Radius</label>
                <span>{settings.borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={settings.borderRadius}
                onChange={(e) => updateSettings({ borderRadius: Number(e.target.value) })}
                className="w-full accent-green-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label>Shadow Intensity</label>
                <span>{settings.shadowIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.shadowIntensity}
                onChange={(e) => updateSettings({ shadowIntensity: Number(e.target.value) })}
                className="w-full accent-green-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label>Glass Blur</label>
                <span>{settings.glassBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={settings.glassBlur}
                onChange={(e) => updateSettings({ glassBlur: Number(e.target.value) })}
                className="w-full accent-green-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-100 font-semibold text-sm uppercase tracking-wide">
            <Palette size={16} /> Palette
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs block mb-2">Gradient Start</label>
                <div className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700">
                    <input 
                        type="color" 
                        value={settings.gradientStart}
                        onChange={(e) => updateSettings({ gradientStart: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs font-mono">{settings.gradientStart}</span>
                </div>
             </div>
             <div>
                <label className="text-xs block mb-2">Gradient End</label>
                <div className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700">
                    <input 
                        type="color" 
                        value={settings.gradientEnd}
                        onChange={(e) => updateSettings({ gradientEnd: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs font-mono">{settings.gradientEnd}</span>
                </div>
             </div>
             <div className="col-span-2">
                <label className="text-xs block mb-2">Accent Color</label>
                <div className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700">
                    <input 
                        type="color" 
                        value={settings.accentColor}
                        onChange={(e) => updateSettings({ accentColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs font-mono">{settings.accentColor}</span>
                </div>
             </div>
          </div>
        </section>

        {/* Background & Texture */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-slate-100 font-semibold text-sm uppercase tracking-wide">
            <ImageIcon size={16} /> Background & Texture
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-xs">Opacity</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.opacity}
                    onChange={(e) => updateSettings({ opacity: Number(e.target.value) })}
                    className="w-16 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-right"
                />
             </div>
             <div className="flex items-center justify-between">
                 <label className="text-xs flex items-center gap-2"><Grid size={12}/> Show Tech Grid</label>
                 <button 
                    onClick={() => updateSettings({ showGrid: !settings.showGrid })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${settings.showGrid ? 'bg-green-500' : 'bg-slate-700'}`}
                 >
                     <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${settings.showGrid ? 'translate-x-5' : ''}`}></div>
                 </button>
             </div>
             
             <div>
                <label className="text-xs block mb-2">Upload Background Image</label>
                <div className="relative border-2 border-dashed border-slate-700 rounded-lg p-4 hover:border-slate-500 transition-colors text-center cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <ImageIcon className="mx-auto mb-2 text-slate-500" size={20} />
                    <span className="text-xs text-slate-400">Click to upload</span>
                </div>
                {settings.backgroundImage && (
                    <button 
                        onClick={() => updateSettings({ backgroundImage: null })}
                        className="text-xs text-red-400 mt-2 hover:underline w-full text-right"
                    >
                        Remove Image
                    </button>
                )}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ControlPanel;