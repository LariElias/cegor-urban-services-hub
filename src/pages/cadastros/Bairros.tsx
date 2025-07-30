import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Search, Edit, Trash2, LayoutGrid, List } from "lucide-react";

// Importando componentes da UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BairroForm } from "@/components/forms/BairroForm"; // Supondo que você tenha este formulário

// Mock data com 10 bairros de Fortaleza para uma melhor visualização
const mockBairros = [
  {
    id: 1,
    codigo: "B001",
    nome: "Meireles",
    descricao: "Bairro nobre com extensa orla marítima.",
    habitantes: 39000,
    area: 2.1,
    kmVias: 25.5,
  },
  {
    id: 2,
    codigo: "B002",
    nome: "Aldeota",
    descricao: "Centro comercial e financeiro da cidade.",
    habitantes: 42500,
    area: 3.5,
    kmVias: 40.2,
  },
  {
    id: 3,
    codigo: "B003",
    nome: "Messejana",
    descricao: "Bairro histórico com grande lagoa.",
    habitantes: 45000,
    area: 8.9,
    kmVias: 55.1,
  },
  {
    id: 4,
    codigo: "B004",
    nome: "Parquelândia",
    descricao: "Residencial e arborizado.",
    habitantes: 28000,
    area: 1.9,
    kmVias: 18.7,
  },
  {
    id: 5,
    codigo: "B005",
    nome: "Praia de Iracema",
    descricao: "Polo cultural, boêmio e turístico.",
    habitantes: 9500,
    area: 1.2,
    kmVias: 10.5,
  },
  {
    id: 6,
    codigo: "B006",
    nome: "Cocó",
    descricao: "Conhecido pelo grande parque ecológico.",
    habitantes: 22000,
    area: 4.5,
    kmVias: 22.0,
  },
  {
    id: 7,
    codigo: "B007",
    nome: "Benfica",
    descricao: "Bairro universitário e cultural.",
    habitantes: 31000,
    area: 1.7,
    kmVias: 15.8,
  },
  {
    id: 8,
    codigo: "B008",
    nome: "Barra do Ceará",
    descricao: "Onde a cidade começou, marco histórico.",
    habitantes: 72000,
    area: 6.3,
    kmVias: 45.3,
  },
  {
    id: 9,
    codigo: "B009",
    nome: "Papicu",
    descricao: "Conecta a zona leste ao centro.",
    habitantes: 35000,
    area: 2.8,
    kmVias: 28.1,
  },
  {
    id: 10,
    codigo: "B010",
    nome: "Montese",
    descricao: "Forte polo comercial popular.",
    habitantes: 48000,
    area: 2.4,
    kmVias: 30.9,
  },
];

// Componente para a visualização em Lista (Tabela)
const ListView = ({ bairros, handleEdit, handleDelete }) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="hidden md:table-cell">Habitantes</TableHead>
          <TableHead className="hidden lg:table-cell">Área (km²)</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bairros.map((bairro) => (
          <TableRow key={bairro.id}>
            <TableCell className="font-medium">{bairro.codigo}</TableCell>
            <TableCell>{bairro.nome}</TableCell>
            <TableCell className="hidden md:table-cell">
              {bairro.habitantes.toLocaleString("pt-BR")}
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              {bairro.area}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(bairro)}
                  aria-label="Editar"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(bairro.id)}
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
const GridView = ({ bairros, handleEdit, handleDelete }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {bairros.map((bairro) => (
      <Card key={bairro.id} className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">{bairro.nome}</CardTitle>
          <p className="text-sm text-gray-500">{bairro.codigo}</p>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-sm text-gray-600">
            <strong>Descrição:</strong> {bairro.descricao}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Habitantes:</strong>{" "}
            {bairro.habitantes?.toLocaleString("pt-BR") || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Área:</strong> {bairro.area} km²
          </p>
          <p className="text-sm text-gray-600">
            <strong>Km de Vias:</strong> {bairro.kmVias} km
          </p>
        </CardContent>
        <div className="flex gap-2 p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleEdit(bairro)}
          >
            <Edit className="w-4 h-4 mr-2" /> Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 hover:text-red-700"
            onClick={() => handleDelete(bairro.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Excluir
          </Button>
        </div>
      </Card>
    ))}
  </div>
);

const Bairros = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [bairros, setBairros] = useState(mockBairros);
  const [showForm, setShowForm] = useState(false);
  const [editingBairro, setEditingBairro] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // if (!user || user.role !== 'cegor') {
  //   return (
  //     <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
  //       <p className="text-red-600 font-medium">Acesso negado. Apenas usuários CEGOR podem acessar esta página.</p>
  //     </div>
  //   );
  // }

  const filteredBairros = bairros.filter(
    (bairro) =>
      bairro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bairro.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListItems = filteredBairros.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBairros.length / itemsPerPage);

  const handleEdit = (bairro) => {
    setEditingBairro(bairro);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este bairro?")) {
      setBairros(bairros.filter((b) => b.id !== id));
    }
  };

  const handleSave = (data) => {
    if (editingBairro) {
      setBairros(
        bairros.map((b) =>
          b.id === editingBairro.id ? { ...data, id: editingBairro.id } : b
        )
      );
    } else {
      setBairros([
        ...bairros,
        {
          ...data,
          id: Date.now(),
          codigo: `B${(bairros.length + 1).toString().padStart(3, "0")}`,
        },
      ]);
    }
    setShowForm(false);
    setEditingBairro(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Bairros</h1>
        <Button
          onClick={() => {
            setEditingBairro(null);
            setShowForm(true);
          }}
          className="bg-[#0B5CF0] hover:bg-[#0B5CF0]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Bairro
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-700">
            <Search className="w-5 h-5" />
            Filtrar Bairros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por código ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredBairros.length} bairros encontrados
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
        {filteredBairros.length > 0 ? (
          viewMode === "grid" ? (
            <GridView
              bairros={filteredBairros}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <div className="space-y-4">
              <ListView
                bairros={currentListItems}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
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
            <p className="text-gray-500">Nenhum bairro encontrado.</p>
          </div>
        )}
      </div>

      {showForm && (
        <BairroForm
          bairro={editingBairro}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingBairro(null);
          }}
        />
      )}
    </div>
  );
};

export default Bairros;
