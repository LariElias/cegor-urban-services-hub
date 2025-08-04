import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import { CommonData } from "./types";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const DEFAULT_COLORS = ["#ee8023"];

type Props = { data: CommonData[]; colors?: string[] };

const ChartOcorrenciasPorBairro: React.FC<Props> = ({ data, colors = DEFAULT_COLORS }) => {
    const compact = () => (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={110} interval={0} />
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
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={180} interval={0} />
                    <Tooltip />
                    <Bar dataKey="value" fill={colors[0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <ExpandableChartCard
            title="Quantidade por Bairro"
            renderCompact={compact}
            renderExpanded={expanded}
            scroll
        />
    );
};

export default ChartOcorrenciasPorBairro;
