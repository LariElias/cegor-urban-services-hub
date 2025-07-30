import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Ocorrencia } from '@/types';

export default function VisualizarOcorrencia() {
  const { id } = useParams<{ id: string }>();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | undefined>(undefined);

  const mockOcorrencias: Ocorrencia[] = [
    {
      id: '1',
      protocol: 'OC-2024-001',
      description: 'Limpeza de praça central com remoção de entulho',
      service_type: 'Limpeza',
      public_equipment_name: 'Praça da Liberdade',
      priority: 'alta',
      status: 'criada',
      address: 'Praça da Liberdade, Centro',
      latitude: -19.9245,
      longitude: -43.9352,
      regional_id: '1',
      fiscal_id: '1',
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z',
      equipamento: {
        id: '1',
        name: 'Praça da Liberdade',
        type: 'Praça',
        address: 'Praça da Liberdade, Centro',
        latitude: -19.9245,
        longitude: -43.9352,
        bairro_id: '1',
        regional_id: '1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        bairro: {
          id: '1',
          name: 'Centro',
          code: 'CT001',
          regional_id: '1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      }
    },
    {
      id: '2',
      protocol: 'OC-2024-002',
      description: 'Reparo de iluminação pública na Rua da Bahia',
      service_type: 'Iluminação',
      public_equipment_name: 'Poste de Luz Rua da Bahia',
      priority: 'media',
      status: 'em_execucao',
      address: 'Rua da Bahia, 1000, Centro',
      latitude: -19.9210,
      longitude: -43.9385,
      regional_id: '1',
      fiscal_id: '2',
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-15T12:00:00Z',
      equipamento: {
        id: '2',
        name: 'Poste de Luz Rua da Bahia',
        type: 'Poste de Luz',
        address: 'Rua da Bahia, 1000, Centro',
        latitude: -19.9210,
        longitude: -43.9385,
        bairro_id: '1',
        regional_id: '1',
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-05T00:00:00Z',
        bairro: {
          id: '1',
          name: 'Centro',
          code: 'CT001',
          regional_id: '1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      }
    },
    {
      id: '3',
      protocol: 'OC-2024-003',
      description: 'Substituição de lixeira danificada no Parque Municipal',
      service_type: 'Manutenção',
      public_equipment_name: 'Lixeira Parque Municipal',
      priority: 'baixa',
      status: 'concluida',
      address: 'Parque Municipal, Av. Afonso Pena',
      latitude: -19.9275,
      longitude: -43.9403,
      regional_id: '1',
      fiscal_id: '3',
      created_at: '2024-01-05T14:00:00Z',
      updated_at: '2024-01-15T16:00:00Z',
      equipamento: {
        id: '3',
        name: 'Lixeira Parque Municipal',
        type: 'Lixeira',
        address: 'Parque Municipal, Av. Afonso Pena',
        latitude: -19.9275,
        longitude: -43.9403,
        bairro_id: '1',
        regional_id: '1',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
        bairro: {
          id: '1',
          name: 'Centro',
          code: 'CT001',
          regional_id: '1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      }
    },
  ];

  useEffect(() => {
    if (id) {
      const ocorrenciaEncontrada = mockOcorrencias.find(oco => oco.id === id);
      setOcorrencia(ocorrenciaEncontrada);
    }
  }, [id]);

  if (!ocorrencia) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Ocorrência não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Detalhes da Ocorrência</h1>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Protocolo</label>
              <p className="text-gray-900">{ocorrencia.protocol}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-gray-900">{ocorrencia.status}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Equipamento Público</label>
              <p className="text-gray-900">{ocorrencia.public_equipment_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Bairro</label>
              <p className="text-gray-900">{ocorrencia.equipamento?.bairro?.name || 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Tipo de Serviço</label>
              <p className="text-gray-900">{ocorrencia.service_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Prioridade</label>
              <p className="text-gray-900">{ocorrencia.priority}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Descrição</label>
            <p className="text-gray-900">{ocorrencia.description}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Endereço</label>
            <p className="text-gray-900">{ocorrencia.address}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
