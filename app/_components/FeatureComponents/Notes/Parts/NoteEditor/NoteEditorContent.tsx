import { TiptapEditor } from "@/app/_components/FeatureComponents/Notes/Parts/TipTap/TipTapEditor";
import { UnifiedMarkdownRenderer } from "@/app/_components/FeatureComponents/Notes/Parts/UnifiedMarkdownRenderer";

interface NoteEditorContentProps {
  isEditing: boolean;
  noteContent?: string;
  editorContent: string;
  onEditorContentChange: (content: string, isMarkdown: boolean) => void;
}

export const NoteEditorContent = ({
  isEditing,
  noteContent,
  editorContent,
  onEditorContentChange,
}: NoteEditorContentProps) => (
  <div className="flex-1 h-full pb-14 lg:pb-0">
    {isEditing ? (
      <TiptapEditor content={editorContent} onChange={onEditorContentChange} />
    ) : (
      <div className="px-6 pt-6 pb-12">
        <UnifiedMarkdownRenderer content={noteContent || ""} />
      </div>
    )}
  </div>
);
