import { useState } from "react"; 
import { Users, UserCheck, UserX, Clock, Mail, Building, Shield, MoreVertical, Check, X, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Alert, AlertDescription } from "./ui/alert";
import { Input } from "./ui/input"; 
import { toast } from "sonner";
import { User } from "../types/nami";

interface UserManagementProps {
  currentUser: User;
  users: User[];
  onUserUpdate: (updatedUsers: User[]) => void;
}

export function UserManagement({ currentUser, users, onUserUpdate }: UserManagementProps) {

  const [userSearchTerm, setUserSearchTerm] = useState("");

  const searchTermLower = userSearchTerm.toLowerCase();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTermLower) ||
    user.email.toLowerCase().includes(searchTermLower) ||
    (user.department || '').toLowerCase().includes(searchTermLower)
  );
  
  const activeUsers = filteredUsers.filter(user => user.status === 'active');
  const pendingUsers = filteredUsers.filter(user => user.status === 'pending');
  const suspendedUsers = filteredUsers.filter(user => user.status === 'suspended');

  // As contagens totais devem ser baseadas na lista original, não na filtrada
  const totalActive = users.filter(u => u.status === 'active').length;
  const totalPending = users.filter(u => u.status === 'pending').length;
  const totalSuspended = users.filter(u => u.status === 'suspended').length;


  const getRoleBadge = (role: User['role']) => {
    const roleConfig: Record<User['role'], { label: string; className: string }> = {
      admin: { label: 'Administrador', className: 'bg-purple-100 text-purple-800' },
      coordinator: { label: 'Coordenador', className: 'bg-blue-100 text-blue-800' },
      professor: { label: 'Professor', className: 'bg-green-100 text-green-800' },
      staff: { label: 'Funcionário', className: 'bg-gray-100 text-gray-800' },
      editor: { label: 'Editor', className: 'bg-yellow-100 text-yellow-800' },
      viewer: { label: 'Visualizador', className: 'bg-teal-100 text-teal-800' },
    };
    
    const config = roleConfig[role];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-available text-available-foreground">Ativo</Badge>;
      case 'pending':
        return <Badge className="bg-occupied text-occupied-foreground">Pendente</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspenso</Badge>;
      default:
        return null;
    }
  };

  const handleApproveUser = (userId: string) => {
    const updated = users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' as const }
        : user
    );
    onUserUpdate(updated);
    
    const user = users.find(u => u.id === userId);
    toast.success(`Usuário ${user?.name} aprovado com sucesso!`);
  };

  const handleRejectUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const updated = users.filter(user => user.id !== userId);
    onUserUpdate(updated);
    
    toast.success(`Solicitação de ${user?.name} rejeitada.`);
  };

  const handleSuspendUser = (userId: string) => {
    if (userId === currentUser.id) {
      toast.error("Você não pode suspender sua própria conta!");
      return;
    }

    const updated = users.map(user => 
      user.id === userId 
        ? { ...user, status: 'suspended' as const }
        : user
    );
    onUserUpdate(updated);
    
    const user = users.find(u => u.id === userId);
    toast.success(`Usuário ${user?.name} foi suspenso.`);
  };

  const handleReactivateUser = (userId: string) => {
    const updated = users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' as const }
        : user
    );
    onUserUpdate(updated);
    
    const user = users.find(u => u.id === userId);
    toast.success(`Usuário ${user?.name} foi reativado.`);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      toast.error("Você não pode deletar sua própria conta!");
      return;
    }

    const user = users.find(u => u.id === userId);
    const updated = users.filter(user => user.id !== userId);
    onUserUpdate(updated);
    
    toast.success(`Usuário ${user?.name} foi removido permanentemente.`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const UserCard = ({ user, showActions = true }: { user: User, showActions?: boolean }) => (
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
            {showActions && user.id !== currentUser.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.status === 'active' && (
                    <DropdownMenuItem 
                      onClick={() => handleSuspendUser(user.id)}
                      className="text-orange-600"
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Suspender
                    </DropdownMenuItem>
                  )}
                  {user.status === 'suspended' && (
                    <DropdownMenuItem onClick={() => handleReactivateUser(user.id)}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Reativar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
            <span>
              {user.lastLogin 
                ? `Último acesso: ${formatDate(user.lastLogin)}`
                : 'Nunca acessou'
              }
            </span>
          </div>
        </div>

        {user.requestedBy && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Solicitado por:</strong> {user.requestedBy}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Data da solicitação: {formatDate(user.createdAt)}
            </p>
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
            <Button
              size="sm"
              onClick={() => handleApproveUser(user.id)}
              className="bg-green-600 hover:bg-green-700"
            >
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

  if (currentUser.role !== 'admin') {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Acesso restrito. Apenas administradores podem gerenciar usuários.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Gerenciamento de Usuários</h2>
        <p className="text-muted-foreground">
          Gerencie acessos e permissões dos usuários do sistema NAMI
        </p>
      </div>

      {/* Estatísticas */}
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
              <UserX className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Suspensos</p>
                <p className="text-2xl font-semibold">{totalSuspended}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
            <label htmlFor="user-search" className="font-semibold whitespace-nowrap">
                Buscar Usuário:
            </label>
            <Input
                id="user-search"
                placeholder="Por nome, e-mail ou área de trabalho"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
            />
        </CardContent>
      </Card>


      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Pendentes
            {totalPending > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 bg-orange-500 text-white text-xs">
                {totalPending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="suspended">Suspensos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-6">
          {totalPending === 0 && userSearchTerm.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma solicitação pendente</h3>
                <p className="text-muted-foreground">
                  Todas as solicitações de acesso foram processadas.
                </p>
              </CardContent>
            </Card>
          ) : pendingUsers.length === 0 && userSearchTerm.length > 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Nenhum usuário pendente encontrado com o termo "{userSearchTerm}".
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingUsers.map(user => (
                <PendingUserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-6">
           {activeUsers.length === 0 ? (
             <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                {userSearchTerm.length > 0
                  ? `Nenhum usuário ativo encontrado com o termo "${userSearchTerm}".`
                  : "Não há usuários ativos no sistema no momento."
                }
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="suspended" className="space-y-4 mt-6">
          {suspendedUsers.length === 0 ? (
             <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                 {userSearchTerm.length > 0
                  ? `Nenhum usuário suspenso encontrado com o termo "${userSearchTerm}".`
                  : "Não há usuários suspensos no sistema."
                }
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {suspendedUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}