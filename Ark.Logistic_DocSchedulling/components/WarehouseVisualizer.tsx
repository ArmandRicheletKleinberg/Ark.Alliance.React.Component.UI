import React, { useState, useRef } from 'react';
import { Dock, DockStatus, Appointment } from '../types';

interface WarehouseVisualizerProps {
  docks: Dock[];
  appointments: Appointment[];
  onDockClick: (dockId: string) => void;
  onTruckClick?: (truckId: string) => void; // New prop
  selectedDockId: string | null;
  warehouseName: string;
  warehouseGLN: string;
}

const WarehouseVisualizer: React.FC<WarehouseVisualizerProps> = ({ 
    docks, 
    appointments, 
    onDockClick,
    onTruckClick, // Destructure
    selectedDockId,
    warehouseName,
    warehouseGLN
}) => {
  // Camera State
  const [camera, setCamera] = useState({
    pitch: 60, // X rotation (degrees) - slightly higher for better top-down view of long trucks
    yaw: -30,  // Z rotation (degrees)
    zoom: 1.0, // Scale
    panX: 0,
    panY: 80   // Offset to center the larger scene
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to find active truck for a dock
  const getTruckForDock = (dock: Dock) => {
    if (!dock.currentAppointmentId) return null;
    return appointments.find(a => a.id === dock.currentAppointmentId);
  };

  // Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    // Shift+Drag or Right Click to Pan, otherwise Rotate
    if (e.shiftKey || e.button === 2) {
      setCamera(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY
      }));
    } else {
      setCamera(prev => ({
        ...prev,
        yaw: prev.yaw - deltaX * 0.5,
        pitch: Math.max(10, Math.min(85, prev.pitch - deltaY * 0.5)) // Clamp pitch to avoid flipping
      }));
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  
  const handleWheel = (e: React.WheelEvent) => {
    // Zoom in/out
    const factor = 1 - e.deltaY * 0.001;
    const newZoom = Math.max(0.4, Math.min(3, camera.zoom * factor));
    setCamera(prev => ({ ...prev, zoom: newZoom }));
  };

  const resetView = () => setCamera({ pitch: 60, yaw: -30, zoom: 1.0, panX: 0, panY: 80 });

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-slate-900 rounded-xl shadow-inner border border-slate-700 flex items-center justify-center cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()} // Disable context menu for right-click pan
    >
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <div className="bg-slate-800/80 backdrop-blur text-slate-300 text-[10px] p-2 rounded border border-slate-600 shadow-xl pointer-events-auto">
           <div className="font-bold mb-1 text-white">Controls</div>
           <div>LB Drag: Rotate</div>
           <div>Shift+Drag: Pan</div>
           <div>Scroll: Zoom</div>
        </div>
        <button 
           onClick={(e) => { e.stopPropagation(); resetView(); }}
           className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-1 px-3 rounded shadow-lg pointer-events-auto transition-colors"
        >
           Reset View
        </button>
      </div>

      {/* 3D Scene Container */}
      <div 
        className="iso-scene relative w-[600px] h-[600px]"
        style={{
            transform: `translateX(${camera.panX}px) translateY(${camera.panY}px) scale(${camera.zoom}) rotateX(${camera.pitch}deg) rotateZ(${camera.yaw}deg)`
        }}
      >
        {/* Warehouse Floor Group */}
        <div className="absolute inset-0 iso-object">
          
          {/* Floor Thickness (Fake 3D Block) */}
          <div className="absolute inset-0 transform translate-z-[-10px] bg-slate-800 rounded-lg iso-object" style={{ transform: 'translateZ(-20px)' }}></div>
          <div className="absolute -left-[4px] top-0 bottom-0 w-[4px] bg-slate-600 origin-right transform rotateY(-90deg)"></div>
          <div className="absolute -bottom-[4px] left-0 right-0 h-[4px] bg-slate-900 origin-top transform rotateX(-90deg)"></div>

          {/* Main Floor Surface */}
          <div className="absolute inset-0 bg-slate-700 rounded-lg shadow-2xl border-4 border-slate-600 iso-object overflow-visible">
            
            {/* Warehouse Back Wall */}
            <div className="absolute top-0 left-0 w-full h-32 bg-slate-800 origin-bottom transform -translate-y-full -rotate-x-90 flex flex-col items-center justify-end pb-4 border-b border-slate-600 iso-object shadow-xl">
               <div className="text-3xl font-bold text-slate-500 tracking-widest opacity-80 mb-1">{warehouseName}</div>
               <div className="text-[10px] font-mono text-slate-400 opacity-60 tracking-widest border border-slate-600 px-2 py-0.5 rounded">GLN: {warehouseGLN}</div>
               {/* Wall Thickness */}
               <div className="absolute top-0 right-0 w-4 h-full bg-slate-900 origin-left rotate-y-90"></div>
            </div>

            {/* Docks Container */}
            <div className="absolute top-0 left-0 w-full h-full p-8 grid grid-cols-4 gap-4 iso-object">
              {docks.map((dock) => {
                const truck = getTruckForDock(dock);
                const isSelected = selectedDockId === dock.id;

                let statusColor = 'bg-slate-500'; // IDLE
                if (dock.status === DockStatus.LOADING) statusColor = 'bg-emerald-500';
                if (dock.status === DockStatus.UNLOADING) statusColor = 'bg-blue-500';
                if (dock.status === DockStatus.RESERVED) statusColor = 'bg-amber-500';
                if (dock.status === DockStatus.MAINTENANCE) statusColor = 'bg-red-500';

                return (
                  <div 
                    key={dock.id}
                    onClick={(e) => { e.stopPropagation(); onDockClick(dock.id); }}
                    className={`relative group cursor-pointer transition-all duration-300 iso-object hover:-translate-z-2 ${isSelected ? 'ring-2 ring-white/50 rounded-lg' : ''}`}
                  >
                    {/* Dock Platform (Parking Slot) */}
                    <div className="w-full h-40 bg-slate-600 rounded-lg shadow-lg relative border border-slate-500 flex flex-col items-center justify-end py-2 iso-object">
                      {/* Dock Door (Top - connecting to warehouse) */}
                      <div className="absolute top-0 w-3/4 h-2 bg-black/60 rounded-b-sm backdrop-blur-sm border-b border-slate-400/30">
                        {/* Shutter lines */}
                        <div className="w-full h-[1px] bg-slate-500/50 mt-[2px]"></div>
                        <div className="w-full h-[1px] bg-slate-500/50 mt-[2px]"></div>
                      </div>

                      {/* Dock Name at Bottom (Entrance to slot) */}
                      <div className="text-xs font-mono text-slate-300 font-bold mb-1 absolute bottom-1">{dock.name}</div>
                      
                      {/* Status Light */}
                      <div className={`absolute bottom-6 w-3 h-3 rounded-full ${statusColor} shadow-[0_0_10px_rgba(255,255,255,0.4)] animate-pulse`}></div>
                      
                      {/* Platform Thickness (Pseudo 3D) */}
                      <div className="absolute -right-1 top-0 bottom-0 w-1 bg-slate-800 origin-left transform rotateY(90deg) rounded-r"></div>
                      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-slate-900 origin-top transform rotateX(90deg) rounded-b"></div>
                    </div>

                    {/* 3D Truck Representation */}
                    {truck && (
                      <div 
                          className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 z-20 animate-truck-enter iso-object transition-all cursor-alias"
                          style={{ height: '180px' }}
                          onClick={(e) => {
                             e.stopPropagation(); // Prevent triggering dock selection
                             onDockClick(dock.id); // Still select the dock for visual context
                             if (onTruckClick) onTruckClick(truck.truckId); // Trigger route modal
                          }}
                       > 
                        
                        {/* ==================== TRAILER SECTION ==================== */}
                        <div className={`absolute top-0 left-0 w-10 h-36 rounded-sm shadow-2xl border border-white/5 iso-object
                          ${truck.poNumber ? 'bg-indigo-700' : 'bg-orange-700'} 
                          flex items-center justify-center`}
                          style={{
                             transform: 'translateZ(8px)', // Lift trailer higher for wheels
                             boxShadow: '10px 10px 20px rgba(0,0,0,0.5)'
                          }}
                        >
                           {/* Trailer Roof Text */}
                           <div className="transform rotate-90 whitespace-nowrap opacity-80 text-white text-[6px] font-bold tracking-widest mix-blend-overlay">
                              {truck.poNumber ? 'INBOUND' : 'OUTBOUND'}
                           </div>
                           
                           {/* Trailer Sides (Pseudo 3D) */}
                           <div className={`absolute -right-2 h-full w-2 ${truck.poNumber ? 'bg-indigo-900' : 'bg-orange-900'} origin-left rotateY(90deg)`}></div>
                           <div className={`absolute -bottom-2 left-0 right-0 h-2 ${truck.poNumber ? 'bg-indigo-900' : 'bg-orange-900'} origin-top rotateX(90deg)`}></div>
                           
                           {/* Trailer Rear Wheels (Bogie) - Backed in, so they are near the "top" visually, but actually near the dock? 
                               No, truck backs in. Rear of trailer is at Top. So wheels are near Top. */}
                           <div className="absolute top-4 -left-[2px] w-[2px] h-8 bg-black/90 border border-slate-700 rounded-sm"></div> {/* Left Rear Wheels */}
                           <div className="absolute top-4 -right-[2px] w-[2px] h-8 bg-black/90 border border-slate-700 rounded-sm"></div> {/* Right Rear Wheels */}

                           {/* Landing Gear (Near front of trailer, which is bottom visually) */}
                           <div className="absolute bottom-8 left-1 w-1 h-1 bg-slate-400 rounded-full shadow-sm"></div>
                           <div className="absolute bottom-8 right-1 w-1 h-1 bg-slate-400 rounded-full shadow-sm"></div>

                           {/* Hazard Lights (Active when In Progress) */}
                           {dock.status !== DockStatus.IDLE && (
                               <>
                                <div className="absolute top-0 left-0 w-1 h-1 bg-amber-500 animate-[pulse_0.5s_infinite] shadow-[0_0_5px_rgba(245,158,11,1)]"></div>
                                <div className="absolute top-0 right-0 w-1 h-1 bg-amber-500 animate-[pulse_0.5s_infinite] shadow-[0_0_5px_rgba(245,158,11,1)]"></div>
                               </>
                           )}
                        </div>

                        {/* Hitch Connection (Fifth Wheel) */}
                        <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rounded-full border border-slate-600 z-10"
                             style={{ transform: 'translateZ(4px)' }}>
                        </div>

                        {/* ==================== TRACTOR (CAB) SECTION ==================== */}
                        <div className="absolute top-[144px] left-1/2 transform -translate-x-1/2 w-10 h-16 iso-object"
                             style={{ transform: 'translateZ(2px) translateX(-50%)' }}
                        >
                             {/* Drive Wheels (Rear of Cab) */}
                             <div className="absolute top-1 -left-[3px] w-[3px] h-6 bg-black rounded-sm border-l border-t border-slate-700"></div>
                             <div className="absolute top-1 -right-[3px] w-[3px] h-6 bg-black rounded-sm border-r border-t border-slate-700"></div>

                             {/* Cab Body (Sleeper + Cockpit) */}
                             <div className="absolute top-0 left-0 w-full h-10 bg-slate-800 rounded-sm border border-slate-600 shadow-xl z-20">
                                 {/* Cab Thickness */}
                                 <div className="absolute -right-1 h-full w-1 bg-slate-900 origin-left rotateY(90deg)"></div>
                                 <div className="absolute -bottom-1 left-0 right-0 h-1 bg-slate-900 origin-top rotateX(90deg)"></div>
                                 
                                 {/* License Plate Badge on Roof */}
                                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-1.5 py-[1px] rounded-[1px] border border-slate-400 shadow-md z-30 transform hover:scale-125 transition-transform cursor-help">
                                    <div className="text-[5px] font-bold text-black leading-none whitespace-nowrap tracking-wider">{truck.truckId}</div>
                                 </div>
                             </div>
                             
                             {/* Engine Hood (Front of Cab - Lower) */}
                             <div className="absolute top-10 left-1 right-1 h-5 bg-slate-700 rounded-b-md border-l border-r border-b border-slate-600 z-10">
                                 {/* Windshield */}
                                 <div className="absolute -top-1 left-0 right-0 h-2 bg-cyan-900/60 border-t border-slate-500"></div>
                                 {/* Grill */}
                                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-2 bg-slate-900 border border-slate-500 rounded-sm flex flex-col gap-[1px] p-[1px]">
                                     <div className="w-full h-[1px] bg-slate-500"></div>
                                     <div className="w-full h-[1px] bg-slate-500"></div>
                                 </div>
                             </div>

                             {/* Steer Wheels (Front of Cab) */}
                             <div className="absolute bottom-1 -left-[2px] w-[2px] h-3 bg-black rounded-l-sm"></div>
                             <div className="absolute bottom-1 -right-[2px] w-[2px] h-3 bg-black rounded-r-sm"></div>

                             {/* Headlights */}
                             <div className="absolute bottom-1 left-0.5 w-1 h-1 bg-yellow-100 rounded-full shadow-[0_0_2px_rgba(255,255,0,0.8)]"></div>
                             <div className="absolute bottom-1 right-0.5 w-1 h-1 bg-yellow-100 rounded-full shadow-[0_0_2px_rgba(255,255,0,0.8)]"></div>
                        </div>
                        
                        {/* Progress Gauge Floating Above Trailer */}
                        {(dock.status === DockStatus.LOADING || dock.status === DockStatus.UNLOADING) && (
                           <div className="absolute top-10 left-0 w-full flex flex-col items-center"
                                style={{ transform: 'translateZ(50px) rotateX(-45deg)' }}>
                                <div className="bg-slate-900 text-white text-[6px] px-1 py-0.5 rounded mb-1 border border-green-500 shadow-sm whitespace-nowrap">
                                    {dock.status} • {truck.estimatedDuration - 15}m left
                                </div>
                                <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-300 animate-[pulse_2s_infinite] w-2/3"></div>
                                </div>
                           </div>
                        )}

                        {/* Tooltip on Hover (Billboarded) */}
                        <div className="hidden group-hover:block absolute top-0 left-1/2 -translate-x-1/2 w-max bg-slate-900/95 border border-slate-500 rounded p-3 text-[10px] text-white shadow-2xl z-50 pointer-events-none transition-opacity duration-200"
                            style={{
                                transform: `translateZ(120px) rotateZ(${-camera.yaw}deg) rotateX(${-camera.pitch}deg)`
                            }}
                        >
                             <div className="font-bold text-amber-400 border-b border-slate-600 pb-1 mb-1 text-xs">
                                {truck.poNumber ? `PO: ${truck.poNumber}` : `DESADV: ${truck.desadv || 'N/A'}`}
                             </div>
                             <div className="space-y-1">
                                {truck.items.map((item, i) => (
                                    <div key={i} className="flex justify-between gap-4">
                                        <span className="text-slate-200">{item.description}</span>
                                        <span className="font-mono text-slate-400 font-bold">x{item.quantity}</span>
                                    </div>
                                ))}
                             </div>
                             <div className="mt-2 text-[8px] text-slate-500 italic border-t border-slate-700 pt-1">
                                Click for Route Details
                             </div>
                        </div>

                      </div>
                    )}

                    {/* Reserved Marker */}
                    {dock.status === DockStatus.RESERVED && !truck && (
                       <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
                          <div className="w-[80%] h-[90%] border-2 border-dashed border-amber-500 rounded-lg animate-pulse mt-1"></div>
                       </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 p-3 rounded-lg border border-slate-700 text-xs shadow-xl backdrop-blur-sm z-40 pointer-events-none">
        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Idle</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Loading</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Unloading</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Reserved</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Maintenance</div>
      </div>
    </div>
  );
};

export default WarehouseVisualizer;
