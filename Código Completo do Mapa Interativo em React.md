# Código Completo do Mapa Interativo em React

## 1. Instalação de Dependências

```bash
npm install react-leaflet leaflet
npm install @types/leaflet --save-dev  # Se usando TypeScript
```

## 2. Componente Principal do Mapa

```tsx
// components/MapComponent.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para ícones do Leaflet no React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Occurrence {
  id: string;
  protocolo: string;
  tipo: string;
  status: 'Pendente' | 'Em Execução' | 'Concluído';
  prioridade: 'Baixa' | 'Média' | 'Alta';
  bairro: string;
  regional: string;
  latitude: number;
  longitude: number;
  data_criacao: string;
  empresa?: string;
  origem: string;
}

interface MapComponentProps {
  occurrences: Occurrence[];
  selectedStatus: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ occurrences, selectedStatus }) => {
  const [filteredOccurrences, setFilteredOccurrences] = useState<Occurrence[]>([]);

  // Cores por status
  const statusColors = {
    'Pendente': '#EF4444',      // Vermelho
    'Em Execução': '#F59E0B',   // Laranja
    'Concluído': '#10B981'      // Verde
  };

  // Filtrar ocorrências baseado no status selecionado
  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredOccurrences(occurrences);
    } else {
      setFilteredOccurrences(occurrences.filter(occ => occ.status === selectedStatus));
    }
  }, [occurrences, selectedStatus]);

  // Coordenadas de Fortaleza
  const fortalezaCenter: [number, number] = [-3.7319, -38.5267];

  return (
    <div className="map-container">
      <MapContainer
        center={fortalezaCenter}
        zoom={11}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredOccurrences.map((occurrence) => (
          <CircleMarker
            key={occurrence.id}
            center={[occurrence.latitude, occurrence.longitude]}
            radius={8}
            pathOptions={{
              color: statusColors[occurrence.status],
              fillColor: statusColors[occurrence.status],
              fillOpacity: 0.7,
              weight: 2
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h4>Ocorrência {occurrence.protocolo}</h4>
                <p><strong>Tipo:</strong> {occurrence.tipo}</p>
                <p><strong>Status:</strong> 
                  <span 
                    style={{ 
                      color: statusColors[occurrence.status],
                      fontWeight: 'bold',
                      marginLeft: '5px'
                    }}
                  >
                    {occurrence.status}
                  </span>
                </p>
                <p><strong>Prioridade:</strong> {occurrence.prioridade}</p>
                <p><strong>Bairro:</strong> {occurrence.bairro}</p>
                <p><strong>Regional:</strong> {occurrence.regional}</p>
                <p><strong>Origem:</strong> {occurrence.origem}</p>
                <p><strong>Data:</strong> {occurrence.data_criacao}</p>
                {occurrence.empresa && (
                  <p><strong>Empresa:</strong> {occurrence.empresa}</p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
```

## 3. Componente de Filtro

```tsx
// components/MapFilter.tsx
import React from 'react';

interface MapFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const MapFilter: React.FC<MapFilterProps> = ({ selectedStatus, onStatusChange }) => {
  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Em Execução', label: 'Em Execução' },
    { value: 'Concluído', label: 'Concluído' }
  ];

  return (
    <div className="map-filter">
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="form-select"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MapFilter;
```

## 4. Seção Completa do Mapa

```tsx
// components/MapSection.tsx
import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import MapFilter from './MapFilter';
import { FaMap } from 'react-icons/fa';

interface Occurrence {
  id: string;
  protocolo: string;
  tipo: string;
  status: 'Pendente' | 'Em Execução' | 'Concluído';
  prioridade: 'Baixa' | 'Média' | 'Alta';
  bairro: string;
  regional: string;
  latitude: number;
  longitude: number;
  data_criacao: string;
  empresa?: string;
  origem: string;
}

const MapSection: React.FC = () => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados das ocorrências
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/map_data');
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados do mapa');
        }
        
        const data = await response.json();
        setOccurrences(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao carregar mapa:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  if (loading) {
    return (
      <div className="map-section">
        <h3><FaMap /> Mapa de Ocorrências</h3>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-section">
        <h3><FaMap /> Mapa de Ocorrências</h3>
        <div className="error-message">
          <p>Erro ao carregar o mapa: {error}</p>
          <button onClick={() => window.location.reload()}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-section">
      <h3><FaMap /> Mapa de Ocorrências</h3>
      
      <div className="map-controls">
        <MapFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        <div className="map-stats">
          <span>
            Exibindo {occurrences.filter(occ => 
              selectedStatus === 'all' || occ.status === selectedStatus
            ).length} de {occurrences.length} ocorrências
          </span>
        </div>
      </div>

      <MapComponent
        occurrences={occurrences}
        selectedStatus={selectedStatus}
      />

      {/* Legenda */}
      <div className="map-legend">
        <h4>Legenda:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#EF4444' }}></div>
            <span>Pendente</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#F59E0B' }}></div>
            <span>Em Execução</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#10B981' }}></div>
            <span>Concluído</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
```

## 5. Hook Customizado para Dados do Mapa

```tsx
// hooks/useMapData.ts
import { useState, useEffect } from 'react';

interface Occurrence {
  id: string;
  protocolo: string;
  tipo: string;
  status: 'Pendente' | 'Em Execução' | 'Concluído';
  prioridade: 'Baixa' | 'Média' | 'Alta';
  bairro: string;
  regional: string;
  latitude: number;
  longitude: number;
  data_criacao: string;
  empresa?: string;
  origem: string;
}

interface UseMapDataReturn {
  occurrences: Occurrence[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMapData = (): UseMapDataReturn => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/map_data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOccurrences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      console.error('Erro ao carregar dados do mapa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    occurrences,
    loading,
    error,
    refetch: fetchData
  };
};
```

## 6. CSS/Styled Components

```css
/* styles/MapSection.css */
.map-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.map-section h3 {
  margin-bottom: 1rem;
  color: #374151;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.map-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.map-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.map-stats {
  font-size: 0.9rem;
  color: #6b7280;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.map-legend {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.map-legend h4 {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #374151;
}

.legend-items {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #ef4444;
}

.error-message button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.error-message button:hover {
  background: #1d4ed8;
}

/* Responsividade */
@media (max-width: 768px) {
  .map-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .legend-items {
    justify-content: center;
  }
  
  .map-section {
    padding: 1rem;
  }
}
```

## 7. Uso no Dashboard Principal

```tsx
// pages/Dashboard.tsx
import React from 'react';
import MapSection from '../components/MapSection';
import KPICards from '../components/KPICards';
import ChartsSection from '../components/ChartsSection';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h2>Dashboard - Gestor Regional</h2>
      
      {/* KPI Cards */}
      <KPICards />
      
      {/* Charts Section */}
      <ChartsSection />
      
      {/* Map Section */}
      <MapSection />
      
      {/* Recent Occurrences */}
      {/* ... outros componentes */}
    </div>
  );
};

export default Dashboard;
```

## 8. Versão com Styled Components (Opcional)

```tsx
// components/MapSection.styled.ts
import styled from 'styled-components';

export const MapSectionContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

export const MapTitle = styled.h3`
  margin-bottom: 1rem;
  color: #374151;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const MapControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const MapContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  
  .leaflet-container {
    height: 400px;
    width: 100%;
  }
`;

export const MapLegend = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;

  h4 {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #374151;
  }
`;

export const LegendItems = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
`;

export const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;
```

## 9. Funcionalidades Avançadas (Opcional)

```tsx
// components/AdvancedMapComponent.tsx
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';

// Componente para capturar eventos do mapa
const MapEventHandler: React.FC<{ onBoundsChange: (bounds: LatLngBounds) => void }> = ({ onBoundsChange }) => {
  useMapEvents({
    moveend: (e) => {
      onBoundsChange(e.target.getBounds());
    },
    zoomend: (e) => {
      onBoundsChange(e.target.getBounds());
    }
  });
  return null;
};

// Componente com funcionalidades avançadas
const AdvancedMapComponent: React.FC<MapComponentProps> = ({ occurrences, selectedStatus }) => {
  const [visibleOccurrences, setVisibleOccurrences] = useState<Occurrence[]>([]);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const mapRef = useRef<any>(null);

  // Filtrar ocorrências visíveis no mapa
  const handleBoundsChange = (bounds: LatLngBounds) => {
    setMapBounds(bounds);
    const visible = occurrences.filter(occ => 
      bounds.contains([occ.latitude, occ.longitude])
    );
    setVisibleOccurrences(visible);
  };

  // Função para centralizar no marcador
  const centerOnOccurrence = (occurrence: Occurrence) => {
    if (mapRef.current) {
      mapRef.current.setView([occurrence.latitude, occurrence.longitude], 15);
    }
  };

  return (
    <div>
      <div className="map-info">
        <p>Ocorrências visíveis: {visibleOccurrences.length}</p>
      </div>
      
      <MapContainer
        ref={mapRef}
        center={[-3.7319, -38.5267]}
        zoom={11}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        <MapEventHandler onBoundsChange={handleBoundsChange} />
        
        {/* Renderizar apenas ocorrências filtradas */}
        {occurrences
          .filter(occ => selectedStatus === 'all' || occ.status === selectedStatus)
          .map((occurrence) => (
            <CircleMarker
              key={occurrence.id}
              center={[occurrence.latitude, occurrence.longitude]}
              radius={8}
              pathOptions={{
                color: statusColors[occurrence.status],
                fillColor: statusColors[occurrence.status],
                fillOpacity: 0.7,
                weight: 2
              }}
              eventHandlers={{
                click: () => centerOnOccurrence(occurrence)
              }}
            >
              <Popup>
                {/* Popup content */}
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
};
```

## 10. Características do Mapa React

### ✅ **Funcionalidades Implementadas:**
- **React Leaflet**: Integração nativa com React
- **TypeScript**: Tipagem completa para melhor desenvolvimento
- **Hooks Customizados**: Reutilização de lógica
- **Componentes Modulares**: Fácil manutenção
- **Filtros Dinâmicos**: Por status em tempo real
- **Loading States**: Indicadores de carregamento
- **Error Handling**: Tratamento de erros
- **Responsivo**: Mobile-first design
- **Styled Components**: CSS-in-JS (opcional)

### 🎯 **Vantagens do React:**
- **Performance**: Re-renderização otimizada
- **Manutenibilidade**: Código mais organizado
- **Reutilização**: Componentes reutilizáveis
- **Ecosystem**: Integração com outras libs React
- **Developer Experience**: Melhor DX com TypeScript

Este código React oferece uma implementação completa e moderna do mapa interativo!

