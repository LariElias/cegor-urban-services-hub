import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, X, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

// Schema de validação atualizado com os novos campos e lógica condicional
const vistoriaSchema = z.object({
  photos: z.array(z.string()).min(1, 'Pelo menos uma foto é obrigatória'),
  responsible: z.string().min(1, 'Responsável é obrigatório'),
  inspection_date: z.string().min(1, 'Data da vistoria é obrigatória'),
  activity: z.string().min(1, 'Atividade é obrigatória'),
  ponto_inicial: z.string().optional(),
  ponto_final: z.string().optional(),
  cannot_execute: z.boolean().default(false),
  cannot_execute_reason: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.cannot_execute && !data.cannot_execute_reason?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'O motivo é obrigatório.',
      path: ['cannot_execute_reason'],
    });
  }
});

type VistoriaFormData = z.infer<typeof vistoriaSchema>;

export default function VistoriaFinal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VistoriaFormData>({
    resolver: zodResolver(vistoriaSchema),
    defaultValues: {
      cannot_execute: false,
      responsible: user?.name || '',
    }
  });

  const cannotExecute = watch('cannot_execute');

  // Seta o nome do usuário no campo responsável quando o componente monta
  useEffect(() => {
    if (user?.name) {
      setValue('responsible', user.name);
    }
  }, [user, setValue]);

  // Mock data
  const activities = [
    { id: '1', name: 'Varrição de via pública' },
    { id: '2', name: 'Capina e poda de vegetação' },
    { id: '3', name: 'Corte de árvore' },
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);
    setValue('photos', updatedPhotos, { shouldValidate: true });
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    setValue('photos', updatedPhotos, { shouldValidate: true });
  };

  const onSubmit = (data: VistoriaFormData) => {
    console.log('Vistoria salva:', data);
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Registro de Vistoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="photos">Fotos da Vistoria *</Label>
              <div className="flex items-center gap-2">
                <Input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                  <Upload className="w-4 h-4 mr-2" /> Adicionar Fotos
                </Button>
              </div>
              {errors.photos && <p className="text-sm text-red-500">{errors.photos.message}</p>}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-20 object-cover rounded" />
                      <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={() => removePhoto(index)}><X className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* <div className="space-y-2">
                <Label htmlFor="responsible">Responsável pela Vistoria *</Label>
                <Input id="responsible" {...register('responsible')} readOnly className="bg-gray-100"/>
                {errors.responsible && <p className="text-sm text-red-500">{errors.responsible.message}</p>}
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="inspection_date">Data da Vistoria *</Label>
                <Input id="inspection_date" type="date" {...register('inspection_date')} />
                {errors.inspection_date && <p className="text-sm text-red-500">{errors.inspection_date.message}</p>}
              </div>


              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="activity">Atividade *</Label>
                <select id="activity" {...register('activity')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Selecione a atividade</option>
                  {activities.map(activity => <option key={activity.id} value={activity.id}>{activity.name}</option>)}
                </select>
                {errors.activity && <p className="text-sm text-red-500">{errors.activity.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ponto_inicial">Ponto Inicial</Label>
                <Input id="ponto_inicial" {...register('ponto_inicial')} placeholder="Ex: Esquina da Rua A com Av. B" />
                {errors.ponto_inicial && <p className="text-sm text-red-500">{errors.ponto_inicial.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ponto_final">Ponto Final</Label>
                <Input id="ponto_final" {...register('ponto_final')} placeholder="Ex: Em frente ao número 123" />
                {errors.ponto_final && <p className="text-sm text-red-500">{errors.ponto_final.message}</p>}
              </div>
            </div>

            {/* --- CHECKBOX E TEXTAREA CONDICIONAL --- */}
            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                    <Checkbox id="cannot_execute" checked={cannotExecute} onCheckedChange={(checked) => setValue('cannot_execute', checked as boolean)} />
                    <Label htmlFor="cannot_execute" className="flex items-center gap-2 cursor-pointer text-red-600 font-medium">
                        <AlertCircle className="w-4 h-4" />
                        Não é possível realizar a ocorrência
                    </Label>
                </div>

                {cannotExecute && (
                    <div className="space-y-2 pl-6 animate-in fade-in-50">
                        <Label htmlFor="cannot_execute_reason">Descreva o motivo *</Label>
                        <Textarea id="cannot_execute_reason" {...register('cannot_execute_reason')} placeholder="Explique por que a ocorrência não pode ser realizada..." rows={3} />
                        {errors.cannot_execute_reason && <p className="text-sm text-red-500">{errors.cannot_execute_reason.message}</p>}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/ocorrencias')}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Vistoria
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
