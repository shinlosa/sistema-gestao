import { Calendar as CalendarIcon, Filter, Printer, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { NAMIBooking } from "../../types/nami";
import { CustomCalendar } from "./CustomCalendar";
import { ALL_FILTER_VALUE } from "./constants";

export interface NAMIBookingListRow {
  booking: NAMIBooking;
  dateDisplay: string;
  weekdayDisplay: string;
  roomName: string;
  roomNumber: number;
  timeRange: string;
  timeSlotLabels: string;
  responsible?: string;
  serviceType?: string;
  status: NAMIBooking["status"];
  createdBy: string;
  notes?: string | null;
}

interface NAMIBookingListViewProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  responsibleFilter: string;
  onResponsibleFilterChange: (value: string) => void;
  serviceTypeFilter: string;
  onServiceTypeFilterChange: (value: string) => void;
  responsibleOptions: string[];
  serviceTypeOptions: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  filteredCount: number;
  totalCount: number;
  rows: NAMIBookingListRow[];
  onCancelBooking: (id: string) => void;
  onEditBooking?: (booking: NAMIBooking) => void;
  onViewDetails?: (booking: NAMIBooking) => void;
  canManage: boolean;
  onPrint?: () => void;
}

const formatDateForButton = (date?: Date) =>
  date?.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) ?? null;

const renderStatusBadge = (status: NAMIBooking["status"]) => {
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

export function NAMIBookingListView({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  responsibleFilter,
  onResponsibleFilterChange,
  serviceTypeFilter,
  onServiceTypeFilterChange,
  responsibleOptions,
  serviceTypeOptions,
  hasActiveFilters,
  onClearFilters,
  filteredCount,
  totalCount,
  rows,
  onCancelBooking,
  onEditBooking,
  onViewDetails,
  canManage,
  onPrint,
}: NAMIBookingListViewProps) {
  const showPrintButton = Boolean(onPrint && filteredCount > 0);
  const filterGridClasses = showPrintButton
    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
    : "grid gap-4 sm:grid-cols-2 lg:grid-cols-5";

  // state for showing full observation text
  const [openNote, setOpenNote] = useState<string | null>(null);

  const compactTimeSlotLabels = (labels?: string) => {
    if (!labels) return "-";
    return labels
      .split(",")
      .map((s) => s.trim())
      .map((part) => part.replace(/^Manhã\s+/i, "M.").replace(/^Tarde\s+/i, "T."))
      .join(", ");
  };

  const openObservation = (text?: string) => {
    if (!text) return;
    setOpenNote(text);
  };

  const closeObservation = () => setOpenNote(null);

  return (
    <>
    <Card className="shadow-sm border">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-blue-100 p-2 text-blue-700">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Visão em planilha das reservas</CardTitle>
            <CardDescription>
              Visualize todos os agendamentos em uma grade ampla e refine pelas informações chave.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className={filterGridClasses}>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground tracking-wide">Data início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? formatDateForButton(startDate) : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CustomCalendar selected={startDate} onSelect={onStartDateChange} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground tracking-wide">Data fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? formatDateForButton(endDate) : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CustomCalendar selected={endDate} onSelect={onEndDateChange} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground tracking-wide">Professor / Responsável</Label>
            <Select value={responsibleFilter} onValueChange={onResponsibleFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>Todos os responsáveis</SelectItem>
                {responsibleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground tracking-wide">Tipo de atendimento</Label>
            <Select value={serviceTypeFilter} onValueChange={onServiceTypeFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>Todos os tipos</SelectItem>
                {serviceTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant={hasActiveFilters ? "outline" : "ghost"}
              className="w-full"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
            >
              Limpar filtros
            </Button>
          </div>

          {showPrintButton && (
            <div className="flex items-end justify-end sm:col-span-2 lg:col-span-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="ml-auto"
                onClick={onPrint}
                title="Imprimir relatório em PDF"
              >
                <Printer className="h-4 w-4" />
                <span className="sr-only">Imprimir relatório em PDF</span>
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Badge variant="secondary" className="text-sm font-medium">
            Mostrando {filteredCount} de {totalCount} reservas
          </Badge>
          {hasActiveFilters && <span className="text-xs text-muted-foreground">Filtros ativos aplicados ao resultado.</span>}
        </div>

        {filteredCount === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">Nenhuma reserva encontrada</h3>
            <p className="text-sm text-muted-foreground">Ajuste os filtros para visualizar outros resultados.</p>
          </div>
        ) : (
          <div className="rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-sm border-collapse">
                <colgroup>
                  <col style={{ width: "140px" }} />
                  <col style={{ width: "120px" }} />
                  <col style={{ width: "180px" }} />
                  <col style={{ width: "180px" }} />
                  <col style={{ width: "160px" }} />
                  <col style={{ width: "120px" }} />
                  <col style={{ width: "160px" }} />
                  <col style={{ width: "260px" }} />
                  {canManage && <col style={{ width: "80px" }} />}
                </colgroup>
                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Data</th>
                    <th className="px-4 py-3 text-left font-medium">Sala</th>
                    <th className="px-4 py-3 text-left font-medium">Horário</th>
                    <th className="px-4 py-3 text-left font-medium">Responsável</th>
                    <th className="px-4 py-3 text-left font-medium">Tipo de atendimento</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Criado por</th>
                    <th className="px-4 py-3 text-left font-medium">Observações</th>
                    {canManage && (
                      <th className="px-4 py-3 text-right font-medium sticky right-0 bg-muted/60">Ações</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-background text-foreground">
                  {rows.map((row) => (
                    <tr key={row.booking.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium leading-tight truncate">{row.dateDisplay}</div>
                        <div className="text-xs text-muted-foreground capitalize truncate">{row.weekdayDisplay}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium leading-tight truncate">{row.roomName}</div>
                        <div className="text-xs text-muted-foreground truncate">Sala {row.roomNumber}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium leading-tight truncate">{row.timeRange}</div>
                        <div className="text-xs text-muted-foreground truncate">{compactTimeSlotLabels(row.timeSlotLabels)}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium leading-tight truncate">{row.responsible || "-"}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {row.responsible ? "Responsável" : "Não informado"}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        {row.serviceType ? (
                          <Badge variant="outline" className="font-normal whitespace-normal">
                            {row.serviceType}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Não informado</span>
                        )}
                      </td>
                      <td className="px-4 py-4 align-top whitespace-nowrap">{renderStatusBadge(row.status)}</td>
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium leading-tight truncate">{row.createdBy}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        {row.notes ? (
                          <button
                            type="button"
                            onClick={() => openObservation(row.notes || undefined)}
                            className="text-left text-sm text-muted-foreground line-clamp-2 leading-relaxed hover:underline"
                            aria-label={`Mostrar observação completa para reserva ${row.booking.id}`}
                          >
                            {row.notes}
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">---</span>
                        )}
                      </td>
                      {canManage && (
                        <td className="px-3 py-4 align-top text-right sticky right-0 bg-background border-l border-border">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="p-2">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onViewDetails && (
                                <DropdownMenuItem onSelect={() => onViewDetails(row.booking)}>
                                  <Eye className="mr-2 h-4 w-4" /> Ver
                                </DropdownMenuItem>
                              )}
                              {onEditBooking && row.status === "confirmed" && (
                                <DropdownMenuItem onSelect={() => onEditBooking(row.booking)}>
                                  <Edit className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onSelect={() => onCancelBooking(row.booking.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Cancelar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
              Use o scroll horizontal para visualizar todas as colunas quando necessário.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    <Dialog open={Boolean(openNote)} onOpenChange={closeObservation}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Observação</DialogTitle>
          <DialogDescription>Visualização completa da observação da reserva.</DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">{openNote}</p>
        </div>
      </DialogContent>
    </Dialog>
    </>
    );
}
