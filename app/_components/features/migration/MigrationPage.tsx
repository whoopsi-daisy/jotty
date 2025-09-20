"use client";

import {
  FileText,
  Folder,
  ArrowRight,
  RefreshCw,
  Settings,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { renameDocsFolderAction } from "@/app/_server/actions/migration/rename-docs-folder";
import { useState } from "react";

export function MigrationPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError("");

    try {
      const result = await renameDocsFolderAction();

      if (result.success) {
        // Redirect to home page after successful migration
        window.location.href = "/";
      } else {
        setError(result.error || "Failed to rename folder");
        setIsRefreshing(false);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Settings className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quick Setup Required
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;ve improved how your notes are organized! Click the button below and we&apos;ll automatically rename your folder for you.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                What&apos;s happening?
              </h3>
              <p className="text-sm text-muted-foreground">
                We found your notes in the old &quot;docs&quot; folder. We&apos;ve updated the app to use a &quot;notes&quot; folder instead for better organization. We&apos;ll automatically rename it for you.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            One-Click Migration
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-2">
                  We&apos;ll rename your folder automatically
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 px-3 py-2 bg-background rounded border w-full sm:w-auto justify-center">
                    <Folder className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono font-medium">data/docs</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 rotate-90 sm:rotate-0" />
                  <div className="flex items-center gap-2 px-3 py-2 bg-background rounded border w-full sm:w-auto justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono font-medium">data/notes</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the button below and we&apos;ll automatically rename your &quot;docs&quot; folder to &quot;notes&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 border border-border rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  Safety tip
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  The migration is safe and only renames the folder - no data will be lost!
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-primary text-sm">
                  Need help?
                </p>
                <p className="text-xs text-primary/80 mt-1">
                  This is a simple folder rename - no data will be changed or lost. If you need help, open an issue at{" "}
                  <a
                    href="https://github.com/fccview/rwmarkable"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-primary hover:underline"
                  >
                    fccview/rwmarkable
                  </a>{" "}
                  on GitHub.
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-destructive/10 rounded-lg flex-shrink-0">
                <Info className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-destructive text-sm">
                  Migration failed
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="lg"
            className="flex items-center gap-2 min-w-48"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Migrating..." : "Start Migration"}
          </Button>
        </div>
      </div>
    </div>
  );
}
