import { useEffect, useMemo, useState } from "react";
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
import { api, ApiError, type ApiBooking, type ApiUser } from "./lib/api";

const mapUserFromApi = (user: ApiUser): User => ({
  ...user,
  createdAt: new Date(user.createdAt),
  lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
  approvedAt: user.approvedAt ? new Date(user.approvedAt) : undefined,
});

const mapBookingFromApi = (booking: ApiBooking): NAMIBooking => ({
  ...booking,
  date: new Date(booking.date),
  createdAt: new Date(booking.createdAt),
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
  const canManageBookings = authState.user?.role === "admin" || authState.user?.role === "editor";

  useEffect(() => {
    if (!authState.isAuthenticated) {
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      setIsDataLoading(true);
      try {
        const [monitoringsResponse, roomsResponse, bookingsResponse, usersResponse] = await Promise.all([
          api.getMonitorings(),
          api.getRooms(),
          api.getBookings(),
          api.getUsers(),
        ]);

        if (cancelled) return;

        setMonitorings(monitoringsResponse.monitorings);
        setRooms(roomsResponse.rooms);
        setBookings(bookingsResponse.bookings.map(mapBookingFromApi));
        setUsers(usersResponse.users.map(mapUserFromApi));
        setDataError(null);
      } catch (error) {
        if (cancelled) return;
        console.error("Erro ao carregar dados do backend", error);
        if (error instanceof ApiError) {
          setDataError(error.message);
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
  }, [authState.isAuthenticated]);

  const handleRoomBooking = (room: NAMIRoom) => {
    if (!canManageBookings) {
      toast.error("Acesso restrito", {
        description: "Somente administradores ou editores podem realizar reservas.",
      });
      return;
    }
    setSelectedRoom(room);
    setEditingBooking(null);
    setIsBookingModalOpen(true);
  };

  const handleEditBooking = (booking: NAMIBooking) => {
    if (!canManageBookings) {
      toast.error("Acesso restrito", {
        description: "Somente administradores ou editores podem editar reservas.",
      });
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
    
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleBookingSubmit = (bookingData: Omit<NAMIBooking, "id" | "status" | "createdAt">) => {
    if (!canManageBookings) {
      toast.error("Acesso restrito", {
        description: "Somente administradores ou editores podem confirmar reservas.",
      });
      return;
    }
    if (editingBooking) {
      const updatedBooking: NAMIBooking = {
        ...bookingData,
        id: editingBooking.id,
        status: "confirmed",
        createdAt: editingBooking.createdAt,
      };

      setBookings(prev => 
        prev.map(booking => 
          booking.id === editingBooking.id ? updatedBooking : booking
        )
      );
      
      addActivityLog(
        "Editar Reserva",
        `Reserva editada para ${bookingData.roomName} - ${bookingData.serviceType}`,
        `Sala ${bookingData.roomNumber}`
      );
      
      toast.success("Reserva atualizada com sucesso!", {
        description: `Sala ${bookingData.roomNumber} atualizada para ${bookingData.date.toLocaleDateString("pt-BR")}`,
      });
    } else {
      const newBooking: NAMIBooking = {
        ...bookingData,
        id: Date.now().toString(),
        status: "confirmed",
        createdAt: new Date(),
      };

      setBookings(prev => [...prev, newBooking]);
      
      addActivityLog(
        "Criar Reserva",
        `Reserva criada para ${bookingData.roomName} - ${bookingData.serviceType}`,
        `Sala ${bookingData.roomNumber}`
      );
      
      toast.success("Reserva confirmada com sucesso!", {
        description: `Sala ${bookingData.roomNumber} reservada para ${bookingData.date.toLocaleDateString("pt-BR")}`,
      });
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!canManageBookings) {
      toast.error("Acesso restrito", {
        description: "Somente administradores ou editores podem cancelar reservas.",
      });
      return;
    }
    const booking = bookings.find(b => b.id === bookingId);
    
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    
    if (booking) {
      addActivityLog(
        "Cancelar Reserva",
        `Reserva cancelada para ${booking.roomName} - ${booking.serviceType}`,
        `Sala ${booking.roomNumber}`
      );
    }
    
    toast.success("Reserva cancelada com sucesso!");
  };

  const handlePrintBookingReport = () => {
    addActivityLog(
      "Imprimir Relatório",
      "Relatório de reservas exportado para PDF",
      "Reservas"
    );
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
                  {filteredIndependentRooms.map((room) => (
                    <NAMIRoomCard
                      key={room.id}
                      room={room}
                      onBooking={handleRoomBooking}
                      currentBookings={bookings
                        .filter(booking => 
                          booking.roomId === room.id && 
                          booking.date.toDateString() === new Date().toDateString() &&
                          booking.status === 'confirmed'
                        )
                        .flatMap(booking => booking.timeSlots)
                      }
                    />
                  ))}
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
              canManage={canManageBookings}
              onPrint={bookings.length > 0 ? handlePrintBookingReport : undefined}
            />
          </div>
        )}

        {activeTab === "logs" && (
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