"use client";

import { SessionManager } from "@/app/_components/UI/SessionManager";

interface SessionsTabProps {
  username: string;
}

export function SessionsTab({ username }: SessionsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Sessions</h2>
      </div>

      <SessionManager username={username} />
    </div>
  );
}
