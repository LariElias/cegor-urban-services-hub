import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

// Schema de validação para os novos campos
const vistoriaFinalSchema = z.object({
  real_start_date: z.string().min(1, 'Data de início é obrigatória'),
  real_end_date: z.string().min(1, 'Data de fim é obrigatória'),
  real_start_shift: z.string().min(1, 'Turno de início é obrigatório'),
  total_time_spent: z.string().min(1, 'Tempo total é obrigatório'),
  selected_team: z.string().min(1, 'A seleção da equipe é obrigatória'),
  inspection_responsible: z.string(),
  inspection_date: z.string().min(1, 'Data da vistoria é obrigatória'),
  reproval_reason: z.string().optional(),
});

type VistoriaFinalFormData = z.infer<typeof vistoriaFinalSchema>;

export default function VistoriaFinal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isReproveOpen, setIsReproveOpen] = useState(false);
  const [formData, setFormData] = useState<VistoriaFinalFormData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger, // Adicionado para validação manual
    getValues, // Adicionado para pegar os valores do formulário
    formState: { errors },
  } = useForm<VistoriaFinalFormData>({
    resolver: zodResolver(vistoriaFinalSchema),
    defaultValues: {
      inspection_responsible: user?.name || 'Demostenes Araujo Ferreira',
    }
  });

  const reprovalReason = watch('reproval_reason');

  // Mock data
  const teams = [
    { id: '1', name: 'Equipe Alpha' },
    { id: '2', name: 'Equipe Bravo' },
    { id: '3', name: 'Equipe Charlie' },
  ];

  const teamInfo = {
    funcionarios: ['Antonio Joao', 'Maria Ana', 'Carlos Joao', 'Antonio Joao'],
    datas: ['13/10/2024', '09/10/2024', '12/09/2024', '31/10/2024'],
    turnos: ['Manhã', 'Tarde', 'Noite', 'Tarde'],
  };

  useEffect(() => {
    if (user?.name) {
      setValue('inspection_responsible', user.name);
    }
  }, [user, setValue]);

  const handleOpenApproveModal = async () => {
    const isValid = await trigger(); // Valida o formulário
    if (isValid) {
      setFormData(getValues()); // Pega os dados válidos
      setIsApproveOpen(true); // Abre o modal
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
    // Lógica para submeter os dados da vistoria final como APROVADA
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
    // Lógica para submeter os dados da vistoria final como REPROVADA
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
          <CardTitle className="">
            Vistoria final
          </CardTitle>
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
            
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações da equipe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="selected_team">Equipe selecionada</Label>
                        <select id="selected_team" {...register('selected_team')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Selecione a equipe</option>
                            {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                        </select>
                        {errors.selected_team && <p className="text-sm text-red-500">{errors.selected_team.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <Label className="font-semibold">Funcionários:</Label>
                        {teamInfo.funcionarios.map((func, index) => <p key={index} className="bg-yellow-100 p-2 rounded mt-1">{func}</p>)}
                    </div>
                    <div>
                        <Label className="font-semibold">Data:</Label>
                        {teamInfo.datas.map((data, index) => <p key={index} className="bg-yellow-100 p-2 rounded mt-1">{data}</p>)}
                    </div>
                    <div>
                        <Label className="font-semibold">Turno da falta:</Label>
                        {teamInfo.turnos.map((turno, index) => <p key={index} className="bg-yellow-100 p-2 rounded mt-1">{turno}</p>)}
                    </div>
                </div>
            </div>

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

      {/* Dialog de Aprovação */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Vistoria</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Você confirma a vistoria e a ocorrência aprovada?</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Voltar</Button>
            <Button onClick={handleConfirmApproval} className="bg-green-600 hover:bg-green-700">Confirmar</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de Reprovação */}
      <Dialog open={isReproveOpen} onOpenChange={setIsReproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Vistoria</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Label htmlFor="reproval_reason">Descreva um resumo do por que da sua desaprovação</Label>
            <Textarea 
              id="reproval_reason" 
              {...register('reproval_reason')}
              placeholder="Descreva o motivo aqui..."
            />
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
