"use client";

import { Edit3, Save, AlertCircle, Check, X, Shield, User } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { User as UserType } from "@/app/_types";
import { updateProfileAction } from "@/app/_server/actions/users/update-profile";

interface ProfileTabProps {
  user: UserType | null;
  username: string;
  isAdmin: boolean;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  editedUsername: string;
  setEditedUsername: (username: string) => void;
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  success: string | null;
  setSuccess: (success: string | null) => void;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

export function ProfileTab({
  user,
  username,
  isAdmin,
  isLoading,
  isEditing,
  setIsEditing,
  editedUsername,
  setEditedUsername,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  setError,
  success,
  setSuccess,
  setUser,
}: ProfileTabProps) {
  const handleSaveProfile = async () => {
    if (!editedUsername.trim()) {
      setError("Username is required");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setError(null);

    try {
      const formData = new FormData();
      formData.append("newUsername", editedUsername);
      if (currentPassword) {
        formData.append("currentPassword", currentPassword);
      }
      if (newPassword) {
        formData.append("newPassword", newPassword);
      }

      const result = await updateProfileAction(formData);

      if (result.success) {
        setSuccess("Profile updated successfully!");
        setUser((prev: UserType | null) =>
          prev ? { ...prev, username: editedUsername } : null
        );
        setIsEditing(false);
        setNewPassword("");
        setConfirmPassword("");
        setCurrentPassword("");

        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUsername(username);
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-500">{success}</span>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground">
                  {user?.username || username}
                </h3>
                {isAdmin && <Shield className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">
                {isAdmin ? "Admin" : "User"} •{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveProfile}
                className="h-8 w-8 p-0"
              >
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-medium">Change Password</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter new password (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
