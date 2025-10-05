import { Calendar, Clock, Users, MapPin, MoreVertical, X, Eye, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { NAMIBooking, TimeSlot } from "../types/nami";
import { timeSlots } from "../data/namiData";

interface NAMIBookingListProps {
  bookings: NAMIBooking[];
  onCancelBooking: (bookingId: string) => void;
  onEditBooking?: (booking: NAMIBooking) => void;
  onViewDetails?: (booking: NAMIBooking) => void;
}

export function NAMIBookingList({ bookings, onCancelBooking, onEditBooking, onViewDetails }: NAMIBookingListProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeSlots = (slotIds: string[]) => {
    return slotIds
      .map(id => timeSlots.find(slot => slot.id === id))
      .filter(slot => slot)
      .map(slot => slot!.label)
      .join(", ");
  };

  const getTimeRange = (slotIds: string[]) => {
    const slots = slotIds
      .map(id => timeSlots.find(slot => slot.id === id))
      .filter(slot => slot) as TimeSlot[];
    
    if (slots.length === 0) return "";
    
    const sortedSlots = slots.sort((a, b) => a.start.localeCompare(b.start));
    const firstSlot = sortedSlots[0];
    const lastSlot = sortedSlots[sortedSlots.length - 1];
    
    return `${firstSlot.start} - ${lastSlot.end}`;
  };

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

  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today && booking.status !== "cancelled";
  });

  const pastBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate < today || booking.status === "cancelled";
  });

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma reserva encontrada</h3>
        <p className="text-muted-foreground">Ainda não há reservas no sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {upcomingBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Próximas Reservas</h2>
          <div className="grid gap-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded text-xs font-semibold">
                          {booking.roomNumber}
                        </div>
                        {booking.roomName}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {getTimeRange(booking.timeSlots)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {booking.participants} pessoas
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onViewDetails && (
                            <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                          )}
                          {onEditBooking && booking.status === "confirmed" && (
                            <DropdownMenuItem onClick={() => onEditBooking(booking)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar Reserva
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => onCancelBooking(booking.id)}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar Reserva
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm"><strong>Responsável:</strong> {booking.responsible}</p>
                        <p className="text-sm"><strong>Tipo de Atendimento:</strong> {booking.serviceType}</p>
                        <p className="text-sm"><strong>Criado por:</strong> {booking.createdBy}</p>
                      </div>
                      <div>
                        <p className="text-sm"><strong>Horários:</strong></p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {booking.timeSlots.map((slotId) => (
                            <Badge key={slotId} variant="outline" className="text-xs">
                              {timeSlots.find(slot => slot.id === slotId)?.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm"><strong>Observações:</strong></p>
                        <p className="text-sm text-muted-foreground mt-1">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Histórico</h2>
          <div className="grid gap-4">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-muted text-muted-foreground rounded text-xs font-semibold">
                          {booking.roomNumber}
                        </div>
                        {booking.roomName}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {getTimeRange(booking.timeSlots)}
                        </span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm"><strong>Responsável:</strong> {booking.responsible}</p>
                    <p className="text-sm"><strong>Tipo:</strong> {booking.serviceType}</p>
                    <p className="text-sm"><strong>Horários:</strong> {formatTimeSlots(booking.timeSlots)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}