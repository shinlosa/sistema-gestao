import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  Clock,
  Mail,
  Building,
  Shield,
  MoreVertical,
  Check,
  X,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { toast } from "sonner";
import { RevisionRequest, User } from "../../types/nami";
import { SearchInputCard } from "../shared/SearchInputCard";
import { ROLE_DISPLAY_CONFIG, roleSelectOptions } from "../../data/roleConfig";
import { api } from "../../lib/api";

interface UserManagementProps {
  currentUser: User;
  users: User[];
  onUserUpdate: (updatedUsers: User[]) => void;
}

export function UserManagement({ currentUser, users, onUserUpdate }: UserManagementProps) {
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [revisionRequests, setRevisionRequests] = useState<RevisionRequest[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);

  const searchTermLower = userSearchTerm.trim().toLowerCase();

  const filteredUsers = useMemo(() => {
    if (!searchTermLower) {
      return users;
    }

    return users.filter((user) => {
      const department = user.department ?? "";
      return (
        user.name.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower) ||
        department.toLowerCase().includes(searchTermLower)
      );
    });
  }, [users, searchTermLower]);

  const { activeUsers, pendingUsers, suspendedUsers } = useMemo(() => {
    const active: User[] = [];
    const pending: User[] = [];
    const suspended: User[] = [];

    filteredUsers.forEach((user) => {
      switch (user.status) {
        case "active":
          active.push(user);
          break;
        case "pending":
          pending.push(user);
          break;
        case "suspended":
          suspended.push(user);
          break;
      }
    });

    return { activeUsers: active, pendingUsers: pending, suspendedUsers: suspended };
  }, [filteredUsers]);

  const { totalActive, totalPending } = useMemo(() => {
    let active = 0;
    let pending = 0;

    users.forEach((user) => {
      switch (user.status) {
        case "active":
          active += 1;
          break;
        case "pending":
          pending += 1;
          break;
      }
    });

    return { totalActive: active, totalPending: pending };
  }, [users]);

  const totalOpenRevisions = useMemo(() => revisionRequests.filter((r) => r.status === "open").length, [revisionRequests]);

  const getRoleBadge = (role: User["role"]) => {
    const config = ROLE_DISPLAY_CONFIG[role];
    return <Badge className={config.badgeClass}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-available text-available-foreground">Ativo</Badge>;
      case "pending":
        return <Badge className="bg-occupied text-occupied-foreground">Pendente</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspenso</Badge>;
      default:
        return null;
    }
  };

  const handleApproveUser = (userId: string) => {
    const updated = users.map((user) => (user.id === userId ? { ...user, status: "active" as const } : user));
    onUserUpdate(updated);

    const user = users.find((u) => u.id === userId);
    toast.success(`Usuário ${user?.name} aprovado com sucesso!`);
  };

  const handleRejectUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    const updated = users.filter((user) => user.id !== userId);
    onUserUpdate(updated);

    toast.success(`Solicitação de ${user?.name} rejeitada.`);
  };

  // Revisões: carregar e ações
  useEffect(() => {
    const loadRevisions = async () => {
      setLoadingRevisions(true);
      try {
        const res = await api.getRevisionRequests();
        const mapped: RevisionRequest[] = res.revisionRequests.map((r) => ({
          ...r,
          date: new Date(r.date),
          createdAt: new Date(r.createdAt),
        }));
        setRevisionRequests(mapped);
      } catch (e) {
        toast.error("Falha ao carregar solicitações de revisão");
      } finally {
        setLoadingRevisions(false);
      }
    };
    loadRevisions();
  }, []);

  const handleApproveRevision = async (id: string) => {
    try {
      await api.approveRevisionRequest(id);
      setRevisionRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
      toast.success("Solicitação aprovada");
      // Notificar a aplicação para recarregar reservas
      window.dispatchEvent(new CustomEvent("nami:refresh-bookings"));
    } catch (e) {
      toast.error("Não foi possível aprovar a revisão");
    }
  };

  const handleRejectRevision = async (id: string) => {
    try {
      await api.rejectRevisionRequest(id);
      setRevisionRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
      toast.success("Solicitação rejeitada");
      // Atualiza logs na aplicação (opcional)
      window.dispatchEvent(new CustomEvent("nami:refresh-logs"));
    } catch (e) {
      toast.error("Não foi possível rejeitar a revisão");
    }
  };

  const handleChangeRole = (userId: string, newRole: User["role"]) => {
    const updated = users.map((user) => (user.id === userId ? { ...user, role: newRole } : user));
    onUserUpdate(updated);

    const user = users.find((u) => u.id === userId);
    toast.success(`Função de ${user?.name} alterada com sucesso!`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const UserCard = ({ user, showActions = true }: { user: User; showActions?: boolean }) => (
    <Card key={user.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(user.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            {showActions && user.id !== currentUser.id ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer">
                    {getRoleBadge(user.role)}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {roleSelectOptions.map((option) => {
                    const config = ROLE_DISPLAY_CONFIG[option.value];
                    const isCurrentRole = option.value === user.role;
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleChangeRole(user.id, option.value)}
                        disabled={isCurrentRole}
                        className={isCurrentRole ? "opacity-60" : undefined}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${config.dotClass}`} />
                          {config.label}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              getRoleBadge(user.role)
            )}
          </div>
          {user.department && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{user.department}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{user.lastLogin ? `Último acesso: ${formatDate(user.lastLogin)}` : "Nunca acessou"}</span>
          </div>
        </div>

        {user.requestedBy && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Solicitado por:</strong> {user.requestedBy}
            </p>
            <p className="text-xs text-blue-600 mt-1">Data da solicitação: {formatDate(user.createdAt)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const PendingUserCard = ({ user }: { user: User }) => (
    <Card key={user.id} className="border-orange-200 bg-orange-50/50">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRejectUser(user.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Rejeitar
            </Button>
            <Button size="sm" onClick={() => handleApproveUser(user.id)} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-1" />
              Aprovar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            {getRoleBadge(user.role)}
          </div>
          {user.department && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{user.department}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Solicitado em: {formatDate(user.createdAt)}</span>
          </div>
        </div>

        {user.requestedBy && (
          <div className="mt-3 p-3 bg-orange-100 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Solicitado por:</strong> {user.requestedBy}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (currentUser.role !== "admin") {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Acesso restrito. Apenas administradores podem gerenciar usuários.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Gerenciamento de Usuários</h2>
        <p className="text-muted-foreground">Gerencie acessos e permissões dos usuários do sistema NAMI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-semibold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-2xl font-semibold">{totalActive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-semibold">{totalPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Revisões Abertas</p>
                <p className="text-2xl font-semibold">{totalOpenRevisions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SearchInputCard
        id="user-search"
        label="Buscar Usuário:"
        placeholder="Por nome, e-mail ou área de trabalho"
        value={userSearchTerm}
        onValueChange={setUserSearchTerm}
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Pendentes
            {totalPending > 0 && <Badge className="ml-2 h-5 w-5 p-0 bg-orange-500 text-white text-xs">{totalPending}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="revisoes" className="relative">
            Revisões
            {totalOpenRevisions > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 bg-purple-600 text-white text-xs">{totalOpenRevisions}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {totalPending === 0 && userSearchTerm.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-4">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold">Nenhuma solicitação pendente</h3>
                <p className="text-muted-foreground mt-2">
                  Assim que um novo usuário solicitar acesso, ele aparecerá automaticamente nesta aba.
                </p>
              </CardContent>
            </Card>
          ) : pendingUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>Nenhum usuário encontrado para o termo de busca.</p>
              </CardContent>
            </Card>
          ) : (
            pendingUsers.map((user) => <PendingUserCard key={user.id} user={user} />)
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>Nenhum usuário ativo encontrado para o termo de busca.</p>
              </CardContent>
            </Card>
          ) : (
            activeUsers.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </TabsContent>

        <TabsContent value="revisoes" className="space-y-4 mt-6">
          {loadingRevisions ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>Carregando solicitações de revisão...</p>
              </CardContent>
            </Card>
          ) : totalOpenRevisions === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                  <ClipboardList className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold">Nenhuma revisão pendente</h3>
                <p className="text-muted-foreground mt-2">As solicitações de revisão aparecerão aqui para aprovação.</p>
              </CardContent>
            </Card>
          ) : (
            revisionRequests
              .filter((r) => r.status === "open")
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((req) => (
                <Card key={req.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-full">
                          {req.roomNumber}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Sala {req.roomNumber} • {req.roomName}</h3>
                          <p className="text-sm text-muted-foreground">{req.serviceType} — {req.responsible}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-600">Revisão</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {req.date.toLocaleDateString("pt-BR")} • {req.timeSlots.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>Solicitante: {req.requestedByName}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-md bg-purple-50 text-purple-900">
                      <p className="text-sm">
                        <strong>Justificativa:</strong> {req.justification}
                      </p>
                      <p className="text-xs text-purple-700 mt-1">
                        Solicitado em {req.createdAt.toLocaleString("pt-BR")}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectRevision(req.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                      <Button size="sm" onClick={() => handleApproveRevision(req.id)} className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
