"use client";

import { useContext, useState } from "react";
import {
  Search,
  Plus,
  Folder,
  FolderPlus,
  ChevronDown,
  X,
  Edit3,
  Trash2,
  CheckSquare,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/app/_components/UI/Elements/button";
import { cn } from "@/app/_utils/utils";
import {
  deleteCategoryAction,
  renameCategoryAction,
} from "@/app/_server/actions/data/actions";
import {
  deleteDocsCategoryAction,
  renameDocsCategoryAction,
} from "@/app/_server/actions/data/docs-actions";
import { DeleteCategoryModal } from "@/app/_components/UI/Modals/DeleteCategory";
import { RenameCategoryModal } from "@/app/_components/UI/Modals/RenameCategory";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "@/app/_components/UI/Elements/dropdown-menu";
import { Logo } from "@/app/_components/UI/Icons/logo";

import { useRouter } from "next/navigation";
import { SettingsModal } from "@/app/_components/UI/Modals/Settings";
import { Checklist, Category, Document, AppMode } from "@/app/_types";
import Link from "next/link";
import { ChecklistContext } from "../_providers/checklist-provider";
import { useAppMode } from "../_providers/app-mode-provider";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: (initialCategory?: string) => void;
  onOpenCategoryModal: () => void;
  onOpenEditModal: (checklist: Checklist) => void;
  categories: Category[];
  checklists: Checklist[];
  docs?: Document[];
  username: string;
  isAdmin: boolean;
}

export function Sidebar({
  isOpen,
  onClose,
  onOpenCreateModal,
  onOpenCategoryModal,
  onOpenEditModal,
  categories,
  checklists,
  docs = [],
  username,
  isAdmin,
}: SidebarProps) {
  const router = useRouter();
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToRename, setCategoryToRename] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );
  const [showSettings, setShowSettings] = useState(false);

  const { selectedChecklist, setSelectedChecklist } =
    useContext(ChecklistContext);
  const { mode, setMode, selectedDocument, setSelectedDocument } = useAppMode();

  const handleDeleteCategory = (categoryName: string) => {
    setCategoryToDelete(categoryName);
    setShowDeleteCategoryModal(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const formData = new FormData();
    formData.append("name", categoryToDelete);

    // Use the appropriate delete action based on mode
    const result =
      mode === "docs"
        ? await deleteDocsCategoryAction(formData)
        : await deleteCategoryAction(formData);

    if (result.success) {
      setShowDeleteCategoryModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleRenameCategory = (categoryName: string) => {
    setCategoryToRename(categoryName);
    setShowRenameCategoryModal(true);
  };

  const handleConfirmRenameCategory = async (
    oldName: string,
    newName: string
  ) => {
    const formData = new FormData();
    formData.append("oldName", oldName);
    formData.append("newName", newName);

    // Use the appropriate rename action based on mode
    const result =
      mode === "docs"
        ? await renameDocsCategoryAction(formData)
        : await renameCategoryAction(formData);

    if (result.success) {
      setShowRenameCategoryModal(false);
      setCategoryToRename(null);
    }
  };

  const handleQuickCreate = (categoryName: string) => {
    // Pass the category name to pre-select it in the modal
    onOpenCreateModal(categoryName);
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

  const handleModeSwitch = (newMode: AppMode) => {
    setMode(newMode);
    // Clear selections when switching modes
    setSelectedChecklist(null);
    setSelectedDocument(null);
  };

  // Get the items to display based on mode
  const items = mode === "docs" ? docs : checklists;

  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, (Checklist | Document)[]>);

  const allCategories = Array.from(
    new Set([...Object.keys(itemsByCategory), ...categories.map((c) => c.name)])
  ).sort();

  const handleItemClick = (item: Checklist | Document) => {
    if (mode === "docs") {
      setSelectedDocument(item.id);
      setSelectedChecklist(null);
    } else {
      setSelectedChecklist(item.id);
      setSelectedDocument(null);
    }
    onClose();
  };

  const isItemSelected = (item: Checklist | Document) => {
    return mode === "docs"
      ? selectedDocument === item.id
      : selectedChecklist === item.id;
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-80 bg-background border-r border-border transition-transform lg:relative lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <Logo className="h-8 w-8" />
                <span className="text-xl font-bold text-foreground">
                  Checklist
                </span>
              </Link>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1 flex-1">
                <Button
                  variant={mode === "checklists" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleModeSwitch("checklists")}
                  className="h-8 px-3 text-sm flex-1"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Lists
                </Button>
                <Button
                  variant={mode === "docs" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleModeSwitch("docs")}
                  className="h-8 px-3 text-sm flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Docs
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenCreateModal()}
                className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {allCategories.map((categoryName) => {
                const categoryItems = itemsByCategory[categoryName] || [];
                const isCollapsed = collapsedCategories.has(categoryName);
                const categoryInfo = categories.find(
                  (c) => c.name === categoryName
                );
                const hasItems = categoryItems.length > 0;

                return (
                  <div key={categoryName} className="group">
                    <div className="flex items-center gap-1 px-2 py-1">
                      <button
                        onClick={() => toggleCategory(categoryName)}
                        className="flex items-center gap-2 flex-1 text-left rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isCollapsed && "rotate-180"
                          )}
                        />
                        <Folder className="h-4 w-4" />
                        <span>{categoryName}</span>
                        <span className="text-xs">
                          ({categoryInfo?.count || 0})
                        </span>
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Quick create button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickCreate(categoryName);
                          }}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          title={`Create new ${mode === "docs" ? "document" : "checklist"
                            } in ${categoryName}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        {/* More options menu */}
                        <DropdownMenu
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              title="More options"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          }
                          align="right"
                        >
                          <DropdownMenuItem
                            onClick={() => handleRenameCategory(categoryName)}
                            icon={<Edit3 className="h-4 w-4" />}
                          >
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCategory(categoryName)}
                            icon={<Trash2 className="h-4 w-4" />}
                            variant="destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenu>
                      </div>
                    </div>

                    {!isCollapsed && hasItems && (
                      <div className="ml-4 space-y-1">
                        {categoryItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={cn(
                              "w-full text-left rounded-md px-3 py-2 text-sm transition-colors",
                              isItemSelected(item)
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground hover:bg-accent"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {mode === "docs" ? (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="truncate">{item.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenCategoryModal}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </div>
          </div>


        </div>
      </aside>

      {showDeleteCategoryModal && categoryToDelete && (
        <DeleteCategoryModal
          isOpen={showDeleteCategoryModal}
          categoryName={categoryToDelete}
          onClose={() => {
            setShowDeleteCategoryModal(false);
            setCategoryToDelete(null);
          }}
          onConfirm={handleConfirmDeleteCategory}
        />
      )}

      {showRenameCategoryModal && categoryToRename && (
        <RenameCategoryModal
          isOpen={showRenameCategoryModal}
          categoryName={categoryToRename}
          onClose={() => {
            setShowRenameCategoryModal(false);
            setCategoryToRename(null);
          }}
          onRename={handleConfirmRenameCategory}
        />
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
