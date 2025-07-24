"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Folder,
  FolderPlus,
  ChevronDown,
  X,
  Edit3,
  Trash2,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteCategoryAction } from "@/app/actions";
import { DeleteCategoryModal } from "./delete-category-modal";
import { Logo } from "./ui/icons/logo";
import UserSwitcher from "./UserSwitcher";
import { useRouter } from "next/navigation";
import { logout } from "@/server/actions/auth/logout";
import { SettingsModal } from "./settings-modal";

interface Checklist {
  id: string;
  title: string;
  category?: string;
  items: any[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  name: string;
  count: number;
}

interface SidebarProps {
  selectedChecklist: string | null;
  onSelectChecklist: (id: string | null) => void;
  onUpdate?: () => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: () => void;
  onOpenCategoryModal: () => void;
  onOpenEditModal: (checklist: Checklist) => void;
  categories: Category[];
  checklists: Checklist[];
  username: string;
  isAdmin: boolean;
}

export function Sidebar({
  selectedChecklist,
  onSelectChecklist,
  onUpdate,
  isOpen,
  onClose,
  onOpenCreateModal,
  onOpenCategoryModal,
  onOpenEditModal,
  categories,
  checklists,
  username,
  isAdmin,
}: SidebarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  const handleDeleteCategory = (categoryName: string) => {
    setCategoryToDelete(categoryName);
    setShowDeleteCategoryModal(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const formData = new FormData();
    formData.append("name", categoryToDelete);
    const result = await deleteCategoryAction(formData);

    if (result.success) {
      onUpdate?.();
      setShowDeleteCategoryModal(false);
      setCategoryToDelete(null);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  // Filter checklists based on search term
  const filteredChecklists = searchTerm
    ? checklists.filter((list) =>
        list.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : checklists;

  // Group checklists by category
  const checklistsByCategory = filteredChecklists.reduce((acc, list) => {
    const category = list.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(list);
    return acc;
  }, {} as Record<string, Checklist[]>);

  // Get all unique categories including those without checklists
  const allCategories = Array.from(
    new Set([
      ...categories.map((c) => c.name),
      ...Object.keys(checklistsByCategory),
    ])
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-30 w-80 bg-background border-r border-border transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="border-b border-border">
            <div className="flex items-center justify-between p-4">
              <a href="/" className="flex items-center gap-3">
                <Logo className="h-8 w-8 text-primary" />
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* User Controls */}
            <div className="px-4 pb-4 flex items-center gap-2 w-full justify-end">
              {isAdmin && <UserSwitcher currentUsername={username} />}
            </div>
          </div>

          {/* Search and Create */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search checklists..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-transparent border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenCreateModal}
                className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-2">
            {/* Categories and their checklists */}
            <div className="space-y-4">
              {/* Add Category Button */}
              <div className="flex items-center justify-between px-3">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Categories
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenCategoryModal}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </div>

              {allCategories.map((categoryName) => {
                const categoryChecklists =
                  checklistsByCategory[categoryName] || [];
                const isCollapsed = collapsedCategories.has(categoryName);

                return (
                  <div key={categoryName} className="space-y-1">
                    {/* Category Header */}
                    <div className="group flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent">
                      <button
                        onClick={() => toggleCategory(categoryName)}
                        className="flex-1 flex items-center gap-2 text-sm text-muted-foreground group-hover:text-accent-foreground"
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isCollapsed && "-rotate-90"
                          )}
                        />
                        <Folder className="h-4 w-4" />
                        <span>{categoryName}</span>
                        <span className="text-xs">
                          ({categoryChecklists.length})
                        </span>
                      </button>
                      {categoryName !== "Uncategorized" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(categoryName)}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {/* Category Checklists */}
                    {!isCollapsed && categoryChecklists.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {categoryChecklists.map((checklist) => (
                          <div
                            key={checklist.id}
                            className={cn(
                              "group flex items-center justify-between px-3 py-2 rounded-md",
                              selectedChecklist === checklist.id
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <button
                              onClick={() => onSelectChecklist(checklist.id)}
                              className="flex-1 text-left"
                            >
                              <span className="text-sm truncate">
                                {checklist.title}
                              </span>
                            </button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onOpenEditModal(checklist)}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DeleteCategoryModal
        isOpen={showDeleteCategoryModal}
        onClose={() => {
          setShowDeleteCategoryModal(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDeleteCategory}
        categoryName={categoryToDelete || ""}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
