import { CalendarDays, Users, Activity, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { User } from "../types/nami";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
}

export function Header({ activeTab, onTabChange, currentUser, onLogout }: HeaderProps) {
  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'coordinator': return 'Coordenador';
      case 'professor': return 'Professor';
      case 'staff': return 'Funcionário';
      default: return 'Usuário';
    }
  };
  return (
    <header className="border-b bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="w-2 h-1 bg-blue-400 rounded-sm mt-0.5"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">NAMI - Sistema de Reservas</h1>
                <p className="text-sm text-blue-100">Nutrição • Universidade de Fortaleza</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-1">
              <Button
                variant={activeTab === "rooms" ? "secondary" : "ghost"}
                onClick={() => onTabChange("rooms")}
                className={`flex items-center space-x-2 ${
                  activeTab === "rooms" 
                    ? "bg-white text-blue-700 hover:bg-blue-50" 
                    : "text-white hover:bg-white/20"
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Salas</span>
              </Button>
              <Button
                variant={activeTab === "bookings" ? "secondary" : "ghost"}
                onClick={() => onTabChange("bookings")}
                className={`flex items-center space-x-2 ${
                  activeTab === "bookings" 
                    ? "bg-white text-blue-700 hover:bg-blue-50" 
                    : "text-white hover:bg-white/20"
                }`}
              >
                <CalendarDays className="h-4 w-4" />
                <span>Reservas</span>
              </Button>
              <Button
                variant={activeTab === "logs" ? "secondary" : "ghost"}
                onClick={() => onTabChange("logs")}
                className={`flex items-center space-x-2 ${
                  activeTab === "logs" 
                    ? "bg-white text-blue-700 hover:bg-blue-50" 
                    : "text-white hover:bg-white/20"
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>Log de Atividades</span>
              </Button>
              {currentUser.role === 'admin' && (
                <Button
                  variant={activeTab === "users" ? "secondary" : "ghost"}
                  onClick={() => onTabChange("users")}
                  className={`flex items-center space-x-2 ${
                    activeTab === "users" 
                      ? "bg-white text-blue-700 hover:bg-blue-50" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Usuários</span>
                </Button>
              )}
            </nav>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/20 h-auto py-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-white text-blue-700 rounded-full text-sm font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-medium">{currentUser.name}</div>
                    <div className="text-xs text-blue-100">{getRoleLabel(currentUser.role)}</div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  <Badge className="mt-1 text-xs" variant="outline">{getRoleLabel(currentUser.role)}</Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair do Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}