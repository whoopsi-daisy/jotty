"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { ChecklistView } from "@/app/_components/_FeatureComponents/HomePage/ActiveViews/Checklist";
import { HomeView } from "@/app/_components/_FeatureComponents/HomePage/ActiveViews/Home";
import { CreateListModal } from "@/app/_components/UI/Modals/CreateList";
import { CreateCategoryModal } from "@/app/_components/UI/Modals/CreateCategory";
import { EditChecklistModal } from "@/app/_components/UI/Modals/edit-checklist-modal";
import { SettingsModal } from "@/app/_components/UI/Modals/Settings";
import { Layout } from "@/app/_components/UI/Layout";
import { getLists, getCategories } from "@/app/_server/actions/data/actions";
import { getHashFromUrl, setHashInUrl } from "@/app/_utils/url-utils";
import { List, Category } from "@/app/_types";
import { ChecklistContext } from "@/app/_providers/checklist-provider";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<List | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { selectedChecklist, setSelectedChecklist } = useContext(ChecklistContext);

  useEffect(() => {
    const hash = getHashFromUrl();
    if (hash) {
      setSelectedChecklist(hash);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && !isRefreshing) {
      setHashInUrl(selectedChecklist);
    }
  }, [selectedChecklist, isInitialized, isRefreshing]);

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
          onCreateModal={() => setShowCreateModal(true)}
        />
      )}

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
