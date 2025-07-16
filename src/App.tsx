
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Importar páginas de cadastros
import Regionais from "./pages/cadastros/Regionais";
import Bairros from "./pages/cadastros/Bairros";

// Importar páginas de ocorrências
import ListaOcorrencias from "./pages/ocorrencias/ListaOcorrencias";
import NovaOcorrencia from "./pages/ocorrencias/NovaOcorrencia";

// Importar páginas de relatórios
import DashboardGeral from "./pages/relatorios/DashboardGeral";
import ServicosEmpresa from "./pages/relatorios/ServicosEmpresa";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Rotas de cadastros - todas usando Layout */}
            <Route path="/cadastros/regionais" element={<Layout><Regionais /></Layout>} />
            <Route path="/cadastros/bairros" element={<Layout><Bairros /></Layout>} />
            
            {/* Rotas de ocorrências - todas usando Layout */}
            <Route path="/ocorrencias" element={<Layout><ListaOcorrencias /></Layout>} />
            <Route path="/ocorrencias/nova" element={<Layout><NovaOcorrencia /></Layout>} />
            
            {/* Rotas de relatórios - todas usando Layout */}
            <Route path="/relatorios/dashboard" element={<Layout><DashboardGeral /></Layout>} />
            <Route path="/relatorios/programados" element={<Layout><ServicosEmpresa /></Layout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
