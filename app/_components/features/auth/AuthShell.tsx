import { ReactNode } from "react";
import { Logo } from "@/app/_components/ui/icons/logo";

interface AuthShellProps {
    children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center lg:p-6 bg-background">
            <div className="w-full max-w-md">
                <div className="mb-8 flex items-center justify-center gap-3">
                    <Logo className="h-8 w-8" />
                    <span className="text-xl font-bold text-foreground">
                        <span className="text-primary">rw</span>Markable
                    </span>
                </div>
                <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}


