"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChecklistHome } from "@/app/_components/FeatureComponents/Home/Parts/ChecklistHome";
import { NotesHome } from "@/app/_components/FeatureComponents/Home/Parts/NotesHome";
import { CreateListModal } from "@/app/_components/GlobalComponents/Modals/ChecklistModals/CreateListModal";
import { CreateCategoryModal } from "@/app/_components/GlobalComponents/Modals/CategoryModals/CreateCategoryModal";
import { SettingsModal } from "@/app/_components/GlobalComponents/Modals/SettingsModals/Settings";
import { Layout } from "@/app/_components/GlobalComponents/Layout/Layout";
import { Checklist, Category, Note, User } from "@/app/_types";
import { useAppMode } from "@/app/_providers/AppModeProvider";
import { CreateNoteModal } from "@/app/_components/GlobalComponents/Modals/NotesModal/CreateNoteModal";
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [initialCategory, setInitialCategory] = useState<string>("");
  const [initialParentCategory, setInitialParentCategory] =
    useState<string>("");
  const { mode } = useAppMode();

  const handleOpenCreateModal = (initialCategory?: string) => {
    if (mode === Modes.NOTES) {
      setShowCreateNoteModal(true);
      setInitialCategory(initialCategory || "");
    } else {
      setShowCreateModal(true);
      setInitialCategory(initialCategory || "");
    }
  };

  const handleOpenCategoryModal = (parentCategory?: string) => {
    setShowCategoryModal(true);
    setInitialParentCategory(parentCategory || "");
  };

  return (
    <Layout
      lists={initialLists}
      docs={initialDocs}
      categories={
        mode === Modes.NOTES ? initialDocsCategories : initialCategories
      }
      sharingStatuses={sharingStatuses}
      onOpenSettings={() => setShowSettingsModal(true)}
      onOpenCreateModal={handleOpenCreateModal}
      onOpenCategoryModal={handleOpenCategoryModal}
      user={user}
      onCategoryDeleted={() => router.refresh()}
      onCategoryRenamed={() => router.refresh()}
    >
      {mode === Modes.CHECKLISTS && (
        <>
          <ChecklistHome
            lists={initialLists}
            onCreateModal={() => setShowCreateModal(true)}
            onSelectChecklist={(id) => router.push(`/checklist/${id}`)}
          />

          {showCreateModal && (
            <CreateListModal
              onClose={() => setShowCreateModal(false)}
              onCreated={(newChecklist) => {
                if (newChecklist) {
                  router.push(`/checklist/${newChecklist.id}`);
                }
                setShowCreateModal(false);
                router.refresh();
              }}
              categories={initialCategories}
              initialCategory={initialCategory}
            />
          )}
        </>
      )}

      {mode === Modes.NOTES && (
        <>
          <NotesHome
            notes={initialDocs}
            categories={initialDocsCategories}
            onCreateModal={() => setShowCreateNoteModal(true)}
            onSelectNote={(id) => router.push(`/note/${id}`)}
          />

          {showCreateNoteModal && (
            <CreateNoteModal
              onClose={() => setShowCreateNoteModal(false)}
              onCreated={(newNote) => {
                if (newNote) {
                  router.push(`/note/${newNote.id}`);
                }
                setShowCreateNoteModal(false);
                router.refresh();
              }}
              categories={initialDocsCategories}
              initialCategory={initialCategory}
            />
          )}
        </>
      )}

      {showCategoryModal && (
        <CreateCategoryModal
          mode={mode}
          categories={
            mode === Modes.NOTES ? initialDocsCategories : initialCategories
          }
          initialParent={initialParentCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setInitialParentCategory("");
          }}
          onCreated={() => {
            setShowCategoryModal(false);
            setInitialParentCategory("");
            router.refresh();
          }}
        />
      )}

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </Layout>
  );
};
