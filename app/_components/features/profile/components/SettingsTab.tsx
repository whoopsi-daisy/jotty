"use client";

import { Button } from "@/app/_components/ui/elements/button";

interface SettingsTabProps {
  setShowDeleteModal: (show: boolean) => void;
  setShowPrivacyModal: (show: boolean) => void;
}

export function SettingsTab({
  setShowDeleteModal,
  setShowPrivacyModal,
}: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Account Settings</h2>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
          </div>

          {/* <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <h3 className="font-medium">Export Data</h3>
                            <p className="text-sm text-muted-foreground">
                                Download all your checklists and documents
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleExportData}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    </div> */}

          {/* <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <h3 className="font-medium">Privacy Settings</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage your privacy and sharing preferences
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowPrivacyModal(true)}
                        >
                            Manage Privacy
                        </Button>
                    </div> */}
        </div>
      </div>
    </div>
  );
}
