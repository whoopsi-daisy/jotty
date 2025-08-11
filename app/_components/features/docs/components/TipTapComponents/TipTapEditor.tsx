import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { TiptapToolbar } from "./TipTapToolbar";
import { useState } from "react";
import { marked } from "marked";
import { Button } from "@/app/_components/ui/elements/button";
import { Eye, FileText } from "lucide-react";

type TiptapEditorProps = {
  content: string;
  onChange: (htmlContent: string) => void;
};

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(content);

  const lowlight = createLowlight(common);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      if (!isMarkdownMode) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none dark:prose-invert",
      },
    },
  });

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdownContent(newContent);
    onChange(newContent);
  };

  const toggleMode = () => {
    if (isMarkdownMode) {
      setIsMarkdownMode(false);
      if (editor) {
        editor.commands.setContent(marked.parse(markdownContent));
      }
    } else {
      setIsMarkdownMode(true);
      if (editor) {
        setMarkdownContent(editor.getHTML());
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-background border-b border-border px-4 py-2 flex items-center justify-between">
        <TiptapToolbar editor={editor} />
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMode}
          className="ml-2"
        >
          {isMarkdownMode ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Markdown
            </>
          )}
        </Button>
      </div>

      {isMarkdownMode ? (
        <div className="flex-1 flex">
          <div className="flex-1 p-4">
            <textarea
              value={markdownContent}
              onChange={handleMarkdownChange}
              className="w-full h-full p-4 bg-background text-foreground border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Write your markdown here..."
            />
          </div>
          <div className="flex-1 p-4 border-l border-border overflow-y-auto">
            <div
              className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: marked.parse(markdownContent) }}
            />
          </div>
        </div>
      ) : (
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
      )}
    </div>
  );
};
