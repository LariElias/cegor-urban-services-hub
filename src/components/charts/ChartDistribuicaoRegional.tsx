import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList,
} from "recharts";

export interface RegionalData { regional: string; total: number }

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ChartDistribuicaoRegional({ data }: { data: RegionalData[] }) {
    const renderCompact = () => (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data} margin={{ top: 8, right: 16, left: 80, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="regional" width={120} />
                    <Tooltip formatter={(v: number) => `${v} ocorrências`} />
                    <Bar dataKey="total" fill={COLORS[0]} name="Total">
                        <LabelList dataKey="total" position="right" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const renderExpanded = () => (
        <div className="h-[520px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data} margin={{ top: 16, right: 24, left: 120, bottom: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="regional" width={180} />
                    <Tooltip formatter={(v: number) => `${v} ocorrências`} />
                    <Bar dataKey="total" fill={COLORS[0]} name="Total">
                        <LabelList dataKey="total" position="right" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <ExpandableChartCard
            title="Distribuição Regional"
            renderCompact={renderCompact}
            renderExpanded={renderExpanded}
        />
    );
}
