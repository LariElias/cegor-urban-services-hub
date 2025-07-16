
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const vistoriaSchema = z.object({
  photos: z.array(z.string()).min(1, 'Pelo menos uma foto é obrigatória'),
  responsible: z.string().min(1, 'Responsável é obrigatório'),
  inspection_date: z.string().min(1, 'Data da vistoria é obrigatória'),
  activity: z.string().min(1, 'Atividade é obrigatória'),
});

type VistoriaFormData = z.infer<typeof vistoriaSchema>;

export default function VistoriaPrevia() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VistoriaFormData>({
    resolver: zodResolver(vistoriaSchema),
  });

  // Mock data - activities based on occurrence type
  const activities = [
    { id: '1', name: 'Varrição de via pública' },
    { id: '2', name: 'Capina e poda de vegetação' },
    { id: '3', name: 'Corte de árvore' },
    { id: '4', name: 'Limpeza de terreno' },
    { id: '5', name: 'Manutenção de equipamento' },
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);
    setValue('photos', updatedPhotos);
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    setValue('photos', updatedPhotos);
  };

  const onSubmit = (data: VistoriaFormData) => {
    console.log('Vistoria salva:', data);
    // Em produção, atualizar status da ocorrência para 'em_analise'
    navigate('/ocorrencias');
  };

  if (user?.role !== 'cegor') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Apenas usuários CEGOR podem realizar vistorias prévias.</p>
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
        <h1 className="text-3xl font-bold">Vistoria Prévia</h1>
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
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar Fotos
                </Button>
              </div>
              {errors.photos && (
                <p className="text-sm text-red-500">{errors.photos.message}</p>
              )}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável *</Label>
                <Input
                  id="responsible"
                  {...register('responsible')}
                  placeholder="Nome do responsável pela vistoria"
                />
                {errors.responsible && (
                  <p className="text-sm text-red-500">{errors.responsible.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspection_date">Data da Vistoria *</Label>
                <Input
                  id="inspection_date"
                  type="date"
                  {...register('inspection_date')}
                />
                {errors.inspection_date && (
                  <p className="text-sm text-red-500">{errors.inspection_date.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Atividade *</Label>
              <select
                id="activity"
                {...register('activity')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Selecione a atividade</option>
                {activities.map(activity => (
                  <option key={activity.id} value={activity.id}>{activity.name}</option>
                ))}
              </select>
              {errors.activity && (
                <p className="text-sm text-red-500">{errors.activity.message}</p>
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
