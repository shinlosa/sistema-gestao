import { Users, Monitor, Wifi, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  amenities: string[];
  image: string;
  available: boolean;
}

interface RoomCardProps {
  room: Room;
  onBooking: (room: Room) => void;
}

export function RoomCard({ room, onBooking }: RoomCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "projetor":
        return <Monitor className="h-4 w-4" />;
      case "wi-fi":
        return <Wifi className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <ImageWithFallback
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={room.available ? "default" : "destructive"}>
            {room.available ? "Disponível" : "Ocupada"}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{room.name}</CardTitle>
            <CardDescription className="flex items-center mt-2">
              <Users className="h-4 w-4 mr-1" />
              Até {room.capacity} pessoas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground mb-4">{room.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.map((amenity) => (
            <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
              {getAmenityIcon(amenity)}
              {amenity}
            </Badge>
          ))}
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => onBooking(room)}
          disabled={!room.available}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Reservar
        </Button>
      </CardContent>
    </Card>
  );
}