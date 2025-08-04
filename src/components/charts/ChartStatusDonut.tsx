import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

export interface StatusData { name: string; value: number }
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ChartStatusDonut({ data }: { data: StatusData[] }) {
    const renderCompact = () => (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
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
                        dataKey="value"
                        nameKey="name"
                        innerRadius={120}
                        outerRadius={190}
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
            title="Distribuição por Status"
            renderCompact={renderCompact}
            renderExpanded={renderExpanded}
        />
    );
}
