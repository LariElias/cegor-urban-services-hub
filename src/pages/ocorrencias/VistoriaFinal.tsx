import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Camera, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';

// --- Schema de Validação ---
const vistoriaFinalSchema = z.object({
  real_start_date: z.string().min(1, 'Data de início é obrigatória'),
  real_end_date: z.string().min(1, 'Data de fim é obrigatória'),
  inspection_date: z.string().min(1, 'Data da vistoria é obrigatória'),
  hasMetragemDifference: z.boolean().optional(),
  metragemFinal: z.string().optional(),
  hasCanteiroCentral: z.boolean().optional(), // --- 1. ADICIONADO: Declarar o campo no schema
  reproval_reason: z.string().optional(),
  final_photo: z.instanceof(FileList).optional(),
}).superRefine((data, ctx) => {
  if (data.hasMetragemDifference && !data.metragemFinal?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A metragem final é obrigatória quando há diferença.',
      path: ['metragemFinal'],
    });
  }
});

type VistoriaFinalFormData = z.infer<typeof vistoriaFinalSchema>;

// --- Interfaces e Dados Mockados ---
interface AbsenceData {
  date: string;
  quantity: number;
}

const occurrenceData = {
    protocolo: '2024-08-A45',
    tipoServico: 'Especial',
    bairro: 'Centro',
    prioridade: 'Alta',
    atividades: [
        { descricao: 'Serviço Capinação em pavimentação poliédrica' },
        { descricao: 'Serviço Capinação sem pavimentação (terra natural)' },
    ],
};

const mockAbsences: AbsenceData[] = [
  { date: '2025-08-01', quantity: 3 },
  { date: '2025-07-31', quantity: 1 },
];

// --- Componente ListaFaltas ---
const ListaFaltas = ({ data }: { data: AbsenceData[] }) => {
  if (!data || data.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-slate-800">Resumo de Faltas de Funcionários</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="border rounded-md px-4 py-3 flex justify-between items-center bg-slate-50">
            <span className="font-medium text-sm text-slate-700">
              {new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <Badge variant="destructive">{item.quantity} Falta{item.quantity > 1 ? 's' : ''}</Badge>
          </div>
        ))}
      </div>
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
      hasMetragemDifference: false,
      metragemFinal: '',
      hasCanteiroCentral: false, // --- 2. ADICIONADO: Definir valor padrão
    }
  });

  const reprovalReason = watch('reproval_reason');
  const photoFile = watch('final_photo');
  const hasMetragemDifference = watch('hasMetragemDifference');
  const hasCanteiroCentral = watch('hasCanteiroCentral'); // --- 3. ADICIONADO: Monitorar o valor

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
    if (!hasMetragemDifference) {
      setValue('metragemFinal', '', { shouldValidate: true });
    }
  }, [hasMetragemDifference, setValue]);

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
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/ocorrencias')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Vistoria Final</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ocorrência OCR-2024-015</CardTitle>
          </CardHeader>
          <CardContent>
              {/* Seção de Detalhes da Ocorrência */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                  <div className="flex flex-col">
                      <span className="font-semibold text-slate-500">PROTOCOLO</span>
                      <span className="text-slate-800 font-medium">{occurrenceData.protocolo}</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="font-semibold text-slate-500">TIPO DE SERVIÇO</span>
                      <span className="text-slate-800 font-medium">{occurrenceData.tipoServico}</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="font-semibold text-slate-500">BAIRRO</span>
                      <span className="text-slate-800 font-medium">{occurrenceData.bairro}</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="font-semibold text-slate-500">PRIORIDADE</span>
                      <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          <span className="text-slate-800 font-medium">{occurrenceData.prioridade}</span>
                      </span>
                  </div>
                   <div className="col-span-2 md:col-span-4 flex flex-col pt-2">
                      <span className="font-semibold text-slate-500">ATIVIDADES</span>
                      <span className="text-slate-800 font-medium">
                        {occurrenceData.atividades.map(item => item.descricao).join(', ')}
                      </span>
                   </div>
              </div>
              
              <hr className="mb-8" />

            {/* Início do Formulário */}
            <form onSubmit={handleSubmit(handleConfirmApproval)} className="space-y-8">
              
              {/* Seção de Datas */}
              <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <Label htmlFor="inspection_date">Data da vistoria *</Label>
                          <Input id="inspection_date" type="date" {...register('inspection_date')} />
                          {errors.inspection_date && <p className="text-sm text-red-500">{errors.inspection_date.message}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="real_start_date">Data real do início *</Label>
                          <Input id="real_start_date" type="date" {...register('real_start_date')} />
                          {errors.real_start_date && <p className="text-sm text-red-500">{errors.real_start_date.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="real_end_date">Data real do Fim *</Label>
                          <Input id="real_end_date" type="date" {...register('real_end_date')} />
                          {errors.real_end_date && <p className="text-sm text-red-500">{errors.real_end_date.message}</p>}
                      </div>
                  </div>
              </div>

              <hr />

              {/* Seção de Faltas */}
              <ListaFaltas data={mockAbsences} />

              <hr />

              {/* Seção de Medição e Canteiro */}
              <div className="space-y-4">
                  <h3 className="text-base font-semibold text-slate-800">Detalhes Adicionais</h3>
                  <div className="flex items-center space-x-3 pt-4">
                      <Checkbox
                          id="hasCanteiroCentral"
                          checked={hasCanteiroCentral}
                          onCheckedChange={(checked) => setValue('hasCanteiroCentral', checked as boolean)}
                      />
                      <Label htmlFor="hasCanteiroCentral" className="cursor-pointer font-medium">
                          Existe canteiro central?
                      </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                      <Checkbox
                          id="hasMetragemDifference"
                          checked={hasMetragemDifference}
                          onCheckedChange={(checked) => setValue('hasMetragemDifference', checked as boolean, { shouldValidate: true })}
                      />
                      <Label htmlFor="hasMetragemDifference" className="font-medium cursor-pointer">
                          Existe diferença entre a metragem final e a metragem inicial?
                      </Label>
                  </div>

                  {hasMetragemDifference && (
                      <div className="pl-8 animate-in fade-in-50 duration-300">
                          <Label htmlFor="metragemFinal">Metragem Final *</Label>
                          <Input
                              id="metragemFinal"
                              {...register('metragemFinal')}
                              placeholder="Ex: 1500m"
                              className="mt-2"
                          />
                          {errors.metragemFinal && <p className="text-sm text-red-500 mt-1">{errors.metragemFinal.message}</p>}
                      </div>
                  )}


              </div>

              <hr />

              {/* Seção de Foto Final */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800">Foto Final da Ocorrência</h3>
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
                    <div className="w-24 h-24 border rounded-md overflow-hidden">
                      <img src={photoPreview} alt="Pré-visualização" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                {errors.final_photo && <p className="text-sm text-red-500">{errors.final_photo.message}</p>}
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-start space-x-3 pt-4 border-t">
                <Button type="button" onClick={handleOpenApproveModal} className="bg-green-600 hover:bg-green-700">
                  Aprovar Vistoria
                </Button>
                <Button type="button" variant="destructive" onClick={handleOpenReproveModal}>
                  Reprovar Vistoria
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Diálogos de Aprovação e Reprovação */}
        <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Aprovar Vistoria</DialogTitle></DialogHeader>
            <div className="py-4"><p>Você confirma a aprovação desta vistoria?</p></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancelar</Button>
              <Button onClick={handleConfirmApproval} className="bg-green-600 hover:bg-green-700">Confirmar Aprovação</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isReproveOpen} onOpenChange={setIsReproveOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Reprovar Vistoria</DialogTitle></DialogHeader>
            <div className="py-4 space-y-4">
              <Label htmlFor="reproval_reason">Descreva o motivo da reprovação *</Label>
              <Textarea id="reproval_reason" {...register('reproval_reason')} placeholder="Explique por que a vistoria não pode ser aprovada..."/>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReproveOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleConfirmReproval}>Confirmar Reprovação</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}