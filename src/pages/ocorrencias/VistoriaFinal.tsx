import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function VistoriaFinal() {
  const [selectedPeriod, setSelectedPeriod] = useState<"diurno" | "vespertino" | "noturno">("diurno");
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handlePeriodChange = (period: "diurno" | "vespertino" | "noturno") => {
    setSelectedPeriod(period);
  };

  const handleProblemSelect = (problem: string) => {
    if (selectedProblems.includes(problem)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== problem));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const problemasEncontrados = {
    diurno: [
      { name: "Equipamento danificado" },
      { name: "Local de difícil acesso" },
      { name: "Falta de material" }
    ],
    vespertino: [
      { name: "Iluminação inadequada" },
      { name: "Movimento de pedestres" },
      { name: "Trânsito intenso" }
    ],
    noturno: [
      { name: "Segurança do local" },
      { name: "Visibilidade reduzida" },
      { name: "Acesso restrito" }
    ]
  };

  const handleSubmit = () => {
    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    console.log({
      periodo: selectedPeriod,
      problemas: selectedProblems,
      observacoes: additionalNotes,
    });
    alert("Vistoria Finalizada! Dados enviados para análise.");
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Vistoria Final</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Período da Vistoria</Label>
            <div className="flex space-x-4 mt-2">
              <Button
                variant={selectedPeriod === "diurno" ? "default" : "outline"}
                onClick={() => handlePeriodChange("diurno")}
              >
                Diurno
              </Button>
              <Button
                variant={selectedPeriod === "vespertino" ? "default" : "outline"}
                onClick={() => handlePeriodChange("vespertino")}
              >
                Vespertino
              </Button>
              <Button
                variant={selectedPeriod === "noturno" ? "default" : "outline"}
                onClick={() => handlePeriodChange("noturno")}
              >
                Noturno
              </Button>
            </div>
          </div>

          <div>
            <Label>Problemas Encontrados</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
              {problemasEncontrados[selectedPeriod].map((problem) => (
                <div key={problem.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={problem.name}
                    checked={selectedProblems.includes(problem.name)}
                    onCheckedChange={() => handleProblemSelect(problem.name)}
                  />
                  <Label htmlFor={problem.name}>{problem.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="additionalNotes">Observações Adicionais</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Detalhe aqui outros problemas ou observações relevantes."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit}>Finalizar Vistoria</Button>
        </CardContent>
      </Card>
    </div>
  );
}
