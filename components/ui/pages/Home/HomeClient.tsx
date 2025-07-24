"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChecklistView } from "@/components/checklist-view";
import { HomeView } from "@/components/home-view";
import { CreateListModal } from "@/components/create-list-modal";
import { CreateCategoryModal } from "@/components/create-category-modal";
import { EditChecklistModal } from "@/components/edit-checklist-modal";
import { SettingsModal } from "@/components/settings-modal";
import { Layout } from "@/components/ui/layout";
import { getLists, getCategories } from "@/app/actions";
import { getHashFromUrl, setHashInUrl } from "@/lib/url-utils";
import { List, Category } from "@/types";

interface HomeClientProps {
  initialLists: List[];
  initialCategories: Category[];
  username: string;
  isAdmin: boolean;
}

export function HomeClient({
  initialLists,
  initialCategories,
  username,
  isAdmin,
}: HomeClientProps) {
  const router = useRouter();
  const [lists, setLists] = useState<List[]>(initialLists);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<List | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Sync with URL hash on mount
  useEffect(() => {
    const hash = getHashFromUrl();
    if (hash) {
      setSelectedChecklist(hash);
    }
    setIsInitialized(true);
  }, []);

  // Update URL when selectedChecklist changes
  useEffect(() => {
    if (isInitialized && !isRefreshing) {
      setHashInUrl(selectedChecklist);
    }
  }, [selectedChecklist, isInitialized, isRefreshing]);

  // Refresh data function
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [listsResult, categoriesResult] = await Promise.all([
        getLists(),
        getCategories(),
      ]);

      const newLists =
        listsResult.success && listsResult.data ? listsResult.data : [];
      const newCategories =
        categoriesResult.success && categoriesResult.data
          ? categoriesResult.data
          : [];

      setLists(newLists);
      setCategories(newCategories);
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

    // If we were editing the currently selected checklist, clear the selection
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

  const selectedList = lists.find((list) => list.id === selectedChecklist);

  // Show loading state until we've initialized
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

  return (
    <Layout
      lists={lists}
      categories={categories}
      selectedChecklist={selectedChecklist}
      onSelectChecklist={setSelectedChecklist}
      onRefresh={refreshData}
      isRefreshing={isRefreshing}
      onOpenSettings={() => setShowSettingsModal(true)}
      onOpenCreateModal={() => setShowCreateModal(true)}
      onOpenCategoryModal={() => setShowCategoryModal(true)}
      onOpenEditModal={handleOpenEditModal}
      isAdmin={isAdmin}
      username={username}
    >
      {selectedList ? (
        <ChecklistView
          list={selectedList}
          onUpdate={refreshData}
          onBack={() => setSelectedChecklist(null)}
          onEdit={handleOpenEditModal}
          onDelete={handleListDeleted}
        />
      ) : (
        <HomeView
          lists={lists}
          onUpdate={refreshData}
          onSelectChecklist={setSelectedChecklist}
          onCreateModal={() => setShowCreateModal(true)}
        />
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            handleModalClose();
          }}
          categories={categories}
        />
      )}

      {showCategoryModal && (
        <CreateCategoryModal
          onClose={() => setShowCategoryModal(false)}
          onCreated={() => {
            setShowCategoryModal(false);
            handleModalClose();
          }}
        />
      )}

      {showEditModal && editingChecklist && (
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
