import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { Settings, Save, RotateCcw, X, Upload, Check, Copy } from 'lucide-react';
import { Button } from './ui/Button';

interface AdminPanelProps {
  config: AppConfig;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  onSave: (c: AppConfig) => void;
  onReset: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, isOpen, setIsOpen, onSave, onReset }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Asset Helper State
  const [showAssetHelper, setShowAssetHelper] = useState(false);
  const [base64String, setBase64String] = useState<string | null>(null);
  const [assetType, setAssetType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(config, null, 2));
    }
  }, [isOpen, config]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onSave(parsed);
      setError(null);
      setIsOpen(false);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2000000) { // 2MB limit for local storage safety
      alert("File is too large for local storage prototype (limit 2MB). Please use a URL instead.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64String(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = () => {
    if (base64String) {
      navigator.clipboard.writeText(base64String);
      alert("Asset string copied! Now paste it into the 'icon' or 'media.url' field in the JSON below.");
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-surface border border-white/10 p-3 rounded-full shadow-lg hover:bg-white/5 transition-colors z-40 group"
        title="Admin Config"
      >
        <Settings size={24} className="text-gray-400 group-hover:text-white transition-colors" />
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#0f172a] border-l border-white/10 shadow-2xl z-50 flex flex-col animate-[slideInRight_0.3s_ease-out]">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-surface">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings size={18} /> Configuration
        </h2>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        
        {/* Asset Helper Section */}
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <button 
            onClick={() => setShowAssetHelper(!showAssetHelper)}
            className="flex items-center justify-between w-full text-sm font-semibold text-gray-300 hover:text-white"
          >
            <span className="flex items-center gap-2"><Upload size={16} /> Asset Upload Helper</span>
            <span>{showAssetHelper ? '−' : '+'}</span>
          </button>
          
          {showAssetHelper && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
              <p className="text-xs text-gray-500">
                Since this is a prototype without a backend, use this tool to convert a local image to a text string (Base64). 
                Copy the result and paste it into the JSON <code>icon</code> or <code>media.url</code> fields.
              </p>
              
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />

              {base64String && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <img src={base64String} alt="Preview" className="w-10 h-10 rounded object-cover border border-white/20" />
                    <span className="text-xs text-green-400 flex items-center gap-1"><Check size={12}/> Ready to copy</span>
                  </div>
                  <Button variant="outline" onClick={copyToClipboard} className="w-full text-xs h-8">
                    <Copy size={12} className="mr-2" /> Copy Asset String
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* JSON Editor */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-gray-500 mb-2">JSON Configuration</p>
          <textarea 
            className="flex-1 min-h-[400px] w-full bg-[#020617] text-green-400 font-mono text-xs p-4 rounded-lg border border-white/10 focus:border-primary focus:outline-none resize-none"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
          />
        </div>
        
        {error && (
          <div className="text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-500/20">
            Error: {error}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-surface flex justify-between">
        <Button variant="ghost" onClick={onReset} className="text-sm">
          <RotateCcw size={14} className="mr-2" /> Reset Defaults
        </Button>
        <Button onClick={handleSave} className="px-6">
          <Save size={14} className="mr-2" /> Apply Changes
        </Button>
      </div>
    </div>
  );
};