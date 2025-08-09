"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DocsHomeView } from "@/app/_components/_FeatureComponents/DocsPage/ActiveViews/DocsHome";
import { DocEditor } from "@/app/_components/_FeatureComponents/DocsPage/ActiveViews/DocEditor";
import { CreateDocModal } from "@/app/_components/UI/Modals/CreateDoc";
import { EditDocModal } from "@/app/_components/UI/Modals/EditDoc";
import {
  getDocs,
  getDocsCategories,
} from "@/app/_server/actions/data/docs-actions";
import { Document, Category } from "@/app/_types";
import { useAppMode } from "@/app/_providers/app-mode-provider";

interface DocsClientProps {
  initialDocs: Document[];
  initialCategories: Category[];
  username: string;
  isAdmin: boolean;
}

export function DocsClient({
  initialDocs,
  initialCategories,
  username,
  isAdmin,
}: DocsClientProps) {
  const router = useRouter();
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const { selectedDocument, setSelectedDocument } = useAppMode();

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [docsResult, categoriesResult] = await Promise.all([
        getDocs(),
        getDocsCategories(),
      ]);

      const newDocs =
        docsResult.success && docsResult.data ? docsResult.data : [];
      const newCategories =
        categoriesResult.success && categoriesResult.data
          ? categoriesResult.data
          : [];

      setDocs(newDocs);
      setCategories(newCategories);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenEditModal = (doc: Document) => {
    setEditingDoc(doc);
    setShowEditModal(true);
  };

  const handleModalClose = async () => {
    await refreshData();

    if (selectedDocument && editingDoc && selectedDocument === editingDoc.id) {
      setSelectedDocument(null);
    }

    router.refresh();
  };

  const handleDocDeleted = async () => {
    await refreshData();
    setSelectedDocument(null);
    router.refresh();
  };

  const selectedDoc = docs.find((doc) => doc.id === selectedDocument);

  return (
    <>
      {selectedDoc ? (
        <DocEditor
          doc={selectedDoc}
          categories={categories}
          onUpdate={refreshData}
          onBack={() => setSelectedDocument(null)}
        />
      ) : (
        <DocsHomeView
          docs={docs}
          categories={categories}
          onCreateModal={() => setShowCreateModal(true)}
          onSelectDoc={(id) => setSelectedDocument(id)}
          onRefresh={refreshData}
        />
      )}

      {showCreateModal && (
        <CreateDocModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            handleModalClose();
          }}
          categories={categories}
        />
      )}

      {showEditModal && editingDoc && (
        <EditDocModal
          doc={editingDoc}
          categories={categories}
          onClose={() => {
            setShowEditModal(false);
            setEditingDoc(null);
          }}
          onUpdated={() => {
            setShowEditModal(false);
            setEditingDoc(null);
            handleModalClose();
          }}
        />
      )}
    </>
  );
}
