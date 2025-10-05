import { useState } from "react";
import { CalendarDays, Clock, Users, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Room } from "./RoomCard";

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  userName: string;
  email: string;
  date: Date;
  startTime: string;
  endTime: string;
  purpose: string;
  participants: number;
  status: "confirmed" | "pending" | "cancelled";
}

interface BookingModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: Omit<Booking, "id" | "status">) => void;
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
];

export function BookingModal({ room, isOpen, onClose, onSubmit }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [participants, setParticipants] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !startTime || !endTime || !userName || !email || !room) {
      return;
    }

    const booking: Omit<Booking, "id" | "status"> = {
      roomId: room.id,
      roomName: room.name,
      userName,
      email,
      date: selectedDate,
      startTime,
      endTime,
      purpose,
      participants,
    };

    onSubmit(booking);
    
    // Reset form
    setStartTime("");
    setEndTime("");
    setUserName("");
    setEmail("");
    setPurpose("");
    setParticipants(1);
    setSelectedDate(new Date());
    onClose();
  };

  const availableEndTimes = timeSlots.filter(time => {
    if (!startTime) return false;
    const startIndex = timeSlots.indexOf(startTime);
    const timeIndex = timeSlots.indexOf(time);
    return timeIndex > startIndex;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Reservar {room?.name}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para fazer sua reserva
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName">Nome Completo</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@empresa.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="participants">Número de Participantes</Label>
                <Input
                  id="participants"
                  type="number"
                  min="1"
                  max={room?.capacity || 10}
                  value={participants}
                  onChange={(e) => setParticipants(parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Horário de Início</Label>
                  <Select value={startTime} onValueChange={setStartTime} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Início" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Horário de Término</Label>
                  <Select value={endTime} onValueChange={setEndTime} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Término" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEndTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Data da Reserva</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="purpose">Finalidade da Reunião</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Descreva brevemente o objetivo da reunião"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar Reserva
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}