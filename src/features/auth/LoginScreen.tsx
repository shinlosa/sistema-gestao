import { useState } from "react";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { validateLogin } from "../../data/userData";
import { User as UserType } from "../../types/nami";

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = validateLogin(username, password);

    if (user) {
      // Atualizar último login
      user.lastLogin = new Date();
      onLogin(user);
    } else {
      setError("Credenciais inválidas. Verifique seu usuário e senha.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-800/10"></div>

      <div className="relative w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <div className="text-white text-2xl font-bold">N</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema NAMI</h1>
          <p className="text-gray-600">Núcleo de Atenção Médica Integrada</p>
          <p className="text-sm text-blue-700 font-medium mt-1">Universidade de Fortaleza</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl text-center text-gray-900">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entre com suas credenciais para acessar o sistema de reservas
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 pr-11"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-9 w-9 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Informações de teste */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Credenciais de Teste:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Admin:</strong> admin.nami / NAMI@2025!</div>
                <div><strong>Coordenadora:</strong> coord.nutricao / Nutri@123</div>
                <div><strong>Professora:</strong> flavia.prof / Prof@456</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2025 NAMI - Universidade de Fortaleza</p>
          <p className="mt-1">Sistema de Gestão de Salas</p>
        </div>
      </div>
    </div>
  );
}
