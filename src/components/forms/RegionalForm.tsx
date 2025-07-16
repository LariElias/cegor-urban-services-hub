
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Regional } from '@/types';

const regionalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  code: z.string().min(1, 'Código é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  responsible: z.string().min(1, 'Responsável é obrigatório'),
});

type RegionalFormData = z.infer<typeof regionalSchema>;

interface RegionalFormProps {
  regional?: Regional | null;
  onSave: (data: RegionalFormData) => void;
  onCancel: () => void;
}

export function RegionalForm({ regional, onSave, onCancel }: RegionalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegionalFormData>({
    resolver: zodResolver(regionalSchema),
    defaultValues: regional ? {
      name: regional.name,
      code: regional.code,
      address: regional.address,
      phone: regional.phone,
      responsible: regional.responsible,
    } : {},
  });

  const onSubmit = (data: RegionalFormData) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {regional ? 'Editar Regional' : 'Nova Regional'}
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
                placeholder="Ex: CS"
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
                placeholder="Ex: Centro-Sul"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Ex: Rua das Flores, 123"
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Ex: (31) 3333-4444"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável *</Label>
              <Input
                id="responsible"
                {...register('responsible')}
                placeholder="Ex: João Silva"
              />
              {errors.responsible && (
                <p className="text-sm text-red-500">{errors.responsible.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {regional ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
