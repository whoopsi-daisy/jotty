"use client";

import { useState } from "react";
import { DocsHomeView } from "@/app/_components/features/docs/components/DocsHome";
import { DocEditor } from "@/app/_components/features/docs/components/DocEditor";
import { EditDocModal } from "@/app/_components/ui/modals/document/EditDoc";
import { Document, Category } from "@/app/_types";
import { useAppMode } from "@/app/_providers/AppModeProvider";

interface DocsClientProps {
  docs: Document[];
  categories: Category[];
  onDocDelete?: (deletedId: string) => void;
  onCreateModal: () => void;
}

export function DocsClient({
  docs,
  categories,
  onDocDelete,
  onCreateModal,
}: DocsClientProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const { selectedDocument, setSelectedDocument } = useAppMode();

  const handleModalClose = async () => {
    if (selectedDocument && editingDoc && selectedDocument === editingDoc.id) {
      setSelectedDocument(null);
    }
  };

  const selectedDoc = docs.find((doc) => doc.id === selectedDocument);

  return (
    <>
      {selectedDoc ? (
        <DocEditor
          doc={selectedDoc}
          categories={categories}
          onUpdate={() => {}}
          onBack={() => setSelectedDocument(null)}
          onDelete={onDocDelete}
        />
      ) : (
        <DocsHomeView
          docs={docs}
          categories={categories}
          onCreateModal={onCreateModal}
          onSelectDoc={(id) => setSelectedDocument(id)}
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
