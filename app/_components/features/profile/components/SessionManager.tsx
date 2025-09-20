"use client";

import { useState, useEffect } from "react";
import {
  Monitor,
  Clock,
  MapPin,
  Trash2,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import {
  getSessionsAction,
  terminateSessionAction,
  terminateAllOtherSessionsAction,
} from "@/app/_server/actions/users/session-management";

interface Session {
  id: string;
  username: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  lastActivity: string;
  isCurrent: boolean;
}

interface SessionManagerProps {
  username: string;
}

export function SessionManager({ username }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [terminatingSession, setTerminatingSession] = useState<string | null>(
    null
  );
  const [terminatingAll, setTerminatingAll] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [username]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const result = await getSessionsAction();

      if (result.success && result.data) {
        setSessions(result.data);
      } else {
        console.error("Error loading sessions:", result.error);
        setError("Failed to load sessions");
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      setError("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to terminate this session?")) {
      return;
    }

    setTerminatingSession(sessionId);
    try {
      const formData = new FormData();
      formData.append("sessionId", sessionId);

      const result = await terminateSessionAction(formData);

      if (result.success) {
        setSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );
        setSuccess("Session terminated successfully!");

        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to terminate session");
      }
    } catch (error) {
      setError("Failed to terminate session");
    } finally {
      setTerminatingSession(null);
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    if (
      !confirm(
        "Are you sure you want to terminate all other sessions? You will be logged out from all other devices."
      )
    ) {
      return;
    }

    setTerminatingAll(true);
    try {
      const result = await terminateAllOtherSessionsAction();

      if (result.success) {
        setSessions((prev) => prev.filter((session) => session.isCurrent));
        setSuccess("All other sessions terminated successfully!");

        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Failed to terminate sessions");
      }
    } catch (error) {
      setError("Failed to terminate sessions");
    } finally {
      setTerminatingAll(false);
    }
  };

  const getDeviceInfo = (userAgent: string) => {
    if (userAgent.includes("iPhone")) return "iPhone";
    if (userAgent.includes("iPad")) return "iPad";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("Macintosh")) return "Mac";
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Linux")) return "Linux";
    return "Unknown Device";
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Active Sessions</h3>
          <p className="text-sm text-muted-foreground">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""} active
          </p>
        </div>
        {sessions.filter((s) => !s.isCurrent).length > 0 && (
          <Button
            variant="outline"
            onClick={handleTerminateAllOtherSessions}
            className="text-destructive hover:text-destructive"
            disabled={terminatingAll}
          >
            {terminatingAll ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive mx-auto"></div>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Terminate All Others
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-start justify-between p-4 rounded-lg border ${session.isCurrent
                ? "bg-primary/5 border-primary/20"
                : "bg-background border-border"
              }`}
          >
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="p-2 bg-muted rounded-lg flex-shrink-0">
                <Monitor className="h-5 w-5" />
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {getDeviceInfo(session.userAgent)}
                  </span>
                  {session.isCurrent && (
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full flex-shrink-0">
                      Current Session
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="hidden sm:inline">
                      {session.ipAddress}
                    </span>
                    <span className="sm:hidden">
                      {session.ipAddress.split(".").slice(0, 2).join(".")}...
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(session.lastActivity)}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground truncate">
                  {session.userAgent}
                </p>
              </div>
            </div>

            {!session.isCurrent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTerminateSession(session.id)}
                className="text-destructive hover:text-destructive flex-shrink-0 ml-2"
                disabled={terminatingSession === session.id}
              >
                {terminatingSession === session.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive mx-auto"></div>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-8">
          <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Active Sessions</h3>
          <p className="text-muted-foreground">
            You don&apos;t have any active sessions at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
