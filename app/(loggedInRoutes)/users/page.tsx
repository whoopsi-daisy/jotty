"use client";

import { useState, useEffect } from "react";
import {
  createUser,
  toggleAdmin,
  getUsers,
} from "@/app/_server/actions/users/manage";
import { Users, UserPlus, Shield, ShieldOff, Crown } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";

interface User {
  username: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const result = await getUsers();
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setUsers(result);
  }

  async function handleCreateUser(formData: FormData) {
    setError("");
    setSuccess("");

    const result = await createUser(formData);
    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess("User created successfully");
    loadUsers();

    // Reset form
    const form = document.getElementById("createUserForm") as HTMLFormElement;
    form?.reset();
  }

  async function handleToggleAdmin(username: string) {
    setError("");
    setSuccess("");

    const formData = new FormData();

    const result = await toggleAdmin(formData);
    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(`Admin status updated for ${username}`);
    loadUsers();
  }

  const getUserIcon = (user: User) => {
    if (user.isSuperAdmin) {
      return <Crown className="h-4 w-4 text-primary" />;
    }
    return user.isAdmin ? (
      <Shield className="h-4 w-4 text-primary" />
    ) : (
      <ShieldOff className="h-4 w-4 text-muted-foreground" />
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex-none bg-background border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            User Management
          </h1>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-background-secondary">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Messages */}
          {error && (
            <div className="p-4 text-sm text-destructive-foreground bg-destructive/10 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 text-sm bg-background rounded-lg border border-border text-foreground">
              {success}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Create User Form */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Create New User
                </h2>
              </div>

              <form
                id="createUserForm"
                action={handleCreateUser}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-foreground"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="isAdmin"
                    name="isAdmin"
                    type="checkbox"
                    className="h-4 w-4 rounded border border-input focus:ring-2 focus:ring-ring"
                  />
                  <label
                    htmlFor="isAdmin"
                    className="text-sm font-medium text-foreground"
                  >
                    Make user an admin
                  </label>
                </div>

                <Button type="submit" className="w-full">
                  Create User
                </Button>
              </form>
            </div>

            {/* User List */}
            <div className="bg-background rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Existing Users
                </h2>
              </div>

              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.username}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getUserIcon(user)}

                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.isSuperAdmin
                            ? "Super Admin"
                            : user.isAdmin
                              ? "Administrator"
                              : "Regular User"}
                        </p>
                      </div>
                    </div>

                    {!user.isSuperAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdmin(user.username)}
                        className={
                          user.isAdmin
                            ? "text-destructive hover:text-destructive"
                            : ""
                        }
                      >
                        {user.isAdmin ? "Remove Admin" : "Make Admin"}
                      </Button>
                    )}
                  </div>
                ))}

                {users.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No users found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
