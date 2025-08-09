"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, CheckSquare, FileText, X } from "lucide-react";
import { Button } from "@/app/_components/UI/Elements/button";
import { cn } from "@/app/_utils/utils";
import { List, Document, AppMode } from "@/app/_types";

interface SearchResult {
  id: string;
  title: string;
  type: "checklist" | "doc";
  content?: string;
  category?: string;
}

interface SearchBarProps {
  mode: AppMode;
  checklists: List[];
  docs: Document[];
  onSelectChecklist: (id: string) => void;
  onSelectDocument: (id: string) => void;
  className?: string;
}

export function SearchBar({
  mode,
  checklists,
  docs,
  onSelectChecklist,
  onSelectDocument,
  className,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search function
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      const query = searchQuery.toLowerCase();
      const searchResults: SearchResult[] = [];

      // Search checklists
      checklists.forEach((checklist) => {
        const titleMatch = checklist.title.toLowerCase().includes(query);
        // Search within checklist items text
        const contentMatch = checklist.items.some((item) =>
          item.text.toLowerCase().includes(query)
        );

        if (titleMatch || contentMatch) {
          searchResults.push({
            id: checklist.id,
            title: checklist.title,
            type: "checklist",
            content: checklist.items.map((item) => item.text).join(" "),
            category: checklist.category,
          });
        }
      });

      // Search docs
      docs.forEach((doc) => {
        const titleMatch = doc.title.toLowerCase().includes(query);
        const contentMatch = doc.content?.toLowerCase().includes(query);

        if (titleMatch || contentMatch) {
          searchResults.push({
            id: doc.id,
            title: doc.title,
            type: "doc",
            content: doc.content,
            category: doc.category,
          });
        }
      });

      // Sort by relevance (title matches first)
      searchResults.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(query);
        const bTitle = b.title.toLowerCase().includes(query);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
      });

      setResults(searchResults.slice(0, 8)); // Limit to 8 results
    },
    [checklists, docs]
  );

  // Handle search input
  useEffect(() => {
    performSearch(query);
    setSelectedIndex(0);
  }, [query, performSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }

      if (!isOpen) return;

      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }

      // Arrow navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }

      // Enter to select
      if (e.key === "Enter" && results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === "checklist") {
      onSelectChecklist(result.id);
    } else {
      onSelectDocument(result.id);
    }
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const getSnippet = (content: string | undefined, query: string) => {
    if (!content || !query) return "";

    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) return "";

    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + query.length + 30);
    const snippet = content.slice(start, end);

    return start > 0 ? "..." + snippet : snippet;
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-md transition-all",
            isOpen
              ? "border-primary shadow-md"
              : "hover:border-muted-foreground/50"
          )}
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={`Search ${mode}...${
              typeof window !== "undefined" && window.innerWidth > 768
                ? " (⌘K)"
                : ""
            }`}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {isOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setQuery("");
              }}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Keyboard hint for desktop */}
        {!isOpen && (
          <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Search Results */}
      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50 max-h-[70vh] md:max-h-80 overflow-y-auto">
          {results.length === 0 && query ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => {
                const snippet = getSnippet(result.content, query);

                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-accent transition-colors focus:bg-accent",
                      index === selectedIndex && "bg-accent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {result.type === "checklist" ? (
                          <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground truncate">
                          {result.title}
                        </div>

                        {result.category && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {result.category}
                          </div>
                        )}

                        {snippet && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2 hidden sm:block">
                            {snippet}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground capitalize flex-shrink-0">
                        {result.type}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
