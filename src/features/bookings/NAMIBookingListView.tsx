import { Calendar as CalendarIcon, Filter, Printer } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
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

  return (
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
          <div className="rounded-lg border shadow-sm">
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[960px]">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Data</TableHead>
                    <TableHead>Sala</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Tipo de atendimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado por</TableHead>
                    <TableHead>Observações</TableHead>
                    {canManage && <TableHead className="text-right">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.booking.id}>
                    <TableCell className="min-w-[160px]">
                      <div className="font-medium">{row.dateDisplay}</div>
                      <div className="text-xs text-muted-foreground capitalize">{row.weekdayDisplay}</div>
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="font-medium">{row.roomName}</div>
                      <div className="text-xs text-muted-foreground">Sala {row.roomNumber}</div>
                    </TableCell>
                    <TableCell className="min-w-[180px]">
                      <div className="font-medium">{row.timeRange}</div>
                      <div className="text-xs text-muted-foreground whitespace-normal break-words">
                        {row.timeSlotLabels || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      <div className="font-medium">{row.responsible || "-"}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.responsible ? "Responsável" : "Não informado"}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[180px]">
                      {row.serviceType ? (
                        <Badge variant="outline" className="font-normal">
                          {row.serviceType}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[120px]">{renderStatusBadge(row.status)}</TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="font-medium">{row.createdBy}</div>
                    </TableCell>
                    <TableCell className="max-w-[220px] align-top">
                      {row.notes ? (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed break-words">
                          {row.notes}
                        </p>
                      ) : (
                        <span className="text-xs text-muted-foreground">---</span>
                      )}
                    </TableCell>
                    {canManage && (
                      <TableCell className="min-w-[200px] text-right align-top">
                        <div className="flex justify-end flex-wrap gap-2 max-w-full">
                          {onViewDetails && (
                            <Button variant="outline" size="sm" onClick={() => onViewDetails(row.booking)}>
                              Ver
                            </Button>
                          )}
                          {onEditBooking && row.status === "confirmed" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onEditBooking(row.booking)}
                            >
                              Editar
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onCancelBooking(row.booking.id)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                </TableBody>
                <TableCaption>Use o scroll horizontal para visualizar todas as colunas quando necessário.</TableCaption>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
