"use client";

import { Checklist } from "@/app/_types";
import { PublicChecklistHeader } from "@/app/_components/FeatureComponents/PublicView/Parts/PublicChecklistHeader";
import { PublicChecklistBody } from "@/app/_components/FeatureComponents/PublicView/Parts/PublicChecklistBody";

interface PublicChecklistViewProps {
  checklist: Checklist;
}

export const PublicChecklistView = ({
  checklist,
}: PublicChecklistViewProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PublicChecklistHeader
          checklist={checklist}
          totalCount={checklist.items.length}
        />

        <main className="space-y-6">
          <PublicChecklistBody checklist={checklist} />
        </main>

        <footer className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            This checklist is shared publicly by {checklist.owner}
          </p>
        </footer>
      </div>
    </div>
  );
};
