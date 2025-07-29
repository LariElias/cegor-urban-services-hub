import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Camera, AlertTriangle, Sun, Moon, Sunset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

const vistoriaFinalSchema = z.object({
  real_start_date: z.string().min(1, 'Data de início é obrigatória'),
  real_end_date: z.string().min(1, 'Data de fim é obrigatória'),
  real_start_shift: z.string().min(1, 'Turno de início é obrigatório'),
  total_time_spent: z.string().min(1, 'Tempo total é obrigatório'),
  inspection_responsible: z.string(),
  inspection_date: z.string().min(1, 'Data da vistoria é obrigatória'),
  reproval_reason: z.string().optional(),
  final_photo: z.instanceof(FileList).optional(),
});

type VistoriaFinalFormData = z.infer<typeof vistoriaFinalSchema>;

// ATUALIZAÇÃO 1: Nova estrutura de dados para as faltas
interface AbsenceEntry {
  date: string;
  shifts: {
    diurno?: { name: string }[];
    vespertino?: { name: string }[];
    noturno?: { name: string }[];
  };
}

const mockAbsences: AbsenceEntry[] = [
  {
    date: '2024-10-13',
    shifts: {
      diurno: [{ name: 'Antonio Joao' }, { name: 'Maria Ana' }],
      noturno: [{ name: 'Carlos Joao' }],
    },
  },
  {
    date: '2024-10-09',
    shifts: {
      tarde: [{ name: 'Antonio Joao' }],
    },
  },
];

// ATUALIZAÇÃO 2: Novo componente para renderizar o Accordion de Faltas
const FaltasAccordion = ({ data }: { data: AbsenceEntry[] }) => {
  const calculateTotalAbsences = (entry: AbsenceEntry) => {
    return Object.values(entry.shifts).reduce((total, shift) => {
      return total + (shift?.length || 0);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Falta de funcionários</h3>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {data.map((entry, index) => {
          const totalFaltas = calculateTotalAbsences(entry);
          if (totalFaltas === 0) return null;

          return (
            <AccordionItem value={`item-${index}`} key={index} className="border rounded-md px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between w-full items-center pr-4">
                  <span className="font-semibold">
                    {new Date(entry.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  <Badge variant="destructive">{totalFaltas} Falta{totalFaltas > 1 ? 's' : ''}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="space-y-4">
                  {Object.entries(entry.shifts).map(([turno, faltas]) => (
                    (faltas && faltas.length > 0) && (
                      <div key={turno}>
                        <h4 className="font-semibold text-sm flex items-center gap-2 text-slate-700">
                          {turno === 'diurno' ? <Sun size={16}/> : turno === 'vespertino' ? <Sunset size={16}/> : <Moon size={16}/>}
                          Turno {turno.charAt(0).toUpperCase() + turno.slice(1)}
                        </h4>
                        <ul className="mt-1 pl-5 space-y-1">
                          {faltas.map((func, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              {func.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};


export default function VistoriaFinal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isReproveOpen, setIsReproveOpen] = useState(false);
  const [formData, setFormData] = useState<VistoriaFinalFormData | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<VistoriaFinalFormData>({
    resolver: zodResolver(vistoriaFinalSchema),
    defaultValues: {
      inspection_responsible: user?.name || 'Demostenes Araujo Ferreira',
    }
  });

  const reprovalReason = watch('reproval_reason');
  const photoFile = watch('final_photo');

  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setPhotoPreview(null);
    }
  }, [photoFile]);

  useEffect(() => {
    if (user?.name) {
      setValue('inspection_responsible', user.name);
    }
  }, [user, setValue]);

  const handleOpenApproveModal = async () => {
    const isValid = await trigger();
    if (isValid) {
      setFormData(getValues());
      setIsApproveOpen(true);
    }
  };

  const handleOpenReproveModal = async () => {
    const isValid = await trigger();
    if (isValid) {
      setFormData(getValues());
      setIsReproveOpen(true);
    }
  };

  const handleConfirmApproval = () => {
    if (!formData) return;
    console.log('Vistoria Aprovada:', formData);
    setIsApproveOpen(false);
    navigate('/ocorrencias');
  };

  const handleConfirmReproval = () => {
    if (!formData) return;
    if (!reprovalReason || !reprovalReason.trim()) {
        alert("O motivo da reprovação é obrigatório.");
        return;
    }
    const finalData = { ...formData, reproval_reason: reprovalReason };
    console.log('Vistoria Reprovada:', finalData);
    setIsReproveOpen(false);
    navigate('/ocorrencias');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/ocorrencias')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Vistoria Final</h1>
      </div>

      <Card>
        <CardHeader className="rounded-t-lg">
          <CardTitle>Ocorrência OCR-2024-015 </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="real_start_date">Data real do início</Label>
                <Input id="real_start_date" type="date" {...register('real_start_date')} />
                {errors.real_start_date && <p className="text-sm text-red-500">{errors.real_start_date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="real_end_date">Data real do Fim</Label>
                <Input id="real_end_date" type="date" {...register('real_end_date')} />
                {errors.real_end_date && <p className="text-sm text-red-500">{errors.real_end_date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="real_start_shift">Turno Real Início</Label>
                <select id="real_start_shift" {...register('real_start_shift')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Selecione o turno</option>
                    <option value="Diurno">Diurno</option>
                    <option value="Noturno">Noturno</option>
                </select>
                {errors.real_start_shift && <p className="text-sm text-red-500">{errors.real_start_shift.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_time_spent">Tempo Real total gasto (em horas)</Label>
                <Input id="total_time_spent" type="number" {...register('total_time_spent')} placeholder="Ex: 8" />
                {errors.total_time_spent && <p className="text-sm text-red-500">{errors.total_time_spent.message}</p>}
              </div>
            </div>

            <hr className="my-4" />
            
            {/* ATUALIZAÇÃO 3: Seção de faltas substituída pelo novo componente */}
            <FaltasAccordion data={mockAbsences} />

            <hr className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="total_hours_calculated">Cálculo do total de horas da ocorrência</Label>
                    <Input id="total_hours_calculated" value="12 horas" disabled className="bg-gray-100" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="inspection_responsible">Responsável Vistoria (ZGL vistoria):</Label>
                    <Input id="inspection_responsible" {...register('inspection_responsible')} disabled className="bg-gray-100" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="inspection_date">Data da vistoria:</Label>
                    <Input id="inspection_date" type="date" {...register('inspection_date')} />
                    {errors.inspection_date && <p className="text-sm text-red-500">{errors.inspection_date.message}</p>}
                </div>
            </div>

            <hr className="my-4" />
            <div className="space-y-4">
              <Label htmlFor="final_photo" className="text-lg font-semibold">Foto Final da Ocorrência</Label>
              <div className="flex items-center gap-4">
                <Label htmlFor="final_photo" className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                  <Camera className="w-4 h-4" />
                  Selecionar Foto
                </Label>
                <Input 
                  id="final_photo" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  {...register('final_photo')} 
                />
                {photoPreview && (
                  <div className="w-32 h-32 border rounded-md overflow-hidden">
                    <img src={photoPreview} alt="Pré-visualização" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {errors.final_photo && <p className="text-sm text-red-500">{errors.final_photo.message}</p>}
            </div>

            <div className="flex justify-start space-x-2 pt-4">
              <Button type="button" onClick={handleOpenApproveModal} className="bg-green-600 hover:bg-green-700">
                Aprovar Vistoria
              </Button>
              <Button type="button" variant="destructive" onClick={handleOpenReproveModal}>
                Reprovar Vistoria
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Aprovar Vistoria</DialogTitle></DialogHeader>
          <div className="py-4"><p>Você confirma a vistoria e a ocorrência aprovada?</p></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Voltar</Button>
            <Button onClick={handleConfirmApproval} className="bg-green-600 hover:bg-green-700">Confirmar</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isReproveOpen} onOpenChange={setIsReproveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reprovar Vistoria</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <Label htmlFor="reproval_reason">Descreva um resumo do por que da sua desaprovação</Label>
            <Textarea id="reproval_reason" {...register('reproval_reason')} placeholder="Descreva o motivo aqui..."/>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReproveOpen(false)}>Voltar</Button>
            <Button variant="destructive" onClick={handleConfirmReproval}>Reprovar</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
