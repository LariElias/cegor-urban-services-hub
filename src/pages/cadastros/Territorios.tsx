import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  MapPin,
} from "lucide-react";

// Importando componentes da UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TerritorioForm } from "@/components/forms/TerritorioForm"; // Supondo que você tenha este formulário
import {
  isCegorGestor,
  isCegorOperador,
  isRegionalGestor,
  isSuperAdm,
} from "@/types";

// Mock data com 10 territórios para uma melhor visualização
const mockTerritorios = [
  {
    id: "1",
    codigo: "TER001",
    nome: "Território Beira Mar",
    descricao: "Área turística da orla",
    bairros: ["Meireles", "Praia de Iracema"],
    regional_id: "2",
    regional_nome: "Regional 02",
  },
  {
    id: "2",
    codigo: "TER002",
    nome: "Território Central",
    descricao: "Coração comercial da cidade",
    bairros: ["Centro", "Benfica"],
    regional_id: "1",
    regional_nome: "Regional 01",
  },
  {
    id: "3",
    codigo: "TER003",
    nome: "Território Sul 1",
    descricao: "Área residencial e comercial em Messejana",
    bairros: ["Messejana", "Cajazeiras"],
    regional_id: "4",
    regional_nome: "Regional 04",
  },
  {
    id: "4",
    codigo: "TER004",
    nome: "Território Oeste",
    descricao: "Região oeste da cidade",
    bairros: ["Barra do Ceará", "Vila Velha"],
    regional_id: "6",
    regional_nome: "Regional 06",
  },
  {
    id: "5",
    codigo: "TER005",
    nome: "Território Aldeota",
    descricao: "Polo de negócios e serviços",
    bairros: ["Aldeota", "Joaquim Távora"],
    regional_id: "1",
    regional_nome: "Regional 01",
  },
  {
    id: "6",
    codigo: "TER006",
    nome: "Território Verde",
    descricao: "Área do parque do Cocó",
    bairros: ["Cocó", "Papicu"],
    regional_id: "5",
    regional_nome: "Regional 05",
  },
  {
    id: "7",
    codigo: "TER007",
    nome: "Território Norte Universitário",
    descricao: "Região com campus universitário",
    bairros: ["Pici", "Parquelândia"],
    regional_id: "3",
    regional_nome: "Regional 03",
  },
  {
    id: "8",
    codigo: "TER008",
    nome: "Território Leste 2",
    descricao: "Área residencial do Guararapes",
    bairros: ["Guararapes", "Edson Queiroz"],
    regional_id: "5",
    regional_nome: "Regional 05",
  },
  {
    id: "9",
    codigo: "TER009",
    nome: "Território Sul 2",
    descricao: "Região do Castelão",
    bairros: ["Passaré", "Boa Vista"],
    regional_id: "4",
    regional_nome: "Regional 04",
  },
  {
    id: "10",
    codigo: "TER010",
    nome: "Território Montese",
    descricao: "Forte polo comercial popular",
    bairros: ["Montese", "Bom Futuro"],
    regional_id: "3",
    regional_nome: "Regional 03",
  },
];

// Componente para a visualização em Lista (Tabela)
const ListView = ({
  territorios,
  handleEdit,
  handleDelete,
  showRegionalColumn,
}) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="hidden md:table-cell">Bairros</TableHead>
          {showRegionalColumn && (
            <TableHead className="hidden lg:table-cell">Regional</TableHead>
          )}
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {territorios.map((territorio) => (
          <TableRow key={territorio.id}>
            <TableCell className="font-medium">{territorio.codigo}</TableCell>
            <TableCell>{territorio.nome}</TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="flex flex-wrap gap-1">
                {territorio.bairros.slice(0, 2).map((b, i) => (
                  <Badge key={i} variant="secondary">
                    {b}
                  </Badge>
                ))}
                {territorio.bairros.length > 2 && (
                  <Badge variant="outline">
                    +{territorio.bairros.length - 2}
                  </Badge>
                )}
              </div>
            </TableCell>
            {showRegionalColumn && (
              <TableCell className="hidden lg:table-cell">
                {territorio.regional_nome}
              </TableCell>
            )}
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(territorio)}
                  aria-label="Editar"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(territorio.id)}
                  className="text-red-600 hover:text-red-700"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

// Componente para a visualização em Grid (Cards)
const GridView = ({ territorios, handleEdit, handleDelete }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {territorios.map((territorio) => (
      <Card key={territorio.id} className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">{territorio.nome}</CardTitle>
          <p className="text-sm text-gray-500">{territorio.codigo}</p>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-sm text-gray-600">
            <strong>Descrição:</strong> {territorio.descricao}
          </p>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Bairros:</p>
            <div className="flex flex-wrap gap-1">
              {territorio.bairros.map((b, i) => (
                <Badge key={i} variant="secondary">
                  {b}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 pt-2">
            <strong>Regional:</strong> {territorio.regional_nome}
          </p>
        </CardContent>
        <div className="flex gap-2 p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleEdit(territorio)}
          >
            <Edit className="w-4 h-4 mr-2" /> Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 hover:text-red-700"
            onClick={() => handleDelete(territorio.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Excluir
          </Button>
        </div>
      </Card>
    ))}
  </div>
);

const Territorios = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegional, setSelectedRegional] = useState("");
  const [territorios, setTerritorios] = useState(mockTerritorios);
  const [showForm, setShowForm] = useState(false);
  const [editingTerritorio, setEditingTerritorio] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const canEdit =
    isCegorGestor(user) ||
    isCegorOperador(user) ||
    isRegionalGestor(user) ||
    isSuperAdm(user);
  // const canEdit = isCegorGestor(user) ||
  const canCreate = canEdit;
  const showRegionalFilter =
    isCegorGestor(user) || isCegorOperador(user) || isSuperAdm(user);

  const filteredTerritorios = territorios.filter((territorio) => {
    // if (
    //   user?.role === "regional" &&
    //   user.regional_id !== territorio.regional_id
    // ) {
    //   return false;
    // }
    const matchesSearch =
      territorio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      territorio.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegional =
      !selectedRegional || territorio.regional_id === selectedRegional;

    return matchesSearch && matchesRegional;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListItems = filteredTerritorios.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTerritorios.length / itemsPerPage);

  const handleEdit = (territorio) => {
    setEditingTerritorio(territorio);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este território?")) {
      setTerritorios(territorios.filter((t) => t.id !== id));
    }
  };

  const handleSave = (data) => {
    if (editingTerritorio) {
      setTerritorios(
        territorios.map((t) =>
          t.id === editingTerritorio.id
            ? { ...data, id: editingTerritorio.id }
            : t
        )
      );
    } else {
      setTerritorios([
        ...territorios,
        {
          ...data,
          id: Date.now().toString(),
          codigo: `TER${(territorios.length + 1).toString().padStart(3, "0")}`,
        },
      ]);
    }
    setShowForm(false);
    setEditingTerritorio(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciar Territórios
        </h1>
        {canCreate && (
          <Button
            onClick={() => {
              setEditingTerritorio(null);
              setShowForm(true);
            }}
            className="bg-[#0B5CF0] hover:bg-[#0B5CF0]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Território
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-700">
            <Search className="w-5 h-5" />
            Filtrar Territórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por código ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            {showRegionalFilter && (
              <select
                value={selectedRegional}
                onChange={(e) => setSelectedRegional(e.target.value)}
                className="w-full sm:w-56 h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Todas as Regionais</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>
                    Regional {(i + 1).toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredTerritorios.length} territórios encontrados
        </p>
        <div className="flex items-center justify-end gap-2 p-1 bg-gray-100 rounded-lg">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Visualizar em Grade"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="Visualizar em Lista"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div>
        {filteredTerritorios.length > 0 ? (
          viewMode === "grid" ? (
            <GridView
              territorios={filteredTerritorios}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <div className="space-y-4">
              <ListView
                territorios={currentListItems}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                showRegionalColumn={showRegionalFilter}
              />
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.max(p - 1, 1));
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      />
                    </PaginationItem>
                    {[...Array(totalPages).keys()].map((num) => (
                      <PaginationItem key={num + 1}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(num + 1);
                          }}
                          isActive={currentPage === num + 1}
                        >
                          {num + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.min(p + 1, totalPages));
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum território encontrado.</p>
          </div>
        )}
      </div>

      {showForm && (
        <TerritorioForm
          territorio={editingTerritorio}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTerritorio(null);
          }}
        />
      )}
    </div>
  );
};

export default Territorios;
