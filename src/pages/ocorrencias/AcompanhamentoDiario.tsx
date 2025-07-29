import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, MapPin, Camera, Upload, X, UserX, Minus, Sun, Moon, Sunset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';

// ATUALIZAÇÃO 1: Schema e Tipos com Geolocalização no nível principal
const shiftSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatória para o turno preenchido.'),
  photos_before: z.array(z.string()).optional(),
  photos_after: z.array(z.string()).optional(),
  absent_employees: z.array(
    z.object({
      name: z.string().min(1, "O nome não pode ser vazio."),
    })
  ).optional(),
});

const acompanhamentoSchema = z.object({
  date: z.string().min(1, 'A data do registro é obrigatória.'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  shifts: z.object({
    diurno: shiftSchema.optional(),
    vespertino: shiftSchema.optional(),
    noturno: shiftSchema.optional(),
  }),
}).refine(data => {
  return !!data.shifts.diurno?.description || !!data.shifts.vespertino?.description || !!data.shifts.noturno?.description;
}, {
  message: "É necessário preencher a descrição de pelo menos um turno.",
  path: ["shifts"], 
});

type AcompanhamentoFormData = z.infer<typeof acompanhamentoSchema>;

interface ShiftEntry {
  description: string;
  photos_before: string[];
  photos_after: string[];
  absent_employees?: { name: string }[];
}

interface DailyEntry {
  id: string;
  date: string;
  latitude?: string;
  longitude?: string;
  shifts: {
    diurno?: ShiftEntry;
    vespertino?: ShiftEntry;
    noturno?: ShiftEntry;
  };
}

// ATUALIZAÇÃO 2: Mock data com a estrutura correta
const mockEntries: DailyEntry[] = [
  { 
    id: '1', 
    date: '2025-07-28', 
    latitude: '-3.731', 
    longitude: '-38.522',
    shifts: {
      diurno: {
        description: 'Início da capinação no trecho entre a Rua A e a Rua B.',
        photos_before: ['https://placehold.co/400x300/e2e8f0/64748b?text=Antes+Diurno'], photos_after: [],
        absent_employees: [{ name: 'Carlos Andrade' }],
      },
      vespertino: {
        description: 'Continuação do serviço de capinação. Finalizado 50% do trecho.',
        photos_before: [], photos_after: ['https://placehold.co/400x300/dcfce7/166534?text=Depois+Vespertino'],
        absent_employees: [{ name: 'Mariana Costa' }],
      }
    } 
  },
];

export default function AcompanhamentoDiario() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<DailyEntry[]>(mockEntries);
  const [isConfirmingCompletion, setIsConfirmingCompletion] = useState(false);
  
  const [photoPreviews, setPhotoPreviews] = useState<{ [key: string]: { before: string[], after: string[] } }>({
    diurno: { before: [], after: [] },
    vespertino: { before: [], after: [] },
    noturno: { before: [], after: [] },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<AcompanhamentoFormData>({
    resolver: zodResolver(acompanhamentoSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      shifts: {}
    },
  });

  const { fields: diurnoFields, append: appendDiurno, remove: removeDiurno } = useFieldArray({ control, name: "shifts.diurno.absent_employees" });
  const { fields: vespertinoFields, append: appendVespertino, remove: removeVespertino } = useFieldArray({ control, name: "shifts.vespertino.absent_employees" });
  const { fields: noturnoFields, append: appendNoturno, remove: removeNoturno } = useFieldArray({ control, name: "shifts.noturno.absent_employees" });

  // ATUALIZAÇÃO 3: Função de geolocalização simplificada
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude.toFixed(5).toString());
          setValue('longitude', position.coords.longitude.toFixed(5).toString());
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter a localização.');
        }
      );
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, turno: 'diurno' | 'vespertino' | 'noturno', type: 'before' | 'after') => {
    const files = Array.from(event.target.files || []);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    
    setPhotoPreviews(prev => {
        const updatedTurnoPreviews = { ...prev[turno], [type]: [...prev[turno][type], ...newPhotos] };
        setValue(`shifts.${turno}.photos_${type}`, updatedTurnoPreviews[type]);
        return { ...prev, [turno]: updatedTurnoPreviews };
    });
  };

  const removePhoto = (index: number, turno: 'diurno' | 'vespertino' | 'noturno', type: 'before' | 'after') => {
    const updatedPreviews = photoPreviews[turno][type].filter((_, i) => i !== index);
    setPhotoPreviews(prev => {
        const updatedTurnoPreviews = { ...prev[turno], [type]: updatedPreviews };
        setValue(`shifts.${turno}.photos_${type}`, updatedPreviews);
        return { ...prev, [turno]: updatedTurnoPreviews };
    });
  };

  const onSubmit = (data: AcompanhamentoFormData) => {
    const filledShifts: any = {};
    (Object.keys(data.shifts) as Array<keyof typeof data.shifts>).forEach(turno => {
      if (data.shifts[turno]?.description) {
        filledShifts[turno] = {
          ...data.shifts[turno],
          absent_employees: data.shifts[turno]?.absent_employees?.filter(emp => emp.name.trim() !== '')
        };
      }
    });

    const newEntry: DailyEntry = {
      id: Date.now().toString(),
      date: data.date,
      latitude: data.latitude, // Pega do nível principal
      longitude: data.longitude, // Pega do nível principal
      shifts: filledShifts,
    };

    setEntries([newEntry, ...entries]);
    setShowForm(false);
    reset({ date: new Date().toISOString().split('T')[0], shifts: {}, latitude: '', longitude: '' });
    setPhotoPreviews({ diurno: { before: [], after: [] }, vespertino: { before: [], after: [] }, noturno: { before: [], after: [] } });
  };

  const handleConfirmCompletion = () => {
    console.log("Serviço concluído!");
    setIsConfirmingCompletion(false);
    navigate('/ocorrencias');
  };

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
            <CardDescription>Preencha os dados para os turnos em que houve atividade.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* ATUALIZAÇÃO 4: Geolocalização movida para o topo do formulário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data do Registro *</Label>
                  <Input id="date" type="date" {...register('date')} />
                  {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Geolocalização (Geral do Dia)</Label>
                  <div className="flex gap-2">
                    <Input {...register('latitude')} placeholder="Latitude" />
                    <Input {...register('longitude')} placeholder="Longitude" />
                    <Button type="button" variant="outline" size="icon" onClick={getCurrentLocation}><MapPin className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="diurno" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="diurno">Diurno</TabsTrigger>
                  <TabsTrigger value="vespertino">Vespertino</TabsTrigger>
                  <TabsTrigger value="noturno">Noturno</TabsTrigger>
                </TabsList>

                {(['diurno', 'vespertino', 'noturno'] as const).map((turno) => (
                  <TabsContent key={turno} value={turno} className="space-y-4 pt-4 border rounded-b-md p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`shifts.${turno}.description`}>Trecho Executado / Descrição *</Label>
                      <Textarea id={`shifts.${turno}.description`} {...register(`shifts.${turno}.description`)} placeholder={`Descreva o trabalho realizado no turno ${turno}`} />
                      {errors.shifts?.[turno]?.description && <p className="text-sm text-red-500">{errors.shifts[turno]?.description?.message}</p>}
                    </div>
                    
                    <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
                        <Label className="font-semibold flex items-center gap-2"><UserX className="w-5 h-5"/>Falta de Funcionários (Opcional)</Label>
                        {(turno === 'diurno' ? diurnoFields : turno === 'vespertino' ? vespertinoFields : noturnoFields).map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <Input placeholder="Nome do funcionário ausente" {...register(`shifts.${turno}.absent_employees.${index}.name`)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => (turno === 'diurno' ? removeDiurno(index) : turno === 'vespertino' ? removeVespertino(index) : removeNoturno(index))}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => (turno === 'diurno' ? appendDiurno({ name: '' }) : turno === 'vespertino' ? appendVespertino({ name: '' }) : appendNoturno({ name: '' }))}>
                            <Plus className="h-4 w-4 mr-2" /> Adicionar Falta
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fotos Antes</Label>
                            <Button type="button" variant="outline" onClick={() => document.getElementById(`photos-before-${turno}`)?.click()} className="w-full"><Camera className="w-4 h-4 mr-2" /> Adicionar</Button>
                            <Input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e, turno, 'before')} className="hidden" id={`photos-before-${turno}`} />
                            {photoPreviews[turno].before.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                {photoPreviews[turno].before.map((photo, index) => (
                                    <div key={index} className="relative">
                                    <img src={photo} alt={`Antes ${index + 1}`} className="w-full h-20 object-cover rounded" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={() => removePhoto(index, turno, 'before')}><X className="w-3 h-3" /></Button>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Fotos Depois</Label>
                            <Button type="button" variant="outline" onClick={() => document.getElementById(`photos-after-${turno}`)?.click()} className="w-full"><Camera className="w-4 h-4 mr-2" /> Adicionar</Button>
                            <Input type="file" multiple accept="image/*" onChange={(e) => handlePhotoUpload(e, turno, 'after')} className="hidden" id={`photos-after-${turno}`} />
                            {photoPreviews[turno].after.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                {photoPreviews[turno].after.map((photo, index) => (
                                    <div key={index} className="relative">
                                    <img src={photo} alt={`Depois ${index + 1}`} className="w-full h-20 object-cover rounded" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={() => removePhoto(index, turno, 'after')}><X className="w-3 h-3" /></Button>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              {errors.shifts && <p className="text-sm text-red-500 mt-2">{errors.shifts.message}</p>}

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit">Salvar Registro do Dia</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Accordion type="single" collapsible className="w-full space-y-4">
        {entries.map((entry) => (
          <AccordionItem value={`item-${entry.id}`} key={entry.id} className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline text-gray-800">
              {new Date(entry.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </AccordionTrigger>
            <AccordionContent>
              {/* ATUALIZAÇÃO 5: Exibição da Geolocalização geral do dia */}
              <div className="px-6 pb-6 space-y-4 border-t pt-4">
                {entry.latitude && entry.longitude && (
                  <p className="text-sm text-gray-600 flex items-center gap-2 pb-4 border-b">
                    <MapPin className="w-4 h-4"/> 
                    <strong>Localização Geral do Dia:</strong> {entry.latitude}, {entry.longitude}
                  </p>
                )}
                <div className="space-y-6">
                    {Object.entries(entry.shifts).length > 0 ? (
                    Object.entries(entry.shifts).map(([turno, data]) => (
                        data && (
                        <div key={turno} className="space-y-3 rounded-md border p-4 bg-slate-50">
                            <h3 className="font-semibold text-md flex items-center gap-2 text-slate-800">
                            {turno === 'diurno' ? <Sun/> : turno === 'vespertino' ? <Sunset/> : <Moon/>}
                            Turno {turno.charAt(0).toUpperCase() + turno.slice(1)}
                            </h3>
                            <p className="text-sm text-gray-700">{data.description}</p>
                            {data.absent_employees && data.absent_employees.length > 0 && (
                            <div className="pt-1">
                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2"><UserX className="w-4 h-4"/>Funcionários Ausentes:</p>
                                <ul className="list-disc list-inside text-sm text-gray-600 pl-4 mt-1">
                                {data.absent_employees.map((emp, i) => <li key={i}>{emp.name}</li>)}
                                </ul>
                            </div>
                            )}
                            {(data.photos_before.length > 0 || data.photos_after.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {data.photos_before.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Fotos Antes</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {data.photos_before.map((photo, index) => (<img key={index} src={photo} alt={`Antes ${index + 1}`} className="w-full h-24 object-cover rounded-md" />))}
                                    </div>
                                </div>
                                )}
                                {data.photos_after.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Fotos Depois</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {data.photos_after.map((photo, index) => (<img key={index} src={photo} alt={`Depois ${index + 1}`} className="w-full h-24 object-cover rounded-md" />))}
                                    </div>
                                </div>
                                )}
                            </div>
                            )}
                        </div>
                        )
                    ))
                    ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma atividade registrada para este dia.</p>
                    )}
                </div>
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