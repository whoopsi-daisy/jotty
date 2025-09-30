"use client";

import {
  FileText,
  Folder,
  ArrowRight,
  RefreshCw,
  Settings,
  CheckCircle,
  Info,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Button } from "@/app/_components/GlobalComponents/Buttons/Button";
import { renameDocsFolderAction } from "@/app/_server/actions/migration/rename-docs-folder";
import { clearAllSessionsAction } from "@/app/_server/actions/migration/clear-all-sessions";
import { migrateSharingMetadataAction } from "@/app/_server/actions/migration/migrate-sharing-metadata";
import { logout } from "@/app/_server/actions/auth/logout";
import { useState, useEffect } from "react";
import { isAdmin as checkIsAdmin } from "@/app/_server/actions/auth/utils";

export function MigrationPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasBackedUp, setHasBackedUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError("");

    try {
      const [folderResult, sharingResult] = await Promise.all([
        renameDocsFolderAction(),
        migrateSharingMetadataAction(),
      ]);

      if (folderResult.success && sharingResult.success) {
        await clearAllSessionsAction();
        await logout();
      } else {
        const errors = [];
        if (!folderResult.success)
          errors.push(folderResult.error || "Failed to rename folder");
        if (!sharingResult.success)
          errors.push(
            sharingResult.error || "Failed to migrate sharing metadata"
          );
        setError(errors.join("; "));
        setIsRefreshing(false);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading migration...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-amber-100 rounded-full">
                <Shield className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Access Required
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This migration requires administrator privileges. Please contact
              an administrator to perform the system migration.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                <Info className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  What&apos;s happening?
                </h3>
                <p className="text-sm text-muted-foreground">
                  The system needs to migrate your notes from the old
                  &quot;docs&quot; folder to the new &quot;notes&quot; folder.
                  This is a one-time process that requires administrator access
                  to ensure all users are properly migrated.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-primary text-sm">Next Steps</p>
                <p className="text-xs text-primary/80 mt-1">
                  Contact your system administrator to perform the migration.
                  Once completed, you&apos;ll be able to access your notes in
                  the new &quot;Notes&quot; section.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            We&apos;ve improved how your notes are organized! Click the button
            below and we&apos;ll automatically rename your folder for you.
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
                We found your notes in the old &quot;docs&quot; folder and
                detected some sharing metadata that needs updating. We&apos;ve
                updated the app to use a &quot;notes&quot; folder instead for
                better organization and fixed the sharing structure. We&apos;ll
                automatically handle both migrations for you.
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
                    <span className="text-sm font-mono font-medium">
                      data/docs
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 rotate-90 sm:rotate-0" />
                  <div className="flex items-center gap-2 px-3 py-2 bg-background rounded border w-full sm:w-auto justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono font-medium">
                      data/notes
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the button below and we&apos;ll automatically rename
                  your &quot;docs&quot; folder to &quot;notes&quot; and fix any
                  sharing metadata issues.{" "}
                  <strong>All users will be logged out</strong> and redirected
                  to the login page to ensure everyone gets fresh sessions with
                  the correct folder references.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">
                Important: Backup Your Data
              </h3>
              <p className="text-sm text-amber-700">
                Before proceeding with the migration, please ensure you have a
                backup of your data. While this migration is safe and only
                renames folders and fixes metadata, it&apos;s always good
                practice to backup your important files.
                <br />
                <br />
                <strong>Note:</strong> This migration will log out all users to
                ensure fresh sessions. As an admin, you are responsible for
                notifying other users about this migration.
              </p>
            </div>
          </div>
          <div className="bg-amber-100/50 rounded-lg p-3">
            <p className="text-xs text-amber-800 font-medium mb-1">
              Quick backup steps:
            </p>
            <ol className="text-xs text-amber-700 space-y-1 ml-4">
              <li>
                1. Copy your entire{" "}
                <code className="bg-amber-200 px-1 rounded">data</code> folder
                to a safe location
              </li>
              <li>
                2. Keep the backup until you&apos;ve confirmed everything works
                correctly
              </li>
            </ol>
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
                  The migration is safe and only renames the folder and fixes
                  metadata - no data will be lost! All users will be logged out
                  to ensure fresh session data.
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
                <p className="font-medium text-primary text-sm">Need help?</p>
                <p className="text-xs text-primary/80 mt-1">
                  This is a simple folder rename and metadata fix - no data will
                  be changed or lost. If you need help, open an issue at{" "}
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
                <p className="text-xs text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              id="backup-confirmation"
              checked={hasBackedUp}
              onChange={(e) => setHasBackedUp(e.target.checked)}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <div>
              <label
                htmlFor="backup-confirmation"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                I have backed up my data and understand the migration process
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Please confirm you&apos;ve created a backup before proceeding
                with the migration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || !hasBackedUp}
            size="lg"
            className="flex items-center gap-2 min-w-48"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing
              ? "Migrating Folders & Metadata..."
              : !hasBackedUp
              ? "Please confirm backup first"
              : "Start Migration"}
          </Button>
        </div>
      </div>
    </div>
  );
}
