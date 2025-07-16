
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia } from '@/types';

const ocorrenciaSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  service_type: z.string().min(1, 'Tipo de serviço é obrigatório'),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']),
  address: z.string().min(1, 'Endereço é obrigatório'),
  equipment_id: z.string().optional(),
  requester_name: z.string().min(1, 'Nome do solicitante é obrigatório'),
  requester_phone: z.string().min(1, 'Telefone do solicitante é obrigatório'),
  observations: z.string().optional(),
  should_schedule: z.boolean().default(false),
});

type OcorrenciaFormData = z.infer<typeof ocorrenciaSchema>;

export default function NovaOcorrencia() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [createdOcorrencia, setCreatedOcorrencia] = useState<Ocorrencia | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OcorrenciaFormData>({
    resolver: zodResolver(ocorrenciaSchema),
  });

  const shouldSchedule = watch('should_schedule');

  const onSubmit = (data: OcorrenciaFormData) => {
    const newOcorrencia: Ocorrencia = {
      id: Date.now().toString(),
      protocol: `OCR-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      description: data.description,
      service_type: data.service_type,
      priority: data.priority,
      status: 'criada',
      address: data.address,
      equipamento_id: data.equipment_id,
      regional_id: user?.regional_id || '1',
      fiscal_id: '1', // Em produção, seria selecionado
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCreatedOcorrencia(newOcorrencia);

    if (data.should_schedule) {
      // Navegar para página de agendamento
      navigate(`/ocorrencias/${newOcorrencia.id}/agendamento`);
    } else {
      // Voltar para lista
      navigate('/ocorrencias');
    }
  };

  // Verificar permissões
  if (user?.role !== 'regional') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Apenas usuários regionais podem criar ocorrências.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/ocorrencias')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Nova Ocorrência</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Ocorrência</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="Descreva o serviço solicitado"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_type">Tipo de Serviço *</Label>
                <select
                  id="service_type"
                  {...register('service_type')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Limpeza">Limpeza</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Conservação">Conservação</option>
                  <option value="Emergência">Emergência</option>
                </select>
                {errors.service_type && (
                  <p className="text-sm text-red-500">{errors.service_type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade *</Label>
                <select
                  id="priority"
                  {...register('priority')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione a prioridade</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
                {errors.priority && (
                  <p className="text-sm text-red-500">{errors.priority.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Endereço completo"
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requester_name">Nome do Solicitante *</Label>
                <Input
                  id="requester_name"
                  {...register('requester_name')}
                  placeholder="Nome completo"
                />
                {errors.requester_name && (
                  <p className="text-sm text-red-500">{errors.requester_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requester_phone">Telefone do Solicitante *</Label>
                <Input
                  id="requester_phone"
                  {...register('requester_phone')}
                  placeholder="(31) 9999-9999"
                />
                {errors.requester_phone && (
                  <p className="text-sm text-red-500">{errors.requester_phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <textarea
                id="observations"
                {...register('observations')}
                placeholder="Informações adicionais"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="should_schedule"
                checked={shouldSchedule}
                onCheckedChange={(checked) => setValue('should_schedule', checked as boolean)}
              />
              <Label htmlFor="should_schedule" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Deseja agendar esta ocorrência?
              </Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/ocorrencias')}>
                Cancelar
              </Button>
              <Button type="submit">
                {shouldSchedule ? 'Salvar e Agendar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
