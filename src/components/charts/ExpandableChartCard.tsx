import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

type Props = {
    title: string;
    renderCompact: () => React.ReactNode;
    renderExpanded?: () => React.ReactNode; // se não vier, usa o compact em tela cheia
    scroll?: boolean; // adiciona overflow no conteúdo compacto
    dialogWidthClassName?: string; // opcional para customizar largura do modal
};

const ExpandableChartCard: React.FC<Props> = ({
    title,
    renderCompact,
    renderExpanded,
    scroll = false,
    dialogWidthClassName = "max-w-[1100px] w-[95vw]",
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card className="group">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-70 hover:opacity-100"
                        onClick={() => setOpen(true)}
                        title="Expandir"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </CardHeader>

                <CardContent
                    className={scroll ? "h-[340px] overflow-y-auto" : ""}
                    onClick={() => setOpen(true)}
                    role="button"
                    tabIndex={0}
                >
                    {renderCompact()}
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={dialogWidthClassName}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                        {renderExpanded ? (
                            renderExpanded()
                        ) : (
                            <div className="h-[520px]">{renderCompact()}</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ExpandableChartCard;
