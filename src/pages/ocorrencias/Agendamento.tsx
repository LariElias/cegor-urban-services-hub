
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

const agendamentoSchema = z.object({
  empresa_id: z.string().min(1, 'Empresa responsável é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  available_date: z.string().min(1, 'Data disponível é obrigatória'),
  quantity_days: z.string().optional(),
  observations: z.string().optional(),
});

type AgendamentoFormData = z.infer<typeof agendamentoSchema>;

export default function Agendamento() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgendamentoFormData>({
    resolver: zodResolver(agendamentoSchema),
  });

  // Mock data - em produção viria da API filtrada pela regional
  const empresas = [
    { id: '1', name: 'Empresa Limpeza BH' },
    { id: '2', name: 'Serviços Urbanos Ltda' },
    { id: '3', name: 'Manutenção e Conservação S.A.' },
  ];

  const onSubmit = (data: AgendamentoFormData) => {
    console.log('Agendamento salvo:', data);
    // Em produção, atualizar status da ocorrência para 'agendada'
    navigate('/ocorrencias');
  };

  if (user?.role !== 'regional') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Apenas usuários regionais podem agendar ocorrências.</p>
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
        <h1 className="text-3xl font-bold">Agendamento de Ocorrência</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agendar Execução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresa_id">Empresa Responsável *</Label>
                <select
                  id="empresa_id"
                  {...register('empresa_id')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecione a empresa</option>
                  {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>{empresa.name}</option>
                  ))}
                </select>
                {errors.empresa_id && (
                  <p className="text-sm text-red-500">{errors.empresa_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="available_date">Data Disponível *</Label>
                <Input
                  id="available_date"
                  type="date"
                  {...register('available_date')}
                />
                {errors.available_date && (
                  <p className="text-sm text-red-500">{errors.available_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity_days">Quantidade de Dias</Label>
                <Input
                  id="quantity_days"
                  type="number"
                  {...register('quantity_days')}
                  placeholder="Número de dias estimados"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva o serviço a ser executado"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                {...register('observations')}
                placeholder="Observações adicionais"
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/ocorrencias')}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Agendamento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
