import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  Phone,
  Mail,
} from "lucide-react";

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
import { FiscalForm } from "@/components/forms/FiscalForm"; // Supondo que você tenha este formulário
import {
  isCegorGestor,
  isCegorOperador,
  isRegionalGestor,
  isSuperAdm,
} from "@/types";

// Mock data com 10 fiscais para uma melhor visualização
const mockFiscais = [
  {
    id: "1",
    codigo: "FIS001",
    nome: "João Silva",
    cpf: "123.456.789-01",
    email: "joao.silva@example.com",
    telefone: "(85) 99999-1111",
    regional_id: "1",
    regional_nome: "Regional 01",
  },
  {
    id: "2",
    codigo: "FIS002",
    nome: "Maria Santos",
    cpf: "987.654.321-02",
    email: "maria.santos@example.com",
    telefone: "(85) 98888-2222",
    regional_id: "2",
    regional_nome: "Regional 02",
  },
  {
    id: "3",
    codigo: "FIS003",
    nome: "Carlos Pereira",
    cpf: "111.222.333-03",
    email: "carlos.pereira@example.com",
    telefone: "(85) 97777-3333",
    regional_id: "3",
    regional_nome: "Regional 03",
  },
  {
    id: "4",
    codigo: "FIS004",
    nome: "Ana Oliveira",
    cpf: "444.555.666-04",
    email: "ana.oliveira@example.com",
    telefone: "(85) 96666-4444",
    regional_id: "4",
    regional_nome: "Regional 04",
  },
  {
    id: "5",
    codigo: "FIS005",
    nome: "Pedro Costa",
    cpf: "777.888.999-05",
    email: "pedro.costa@example.com",
    telefone: "(85) 95555-5555",
    regional_id: "1",
    regional_nome: "Regional 01",
  },
  {
    id: "6",
    codigo: "FIS006",
    nome: "Juliana Almeida",
    cpf: "121.314.151-06",
    email: "juliana.almeida@example.com",
    telefone: "(85) 94444-6666",
    regional_id: "2",
    regional_nome: "Regional 02",
  },
  {
    id: "7",
    codigo: "FIS007",
    nome: "Ricardo Lima",
    cpf: "617.181.920-07",
    email: "ricardo.lima@example.com",
    telefone: "(85) 93333-7777",
    regional_id: "5",
    regional_nome: "Regional 05",
  },
  {
    id: "8",
    codigo: "FIS008",
    nome: "Fernanda Souza",
    cpf: "212.223.242-08",
    email: "fernanda.souza@example.com",
    telefone: "(85) 92222-8888",
    regional_id: "6",
    regional_nome: "Regional 06",
  },
  {
    id: "9",
    codigo: "FIS009",
    nome: "Lucas Martins",
    cpf: "526.272.829-09",
    email: "lucas.martins@example.com",
    telefone: "(85) 91111-9999",
    regional_id: "5",
    regional_nome: "Regional 05",
  },
  {
    id: "10",
    codigo: "FIS010",
    nome: "Beatriz Gonçalves",
    cpf: "303.132.333-10",
    email: "beatriz.goncalves@example.com",
    telefone: "(85) 99988-7766",
    regional_id: "4",
    regional_nome: "Regional 04",
  },
];

// Componente para a visualização em Lista (Tabela)
const ListView = ({
  fiscais,
  handleEdit,
  handleDelete,
  showRegionalColumn,
}) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="hidden sm:table-cell">CPF</TableHead>
          <TableHead className="hidden md:table-cell">Contato</TableHead>
          {showRegionalColumn && (
            <TableHead className="hidden lg:table-cell">Regional</TableHead>
          )}
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fiscais.map((fiscal) => (
          <TableRow key={fiscal.id}>
            <TableCell className="font-medium">
              {fiscal.nome}
              <p className="text-xs text-gray-500 sm:hidden">{fiscal.cpf}</p>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{fiscal.cpf}</TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3 h-3 text-gray-500" /> {fiscal.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3 h-3 text-gray-500" /> {fiscal.telefone}
              </div>
            </TableCell>
            {showRegionalColumn && (
              <TableCell className="hidden lg:table-cell">
                {fiscal.regional_nome}
              </TableCell>
            )}
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(fiscal)}
                  aria-label="Editar"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(fiscal.id)}
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
const GridView = ({ fiscais, handleEdit, handleDelete }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {fiscais.map((fiscal) => (
      <Card key={fiscal.id} className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">{fiscal.nome}</CardTitle>
          <p className="text-sm text-gray-500">
            {fiscal.codigo} | {fiscal.cpf}
          </p>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" /> {fiscal.email}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-500" /> {fiscal.telefone}
          </div>
          <p className="text-sm text-gray-600 pt-2">
            <strong>Regional:</strong> {fiscal.regional_nome}
          </p>
        </CardContent>
        <div className="flex gap-2 p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleEdit(fiscal)}
          >
            <Edit className="w-4 h-4 mr-2" /> Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 hover:text-red-700"
            onClick={() => handleDelete(fiscal.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Excluir
          </Button>
        </div>
      </Card>
    ))}
  </div>
);

const Fiscais = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegional, setSelectedRegional] = useState("");
  const [fiscais, setFiscais] = useState(mockFiscais);
  const [showForm, setShowForm] = useState(false);
  const [editingFiscal, setEditingFiscal] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const canEdit =
    isCegorGestor(user) ||
    isCegorOperador(user) ||
    isRegionalGestor(user) ||
    isSuperAdm(user);
  const canCreate = canEdit;
  const showRegionalFilter =
    isCegorGestor(user) || isCegorOperador(user) || isSuperAdm(user);

  const filteredFiscais = fiscais.filter((fiscal) => {
    // if (user?.role === "regional" && user.regional_id !== fiscal.regional_id) {
    //   return false;
    // }
    const matchesSearch =
      fiscal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fiscal.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fiscal.cpf.includes(searchTerm);
    const matchesRegional =
      !selectedRegional || fiscal.regional_id === selectedRegional;

    return matchesSearch && matchesRegional;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListItems = filteredFiscais.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredFiscais.length / itemsPerPage);

  const handleEdit = (fiscal) => {
    setEditingFiscal(fiscal);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este fiscal?")) {
      setFiscais(fiscais.filter((f) => f.id !== id));
    }
  };

  const handleSave = (data) => {
    if (editingFiscal) {
      setFiscais(
        fiscais.map((f) =>
          f.id === editingFiscal.id ? { ...data, id: editingFiscal.id } : f
        )
      );
    } else {
      setFiscais([
        ...fiscais,
        {
          ...data,
          id: Date.now().toString(),
          codigo: `FIS${(fiscais.length + 1).toString().padStart(3, "0")}`,
        },
      ]);
    }
    setShowForm(false);
    setEditingFiscal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Fiscais</h1>
        {canCreate && (
          <Button
            onClick={() => {
              setEditingFiscal(null);
              setShowForm(true);
            }}
            className="bg-[#0B5CF0] hover:bg-[#0B5CF0]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Fiscal
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-700">
            <Search className="w-5 h-5" />
            Filtrar Fiscais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por nome, código ou CPF..."
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
          {filteredFiscais.length} fiscais encontrados
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
            <List className="w-5 w-5" />
          </Button>
        </div>
      </div>

      <div>
        {filteredFiscais.length > 0 ? (
          viewMode === "grid" ? (
            <GridView
              fiscais={filteredFiscais}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <div className="space-y-4">
              <ListView
                fiscais={currentListItems}
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
            <p className="text-gray-500">Nenhum fiscal encontrado.</p>
          </div>
        )}
      </div>

      {showForm && (
        <FiscalForm
          fiscal={editingFiscal}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingFiscal(null);
          }}
        />
      )}
    </div>
  );
};

export default Fiscais;
