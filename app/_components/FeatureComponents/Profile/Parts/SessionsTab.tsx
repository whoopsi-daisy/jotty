"use client";

import { SessionManager } from "@/app/_components/FeatureComponents/Profile/Parts/SessionManager";

export const SessionsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Sessions</h2>
      </div>

      <SessionManager />
    </div>
  );
};
