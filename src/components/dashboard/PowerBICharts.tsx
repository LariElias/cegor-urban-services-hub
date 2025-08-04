import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export interface CommonData {
  name: string;
  value: number;
}

interface ChartsProps {
  statusData: CommonData[];
  bairroData: CommonData[];
  equipamentoData: CommonData[];
  origemData: CommonData[];
  requerenteData: CommonData[];
  colors?: string[];
}


const DEFAULT_COLORS = [
  "#ee8023",
  "#ffd55a",
  "#2b9cec",
  "#000000",
  "#1f3fce",
  "#ef9352",
  "#8ec3ff",
];


function ChartCard({
  title,
  onExpand,
  children,
  scroll = false,
}: {
  title: string;
  onExpand: () => void;
  children: React.ReactNode;
  scroll?: boolean;
}) {
  return (
    <Card className="group">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-70 hover:opacity-100"
          onClick={onExpand}
          title="Expandir"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent
        className={scroll ? "h-[340px] overflow-y-auto" : ""}
        onClick={onExpand}
        role="button"
        tabIndex={0}
      >
        {children}
      </CardContent>
    </Card>
  );
}


const PowerBICharts: React.FC<ChartsProps> = ({
  statusData,
  bairroData,
  equipamentoData,
  origemData,
  requerenteData,
  colors = DEFAULT_COLORS,
}) => {
  type Key =
    | "status"
    | "bairro"
    | "equip"
    | "origem"
    | "requerente";

  const [expanded, setExpanded] = useState<null | Key>(null);

  const titles: Record<Key, string> = useMemo(
    () => ({
      status: "Quantidade por Status",
      bairro: "Quantidade por Bairro",
      equip: "Quantidade por Tipo de Equipamento",
      origem: "Quantidade por Origem da Demanda",
      requerente: "Quantidade de Serviços por Requerente",
    }),
    []
  );


  const renderChart = (key: Key) => {
    switch (key) {
      case "status":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="6 3" />
              <XAxis dataKey="name" interval={0} angle={0} height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "bairro":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={bairroData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={110} interval={0} />
              <Tooltip />
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "equip":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={equipamentoData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                label={({ value, percent }) => `${value} (${(percent * 100).toFixed(1)}%)`}
              >
                {equipamentoData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case "origem":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={origemData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} interval={0} />
              <Tooltip />
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "requerente":
        return (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={requerenteData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={160} interval={0} />
              <Tooltip />
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };


  const renderExpanded = (key: Key) => {
    switch (key) {
      case "status":
        return (
          <div className="h-[520px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} angle={0} height={50} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={colors[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "bairro":
        return (
          <div className="h-[520px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bairroData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={180} interval={0} />
                <Tooltip />
                <Bar dataKey="value" fill={colors[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "equip":
        return (
          <div className="h-[520px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipamentoData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={110}
                  outerRadius={180}
                  paddingAngle={2}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {equipamentoData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case "origem":
        return (
          <div className="h-[520px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={origemData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={200} interval={0} />
                <Tooltip />
                <Bar dataKey="value" fill={colors[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "requerente":
        return (
          <div className="h-[520px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requerenteData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={240} interval={0} />
                <Tooltip />
                <Bar dataKey="value" fill={colors[0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title={titles.status} onExpand={() => setExpanded("status")}>
          {renderChart("status")}
        </ChartCard>

        <ChartCard title={titles.bairro} onExpand={() => setExpanded("bairro")} scroll>
          {renderChart("bairro")}
        </ChartCard>

        <ChartCard title={titles.equip} onExpand={() => setExpanded("equip")}>
          {renderChart("equip")}
        </ChartCard>

        <ChartCard title={titles.origem} onExpand={() => setExpanded("origem")}>
          {renderChart("origem")}
        </ChartCard>

        <div className="xl:col-span-2">
          <ChartCard title={titles.requerente} onExpand={() => setExpanded("requerente")} scroll>
            {renderChart("requerente")}
          </ChartCard>
        </div>
      </div>


      <Dialog open={expanded !== null} onOpenChange={() => setExpanded(null)}>
        <DialogContent className="max-w-[1100px] w-[95vw]">
          {expanded && (
            <>
              <DialogHeader>
                <DialogTitle>{titles[expanded]}</DialogTitle>
              </DialogHeader>
              <div className="mt-2">{renderExpanded(expanded)}</div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PowerBICharts;
