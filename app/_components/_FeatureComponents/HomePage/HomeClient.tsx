"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { ChecklistView } from "@/app/_components/_FeatureComponents/HomePage/ActiveViews/Checklist";
import { HomeView } from "@/app/_components/_FeatureComponents/HomePage/ActiveViews/Home";
import { DocsClient } from "@/app/_components/_FeatureComponents/DocsPage/DocsClient";
import { CreateListModal } from "@/app/_components/UI/Modals/CreateList";
import { CreateCategoryModal } from "@/app/_components/UI/Modals/CreateCategory";
import { EditChecklistModal } from "@/app/_components/UI/Modals/edit-checklist-modal";
import { SettingsModal } from "@/app/_components/UI/Modals/Settings";
import { Layout } from "@/app/_components/UI/Layout";
import { getLists, getCategories } from "@/app/_server/actions/data/actions";
import {
  getDocs,
  getDocsCategories,
} from "@/app/_server/actions/data/docs-actions";
import { getHashFromUrl, setHashInUrl } from "@/app/_utils/url-utils";
import { List, Category, Document } from "@/app/_types";
import { ChecklistContext } from "@/app/_providers/checklist-provider";
import { useAppMode } from "@/app/_providers/app-mode-provider";
import { CreateDocModal } from "@/app/_components/UI/Modals/CreateDoc";

interface HomeClientProps {
  initialLists: List[];
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
  const [lists, setLists] = useState<List[]>(initialLists);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [docsCategories, setDocsCategories] = useState<Category[]>(
    initialDocsCategories
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCreateDocModal, setShowCreateDocModal] = useState(false);
  const [showDocsCategoryModal, setShowDocsCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<List | null>(null);
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
  }, [mode]);

  // Separate effect for initial hash handling
  useEffect(() => {
    if (!isInitialized) return;

    const hash = getHashFromUrl();
    if (hash) {
      // Check if it's a doc ID
      const isDocId = docs.some((doc) => doc.id === hash);
      // Check if it's a checklist ID
      const isChecklistId = lists.some((list) => list.id === hash);

      if (isDocId && mode !== "docs") {
        // Switch to docs mode and select document
        setMode("docs");
        setSelectedDocument(hash);
        setSelectedChecklist(null);
      } else if (isChecklistId && mode !== "checklists") {
        // Switch to checklists mode and select checklist
        setMode("checklists");
        setSelectedChecklist(hash);
        setSelectedDocument(null);
      }
    }
  }, [
    isInitialized,
    docs,
    lists,
    mode,
    setMode,
    setSelectedDocument,
    setSelectedChecklist,
  ]);

  useEffect(() => {
    if (isInitialized && !isRefreshing) {
      if (mode === "checklists") {
        setHashInUrl(selectedChecklist);
      } else if (mode === "docs") {
        setHashInUrl(selectedDocument);
      }
    }
  }, [selectedChecklist, selectedDocument, isInitialized, isRefreshing, mode]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [listsResult, categoriesResult, docsResult, docsCategoriesResult] =
        await Promise.all([
          getLists(),
          getCategories(),
          getDocs(),
          getDocsCategories(),
        ]);

      const newLists =
        listsResult.success && listsResult.data ? listsResult.data : [];
      const newCategories =
        categoriesResult.success && categoriesResult.data
          ? categoriesResult.data
          : [];
      const newDocs =
        docsResult.success && docsResult.data ? docsResult.data : [];
      const newDocsCategories =
        docsCategoriesResult.success && docsCategoriesResult.data
          ? docsCategoriesResult.data
          : [];

      setLists(newLists);
      setCategories(newCategories);
      setDocs(newDocs);
      setDocsCategories(newDocsCategories);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenEditModal = (checklist: List) => {
    setEditingChecklist(checklist);
    setShowEditModal(true);
  };

  const handleModalClose = async () => {
    await refreshData();

    if (
      selectedChecklist &&
      editingChecklist &&
      selectedChecklist === editingChecklist.id
    ) {
      setSelectedChecklist(null);
    }

    router.refresh();
  };

  const handleListDeleted = async () => {
    await refreshData();
    setSelectedChecklist(null);
    router.refresh();
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

  const selectedList = lists.find((list) => list.id === selectedChecklist);

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
          initialDocs={docs}
          initialCategories={docsCategories}
          username={username}
          isAdmin={isAdmin}
        />
      );
    }

    // Checklist mode
    if (selectedList) {
      return (
        <ChecklistView
          list={selectedList}
          onUpdate={refreshData}
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
      onRefresh={refreshData}
      isRefreshing={isRefreshing}
      onOpenSettings={() => setShowSettingsModal(true)}
      onOpenCreateModal={handleOpenCreateModal}
      onOpenCategoryModal={handleOpenCategoryModal}
      onOpenEditModal={handleOpenEditModal}
      isAdmin={isAdmin}
      username={username}
    >
      {renderContent()}

      {mode === "checklists" && showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            handleModalClose();
          }}
          categories={categories}
          initialCategory={initialCategory}
        />
      )}

      {mode === "docs" && showCreateDocModal && (
        <CreateDocModal
          onClose={() => setShowCreateDocModal(false)}
          onCreated={() => {
            setShowCreateDocModal(false);
            handleModalClose();
          }}
          categories={docsCategories}
          initialCategory={initialCategory}
        />
      )}

      {mode === "checklists" && showCategoryModal && (
        <CreateCategoryModal
          onClose={() => setShowCategoryModal(false)}
          onCreated={() => {
            setShowCategoryModal(false);
            handleModalClose();
          }}
        />
      )}

      {mode === "docs" && showDocsCategoryModal && (
        <CreateCategoryModal
          onClose={() => setShowDocsCategoryModal(false)}
          onCreated={() => {
            setShowDocsCategoryModal(false);
            handleModalClose();
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
