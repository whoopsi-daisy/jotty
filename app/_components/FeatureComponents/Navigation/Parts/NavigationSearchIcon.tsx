import { Button } from "@/app/_components/GlobalComponents/Buttons/Button";
import { cn } from "@/app/_utils/global-utils";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchBar } from "../../Search/SearchBar";
import { useAppMode } from "@/app/_providers/AppModeProvider";
import { Checklist, Note, AppMode } from "@/app/_types";
import { useNavigationGuard } from "@/app/_providers/NavigationGuardProvider";

interface NavigationSearchIconProps {
  checklists: Checklist[];
  notes: Note[];
  onModeChange?: (mode: AppMode) => void;
}

export const NavigationSearchIcon = ({
  checklists,
  notes,
  onModeChange,
}: NavigationSearchIconProps) => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const { checkNavigation } = useNavigationGuard();
  const { mode } = useAppMode();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setToggleSearch(true);
      }

      if (e.key === "Escape") {
        setToggleSearch(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setToggleSearch]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 flex items-start justify-center bg-background/80 pt-[25vh] backdrop-blur-sm px-4 lg:hidden",
          toggleSearch ? "flex" : "hidden"
        )}
        onClick={() => setToggleSearch(false)}
      >
        <SearchBar
          mode={mode}
          checklists={checklists}
          notes={notes}
          className="w-full max-w-md"
          autoFocus={toggleSearch}
          onModeChange={
            onModeChange
              ? (mode) => checkNavigation(() => onModeChange(mode))
              : undefined
          }
        />
      </div>

      <div
        className={cn(
          "hidden lg:w-[30vw] lg:px-4",
          toggleSearch ? "lg:flex" : "hidden"
        )}
      >
        <SearchBar
          mode={mode}
          checklists={checklists}
          className="w-full"
          notes={notes}
          autoFocus={toggleSearch}
          onModeChange={
            onModeChange
              ? (mode) => checkNavigation(() => onModeChange(mode))
              : undefined
          }
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setToggleSearch(!toggleSearch)}
        className="text-muted-foreground hover:text-foreground"
      >
        {toggleSearch ? (
          <X className="h-5 w-5" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </Button>
    </>
  );
};
