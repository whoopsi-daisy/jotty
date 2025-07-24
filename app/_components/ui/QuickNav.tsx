"use client";

import { LogOut, Menu, RefreshCw, Settings, Users } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { useRouter } from "next/navigation";
import { logout } from "@/app/_server/actions/auth/logout";

interface HeaderProps {
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenSettings?: () => void;
  isAdmin: boolean;
}

export function QuickNav({
  showSidebarToggle = false,
  onSidebarToggle,
  onRefresh,
  isRefreshing = false,
  onOpenSettings,
  isAdmin,
}: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="bg-background border-b border-border px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showSidebarToggle && onSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="lg:hidden h-10 w-10 p-0 text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/settings/users")}
                className="h-9 w-9 p-0"
              >
                <Users className="h-5 w-5" />
              </Button>
            </>
          )}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw
                className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          )}
          {onOpenSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 p-0"
          >
            <LogOut className="h-5 w-5 text-destructive hover:text-destructive/80" />
          </Button>
        </div>
      </div>
    </header>
  );
}
