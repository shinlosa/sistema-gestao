import { useState } from "react";
import { Header } from "./components/Header";
import { LoginScreen } from "./components/LoginScreen";
import { UserManagement } from "./components/UserManagement";
import { MonitoringSection } from "./components/MonitoringSection";
import { NAMIRoomCard } from "./components/NAMIRoomCard";
import { NAMIBookingModal } from "./components/NAMIBookingModal";
import { NAMIBookingList } from "./components/NAMIBookingList";
import { ActivityLog } from "./components/ActivityLog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { monitorings, namiRooms } from "./data/namiData";
import { users as initialUsers } from "./data/userData";
import { NAMIRoom, NAMIBooking, ActivityLog as ActivityLogType, User, AuthState } from "./types/nami";

export default function App() {
  // Estados de autenticação
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
  });
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Estados da aplicação
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedRoom, setSelectedRoom] = useState<NAMIRoom | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<NAMIBooking | null>(null);
  const [bookings, setBookings] = useState<NAMIBooking[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogType[]>([
    {
      id: "1",
      userId: "coord1",
      userName: "Coordenadora Nutrição",
      action: "Login",
      details: "Acesso ao sistema realizado com sucesso",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
    },
    {
      id: "2",
      userId: "prof1",
      userName: "Profa. Lorrainy",
      action: "Criar Reserva",
      details: "Reserva criada para Sala 1 - Atendimento de 1ª vez",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
      affectedResource: "Sala 1",
    },
  ]);

  const handleRoomBooking = (room: NAMIRoom) => {
    setSelectedRoom(room);
    setEditingBooking(null);
    setIsBookingModalOpen(true);
  };

  const handleEditBooking = (booking: NAMIBooking) => {
    const room = namiRooms.find(r => r.id === booking.roomId);
    if (room) {
      setSelectedRoom(room);
      setEditingBooking(booking);
      setIsBookingModalOpen(true);
    }
  };

  // Funções de autenticação
  const handleLogin = (user: User) => {
    setAuthState({
      isAuthenticated: true,
      user,
      loading: false,
    });

    // Log de login
    addActivityLog("Login", `${user.name} fez login no sistema`);
    
    toast.success(`Bem-vindo(a), ${user.name}!`, {
      description: "Login realizado com sucesso.",
    });
  };

  const handleLogout = () => {
    if (authState.user) {
      addActivityLog("Logout", `${authState.user.name} saiu do sistema`);
    }
    
    setAuthState({
      isAuthenticated: false,
      user: null,
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
    if (editingBooking) {
      // Editando reserva existente
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
      
      // Log da atividade
      addActivityLog(
        "Editar Reserva",
        `Reserva editada para ${bookingData.roomName} - ${bookingData.serviceType}`,
        `Sala ${bookingData.roomNumber}`
      );
      
      toast.success("Reserva atualizada com sucesso!", {
        description: `Sala ${bookingData.roomNumber} atualizada para ${bookingData.date.toLocaleDateString("pt-BR")}`,
      });
    } else {
      // Criando nova reserva
      const newBooking: NAMIBooking = {
        ...bookingData,
        id: Date.now().toString(),
        status: "confirmed",
        createdAt: new Date(),
      };

      setBookings(prev => [...prev, newBooking]);
      
      // Log da atividade
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
    const booking = bookings.find(b => b.id === bookingId);
    
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" as const }
          : booking
      )
    );
    
    // Log da atividade
    if (booking) {
      addActivityLog(
        "Cancelar Reserva",
        `Reserva cancelada para ${booking.roomName} - ${booking.serviceType}`,
        `Sala ${booking.roomNumber}`
      );
    }
    
    toast.success("Reserva cancelada com sucesso!");
  };

  const independentRooms = namiRooms.filter(room => room.isIndependent);

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
              
              <TabsContent value="monitoring" className="space-y-8">
                {monitorings.map((monitoring) => (
                  <MonitoringSection
                    key={monitoring.id}
                    monitoring={monitoring}
                    onRoomBooking={handleRoomBooking}
                    bookings={bookings}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="independent">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Salas Independentes</CardTitle>
                      <CardDescription>
                        Salas não vinculadas a monitoramentos específicos
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {independentRooms.map((room) => (
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