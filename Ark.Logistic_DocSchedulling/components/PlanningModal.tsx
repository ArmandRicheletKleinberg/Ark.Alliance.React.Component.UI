import React from 'react';
import { Appointment, Dock } from '../types';

interface PlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseName: string;
  appointments: Appointment[];
  docks: Dock[];
}

const PlanningModal: React.FC<PlanningModalProps> = ({ isOpen, onClose, warehouseName, appointments, docks }) => {
  if (!isOpen) return null;

  // Group by Dock
  const appointmentsByDock = docks.reduce((acc, dock) => {
    acc[dock.id] = appointments.filter(a => a.dockId === dock.id);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Unassigned
  const unassigned = appointments.filter(a => !a.dockId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 w-full max-w-5xl max-h-[90vh] rounded-xl border border-slate-600 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800">
            <div>
                <h2 className="text-2xl font-bold text-white">Daily Operations Plan</h2>
                <p className="text-slate-400 text-sm">Scheduling for {warehouseName}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Per Dock Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Dock Schedules</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {docks.map(dock => (
                            <div key={dock.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-slate-200">{dock.name}</span>
                                    <span className="text-xs text-slate-500">{appointmentsByDock[dock.id].length} tasks</span>
                                </div>
                                {appointmentsByDock[dock.id].length === 0 ? (
                                    <div className="text-xs text-slate-500 italic">No scheduled activity</div>
                                ) : (
                                    <ul className="space-y-2">
                                        {appointmentsByDock[dock.id].sort((a,b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()).map(apt => (
                                            <li key={apt.id} className="flex justify-between text-xs bg-slate-800 p-2 rounded border-l-2 border-blue-500">
                                                <span className="text-slate-300">
                                                    {new Date(apt.scheduledTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                                </span>
                                                <span className={`${apt.poNumber ? 'text-emerald-400' : 'text-orange-400'} font-mono`}>
                                                    {apt.truckId}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Overall Stats / Unassigned */}
                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                     <h3 className="text-lg font-semibold text-white mb-4">Unassigned Requests</h3>
                     {unassigned.length === 0 ? (
                         <div className="text-slate-500 text-sm">All trucks assigned to docks.</div>
                     ) : (
                         <ul className="space-y-2">
                            {unassigned.map(apt => (
                                <li key={apt.id} className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-600">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">{apt.truckId}</span>
                                        <span className="text-xs text-slate-400">Due: {new Date(apt.scheduledTime).toLocaleTimeString()}</span>
                                    </div>
                                    <span className="px-2 py-1 bg-red-900 text-red-200 text-xs rounded">Pending Dock</span>
                                </li>
                            ))}
                         </ul>
                     )}
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                     <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics (Today)</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-3 rounded text-center">
                            <div className="text-2xl font-bold text-emerald-400">{appointments.filter(a => a.status === 'COMPLETED').length}</div>
                            <div className="text-xs text-slate-500 uppercase">Completed</div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded text-center">
                            <div className="text-2xl font-bold text-amber-400">{appointments.filter(a => a.status === 'IN_PROGRESS').length}</div>
                            <div className="text-xs text-slate-500 uppercase">Active</div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded text-center">
                            <div className="text-2xl font-bold text-blue-400">{appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'ARRIVED').length}</div>
                            <div className="text-xs text-slate-500 uppercase">Pending</div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded text-center">
                            <div className="text-2xl font-bold text-slate-300">
                                {appointments.length > 0 ? Math.round(appointments.reduce((acc, a) => acc + a.estimatedDuration, 0) / appointments.length) : 0}m
                            </div>
                            <div className="text-xs text-slate-500 uppercase">Avg Turnaround</div>
                        </div>
                     </div>
                </div>

            </div>
        </div>
        
        <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-end">
            <button onClick={onClose} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                Close Plan
            </button>
        </div>
      </div>
    </div>
  );
};

export default PlanningModal;