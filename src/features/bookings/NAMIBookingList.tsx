import { useMemo, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { NAMIBookingListView, type NAMIBookingListRow } from "./NAMIBookingListView";
import { NAMIBooking, TimeSlot } from "../../types/nami";
import { timeSlots } from "../../data/namiData";
import { ALL_FILTER_VALUE } from "./constants";

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

const getFirstSlotStart = (booking: NAMIBooking) => {
  const slots = booking.timeSlots
    .map((id) => timeSlots.find((slot) => slot.id === id))
    .filter(Boolean) as TimeSlot[];

  if (slots.length === 0) return "24:00";

  return slots.reduce((earliest, slot) => (slot.start < earliest ? slot.start : earliest), slots[0].start);
};

interface NAMIBookingListProps {
  bookings: NAMIBooking[];
  onCancelBooking: (bookingId: string) => void;
  onEditBooking?: (booking: NAMIBooking) => void;
  onViewDetails?: (booking: NAMIBooking) => void;
  canManage?: boolean;
}

export function NAMIBookingList({ bookings, onCancelBooking, onEditBooking, onViewDetails, canManage = true }: NAMIBookingListProps) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [responsibleFilter, setResponsibleFilter] = useState<string>(ALL_FILTER_VALUE);
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>(ALL_FILTER_VALUE);

  const hasActiveFilters =
    !!startDate ||
    !!endDate ||
    responsibleFilter !== ALL_FILTER_VALUE ||
    serviceTypeFilter !== ALL_FILTER_VALUE;

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

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const bookingDate = ensureDate(booking.date);

        const matchDate = (() => {
          const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());

          const start = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) : null;
          const end = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) : null;

          if (start && bookingDay < start) return false;
          if (end && bookingDay > end) return false;
          return true;
        })();

        const matchResponsible =
          responsibleFilter === ALL_FILTER_VALUE || booking.responsible === responsibleFilter;
        const matchServiceType =
          serviceTypeFilter === ALL_FILTER_VALUE || booking.serviceType === serviceTypeFilter;

        return matchDate && matchResponsible && matchServiceType;
      }),
    [bookings, startDate, endDate, responsibleFilter, serviceTypeFilter],
  );

  const sortedBookings = useMemo(
    () =>
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
    [filteredBookings],
  );

  const rows = useMemo<NAMIBookingListRow[]>(
    () =>
      sortedBookings.map((booking) => {
        const date = ensureDate(booking.date);
        return {
          booking,
          dateDisplay: formatDateDisplay(date),
          weekdayDisplay: formatWeekday(date),
          roomName: booking.roomName,
          roomNumber: booking.roomNumber,
          timeRange: getTimeRange(booking.timeSlots),
          timeSlotLabels: formatSlotLabels(booking.timeSlots),
          responsible: booking.responsible,
          serviceType: booking.serviceType,
          status: booking.status,
          createdBy: booking.createdBy,
          notes: booking.notes,
        };
      }),
    [sortedBookings],
  );

  const totalCount = bookings.length;
  const filteredCount = sortedBookings.length;

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setResponsibleFilter(ALL_FILTER_VALUE);
    setServiceTypeFilter(ALL_FILTER_VALUE);
  };

  if (totalCount === 0) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma reserva encontrada</h3>
        <p className="text-muted-foreground">Ainda não há reservas no sistema.</p>
      </div>
    );
  }

  return (
    <NAMIBookingListView
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      responsibleFilter={responsibleFilter}
      onResponsibleFilterChange={setResponsibleFilter}
      serviceTypeFilter={serviceTypeFilter}
      onServiceTypeFilterChange={setServiceTypeFilter}
      responsibleOptions={responsibleOptions}
      serviceTypeOptions={serviceTypeOptions}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
      filteredCount={filteredCount}
      totalCount={totalCount}
      rows={rows}
      onCancelBooking={onCancelBooking}
      onEditBooking={onEditBooking}
      onViewDetails={onViewDetails}
      canManage={canManage}
    />
  );
}
