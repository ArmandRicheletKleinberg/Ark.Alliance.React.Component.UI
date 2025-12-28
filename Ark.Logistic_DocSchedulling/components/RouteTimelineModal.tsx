
import React, { useState } from 'react';
import { TruckRoute, RouteStop, Pallet, Crate, InnerItem } from '../types';

interface RouteTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: TruckRoute | null;
}

const RouteTimelineModal: React.FC<RouteTimelineModalProps> = ({ isOpen, onClose, route }) => {
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  // Expand states
  const [expandedPallets, setExpandedPallets] = useState<Record<string, boolean>>({});
  const [expandedCrates, setExpandedCrates] = useState<Record<string, boolean>>({});

  if (!isOpen || !route) return null;

  // Default to first stop if none selected
  const currentStop = selectedStopId 
    ? route.stops.find(s => s.id === selectedStopId) 
    : route.stops[0];

  const togglePallet = (id: string) => {
    setExpandedPallets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCrate = (id: string) => {
    setExpandedCrates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 w-full max-w-6xl h-[85vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                     <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 7" /></svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Logistics Journey</h2>
                    <p className="text-slate-400 text-sm font-mono">Truck ID: <span className="text-indigo-400">{route.truckId}</span></p>
                </div>
            </div>
            <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors border border-slate-600">
                Close View
            </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
            
            {/* LEFT: Timeline */}
            <div className="w-1/3 bg-slate-800/50 border-r border-slate-700 p-6 overflow-y-auto custom-scrollbar">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Route Timeline</h3>
                <div className="relative pl-4 space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute top-2 bottom-2 left-[27px] w-0.5 bg-slate-700"></div>

                    {route.stops.map((stop, index) => {
                        const isSelected = currentStop?.id === stop.id;
                        return (
                            <div 
                                key={stop.id} 
                                onClick={() => setSelectedStopId(stop.id)}
                                className={`relative pl-10 cursor-pointer group transition-all duration-300`}
                            >
                                {/* Dot */}
                                <div className={`absolute left-[19px] top-1 w-4 h-4 rounded-full border-2 z-10 transition-all
                                    ${isSelected 
                                        ? 'bg-blue-500 border-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.6)] scale-110' 
                                        : 'bg-slate-800 border-slate-600 group-hover:border-blue-400'}`}
                                ></div>

                                {/* Content Card */}
                                <div className={`p-4 rounded-lg border transition-all
                                    ${isSelected 
                                        ? 'bg-slate-700 border-blue-500/50 shadow-lg' 
                                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:border-slate-600'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase
                                            ${stop.type === 'WAREHOUSE' ? 'bg-indigo-900 text-indigo-300' :
                                              stop.type === 'DELIVERY_POINT' ? 'bg-emerald-900 text-emerald-300' : 
                                              'bg-amber-900 text-amber-300'
                                            }`}>
                                            {stop.type.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs font-mono text-slate-400">
                                            {new Date(stop.arrivalTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-200 text-lg mb-1">{stop.name}</h4>
                                    <div className="text-xs text-slate-400 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {stop.coordinates.lat.toFixed(4)}, {stop.coordinates.lng.toFixed(4)}
                                        </div>
                                        <div className="flex items-center gap-2 font-mono text-[10px] opacity-70">
                                            GLN: {stop.gln}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Activity: {stop.activityDuration} min
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: Cargo Details (Tree View) */}
            <div className="w-2/3 bg-slate-900 p-8 overflow-y-auto">
                {currentStop ? (
                    <>
                        <div className="mb-6 pb-4 border-b border-slate-700">
                            <h3 className="text-xl font-bold text-white mb-2">Manifest for {currentStop.name}</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                                    <div className="text-slate-500 text-xs uppercase">Pallets</div>
                                    <div className="text-2xl font-mono text-white">{currentStop.pallets.length}</div>
                                </div>
                                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                                    <div className="text-slate-500 text-xs uppercase">Total Crates</div>
                                    <div className="text-2xl font-mono text-white">
                                        {currentStop.pallets.reduce((acc, p) => acc + p.crates.length, 0)}
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                                    <div className="text-slate-500 text-xs uppercase">Items</div>
                                    <div className="text-2xl font-mono text-white">
                                        {currentStop.pallets.reduce((acc, p) => acc + p.crates.reduce((cAcc, c) => cAcc + c.items.length, 0), 0)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {currentStop.pallets.map((pallet) => (
                                <div key={pallet.id} className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/30">
                                    {/* Pallet Header */}
                                    <div 
                                        className="p-3 bg-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-750 transition-colors"
                                        onClick={() => togglePallet(pallet.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <button className="text-slate-400">
                                                {expandedPallets[pallet.id] 
                                                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                }
                                            </button>
                                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                                            <div>
                                                <span className="font-bold text-slate-200">Pallet {pallet.type}</span>
                                                <span className="ml-2 text-xs font-mono text-slate-500">EAN: {pallet.ean}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400">{pallet.crates.length} Crates</span>
                                    </div>

                                    {/* Crates List */}
                                    {expandedPallets[pallet.id] && (
                                        <div className="p-2 space-y-2 bg-slate-900/50 border-t border-slate-700">
                                            {pallet.crates.map((crate) => (
                                                <div key={crate.id} className="ml-6 border-l-2 border-slate-700 pl-4">
                                                    <div 
                                                        className="flex items-center gap-2 cursor-pointer py-1 group"
                                                        onClick={() => toggleCrate(crate.id)}
                                                    >
                                                        <span className="text-slate-500 group-hover:text-white">
                                                            {expandedCrates[crate.id] ? '-' : '+'}
                                                        </span>
                                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                                        <span className="text-sm font-medium text-slate-300">{crate.type}</span>
                                                        <span className="text-[10px] text-slate-500 font-mono">ID: {crate.id}</span>
                                                    </div>

                                                    {/* Inner Goods */}
                                                    {expandedCrates[crate.id] && (
                                                        <div className="mt-1 ml-6 space-y-1">
                                                            {crate.items.map((item) => (
                                                                <div key={item.id} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700/50 hover:border-slate-600">
                                                                    <div className="flex items-center gap-3">
                                                                         <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                                         <div>
                                                                             <div className="text-xs font-bold text-slate-200">{item.description}</div>
                                                                             <div className="text-[10px] font-mono text-slate-500">EAN: {item.ean}</div>
                                                                         </div>
                                                                    </div>
                                                                    <div className="text-sm font-bold text-white bg-slate-700 px-2 rounded">
                                                                        x{item.quantity}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">
                        Select a stop to view cargo details
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RouteTimelineModal;
