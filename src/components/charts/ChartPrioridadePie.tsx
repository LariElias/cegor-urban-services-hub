import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

export interface PrioridadeData { prioridade: string; total: number }
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ChartPrioridadePie({ data }: { data: PrioridadeData[] }) {
  const renderCompact = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="prioridade"
            outerRadius={80}
            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
          <Tooltip />
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
            dataKey="total"
            nameKey="prioridade"
            innerRadius={110}
            outerRadius={180}
            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
          >
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <ExpandableChartCard
      title="Prioridade"
      renderCompact={renderCompact}
      renderExpanded={renderExpanded}
    />
  );
}
