"use client";

import { useState, useContext } from "react";
import { QuickNav } from "@/app/_components/_FeatureComponents/Header/QuickNav";
import { Sidebar } from "@/app/_components/Sidebar";
import { List, Category, Document } from "@/app/_types";
import { ChecklistContext } from "@/app/_providers/checklist-provider";
import { useAppMode } from "@/app/_providers/app-mode-provider";

interface LayoutProps {
  lists: List[];
  docs?: Document[];
  categories: Category[];
  onOpenSettings: () => void;
  onOpenCreateModal: (initialCategory?: string) => void;
  onOpenCategoryModal: () => void;
  onOpenEditModal: (list: List) => void;
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
