interface StatsCardProps {
    icon: React.ReactNode
    header: string
    value: string | number | React.ReactNode;
}

export const StatsCard = ({ icon, header, value }: StatsCardProps) => {
    return (
        <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{header}</p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{value}</p>
                </div>
            </div>
        </div>
    )
}