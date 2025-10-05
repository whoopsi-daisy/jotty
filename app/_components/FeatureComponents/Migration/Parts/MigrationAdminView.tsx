import { MigrationHeader } from "./MigrationHeader";
import { InfoCard } from "@/app/_components/GlobalComponents/Cards/InfoCard";
import { InfoCardVariant } from "@/app/_components/GlobalComponents/Cards/InfoCard";
import { Info } from "lucide-react";
import { Settings } from "lucide-react";
import { Folder } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { FileText } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/GlobalComponents/Buttons/Button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/app/_utils/global-utils";

interface MigrationAdminViewProps {
    onMigrate: () => void;
    isMigrating: boolean;
    error: string | null;
}

export const MigrationAdminView = ({ onMigrate, isMigrating, error }: MigrationAdminViewProps) => {
    const [hasBackedUp, setHasBackedUp] = useState(false);
    return (
        <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
            <div className="max-w-3xl w-full space-y-6">
                <MigrationHeader
                    icon={<Settings className="h-12 w-12 text-primary" />}
                    title="Quick Setup Required"
                    description="We&apos;ve improved how your notes are organized! We&apos;ll automatically rename your folder and update sharing settings."
                />

                <InfoCard icon={<Info className="h-5 w-5 text-primary" />} title="What's happening?">
                    <p className="text-sm">We need to rename your &quot;docs&quot; folder to &quot;notes&quot; for better organization and update some sharing metadata. This one-click process handles both.</p>
                </InfoCard>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Migration Steps</h2>
                    <div className="flex items-center gap-2 sm:gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2"><Folder className="h-4 w-4 text-primary" /><span className="text-sm font-mono">data/docs</span></div>
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><span className="text-sm font-mono">data/notes</span></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3"><strong>All users will be logged out</strong> to ensure everyone gets a fresh session with the correct folder references.</p>
                </div>

                <InfoCard icon={<AlertTriangle className="h-5 w-5 text-amber-600" />} title="Important: Backup Your Data" variant={InfoCardVariant.WARNING}>
                    <p>Before proceeding, please ensure you have a backup of your <code className="bg-amber-200 text-amber-900 px-1 rounded text-xs">data</code> folder. While this migration is safe, it&apos;s always good practice to have a backup.</p>
                </InfoCard>

                {error && (
                    <InfoCard icon={<Info className="h-4 w-4 text-destructive" />} title="Migration failed" variant={InfoCardVariant.DESTRUCTIVE}>
                        <p>{error}</p>
                    </InfoCard>
                )}

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <input type="checkbox" id="backup-confirmation" checked={hasBackedUp} onChange={(e) => setHasBackedUp(e.target.checked)} className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <div>
                            <label htmlFor="backup-confirmation" className="text-sm font-medium text-foreground cursor-pointer">I have backed up my data and understand the migration process.</label>
                            <p className="text-xs text-muted-foreground mt-1">Please confirm you&apos;ve created a backup before proceeding.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                    <Button onClick={onMigrate} disabled={isMigrating || !hasBackedUp} size="lg" className="min-w-48">
                        <RefreshCw className={cn("h-4 w-4 mr-2", isMigrating && "animate-spin")} />
                        {isMigrating ? "Migrating..." : "Start Migration"}
                    </Button>
                </div>
            </div>
        </div>
    );
};