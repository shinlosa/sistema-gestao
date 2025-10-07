import { Users, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { NAMIRoomCard } from "./NAMIRoomCard";
import { Monitoring, NAMIRoom, NAMIBooking } from "../types/nami";

interface MonitoringSectionProps {
  monitoring: Monitoring;
  onRoomBooking: (room: NAMIRoom) => void;
  bookings?: NAMIBooking[];
}

export function MonitoringSection({ monitoring, onRoomBooking, bookings = [] }: MonitoringSectionProps) {
  const getRoomCurrentBookings = (roomId: string) => {
    const today = new Date();
    return bookings
      .filter(booking => 
        booking.roomId === roomId && 
        booking.date.toDateString() === today.toDateString() &&
        booking.status === 'confirmed'
      )
      .flatMap(booking => booking.timeSlots);
  };

  const formatAllowedPeriods = () => {
    const periodLabels: { [key: string]: string } = {
      'MA': 'M.A', 'MB': 'M.B', 'MC': 'M.C', 'MD': 'M.D', 'ME': 'M.E', 'MF': 'M.F',
      'TA': 'T.A', 'TB': 'T.B', 'TC': 'T.C', 'TD': 'T.D'
    };
    
    return monitoring.allowedPeriods
      .map(period => periodLabels[period] || period)
      .join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Monitoramento */}
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
                  <span><strong>Períodos Permitidos:</strong> {formatAllowedPeriods()}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline">
              {monitoring.rooms.length} salas
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Grid de Salas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monitoring.rooms.map((room) => (
          <NAMIRoomCard
            key={room.id}
            room={room}
            onBooking={onRoomBooking}
            currentBookings={getRoomCurrentBookings(room.id)}
          />
        ))}
      </div>
    </div>
  );
}