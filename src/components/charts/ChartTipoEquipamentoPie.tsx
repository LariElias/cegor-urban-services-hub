import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import { CommonData } from "./types";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const DEFAULT_COLORS = ["#ee8023", "#ffd55a", "#2b9cec", "#000000", "#1f3fce", "#ef9352", "#8ec3ff"];

type Props = { data: CommonData[]; colors?: string[] };

const ChartTipoEquipamentoPie: React.FC<Props> = ({ data, colors = DEFAULT_COLORS }) => {
  const compact = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          label={({ value, percent }) => `${value} (${(percent * 100).toFixed(1)}%)`}
        >
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  const expanded = () => (
    <div className="h-[520px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={110}
            outerRadius={180}
            paddingAngle={2}
            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
          >
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <ExpandableChartCard title="Quantidade por Tipo de Equipamento" renderCompact={compact} renderExpanded={expanded} />
  );
};

export default ChartTipoEquipamentoPie;
