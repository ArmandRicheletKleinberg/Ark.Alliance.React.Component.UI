import React from 'react';
import { Appointment, TruckType } from '../types';

interface SchedulePanelProps {
  appointments: Appointment[];
  onSelectAppointment: (id: string) => void;
  selectedId: string | null;
}

const SchedulePanel: React.FC<SchedulePanelProps> = ({ appointments, onSelectAppointment, selectedId }) => {
  // Sort by time
  const sorted = [...appointments].sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Dock Schedule
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {sorted.length === 0 ? (
          <div className="text-center text-slate-500 py-10">No appointments scheduled</div>
        ) : (
          sorted.map(apt => (
            <div 
              key={apt.id}
              onClick={() => onSelectAppointment(apt.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-700/50 
                ${selectedId === apt.id ? 'bg-slate-700 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-800 border-slate-700'}
                ${apt.status === 'COMPLETED' ? 'opacity-50' : 'opacity-100'}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xl font-bold text-white">{formatTime(apt.scheduledTime)}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                  ${apt.status === 'ARRIVED' ? 'bg-purple-900 text-purple-200' : 
                    apt.status === 'IN_PROGRESS' ? 'bg-yellow-900 text-yellow-200' :
                    apt.status === 'COMPLETED' ? 'bg-slate-700 text-slate-400' : 'bg-blue-900 text-blue-200'
                  }`}>
                  {apt.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                 <div className={`w-2 h-2 rounded-full ${apt.poNumber ? 'bg-emerald-400' : 'bg-orange-400'}`}></div>
                 <span className="text-sm text-slate-300 font-medium">
                    {apt.poNumber ? `Inbound PO: ${apt.poNumber}` : `Outbound DESADV: ${apt.desadv}`}
                 </span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Dock: <span className="text-slate-300">{apt.dockId || 'Unassigned'}</span></span>
                <span>{apt.estimatedDuration} min</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SchedulePanel;