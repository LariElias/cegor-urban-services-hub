// src/components/charts/ChartPeriodoTrabalhoDias.tsx

import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export interface PeriodoDiasData {
  name: string;
  value: number;
}

// Paleta de cores – ajuste como preferir
const COLORS = [
  "#ee8023", "#00c49f", "#3b82f6", "#8b5cf6",
  "#f43f5e", "#e11d48", "#64748b",
];

type Props = { data: PeriodoDiasData[] };

export default function ChartPeriodoTrabalhoDias({ data }: Props) {
  const renderCompact = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v} ocorrências`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderExpanded = () => (
    <div className="h-[560px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={110}
            outerRadius={180}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v} ocorrências`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <ExpandableChartCard
      title="Quantidade por Período Trabalhado em Dias"
      renderCompact={renderCompact}
      renderExpanded={renderExpanded}
    />
  );
}
