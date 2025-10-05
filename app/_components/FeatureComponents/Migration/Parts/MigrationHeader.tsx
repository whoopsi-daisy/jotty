import { ReactNode } from "react";

interface MigrationHeaderProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export const MigrationHeader = ({ icon, title, description }: MigrationHeaderProps) => (
    <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">{icon}</div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
    </div>
);