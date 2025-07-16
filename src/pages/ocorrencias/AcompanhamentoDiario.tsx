
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, MapPin, Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

const acompanhamentoSchema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  photos_before: z.array(z.string()).optional(),
  photos_after: z.array(z.string()).optional(),
});

type AcompanhamentoFormData = z.infer<typeof acompanhamentoSchema>;

interface DailyEntry {
  id: string;
  date: string;
  description: string;
  latitude?: string;
  longitude?: string;
  photos_before: string[];
  photos_after: string[];
}

export default function AcompanhamentoDiario() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [photosBefore, setPhotosBefore] = useState<string[]>([]);
  const [photosAfter, setPhotosAfter] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AcompanhamentoFormData>({
    resolver: zodResolver(acompanhamentoSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude.toString());
          setValue('longitude', position.coords.longitude.toString());
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const files = Array.from(event.target.files || []);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    
    if (type === 'before') {
      const updatedPhotos = [...photosBefore, ...newPhotos];
      setPhotosBefore(updatedPhotos);
      setValue('photos_before', updatedPhotos);
    } else {
      const updatedPhotos = [...photosAfter, ...newPhotos];
      setPhotosAfter(updatedPhotos);
      setValue('photos_after', updatedPhotos);
    }
  };

  const removePhoto = (index: number, type: 'before' | 'after') => {
    if (type === 'before') {
      const updatedPhotos = photosBefore.filter((_, i) => i !== index);
      setPhotosBefore(updatedPhotos);
      setValue('photos_before', updatedPhotos);
    } else {
      const updatedPhotos = photosAfter.filter((_, i) => i !== index);
      setPhotosAfter(updatedPhotos);
      setValue('photos_after', updatedPhotos);
    }
  };

  const onSubmit = (data: AcompanhamentoFormData) => {
    const newEntry: DailyEntry = {
      id: Date.now().toString(),
      date: data.date,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      photos_before: data.photos_before || [],
      photos_after: data.photos_after || [],
    };

    setEntries([...entries, newEntry]);
    setShowForm(false);
    setPhotosBefore([]);
    setPhotosAfter([]);
    reset();
  };

  if (user?.role !== 'empresa') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Apenas empresas podem registrar acompanhamento diário.</p>
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
        <h1 className="text-3xl font-bold">Acompanhamento Diário</h1>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Registros de Execução</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Dia
        </Button>
      </div>

      {/* Lista de entradas existentes */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {new Date(entry.date).toLocaleDateString('pt-BR')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
              {entry.latitude && entry.longitude && (
                <p className="text-xs text-gray-500 mb-2">
                  Localização: {entry.latitude}, {entry.longitude}
                </p>
              )}
              {(entry.photos_before.length > 0 || entry.photos_after.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entry.photos_before.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Fotos Antes</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {entry.photos_before.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Antes ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {entry.photos_after.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Fotos Depois</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {entry.photos_after.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Depois ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulário para novo registro */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Registro Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Geolocalização</Label>
                  <div className="flex gap-2">
                    <Input
                      {...register('latitude')}
                      placeholder="Latitude"
                    />
                    <Input
                      {...register('longitude')}
                      placeholder="Longitude"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Trecho Executado / Descrição *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descreva o trabalho realizado no dia"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fotos Antes</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'before')}
                      className="hidden"
                      id="photos-before"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photos-before')?.click()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                  {photosBefore.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {photosBefore.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo}
                            alt={`Antes ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removePhoto(index, 'before')}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Fotos Depois</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'after')}
                      className="hidden"
                      id="photos-after"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photos-after')?.click()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                  {photosAfter.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {photosAfter.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo}
                            alt={`Depois ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removePhoto(index, 'after')}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar Registro
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Botão de finalização */}
      {entries.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/ocorrencias')}
                className="bg-green-600 hover:bg-green-700"
              >
                Concluir Serviço
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
