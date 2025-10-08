"use client";

import { LogOut, Menu, Search, Settings, Shield, X } from "lucide-react";
import { Button } from "@/app/_components/GlobalComponents/Buttons/Button";
import { SearchBar } from "@/app/_components/FeatureComponents/Search/SearchBar";
import { useRouter } from "next/navigation";
import { logout } from "@/app/_server/actions/auth";
import { useAppMode } from "@/app/_providers/AppModeProvider";
import { useNavigationGuard } from "@/app/_providers/NavigationGuardProvider";
import { Checklist, Note, AppMode } from "@/app/_types";
import { cn } from "@/app/_utils/global-utils";
import { useState } from "react";

interface QuickNavProps {
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
  onOpenSettings?: () => void;
  isAdmin: boolean;
  checklists?: Checklist[];
  notes?: Note[];
  onModeChange?: (mode: AppMode) => void;
}

export const QuickNav = ({
  showSidebarToggle = false,
  onSidebarToggle,
  onOpenSettings,
  isAdmin,
  checklists = [],
  notes = [],
  onModeChange,
}: QuickNavProps) => {
  const router = useRouter();
  const { mode } = useAppMode();
  const { checkNavigation } = useNavigationGuard();
  const [toggleMobileSearch, setToggleMobileSearch] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="lg:border-b lg:border-border">
      <div
        className={cn(
          "fixed inset-0 z-40 flex items-start justify-center bg-background/80 pt-[25vh] backdrop-blur-sm px-4 lg:hidden",
          toggleMobileSearch ? "flex" : "hidden"
        )}
        onClick={() => setToggleMobileSearch(false)}
      >
        <SearchBar
          mode={mode}
          checklists={checklists}
          notes={notes}
          className="w-full max-w-md"
          autoFocus={toggleMobileSearch}
          onModeChange={
            onModeChange
              ? (mode) => checkNavigation(() => onModeChange(mode))
              : undefined
          }
        />
      </div>

      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t bg-background",
          "lg:relative lg:h-auto lg:justify-between lg:border-t-0 lg:px-6 lg:py-5"
        )}
      >
        {showSidebarToggle && onSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="hidden lg:block lg:flex-1 lg:max-w-lg lg:px-4">
          <SearchBar
            mode={mode}
            checklists={checklists}
            notes={notes}
            onModeChange={
              onModeChange
                ? (mode) => checkNavigation(() => onModeChange(mode))
                : undefined
            }
          />
        </div>

        <div className="contents lg:flex lg:items-center lg:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setToggleMobileSearch(!toggleMobileSearch)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
          >
            {toggleMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          {onOpenSettings && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => checkNavigation(() => onOpenSettings())}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => checkNavigation(() => router.push("/admin"))}
              className="text-muted-foreground hover:text-foreground"
            >
              <Shield className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-destructive hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </header>
  );
};