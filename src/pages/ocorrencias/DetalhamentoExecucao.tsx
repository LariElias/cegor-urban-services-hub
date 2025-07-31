
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

const detalhamentoSchema = z.object({
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().min(1, 'Data de fim é obrigatória'),
  total_hours: z.string().min(1, 'Tempo real total é obrigatório'),
  observations: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  inspector_id: z.string().optional(),
  inspection_date: z.string().optional(),
});

type DetalhamentoFormData = z.infer<typeof detalhamentoSchema>;

export default function DetalhamentoExecucao() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [attachments, setAttachments] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DetalhamentoFormData>({
    resolver: zodResolver(detalhamentoSchema),
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  // Mock data - ZGL inspectors
  const inspectors = [
    { id: '1', name: 'João Silva - ZGL Centro' },
    { id: '2', name: 'Maria Santos - ZGL Norte' },
    { id: '3', name: 'Pedro Costa - ZGL Sul' },
  ];

  // Calculate total hours automatically
  React.useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
      setValue('total_hours', diffInHours.toString());
    }
  }, [startDate, endDate, setValue]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments = files.map(file => URL.createObjectURL(file));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const onSubmit = (data: DetalhamentoFormData) => {
    console.log('Detalhamento salvo:', data);
    // Em produção, atualizar status da ocorrência para 'concluida'
    navigate('/ocorrencias');
  };

  // if (user?.role !== 'regional') {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <p className="text-muted-foreground">Acesso negado. Apenas usuários regionais podem detalhar execuções.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/ocorrencias')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Detalhamento da Execução</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Registro de Execução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Data Real de Início *</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  {...register('start_date')}
                />
                {errors.start_date && (
                  <p className="text-sm text-red-500">{errors.start_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Data Real de Fim *</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  {...register('end_date')}
                />
                {errors.end_date && (
                  <p className="text-sm text-red-500">{errors.end_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_hours">Tempo Real Total (h) *</Label>
                <Input
                  id="total_hours"
                  type="number"
                  step="0.1"
                  {...register('total_hours')}
                  placeholder="Horas calculadas automaticamente"
                />
                {errors.total_hours && (
                  <p className="text-sm text-red-500">{errors.total_hours.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                {...register('observations')}
                placeholder="Observações sobre a execução"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachments">Anexos (Fotos/Vídeos)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar Fotos/Vídeos
                </Button>
              </div>
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative">
                      <img
                        src={attachment}
                        alt={`Anexo ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Vistoria (Opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inspector_id">Responsável Vistoria (ZGL)</Label>
                  <select
                    id="inspector_id"
                    {...register('inspector_id')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Selecione o responsável</option>
                    {inspectors.map(inspector => (
                      <option key={inspector.id} value={inspector.id}>{inspector.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspection_date">Data da Vistoria</Label>
                  <Input
                    id="inspection_date"
                    type="date"
                    {...register('inspection_date')}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/ocorrencias')}>
                Cancelar
              </Button>
              <Button type="submit">
                Concluir Execução
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
