interface StatsCardProps {
    icon: React.ReactNode
    header: string
    value: string | number | React.ReactNode;
}

export const StatsCard = ({ icon, header, value }: StatsCardProps) => {
    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{header}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                </div>
            </div>
        </div>
    )
}