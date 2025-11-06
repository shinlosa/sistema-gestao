import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Header,
  LoginScreen,
  UserManagement,
  MonitoringSection,
  NAMIRoomCard,
  NAMIBookingModal,
  NAMIBookingList,
  ActivityLog,
  SearchInputCard,
} from "./features";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Alert, AlertDescription } from "./components/ui/alert";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { monitorings as fallbackMonitorings, namiRooms as fallbackRooms } from "./data/namiData";
import { users as fallbackUsers } from "./data/userData";
import { NAMIRoom, NAMIBooking, ActivityLog as ActivityLogType, User, AuthState, Monitoring } from "./types/nami";
import {
  api,
  ApiError,
  type ActivityLogsResponse,
  type ApiBooking,
  type ApiUser,
} from "./lib/api";

const parseBookingDate = (value: string): Date => {
  if (!value) {
    return new Date();
  }

  // Parse date in format YYYY-MM-DD or ISO string
  // Always create date at noon UTC to avoid timezone issues
  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (dateOnlyPattern.test(value)) {
    return new Date(value + 'T12:00:00.000Z');
  }

  return new Date(value);
};

const mapUserFromApi = (user: ApiUser): User => ({
  ...user,
  createdAt: new Date(user.createdAt),
  lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
  approvedAt: user.approvedAt ? new Date(user.approvedAt) : undefined,
});

const mapBookingFromApi = (booking: ApiBooking): NAMIBooking => ({
  ...booking,
  date: parseBookingDate(booking.date),
  createdAt: new Date(booking.createdAt),
});

const isActiveBooking = (booking: NAMIBooking) => booking.status !== "cancelled";
const shouldDisplayLog = (log: ActivityLogType) => log.action.toLowerCase() !== "login";
const mapActivityLogFromApi = (log: ActivityLogsResponse["logs"][number]): ActivityLogType => ({
  ...log,
  timestamp: new Date(log.timestamp),
});

export default function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
  });
  const [users, setUsers] = useState<User[]>(() => fallbackUsers.map((user) => ({ ...user })));
  const [monitorings, setMonitorings] = useState<Monitoring[]>(() =>
    fallbackMonitorings.map((monitoring) => ({
      ...monitoring,
      rooms: monitoring.rooms.map((room) => ({ ...room })),
    })),
  );
  const [rooms, setRooms] = useState<NAMIRoom[]>(() => fallbackRooms.map((room) => ({ ...room })));
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedRoom, setSelectedRoom] = useState<NAMIRoom | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<NAMIBooking | null>(null);
  const [bookings, setBookings] = useState<NAMIBooking[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [monitoringSearchTerm, setMonitoringSearchTerm] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const userRole = authState.user?.role ?? "leitor";
  const canCreateBookings = ["admin", "editor", "usuario"].includes(userRole);
  const canEditBookings = ["admin", "editor"].includes(userRole);
  // Only admins and editors can access activity logs
  const canAccessLogs = ["admin", "editor"].includes(userRole);

  const fetchBookings = useCallback(async () => {
    const res = await api.getBookings();
    return res.bookings.map(mapBookingFromApi).filter(isActiveBooking);
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    if (!canAccessLogs) return [] as ActivityLogType[];
    const res = await api.getActivityLogs();
    return res.logs.map(mapActivityLogFromApi).filter(shouldDisplayLog);
  }, [canAccessLogs]);

  const refreshBookings = useCallback(async () => {
    try {
      const nextBookings = await fetchBookings();
      setBookings(nextBookings);
    } catch (error) {
      console.error("Erro ao atualizar reservas", error);
    }
  }, [fetchBookings]);

  const refreshActivityLogs = useCallback(async () => {
    try {
      const logs = await fetchActivityLogs();
      setActivityLogs(logs);
    } catch (error) {
      console.error("Erro ao atualizar logs", error);
    }
  }, [fetchActivityLogs]);

  useEffect(() => {
    if (!canAccessLogs && activeTab === "logs") {
      setActiveTab("rooms");
    }
  }, [activeTab, canAccessLogs]);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      setIsDataLoading(true);
      try {
        // Sempre buscar monitoramentos, salas e reservas
        const [monitoringsResponse, roomsResponse, nextBookings] = await Promise.all([
          api.getMonitorings(),
          api.getRooms(),
          fetchBookings(),
        ]);

        if (cancelled) {
          return;
        }

        setMonitorings(monitoringsResponse.monitorings);
        setRooms(roomsResponse.rooms);
        setBookings(nextBookings);

        if (!cancelled && authState.user?.role === "admin") {
          try {
            const usersResponse = await api.getUsers();
            if (!cancelled) {
              setUsers(usersResponse.users.map(mapUserFromApi));
            }
          } catch (err) {
            if (!(err instanceof ApiError && err.status === 403)) {
              console.error("Erro ao obter usuários:", err);
            }
          }
        }

        if (!cancelled) {
          await refreshActivityLogs();
          setDataError(null);
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Erro ao carregar dados do backend", error);

        if (error instanceof ApiError) {
          setDataError(error.status === 403 ? null : error.message);
        } else {
          setDataError("Não foi possível carregar dados do servidor. Utilizando dados locais.");
        }
      } finally {
        if (!cancelled) {
          setIsDataLoading(false);
        }
      }
    };

    loadData().catch((error) => console.error("Falha inesperada ao carregar dados", error));

    return () => {
      cancelled = true;
    };
  }, [authState.isAuthenticated, authState.user?.role, fetchBookings, refreshActivityLogs]);

  // Eventos de atualização global pós-ação do admin
  useEffect(() => {
    const onRefreshBookings = () => {
      refreshBookings().catch(() => {});
    };
    const onRefreshLogs = () => {
      if (!canAccessLogs) return;
      refreshActivityLogs().catch(() => {});
    };

    window.addEventListener("nami:refresh-bookings", onRefreshBookings);
    if (canAccessLogs) {
      window.addEventListener("nami:refresh-logs", onRefreshLogs);
    }
    return () => {
      window.removeEventListener("nami:refresh-bookings", onRefreshBookings);
      window.removeEventListener("nami:refresh-logs", onRefreshLogs);
    };
  }, [canAccessLogs, refreshActivityLogs, refreshBookings]);

  const handleRoomBooking = (room: NAMIRoom) => {
    setSelectedRoom(room);
    setEditingBooking(null);
    setIsBookingModalOpen(true);
  };

  const handleEditBooking = (booking: NAMIBooking) => {
    if (!canEditBookings) {
      return;
    }
    const room = rooms.find((candidate) => candidate.id === booking.roomId);
    if (room) {
      setSelectedRoom(room);
      setEditingBooking(booking);
      setIsBookingModalOpen(true);
    }
  };

  const handleLogin = (user: User, token: string) => {
    setAuthState({
      isAuthenticated: true,
      user,
      token,
      loading: false,
    });
    localStorage.setItem("nami-auth-token", token);
    
    toast.success(`Bem-vindo(a), ${user.name}!`, {
      description: "Login realizado com sucesso.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("nami-auth-token");
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: undefined,
      loading: false,
    });
    
    setActiveTab("rooms");
    toast.success("Logout realizado com sucesso.");
  };

  const handleUserUpdate = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
  };

  const addActivityLog = (action: string, details: string, affectedResource?: string) => {
    const newLog: ActivityLogType = {
      id: Date.now().toString(),
      userId: authState.user?.id || "unknown",
      userName: authState.user?.name || "Usuário Desconhecido",
      action,
      details,
      timestamp: new Date(),
      affectedResource,
    };
    
    setActivityLogs((prev) => (shouldDisplayLog(newLog) ? [newLog, ...prev] : prev));
  };

  const handleBookingSubmit = async (bookingData: Omit<NAMIBooking, "id" | "status" | "createdAt">) => {
    if (editingBooking && !canEditBookings) return;
    if (!editingBooking && !canCreateBookings) return;

    try {
      if (editingBooking) {
        const res = await api.updateBooking(editingBooking.id, {
          roomId: bookingData.roomId,
          date: bookingData.date.toISOString(),
          timeSlots: bookingData.timeSlots,
          responsible: bookingData.responsible,
          serviceType: bookingData.serviceType,
          notes: bookingData.notes,
        });
        const updated = mapBookingFromApi(res.booking);
        setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        toast.success("Reserva atualizada com sucesso!", {
          description: `Sala ${updated.roomNumber} em ${updated.date.toLocaleDateString("pt-BR")}`,
        });
      } else {
        const res = await api.createBooking({
          roomId: bookingData.roomId,
          date: bookingData.date.toISOString(),
          timeSlots: bookingData.timeSlots,
          responsible: bookingData.responsible,
          serviceType: bookingData.serviceType,
          notes: bookingData.notes,
        });
        const created = mapBookingFromApi(res.booking);
        setBookings((prev) => [...prev, created]);
        toast.success("Reserva confirmada com sucesso!", {
          description: `Sala ${created.roomNumber} reservada para ${created.date.toLocaleDateString("pt-BR")}`,
        });
      }
      window.dispatchEvent(new Event("nami:refresh-logs"));
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Falha ao salvar a reserva");
      }
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!canEditBookings) return;
    try {
      await api.cancelBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Reserva cancelada com sucesso!");
      window.dispatchEvent(new Event("nami:refresh-logs"));
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Falha ao cancelar a reserva");
      }
    }
  };

  const handlePrintBookingReport = () => {
    addActivityLog("Imprimir Relatório", "Relatório de reservas exportado para PDF", "Reservas");
    window.print();
  };

  const independentRooms = useMemo(
    () => rooms.filter((room) => room.isIndependent),
    [rooms],
  );

  const filteredIndependentRooms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return independentRooms;
    return independentRooms.filter((room) =>
      room.name.toLowerCase().includes(query),
    );
  }, [independentRooms, searchTerm]);

  // Se não estiver autenticado, mostrar tela de login
  if (!authState.isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        currentUser={authState.user!}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isDataLoading && (
          <Alert className="mb-6 border-blue-200 bg-blue-50 text-blue-900">
            <AlertDescription>Sincronizando dados com o servidor...</AlertDescription>
          </Alert>
        )}

        {dataError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{dataError}</AlertDescription>
          </Alert>
        )}

        {activeTab === "rooms" && (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Sistema de Reservas NAMI</h2>
              <p className="text-muted-foreground">
                Gerencie as reservas das salas do curso de Nutrição
              </p>
            </div>

            <Tabs defaultValue="monitoring" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="monitoring">Por Monitoramento</TabsTrigger>
                <TabsTrigger value="independent">Salas Independentes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monitoring" className="pt-4 space-y-6">
                <SearchInputCard
                  id="monitoring-search"
                  label="Buscar:"
                  placeholder="Buscar sala de monitoramentos"
                  value={monitoringSearchTerm}
                  onValueChange={setMonitoringSearchTerm}
                />
                
                {monitorings.map((monitoring) => (
                  <MonitoringSection
                    key={monitoring.id}
                    monitoring={monitoring}
                    onRoomBooking={handleRoomBooking}
                    bookings={bookings}
                    searchTerm={monitoringSearchTerm}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="independent" className="pt-4 space-y-6">
                <SearchInputCard
                  id="independent-search"
                  label="Buscar:"
                  placeholder="Buscar sala independente"
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
              
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Salas Independentes</CardTitle>
                      <CardDescription>
                        Salas não vinculadas a monitoramentos específicos
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredIndependentRooms.map((room) => {
                    const today = new Date();
                    const todayDateString = today.toISOString().split('T')[0];
                    
                    return (
                      <NAMIRoomCard
                        key={room.id}
                        room={room}
                        onBooking={handleRoomBooking}
                        currentBookings={bookings
                          .filter(booking => {
                            const bookingDateString = booking.date.toISOString().split('T')[0];
                            return (
                              booking.roomId === room.id && 
                              bookingDateString === todayDateString &&
                              booking.status === 'confirmed'
                            );
                          })
                          .flatMap(booking => booking.timeSlots)
                        }
                      />
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Gerenciar Reservas</h2>
              <p className="text-muted-foreground">
                Visualize e gerencie todas as reservas do sistema
              </p>
            </div>
            
            <NAMIBookingList 
              bookings={bookings} 
              onCancelBooking={handleCancelBooking}
              onEditBooking={handleEditBooking}
              canManage={canEditBookings}
              onPrint={bookings.length > 0 ? handlePrintBookingReport : undefined}
            />
          </div>
        )}

  {canAccessLogs && activeTab === "logs" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Log de Atividades</h2>
              <p className="text-muted-foreground">
                Acompanhe todas as ações realizadas no sistema
              </p>
            </div>
            
            <ActivityLog logs={activityLogs} maxHeight="600px" />
          </div>
        )}

        {activeTab === "users" && authState.user && (
          <UserManagement 
            currentUser={authState.user}
            users={users}
            onUserUpdate={handleUserUpdate}
          />
        )}
      </main>

      <NAMIBookingModal
        room={selectedRoom}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedRoom(null);
          setEditingBooking(null);
        }}
        onSubmit={handleBookingSubmit}
        existingBookings={bookings}
        editingBooking={editingBooking}
        currentUser={authState.user}
        canManage={editingBooking ? canEditBookings : canCreateBookings}
      />

      <footer className="mt-16 border-t bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2025 NAMI - Núcleo de Atenção Médica Integrada
            </div>
            <div className="text-sm font-medium text-blue-700">
              Universidade de Fortaleza
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}