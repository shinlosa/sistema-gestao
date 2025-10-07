import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// 1. IMPORTAR COMPONENTES NECESSÁRIOS
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { NAMIBooking, TimeSlot } from "../types/nami";
import { timeSlots } from "../data/namiData";

// ... (funções auxiliares como ensureDate, formatDateDisplay, etc. permanecem as mesmas)
interface NAMIBookingListProps {
  bookings: NAMIBooking[];
  onCancelBooking: (bookingId: string) => void;
  onEditBooking?: (booking: NAMIBooking) => void;
  onViewDetails?: (booking: NAMIBooking) => void;
  canManage?: boolean;
}

const ALL_VALUE = "all";

const ensureDate = (value: Date | string): Date =>
  value instanceof Date ? value : new Date(value);

const formatDateDisplay = (date: Date) =>
  date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatWeekday = (date: Date) => {
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
};

const getTimeRange = (slotIds: string[]) => {
  const slots = slotIds
    .map((id) => timeSlots.find((slot) => slot.id === id))
    .filter(Boolean) as TimeSlot[];

  if (slots.length === 0) return "-";

  const sortedSlots = [...slots].sort((a, b) => a.start.localeCompare(b.start));
  const firstSlot = sortedSlots[0];
  const lastSlot = sortedSlots[sortedSlots.length - 1];

  return `${firstSlot.start} - ${lastSlot.end}`;
};

const formatSlotLabels = (slotIds: string[]) =>
  slotIds
    .map((id) => timeSlots.find((slot) => slot.id === id))
    .filter(Boolean)
    .map((slot) => slot!.label)
    .join(", ");

const getStatusBadge = (status: NAMIBooking["status"]) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>;
    case "pending":
      return <Badge variant="secondary">Pendente</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelada</Badge>;
    default:
      return null;
  }
};

const getFirstSlotStart = (booking: NAMIBooking) => {
  const slots = booking.timeSlots
    .map((id) => timeSlots.find((slot) => slot.id === id))
    .filter(Boolean) as TimeSlot[];

  if (slots.length === 0) return "24:00";

  return slots.reduce((earliest, slot) =>
    slot.start < earliest ? slot.start : earliest,
  slots[0].start);
};

export function NAMIBookingList({ bookings, onCancelBooking, onEditBooking, onViewDetails, canManage = true }: NAMIBookingListProps) {
  // 2. SUBSTITUIR O ESTADO DO FILTRO DE DATA
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  const [responsibleFilter, setResponsibleFilter] = useState<string>(ALL_VALUE);
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>(ALL_VALUE);

  const hasActiveFilters =
    !!startDate ||
    !!endDate ||
    responsibleFilter !== ALL_VALUE ||
    serviceTypeFilter !== ALL_VALUE;

  // `dateOptions` não é mais necessário e foi removido.

  const responsibleOptions = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((booking) => {
      if (booking.responsible) {
        set.add(booking.responsible);
      }
    });
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [bookings]);

  const serviceTypeOptions = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((booking) => {
      if (booking.serviceType) {
        set.add(booking.serviceType);
      }
    });
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [bookings]);

  const filteredBookings = useMemo(() =>
    bookings.filter((booking) => {
      // 3. ATUALIZAR A LÓGICA DE FILTRAGEM DE DATA
      const bookingDate = ensureDate(booking.date);
      
      const matchDate = (() => {
        // Ignora a parte de hora/minuto para a comparação
        const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
        
        const start = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) : null;
        const end = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) : null;

        if (start && bookingDay < start) return false;
        if (end && bookingDay > end) return false;
        return true;
      })();

      const matchResponsible =
        responsibleFilter === ALL_VALUE || booking.responsible === responsibleFilter;
      const matchServiceType =
        serviceTypeFilter === ALL_VALUE || booking.serviceType === serviceTypeFilter;

      return matchDate && matchResponsible && matchServiceType;
    }),
  [bookings, startDate, endDate, responsibleFilter, serviceTypeFilter]);

  const sortedBookings = useMemo(() =>
    [...filteredBookings].sort((a, b) => {
      const dateA = ensureDate(a.date);
      const dateB = ensureDate(b.date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      const slotA = getFirstSlotStart(a);
      const slotB = getFirstSlotStart(b);

      if (slotA !== slotB) {
        return slotA.localeCompare(slotB);
      }

      return a.roomNumber - b.roomNumber;
    }),
  [filteredBookings]);

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setResponsibleFilter(ALL_VALUE);
    setServiceTypeFilter(ALL_VALUE);
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma reserva encontrada</h3>
        <p className="text-muted-foreground">Ainda não há reservas no sistema.</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-blue-100 p-2 text-blue-700">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Visão em planilha das reservas</CardTitle>
            <CardDescription>
              Visualize todos os agendamentos em uma grade ampla e refine pelas informações chave.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 4. SUBSTITUIR O SELECT POR DOIS DATE PICKERS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground tracking-wide">Data início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground tracking-wide">Data fim</Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground tracking-wide">Professor / Responsável</Label>
            <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todos os responsáveis</SelectItem>
                {responsibleOptions.map((responsible) => (
                  <SelectItem key={responsible} value={responsible}>
                    {responsible}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground tracking-wide">Tipo de atendimento</Label>
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todos os tipos</SelectItem>
                {serviceTypeOptions.map((serviceType) => (
                  <SelectItem key={serviceType} value={serviceType}>
                    {serviceType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant={hasActiveFilters ? "outline" : "ghost"}
              className="w-full"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Badge variant="secondary" className="text-sm font-medium">
            Mostrando {sortedBookings.length} de {bookings.length} reservas
          </Badge>
          {hasActiveFilters && (
            <span className="text-xs text-muted-foreground">
              Filtros ativos aplicados ao resultado.
            </span>
          )}
        </div>
        
        {/* ... (o resto do seu JSX com a Tabela permanece o mesmo) ... */}
        {sortedBookings.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">Nenhuma reserva encontrada</h3>
            <p className="text-sm text-muted-foreground">
              Ajuste os filtros para visualizar outros resultados.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border shadow-sm">
            <Table className="min-w-[960px]">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Data</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Tipo de atendimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado por</TableHead>
                  <TableHead>Observações</TableHead>
                  {canManage && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBookings.map((booking) => {
                  const date = ensureDate(booking.date);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="min-w-[160px]">
                        <div className="font-medium">{formatDateDisplay(date)}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {formatWeekday(date)}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[140px]">
                        <div className="font-medium">{booking.roomName}</div>
                        <div className="text-xs text-muted-foreground">Sala {booking.roomNumber}</div>
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        <div className="font-medium">{getTimeRange(booking.timeSlots)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatSlotLabels(booking.timeSlots) || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[160px]">
                        <div className="font-medium">{booking.responsible || "-"}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.responsible ? "Responsável" : "Não informado"}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        {booking.serviceType ? (
                          <Badge variant="outline" className="font-normal">
                            {booking.serviceType}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Não informado</span>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="min-w-[140px]">
                        <div className="font-medium">{booking.createdBy}</div>
                      </TableCell>
                      <TableCell className="max-w-[220px]">
                        {booking.notes ? (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {booking.notes}
                          </p>
                        ) : (
                          <span className="text-xs text-muted-foreground">---</span>
                        )}
                      </TableCell>
                      {canManage && (
                        <TableCell className="min-w-[200px] text-right">
                          <div className="flex justify-end flex-wrap gap-2">
                            {onViewDetails && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewDetails(booking)}
                              >
                                Ver
                              </Button>
                            )}
                            {onEditBooking && booking.status === "confirmed" && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onEditBooking(booking)}
                              >
                                Editar
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onCancelBooking(booking.id)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableCaption>
                Use o scroll horizontal para visualizar todas as colunas quando necessário.
              </TableCaption>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}