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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Importando componentes do Dialog
import { EquipamentoForm } from "@/components/forms/EquipamentoForm";
import {
  isCegorGestor,
  isCegorOperador,
  isRegionalGestor,
  isSuperAdm,
  isCegorGerente
} from "@/types";

// Mock data com 10 equipamentos para uma melhor visualização
const mockEquipamentos = [
  {
    id: "1",
    codigo: "EQP001",
    nome: "Praça do Ferreira",
    descricao: "Praça histórica no centro da cidade",
    tipo: "Praça",
    endereco: "Rua Floriano Peixoto, s/n",
    bairro_nome: "Centro",
    regional_id: "1",
    regional_nome: "Regional 01",
  },
  {
    id: "2",
    codigo: "EQP002",
    nome: "Areninha Campo do América",
    descricao: "Campo de futebol society no Meireles",
    tipo: "Areninha",
    endereco: "Av. Dom Luís, 500",
    bairro_nome: "Meireles",
    latitude: -3.733,
    longitude: -38.492,
    regional_id: "2",
    regional_nome: "Regional 02",
  },
  {
    id: "3",
    codigo: "EQP003",
    nome: "E.M.E.I.F. Rachel de Queiroz",
    descricao: "Escola de ensino fundamental",
    tipo: "Escola",
    endereco: "Rua I, 150",
    bairro_nome: "Messejana",
    latitude: -3.834,
    longitude: -38.499,
    regional_id: "4",
    regional_nome: "Regional 04",
  },
  {
    id: "4",
    codigo: "EQP004",
    nome: "Posto de Saúde Dr. Hélio Goes",
    descricao: "Unidade Básica de Saúde na Barra do Ceará",
    tipo: "UBS",
    endereco: "Rua G, 300",
    bairro_nome: "Barra do Ceará",
    latitude: -3.708,
    longitude: -38.583,
    regional_id: "6",
    regional_nome: "Regional 06",
  },
  {
    id: "5",
    codigo: "EQP005",
    nome: "Parque do Cocó",
    descricao: "Maior parque urbano da América Latina",
    tipo: "Parque",
    endereco: "Av. Padre Antônio Tomás, s/n",
    bairro_nome: "Cocó",
    latitude: -3.753,
    longitude: -38.484,
    regional_id: "5",
    regional_nome: "Regional 05",
  },
  {
    id: "6",
    codigo: "EQP006",
    nome: "Cuca Jangurussu",
    descricao: "Centro Urbano de Cultura, Arte, Ciência e Esporte",
    tipo: "Cuca",
    endereco: "Av. Gov. Leonel Brizola, s/n",
    bairro_nome: "Jangurussu",
    latitude: -3.844,
    longitude: -38.535,
    regional_id: "4",
    regional_nome: "Regional 04",
  },
  {
    id: "7",
    codigo: "EQP007",
    nome: "Praça da Gentilândia",
    descricao: "Praça boêmia no bairro Benfica",
    tipo: "Praça",
    endereco: "Rua Paulino Nogueira, s/n",
    bairro_nome: "Benfica",
    latitude: -3.741,
    longitude: -38.537,
    regional_id: "1",
    regional_nome: "Regional 01",
  },
  {
    id: "8",
    codigo: "EQP008",
    nome: "Areninha do Pici",
    descricao: "Campo de futebol society próximo à UFC",
    tipo: "Areninha",
    endereco: "Rua Pernambuco, s/n",
    bairro_nome: "Pici",
    latitude: -3.748,
    longitude: -38.571,
    regional_id: "3",
    regional_nome: "Regional 03",
  },
  {
    id: "9",
    codigo: "EQP009",
    nome: "E.E.F.M. Adauto Bezerra",
    descricao: "Escola de ensino médio tradicional",
    tipo: "Escola",
    endereco: "Rua Delmiro de Farias, 1000",
    bairro_nome: "Montese",
    latitude: -3.763,
    longitude: -38.548,
    regional_id: "3",
    regional_nome: "Regional 03",
  },
  {
    id: "10",
    codigo: "EQP010",
    nome: "Posto de Saúde Messejana",
    descricao: "Unidade de atendimento primário",
    tipo: "UBS",
    endereco: "Rua Dr. Pergentino Maia, 400",
    bairro_nome: "Messejana",
    latitude: -3.831,
    longitude: -38.502,
    regional_id: "4",
    regional_nome: "Regional 04",
  },
];

const getTipoBadge = (tipo) => {
  const colors = {
    Praça: "bg-green-100 text-green-800",
    Parque: "bg-green-100 text-green-800",
    Areninha: "bg-blue-100 text-blue-800",
    Cuca: "bg-indigo-100 text-indigo-800",
    Escola: "bg-purple-100 text-purple-800",
    UBS: "bg-red-100 text-red-800",
  };
  return colors[tipo] || "bg-gray-100 text-gray-800";
};

// Componente para a visualização em Lista (Tabela)
const ListView = ({
  equipamentos,
  handleEdit,
  handleDelete,
  showRegionalColumn,
}) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="hidden sm:table-cell">Tipo</TableHead>
          <TableHead className="hidden md:table-cell">Bairro</TableHead>
          {showRegionalColumn && (
            <TableHead className="hidden lg:table-cell">Regional</TableHead>
          )}
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipamentos.map((equip) => (
          <TableRow key={equip.id}>
            <TableCell className="font-medium">{equip.nome}</TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge className={getTipoBadge(equip.tipo)}>{equip.tipo}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {equip.bairro_nome}
            </TableCell>
            {showRegionalColumn && (
              <TableCell className="hidden lg:table-cell">
                {equip.regional_nome}
              </TableCell>
            )}
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(equip)}
                  aria-label="Editar"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(equip.id)}
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
const GridView = ({ equipamentos, handleEdit, handleDelete }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {equipamentos.map((equip) => (
      <Card key={equip.id} className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{equip.nome}</CardTitle>
            <Badge className={getTipoBadge(equip.tipo)}>{equip.tipo}</Badge>
          </div>
          <p className="text-sm text-gray-500">{equip.codigo}</p>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-sm text-gray-600">
            <strong>Endereço:</strong> {equip.endereco}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Bairro:</strong> {equip.bairro_nome}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Regional:</strong> {equip.regional_nome}
          </p>
          {/* {equip.latitude && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3" /> {equip.latitude.toFixed(4)},{" "}
              {equip.longitude.toFixed(4)}
            </div>
          )} */}
        </CardContent>
        <div className="flex gap-2 p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleEdit(equip)}
          >
            <Edit className="w-4 h-4 mr-2" /> Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 hover:text-red-700"
            onClick={() => handleDelete(equip.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Excluir
          </Button>
        </div>
      </Card>
    ))}
  </div>
);

const Equipamentos = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegional, setSelectedRegional] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [equipamentos, setEquipamentos] = useState(mockEquipamentos);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const canEdit =
    isCegorGestor(user) ||
    isCegorOperador(user) ||
    isRegionalGestor(user) ||
    isCegorGerente ||
    isSuperAdm(user);
  const canCreate = canEdit;
  const showRegionalFilter =
    isCegorGestor(user) || isCegorOperador(user) || isSuperAdm(user);

  const filteredEquipamentos = equipamentos.filter((equip) => {
    // if (user?.role === 'regional' && user.regional_id !== equip.regional_id) {
    //   return false;
    // }
    const matchesSearch =
      equip.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equip.bairro_nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegional =
      !selectedRegional || equip.regional_id === selectedRegional;
    const matchesTipo = !selectedTipo || equip.tipo === selectedTipo;

    return matchesSearch && matchesRegional && matchesTipo;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListItems = filteredEquipamentos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEquipamentos.length / itemsPerPage);

  const handleEdit = (equipamento) => {
    setEditingEquipamento(equipamento);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingEquipamento(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEquipamento(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este equipamento?")) {
      setEquipamentos(equipamentos.filter((e) => e.id !== id));
    }
  };

  const handleSave = (data) => {
    if (editingEquipamento) {
      setEquipamentos(
        equipamentos.map((e) =>
          e.id === editingEquipamento.id
            ? { ...data, id: editingEquipamento.id }
            : e
        )
      );
    } else {
      setEquipamentos([
        ...equipamentos,
        {
          ...data,
          id: Date.now().toString(),
          codigo: `EQP${(equipamentos.length + 1).toString().padStart(3, "0")}`,
        },
      ]);
    }
    handleFormClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciar Equipamentos
        </h1>
        {canCreate && (
          <Button
            onClick={handleNew}
            className="bg-[#0B5CF0] hover:bg-[#0B5CF0]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Equipamento
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-700">
            <Search className="w-5 h-5" />
            Filtrar Equipamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Buscar por nome, código ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lg:col-span-1"
            />
            {showRegionalFilter && (
              <select
                value={selectedRegional}
                onChange={(e) => setSelectedRegional(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Todas as Regionais</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>
                    Regional {(i + 1).toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            )}
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Todos os Tipos</option>
              <option value="Praça">Praça</option>
              <option value="Areninha">Areninha</option>
              <option value="Escola">Escola</option>
              <option value="UBS">UBS</option>
              <option value="Parque">Parque</option>
              <option value="Cuca">Cuca</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredEquipamentos.length} equipamentos encontrados
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
        {filteredEquipamentos.length > 0 ? (
          viewMode === "grid" ? (
            <GridView
              equipamentos={filteredEquipamentos}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <div className="space-y-4">
              <ListView
                equipamentos={currentListItems}
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
            <p className="text-gray-500">Nenhum equipamento encontrado.</p>
          </div>
        )}
      </div>

      {/* DIALOG PARA O FORMULÁRIO */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingEquipamento ? "Editar Equipamento" : "Novo Equipamento"}
            </DialogTitle>
          </DialogHeader>
          <EquipamentoForm
            equipamento={editingEquipamento}
            onSave={handleSave}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Equipamentos;
