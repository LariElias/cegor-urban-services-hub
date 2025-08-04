import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import { CommonData } from "./types";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const DEFAULT_COLORS = ["#ee8023"];

type Props = { data: CommonData[]; colors?: string[] };

const ChartOrigemDemanda: React.FC<Props> = ({ data, colors = DEFAULT_COLORS }) => {
  const compact = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number"
          allowDecimals={false}          // só inteiros
          domain={[0, 'dataMax']}
        />
        <YAxis type="category" dataKey="name" width={120} interval={0} />
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
            allowDecimals={false}
            domain={[0, 'dataMax']}
          />
          <YAxis type="category" dataKey="name" width={200} interval={0} />
          <Tooltip />
          <Bar dataKey="value" fill={colors[0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <ExpandableChartCard title="Quantidade por Origem da Demanda" renderCompact={compact} renderExpanded={expanded} />
  );
};

export default ChartOrigemDemanda;
