import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* Itens que o card renderiza */
export interface EquipeOcupadaItem {
  equipe: string;                 // Nome da equipe
  ocorrenciaId: string;           // Para abrir a tela da ocorrência
  protocolo: string;              // OCR-2024-...
  atividade?: string;             // service_type / tipo de serviço
  prioridade?: "baixa" | "media" | "alta" | "urgente" | string;
  regional?: string;
  descricao?: string;
  dataRef?: string;               // updated_at / data/hora (ISO)
}

/* Constrói a lista a partir do seu array de ocorrências:
   pega SOMENTE as que estão em execução e têm equipe atribuída,
   ordenadas da mais recente para a mais antiga. */
export function buildEquipesOcupadas<T extends Record<string, any>>(ocorrencias: T[]): EquipeOcupadaItem[] {
  return ocorrencias
    .filter(o => o?.equipe_id && o?.status === "em_execucao")
    .sort((a, b) => new Date(b?.updated_at ?? 0).getTime() - new Date(a?.updated_at ?? 0).getTime())
    .map(o => ({
      equipe: String(o.equipe_id),
      ocorrenciaId: String(o.id),
      protocolo: String(o.protocol ?? o.protocolo ?? ""),
      atividade: String(o.service_type ?? o.tipo_de_ocorrencia ?? ""),
      prioridade: o.priority,
      regional: o.regional_name ?? o.regional,
      descricao: o.description,
      dataRef: o.updated_at ?? o.date,
    }));
}

const getPriorityBadge = (p?: string) => {
  const map: Record<string, string> = {
    baixa: "bg-green-100 text-green-800",
    media: "bg-yellow-100 text-yellow-800",
    alta: "bg-orange-100 text-orange-800",
    urgente: "bg-red-100 text-red-800",
  };
  return p ? <Badge className={map[p] ?? "bg-gray-100 text-gray-800"}>{p}</Badge> : null;
};

const StatusAlocada = () => <Badge className="bg-blue-100 text-blue-800">Alocada</Badge>;

interface Props {
  items: EquipeOcupadaItem[];
  onGoToOcorrencia?: (ocorrenciaId: string) => void; 
  title?: string;
  description?: string;
}


const EquipesEmCampoCard: React.FC<Props> = ({
  items,
  onGoToOcorrencia,
  title = "Equipes em campo",
  description = "Equipes atualmente alocadas em ocorrências",
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground text-center bg-gray-50 rounded-lg">
            Nenhuma equipe alocada no momento.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.ocorrenciaId}-${item.equipe}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{item.equipe}</span>
                    <StatusAlocada />
                    {getPriorityBadge(item.prioridade)}
                  </div>

                  <p className="text-sm text-gray-600 truncate">
                    {item.atividade ?? "—"} • {item.protocolo}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.regional ?? "—"}
                    {item.dataRef ? ` • ${new Date(item.dataRef).toLocaleString("pt-BR")}` : ""}
                  </p>

                  {item.descricao && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.descricao}</p>
                  )}
                </div>

                {onGoToOcorrencia && (
                  <div className="pl-3">
                    <Button size="sm" onClick={() => onGoToOcorrencia(item.ocorrenciaId)}>
                      Ocorrência
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EquipesEmCampoCard;
