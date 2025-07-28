
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
import Territorios from "./pages/cadastros/Territorios";
import Fiscais from "./pages/cadastros/Fiscais";
import Equipamentos from "./pages/cadastros/Equipamentos";
import Empresas from "./pages/cadastros/Empresas";

// Importar páginas de ocorrências
import ListaOcorrencias from "./pages/ocorrencias/ListaOcorrencias";
import NovaOcorrencia from "./pages/ocorrencias/NovaOcorrencia";
import OcorrenciasAprovadas from "./pages/ocorrencias/OcorrenciasAprovadas";
import DemandasEmpresa from "./pages/ocorrencias/DemandasEmpresa";
import Agendamento from "./pages/ocorrencias/Agendamento";
import DetalhamentoExecucao from "./pages/ocorrencias/DetalhamentoExecucao";
import VistoriaPrevia from "./pages/ocorrencias/VistoriaPrevia";
import VistoriaFinal from "./pages/ocorrencias/VistoriaFinal";
import AcompanhamentoDiario from "./pages/ocorrencias/AcompanhamentoDiario";
import VisualizarOcorrencia from "./pages/ocorrencias/VisualizarOcorrencia";

// Importar páginas de relatórios
import DashboardGeral from "./pages/relatorios/DashboardGeral";
import ServicosEmpresa from "./pages/relatorios/ServicosEmpresa";
import MapaOcorrencias from "./pages/relatorios/MapaOcorrencias";
import HistoricoOcorrencias from "./pages/relatorios/HistoricoOcorrencias";
import TempoExecucao from "./pages/relatorios/TempoExecucao";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Rotas de cadastros - todas usando Layout */}
            <Route path="/cadastros/regionais" element={<Layout><Regionais /></Layout>} />
            <Route path="/cadastros/bairros" element={<Layout><Bairros /></Layout>} />
            <Route path="/cadastros/territorios" element={<Layout><Territorios /></Layout>} />
            <Route path="/cadastros/fiscais" element={<Layout><Fiscais /></Layout>} />
            <Route path="/cadastros/equipamentos" element={<Layout><Equipamentos /></Layout>} />
            <Route path="/cadastros/empresas" element={<Layout><Empresas /></Layout>} />
            
            {/* Rotas de ocorrências - todas usando Layout */}
            <Route path="/ocorrencias" element={<Layout><ListaOcorrencias /></Layout>} />
            <Route path="/ocorrencias/nova" element={<Layout><VisualizarOcorrencia /></Layout>} />
            <Route path="/ocorrencias/aprovadas" element={<Layout><OcorrenciasAprovadas /></Layout>} />
            <Route path="/ocorrencias/demandas" element={<Layout><DemandasEmpresa /></Layout>} />
            <Route path="/empresas/:id/demandas" element={<Layout><DemandasEmpresa /></Layout>} />
            <Route path="/ocorrencias/:id/agendamento" element={<Layout><Agendamento /></Layout>} />
            <Route path="/ocorrencias/:id/detalhamento" element={<Layout><DetalhamentoExecucao /></Layout>} />
            <Route path="/ocorrencias/:id/vistoria" element={<Layout><VistoriaPrevia /></Layout>} />
            <Route path="/ocorrencias/:id/vistoria_final" element={<Layout><VistoriaFinal /></Layout>} />
            <Route path="/ocorrencias/:id/acompanhamento" element={<Layout><AcompanhamentoDiario /></Layout>} />
            <Route path="/ocorrencias/:id/visualizar" element={<Layout><VisualizarOcorrencia /></Layout>} />
            
            {/* Rotas de relatórios - todas usando Layout */}
            <Route path="/relatorios/dashboard" element={<Layout><DashboardGeral /></Layout>} />
            <Route path="/relatorios/programados" element={<Layout><ServicosEmpresa /></Layout>} />
            <Route path="/relatorios/mapa" element={<Layout><MapaOcorrencias /></Layout>} />
            <Route path="/relatorios/historico" element={<Layout><HistoricoOcorrencias /></Layout>} />
            <Route path="/relatorios/tempo" element={<Layout><TempoExecucao /></Layout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
