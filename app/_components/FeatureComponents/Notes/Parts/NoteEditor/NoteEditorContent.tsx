import { TiptapEditor } from "@/app/_components/FeatureComponents/Notes/Parts/TipTap/TipTapEditor";
import { UnifiedMarkdownRenderer } from "@/app/_components/FeatureComponents/Notes/Parts/UnifiedMarkdownRenderer";

interface NoteEditorContentProps {
  isEditing: boolean;
  noteContent?: string;
  editorContent: string;
  onEditorContentChange: (content: string, isMarkdown: boolean) => void;
  category: string;
}

export const NoteEditorContent = ({
  isEditing,
  noteContent,
  editorContent,
  onEditorContentChange,
  category,
}: NoteEditorContentProps) => (
  <div className="flex-1 overflow-auto">
    {isEditing ? (
      <TiptapEditor
        content={editorContent}
        onChange={onEditorContentChange}
        category={category}
      />
    ) : (
      <div className="p-6">
        <UnifiedMarkdownRenderer content={noteContent || ""} />
      </div>
    )}
  </div>
);
