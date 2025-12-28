import React from 'react';
import { Appointment, Dock, DockStatus } from '../types';

interface DetailsPanelProps {
  selectedDock: Dock | null;
  selectedAppointment: Appointment | null;
  onUpdateStatus: (aptId: string, status: Appointment['status']) => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ selectedDock, selectedAppointment, onUpdateStatus }) => {
  if (!selectedDock && !selectedAppointment) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 p-8 text-center border-l border-slate-700 bg-slate-900">
        <div className="max-w-xs">
            <svg className="w-12 h-12 mx-auto mb-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>Select a dock or appointment to view details and manifest.</p>
        </div>
      </div>
    );
  }

  // Determine what to show. If an appointment is selected, show that. 
  // If a dock is selected, show the active appointment on that dock, or just dock info.
  const displayAppointment = selectedAppointment; 
  const displayDock = selectedDock;

  return (
    <div className="h-full bg-slate-800 border-l border-slate-700 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-700 bg-slate-800">
        <h2 className="text-xl font-bold text-white mb-1">
            {displayDock ? displayDock.name : 'Appointment Details'}
        </h2>
        {displayDock && (
            <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full 
                    ${displayDock.status === DockStatus.IDLE ? 'bg-slate-500' :
                      displayDock.status === DockStatus.LOADING ? 'bg-emerald-500' :
                      displayDock.status === DockStatus.UNLOADING ? 'bg-blue-500' :
                      displayDock.status === DockStatus.RESERVED ? 'bg-amber-500' : 'bg-red-500'
                    }`}>
                </span>
                <span className="text-sm text-slate-400 font-medium">{displayDock.status}</span>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Active Appointment Card */}
        {displayAppointment ? (
            <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Truck Manifest</h4>
                            <div className="text-lg font-mono text-white">{displayAppointment.truckId}</div>
                        </div>
                        <div className="text-right">
                             <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Type</h4>
                             <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${displayAppointment.poNumber ? 'bg-emerald-900 text-emerald-300' : 'bg-orange-900 text-orange-300'}`}>
                                {displayAppointment.poNumber ? 'INBOUND' : 'OUTBOUND'}
                             </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                            <div className="text-slate-500 text-xs">Reference</div>
                            <div className="text-slate-200 font-mono">{displayAppointment.poNumber || displayAppointment.desadv || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-slate-500 text-xs">Driver</div>
                            <div className="text-slate-200">John Doe</div>
                        </div>
                        <div>
                             <div className="text-slate-500 text-xs">Scheduled</div>
                             <div className="text-slate-200">{new Date(displayAppointment.scheduledTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                        </div>
                        <div>
                             <div className="text-slate-500 text-xs">Duration</div>
                             <div className="text-slate-200">{displayAppointment.estimatedDuration}m</div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-600">
                        <h5 className="text-xs text-slate-400 font-bold mb-2 uppercase">Cargo Items</h5>
                        <ul className="space-y-2">
                            {displayAppointment.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between text-sm">
                                    <span className="text-slate-300">{item.description}</span>
                                    <span className="font-mono text-slate-400">x{item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {displayAppointment.status === 'SCHEDULED' && (
                             <button 
                                onClick={() => onUpdateStatus(displayAppointment.id, 'ARRIVED')}
                                className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                             >
                                Confirm Arrival
                             </button>
                        )}
                        {displayAppointment.status === 'ARRIVED' && (
                             <button 
                                onClick={() => onUpdateStatus(displayAppointment.id, 'IN_PROGRESS')}
                                className="bg-amber-600 hover:bg-amber-500 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                             >
                                Start Operation
                             </button>
                        )}
                        {displayAppointment.status === 'IN_PROGRESS' && (
                             <button 
                                onClick={() => onUpdateStatus(displayAppointment.id, 'COMPLETED')}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                             >
                                Complete & Release
                             </button>
                        )}
                        <button className="bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded text-sm font-medium transition-colors">
                            Print Documents
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center py-10">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-slate-300 font-medium">Dock is Empty</h3>
                <p className="text-slate-500 text-sm mt-1">Ready for assignment</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;