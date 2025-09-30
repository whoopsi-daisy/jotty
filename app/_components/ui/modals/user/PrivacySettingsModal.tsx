"use client";

import { useState, useEffect } from "react";
import {
  X,
  Shield,
  Eye,
  EyeOff,
  Share2,
  Clock,
  Save,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import {
  getPrivacySettingsAction,
  updatePrivacySettingsAction,
} from "@/app/_server/actions/users/privacy-settings";
import { Modal } from "../Modal";

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacySettingsModal({
  isOpen,
  onClose,
}: PrivacySettingsModalProps) {
  const [allowSharing, setAllowSharing] = useState(true);
  const [showProfileToOthers, setShowProfileToOthers] = useState(true);
  const [allowSessionTracking, setAllowSessionTracking] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPrivacySettings();
    }
  }, [isOpen]);

  const loadPrivacySettings = async () => {
    setIsLoading(true);
    try {
      const result = await getPrivacySettingsAction();

      if (result.success && result.data) {
        setAllowSharing(result.data.allowSharing);
        setShowProfileToOthers(result.data.showProfileToOthers);
        setAllowSessionTracking(result.data.allowSessionTracking);
        setDataRetentionDays(result.data.dataRetentionDays);
      } else {
        setError("Failed to load privacy settings");
      }
    } catch (error) {
      setError("Failed to load privacy settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("allowSharing", String(allowSharing));
      formData.append("showProfileToOthers", String(showProfileToOthers));
      formData.append("allowSessionTracking", String(allowSessionTracking));
      formData.append("dataRetentionDays", String(dataRetentionDays));

      const result = await updatePrivacySettingsAction(formData);

      if (result.success) {
        setSuccess("Privacy settings updated successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error || "Failed to update privacy settings");
      }
    } catch (error) {
      setError("Failed to update privacy settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Privacy Settings"
      titleIcon={<Shield className="h-5 w-5 text-primary" />}
    >
      <div className="p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-md">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">{success}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Allow Content Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Allow other users to share content with you
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={allowSharing}
              onChange={(e) => setAllowSharing(e.target.checked)}
              className="rounded border-border"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {showProfileToOthers ? (
                <Eye className="h-5 w-5 text-primary" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <h3 className="font-medium">Show Profile to Others</h3>
                <p className="text-sm text-muted-foreground">
                  Allow other users to see your profile information
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showProfileToOthers}
              onChange={(e) => setShowProfileToOthers(e.target.checked)}
              className="rounded border-border"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Session Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track your active sessions across devices
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={allowSessionTracking}
              onChange={(e) => setAllowSessionTracking(e.target.checked)}
              className="rounded border-border"
              disabled={isLoading}
            />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Data Retention</h3>
                <p className="text-sm text-muted-foreground">
                  How long to keep your session data (days)
                </p>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="365"
              value={dataRetentionDays}
              onChange={(e) => setDataRetentionDays(parseInt(e.target.value))}
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>1 day</span>
              <span>{dataRetentionDays} days</span>
              <span>365 days</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
