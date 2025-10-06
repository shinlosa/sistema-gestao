// Tipos específicos para o sistema NAMI

export interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
  period: 'morning' | 'afternoon';
}

export interface Monitoring {
  id: string;
  name: string;
  serviceType: string;
  allowedPeriods: string[];
  rooms: NAMIRoom[];
  responsaveis?: Array<{
    professor: string;
    salaIds: string[];
  }>;
  reservavel?: boolean; // permite reserva do monitoramento inteiro
}

export interface NAMIRoom {
  id: string;
  number: number;
  name: string;
  monitoringId?: string;
  capacity: number;
  description: string;
  defaultResponsible?: string;
  defaultServiceType?: string;
  isIndependent: boolean;
  available: boolean;
}

export interface NAMIBooking {
  id: string;
  roomId: string;
  roomNumber: number;
  roomName: string;
  date: Date;
  timeSlots: string[];
  responsible: string;
  serviceType: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: Date;
  affectedResource?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  department?: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: Date;
  lastLogin?: Date;
  requestedBy?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}