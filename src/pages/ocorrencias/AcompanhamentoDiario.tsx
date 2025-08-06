import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, MapPin, Camera, X, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';

// --- ESQUEMA E TIPOS SIMPLIFICADOS ---
const acompanhamentoSchema = z.object({
  date: z.string().min(1, 'A data do registro é obrigatória.'),
  description: z.string().min(1, 'O trecho executado/descrição é obrigatório.'),
  absent_employees_count: z.coerce.number().min(0, "O número não pode ser negativo.").optional(),
  photos_before: z.array(z.string()).optional(),
  photos_after: z.array(z.string()).optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type AcompanhamentoFormData = z.infer<typeof acompanhamentoSchema>;

interface DailyEntry {
  id: string;
  date: string;
  description: string;
  absent_employees_count?: number;
  photos_before: string[];
  photos_after: string[];
  latitude?: string;
  longitude?: string;
}

// --- MOCK DE DADOS ATUALIZADO (4 REGISTROS) ---
const mockEntries: DailyEntry[] = [
  {
    id: '1',
    date: '2025-07-28',
    description: 'Executada a capinação e limpeza da Av. Bezerra de Menezes, trecho entre a Rua A e a Rua B. Foram removidos 2m³ de resíduos.',
    absent_employees_count: 2,
    photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+Dia+1'],
    photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+Dia+1'],
    latitude: '-3.731',
    longitude: '-38.522',
  },
  {
    id: '2',
    date: '2025-07-29',
    description: 'Continuação da limpeza na Av. Bezerra de Menezes, agora no trecho entre a Rua B e a Rua C. Serviço finalizado neste trecho.',
    absent_employees_count: 0,
    photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+Dia+2'],
    photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+Dia+2'],
    latitude: '-3.732',
    longitude: '-38.523',
  },
  {
    id: '3',
    date: '2025-07-30',
    description: 'Serviço de poda de árvores na Praça da Gentilândia. Todas as árvores do lado norte da praça foram podadas.',
    absent_employees_count: 1,
    photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+Dia+3'],
    photos_after: [], // Exemplo sem foto "depois"
    latitude: '-3.745',
    longitude: '-38.532',
  },
    {
    id: '4',
    date: '2025-07-31',
    description: 'Pintura de meio-fio na Av. 13 de Maio, próximo à reitoria da UFC. Concluído 500 metros de pintura.',
    absent_employees_count: 0,
    photos_before: [], // Exemplo sem foto "antes"
    photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+Dia+4'],
    latitude: '-3.746',
    longitude: '-38.533',
  },
];

export default function AcompanhamentoDiario() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<DailyEntry[]>(mockEntries);
  const [isConfirmingCompletion, setIsConfirmingCompletion] = useState(false);
  
  // Estado de preview de fotos simplificado
  const [photoPreviews, setPhotoPreviews] = useState<{ before: string[], after: string[] }>({
    before: [],
    after: [],
  });

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
      description: '',
      absent_employees_count: 0,
      photos_before: [],
      photos_after: [],
    },
  });

  const getCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setValue('latitude', position.coords.latitude.toFixed(5));
        setValue('longitude', position.coords.longitude.toFixed(5));
      },
      () => alert('Não foi possível obter a localização.')
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => {
        const updatedPhotos = [...prev[type], ...newPhotos];
        setValue(`photos_${type}`, updatedPhotos);
        return { ...prev, [type]: updatedPhotos };
    });
  };

  const removePhoto = (index: number, type: 'before' | 'after') => {
    const updatedPreviews = photoPreviews[type].filter((_, i) => i !== index);
    setPhotoPreviews(prev => {
        setValue(`photos_${type}`, updatedPreviews);
        return { ...prev, [type]: updatedPreviews };
    });
  };

  const onSubmit = (data: AcompanhamentoFormData) => {
    const newEntry: DailyEntry = {
      id: Date.now().toString(),
      ...data,
      absent_employees_count: data.absent_employees_count || 0,
      photos_before: photoPreviews.before,
      photos_after: photoPreviews.after,
    };

    setEntries([newEntry, ...entries]);
    setShowForm(false);
    reset(); // Reseta para os defaultValues definidos no useForm
    setPhotoPreviews({ before: [], after: [] });
  };

  const handleConfirmCompletion = () => {
    console.log("Serviço concluído!");
    setIsConfirmingCompletion(false);
    navigate('/ocorrencias');
  };
  
  // Verificação de permissão do usuário
  const allowedRoles = ['cegor', 'regional', 'empresa'];
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Acesso negado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- CABEÇALHO --- */}
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
                Adicionar Registro
            </Button>
        )}
      </div>

      {/* --- FORMULÁRIO DE NOVO REGISTRO --- */}
      {showForm && (
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Novo Registro Diário</CardTitle>
            <CardDescription>Preencha os dados da execução do serviço no dia.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Data e Geolocalização */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data do Registro *</Label>
                  <Input id="date" type="date" {...register('date')} />
                  {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Geolocalização</Label>
                  <div className="flex gap-2">
                    <Input {...register('latitude')} placeholder="Latitude" readOnly/>
                    <Input {...register('longitude')} placeholder="Longitude" readOnly/>
                    <Button type="button" variant="outline" size="icon" onClick={getCurrentLocation}><MapPin className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>

              {/* Descrição e Falta de Funcionários */}
              <div className="space-y-2">
                <Label htmlFor="description">Trecho Executado / Descrição *</Label>
                <Textarea id="description" {...register('description')} placeholder="Descreva o trabalho realizado, trechos, quantidades, etc." />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="absent_employees_count" className="flex items-center gap-2"><UserX className="w-5 h-5"/>Falta de Funcionários</Label>
                <Input id="absent_employees_count" type="number" min="0" {...register('absent_employees_count')} className="max-w-xs" />
                {errors.absent_employees_count && <p className="text-sm text-red-500">{errors.absent_employees_count.message}</p>}
              </div>
              
              {/* Fotos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                {(['before', 'after'] as const).map((type) => (
                  <div className="space-y-2" key={type}>
                    <Label>Fotos {type === 'before' ? 'Antes' : 'Depois'}</Label>
                    <Button type="button" variant="outline" onClick={() => document.getElementById(`photos-${type}`)?.click()} className="w-full">
                        <Camera className="w-4 h-4 mr-2" /> Adicionar
                    </Button>
                    <Input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e, type)} className="hidden" id={`photos-${type}`} />
                    {photoPreviews[type].length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                        {photoPreviews[type].map((photo, index) => (
                            <div key={index} className="relative group">
                              <img src={photo} alt={`${type} ${index + 1}`} className="w-full h-24 object-cover rounded" />
                              <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removePhoto(index, type)}>
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                        ))}
                        </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit">Salvar Registro</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* --- LISTA DE REGISTROS (ACCORDION) --- */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {entries.map((entry) => (
          <AccordionItem value={`item-${entry.id}`} key={entry.id} className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline text-gray-800">
              {new Date(entry.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4 border-t pt-4">
              {/* Descrição */}
              <div>
                <h3 className="font-semibold text-md text-slate-800 mb-1">Descrição do Serviço</h3>
                <p className="text-sm text-gray-700">{entry.description}</p>
              </div>
              
              {/* Detalhes Adicionais */}
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                {entry.latitude && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500"/> 
                    <strong>Localização:</strong> <span className="text-gray-600">{entry.latitude}, {entry.longitude}</span>
                  </div>
                )}
                {(entry.absent_employees_count ?? 0) > 0 && (
                   <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4 text-gray-500"/> 
                    <strong>Funcionários Ausentes:</strong> <span className="text-gray-600">{entry.absent_employees_count}</span>
                  </div>
                )}
              </div>
              
              {/* Galeria de Fotos */}
              {(entry.photos_before.length > 0 || entry.photos_after.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t mt-4">
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* --- BOTÃO DE CONCLUIR SERVIÇO --- */}
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
                  <p className="py-4">Você confirma que todo o serviço foi executado e todos os registros diários foram adicionados corretamente?</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsConfirmingCompletion(false)}>Voltar</Button>
                    <Button onClick={handleConfirmCompletion} className="bg-green-600 hover:bg-green-700">Confirmar Conclusão</Button>
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