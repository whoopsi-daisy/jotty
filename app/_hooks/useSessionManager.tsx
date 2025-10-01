import { useState, useCallback, useEffect } from "react";
import { Session } from "@/app/_types";
import {
  getSessionsAction,
  terminateSessionAction,
  terminateAllOtherSessionsAction,
} from "@/app/_server/actions/users/session-management";

export const useSessionManager = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [status, setStatus] = useState({
    isLoading: true,
    error: null as string | null,
    success: null as string | null,
  });
  const [terminating, setTerminating] = useState<{
    id: string | null;
    all: boolean;
  }>({ id: null, all: false });

  const loadSessions = useCallback(async () => {
    setStatus({ isLoading: true, error: null, success: null });
    try {
      const result = await getSessionsAction();
      if (result.success && result.data) setSessions(result.data);
      else throw new Error(result.error || "Failed to load sessions");
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "An error occurred.",
      }));
    } finally {
      setStatus((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleTerminateSession = async (sessionId: string) => {
    if (!window.confirm("Are you sure you want to terminate this session?"))
      return;
    setTerminating({ id: sessionId, all: false });
    try {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      const result = await terminateSessionAction(formData);
      if (result.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setStatus((prev) => ({ ...prev, success: "Session terminated!" }));
        setTimeout(
          () => setStatus((prev) => ({ ...prev, success: null })),
          3000
        );
      } else throw new Error(result.error || "Failed to terminate session");
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "An error occurred.",
      }));
    } finally {
      setTerminating({ id: null, all: false });
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    if (
      !window.confirm("Are you sure you want to terminate all other sessions?")
    )
      return;
    setTerminating({ id: null, all: true });
    try {
      const result = await terminateAllOtherSessionsAction();
      if (result.success) {
        setSessions((prev) => prev.filter((s) => s.isCurrent));
        setStatus((prev) => ({
          ...prev,
          success: "All other sessions terminated!",
        }));
        setTimeout(
          () => setStatus((prev) => ({ ...prev, success: null })),
          3000
        );
      } else throw new Error(result.error || "Failed to terminate sessions");
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "An error occurred.",
      }));
    } finally {
      setTerminating({ id: null, all: false });
    }
  };

  return {
    sessions,
    ...status,
    terminating,
    handleTerminateSession,
    handleTerminateAllOtherSessions,
  };
};
