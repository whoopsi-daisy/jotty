"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { ChecklistView } from "@/app/_components/features/home/components/Checklist";
import { HomeView } from "@/app/_components/features/home/components/Home";
import { DocsClient } from "@/app/_components/features/docs/DocsClient";
import { CreateListModal } from "@/app/_components/ui/modals/checklist/CreateList";
import { CreateCategoryModal } from "@/app/_components/ui/modals/category/CreateCategory";
import { EditChecklistModal } from "@/app/_components/ui/modals/checklist/EditChecklistModal";
import { SettingsModal } from "@/app/_components/ui/modals/settings/Settings";
import { Layout } from "@/app/_components/common/layout/Layout";
import { getHashFromUrl, setHashInUrl } from "@/app/_utils/url-utils";
import { Checklist, Category, Document } from "@/app/_types";
import { ChecklistContext } from "@/app/_providers/ChecklistProvider";
import { useAppMode } from "@/app/_providers/AppModeProvider";
import { CreateDocModal } from "@/app/_components/ui/modals/document/CreateDoc";

interface HomeClientProps {
  initialLists: Checklist[];
  initialCategories: Category[];
  initialDocs: Document[];
  initialDocsCategories: Category[];
  username: string;
  isAdmin: boolean;
}

export function HomeClient({
  initialLists,
  initialCategories,
  initialDocs,
  initialDocsCategories,
  username,
  isAdmin,
}: HomeClientProps) {
  const router = useRouter();
  const [lists, setLists] = useState<Checklist[]>(initialLists);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [docsCategories, setDocsCategories] = useState<Category[]>(
    initialDocsCategories
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCreateDocModal, setShowCreateDocModal] = useState(false);
  const [showDocsCategoryModal, setShowDocsCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(
    null
  );
  const [initialCategory, setInitialCategory] = useState<string>("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { selectedChecklist, setSelectedChecklist } =
    useContext(ChecklistContext);
  const { mode, selectedDocument, setSelectedDocument, setMode } = useAppMode();

  useEffect(() => {
    const hash = getHashFromUrl();
    if (hash) {
      if (mode === "checklists") {
        setSelectedChecklist(hash);
      } else if (mode === "docs") {
        setSelectedDocument(hash);
      }
    }
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    if (!isInitialized) return;

    const hash = getHashFromUrl();
    if (hash) {
      const isDocId = docs.some((doc) => doc.id === hash);
      const isChecklistId = lists.some((list) => list.id === hash);

      if (isDocId && mode !== "docs") {
        setMode("docs");
        setSelectedDocument(hash);
        setSelectedChecklist(null);
      } else if (isChecklistId && mode !== "checklists") {
        setMode("checklists");
        setSelectedChecklist(hash);
        setSelectedDocument(null);
      } else if (isDocId && mode === "docs") {
        setSelectedDocument(hash);
        setSelectedChecklist(null);
      } else if (isChecklistId && mode === "checklists") {
        setSelectedChecklist(hash);
        setSelectedDocument(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, docs, lists]);

  useEffect(() => {
    if (isInitialized) {
      if (mode === "checklists") {
        setHashInUrl(selectedChecklist);
      } else if (mode === "docs") {
        setHashInUrl(selectedDocument);
      }
    }
  }, [selectedChecklist, selectedDocument, isInitialized, mode]);

  const handleOpenEditModal = (checklist: Checklist) => {
    setEditingChecklist(checklist);
    setShowEditModal(true);
  };

  const handleModalClose = async () => {
    if (
      selectedChecklist &&
      editingChecklist &&
      selectedChecklist === editingChecklist.id
    ) {
      setSelectedChecklist(null);
    }
  };

  const handleListDeleted = async (deletedId: string) => {
    setLists((prev) => prev.filter((list) => list.id !== deletedId));
    setSelectedChecklist(null);
    setHashInUrl("");
  };

  const handleOpenCreateModal = (initialCategory?: string) => {
    if (mode === "docs") {
      setShowCreateDocModal(true);
      setInitialCategory(initialCategory || "");
    } else {
      setShowCreateModal(true);
      setInitialCategory(initialCategory || "");
    }
  };

  const handleOpenCategoryModal = () => {
    if (mode === "docs") {
      setShowDocsCategoryModal(true);
    } else {
      setShowCategoryModal(true);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen bg-background w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (mode === "docs") {
      return (
        <DocsClient
          docs={docs}
          categories={docsCategories}
          onDocsUpdate={setDocs}
          onDocDelete={(deletedId) => {
            setDocs((prev) => prev.filter((doc) => doc.id !== deletedId));
            setSelectedDocument(null);
            setHashInUrl("");
          }}
        />
      );
    }

    const selectedList = lists.find((list) => list.id === selectedChecklist);
    if (selectedList) {
      return (
        <ChecklistView
          list={selectedList}
          onUpdate={() => {}}
          onBack={() => setSelectedChecklist(null)}
          onEdit={handleOpenEditModal}
          onDelete={handleListDeleted}
        />
      );
    }

    return (
      <HomeView lists={lists} onCreateModal={() => setShowCreateModal(true)} />
    );
  };

  return (
    <Layout
      lists={lists}
      docs={docs}
      categories={mode === "docs" ? docsCategories : categories}
      onOpenSettings={() => setShowSettingsModal(true)}
      onOpenCreateModal={handleOpenCreateModal}
      onOpenCategoryModal={handleOpenCategoryModal}
      isAdmin={isAdmin}
      username={username}
    >
      {renderContent()}

      {mode === "checklists" && showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newChecklist) => {
            setShowCreateModal(false);
            if (newChecklist) {
              setLists((prev) => [...prev, newChecklist]);
              setSelectedChecklist(newChecklist.id);
              setHashInUrl(newChecklist.id);
            }
          }}
          categories={categories}
          initialCategory={initialCategory}
        />
      )}

      {mode === "docs" && showCreateDocModal && (
        <CreateDocModal
          onClose={() => setShowCreateDocModal(false)}
          onCreated={(newDoc) => {
            setShowCreateDocModal(false);
            if (newDoc) {
              setDocs((prev) => [...prev, newDoc]);
              setSelectedDocument(newDoc.id);
              setHashInUrl(newDoc.id);
            }
          }}
          categories={docsCategories}
          initialCategory={initialCategory}
        />
      )}

      {mode === "checklists" && showCategoryModal && (
        <CreateCategoryModal
          onClose={() => setShowCategoryModal(false)}
          onCreated={(newCategory) => {
            setShowCategoryModal(false);
            if (newCategory) {
              setCategories((prev) => [...prev, newCategory]);
            }
          }}
        />
      )}

      {mode === "docs" && showDocsCategoryModal && (
        <CreateCategoryModal
          onClose={() => setShowDocsCategoryModal(false)}
          onCreated={(newCategory) => {
            setShowDocsCategoryModal(false);
            if (newCategory) {
              setDocsCategories((prev) => [...prev, newCategory]);
            }
          }}
        />
      )}

      {mode === "checklists" && showEditModal && editingChecklist && (
        <EditChecklistModal
          checklist={editingChecklist}
          categories={categories}
          onClose={() => {
            setShowEditModal(false);
            setEditingChecklist(null);
          }}
          onUpdated={() => {
            setShowEditModal(false);
            setEditingChecklist(null);
            handleModalClose();
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
