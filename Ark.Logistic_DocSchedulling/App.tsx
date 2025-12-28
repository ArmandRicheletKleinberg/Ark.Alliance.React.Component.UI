import React, { useState, useEffect, useCallback } from 'react';
import WarehouseVisualizer from './components/WarehouseVisualizer';
import SchedulePanel from './components/SchedulePanel';
import DetailsPanel from './components/DetailsPanel';
import PlanningModal from './components/PlanningModal';
import RouteTimelineModal from './components/RouteTimelineModal'; // Import new modal
import { Dock, Appointment, DockStatus, Warehouse, TruckRoute, RouteStop, Pallet, Crate, InnerItem } from './types';
import { analyzeWarehouseStatus, suggestDockAssignment } from './services/geminiService';

const WAREHOUSES: Warehouse[] = [
    { id: 'WH-A', name: 'Warehouse A', gln: '4049111191234', description: 'General Cargo & Distribution' },
    { id: 'WH-B', name: 'Warehouse B', gln: '4049222281567', description: 'Cold Storage & Perishables' }
];

// --- Mock Data Generators ---
const generateInnerItems = (baseEan: string): InnerItem[] => {
    return Array.from({length: 3}).map((_, i) => ({
        id: `ITM-${baseEan}-${i}`,
        description: `Precision Part ${baseEan.slice(-3)}-${i}`,
        ean: `${baseEan}00${i}`,
        quantity: Math.floor(Math.random() * 20) + 1
    }));
};

const generateCrates = (baseId: string): Crate[] => {
    return Array.from({length: 2}).map((_, i) => ({
        id: `CRT-${baseId}-${i}`,
        type: Math.random() > 0.5 ? 'PolyBox Blue' : 'Cardboard Heavy',
        items: generateInnerItems(baseId + i)
    }));
};

const generatePallets = (count: number): Pallet[] => {
    return Array.from({length: count}).map((_, i) => {
        const id = `PLT-${Math.floor(Math.random() * 10000)}`;
        return {
            id: id,
            ean: `800100${id.split('-')[1]}`,
            type: 'EURO',
            crates: generateCrates(id)
        };
    });
};

const generateMockRoutes = (appointments: Appointment[]): Record<string, TruckRoute> => {
    const routes: Record<string, TruckRoute> = {};
    
    appointments.forEach(apt => {
        const isOutbound = !apt.poNumber;
        const now = new Date();
        
        // Stops generation
        const stops: RouteStop[] = [];

        // Stop 1: Origin/Previous
        stops.push({
            id: 'STOP-1',
            type: 'PICKUP_POINT',
            name: isOutbound ? 'Factory Hannover' : 'Supplier Milan Main',
            gln: '4049999111222',
            coordinates: { lat: 52.3759, lng: 9.7320 },
            arrivalTime: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
            activityDuration: 45,
            pallets: generatePallets(3)
        });

        // Stop 2: Current Warehouse (The one in the app)
        stops.push({
            id: 'STOP-2',
            type: 'WAREHOUSE',
            name: 'Ark.Alliance Central Hub',
            gln: '4049111191234',
            coordinates: { lat: 51.1657, lng: 10.4515 },
            arrivalTime: apt.scheduledTime,
            activityDuration: apt.estimatedDuration,
            pallets: generatePallets(2) // Items processed here
        });

        // Stop 3: Destination
        stops.push({
            id: 'STOP-3',
            type: 'DELIVERY_POINT',
            name: isOutbound ? 'Retail Center Munich' : 'Distribution North',
            gln: '4045555666777',
            coordinates: { lat: 48.1351, lng: 11.5820 },
            arrivalTime: new Date(now.getTime() + 1000 * 60 * 60 * 4).toISOString(),
            activityDuration: 30,
            pallets: generatePallets(4)
        });

        routes[apt.truckId] = {
            truckId: apt.truckId,
            stops: stops
        };
    });

    return routes;
};

// Mock Data Initializers
const generateInitialDocks = (): Dock[] => {
    const docksA = Array.from({ length: 8 }).map((_, i) => ({
      id: `D-A-0${i + 1}`,
      warehouseId: 'WH-A',
      name: `Dock A-0${i + 1}`,
      status: DockStatus.IDLE,
      currentAppointmentId: null
    }));
    const docksB = Array.from({ length: 6 }).map((_, i) => ({
        id: `D-B-0${i + 1}`,
        warehouseId: 'WH-B',
        name: `Dock B-0${i + 1}`,
        status: DockStatus.IDLE,
        currentAppointmentId: null
      }));
    return [...docksA, ...docksB];
};

const generateInitialAppointments = (): Appointment[] => {
  const now = new Date();
  return [
    {
      id: 'APT-101',
      truckId: 'TRK-8821',
      dockId: 'D-A-02',
      scheduledTime: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), 
      estimatedDuration: 45,
      poNumber: 'PO-99281',
      status: 'IN_PROGRESS',
      items: [{ description: 'Electronics Components', quantity: 500 }]
    },
    {
      id: 'APT-102',
      truckId: 'TRK-1102',
      dockId: 'D-A-04',
      scheduledTime: new Date(now.getTime() + 1000 * 60 * 60).toISOString(), 
      estimatedDuration: 30,
      desadv: 'DES-2211',
      status: 'SCHEDULED',
      items: [{ description: 'Raw Materials (Steel)', quantity: 20 }]
    },
    {
      id: 'APT-103',
      truckId: 'TRK-5541',
      dockId: 'D-A-01',
      scheduledTime: new Date(now.getTime() - 1000 * 60 * 10).toISOString(), 
      estimatedDuration: 60,
      poNumber: 'PO-33211',
      status: 'ARRIVED',
      items: [{ description: 'Textiles', quantity: 1200 }]
    },
    // Warehouse B appointments
    {
        id: 'APT-201',
        truckId: 'FRZ-9912',
        dockId: 'D-B-01',
        scheduledTime: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
        estimatedDuration: 90,
        poNumber: 'PO-FRESH-01',
        status: 'LOADING',
        items: [{ description: 'Frozen Fish', quantity: 2000 }]
    } as any, 
    {
        id: 'APT-202',
        truckId: 'FRZ-3321',
        dockId: 'D-B-03',
        scheduledTime: new Date(now.getTime() + 1000 * 60 * 120).toISOString(),
        estimatedDuration: 45,
        desadv: 'DES-COOL-22',
        status: 'SCHEDULED',
        items: [{ description: 'Dairy', quantity: 500 }]
    }
  ];
};

const App: React.FC = () => {
  const [activeWarehouseId, setActiveWarehouseId] = useState<string>('WH-A');
  const [docks, setDocks] = useState<Dock[]>(generateInitialDocks());
  const [appointments, setAppointments] = useState<Appointment[]>(generateInitialAppointments());
  const [selectedDockId, setSelectedDockId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  
  // Route Logic
  const [mockRoutes, setMockRoutes] = useState<Record<string, TruckRoute>>({});
  const [selectedRoute, setSelectedRoute] = useState<TruckRoute | null>(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  // Modal State
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);

  // Gemini State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Derived Data
  const currentWarehouse = WAREHOUSES.find(w => w.id === activeWarehouseId) || WAREHOUSES[0];
  const currentDocks = docks.filter(d => d.warehouseId === activeWarehouseId);
  const currentAppointments = appointments.filter(a => {
      if (a.dockId) {
          return currentDocks.some(d => d.id === a.dockId);
      }
      return true; 
  });

  // Init Routes
  useEffect(() => {
     setMockRoutes(generateMockRoutes(appointments));
  }, [appointments]);

  // Sync Docks with Appointments on Mount/Update
  useEffect(() => {
    setDocks(prevDocks => prevDocks.map(dock => {
      const activeApt = appointments.find(a => a.dockId === dock.id && (a.status === 'IN_PROGRESS' || a.status === 'ARRIVED'));
      
      let newStatus = DockStatus.IDLE;
      if (activeApt) {
        if (activeApt.status === 'IN_PROGRESS') {
           newStatus = activeApt.poNumber ? DockStatus.UNLOADING : DockStatus.LOADING;
        } else if (activeApt.status === 'ARRIVED') {
           newStatus = DockStatus.RESERVED;
        }
      }

      return {
        ...dock,
        status: newStatus,
        currentAppointmentId: activeApt ? activeApt.id : null
      };
    }));
  }, [appointments]);

  const handleDockClick = (dockId: string) => {
    setSelectedDockId(dockId);
    const dock = docks.find(d => d.id === dockId);
    if (dock?.currentAppointmentId) {
      setSelectedAppointmentId(dock.currentAppointmentId);
    } else {
      setSelectedAppointmentId(null);
    }
  };

  const handleTruckClick = (truckId: string) => {
      const route = mockRoutes[truckId];
      if (route) {
          setSelectedRoute(route);
          setIsRouteModalOpen(true);
      } else {
          // Fallback if no route generated yet
          const newRoute = generateMockRoutes([{ truckId } as any])[truckId];
          setSelectedRoute(newRoute);
          setIsRouteModalOpen(true);
      }
  };

  const handleAppointmentSelect = (aptId: string) => {
    setSelectedAppointmentId(aptId);
    const apt = appointments.find(a => a.id === aptId);
    if (apt?.dockId) {
      setSelectedDockId(apt.dockId);
      // Switch warehouse view if needed
      const dock = docks.find(d => d.id === apt.dockId);
      if (dock && dock.warehouseId !== activeWarehouseId) {
          setActiveWarehouseId(dock.warehouseId);
      }
    } else {
      setSelectedDockId(null);
    }
  };

  const updateAppointmentStatus = (aptId: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === aptId) {
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    const result = await analyzeWarehouseStatus(currentDocks, currentAppointments);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleAddRandomAppointment = async () => {
     const newId = `APT-${Math.floor(Math.random() * 9000) + 1000}`;
     const isInbound = Math.random() > 0.5;
     const newApt: Appointment = {
         id: newId,
         truckId: `TRK-${Math.floor(Math.random() * 9000)}`,
         dockId: null, 
         scheduledTime: new Date().toISOString(),
         estimatedDuration: 45,
         status: 'SCHEDULED',
         items: [{ description: 'Urgent Cargo', quantity: 50 }],
         ...(isInbound ? { poNumber: `PO-${newId}` } : { desadv: `DES-${newId}` })
     };

     // Recommend assignment only for current warehouse docks
     const suggestedDockId = await suggestDockAssignment(newApt, currentDocks, currentAppointments);
     
     if (suggestedDockId !== 'NONE' && currentDocks.some(d => d.id === suggestedDockId)) {
        newApt.dockId = suggestedDockId;
     }

     setAppointments(prev => [...prev, newApt]);
  };

  const getSelectedDock = () => docks.find(d => d.id === selectedDockId) || null;
  const getSelectedAppointment = () => appointments.find(a => a.id === selectedAppointmentId) || null;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans">
      <PlanningModal 
        isOpen={isPlanningModalOpen}
        onClose={() => setIsPlanningModalOpen(false)}
        warehouseName={currentWarehouse.name}
        appointments={currentAppointments}
        docks={currentDocks}
      />

      <RouteTimelineModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        route={selectedRoute}
      />

      {/* Header */}
      <header className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-800/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h1 className="text-lg font-bold tracking-tight">Ark.Allliance.Xmogistic.Statochi.<span className="text-blue-400">DockScheduling</span></h1>
           </div>
           
           {/* Warehouse Selector */}
           <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
               {WAREHOUSES.map(wh => (
                   <button
                        key={wh.id}
                        onClick={() => setActiveWarehouseId(wh.id)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeWarehouseId === wh.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                   >
                       {wh.name}
                   </button>
               ))}
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsPlanningModalOpen(true)}
             className="flex items-center gap-2 text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             Plan Day
           </button>

           <button 
             onClick={handleAnalyze}
             disabled={isAnalyzing}
             className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
           >
             {isAnalyzing ? (
                <>Analyzing...</>
             ) : (
                <>Analyze Flow</>
             )}
           </button>
           
           <button 
             onClick={handleAddRandomAppointment}
             className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600"
           >
             + New Request
           </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        
        {/* Left: Schedule */}
        <div className="w-80 h-full p-4 flex-shrink-0">
          <div className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              {currentWarehouse.name} Schedule
          </div>
          <SchedulePanel 
            appointments={currentAppointments} 
            onSelectAppointment={handleAppointmentSelect}
            selectedId={selectedAppointmentId}
          />
        </div>

        {/* Center: 3D Visualization */}
        <div className="flex-1 p-4 relative flex flex-col">
           {/* AI Notification Overlay */}
           {aiAnalysis && (
              <div className="absolute top-6 left-6 right-6 z-40 bg-slate-800/90 backdrop-blur-md border border-indigo-500/50 rounded-lg p-4 shadow-2xl animate-fade-in-up">
                 <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg h-fit">
                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-1">AI Logistics Insight - {currentWarehouse.name}</h3>
                            <div className="prose prose-invert prose-sm text-slate-300 max-h-32 overflow-y-auto pr-2">
                                {aiAnalysis.split('\n').map((line, i) => (
                                    <p key={i} className="mb-1 text-sm">{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setAiAnalysis(null)} className="text-slate-500 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                 </div>
              </div>
           )}

           <WarehouseVisualizer 
              docks={currentDocks} 
              appointments={currentAppointments}
              onDockClick={handleDockClick}
              onTruckClick={handleTruckClick}
              selectedDockId={selectedDockId}
              warehouseName={currentWarehouse.name}
              warehouseGLN={currentWarehouse.gln}
           />
        </div>

        {/* Right: Details */}
        <div className="w-96 h-full flex-shrink-0">
           <DetailsPanel 
              selectedDock={getSelectedDock()} 
              selectedAppointment={getSelectedAppointment()}
              onUpdateStatus={updateAppointmentStatus}
           />
        </div>

      </div>
    </div>
  );
};

export default App;
