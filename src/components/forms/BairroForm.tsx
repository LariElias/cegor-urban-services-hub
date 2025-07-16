
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bairro } from '@/types';

const bairroSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  code: z.string().min(1, 'Código é obrigatório'),
  regional_id: z.string().min(1, 'Regional é obrigatória'),
});

type BairroFormData = z.infer<typeof bairroSchema>;

interface BairroFormProps {
  bairro?: Bairro | null;
  onSave: (data: BairroFormData) => void;
  onCancel: () => void;
}

export function BairroForm({ bairro, onSave, onCancel }: BairroFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BairroFormData>({
    resolver: zodResolver(bairroSchema),
    defaultValues: bairro ? {
      name: bairro.name,
      code: bairro.code,
      regional_id: bairro.regional_id,
    } : {},
  });

  const onSubmit = (data: BairroFormData) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {bairro ? 'Editar Bairro' : 'Novo Bairro'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="Ex: CT"
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Centro"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="regional_id">Regional *</Label>
              <select
                id="regional_id"
                {...register('regional_id')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione uma regional</option>
                <option value="1">Centro-Sul</option>
                <option value="2">Norte</option>
              </select>
              {errors.regional_id && (
                <p className="text-sm text-red-500">{errors.regional_id.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {bairro ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
