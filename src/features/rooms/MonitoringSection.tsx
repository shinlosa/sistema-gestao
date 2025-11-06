import { Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { NAMIRoomCard } from "./NAMIRoomCard";
import { Monitoring, NAMIRoom, NAMIBooking } from "../../types/nami";

interface MonitoringSectionProps {
  monitoring: Monitoring;
  onRoomBooking: (room: NAMIRoom) => void;
  bookings?: NAMIBooking[];
  searchTerm: string;
}

export function MonitoringSection({ monitoring, onRoomBooking, bookings = [], searchTerm }: MonitoringSectionProps) {
  const filteredRooms = monitoring.rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoomCurrentBookings = (roomId: string) => {
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const currentBookings = bookings
      .filter(
        (booking) => {
          const bookingDateString = booking.date.toISOString().split('T')[0]; // YYYY-MM-DD
          return (
            booking.roomId === roomId &&
            bookingDateString === todayDateString &&
            booking.status === "confirmed"
          );
        },
      )
      .flatMap((booking) => booking.timeSlots);
    
    return currentBookings;
  };

  const formatAllowedPeriods = () => {
    const periodLabels: { [key: string]: string } = {
      MA: "M.A",
      MB: "M.B",
      MC: "M.C",
      MD: "M.D",
      ME: "M.E",
      MF: "M.F",
      TA: "T.A",
      TB: "T.B",
      TC: "T.C",
      TD: "T.D",
    };

    return monitoring.allowedPeriods.map((period) => periodLabels[period] || period).join(", ");
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-50 to-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Users className="h-5 w-5 text-blue-600" />
                {monitoring.name}
              </CardTitle>
              <div className="mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    <strong>Períodos Permitidos:</strong> {formatAllowedPeriods()}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="outline">{filteredRooms.length} salas encontradas</Badge>
          </div>
        </CardHeader>
      </Card>

      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <NAMIRoomCard
              key={room.id}
              room={room}
              onBooking={onRoomBooking}
              currentBookings={getRoomCurrentBookings(room.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <p>
            Nenhuma sala encontrada com o termo "{searchTerm}" neste monitoramento.
          </p>
        </div>
      )}
    </div>
  );
}
