"use client";

import { Note, User } from "@/app/_types";
import { FileText, Clock } from "lucide-react";
import { UnifiedMarkdownRenderer } from "@/app/_components/FeatureComponents/Notes/Parts/UnifiedMarkdownRenderer";
import { UserAvatar } from "@/app/_components/GlobalComponents/User/UserAvatar";
import { useEffect, useState } from "react";

interface PublicNoteViewProps {
  note: Note;
  user: User | null;
}

export const PublicNoteView = ({ note, user }: PublicNoteViewProps) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (window && user?.avatarUrl) {
      setAvatarUrl(window.location.origin + user?.avatarUrl);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <UserAvatar size="lg" username={user?.username || ""} avatarUrl={avatarUrl} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {note.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <span>by {user?.username}</span>
                </div>
                {note.category && <span>• {note.category}</span>}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <UnifiedMarkdownRenderer content={note.content} />
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            This note is shared publicly by {note.owner}
          </p>
        </div>
      </div>
    </div>
  );
};
