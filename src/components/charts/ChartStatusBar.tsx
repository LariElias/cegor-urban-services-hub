import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import { CommonData } from "./types";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const DEFAULT_COLORS = ["#ee8023"];

type Props = { data: CommonData[]; colors?: string[] };

const ChartStatusBar: React.FC<Props> = ({ data, colors = DEFAULT_COLORS }) => {
  const compact = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="6 3" />
        <XAxis dataKey="name" interval={0} height={40} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={colors[0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const expanded = () => (
    <div className="h-[520px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} height={50} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={colors[0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <ExpandableChartCard title="Quantidade por Status" renderCompact={compact} renderExpanded={expanded} />
  );
};

export default ChartStatusBar;
