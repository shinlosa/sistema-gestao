import { Users, Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { NAMIRoom } from "../../types/nami";

interface NAMIRoomCardProps {
  room: NAMIRoom;
  onBooking: (room: NAMIRoom) => void;
  currentBookings?: string[];
}

export function NAMIRoomCard({ room, onBooking, currentBookings = [] }: NAMIRoomCardProps) {
  const hasCurrentBookings = currentBookings.length > 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-md text-sm font-semibold shadow-sm">
              {room.number}
            </div>
            <div>
              <CardTitle className="text-lg">{room.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Users className="h-4 w-4 mr-1" />
                Até {room.capacity} pessoas
              </CardDescription>
            </div>
          </div>
          <Badge
            className={
              room.available && !hasCurrentBookings
                ? "bg-available text-available-foreground hover:bg-available/80"
                : "bg-occupied text-occupied-foreground hover:bg-occupied/80"
            }
          >
            {room.available && !hasCurrentBookings ? "Disponível" : "Ocupada"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{room.description}</p>

        {room.defaultResponsible && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Responsável:</span>
            <span className="text-muted-foreground">{room.defaultResponsible}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {room.isIndependent && (
            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
              Sala Independente
            </Badge>
          )}
          {room.name.startsWith("Escritório Monitoramento") && (
            <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200">
              Monitoramento
            </Badge>
          )}
        </div>

        {hasCurrentBookings && (
          <div className="text-sm">
            <span className="font-medium">Horários Ocupados:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentBookings.map((slot) => (
                <Badge key={slot} variant="secondary" className="text-xs">
                  {slot}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full" onClick={() => onBooking(room)} disabled={!room.available}>
          <Calendar className="h-4 w-4 mr-2" />
          {hasCurrentBookings ? "Ver Disponibilidade" : "Reservar"}
        </Button>
      </CardContent>
    </Card>
  );
}
