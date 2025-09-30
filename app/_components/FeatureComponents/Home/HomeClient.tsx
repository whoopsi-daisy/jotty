"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeView } from "@/app/_components/FeatureComponents/Home/Parts/Home";
import { NotesHomeView } from "@/app/_components/FeatureComponents/Notes/Parts/NotesHome";
import { CreateListModal } from "@/app/_components/GlobalComponents/Modals/ChecklistModals/CreateListModal";
import { CreateCategoryModal } from "@/app/_components/GlobalComponents/Modals/CategoryModals/CreateCategoryModal";
import { SettingsModal } from "@/app/_components/GlobalComponents/Modals/SettingsModals/Settings";
import { Layout } from "@/app/_components/GlobalComponents/Layout/Layout";
import { Checklist, Category, Note } from "@/app/_types";
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
  username: string;
  isAdmin: boolean;
}

export function HomeClient({
  initialLists,
  initialCategories,
  initialDocs,
  initialDocsCategories,
  sharingStatuses,
  username,
  isAdmin,
}: HomeClientProps) {
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

  const handleCategoryDeleted = (categoryName: string) => {
    router.refresh();
  };

  const handleCategoryRenamed = (oldName: string, newName: string) => {
    router.refresh();
  };

  const handleSelectChecklist = (id: string) => {
    router.push(`/checklist/${id}`);
  };

  const handleSelectNote = (id: string) => {
    router.push(`/note/${id}`);
  };

  const renderContent = () => {
    if (mode === Modes.NOTES) {
      return (
        <NotesHomeView
          notes={initialDocs}
          categories={initialDocsCategories}
          onCreateModal={() => setShowCreateNoteModal(true)}
          onSelectDoc={handleSelectNote}
        />
      );
    }

    return (
      <HomeView
        lists={initialLists}
        onCreateModal={() => setShowCreateModal(true)}
        onSelectChecklist={handleSelectChecklist}
      />
    );
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
      isAdmin={isAdmin}
      username={username}
      onCategoryDeleted={handleCategoryDeleted}
      onCategoryRenamed={handleCategoryRenamed}
    >
      {renderContent()}

      {mode === Modes.CHECKLISTS && showCreateModal && (
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

      {mode === Modes.NOTES && showCreateNoteModal && (
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
}
