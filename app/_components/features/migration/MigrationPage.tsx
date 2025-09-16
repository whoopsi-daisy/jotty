"use client";

import {
  AlertTriangle,
  FileText,
  Folder,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { useState } from "react";

export function MigrationPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Migration Required
            </h1>
            <p className="text-muted-foreground">
              Your data structure needs to be updated
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-foreground font-medium mb-2">
              We&apos;ve detected the old &quot;docs&quot; folder structure in
              your data directory.
            </p>
            <p className="text-sm text-muted-foreground">
              To continue using the app, you need to manually migrate your data
              from the old structure to the new one.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Migration Steps:
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">
                    Stop the application
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Make sure the app is completely stopped before proceeding
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">
                    Rename the docs folder
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded border">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">data/docs</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded border">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">data/notes</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Simply rename the &quot;docs&quot; folder to
                    &quot;notes&quot; in your data directory
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">
                    Restart the application
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Start the app again and you&apos;ll be redirected to the
                    main app
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-destructive font-medium">
                  Important: Backup your data first
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  Make sure to backup your entire data directory before making
                  any changes. This migration is irreversible and we cannot
                  recover your data if something goes wrong.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-primary font-medium">Need help?</p>
            <p className="text-sm text-primary/80 mt-1">
              If you encounter any issues during migration, please check the
              documentation or contact support. Your data is important to us.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Checking..." : "I've completed the migration"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
