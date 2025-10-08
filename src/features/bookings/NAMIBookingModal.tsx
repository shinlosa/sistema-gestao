import { useState, useEffect } from "react";
import { CalendarDays, Clock } from "lucide-react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { CustomCalendar } from "./CustomCalendar";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { NAMIRoom, NAMIBooking, TimeSlot } from "../../types/nami";
import { timeSlots } from "../../data/namiData";

interface NAMIBookingModalProps {
  room: NAMIRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: Omit<NAMIBooking, "id" | "status" | "createdAt">) => void;
  existingBookings?: NAMIBooking[];
  editingBooking?: NAMIBooking | null;
  currentUser?: { name: string } | null;
}

export function NAMIBookingModal({
  room,
  isOpen,
  onClose,
  onSubmit,
  existingBookings = [],
  editingBooking = null,
  currentUser = null,
}: NAMIBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [responsible, setResponsible] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editingBooking) {
      setSelectedDate(editingBooking.date);
      setSelectedTimeSlots(editingBooking.timeSlots);
      setResponsible(editingBooking.responsible);
      setServiceType(editingBooking.serviceType);
      setNotes(editingBooking.notes || "");
    } else if (room) {
      setSelectedDate(new Date());
      setSelectedTimeSlots([]);
      setResponsible(room.defaultResponsible || "");
      setServiceType("");
      setNotes("");
    }
  }, [room, editingBooking]);

  const getOccupiedSlots = (date: Date) => {
    return existingBookings
      .filter(
        (booking) =>
          booking.roomId === room?.id &&
          booking.date.toDateString() === date.toDateString() &&
          booking.status === "confirmed" &&
          (!editingBooking || booking.id !== editingBooking.id),
      )
      .flatMap((booking) => booking.timeSlots);
  };

  const handleTimeSlotChange = (slotId: string, checked: boolean) => {
    if (checked) {
      setSelectedTimeSlots((prev) => [...prev, slotId].sort());
    } else {
      setSelectedTimeSlots((prev) => prev.filter((id) => id !== slotId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || selectedTimeSlots.length === 0 || !responsible || !serviceType || !room) {
      return;
    }

    const booking: Omit<NAMIBooking, "id" | "status" | "createdAt"> = {
      roomId: room.id,
      roomNumber: room.number,
      roomName: room.name,
      date: selectedDate,
      timeSlots: selectedTimeSlots,
      responsible,
      serviceType,
      notes,
      createdBy: currentUser?.name || "Usuário Desconhecido",
    };

    onSubmit(booking);

    setSelectedTimeSlots([]);
    setResponsible(room.defaultResponsible || "");
    setServiceType("");
    setNotes("");
    setSelectedDate(new Date());
    onClose();
  };

  const occupiedSlots = selectedDate ? getOccupiedSlots(selectedDate) : [];

  const getTimeSlotLabel = (slot: TimeSlot) => {
    return `${slot.label} (${slot.start} - ${slot.end})`;
  };

  const formatSelectedSlots = () => {
    return selectedTimeSlots
      .map((id) => timeSlots.find((slot) => slot.id === id))
      .filter((slot) => slot)
      .map((slot) => slot!.label)
      .join(", ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto w-[98vw] sm:w-[96vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {editingBooking ? "Editar Reserva" : "Reservar"} {room?.name}
          </DialogTitle>
          <DialogDescription>Sala {room?.number} - Capacidade: {room?.capacity} pessoas</DialogDescription>
          {editingBooking && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm text-blue-800">
                <strong>Editando reserva:</strong> Você pode alterar a data, horários e demais informações desta reserva.
              </div>
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <div>
                <Label htmlFor="responsible">Professor/Responsável</Label>
                <Input
                  id="responsible"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  placeholder="Nome do responsável"
                  className="border-2 border-blue-200 focus:border-blue-500 bg-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="serviceType">Tipo de Atendimento</Label>
                <Input
                  id="serviceType"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="Ex: Atendimento de 1ª vez (Pcte A)"
                  className="border-2 border-blue-200 focus:border-blue-500 bg-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre a reserva"
                  className="border-2 border-blue-200 focus:border-blue-500 bg-white resize-none"
                  rows={3}
                />
              </div>

              {selectedTimeSlots.length > 0 && (
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-900">Resumo da Reserva:</h4>
                  <p className="text-sm text-blue-800">
                    <strong>Data:</strong> {selectedDate?.toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Horários:</strong> {formatSelectedSlots()}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Data da Reserva</Label>
                <div className="flex justify-center">
                  <div className="border-2 border-blue-200 rounded-lg bg-white w-full max-w-xl">
                    <CustomCalendar
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        date.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {selectedDate && (
                <div>
                  <Label className="mb-3 block">Horários Disponíveis</Label>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Período Matutino
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {timeSlots
                          .filter((slot) => slot.period === "morning")
                          .map((slot) => {
                            const isOccupied = occupiedSlots.includes(slot.id);
                            const isSelected = selectedTimeSlots.includes(slot.id);
                            const wasOriginallySelected = editingBooking?.timeSlots.includes(slot.id);

                            return (
                              <div
                                key={slot.id}
                                className={`flex items-center space-x-2 p-2 rounded border ${
                                  isOccupied
                                    ? "bg-destructive/10 border-destructive/20"
                                    : wasOriginallySelected && editingBooking
                                    ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                    : "hover:bg-muted/50"
                                }`}
                              >
                                <Checkbox
                                  id={slot.id}
                                  checked={isSelected}
                                  disabled={isOccupied}
                                  onCheckedChange={(checked: CheckedState) =>
                                    handleTimeSlotChange(slot.id, checked === true)
                                  }
                                />
                                <Label
                                  htmlFor={slot.id}
                                  className={`flex-1 text-sm ${isOccupied ? "text-muted-foreground line-through" : ""}`}
                                >
                                  {getTimeSlotLabel(slot)}
                                </Label>
                                {isOccupied && (
                                  <Badge variant="destructive" className="text-xs">
                                    Ocupado
                                  </Badge>
                                )}
                                {wasOriginallySelected && editingBooking && !isSelected && (
                                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                                    Original
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Período Vespertino
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {timeSlots
                          .filter((slot) => slot.period === "afternoon")
                          .map((slot) => {
                            const isOccupied = occupiedSlots.includes(slot.id);
                            const isSelected = selectedTimeSlots.includes(slot.id);
                            const wasOriginallySelected = editingBooking?.timeSlots.includes(slot.id);

                            return (
                              <div
                                key={slot.id}
                                className={`flex items-center space-x-2 p-2 rounded border ${
                                  isOccupied
                                    ? "bg-destructive/10 border-destructive/20"
                                    : wasOriginallySelected && editingBooking
                                    ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                    : "hover:bg-muted/50"
                                }`}
                              >
                                <Checkbox
                                  id={slot.id}
                                  checked={isSelected}
                                  disabled={isOccupied}
                                  onCheckedChange={(checked: CheckedState) =>
                                    handleTimeSlotChange(slot.id, checked === true)
                                  }
                                />
                                <Label
                                  htmlFor={slot.id}
                                  className={`flex-1 text-sm ${isOccupied ? "text-muted-foreground line-through" : ""}`}
                                >
                                  {getTimeSlotLabel(slot)}
                                </Label>
                                {isOccupied && (
                                  <Badge variant="destructive" className="text-xs">
                                    Ocupado
                                  </Badge>
                                )}
                                {wasOriginallySelected && editingBooking && !isSelected && (
                                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                                    Original
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} size="lg">
              Cancelar
            </Button>
            <Button type="submit" disabled={selectedTimeSlots.length === 0} size="lg">
              {editingBooking ? "Atualizar Reserva" : "Confirmar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
