"use client";

import { useState, useContext } from "react";
import { QuickNav } from "@/app/_components/features/header/QuickNav";
import { Sidebar } from "@/app/_components/Sidebar";
import { Checklist, Category, Document } from "@/app/_types";
import { ChecklistContext } from "@/app/_providers/ChecklistProvider";
import { useAppMode } from "@/app/_providers/AppModeProvider";

interface LayoutProps {
  lists: Checklist[];
  docs?: Document[];
  categories: Category[];
  onOpenSettings: () => void;
  onOpenCreateModal: (initialCategory?: string) => void;
  onOpenCategoryModal: () => void;
  onOpenEditModal: (list: Checklist) => void;
  children: React.ReactNode;
  isAdmin: boolean;
  username: string;
}

export function Layout({
  lists,
  docs,
  categories,
  onOpenSettings,
  onOpenCreateModal,
  onOpenCategoryModal,
  onOpenEditModal,
  isAdmin,
  username,
  children,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setSelectedChecklist } = useContext(ChecklistContext);
  const { setSelectedDocument, setMode } = useAppMode();

  const handleSelectChecklist = (id: string) => {
    setSelectedChecklist(id);
  };

  const handleSelectDocument = (id: string) => {
    setSelectedDocument(id);
  };

  return (
    <div className="flex h-screen bg-background w-full">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCreateModal={onOpenCreateModal}
        onOpenCategoryModal={onOpenCategoryModal}
        onOpenEditModal={onOpenEditModal}
        categories={categories}
        checklists={lists}
        docs={docs}
        username={username}
        isAdmin={isAdmin}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <QuickNav
          showSidebarToggle
          onSidebarToggle={() => setSidebarOpen(true)}
          onOpenSettings={onOpenSettings}
          isAdmin={isAdmin}
          checklists={lists}
          docs={docs || []}
          onSelectChecklist={handleSelectChecklist}
          onSelectDocument={handleSelectDocument}
          onModeChange={setMode}
        />

        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
