"use client";

import { CheckCircle, Folder, Plus, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { Checklist, Item } from "@/app/_types";
import { StatsCard } from "@/app/_components/ui/elements/statsCard";
import { ChecklistContext } from "@/app/_providers/ChecklistProvider";
import { useContext } from "react";
import { formatRelativeTime } from "@/app/_utils/date-utils";

interface HomeViewProps {
  lists: Checklist[];
  onCreateModal: () => void;
}

export function HomeView({ lists, onCreateModal }: HomeViewProps) {
  const { setSelectedChecklist } = useContext(ChecklistContext);
  const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
  const completedItems = lists.reduce(
    (sum, list) => sum + list.items.filter((item) => item.completed).length,
    0
  );
  const completionRate =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getCompletionRate = (items: Item[]) => {
    const total = items.length;
    if (total === 0) return 0;
    const completed = items.filter((item) => item.completed).length;
    return Math.round((completed / total) * 100);
  };

  const recentLists = [...lists]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 12);

  return (
    <div className="h-full overflow-y-auto bg-background">
      {lists.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Folder className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No checklists yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md text-center">
            Create your first checklist to get started. You can organize your
            tasks, track progress, and more.
          </p>
          <Button onClick={onCreateModal} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create New Checklist
          </Button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-lg text-muted-foreground">
                Your most recently updated checklists
              </p>
            </div>
            <Button onClick={onCreateModal} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              New Checklist
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCard
              icon={<Folder className="h-6 w-6 text-primary" />}
              header="Total Lists"
              value={lists.length}
            />
            <StatsCard
              icon={<CheckCircle className="h-6 w-6 text-primary" />}
              header="Completed"
              value={completedItems}
            />
            <StatsCard
              icon={<TrendingUp className="h-6 w-6 text-primary" />}
              header="Progress"
              value={`${completionRate}%`}
            />
            <StatsCard
              icon={<Clock className="h-6 w-6 text-primary" />}
              header="Total Items"
              value={totalItems}
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Recent Checklists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentLists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => setSelectedChecklist(list.id)}
                  className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-primary/50 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors flex-1 truncate pr-2">
                      {list.title}
                    </h3>
                    {list.category && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full flex-shrink-0">
                        {list.category}
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{getCompletionRate(list.items)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{
                          width: `${getCompletionRate(list.items)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>
                        {list.items.filter((item) => item.completed).length}/
                        {list.items.length} done
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatRelativeTime(list.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {lists.length > 12 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Showing {recentLists.length} of {lists.length} checklists. Use
                the sidebar to browse all or search above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
