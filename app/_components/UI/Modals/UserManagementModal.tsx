"use client";

import { useState, useEffect } from "react";
import { X, User, Shield, Trash2, Edit3, Plus, Save, AlertCircle, Check } from "lucide-react";
import { Button } from "@/app/_components/UI/Elements/button";
import { User as UserType } from "@/app/_types";
import { createUserAction } from "@/app/_server/actions/users/create-user";
import { updateUserAction } from "@/app/_server/actions/users/update-user";
import { deleteUserAction } from "@/app/_server/actions/users/delete-user";

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "add" | "edit";
    user?: UserType;
    onSuccess: () => void;
}

export function UserManagementModal({
    isOpen,
    onClose,
    mode,
    user,
    onSuccess,
}: UserManagementModalProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && user) {
                setUsername(user.username);
                setIsAdmin(user.isAdmin);
                setPassword(""); // Don't show current password
            } else {
                setUsername("");
                setPassword("");
                setIsAdmin(false);
            }
            setError(null);
            setSuccess(null);
        }
    }, [isOpen, mode, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            setError("Username is required");
            return;
        }

        if (mode === "add" && !password.trim()) {
            setError("Password is required");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (mode === "add") {
                const formData = new FormData();
                formData.append("username", username);
                formData.append("password", password);
                formData.append("isAdmin", String(isAdmin));

                const result = await createUserAction(formData);

                if (result.success) {
                    setSuccess("User created successfully!");
                    setTimeout(() => {
                        onSuccess();
                        onClose();
                    }, 1500);
                } else {
                    setError(result.error || "Failed to create user");
                }
            } else {
                const formData = new FormData();
                formData.append("username", user?.username || "");
                formData.append("newUsername", username);
                if (password) {
                    formData.append("password", password);
                }
                formData.append("isAdmin", String(isAdmin));

                const result = await updateUserAction(formData);

                if (result.success) {
                    setSuccess("User updated successfully!");
                    setTimeout(() => {
                        onSuccess();
                        onClose();
                    }, 1500);
                } else {
                    setError(result.error || "Failed to update user");
                }
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user) return;

        if (!confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("username", user.username);

            const result = await deleteUserAction(formData);

            if (result.success) {
                setSuccess("User deleted successfully!");
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                setError(result.error || "Failed to delete user");
            }
        } catch (error) {
            setError("An error occurred while deleting the user.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        {mode === "add" ? (
                            <Plus className="h-5 w-5 text-primary" />
                        ) : (
                            <Edit3 className="h-5 w-5 text-primary" />
                        )}
                        <h2 className="text-lg font-semibold">
                            {mode === "add" ? "Add New User" : "Edit User"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-accent transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Enter username"
                            disabled={isLoading}
                        />
                    </div>

                    {mode === "add" && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Enter password"
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isAdmin"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="rounded border-border"
                            disabled={isLoading}
                        />
                        <label htmlFor="isAdmin" className="flex items-center gap-2 text-sm cursor-pointer">
                            <Shield className="h-4 w-4" />
                            Admin privileges
                        </label>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex gap-2">
                            {mode === "edit" && user && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {mode === "add" ? "Create User" : "Save Changes"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
