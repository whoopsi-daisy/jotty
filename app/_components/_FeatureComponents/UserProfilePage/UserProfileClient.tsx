"use client";

import { useState, useEffect } from "react";
import { User, Settings, Clock, Monitor, Shield, LogOut, Edit3, Save, AlertCircle, Check, X, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/app/_components/UI/Elements/button";
import { SessionManager } from "@/app/_components/UI/SessionManager";
import { User as UserType } from "@/app/_types";
import { getUserProfileAction } from "@/app/_server/actions/users/get-user-profile";
import { updateProfileAction } from "@/app/_server/actions/users/update-profile";
import { exportUserDataAction } from "@/app/_server/actions/users/export-data";
import { useRouter } from "next/navigation";
import { DeleteAccountModal } from "@/app/_components/UI/Modals/DeleteAccountModal";
import { PrivacySettingsModal } from "@/app/_components/UI/Modals/PrivacySettingsModal";

interface UserProfileClientProps {
    username: string;
    isAdmin: boolean;
}

export function UserProfileClient({ username, isAdmin }: UserProfileClientProps) {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "sessions" | "settings">("profile");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        setIsLoading(true);
        try {
            const result = await getUserProfileAction();

            if (result.success && result.data) {
                const profileUser: UserType = {
                    username: result.data.username,
                    isAdmin: result.data.isAdmin,
                    passwordHash: "", // This won't be used in the UI
                    createdAt: result.data.createdAt,
                    lastLogin: result.data.lastLogin,
                };
                setUser(profileUser);
                setEditedUsername(result.data.username);
            } else {
                console.error("Error loading user profile:", result.error);
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!editedUsername.trim()) {
            setError("Username is required");
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        setIsLoading(true);
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
                setUser(prev => prev ? { ...prev, username: editedUsername } : null);
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
        } finally {
            setIsLoading(false);
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

    const handleExportData = async () => {
        try {
            const result = await exportUserDataAction();

            if (result.success && result.data) {
                // Create and download JSON file
                const dataStr = JSON.stringify(result.data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `user-data-${username}-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setSuccess("Data exported successfully!");
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(result.error || "Failed to export data");
            }
        } catch (error) {
            setError("Failed to export data");
        }
    };

    const renderProfile = () => (
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

            <div className="bg-background border border-border rounded-lg p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={editedUsername}
                            onChange={(e) => setEditedUsername(e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            disabled={!isEditing || isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Role
                        </label>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isAdmin
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                }`}>
                                {isAdmin ? 'Admin' : 'User'}
                            </span>
                            {isAdmin && <Shield className="h-4 w-4 text-purple-500" />}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Account Created
                        </label>
                        <p className="text-sm text-muted-foreground">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Last Login
                        </label>
                        <p className="text-sm text-muted-foreground">
                            {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Unknown'}
                        </p>
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
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isLoading}
                                >
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
            </div>
        </div>
    );

    const renderSessions = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Active Sessions</h2>
            </div>

            <SessionManager username={username} />
        </div>
    );

    const renderSettings = () => (
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

    if (isLoading && !user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/")}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">User Profile</h1>
                        <p className="text-muted-foreground">Manage your account settings and preferences</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border">
                <nav className="flex space-x-8 overflow-x-auto pb-2">
                    {[
                        { id: "profile", label: "Profile", icon: User },
                        { id: "sessions", label: "Sessions", icon: Monitor },
                        { id: "settings", label: "Settings", icon: Settings },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
                {activeTab === "profile" && renderProfile()}
                {activeTab === "sessions" && renderSessions()}
                {activeTab === "settings" && renderSettings()}
            </div>

            {/* Modals */}
            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            />

            <PrivacySettingsModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
            />
        </div>
    );
}
