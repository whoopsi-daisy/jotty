"use client";

import { CheckSquare, FileText, Users } from "lucide-react";
import { cn } from "@/app/_utils/global-utils";
import { ItemType } from "@/app/_types";

interface SearchResult {
  id: string;
  title: string;
  type: ItemType;
  content?: string;
  category?: string;
  owner?: string;
  isShared?: boolean;
}

interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelectResult: (result: SearchResult) => void;
  query: string;
}

export const SearchResults = ({
  results,
  selectedIndex,
  onSelectResult,
  query,
}: SearchResultsProps) => {
  const getSnippet = (content: string | undefined, query: string) => {
    if (!content) return "";

    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return content.slice(0, 100) + "...";

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 100);
    const snippet = content.slice(start, end);

    return (
      (start > 0 ? "..." : "") + snippet + (end < content.length ? "..." : "")
    );
  };

  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No results found
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {results.map((result, index) => (
        <button
          key={result.id}
          onClick={() => onSelectResult(result)}
          className={cn(
            "w-full text-left p-3 hover:bg-accent transition-colors border-b border-border last:border-b-0",
            selectedIndex === index && "bg-accent"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {result.type === "checklist" ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <FileText className="h-4 w-4 text-primary" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground truncate">
                  {result.title}
                </h4>
                {result.isShared && (
                  <Users className="h-3 w-3 text-primary flex-shrink-0" />
                )}
              </div>

              {result.content && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {getSnippet(result.content, query)}
                </p>
              )}

              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="capitalize">{result.type}</span>
                {result.category && (
                  <>
                    <span>•</span>
                    <span>{result.category}</span>
                  </>
                )}
                {result.owner && (
                  <>
                    <span>•</span>
                    <span>by {result.owner}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
