import React, { useState, useEffect } from 'react';
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

// Esquema atualizado sem o campo 'Unidade' que não está no formulário
const EquipeSchema = z.object({
  Nome: z.string().min(1, 'Nome é obrigatório'),
  Especialidade: z.string().min(1, 'Especialidade é obrigatória'),
  QuantidadePessoas: z.string().min(1, 'Quantidade é obrigatória'),
  Empresa: z.string().min(1, 'Empresa é obrigatória'),
  Regional: z.string().min(1, 'Regional é obrigatória'),
  status: z.enum(['ativo', 'inativo'], { required_error: 'Status é obrigatório' }),
  observations: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

type EquipeFormData = z.infer<typeof EquipeSchema>;

const especialidades = [
  'Capina',
  'Varrição',
  'Limpeza de canal',
  'Retirada de animais',
  'Limpeza de boca de lobo',
  'Pintura',
];

const regionais = [
  'Regional 1',
  'Regional 2',
  'Regional 3',
  'Regional 4',
  'Regional 5',
  'Regional 6',
  'Regional 7',
  'Regional 8',
  'Regional 9',
  'Regional 10',
  'Regional 11',
  'Regional 12',
  'CEGOR 00'
];

const empresas = [
  'Marquise',
  'Samarco',
  'Emlurb'
];

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
    defaultValues: {
        status: 'ativo',
    }
  });

  // Observa as mudanças nos campos que compõem o nome da equipe
  const watchedEmpresa = watch('Empresa');
  const watchedEspecialidade = watch('Especialidade');
  const watchedRegional = watch('Regional');

  // Efeito para gerar o nome da equipe dinamicamente
  useEffect(() => {
    if (watchedEmpresa && watchedEspecialidade && watchedRegional) {
      const empresaSigla = watchedEmpresa.substring(0, 3).toUpperCase();
      const especialidadeSigla = watchedEspecialidade.substring(0, 3).toUpperCase();
      
      // Extrai apenas os números da string da regional
      const regionalNumeroMatch = watchedRegional.match(/\d+/);
      let regionalNumero = '00'; // Valor padrão caso não encontre número
      if (regionalNumeroMatch) {
        // Garante que o número tenha sempre dois dígitos (ex: 1 -> 01)
        regionalNumero = regionalNumeroMatch[0].padStart(2, '0');
      }

      const nomeGerado = `${empresaSigla}-${especialidadeSigla}-${regionalNumero}`;
      setValue('Nome', nomeGerado);
    } else {
      setValue('Nome', ''); // Limpa o nome se algum campo estiver vazio
    }
  }, [watchedEmpresa, watchedEspecialidade, watchedRegional, setValue]);


  const onSubmit = (data: EquipeFormData) => {
    console.log('Detalhamento salvo:', data);
    navigate('/cadastros/EquipesCadastradas');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newAttachments = files.map(file => URL.createObjectURL(file));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

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

              {/* Empresa */}
              <div className="space-y-2">
                <Label htmlFor="Empresa">Empresa</Label>
                <select
                  id="Empresa"
                  {...register('Empresa')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecione uma empresa</option>
                  {empresas.map((reg, i) => (
                    <option key={i} value={reg}>{reg}</option>
                  ))}
                </select>
                {errors.Empresa && <p className="text-sm text-red-500">{errors.Empresa.message}</p>}
              </div>

              {/* Especialidade */}
              <div className="space-y-2">
                <Label htmlFor="Especialidade">Especialidade</Label>
                <select
                  id="Especialidade"
                  {...register('Especialidade')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecione uma especialidade</option>
                  {especialidades.map((esp, i) => (
                    <option key={i} value={esp}>{esp}</option>
                  ))}
                </select>
                {errors.Especialidade && <p className="text-sm text-red-500">{errors.Especialidade.message}</p>}
              </div>

              {/* Regional */}
              <div className="space-y-2">
                <Label htmlFor="Regional">Regional</Label>
                <select
                  id="Regional"
                  {...register('Regional')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecione uma regional</option>
                  {regionais.map((reg, i) => (
                    <option key={i} value={reg}>{reg}</option>
                  ))}
                </select>
                {errors.Regional && <p className="text-sm text-red-500">{errors.Regional.message}</p>}
              </div>

              {/* Nome (Desabilitado) */}
              <div className="space-y-2">
                <Label htmlFor="Nome">Nome do time</Label>
                <Input id="Nome" type="text" {...register('Nome')} disabled className="bg-gray-100" />
                {errors.Nome && <p className="text-sm text-red-500">{errors.Nome.message}</p>}
              </div>

              {/* Quantidade */}
              <div className="space-y-2">
                <Label htmlFor="QuantidadePessoas">Quantidade de Pessoas</Label>
                <Input id="QuantidadePessoas" type="number" {...register('QuantidadePessoas')} />
                {errors.QuantidadePessoas && <p className="text-sm text-red-500">{errors.QuantidadePessoas.message}</p>}
              </div>

              {/* Status da Equipe */}
              <div className="space-y-2">
                <Label htmlFor="status">Status da Equipe</Label>
                <select
                  id="status"
                  {...register('status')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
              </div>

            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea id="observations" {...register('observations')} rows={3} />
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <Label htmlFor="attachments">Anexos</Label>
              <div className="flex items-center gap-2">
                <Input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar Documento
                </Button>
              </div>
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative">
                      <img src={attachment} alt={`Anexo ${index + 1}`} className="w-full h-20 object-cover rounded" />
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

            {/* Ações */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Equipe</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
