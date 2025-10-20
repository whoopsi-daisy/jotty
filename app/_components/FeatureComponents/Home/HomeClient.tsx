"use client";

import { useRouter } from "next/navigation";
import { ChecklistHome } from "@/app/_components/FeatureComponents/Home/Parts/ChecklistHome";
import { NotesHome } from "@/app/_components/FeatureComponents/Home/Parts/NotesHome";
import { Layout } from "@/app/_components/GlobalComponents/Layout/Layout";
import { Checklist, Category, Note, User } from "@/app/_types";
import { useAppMode } from "@/app/_providers/AppModeProvider";
import { useShortcut } from "@/app/_providers/ShortcutsProvider";
import { Modes } from "@/app/_types/enums";

interface SharingStatus {
  isShared: boolean;
  isPubliclyShared: boolean;
  sharedWith: string[];
}

interface HomeClientProps {
  initialLists: Checklist[];
  initialCategories: Category[];
  initialDocs: Note[];
  initialDocsCategories: Category[];
  sharingStatuses: Record<string, SharingStatus>;
  user: User | null;
}

export const HomeClient = ({
  initialLists,
  initialCategories,
  initialDocs,
  initialDocsCategories,
  sharingStatuses,
  user,
}: HomeClientProps) => {
  const router = useRouter();
  const { mode } = useAppMode();
  const {
    openSettings,
    openCreateNoteModal,
    openCreateChecklistModal,
    openCreateCategoryModal,
  } = useShortcut();

  const handleOpenCreateModal = (initialCategory?: string) => {
    if (mode === Modes.NOTES) {
      openCreateNoteModal(initialCategory);
    } else {
      openCreateChecklistModal(initialCategory);
    }
  };

  return (
    <Layout
      lists={initialLists}
      docs={initialDocs}
      categories={
        mode === Modes.NOTES ? initialDocsCategories : initialCategories
      }
      sharingStatuses={sharingStatuses}
      onOpenSettings={openSettings}
      onOpenCreateModal={handleOpenCreateModal}
      onOpenCategoryModal={openCreateCategoryModal}
      user={user}
      onCategoryDeleted={() => router.refresh()}
      onCategoryRenamed={() => router.refresh()}
    >
      {mode === Modes.CHECKLISTS && (
        <ChecklistHome
          lists={initialLists}
          onCreateModal={openCreateChecklistModal}
          onSelectChecklist={(id) => router.push(`/checklist/${id}`)}
        />
      )}

      {mode === Modes.NOTES && (
        <NotesHome
          notes={initialDocs}
          categories={initialDocsCategories}
          onCreateModal={openCreateNoteModal}
          onSelectNote={(id) => router.push(`/note/${id}`)}
        />
      )}
    </Layout>
  );
};
