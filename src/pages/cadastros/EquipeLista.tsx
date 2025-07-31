// src/pages/cadastros/EquipeLista.tsx
import React, { useMemo, useState } from "react";
import { LayoutGrid, List, Eye } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Ocorrencia } from "@/types";
import OcorrenciaViewer from "@/components/ocorrencias/OcorrenciaViewer";
import { mockOcorrencias } from "@/pages/ocorrencias/ListaOcorrencias"; // reaproveita o mock

/* ---------- Tipos auxiliares ---------- */
interface TeamSnapshot {
  equipe: string;
  status: "disponivel" | "alocada";                // status da ocorrência + recente ou "disponivel"
  updated_at: string;            // updated_at da ocorrência + recente (ou "")
  regional: string | undefined;  // nome da regional da ocorrência + recente
  ocorrencia?: Ocorrencia;       // referência para abrir o viewer
}

// ---------- helpers de status (apenas 2) ----------
const getStatusColor = (status: string) =>
({
  disponivel: "bg-green-100 text-green-800",
  alocada: "bg-blue-100 text-blue-800",
}[status] ?? "bg-gray-100 text-gray-800");

const getStatusLabel = (status: string) =>
  ({ disponivel: "Disponível", alocada: "Alocada" }[status] ?? status);

// ---------- novo tipo ----------
interface TeamSnapshot {
  equipe: string;
  atividade: string;          // 🔄 tipo de serviço / atividade corrente
  pessoas: number;            // 🔄 qtde de integrantes
  status: "disponivel" | "alocada";
  ocorrencia?: Ocorrencia;    // abre a tela da ocorrência
}

const teamSizeMap: Record<string, number> = {
  "Equipe Manutenção Sul": 6,
  "Equipe Saneamento Leste": 8,
  "Equipe Limpeza Urbana A": 5,
  "Equipe Limpeza Urbana B": 4,
  "Equipe Obras Norte": 7,
  "Equipe Iluminação Noturna": 3,
};

/* ---------- Componentes de view ---------- */
const ListView = ({
  teams,
  onVisualizar,
}: {
  teams: TeamSnapshot[];
  onVisualizar: (o: Ocorrencia) => void;
}) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Equipe</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Regional</TableHead>
          <TableHead>Última atualização</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.equipe}>
            <TableCell className="font-medium">{team.equipe}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(team.status)}>
                {getStatusLabel(team.status)}
              </Badge>
            </TableCell>
            <TableCell>{team.regional ?? "---"}</TableCell>
            <TableCell>
              {team.updated_at
                ? new Date(team.updated_at).toLocaleDateString("pt-BR")
                : "---"}
            </TableCell>
            <TableCell className="text-right">
              {team.ocorrencia && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onVisualizar(team.ocorrencia!)}
                  title="Visualizar ocorrência"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

const GridView = ({
  teams,
  onVisualizar,
}: {
  teams: TeamSnapshot[];
  onVisualizar: (o: Ocorrencia) => void;
}) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {teams.map((team) => (
      <Card key={team.equipe} className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-lg">{team.equipe}</CardTitle>
            <Badge className={getStatusColor(team.status)}>
              {getStatusLabel(team.status)}
            </Badge>
          </div>
          {team.regional && (
            <p className="text-sm text-muted-foreground">{team.regional}</p>
          )}
        </CardHeader>
        <CardContent className="mt-auto flex justify-end gap-2">
          {team.ocorrencia && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onVisualizar(team.ocorrencia!)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

/* ---------- Página ---------- */
export default function EquipeLista() {
  /* 1. Construir snapshot das equipes -------------------- */
  const teamSnapshots = useMemo(() => {
    const map: Record<string, TeamSnapshot> = {};

    mockOcorrencias.forEach((o) => {
      if (!o.equipe_id) return;
      const already = map[o.equipe_id];

      // Mantém a ocorrência mais recente (updated_at) para a equipe
      if (
        !already ||
        new Date(o.updated_at) > new Date(already.updated_at || 0)
      ) {
        map[o.equipe_id] = {
          equipe: o.equipe_id,
          status: o.status === "em_execucao" ? "alocada" : "disponivel",
          updated_at: o.updated_at,
          regional: (o as any).regional_name,
          ocorrencia: o,
        };

      }
    });

    // Equipes que não apareceram em nenhuma ocorrência -> “disponível”
    const equipesSemOcorrencia = [
      /* se você tiver uma lista fixa de equipes, insira aqui */
    ];
    equipesSemOcorrencia.forEach((nome) => {
      if (!map[nome]) {
        map[nome] = {
          equipe: nome,
          status: "disponivel",
          updated_at: "",
          regional: undefined,
        };
      }
    });

    return Object.values(map).sort((a, b) => a.equipe.localeCompare(b.equipe));
  }, []);

  /* 2. State: busca, view mode, paginação ---------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewing, setViewing] = useState<Ocorrencia | null>(null);

  const itemsPerPage = viewMode === "list" ? 10 : 8;

  /* 3. Filtragem + paginação ----------------------------- */
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return teamSnapshots.filter((t) =>
      t.equipe.toLowerCase().includes(term)
    );
  }, [teamSnapshots, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  /* 4. Render ------------------------------------------- */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Equipes</h1>
      </div>



      {/* Search simples */}
      <input
        type="text"
        placeholder="Buscar equipe..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full md:w-72 px-3 py-2 border rounded-md"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filtered.length} equipes encontradas
        </p>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <ListView teams={paginated} onVisualizar={setViewing} />
      ) : (
        <GridView teams={paginated} onVisualizar={setViewing} />
      )}

      {/* paginação */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(n);
                  }}
                  isActive={n === currentPage}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
                className={
                  currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* modal viewer */}
      {viewing && (
        <OcorrenciaViewer
          ocorrencia={viewing}
          isOpen={!!viewing}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
