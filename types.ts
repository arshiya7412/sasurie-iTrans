export enum UserRole {
  NONE = 'NONE',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface Student {
  name: string;
  regNo: string;
  dob: string; // DD/MM/YYYY
  busRouteNo: string;
  stoppingName: string;
}

export interface BusInfo {
  routeNo: string;
  routeName: string; // Main stopping
  driverName: string;
  totalStudents: number;
  status: 'On Time' | 'Delayed' | 'Breakdown';
  currentLocation: { lat: number, lng: number };
  delayMin?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'delay' | 'info' | 'alert';
}

// For Admin Map
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'bus' | 'stop';
  status?: 'normal' | 'delayed' | 'issue';
  label?: string;
}