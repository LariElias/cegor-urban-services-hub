import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DailyEntry {
  id: string;
  date: string; // Alterado para string e agora obrigatório
  description: string;
  absent_employees_count: number;
  photos_before: string[];
  photos_after: string[];
}

const AcompanhamentoDiario = () => {
  const [description, setDescription] = useState('');
  const [absentEmployeesCount, setAbsentEmployeesCount] = useState<number | undefined>(0);
  const [photosBefore, setPhotosBefore] = useState<string[]>([]);
  const [photosAfter, setPhotosAfter] = useState<string[]>([]);
  const [date, setDate] = React.useState<Date>();

  const mockDailyEntries: DailyEntry[] = [
    {
      id: "1",
      date: "2024-01-15", // Campo obrigatório agora
      description: "Início dos trabalhos de limpeza na área designada",
      absent_employees_count: 2,
      photos_before: ["/placeholder.svg", "/placeholder.svg"],
      photos_after: ["/placeholder.svg"]
    },
    {
      id: "2", 
      date: "2024-01-16", // Campo obrigatório agora
      description: "Continuação dos serviços - área parcialmente concluída",
      absent_employees_count: 1,
      photos_before: ["/placeholder.svg"],
      photos_after: ["/placeholder.svg", "/placeholder.svg"]
    }
  ];

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleAbsentEmployeesCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAbsentEmployeesCount(isNaN(value) ? undefined : value);
  };

  const handlePhotosBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com o upload de fotos "antes"
    console.log('Fotos antes:', e.target.files);
  };

  const handlePhotosAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com o upload de fotos "depois"
    console.log('Fotos depois:', e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar os dados do acompanhamento diário
    console.log('Enviando dados:', {
      date,
      description,
      absentEmployeesCount,
      photosBefore,
      photosAfter
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <h1 className="text-2xl font-bold">Acompanhamento Diário</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Entrada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2020-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Detalhe as atividades realizadas hoje..."
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
            <div>
              <Label htmlFor="absentEmployeesCount">Número de Funcionários Ausentes</Label>
              <Input
                type="number"
                id="absentEmployeesCount"
                placeholder="0"
                value={absentEmployeesCount === undefined ? '' : absentEmployeesCount.toString()}
                onChange={handleAbsentEmployeesCountChange}
              />
            </div>
            <div>
              <Label htmlFor="photosBefore">Fotos Antes</Label>
              <Input
                type="file"
                id="photosBefore"
                multiple
                onChange={handlePhotosBeforeChange}
              />
            </div>
            <div>
              <Label htmlFor="photosAfter">Fotos Depois</Label>
              <Input
                type="file"
                id="photosAfter"
                multiple
                onChange={handlePhotosAfterChange}
              />
            </div>
            <Button type="submit">Salvar Entrada</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Acompanhamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Acompanhamento diário da ocorrência.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ausentes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDailyEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.date}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.absent_employees_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcompanhamentoDiario;
