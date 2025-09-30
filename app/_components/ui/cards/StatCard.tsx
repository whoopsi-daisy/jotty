import { ReactNode } from "react";

export const StatCard = ({ title, value, icon }: { title: string; value: number | string; icon: ReactNode }) => (
    <div className="p-6 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        </div>
    </div>
);
