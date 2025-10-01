"use client";

import { useState, useEffect } from "react";
import { renameDocsFolderAction } from "@/app/_server/actions/migration/rename-docs-folder";
import { clearAllSessionsAction } from "@/app/_server/actions/migration/clear-all-sessions";
import { migrateSharingMetadataAction } from "@/app/_server/actions/migration/migrate-sharing-metadata";
import { logout } from "@/app/_server/actions/auth/logout";
import { isAdmin as checkIsAdmin } from "@/app/_server/actions/auth/utils";
import { MigrationAdminView } from "@/app/_components/FeatureComponents/Migration/Parts/MigrationAdminView";
import { AdminRequiredView } from "@/app/_components/FeatureComponents/Migration/Parts/MIgrationAdminRequired";

const LoadingView = () => (
  <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading migration...</p>
    </div>
  </div>
);

export const MigrationPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkIsAdmin()
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const [folderResult, sharingResult] = await Promise.all([
        renameDocsFolderAction(),
        migrateSharingMetadataAction(),
      ]);

      if (folderResult.success && sharingResult.success) {
        await clearAllSessionsAction();
        await logout();
      } else {
        const errors = [
          !folderResult.success && (folderResult.error || "Failed to rename folder"),
          !sharingResult.success && (sharingResult.error || "Failed to migrate sharing metadata")
        ].filter(Boolean).join('; ');
        throw new Error(errors);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsRefreshing(false);
    }
  };

  if (isLoading) return <LoadingView />;
  if (isAdmin === false) return <AdminRequiredView />;

  return <MigrationAdminView onMigrate={handleRefresh} isMigrating={isRefreshing} error={error} />;
}