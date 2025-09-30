"use client";

import { Note, Category } from "@/app/_types";
import { UnsavedChangesModal } from "@/app/_components/ui/modals/ConfirmationModals/UnsavedChangesModal";
import { useNoteEditor } from "../../hooks/note-editor-hooks";
import { NoteEditorHeader } from "./NoteEditorHeader";
import { NoteEditorContent } from "./NoteEditorContent";

export interface NoteEditorProps {
  note: Note;
  categories: Category[];
  onUpdate: (updatedDoc: Note) => void;
  onBack: () => void;
  onDelete?: (deletedId: string) => void;
  currentUsername?: string;
  isAdmin?: boolean;
}

export function NoteEditor({
  note,
  categories,
  onUpdate,
  onBack,
  onDelete,
  currentUsername,
  isAdmin = false,
}: NoteEditorProps) {
  const viewModel = useNoteEditor({
    note,
    onUpdate,
    onDelete: onDelete || (() => {}),
    onBack,
  });
  const isOwner = note.owner === currentUsername;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background h-full">
      <NoteEditorHeader
        note={note}
        categories={categories}
        isOwner={isOwner}
        isAdmin={isAdmin}
        currentUsername={currentUsername}
        onBack={onBack}
        viewModel={viewModel}
      />

      <NoteEditorContent
        isEditing={viewModel.isEditing}
        noteContent={note.content}
        editorContent={viewModel.editorContent}
        onEditorContentChange={viewModel.handleEditorContentChange}
        category={viewModel.category}
      />

      <UnsavedChangesModal
        isOpen={viewModel.showUnsavedChangesModal}
        onClose={() => viewModel.setShowUnsavedChangesModal(false)}
        onSave={viewModel.handleUnsavedChangesSave}
        onDiscard={viewModel.handleUnsavedChangesDiscard}
        noteTitle={note.title}
      />
    </div>
  );
}
