"use client";

import { useState } from "react";
import { DocsHomeView } from "@/app/_components/_FeatureComponents/DocsPage/ActiveViews/DocsHome";
import { DocEditor } from "@/app/_components/_FeatureComponents/DocsPage/ActiveViews/DocEditor";
import { CreateDocModal } from "@/app/_components/UI/Modals/CreateDoc";
import { EditDocModal } from "@/app/_components/UI/Modals/EditDoc";
import { Document, Category } from "@/app/_types";
import { useAppMode } from "@/app/_providers/app-mode-provider";

interface DocsClientProps {
  docs: Document[];
  categories: Category[];
}

export function DocsClient({
  docs,
  categories,
}: DocsClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const { selectedDocument, setSelectedDocument } = useAppMode();

  const handleOpenEditModal = (doc: Document) => {
    setEditingDoc(doc);
    setShowEditModal(true);
  };

  const handleModalClose = async () => {
    if (selectedDocument && editingDoc && selectedDocument === editingDoc.id) {
      setSelectedDocument(null);
    }
  };

  const handleDocDeleted = async () => {
    setSelectedDocument(null);
  };

  const selectedDoc = docs.find((doc) => doc.id === selectedDocument);

  return (
    <>
      {selectedDoc ? (
        <DocEditor
          doc={selectedDoc}
          categories={categories}
          onUpdate={() => { }}
          onBack={() => setSelectedDocument(null)}
        />
      ) : (
        <DocsHomeView
          docs={docs}
          categories={categories}
          onCreateModal={() => setShowCreateModal(true)}
          onSelectDoc={(id) => setSelectedDocument(id)}
        />
      )}

      {showCreateModal && (
        <CreateDocModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(docId) => {
            setShowCreateModal(false);
            // Use router.refresh() to reload the page and get fresh data
            window.location.reload();
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
