import { useState, useEffect, useMemo } from "react";
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
import { NAMIRoom, NAMIBooking, TimeSlot, User } from "../../types/nami";
import { RevisionRequestModal } from "./RevisionRequestModal";
import { api } from "../../lib/api";
import { timeSlots } from "../../data/namiData";
import { toast } from "sonner";

interface NAMIBookingModalProps {
  room: NAMIRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: Omit<NAMIBooking, "id" | "status" | "createdAt">) => void;
  existingBookings?: NAMIBooking[];
  editingBooking?: NAMIBooking | null;
  currentUser?: Pick<User, "id" | "name" | "role"> | null;
  canManage?: boolean;
}

export function NAMIBookingModal({
  room,
  isOpen,
  onClose,
  onSubmit,
  existingBookings = [],
  editingBooking = null,
  currentUser = null,
  canManage = false,
}: NAMIBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [responsible, setResponsible] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [notes, setNotes] = useState("");
  const [revisionOpen, setRevisionOpen] = useState(false);

  const isReadOnly = !canManage;
  const isUsuario = currentUser?.role === "usuario";

  useEffect(() => {
    if (editingBooking) {
      setSelectedDate(new Date(editingBooking.date));
      setSelectedTimeSlots([...editingBooking.timeSlots].sort());
      setResponsible(editingBooking.responsible);
      setServiceType(editingBooking.serviceType);
      setNotes(editingBooking.notes ?? "");
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
    // Permite que 'usuario' selecione horários (inclusive ocupados) para solicitar revisão
    if (isReadOnly && !isUsuario) {
      return;
    }

    if (checked) {
      setSelectedTimeSlots((prev) => [...prev, slotId].sort());
    } else {
      setSelectedTimeSlots((prev) => prev.filter((id) => id !== slotId));
    }
  };

  const normalizedSelectedSlots = useMemo(() => [...selectedTimeSlots].sort(), [selectedTimeSlots]);

  const originalBookingSnapshot = useMemo(() => {
    if (!editingBooking) {
      return null;
    }

    return {
      dateString: editingBooking.date.toDateString(),
      timeSlots: [...editingBooking.timeSlots].sort(),
      responsible: editingBooking.responsible,
      serviceType: editingBooking.serviceType,
      notes: editingBooking.notes ?? "",
    };
  }, [editingBooking]);

  const hasChanges = useMemo(() => {
    if (!editingBooking || !originalBookingSnapshot) {
      return true;
    }

    const dateChanged = selectedDate ? selectedDate.toDateString() !== originalBookingSnapshot.dateString : true;

    const slotsChanged = (() => {
      const originalSlots = originalBookingSnapshot.timeSlots;
      if (originalSlots.length !== normalizedSelectedSlots.length) {
        return true;
      }

      return originalSlots.some((slot, index) => slot !== normalizedSelectedSlots[index]);
    })();

    const responsibleChanged = responsible !== originalBookingSnapshot.responsible;
    const serviceTypeChanged = serviceType !== originalBookingSnapshot.serviceType;
    const notesChanged = notes !== originalBookingSnapshot.notes;

    return dateChanged || slotsChanged || responsibleChanged || serviceTypeChanged || notesChanged;
  }, [editingBooking, normalizedSelectedSlots, originalBookingSnapshot, notes, responsible, selectedDate, serviceType]);

  const isFormValid = useMemo(() => {
    if (!room || !selectedDate) {
      return false;
    }

    if (normalizedSelectedSlots.length === 0) {
      return false;
    }

    if (!responsible.trim()) {
      return false;
    }

    if (!serviceType.trim()) {
      return false;
    }

    return true;
  }, [normalizedSelectedSlots, responsible, room, selectedDate, serviceType]);

  const canSubmit = canManage && isFormValid && (!editingBooking || hasChanges);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit || !room || !selectedDate) {
      return;
    }

    const booking: Omit<NAMIBooking, "id" | "status" | "createdAt"> = {
      roomId: room.id,
      roomNumber: room.number,
      roomName: room.name,
      date: selectedDate,
      timeSlots: normalizedSelectedSlots,
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
  const hasConflict = occupiedSlots.some((s) => normalizedSelectedSlots.includes(s));

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

  const handleSendRevision = async (justification: string) => {
    if (!room || !selectedDate || !currentUser) return;
    try {
      await api.createRevisionRequest({
        roomId: room.id,
        roomNumber: room.number,
        roomName: room.name,
        date: selectedDate.toISOString(),
        timeSlots: normalizedSelectedSlots,
        responsible,
        serviceType,
        justification,
      });
      toast.success("Solicitação de revisão enviada");
      setRevisionOpen(false);
      // Mantém o modal principal aberto para o usuário continuar navegando, mas podemos limpar seleção
      // Limpar somente os horários para evitar múltiplos envios acidentais
      setSelectedTimeSlots([]);
    } catch (e) {
      toast.error("Não foi possível enviar a revisão");
    }
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
                  disabled={isReadOnly && !isUsuario}
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
                  disabled={isReadOnly && !isUsuario}
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
                  disabled={isReadOnly && !isUsuario}
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
                                  disabled={(isOccupied && !isUsuario) || (isReadOnly && !isUsuario)}
                                  onCheckedChange={(checked: CheckedState) =>
                                    handleTimeSlotChange(slot.id, checked === true)
                                  }
                                />
                                <Label
                                  htmlFor={slot.id}
                                  className={`flex-1 text-sm ${isOccupied ? "text-muted-foreground" : ""}`}
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
                                  disabled={(isOccupied && !isUsuario) || (isReadOnly && !isUsuario)}
                                  onCheckedChange={(checked: CheckedState) =>
                                    handleTimeSlotChange(slot.id, checked === true)
                                  }
                                />
                                <Label
                                  htmlFor={slot.id}
                                  className={`flex-1 text-sm ${isOccupied ? "text-muted-foreground" : ""}`}
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

          <div className="flex justify-between sm:justify-end gap-4 pt-6 border-t flex-wrap">
            {isReadOnly && !isUsuario && (
              <div className="text-sm text-muted-foreground">
                Você possui acesso somente para consulta. Apenas administradores ou editores podem confirmar reservas.
              </div>
            )}
            {isUsuario && (
              <div className="text-sm text-muted-foreground">
                Selecione horários ocupados para solicitar revisão desta reserva.
              </div>
            )}
            <Button type="button" variant="outline" onClick={onClose} size="lg">
              Cancelar
            </Button>
            {isUsuario && hasConflict && (
              <Button type="button" variant="secondary" onClick={() => setRevisionOpen(true)} size="lg">
                Solicitar revisão de reserva
              </Button>
            )}
            {(!isUsuario || (isUsuario && !hasConflict)) && (
              <Button type="submit" disabled={!canSubmit || (isUsuario && hasConflict)} size="lg">
                {editingBooking
                  ? "Atualizar Reserva"
                  : canManage
                  ? "Confirmar Reserva"
                  : "Somente consulta"}
              </Button>
            )}
          </div>
        </form>
      <RevisionRequestModal
        open={revisionOpen}
        onClose={() => setRevisionOpen(false)}
        onSubmit={handleSendRevision}
        defaultSummary={`${room?.name} • ${selectedDate?.toLocaleDateString("pt-BR")} • ${formatSelectedSlots()}`}
      />
      </DialogContent>
    </Dialog>
  );
}
