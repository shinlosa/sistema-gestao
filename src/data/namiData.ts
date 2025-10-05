import { TimeSlot, Monitoring, NAMIRoom } from "../types/nami";

// Horários específicos do NAMI
export const timeSlots: TimeSlot[] = [
  // Período Matutino
  { id: 'MA', label: 'M.A', start: '07:30', end: '08:20', period: 'morning' },
  { id: 'MB', label: 'M.B', start: '08:20', end: '09:10', period: 'morning' },
  { id: 'MC', label: 'M.C', start: '09:30', end: '10:20', period: 'morning' },
  { id: 'MD', label: 'M.D', start: '10:20', end: '11:10', period: 'morning' },
  { id: 'ME', label: 'M.E', start: '11:20', end: '12:10', period: 'morning' },
  { id: 'MF', label: 'M.F', start: '12:10', end: '13:00', period: 'morning' },
  
  // Período Vespertino
  { id: 'TA', label: 'T.A', start: '13:30', end: '14:20', period: 'afternoon' },
  { id: 'TB', label: 'T.B', start: '14:20', end: '15:10', period: 'afternoon' },
  { id: 'TC', label: 'T.C', start: '15:30', end: '16:20', period: 'afternoon' },
  { id: 'TD', label: 'T.D', start: '16:20', end: '17:10', period: 'afternoon' },
];

// Estrutura dos monitoramentos
export const monitorings: Monitoring[] = [
  {
    id: 'mon1',
    name: 'Monitoramento 1',
    responsible: 'Profa. Lorrainy',
    serviceType: 'NDC - Atendimento de 1ª vez (Pcte A)',
    allowedPeriods: ['MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'TA', 'TB', 'TC', 'TD'],
    rooms: []
  },
  {
    id: 'mon2',
    name: 'Monitoramento 2',
    responsible: 'Profa. Virginia (ESC)',
    serviceType: 'Atendimento Geral',
    allowedPeriods: ['MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'TA', 'TB', 'TC', 'TD'],
    rooms: []
  },
  {
    id: 'mon3',
    name: 'Monitoramento 3',
    responsible: 'Múltiplos Responsáveis',
    serviceType: 'Atendimento Especializado',
    allowedPeriods: ['MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'TA', 'TB', 'TC', 'TD'],
    rooms: []
  }
];

// Salas do NAMI
export const namiRooms: NAMIRoom[] = [
  // Monitoramento 1 - Profa. Lorrainy
  {
    id: 'room1',
    number: 1,
    name: 'Sala 1 - NDC',
    monitoringId: 'mon1',
    capacity: 8,
    description: 'Sala para atendimento de primeira vez - NDC',
    defaultResponsible: 'Profa. Lorrainy',
    defaultServiceType: 'Atendimento de 1ª vez (Pcte A)',
    isIndependent: false,
    available: true
  },
  {
    id: 'room2',
    number: 2,
    name: 'Sala 2 - NDC',
    monitoringId: 'mon1',
    capacity: 8,
    description: 'Sala para atendimento de primeira vez - NDC',
    defaultResponsible: 'Profa. Lorrainy',
    defaultServiceType: 'Atendimento de 1ª vez (Pcte A)',
    isIndependent: false,
    available: true
  },
  {
    id: 'room3',
    number: 3,
    name: 'Sala 3 - NDC',
    monitoringId: 'mon1',
    capacity: 8,
    description: 'Sala para atendimento de primeira vez - NDC',
    defaultResponsible: 'Profa. Lorrainy',
    defaultServiceType: 'Atendimento de 1ª vez (Pcte A)',
    isIndependent: false,
    available: true
  },
  {
    id: 'room4',
    number: 4,
    name: 'Sala 4 - NDC',
    monitoringId: 'mon1',
    capacity: 8,
    description: 'Sala para atendimento de primeira vez - NDC',
    defaultResponsible: 'Profa. Lorrainy',
    defaultServiceType: 'Atendimento de 1ª vez (Pcte A)',
    isIndependent: false,
    available: true
  },
  {
    id: 'room5',
    number: 5,
    name: 'Sala 5 - NDC',
    monitoringId: 'mon1',
    capacity: 8,
    description: 'Sala para atendimento de primeira vez - NDC',
    defaultResponsible: 'Profa. Lorrainy',
    defaultServiceType: 'Atendimento de 1ª vez (Pcte A)',
    isIndependent: false,
    available: true
  },

  // Monitoramento 2 - Profa. Virginia
  {
    id: 'room6',
    number: 6,
    name: 'Sala 6 - ESC',
    monitoringId: 'mon2',
    capacity: 10,
    description: 'Sala de atendimento geral - ESC',
    defaultResponsible: 'Profa. Virginia',
    defaultServiceType: 'Atendimento ESC',
    isIndependent: false,
    available: true
  },
  {
    id: 'room7',
    number: 7,
    name: 'Sala 7 - ESC',
    monitoringId: 'mon2',
    capacity: 10,
    description: 'Sala de atendimento geral - ESC',
    defaultResponsible: 'Profa. Virginia',
    defaultServiceType: 'Atendimento ESC',
    isIndependent: false,
    available: true
  },
  {
    id: 'room8',
    number: 8,
    name: 'Sala 8 - ESC',
    monitoringId: 'mon2',
    capacity: 10,
    description: 'Sala de atendimento geral - ESC',
    defaultResponsible: 'Profa. Virginia',
    defaultServiceType: 'Atendimento ESC',
    isIndependent: false,
    available: true
  },
  {
    id: 'room9',
    number: 9,
    name: 'Sala 9 - ESC',
    monitoringId: 'mon2',
    capacity: 10,
    description: 'Sala de atendimento geral - ESC',
    defaultResponsible: 'Profa. Virginia',
    defaultServiceType: 'Atendimento ESC',
    isIndependent: false,
    available: true
  },
  {
    id: 'room10',
    number: 10,
    name: 'Sala 10 - ESC',
    monitoringId: 'mon2',
    capacity: 10,
    description: 'Sala de atendimento geral - ESC',
    defaultResponsible: 'Profa. Virginia',
    defaultServiceType: 'Atendimento ESC',
    isIndependent: false,
    available: true
  },

  // Monitoramento 3
  {
    id: 'room11',
    number: 11,
    name: 'Sala 11 - Nutrição',
    monitoringId: 'mon3',
    capacity: 6,
    description: 'Sala de atendimento nutricional',
    defaultResponsible: 'Nutricionista Ana Claudia',
    defaultServiceType: 'Atendimento Nutricional',
    isIndependent: false,
    available: true
  },
  {
    id: 'room14',
    number: 14,
    name: 'Sala 14',
    monitoringId: 'mon3',
    capacity: 8,
    description: 'Sala de atendimento especializado',
    defaultResponsible: '',
    defaultServiceType: 'Atendimento Especializado',
    isIndependent: false,
    available: true
  },
  {
    id: 'room15',
    number: 15,
    name: 'Sala 15 - Farmácia',
    monitoringId: 'mon3',
    capacity: 8,
    description: 'Sala de atendimento farmacêutico',
    defaultResponsible: 'Profa. Carol',
    defaultServiceType: 'Atendimento Farmacêutico (ABCD)',
    isIndependent: false,
    available: true
  },
  {
    id: 'room16',
    number: 16,
    name: 'Sala 16',
    monitoringId: 'mon3',
    capacity: 8,
    description: 'Sala de atendimento especializado',
    defaultResponsible: '',
    defaultServiceType: 'Atendimento Especializado',
    isIndependent: false,
    available: true
  },
  {
    id: 'room17',
    number: 17,
    name: 'Sala 17',
    monitoringId: 'mon3',
    capacity: 8,
    description: 'Sala de atendimento especializado',
    defaultResponsible: '',
    defaultServiceType: 'Atendimento Especializado',
    isIndependent: false,
    available: true
  },

  // Salas Independentes
  {
    id: 'room12',
    number: 12,
    name: 'Sala 12 - Independente',
    capacity: 12,
    description: 'Sala de uso geral - não vinculada a monitoramento',
    isIndependent: true,
    available: true
  },
  {
    id: 'room13',
    number: 13,
    name: 'Sala 13 - Auditório',
    capacity: 25,
    description: 'Sala especial com capacidade para 25 pessoas - não vinculada a monitoramento',
    isIndependent: true,
    available: true
  }
];

// Organizar salas por monitoramento
monitorings[0].rooms = namiRooms.filter(room => room.monitoringId === 'mon1');
monitorings[1].rooms = namiRooms.filter(room => room.monitoringId === 'mon2');
monitorings[2].rooms = namiRooms.filter(room => room.monitoringId === 'mon3');