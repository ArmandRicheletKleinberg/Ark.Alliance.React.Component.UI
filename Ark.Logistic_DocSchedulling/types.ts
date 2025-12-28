
export enum DockStatus {
  IDLE = 'IDLE',
  RESERVED = 'RESERVED',
  LOADING = 'LOADING',
  UNLOADING = 'UNLOADING',
  MAINTENANCE = 'MAINTENANCE'
}

export enum TruckType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND'
}

export interface Truck {
  id: string;
  licensePlate: string;
  driverName: string;
  company: string;
  type: TruckType;
}

export interface Appointment {
  id: string;
  truckId: string;
  dockId: string | null;
  scheduledTime: string; // ISO string
  estimatedDuration: number; // minutes
  poNumber?: string; // Purchase Order
  desadv?: string; // Despatch Advice
  status: 'SCHEDULED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  items: { description: string; quantity: number }[];
}

export interface Dock {
  id: string;
  warehouseId: string;
  name: string;
  status: DockStatus;
  currentAppointmentId: string | null;
}

export interface Warehouse {
    id: string;
    name: string;
    gln: string;
    description: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
}

// --- Route & Cargo Hierarchy Types ---

export interface InnerItem {
  id: string;
  description: string;
  ean: string;
  quantity: number;
}

export interface Crate {
  id: string;
  type: string; // e.g., 'Plastic Box', 'Cardboard'
  items: InnerItem[];
}

export interface Pallet {
  id: string;
  ean: string;
  type: string; // e.g., 'EURO', 'BLOCK'
  crates: Crate[];
}

export interface RouteStop {
  id: string;
  type: 'WAREHOUSE' | 'DELIVERY_POINT' | 'PICKUP_POINT';
  name: string;
  gln: string;
  coordinates: { lat: number; lng: number };
  arrivalTime: string;
  activityDuration: number; // minutes
  pallets: Pallet[];
}

export interface TruckRoute {
  truckId: string;
  stops: RouteStop[];
}
