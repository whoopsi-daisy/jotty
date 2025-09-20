"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Note, Category } from "@/app/_types";
import { NoteEditor } from "./components/NoteEditor";
import { getDocsCategories } from "@/app/_server/actions/data/notes-actions";
import { useNavigationGuard } from "@/app/_providers/NavigationGuardProvider";
import { Layout } from "@/app/_components/common/layout/Layout";

interface NoteClientProps {
  note: Note;
  docs: Note[];
  categories: Category[];
  username: string;
  isAdmin: boolean;
}

export function NoteClient({
  note,
  docs,
  categories,
  username,
  isAdmin,
}: NoteClientProps) {
  const router = useRouter();
  const { checkNavigation } = useNavigationGuard();
  const [localNote, setLocalNote] = useState<Note>(note);

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const handleUpdate = (updatedNote: Note) => {
    setLocalNote(updatedNote);
  };

  const handleBack = () => {
    checkNavigation(() => {
      router.push("/");
    });
  };

  const handleDelete = (deletedId: string) => {
    checkNavigation(() => {
      router.push("/");
    });
  };

  return (
    <Layout
      lists={[]}
      docs={docs}
      categories={categories}
      onOpenSettings={() => {}}
      onOpenCreateModal={() => {}}
      onOpenCategoryModal={() => {}}
      isAdmin={isAdmin}
      username={username}
    >
      <NoteEditor
        doc={localNote}
        categories={categories}
        onUpdate={handleUpdate}
        onBack={handleBack}
        onDelete={handleDelete}
        currentUsername={username}
        isAdmin={isAdmin}
      />
    </Layout>
  );
}
