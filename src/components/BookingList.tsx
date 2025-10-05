import { Calendar, Clock, Users, MapPin, MoreVertical, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Booking } from "./BookingModal";

interface BookingListProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export function BookingList({ bookings, onCancelBooking }: BookingListProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: Booking["status"]) => {
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
        <p className="text-muted-foreground">Você ainda não fez nenhuma reserva de sala.</p>
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
                        <MapPin className="h-4 w-4" />
                        {booking.roomName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.startTime} - {booking.endTime}
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
                    <p><strong>Responsável:</strong> {booking.userName}</p>
                    <p><strong>E-mail:</strong> {booking.email}</p>
                    {booking.purpose && (
                      <p><strong>Finalidade:</strong> {booking.purpose}</p>
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
                        <MapPin className="h-4 w-4" />
                        {booking.roomName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p><strong>Responsável:</strong> {booking.userName}</p>
                  {booking.purpose && (
                    <p><strong>Finalidade:</strong> {booking.purpose}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}