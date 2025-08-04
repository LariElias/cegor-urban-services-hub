import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import { CommonData } from "./types";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const DEFAULT_COLORS = ["#ee8023"];

type Props = { data: CommonData[]; colors?: string[] };

const ChartServicosPorRequerente: React.FC<Props> = ({ data, colors = DEFAULT_COLORS }) => {
  const compact = () => (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number"
          allowDecimals={false}          // só inteiros
          domain={[0, 'dataMax']}
        />
        <YAxis type="category" dataKey="name" width={160} interval={0} />
        <Tooltip />
        <Bar dataKey="value" fill={colors[0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const expanded = () => (
    <div className="h-[520px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number"
            allowDecimals={false}          // só inteiros
            domain={[0, 'dataMax']}
          />
          <YAxis type="category" dataKey="name" width={240} interval={0} />
          <Tooltip />
          <Bar dataKey="value" fill={colors[0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <ExpandableChartCard
      title="Quantidade de Serviços por Requerente"
      renderCompact={compact}
      renderExpanded={expanded}
      scroll
    />
  );
};

export default ChartServicosPorRequerente;
