import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils" // Supondo que você tenha um utilitário cn
import logoPmf from '@/assets/images/logo-pmf-2025.png';
import imagemLimpeza from '@/assets/images/limpeza.png';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema CEGOR",
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="mx-auto flex items-center justify-center mb-4">
              <img 
                      src={logoPmf}
                      alt="Logo pmf" 
                      className="h-14 w-auto logoSide" 
              />
            </div>
            <h2 className="text-balance text-muted-foreground">
              SISTEMAS DE REGIONAIS
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="ml-auto inline-block text-sm underline">
                  Esqueceu sua senha?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-600 space-y-2 border-t pt-4">
            <p className="font-medium text-center">Contas de demonstração:</p>
            <div className="space-y-1 text-xs text-center">
              <p><strong>CEGOR:</strong> admin@cegor.gov.br</p>
              <p><strong>CEGOR FISCAL:</strong> fiscal@cegor.gov.br</p>
              <p><strong>CEGOR OPERADOR:</strong> operador@cegor.gov.br</p>
              <p><strong>Regional Gestor:</strong> gestor@centrosul.gov.br</p>
              <p><strong>Regional Operador:</strong> operador@centrosul.gov.br</p>
              <p><strong>Regional Fiscal:</strong> fiscal@centrosul.gov.br</p>
              <p><strong>Empresa Gestor:</strong> empresa@limpezabh.com.br</p>
              <p><strong>Empresa Fiscal:</strong> fiscal@limpezabh.com.br</p>
              <p><strong>Empresa Operador:</strong> operador@limpezabh.com.br</p>

              <p className="text-gray-500 pt-1">(Senha: qualquer valor)</p>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={imagemLimpeza}
          alt="Imagem de fundo do sistema CEGOR"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
