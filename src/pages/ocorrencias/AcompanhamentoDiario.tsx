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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

// Mock data para a lista de entradas existentes
const mockEntries: DailyEntry[] = [
  { id: '1', date: '2025-07-22', description: 'Início da capinação no trecho entre a Rua A e a Rua B. Equipe de 4 pessoas no local.', latitude: '-3.731', longitude: '-38.522', photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+1'], photos_after: [] },
  { id: '2', date: '2025-07-21', description: 'Finalização da limpeza da Praça do Ferreira. Remoção de 2 toneladas de detritos.', latitude: '-3.725', longitude: '-38.528', photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+2'], photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+2'] },
  { id: '3', date: '2025-07-20', description: 'Reparo da calçada na Av. Beira Mar, próximo ao quiosque 5.', latitude: '-3.723', longitude: '-38.489', photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+3'], photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+3'] },
  { id: '4', date: '2025-07-19', description: 'Poda de 3 árvores que apresentavam risco na Rua Monsenhor Tabosa.', latitude: '-3.724', longitude: '-38.512', photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+4'], photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+4'] },
  { id: '5', date: '2025-07-18', description: 'Instalação de nova iluminação no poste em frente ao número 2048 da Av. Santos Dumont.', latitude: '-3.738', longitude: '-38.497', photos_before: [], photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+5'] },
  { id: '6', date: '2025-07-17', description: 'Manutenção dos brinquedos do parquinho infantil no Parque do Cocó.', latitude: '-3.753', longitude: '-38.484', photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+6'], photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+6'] },
  { id: '7', date: '2025-07-16', description: 'Pintura da faixa de pedestres na Av. 13 de Maio.', latitude: '-3.748', longitude: '-38.536', photos_before: [], photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+7'] },
  { id: '8', date: '2025-07-15', description: 'Desobstrução de bueiro na Rua Barão do Rio Branco.', latitude: '-3.728', longitude: '-38.529', photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+8'], photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+8'] },
  { id: '9', date: '2025-07-14', description: 'Conserto de banco quebrado na Praça da Gentilândia.', latitude: '-3.741', longitude: '-38.537', photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+9'], photos_after: [] },
  { id: '10', date: '2025-07-13', description: 'Varrição e coleta de lixo na orla da Praia de Iracema.', latitude: '-3.718', longitude: '-38.516', photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+10'], photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+10'] },
];

export default function AcompanhamentoDiario() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<DailyEntry[]>(mockEntries);
  const [photosBefore, setPhotosBefore] = useState<string[]>([]);
  const [photosAfter, setPhotosAfter] = useState<string[]>([]);
  const [isConfirmingCompletion, setIsConfirmingCompletion] = useState(false);

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
          setValue('latitude', position.coords.latitude.toFixed(5).toString());
          setValue('longitude', position.coords.longitude.toFixed(5).toString());
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter a localização. Verifique as permissões do navegador.');
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

    setEntries([newEntry, ...entries]);
    setShowForm(false);
    setPhotosBefore([]);
    setPhotosAfter([]);
    reset({ date: new Date().toISOString().split('T')[0] });
  };

  const handleConfirmCompletion = () => {
    // Aqui iria a lógica para mudar o status da ocorrência para "concluída"
    console.log("Serviço concluído!");
    setIsConfirmingCompletion(false);
    navigate('/ocorrencias');
  };

  // Controle de acesso à página
  const allowedRoles = ['cegor', 'regional', 'empresa'];
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado. Você não tem permissão para visualizar esta página.</p>
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
        {!showForm && user?.role === 'empresa' && (
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Dia
            </Button>
        )}
      </div>

      {showForm && (
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Novo Registro Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input id="date" type="date" {...register('date')} />
                  {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Geolocalização</Label>
                  <div className="flex gap-2">
                    <Input {...register('latitude')} placeholder="Latitude" />
                    <Input {...register('longitude')} placeholder="Longitude" />
                    <Button type="button" variant="outline" size="icon" onClick={getCurrentLocation}><MapPin className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Trecho Executado / Descrição *</Label>
                <Textarea id="description" {...register('description')} placeholder="Descreva o trabalho realizado no dia" rows={3} />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fotos Antes</Label>
                  <Button type="button" variant="outline" onClick={() => document.getElementById('photos-before')?.click()} className="w-full"><Camera className="w-4 h-4 mr-2" /> Adicionar</Button>
                  <Input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e, 'before')} className="hidden" id="photos-before" />
                  {photosBefore.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {photosBefore.map((photo, index) => (
                        <div key={index} className="relative">
                          <img src={photo} alt={`Antes ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={() => removePhoto(index, 'before')}><X className="w-3 h-3" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Fotos Depois</Label>
                  <Button type="button" variant="outline" onClick={() => document.getElementById('photos-after')?.click()} className="w-full"><Camera className="w-4 h-4 mr-2" /> Adicionar</Button>
                  <Input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e, 'after')} className="hidden" id="photos-after" />
                  {photosAfter.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {photosAfter.map((photo, index) => (
                        <div key={index} className="relative">
                          <img src={photo} alt={`Depois ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={() => removePhoto(index, 'after')}><X className="w-3 h-3" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit">Salvar Registro</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Accordion type="single" collapsible className="w-full space-y-4">
        {entries.map((entry) => (
          <AccordionItem value={`item-${entry.id}`} key={entry.id} className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline text-gray-800">
              {new Date(entry.date + 'T00:00:00-03:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 space-y-4 border-t pt-4">
                <p className="text-sm text-gray-700">{entry.description}</p>
                {entry.latitude && entry.longitude && (
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> Localização: {entry.latitude}, {entry.longitude}</p>
                )}
                {(entry.photos_before.length > 0 || entry.photos_after.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {entry.photos_before.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Fotos Antes</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {entry.photos_before.map((photo, index) => (<img key={index} src={photo} alt={`Antes ${index + 1}`} className="w-full h-24 object-cover rounded-md" />))}
                        </div>
                      </div>
                    )}
                    {entry.photos_after.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Fotos Depois</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {entry.photos_after.map((photo, index) => (<img key={index} src={photo} alt={`Depois ${index + 1}`} className="w-full h-24 object-cover rounded-md" />))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {entries.length > 0 && !showForm && user?.role === 'empresa' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Dialog open={isConfirmingCompletion} onOpenChange={setIsConfirmingCompletion}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">Concluir Serviço</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Conclusão do Serviço</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p>Você confirma que todo o serviço foi executado?</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsConfirmingCompletion(false)}>
                      Voltar
                    </Button>
                    <Button onClick={handleConfirmCompletion} className="bg-green-600 hover:bg-green-700">
                      Confirmar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
