
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

const EquipeSchema = z.object({
  Nome: z.string().min(1, 'Nome é obrigatório'),
  Especialidade: z.string().min(1, 'Especialidade é obrigatória'),
  Unidade: z.string().min(1, 'Unidade é obrigatória'),
  observations: z.string().optional(),
  ativo: z.boolean().default(true),
  attachments: z.array(z.string()).optional(),
});

type EquipeFormData = z.infer<typeof EquipeSchema>;


export default function CadastroEquipes() {
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
  } = useForm<EquipeFormData>({
    resolver: zodResolver(EquipeSchema),
  });

  const Nome = watch('Nome');
  const Especialidade = watch('Especialidade');
  const Unidade = watch('Unidade');


  // Calculate total hours automatically
  React.useEffect(() => {
    if (Nome && Especialidade && Unidade) {
      // Set individual fields with their respective values
      setValue('Nome', 'Alfa');
      setValue('Especialidade', 'Hídrica');
      setValue('Unidade', 'Santos Dumont');
    }
  }, [Nome, Especialidade, Unidade, setValue]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments = files.map(file => URL.createObjectURL(file));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const onSubmit = (data: EquipeFormData) => {
    console.log('Detalhamento salvo:', data);
    // Em produção, atualizar status da ocorrência para 'concluida'
    navigate('/cadastros/EquipesCadastradas');
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
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Cadastro de equipes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Registro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Nome do time</Label>
                <Input
                  id="start_date"
                  type="text"
                  {...register('Nome')}
                />
                {errors.Nome && (
                  <p className="text-sm text-red-500">{errors.Nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Especialidade</Label>
                <Input
                  id="end_date"
                  type="text"
                  {...register('Especialidade')}
                />
                {errors.Especialidade && (
                  <p className="text-sm text-red-500">{errors.Especialidade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_hours">Nome da Unidade</Label>
                <Input
                  id="total_hours"
                  type="text"

                  {...register('Unidade')}
                  placeholder="Empresa/Unidade"
                />
                {errors.Unidade && (
                  <p className="text-sm text-red-500">{errors.Unidade.message}</p>
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
              <Label htmlFor="attachments">Anexos</Label>
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
                  Adicionar Documento
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

            {/* <div className="bg-gray-50 p-4 rounded-lg">
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
                </div> */}

            {/* <div className="space-y-2">
                  <Label htmlFor="inspection_date">Data da Vistoria</Label>
                  <Input
                    id="inspection_date"
                    type="date"
                    {...register('inspection_date')}
                  />
                </div>
              </div>
            </div> */}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
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
