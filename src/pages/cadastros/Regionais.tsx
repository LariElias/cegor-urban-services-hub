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
} from "@/components/ui/pagination"; // Importando a paginação
import { RegionalForm } from "@/components/forms/RegionalForm";

// Mock data com mais itens para uma melhor visualização
const mockRegionais = [
  {
    id: 1,
    sigla: "REG01",
    descricao: "Regional Centro",
    endereco: "Rua das Flores, 123 - Centro",
    cpfSecretario: "123.456.789-01",
  },
  {
    id: 2,
    sigla: "REG02",
    descricao: "Regional Praia",
    endereco: "Av. Beira Mar, 456 - Meireles",
    cpfSecretario: "987.654.321-02",
  },
  {
    id: 3,
    sigla: "REG03",
    descricao: "Regional Norte",
    endereco: "Rua dos Coqueiros, 789 - Barra do Ceará",
    cpfSecretario: "111.222.333-03",
  },
  {
    id: 4,
    sigla: "REG04",
    descricao: "Regional Sul",
    endereco: "Av. Principal, 101 - Messejana",
    cpfSecretario: "444.555.666-04",
  },
  {
    id: 5,
    sigla: "REG05",
    descricao: "Regional Leste",
    endereco: "Travessa do Sol, 212 - Cocó",
    cpfSecretario: "777.888.999-05",
  },
  {
    id: 6,
    sigla: "REG06",
    descricao: "Regional Oeste",
    endereco: "Rua da Paz, 333 - Parquelândia",
    cpfSecretario: "121.314.151-06",
  },
  {
    id: 7,
    sigla: "REG07",
    descricao: "Regional Sudeste",
    endereco: "Avenida Central, 444 - Aldeota",
    cpfSecretario: "617.181.920-07",
  },
  {
    id: 8,
    sigla: "REG08",
    descricao: "Regional Noroeste",
    endereco: "Rua das Águas, 555 - Papicu",
    cpfSecretario: "212.223.242-08",
  },
  {
    id: 9,
    sigla: "REG09",
    descricao: "Regional Metropolitana",
    endereco: "Travessa das Acácias, 667 - Eusébio",
    cpfSecretario: "526.272.829-09",
  },
  {
    id: 10,
    sigla: "REG10",
    descricao: "Regional Serrana",
    endereco: "Rua das Montanhas, 888 - Maranguape",
    cpfSecretario: "303.132.333-10",
  },
];

// Componente para a visualização em Lista (Tabela)
const ListView = ({ regionais, handleEdit, handleDelete }) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sigla</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead className="hidden md:table-cell">Endereço</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {regionais.map((regional) => (
          <TableRow key={regional.id}>
            <TableCell className="font-medium">{regional.sigla}</TableCell>
            <TableCell>{regional.descricao}</TableCell>
            <TableCell className="hidden md:table-cell">
              {regional.endereco}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(regional)}
                  aria-label="Editar"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(regional.id)}
                  className="text-red-600 hover:text-red-700 border-red-600/50 hover:border-red-700/50"
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
const GridView = ({ regionais, handleEdit, handleDelete }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {regionais.map((regional) => (
      <Card key={regional.id} className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">{regional.sigla}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-sm text-gray-600">
            <strong>Descrição:</strong> {regional.descricao}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Endereço:</strong> {regional.endereco}
          </p>
          <p className="text-sm text-gray-600">
            <strong>CPF Secretário:</strong> {regional.cpfSecretario}
          </p>
        </CardContent>
        <div className="flex gap-2 p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleEdit(regional)}
          >
            <Edit className="w-4 h-4 mr-2" /> Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 hover:text-red-700"
            onClick={() => handleDelete(regional.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Excluir
          </Button>
        </div>
      </Card>
    ))}
  </div>
);

const Regionais = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [regionais, setRegionais] = useState(mockRegionais);
  const [showForm, setShowForm] = useState(false);
  const [editingRegional, setEditingRegional] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Itens por página na visualização de lista

  // if (!user || user.role !== 'cegor') {
  //   return (
  //     <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
  //       <p className="text-red-600 font-medium">Acesso negado. Apenas usuários CEGOR podem acessar esta página.</p>
  //     </div>
  //   );
  // }

  const filteredRegionais = regionais.filter(
    (regional) =>
      regional.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regional.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de Paginação para a Lista
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListItems = filteredRegionais.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRegionais.length / itemsPerPage);

  const handleEdit = (regional) => {
    setEditingRegional(regional);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta regional?")) {
      setRegionais(regionais.filter((r) => r.id !== id));
    }
  };

  const handleSave = (data) => {
    if (editingRegional) {
      setRegionais(
        regionais.map((r) =>
          r.id === editingRegional.id ? { ...data, id: editingRegional.id } : r
        )
      );
    } else {
      setRegionais([...regionais, { ...data, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingRegional(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciar Regionais
        </h1>
        <Button
          onClick={() => {
            setEditingRegional(null);
            setShowForm(true);
          }}
          className="bg-[#0B5CF0] hover:bg-[#0B5CF0]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Regional
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-700">
            <Search className="w-5 h-5" />
            Filtrar Regionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por sigla ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredRegionais.length} regionais encontradas
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
        {filteredRegionais.length > 0 ? (
          viewMode === "grid" ? (
            <GridView
              regionais={filteredRegionais}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <div className="space-y-4">
              <ListView
                regionais={currentListItems}
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
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      />
                    </PaginationItem>
                    {[...Array(totalPages).keys()].map((number) => (
                      <PaginationItem key={number + 1}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(number + 1);
                          }}
                          isActive={currentPage === number + 1}
                        >
                          {number + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          );
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
            <p className="text-gray-500">Nenhuma regional encontrada.</p>
          </div>
        )}
      </div>

      {showForm && (
        <RegionalForm
          regional={editingRegional}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingRegional(null);
          }}
        />
      )}
    </div>
  );
};

export default Regionais;
