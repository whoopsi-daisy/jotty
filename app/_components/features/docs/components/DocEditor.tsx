// app/_components/_FeatureComponents/DocsPage/ActiveViews/DocEditor.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { TiptapEditor } from "./TipTapComponents/TipTapEditor";
import { marked } from "marked";
import TurndownService from "turndown";

import {
  ArrowLeft,
  Save,
  Edit3,
  FolderOpen,
  Trash2,
  Folder,
  Share2,
  Users,
} from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { Dropdown } from "@/app/_components/ui/elements/dropdown";
import { ShareModal } from "@/app/_components/ui/modals/sharing/ShareModal";
import { Document, Category } from "@/app/_types";
import {
  updateDocAction,
  deleteDocAction,
} from "@/app/_server/actions/data/docs-actions";

interface DocEditorProps {
  doc: Document;
  categories: Category[];
  onUpdate: () => void;
  onBack: () => void;
  onDelete?: (deletedId: string) => void;
}

export function DocEditor({
  doc,
  categories,
  onUpdate,
  onBack,
  onDelete,
}: DocEditorProps) {
  // `docContent` stores the raw Markdown from the database
  const [docContent, setDocContent] = useState(doc.content || "");
  // `editorContent` stores the HTML for Tiptap during an editing session
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState(doc.title);
  const [category, setCategory] = useState(doc.category || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const turndownService = useMemo(() => new TurndownService(), []);

  const categoryOptions = [
    { id: "", name: "Uncategorized", icon: FolderOpen },
    ...categories.map((cat) => ({
      id: cat.name,
      name: cat.name,
      icon: Folder,
    })),
  ];

  useEffect(() => {
    const markdownContent = doc.content || "";
    setDocContent(markdownContent);
    setTitle(doc.title);
    setCategory(doc.category || "");
    setEditorContent(marked.parse(markdownContent) as string);
    setIsEditing(false);
  }, [doc]);

  const handleEdit = () => {
    setEditorContent(marked.parse(docContent) as string);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const markdownOutput = turndownService.turndown(editorContent);

    const formData = new FormData();
    formData.append("id", doc.id);
    formData.append("title", title);
    formData.append("content", markdownOutput);
    formData.append("category", category || "Uncategorized");

    const result = await updateDocAction(formData);
    setIsSaving(false);

    if (result.success) {
      setDocContent(markdownOutput);
      setIsEditing(false);
      onUpdate();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(doc.title);
    setCategory(doc.category || "");
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      const formData = new FormData();
      formData.append("id", doc.id);
      formData.append("category", doc.category || "Uncategorized");
      await deleteDocAction(formData);
      onDelete?.(doc.id);
      onBack(); // Go back to docs list after deletion
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background h-full">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-10 w-10 p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-bold bg-transparent border-none outline-none focus:ring-0 text-foreground w-full"
                    placeholder="Document title..."
                  />

                  {/* Category selector */}
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <Dropdown
                      value={category}
                      options={categoryOptions}
                      onChange={setCategory}
                      className="flex-1"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-foreground truncate">
                      {title}
                    </h1>
                    {doc.isShared && (
                      <div title="Shared item">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  {category && category !== "Uncategorized" && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <FolderOpen className="h-3 w-3" />
                      <span>{category}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareModal(true)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive/80 hover:border-destructive/50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <TiptapEditor content={editorContent} onChange={setEditorContent} />
        ) : (
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-6 focus:outline-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: marked.parse(docContent) }}
          />
        )}
      </div>

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          itemId={doc.id}
          itemTitle={doc.title}
          itemType="document"
          itemCategory={doc.category}
          itemOwner={doc.owner || ""}
        />
      )}
    </div>
  );
}
