import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from 'zod';
import { ArrowLeft, Upload, X, Camera, AlertCircle, FileText, MapPin, Tag, Star, Info } from 'lucide-react'; // Adicione 'Info' aqui
import { Checkbox } from '@/components/ui/checkbox';
import Select from 'react-select';

// Simulação de um hook de navegação e autenticação
const useNavigate = () => (path) => console.log(`Navegando para: ${path}`);
const useParams = () => ({ id: 'PROTOCOLO-12345' });
const useAuth = () => ({ user: { name: 'Fiscal Padrão' } });


// --- Dados Mockados ---
const occurrenceData = {
    protocolo: '2024-08-A45',
    tipoServico: 'Especial',
    bairro: 'Centro',
    prioridade: 'Alta',
};

const activities = [
    { id: '1', name: 'Serviço Capinação em pavimentação asfáltica' },
    { id: '2', name: 'Serviço Capinação em pavimentação poliédrica' },
    { id: '3', name: 'Serviço Capinação sem pavimentação (terra natural)' },
    { id: '4', name: 'Pintura de meio fio' },
    { id: '5', name: 'Roço em áreas abertas com roçadeira costal' },
    { id: '6', name: 'Serviço varrição em pavimentação asfáltica' },
    { id: '7', name: 'Serviço varrição em pavimentação poliédrica' },
    { id: '8', name: 'Serviço varrição sem pavimentação (terra natural)' },
    { id: '11', name: 'Serviços Especiais extraordinários' },
    { id: '12', name: 'Serviço de limpeza e desobstrução nas Bocas de Lobo com remoção' },
    { id: '13', name: 'Serviço de limpeza manual em recursos hídricos' },
    { id: '27', name: 'Serviço com apoio do Munck na remoção de animais mortos, toros vegetais, etc' },
];

const equipes = [
    { id: 'eq1', name: 'Equipe Alpha' },
    { id: 'eq2', name: 'Equipe Bravo' },
    { id: 'eq3', name: 'Equipe Charlie' },
    { id: 'eq4', name: 'Equipe Delta' },
];

const ACTIVITIES_REQUIRING_EQUIPE = [
  'Serviço Capinação em pavimentação asfáltica',
  'Serviço Capinação em pavimentação poliédrica',
  'Serviço Capinação sem pavimentação (terra natural)',
  'Pintura de meio fio',
];

// --- Schema de Validação ATUALIZADO ---
const vistoriaSchema = z.object({
  photos: z.array(z.string()).min(1, 'Pelo menos uma foto é obrigatória.'),
  activity: z.array(z.string()).min(1, { message: 'Pelo menos uma atividade é obrigatória.' }),
  equipe: z.string().optional(),
  ponto_inicial: z.string().optional(),
  ponto_final: z.string().optional(),
  medicaoLinear: z.number({ coerce: true }).optional(), // Adicionado 'coerce' para conversão automática
  cannot_execute: z.boolean().default(false),
  cannot_execute_reason: z.string().optional(),
  medicaoReal: z.number().optional(),
  hasCanteiroCentral: z.boolean().optional(), // --- ADICIONADO ---
}).superRefine((data, ctx) => {
  if (data.cannot_execute && !data.cannot_execute_reason?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'O motivo é obrigatório.',
      path: ['cannot_execute_reason'],
    });
  }

  const equipeIsRequired = data.activity?.some(activity => ACTIVITIES_REQUIRING_EQUIPE.includes(activity));

  if (equipeIsRequired && !data.equipe) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A seleção da equipe é obrigatória para esta atividade.',
      path: ['equipe'],
    });
  }
});


type VistoriaFormData = z.infer<typeof vistoriaSchema>;


// --- Componente Principal ---
export default function VistoriaPreviaRefatorado() {
  const navigate = useNavigate();
  const { id } = useParams();
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
      photos: [],
      activity: [],
      equipe: '',
      hasCanteiroCentral: false, // --- ADICIONADO ---
    }
  });
  

  const medicaoLinear = watch('medicaoLinear');
  const cannotExecute = watch('cannot_execute');
  const watchedActivities = watch('activity');
  const hasCanteiroCentral = watch('hasCanteiroCentral'); // --- ADICIONADO ---

  const showEquipeField = React.useMemo(() => {
    if (!watchedActivities || watchedActivities.length === 0) return false;
    return watchedActivities.some(activity => ACTIVITIES_REQUIRING_EQUIPE.includes(activity));
  }, [watchedActivities]);
  
  useEffect(() => {
    if (!showEquipeField) {
      setValue('equipe', '', { shouldValidate: true });
    }
  }, [showEquipeField, setValue]);


  useEffect(() => {
    const linearValue = Number(medicaoLinear) || 0; 
    
    const realValue = hasCanteiroCentral ? linearValue * 4 : linearValue * 2;

    setValue('medicaoReal', realValue, { shouldValidate: true });

  }, [medicaoLinear, hasCanteiroCentral, setValue]); 


  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
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
    console.log('Vistoria salva:', { ...data, occurrenceInfo: occurrenceData });
    alert('Vistoria salva com sucesso! Verifique o console.');
    navigate('/ocorrencias');
  };

  const activityOptions = activities.map((a) => ({
    label: a.name,
    value: a.name,
  }));

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/ocorrencias')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Vistoria Prévia</h1>
        </div>

        {/* Informações da Ocorrência */}
        <Card className="bg-white">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-slate-700">
                    <FileText className="w-6 h-6" />
                    Detalhes da Ocorrência
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-500">PROTOCOLO</span>
                        <span className="text-slate-800 font-medium">{occurrenceData.protocolo}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-500">TIPO DE SERVIÇO</span>
                        <span className="text-slate-800 font-medium">{occurrenceData.tipoServico}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-500">BAIRRO</span>
                        <span className="text-slate-800 font-medium">{occurrenceData.bairro}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-500">PRIORIDADE</span>
                        <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="text-slate-800 font-medium">{occurrenceData.prioridade}</span>
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>


        {/* Formulário de Vistoria */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-700">
              <Camera className="w-6 h-6" />
              Registro de Vistoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Seção de Fotos */}
              <div className="space-y-2">
                <Label htmlFor="photo-upload" className="font-semibold">Fotos da Vistoria *</Label>
                <div className="flex items-center gap-4">
                  <Input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Adicionar Fotos
                  </Button>
                </div>
                {errors.photos && <p className="text-sm text-red-600">{errors.photos.message}</p>}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-24 object-cover rounded-md border" />
                        <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removePhoto(index)}><X className="w-3 h-3" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Campos do Formulário */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="activity">Atividade(s) *</Label>
                  <Select
                    inputId="activity"
                    options={activityOptions}
                    isSearchable
                    isMulti
                    placeholder="Digite para buscar atividade..."
                    classNames={{
                      control: () => 'border border-slate-300 rounded-md shadow-sm min-h-[42px]',
                      multiValue: () => 'bg-slate-200 text-slate-800 rounded px-2 py-1 text-sm',
                      menu: () => 'z-50 bg-white shadow-lg border border-slate-300',
                      option: ({ isFocused, isSelected }) =>
                        `px-3 py-2 text-sm cursor-pointer ${
                          isFocused ? 'bg-slate-100' : ''
                        } ${isSelected ? 'bg-slate-200 font-semibold' : ''}`,
                    }}
                    classNamePrefix="react-select"
                    onChange={(selectedOptions) =>
                      setValue(
                        'activity',
                        selectedOptions.map((opt) => opt.value),
                        { shouldValidate: true }
                      )
                    }
                  />
                  {errors.activity && <p className="text-sm text-red-600">{errors.activity.message}</p>}
                </div>

                {showEquipeField && (
                  <div className="space-y-2 md:col-span-2 animate-in fade-in-50 duration-300">
                    <Label htmlFor="equipe">Selecionar a Equipe *</Label>
                    <select id="equipe" {...register('equipe')} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400">
                      <option value="">Selecione a equipe responsável</option>
                      {equipes.map(equipe => <option key={equipe.id} value={equipe.name}>{equipe.name}</option>)}
                    </select>
                    {errors.equipe && <p className="text-sm text-red-600">{errors.equipe.message}</p>}
                  </div>   
                )}             
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Como a Medição Real é Calculada</AlertTitle>
                          <AlertDescription>
                              O valor da Medição Real é preenchido automaticamente com base na existência de um canteiro central:
                              <ul className="list-disc pl-5 mt-2 text-sm">
                                  <li><b>Sem canteiro central:</b> Medição Real = Medição Linear x 2.</li>
                                  <li><b>Com canteiro central:</b> Medição Real = Medição Linear x 4.</li>
                              </ul>
                          </AlertDescription>
                      </Alert>
                  </div>
                <div className="md:col-span-2 flex items-center gap-3 pt-2">
                    <Checkbox
                        id="hasCanteiroCentral"
                        checked={hasCanteiroCentral}
                        onCheckedChange={(checked) => setValue('hasCanteiroCentral', checked as boolean)}
                    />
                    <Label htmlFor="hasCanteiroCentral" className="cursor-pointer font-medium text-slate-700">
                        Existe canteiro central?
                    </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicaoLinear">Medição Linear</Label>
                  <Input id="medicaoLinear" type="number" 
                  {...register('medicaoLinear', { valueAsNumber: true })}
                  placeholder="Metros" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicaoReal">Medição real</Label>
                  <Input disabled type="number" id="medicaoReal" {...register('medicaoReal')} 
                  placeholder="Número de canteiros" />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="ponto_inicial">Ponto Inicial</Label>
                  <Input id="ponto_inicial" {...register('ponto_inicial')} placeholder="Ex: Esquina da Rua A" />
                  {errors.ponto_inicial && <p className="text-sm text-red-600">{errors.ponto_inicial.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ponto_final">Ponto Final</Label>
                  <Input id="ponto_final" {...register('ponto_final')} placeholder="Ex: Em frente ao nº 123" />
                  {errors.ponto_final && <p className="text-sm text-red-600">{errors.ponto_final.message}</p>}
                </div>
               </div>

              {/* Seção Condicional */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex items-center space-x-3">
                      <Checkbox id="cannot_execute" checked={cannotExecute} onCheckedChange={(checked) => setValue('cannot_execute', checked as boolean)} />
                      <Label htmlFor="cannot_execute" className="flex items-center gap-2 cursor-pointer text-red-600 font-semibold">
                          <AlertCircle className="w-5 h-5" />
                          Não é possível realizar a ocorrência
                      </Label>
                  </div>

                  {cannotExecute && (
                      <div className="space-y-2 pl-8 animate-in fade-in-50 duration-300">
                          <Label htmlFor="cannot_execute_reason" className="font-semibold">Descreva o motivo *</Label>
                          <Textarea id="cannot_execute_reason" {...register('cannot_execute_reason')} placeholder="Explique por que a ocorrência não pode ser realizada..." rows={4} />
                          {errors.cannot_execute_reason && <p className="text-sm text-red-600">{errors.cannot_execute_reason.message}</p>}
                      </div>
                  )}
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => navigate('/ocorrencias')}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar 
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}