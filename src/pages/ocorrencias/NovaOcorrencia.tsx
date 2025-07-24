import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Calendar, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Ocorrencia } from '@/types';

// Schema de validação atualizado
const ocorrenciaSchema = z.object({
  occurrence_date: z.string().min(1, 'Data da ocorrência é obrigatória'),
  occurrence_type: z.string().min(1, 'Tipo de ocorrência é obrigatório'),
  origin: z.string().min(1, 'Origem é obrigatória'),
  origin_number: z.string().min(1, 'Número de origem é obrigatório'),
  public_equipment_id: z.string().min(1, 'Equipamento público é obrigatório'),
  territory_id: z.string().optional(),
  street_type: z.string().optional(),
  street_name: z.string().optional(),
  street_number: z.string().optional(),
  complement: z.string().optional(),
  cep: z.string().optional(),
  neighborhood: z.string().optional(),
  priority: z.enum(['baixa', 'media', 'alta'], { errorMap: () => ({ message: "Selecione uma prioridade" }) }),
  description: z.string().min(1, 'Descrição é obrigatória'),
  attachments: z.array(z.string()).optional(),
  observations: z.string().optional(),
  should_schedule: z.boolean().default(false),
  schedule_date: z.string().optional(), // Campo de data de agendamento
}).refine(data => {
  // Torna a data de agendamento obrigatória se o checkbox estiver marcado
  if (data.should_schedule) {
    return !!data.schedule_date;
  }
  return true;
}, {
  message: 'Data de agendamento é obrigatória.',
  path: ['schedule_date'], // Associa o erro ao campo correto
});

type OcorrenciaFormData = z.infer<typeof ocorrenciaSchema>;

export default function NovaOcorrencia() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attachments, setAttachments] = useState<string[]>([]);
  const [equipmentSelected, setEquipmentSelected] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OcorrenciaFormData>({
    resolver: zodResolver(ocorrenciaSchema),
    defaultValues: {
        should_schedule: false,
        priority: undefined,
    }
  });

  const shouldSchedule = watch('should_schedule');

  // Mock data
  const publicEquipments = [
    { id: '1', name: 'Praça Central', territory: 'Centro', street: 'Rua das Flores', number: '123', cep: '30000-000', neighborhood: 'Centro' },
    { id: '2', name: 'Parque Municipal', territory: 'Norte', street: 'Av. Brasil', number: '456', cep: '30001-000', neighborhood: 'Norte' },
  ];

  const territories = [
    { id: '1', name: 'Centro' },
    { id: '2', name: 'Norte' },
    { id: '3', name: 'Sul' },
  ];

  const handleEquipmentChange = (equipmentId: string) => {
    const equipment = publicEquipments.find(eq => eq.id === equipmentId);
    if (equipment) {
      setValue('territory_id', equipment.territory);
      setValue('street_name', equipment.street);
      setValue('street_number', equipment.number);
      setValue('cep', equipment.cep);
      setValue('neighborhood', equipment.neighborhood);
      setEquipmentSelected(true);
    } else {
      setEquipmentSelected(false);
      setValue('territory_id', '');
      setValue('street_name', '');
      setValue('street_number', '');
      setValue('cep', '');
      setValue('neighborhood', '');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments = files.map(file => URL.createObjectURL(file));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const onSubmit = (data: OcorrenciaFormData) => {
    console.log("Dados do formulário:", data);
    // Lógica de criação da ocorrência
    navigate('/ocorrencias');
  };

  if (user?.role !== 'regional') {
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
        <h1 className="text-3xl font-bold">Registro de Ocorrência</h1>
      </div>

      <Card>
        <CardHeader>
          <p>Preencher todos os campos com (*)</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <div className="space-y-2">
                <Label htmlFor="occurrence_date">Data da Ocorrência *</Label>
                <Input id="occurrence_date" type="date" {...register('occurrence_date')} />
                {errors.occurrence_date && <p className="text-sm text-red-500">{errors.occurrence_date.message}</p>}
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="occurrence_type">Tipo de Ocorrência *</Label>
                <select id="occurrence_type" {...register('occurrence_type')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Selecione o tipo</option>
                  <option value="Varrição">Varrição</option>
                  <option value="Capina/Poda">Capina/Poda</option>
                </select>
                {errors.occurrence_type && <p className="text-sm text-red-500">{errors.occurrence_type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Origem *</Label>
                <select id="origin" {...register('origin')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Selecione a origem</option>
                  <option value="SPU">SPU</option>
                  <option value="Presencial">Presencial</option>
                </select>
                {errors.origin && <p className="text-sm text-red-500">{errors.origin.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin_number">Número de Origem *</Label>
                <Input id="origin_number" {...register('origin_number')} placeholder="Protocolo do sistema de origem" />
                {errors.origin_number && <p className="text-sm text-red-500">{errors.origin_number.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="public_equipment_id">Equipamento Público *</Label>
                <select id="public_equipment_id" {...register('public_equipment_id')} onChange={(e) => handleEquipmentChange(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Selecione o equipamento</option>
                  {publicEquipments.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
                </select>
                {errors.public_equipment_id && <p className="text-sm text-red-500">{errors.public_equipment_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="territory_id">Território</Label>
                <select id="territory_id" {...register('territory_id')} disabled={equipmentSelected} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Selecione o território</option>
                  {territories.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street_type">Tipo de Logradouro</Label>
                <select id="street_type" {...register('street_type')} disabled={equipmentSelected} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Selecione o tipo</option>
                  <option value="Rua">Rua</option>
                  <option value="Avenida">Avenida</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street_name">Logradouro</Label>
                <Input id="street_name" {...register('street_name')} disabled={equipmentSelected} placeholder="Nome do logradouro" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street_number">Número</Label>
                <Input id="street_number" {...register('street_number')} disabled={equipmentSelected} placeholder="Número" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input id="complement" {...register('complement')} disabled={equipmentSelected} placeholder="Complemento" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" {...register('cep')} disabled={equipmentSelected} placeholder="00000-000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" {...register('neighborhood')} disabled={equipmentSelected} placeholder="Bairro" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade *</Label>
                <select id="priority" {...register('priority')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Selecione a prioridade</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
                {errors.priority && <p className="text-sm text-red-500">{errors.priority.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea id="description" {...register('description')} placeholder="Descreva a ocorrência" rows={3} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachments">Anexos</Label>
              <div className="flex items-center gap-2">
                <Input type="file" multiple accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload className="w-4 h-4 mr-2" /> Adicionar Arquivos
                </Button>
              </div>
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative">
                      <img src={attachment} alt={`Anexo ${index + 1}`} className="w-full h-20 object-cover rounded" />
                      <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={() => removeAttachment(index)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea id="observations" {...register('observations')} placeholder="Observações adicionais" rows={2} />
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="should_schedule" checked={shouldSchedule} onCheckedChange={(checked) => setValue('should_schedule', checked as boolean)} />
                  <Label htmlFor="should_schedule" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="w-4 h-4" /> Deseja agendar esta ocorrência?
                  </Label>
                </div>

                {shouldSchedule && (
                  <div className="space-y-2 pl-6 animate-in fade-in-50">
                    <Label htmlFor="schedule_date">Data de Agendamento da Ocorrência *</Label>
                    <Input id="schedule_date" type="date" {...register('schedule_date')} />
                    {errors.schedule_date && <p className="text-sm text-red-500">{errors.schedule_date.message}</p>}
                  </div>
                )}
              </div>
            </div> */}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate('/ocorrencias')}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {shouldSchedule ? 'Salvar e Agendar' : 'Salvar'}
                </Button>
              </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
