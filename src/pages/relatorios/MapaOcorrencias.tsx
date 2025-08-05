import React, { useState, useMemo } from "react";
import { MapPin, Filter, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Ocorrencia } from "@/types";
import { Link } from "react-router-dom";

// Importações necessárias para o react-leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface OcorrenciaComBairro extends Ocorrencia {
  bairro: string;
  regional_name: string;
}

export default function MapaOcorrencias() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    status: "",
    prioridade: "",
    regional: "",
    bairro: "",
    service_type: "", // NOVO: Adiciona o estado para o novo filtro
  });

  const ocorrencias: OcorrenciaComBairro[] = useMemo(() => [
    {
      id: "1",
      protocol: "OCR-2024-001",
      description: "Limpeza de terreno baldio",
      service_type: "Limpeza",
      public_equipment_name: "Terreno Rua das Flores",
      priority: "alta",
      status: "encaminhada",
      address: "Rua das Flores, 123",
      latitude: -3.732,
      longitude: -38.527,
      regional_id: "1",
      fiscal_id: "1",
      created_at: "2025-07-29T10:00:00Z",
      updated_at: "2025-07-29T10:00:00Z",
      bairro: "Centro",
      regional_name: "Regional Centro",
    },
    {
      id: "2",
      protocol: "OCR-2024-002",
      description: "Reparo em calçada",
      service_type: "Manutenção",
      public_equipment_name: "Calçada Av. Brasil",
      priority: "media",
      status: "autorizada",
      address: "Av. Brasil, 456",
      latitude: -3.735,
      longitude: -38.525,
      regional_id: "2",
      fiscal_id: "1",
      created_at: "2025-07-28T11:00:00Z",
      updated_at: "2025-07-28T11:00:00Z",
      bairro: "Meireles",
      regional_name: "Regional II",
    },
    {
      id: "3",
      protocol: "OCR-2024-003",
      description: "Poda de árvores",
      service_type: "Conservação",
      public_equipment_name: "Praça Central",
      priority: "baixa",
      status: "em_execucao",
      address: "Praça Central, s/n",
      latitude: -3.73,
      longitude: -38.53,
      regional_id: "1",
      fiscal_id: "1",
      created_at: "2025-07-27T14:00:00Z",
      updated_at: "2025-07-27T14:00:00Z",
      bairro: "Centro",
      regional_name: "Regional Centro",
    },
    {
      id: "4",
      protocol: "OCR-2024-004",
      description: "Poste com luz queimada",
      service_type: "Iluminação",
      public_equipment_name: "Poste 34A",
      priority: "alta",
      status: "concluida",
      address: "Rua dos Tabajaras, 500",
      latitude: -3.72,
      longitude: -38.515,
      regional_id: "2",
      fiscal_id: "2",
      created_at: "2025-07-26T09:00:00Z",
      updated_at: "2025-07-26T09:00:00Z",
      bairro: "Praia de Iracema",
      regional_name: "Regional II",
    },
    {
      id: "5",
      protocol: "OCR-2024-005",
      description: "Buraco na via",
      service_type: "Manutenção",
      public_equipment_name: "Asfalto Av. Leste-Oeste",
      priority: "media",
      status: "encaminhada",
      address: "Av. Leste-Oeste, 1020",
      latitude: -3.715,
      longitude: -38.54,
      regional_id: "3",
      fiscal_id: "3",
      created_at: "2025-07-25T16:00:00Z",
      updated_at: "2025-07-25T16:00:00Z",
      bairro: "Barra do Ceará",
      regional_name: "Regional I",
    },
    {
      id: "6",
      protocol: "OCR-2024-006",
      description: "Coleta de lixo acumulado",
      service_type: "Limpeza",
      public_equipment_name: "Esquina da Rua X com Y",
      priority: "alta",
      status: "em_execucao",
      address: "Rua X, 10",
      latitude: -3.765,
      longitude: -38.575,
      regional_id: "4",
      fiscal_id: "4",
      created_at: "2025-07-24T08:00:00Z",
      updated_at: "2025-07-24T08:00:00Z",
      bairro: "Antônio Bezerra",
      regional_name: "Regional III",
    },
    {
      id: "7",
      protocol: "OCR-2024-007",
      description: "Sinalização de trânsito apagada",
      service_type: "Trânsito",
      public_equipment_name: "Semáforo Av. da Universidade",
      priority: "media",
      status: "autorizada",
      address: "Av. da Universidade, 2200",
      latitude: -3.742,
      longitude: -38.536,
      regional_id: "5",
      fiscal_id: "5",
      created_at: "2025-07-23T13:00:00Z",
      updated_at: "2025-07-23T13:00:00Z",
      bairro: "Benfica",
      regional_name: "Regional IV",
    },
    {
      id: "8",
      protocol: "OCR-2024-008",
      description: "Vazamento de água",
      service_type: "Saneamento",
      public_equipment_name: "Rua Padre Cícero",
      priority: "alta",
      status: "encaminhada",
      address: "Rua Padre Cícero, 88",
      latitude: -3.79,
      longitude: -38.558,
      regional_id: "6",
      fiscal_id: "6",
      created_at: "2025-07-22T18:00:00Z",
      updated_at: "2025-07-22T18:00:00Z",
      bairro: "Messejana",
      regional_name: "Regional VI",
    },
  ], []);

  const filteredOcorrencias = useMemo(() => {
    return ocorrencias.filter((ocorrencia) => {
      const statusMatch =
        !filters.status ||
        filters.status === "todos" ||
        ocorrencia.status === filters.status;
      const prioridadeMatch =
        !filters.prioridade ||
        filters.prioridade === "todas" ||
        ocorrencia.priority === filters.prioridade;
      const regionalMatch =
        !filters.regional ||
        filters.regional === "todas" ||
        ocorrencia.regional_name === filters.regional;
      const bairroMatch =
        !filters.bairro ||
        filters.bairro === "todos" ||
        ocorrencia.bairro === filters.bairro;
      // NOVO: Condição de filtro para tipo de serviço
      const serviceTypeMatch =
        !filters.service_type ||
        filters.service_type === "todos" ||
        ocorrencia.service_type === filters.service_type;

      return statusMatch && prioridadeMatch && regionalMatch && bairroMatch && serviceTypeMatch;
    });
  }, [ocorrencias, filters]);

  // Gera listas únicas para os seletores de filtro
  const regionais = useMemo(
    () => [...new Set(ocorrencias.map((o) => o.regional_name))].sort(),
    [ocorrencias]
  );
  const bairros = useMemo(
    () => [...new Set(ocorrencias.map((o) => o.bairro))].sort(),
    [ocorrencias]
  );
  // NOVO: Lista dinâmica para os tipos de serviço
  const serviceTypes = useMemo(
    () => [...new Set(ocorrencias.map((o) => o.service_type))].sort(),
    [ocorrencias]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "encaminhada": return "bg-red-500";
      case "autorizada": case "agendada": return "bg-orange-500";
      case "em_execucao": return "bg-blue-500";
      case "concluida": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      criada: "Criada", encaminhada: "Encaminhada", autorizada: "Autorizada",
      cancelada: "Cancelada", devolvida: "Devolvida", em_analise: "Em Análise",
      agendada: "Agendada", em_execucao: "Em Execução", concluida: "Concluída",
    };
    return labels[status] || status;
  };

  const createCustomIcon = (status: string) => {
    const colorClass = getStatusColor(status);
    return L.divIcon({
      html: `<span class="flex h-4 w-4 rounded-full ${colorClass} border-2 border-white shadow-md"></span>`,
      className: "bg-transparent border-0",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <MapPin className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Mapa de Ocorrências</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value === "todos" ? "" : value, }))}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="encaminhada">Encaminhada</SelectItem>
                  <SelectItem value="autorizada">Autorizada</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="em_execucao">Em Execução</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* NOVO: Componente Select para o filtro de Tipo de Serviço */}
            <div>
              <Label htmlFor="service_type">Tipo de Serviço</Label>
              <Select value={filters.service_type} onValueChange={(value) => setFilters((prev) => ({ ...prev, service_type: value === "todos" ? "" : value, }))}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {serviceTypes.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={filters.prioridade} onValueChange={(value) => setFilters((prev) => ({ ...prev, prioridade: value === "todos" ? "" : value, }))}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="regional">Regional</Label>
              <Select value={filters.regional} onValueChange={(value) => setFilters((prev) => ({ ...prev, regional: value === "todos" ? "" : value, }))}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  {regionais.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Select value={filters.bairro} onValueChange={(value) => setFilters((prev) => ({ ...prev, bairro: value === "todos" ? "" : value, }))}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {bairros.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={() =>
                setFilters({
                  status: "",
                  prioridade: "",
                  regional: "",
                  bairro: "",
                  service_type: "", // NOVO: Limpa o filtro de tipo de serviço
                })
              }
            >
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Mapa - Fortaleza/CE ({filteredOcorrencias.length} ocorrências)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full rounded-lg overflow-hidden z-0">
                <MapContainer center={[-3.732, -38.527]} zoom={12} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredOcorrencias.map((ocorrencia) => (
                    <Marker
                      key={ocorrencia.id}
                      position={[ocorrencia.latitude, ocorrencia.longitude]}
                      icon={createCustomIcon(ocorrencia.status)}
                    >
                      <Popup>
                        <div className="space-y-2">
                          <p className="font-bold">{ocorrencia.protocol}</p>
                          <p className="text-sm">{ocorrencia.description}</p>
                          <Badge variant="secondary">
                            {getStatusLabel(ocorrencia.status)}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {ocorrencia.address}
                          </p>
                          <Button size="sm" className="w-full mt-2" asChild>
                            <Link to={`/ocorrencias/${ocorrencia.id}`}>
                              Ver Detalhes
                            </Link>
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Encaminhada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Autorizada/Agendada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Em Execução</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Concluída</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ocorrências Visualizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredOcorrencias.length > 0 ? (
                  filteredOcorrencias.map((ocorrencia) => (
                    <div
                      key={ocorrencia.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(ocorrencia.status)}`}></div>
                        <div>
                          <p className="font-medium">{ocorrencia.protocol}</p>
                          <p className="text-sm text-muted-foreground">
                            {ocorrencia.description}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {getStatusLabel(ocorrencia.status)}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/ocorrencias/${ocorrencia.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          Abrir
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma ocorrência encontrada para os filtros selecionados.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}