import { BarChart3, CheckSquare, Clock, User } from "lucide-react";
import { ChecklistProgress } from "../../Checklists/Parts/Simple/ChecklistProgress";
import { Checklist } from "@/app/_types";

interface PublicChecklistHeaderProps {
  checklist: Checklist;
  totalCount: number;
}

export const PublicChecklistHeader = ({
  checklist,
  totalCount,
}: PublicChecklistHeaderProps) => (
  <header className="mb-8">
    <div className="flex items-center gap-3 mb-4">
      {checklist.type === "task" ? (
        <BarChart3 className="h-8 w-8 text-primary" />
      ) : (
        <CheckSquare className="h-8 w-8 text-primary" />
      )}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {checklist.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>by {checklist.owner}</span>
          </div>
          {checklist.category && <span>• {checklist.category}</span>}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              Updated {new Date(checklist.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>

    {totalCount > 0 && <ChecklistProgress checklist={checklist} />}
  </header>
);
