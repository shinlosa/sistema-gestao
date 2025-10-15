export interface TimeSlot {
  id: string;
  label: string;
  start: string;
  end: string;
  period: "morning" | "afternoon";
}

export interface Monitoring {
  id: string;
  name: string;
  serviceType?: string;
  allowedPeriods: string[];
  rooms: NAMIRoom[];
  responsaveis?: Array<{
    professor: string;
    salaIds: string[];
  }>;
  reservavel?: boolean;
}

export interface NAMIRoom {
  id: string;
  number: number;
  name: string;
  monitoringId?: string;
  capacity: number;
  description: string;
  defaultResponsible?: string;
  isIndependent: boolean;
  available: boolean;
}

export interface NAMIBooking {
  id: string;
  roomId: string;
  roomNumber: number;
  roomName: string;
  date: string;
  timeSlots: string[];
  responsible: string;
  serviceType: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  status: "confirmed" | "pending" | "cancelled";
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  affectedResource?: string;
}

export type UserRole =
  | "admin"
  | "editor"
  | "viewer"
  | "coordinator"
  | "professor"
  | "staff";

export type UserStatus = "active" | "pending" | "inactive" | "suspended";

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
  requestedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
}
