"use client";

import { CheckSquare, FileText, Globe, Users } from "lucide-react";
import { StatCard } from "@/app/_components/GlobalComponents/Cards/StatCard";
import { AdminSharedItemsList } from "@/app/_components/FeatureComponents/Admin/Parts/AdminSharedItemsList";
import { GlobalSharing, MostActiveSharer } from "@/app/_types";

interface AdminSharingProps {
  globalSharing: GlobalSharing;
}

export const AdminSharing = ({ globalSharing }: AdminSharingProps) => {
  const { sharingStats, allSharedChecklists, allSharedNotes } = globalSharing;

  const stats = [
    {
      title: "Shared Checklists",
      value: sharingStats?.totalSharedChecklists,
      icon: <CheckSquare className="h-6 w-6 text-primary" />,
    },
    {
      title: "Shared Notes",
      value: sharingStats?.totalSharedNotes,
      icon: <FileText className="h-6 w-6 text-primary" />,
    },
    {
      title: "Public Shares",
      value: sharingStats?.totalPublicShares,
      icon: <Globe className="h-6 w-6 text-primary" />,
    },
    {
      title: "Total Shares",
      value: sharingStats?.totalSharingRelationships,
      icon: <Users className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Global Sharing Overview</h2>
        <div className="text-sm text-muted-foreground">
          {sharingStats?.totalSharingRelationships || 0} total sharing
          relationships
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value || 0}
            icon={stat.icon}
          />
        ))}
      </div>

      {sharingStats?.mostActiveSharers?.length > 0 && (
        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Most Active Sharers
          </h3>
          <div className="space-y-2">
            {sharingStats.mostActiveSharers.map(
              (sharer: MostActiveSharer, index: number) => (
                <div
                  key={sharer.username}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-foreground">
                      {sharer.username}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {sharer.sharedCount} item
                    {sharer.sharedCount !== 1 ? "s" : ""} shared
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminSharedItemsList
          title="Checklists"
          items={allSharedChecklists}
          icon={<CheckSquare className="h-5 w-5" />}
        />
        <AdminSharedItemsList
          title="Notes"
          items={allSharedNotes}
          icon={<FileText className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};
