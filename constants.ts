import { Student, BusInfo, Notification } from './types';

export const STUDENTS_DB: Student[] = [
  { name: "Immanuvel H", regNo: "732423243010", dob: "06/08/2006", busRouteNo: "121", stoppingName: "NRK Puram, Tiruppur" },
  { name: "Raghavi", regNo: "732423243008", dob: "28/07/2005", busRouteNo: "113", stoppingName: "Koduvai" },
  { name: "Akilendeshwari", regNo: "732423243002", dob: "23/02/2005", busRouteNo: "118", stoppingName: "Erode" },
  { name: "Arshiya Sana", regNo: "732423243003", dob: "06/04/2005", busRouteNo: "111", stoppingName: "Tiruppur New Bus Stand" },
  { name: "Rithik Roshan", regNo: "732423243021", dob: "23/01/2005", busRouteNo: "121", stoppingName: "Uthukuli, Tiruppur" },
  { name: "Tamil Arasi", regNo: "732423243024", dob: "28/10/2006", busRouteNo: "114", stoppingName: "15, Velampalayam" },
  { name: "Darshan Kumar", regNo: "732423243004", dob: "17/03/2005", busRouteNo: "122", stoppingName: "Bhavani" },
  { name: "Kavin", regNo: "732423243013", dob: "08/08/2005", busRouteNo: "125", stoppingName: "Old Bus Stand, Tiruppur" },
  { name: "Lathika", regNo: "732423243015", dob: "26/02/2006", busRouteNo: "110", stoppingName: "Perumanallur" },
  { name: "Gayathri", regNo: "732423243005", dob: "12/11/2006", busRouteNo: "121", stoppingName: "Kodikkambam, Tiruppur" },
];

export const BUS_FLEET: BusInfo[] = [
  { routeNo: "121", routeName: "Tiruppur Route", driverName: "Ramesh", totalStudents: 42, status: "Delayed", delayMin: 15, currentLocation: { lat: 11.1085, lng: 77.3411 } },
  { routeNo: "113", routeName: "Koduvai Route", driverName: "Suresh", totalStudents: 35, status: "On Time", currentLocation: { lat: 10.9876, lng: 77.4532 } },
  { routeNo: "118", routeName: "Erode Route", driverName: "Mani", totalStudents: 50, status: "On Time", currentLocation: { lat: 11.3410, lng: 77.7172 } },
  { routeNo: "111", routeName: "New Bus Stand", driverName: "Velu", totalStudents: 38, status: "Breakdown", currentLocation: { lat: 11.1234, lng: 77.3333 } },
  { routeNo: "122", routeName: "Bhavani Route", driverName: "Kumar", totalStudents: 45, status: "On Time", currentLocation: { lat: 11.4444, lng: 77.6888 } },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Bus 121 Delayed', message: 'Heavy traffic at Tiruppur Main signal.', time: '08:15 AM', type: 'delay' },
  { id: '2', title: 'Route Change', message: 'Bus 118 will skip stop #4 due to construction.', time: 'Yesterday', type: 'info' },
];

export const AI_SUGGESTIONS = [
  "Where is my bus?",
  "Why is Bus 121 late?",
  "Is attendance marked?",
  "Show my route map"
];
