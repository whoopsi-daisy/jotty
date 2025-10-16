"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Note, Category, User } from "@/app/_types";
import { NoteEditor } from "@/app/_components/FeatureComponents/Notes/Parts/NoteEditor/NoteEditor";
import { useNavigationGuard } from "@/app/_providers/NavigationGuardProvider";
import { Layout } from "@/app/_components/GlobalComponents/Layout/Layout";
import { useShortcut } from "@/app/_providers/ShortcutsProvider";

interface SharingStatus {
  isShared: boolean;
  isPubliclyShared: boolean;
  sharedWith: string[];
}

interface NoteClientProps {
  note: Note;
  docs: Note[];
  categories: Category[];
  sharingStatuses?: Record<string, SharingStatus>;
  user: User | null;
}

export const NoteClient = ({
  note,
  docs,
  categories,
  sharingStatuses,
  user,
}: NoteClientProps) => {
  const router = useRouter();
  const { checkNavigation } = useNavigationGuard();
  const { openCreateNoteModal, openCreateCategoryModal, openSettings } =
    useShortcut();
  const [localNote, setLocalNote] = useState<Note>(note);
  const prevNoteId = useRef(note.id);

  useEffect(() => {
    if (note.id !== prevNoteId.current) {
      setLocalNote(note);
      prevNoteId.current = note.id;
    }
  }, [note]);

  const handleUpdate = (updatedNote: Note) => {
    setLocalNote(updatedNote);
  };

  const handleBack = () => {
    checkNavigation(() => {
      router.push("/");
    });
  };

  const handleDelete = (deletedId: string) => {
    checkNavigation(() => {
      router.push("/");
    });
  };

  return (
    <Layout
      lists={[]}
      docs={docs}
      categories={categories}
      sharingStatuses={sharingStatuses}
      onOpenSettings={openSettings}
      onOpenCreateModal={openCreateNoteModal}
      onOpenCategoryModal={openCreateCategoryModal}
      user={user}
    >
      <NoteEditor
        note={localNote}
        categories={categories}
        onUpdate={handleUpdate}
        onBack={handleBack}
        onDelete={handleDelete}
        currentUsername={user?.username}
        isAdmin={user?.isAdmin}
      />
    </Layout>
  );
};
