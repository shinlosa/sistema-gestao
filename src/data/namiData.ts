import { TimeSlot, Monitoring, NAMIRoom } from "../types/nami";

// Horários específicos do NAMI
export const timeSlots: TimeSlot[] = [
  // Blocos Matutino
  { id: 'MAB', label: 'Manhã AB', start: '07:30', end: '09:10', period: 'morning' },
  { id: 'MCD', label: 'Manhã CD', start: '09:30', end: '11:10', period: 'morning' },
  { id: 'MEF', label: 'Manhã EF', start: '11:20', end: '13:00', period: 'morning' },
  // Blocos Vespertino
  { id: 'TAB', label: 'Tarde AB', start: '13:30', end: '15:10', period: 'afternoon' },
  { id: 'TCD', label: 'Tarde CD', start: '15:30', end: '17:10', period: 'afternoon' },
];

// Estrutura dos monitoramentos
export const monitorings: Monitoring[] = [
  {
    id: 'mon1',
    name: 'Monitoramento 1',
    serviceType: 'NDC - Atendimento de 1ª vez (Pcte A)',
  allowedPeriods: ['MAB', 'MCD', 'MEF', 'TAB', 'TCD'],
    rooms: [],
    reservavel: true,
    responsaveis: [
      { professor: 'Profa. Flávia', salaIds: ['room1', 'room2'] },
      { professor: 'Prof. Roberto', salaIds: ['room3', 'room4', 'room5'] }
    ]
  },
  {
    id: 'mon2',
    name: 'Monitoramento 2',
    serviceType: 'Atendimento Geral',
  allowedPeriods: ['MAB', 'MCD', 'MEF', 'TAB', 'TCD'],
    rooms: [],
    reservavel: true,
    responsaveis: [
      { professor: 'Profa. Lorrainy', salaIds: ['room6', 'room7'] }
    ]
  },
  {
    id: 'mon3',
    name: 'Monitoramento 3',
    serviceType: 'Atendimento Especializado',
  allowedPeriods: ['MAB', 'MCD', 'MEF', 'TAB', 'TCD'],
    rooms: [],
    reservavel: true,
    responsaveis: []
  }
];

// Salas do NAMI
export const namiRooms: NAMIRoom[] = [
  // Escritórios dos monitoramentos (reserváveis como qualquer sala)
  {
    id: 'office_mon1',
    number: 101,
    name: 'Escritório Monitoramento 1',
    monitoringId: 'mon1',
    capacity: 2,
    description: 'Sala de escritório do Monitoramento 1, reservável independentemente das salas de aula.',
    isIndependent: true,
    available: true
  },
  {
    id: 'office_mon2',
    number: 102,
    name: 'Escritório Monitoramento 2',
    monitoringId: 'mon2',
    capacity: 2,
    description: 'Sala de escritório do Monitoramento 2, reservável independentemente das salas de aula.',
    isIndependent: true,
    available: true
  },
  {
    id: 'office_mon3',
    number: 103,
    name: 'Escritório Monitoramento 3',
    monitoringId: 'mon3',
    capacity: 2,
    description: 'Sala de escritório do Monitoramento 3, reservável independentemente das salas de aula.',
    isIndependent: true,
    available: true
  },
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

// Organizar salas por monitoramento (excluindo salas independentes)
monitorings[0].rooms = namiRooms.filter(room => room.monitoringId === 'mon1' && !room.isIndependent);
monitorings[1].rooms = namiRooms.filter(room => room.monitoringId === 'mon2' && !room.isIndependent);
monitorings[2].rooms = namiRooms.filter(room => room.monitoringId === 'mon3' && !room.isIndependent);