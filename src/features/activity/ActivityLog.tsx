import { Clock, User, Activity, Calendar, X, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ActivityLog as ActivityLogType } from "../../types/nami";

interface ActivityLogProps {
  logs: ActivityLogType[];
  maxHeight?: string;
}

export function ActivityLog({ logs, maxHeight = "400px" }: ActivityLogProps) {
  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "criar reserva":
      case "nova reserva":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "cancelar reserva":
      case "cancelamento":
        return <X className="h-4 w-4 text-red-600" />;
      case "editar reserva":
      case "modificação":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "login":
        return <User className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case "criar reserva":
      case "nova reserva":
        return <Badge variant="default" className="bg-green-100 text-green-800">Criação</Badge>;
      case "cancelar reserva":
      case "cancelamento":
        return <Badge variant="destructive">Cancelamento</Badge>;
      case "editar reserva":
      case "modificação":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Edição</Badge>;
      case "login":
        return <Badge variant="outline">Login</Badge>;
      default:
        return <Badge variant="outline">Sistema</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeRelative = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;

    return formatTime(date);
  };

  const sortedLogs = [...logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Log de Atividades
          </CardTitle>
          <CardDescription>Registro de todas as ações realizadas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma atividade registrada ainda</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Log de Atividades
        </CardTitle>
        <CardDescription>
          Registro de todas as ações realizadas no sistema ({logs.length} registros)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-4">
            {sortedLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">{getActionIcon(log.action)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{log.userName}</span>
                      {getActionBadge(log.action)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span title={formatTime(log.timestamp)}>{formatTimeRelative(log.timestamp)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    <strong>{log.action}:</strong> {log.details}
                  </p>

                  {log.affectedResource && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Recurso:</strong> {log.affectedResource}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
