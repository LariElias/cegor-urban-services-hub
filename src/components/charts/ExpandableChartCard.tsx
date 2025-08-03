import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

type Props = {
    title: string;
    children: React.ReactNode;         // conteúdo “normal” do card (gráfico)
    expanded: React.ReactNode;         // conteúdo grande para o modal
    scroll?: boolean;                  // ativa scroll vertical no card
    className?: string;
};

const ExpandableChartCard: React.FC<Props> = ({ title, children, expanded, scroll, className }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card className={className}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Expandir">
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </CardHeader>

                <CardContent
                    className={scroll ? "h-[340px] overflow-y-auto" : ""}
                    onClick={() => setOpen(true)} // clique no gráfico também expande
                    role="button"
                    tabIndex={0}
                >
                    {children}
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[1100px] w-[95vw]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">{expanded}</div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ExpandableChartCard;
