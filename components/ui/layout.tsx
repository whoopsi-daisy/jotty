"use client";

import { useState } from "react";
import { QuickNav } from "./QuickNav";
import { Sidebar } from "@/components/sidebar";
import { List, Category } from "@/types";

interface LayoutProps {
  lists: List[];
  categories: Category[];
  selectedChecklist: string | null;
  onSelectChecklist: (id: string | null) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSettings: () => void;
  onOpenCreateModal: () => void;
  onOpenCategoryModal: () => void;
  onOpenEditModal: (list: List) => void;
  children: React.ReactNode;
  isAdmin: boolean;
  username: string;
}

export function Layout({
  lists,
  categories,
  selectedChecklist,
  onSelectChecklist,
  onRefresh,
  isRefreshing,
  onOpenSettings,
  onOpenCreateModal,
  onOpenCategoryModal,
  onOpenEditModal,
  isAdmin,
  username,
  children,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selectedList = lists.find((list) => list.id === selectedChecklist);

  return (
    <div className="flex h-screen bg-background w-full">
      <Sidebar
        selectedChecklist={selectedChecklist}
        onSelectChecklist={onSelectChecklist}
        onUpdate={onRefresh}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCreateModal={onOpenCreateModal}
        onOpenCategoryModal={onOpenCategoryModal}
        onOpenEditModal={onOpenEditModal}
        categories={categories}
        checklists={lists}
        username={username}
        isAdmin={isAdmin}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <QuickNav
          showSidebarToggle
          onSidebarToggle={() => setSidebarOpen(true)}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          onOpenSettings={onOpenSettings}
          isAdmin={isAdmin}
        />

        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
