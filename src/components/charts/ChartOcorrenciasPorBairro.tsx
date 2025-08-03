import React from "react";
import ExpandableChartCard from "./ExpandableChartCard";
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList,
} from "recharts";

export interface BairroData { bairro: string; total: number; concluidas: number }

export default function ChartOcorrenciasPorBairro({ data }: { data: BairroData[] }) {
    return (
        <ExpandableChartCard
            title="Ocorrências por Bairro"
            children={
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="bairro" />
                            <YAxis />
                            <Tooltip />
                            <Legend verticalAlign="top" />
                            <Bar dataKey="total" fill="#8884d8" name="Total">
                                <LabelList dataKey="total" position="top" />
                            </Bar>
                            <Bar dataKey="concluidas" fill="#82ca9d" name="Concluídas">
                                <LabelList dataKey="concluidas" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            }
            expanded={
                <div className="h-[520px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 24, right: 24, bottom: 24, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="bairro" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#8884d8" name="Total">
                                <LabelList dataKey="total" position="top" />
                            </Bar>
                            <Bar dataKey="concluidas" fill="#82ca9d" name="Concluídas">
                                <LabelList dataKey="concluidas" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            }
        />
    );
}
