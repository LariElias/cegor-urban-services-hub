/*  src/pages/cadastros/EquipeLista.tsx  */
import React, { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { Ocorrencia } from "@/types";
import { mockOcorrencias } from "@/pages/ocorrencias/ListaOcorrencias";

const getStatusColor = (s: string) =>
({ disponivel: "bg-green-100 text-green-800", alocada: "bg-blue-100 text-blue-800" }[
  s as "disponivel" | "alocada"
] ?? "bg-gray-100 text-gray-800");

const getStatusLabel = (s: string) =>
  ({ disponivel: "Disponível", alocada: "Alocada" }[s as "disponivel" | "alocada"] ?? s);

interface TeamSnapshot {
  equipe: string;
  atividade: string;
  pessoas: number;
  status: "disponivel" | "alocada";
  ocorrencia?: Ocorrencia;
}


const teamSizeMap: Record<string, number> = {
  "Equipe Manutenção Sul": 10,
  "Equipe Saneamento Leste": 12,
  "Equipe Limpeza Urbana A": 10,
  "Equipe Limpeza Urbana B": 20,
  "Equipe Obras Norte": 10,
  "Equipe Iluminação Noturna": 15,
};

const useTeamSnapshots = () =>
  useMemo<TeamSnapshot[]>(() => {
    const map: Record<string, TeamSnapshot> = {};

    mockOcorrencias.forEach((o) => {
      if (!o.equipe_id) return;
      const moreRecent =
        !map[o.equipe_id] ||
        new Date(o.updated_at) >
        new Date(map[o.equipe_id].ocorrencia?.updated_at ?? 0);

      if (moreRecent) {
        map[o.equipe_id] = {
          equipe: o.equipe_id,
          atividade: o.service_type,
          pessoas: teamSizeMap[o.equipe_id] ?? 0,
          status: o.status === "em_execucao" ? "alocada" : "disponivel",
          ocorrencia: o.status === "em_execucao" ? o : undefined,
        };
      }
    });

    return Object.values(map).sort((a, b) => a.equipe.localeCompare(b.equipe));
  }, []);

/* ---------- ListView ---------- */
const ListView = ({ teams }: { teams: TeamSnapshot[] }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipe</TableHead>
            <TableHead>Atividade</TableHead>
            <TableHead>#Pessoas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((t) => (
            <TableRow key={t.equipe}>
              <TableCell className="font-medium">{t.equipe}</TableCell>
              <TableCell>{t.atividade ?? "---"}</TableCell>
              <TableCell>{t.pessoas || "-"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(t.status)}>
                  {getStatusLabel(t.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {t.status === "alocada" && (
                  <Button
                    size="sm"
                    onClick={() => navigate(`/ocorrencias/${t.ocorrencia!.id}/visualizar`)}
                  >
                    Ocorrência
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

/* ---------- GridView ---------- */
const GridView = ({ teams }: { teams: TeamSnapshot[] }) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teams.map((t) => (
        <Card key={t.equipe} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-lg">{t.equipe}</CardTitle>
              <Badge className={getStatusColor(t.status)}>
                {getStatusLabel(t.status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.atividade ?? "---"} • {t.pessoas || "-"} pessoas
            </p>
          </CardHeader>

          {t.status === "alocada" && (
            <CardContent className="mt-auto flex justify-end">
              <Button
                size="sm"
                onClick={() => navigate(`/ocorrencias/${t.ocorrencia!.id}`)}
              >
                Ocorrência
              </Button>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

/* ---------- página principal ---------- */
export default function EquipeLista() {
  const teamSnapshots = useTeamSnapshots();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = viewMode === "list" ? 10 : 8;

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Equipes</h1>
      </div>

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
        <ListView teams={paginated} />
      ) : (
        <GridView teams={paginated} />
      )}

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
                className={
                  currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                }
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
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
