import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";

interface CustomCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function CustomCalendar({ selected, onSelect, disabled, className }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();

    const daysInMonth = lastDay.getDate();

    const days = [] as Array<Date | null>;

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    if (disabled && disabled(date)) return;
    onSelect?.(date);
  };

  const isDateSelected = (date: Date) => {
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  };

  const isDateDisabled = (date: Date) => {
    return disabled ? disabled(date) : false;
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Button type="button" variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h3 className="font-semibold text-center flex-1">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <Button type="button" variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="h-9 flex items-center justify-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="h-9 flex items-center justify-center">
            {date ? (
              <Button
                type="button"
                variant={isDateSelected(date) ? "default" : "ghost"}
                size="sm"
                className={`h-9 w-9 p-0 font-normal ${
                  isDateSelected(date) ? "bg-primary text-primary-foreground" : ""
                } ${
                  isDateDisabled(date)
                    ? "text-muted-foreground cursor-not-allowed opacity-50"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => handleDateClick(date)}
                disabled={isDateDisabled(date)}
              >
                {date.getDate()}
              </Button>
            ) : (
              <div className="h-9 w-9" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
