"use client";

import { useState, useEffect, useRef } from "react";
import { NotesHomeView } from "@/app/_components/features/notes/components/NotesHome";
import { NoteEditor } from "@/app/_components/features/notes/components/NoteEditor/NoteEditor";
import { EditDocModal } from "@/app/_components/ui/modals/NotesModal/EditDoc";
import { Note, Category } from "@/app/_types";
import { useAppMode } from "@/app/_providers/AppModeProvider";

interface NotesClientProps {
  docs: Note[];
  categories: Category[];
  onDocDelete?: (deletedId: string) => void;
  onDocUpdate?: (updatedDoc: Note) => void;
  onCreateModal: () => void;
  currentUsername?: string;
  isAdmin?: boolean;
}

export function NotesClient({
  docs,
  categories,
  onDocDelete,
  onDocUpdate,
  onCreateModal,
  currentUsername,
  isAdmin = false,
}: NotesClientProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Note | null>(null);
  const [localDocs, setLocalDocs] = useState<Note[]>(docs);
  const { selectedNote, setSelectedNote } = useAppMode();
  const prevDocsLength = useRef(docs.length);

  useEffect(() => {
    if (docs.length !== prevDocsLength.current) {
      setLocalDocs(docs);
      prevDocsLength.current = docs.length;
    }
  }, [docs]);

  const handleModalClose = async () => {
    if (selectedNote && editingDoc && selectedNote === editingDoc.id) {
      setSelectedNote(null);
    }
  };

  const selectedDoc = localDocs.find((doc) => doc.id === selectedNote);

  const handleDocUpdate = (updatedDoc: Note) => {
    setLocalDocs((prev) =>
      prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))
    );
    onDocUpdate?.(updatedDoc);
  };

  const handleNoteSelection = (noteId: string) => {
    setSelectedNote(noteId);
  };

  return (
    <>
      {selectedDoc ? (
        <NoteEditor
          note={selectedDoc}
          categories={categories}
          onUpdate={handleDocUpdate}
          onBack={() => setSelectedNote(null)}
          onDelete={onDocDelete}
          currentUsername={currentUsername}
          isAdmin={isAdmin}
        />
      ) : (
        <NotesHomeView
          notes={localDocs}
          categories={categories}
          onCreateModal={onCreateModal}
          onSelectDoc={(id) => setSelectedNote(id)}
        />
      )}
    </>
  );
}
