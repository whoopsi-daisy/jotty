"use client";

import { useState, useEffect } from "react";
import { DocsHomeView } from "@/app/_components/features/docs/components/DocsHome";
import { DocEditor } from "@/app/_components/features/docs/components/DocEditor";
import { EditDocModal } from "@/app/_components/ui/modals/document/EditDoc";
import { Note, Category } from "@/app/_types";
import { useAppMode } from "@/app/_providers/AppModeProvider";

interface DocsClientProps {
  docs: Note[];
  categories: Category[];
  onDocDelete?: (deletedId: string) => void;
  onDocUpdate?: (updatedDoc: Note) => void;
  onCreateModal: () => void;
}

export function DocsClient({
  docs,
  categories,
  onDocDelete,
  onDocUpdate,
  onCreateModal,
}: DocsClientProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Note | null>(null);
  const [localDocs, setLocalDocs] = useState<Note[]>(docs);
  const { selectedNote, setSelectedNote } = useAppMode();

  useEffect(() => {
    setLocalDocs(docs);
  }, [docs]);

  const handleModalClose = async () => {
    if (selectedNote && editingDoc && selectedNote === editingDoc.id) {
      setSelectedNote(null);
    }
  };

  const selectedDoc = localDocs.find((doc) => doc.id === selectedNote);

  const handleDocUpdate = (updatedDoc: Note) => {
    setLocalDocs(prev => prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc));
    onDocUpdate?.(updatedDoc);
  };

  return (
    <>
      {selectedDoc ? (
        <DocEditor
          doc={selectedDoc}
          categories={categories}
          onUpdate={handleDocUpdate}
          onBack={() => setSelectedNote(null)}
          onDelete={onDocDelete}
        />
      ) : (
        <DocsHomeView
          docs={localDocs}
          categories={categories}
          onCreateModal={onCreateModal}
          onSelectDoc={(id) => setSelectedNote(id)}
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
