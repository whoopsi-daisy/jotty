// app/_components/_FeatureComponents/DocsPage/ActiveViews/TiptapEditor.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TiptapToolbar } from "./TipTapToolbar";

type TiptapEditorProps = {
  content: string;
  onChange: (htmlContent: string) => void;
};

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false, // This fixes the SSR hydration error
    extensions: [
      StarterKit.configure({
        // Disable the built-in codeBlock to avoid conflicts if you have other plans
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // THIS IS THE KEY PART
        // Add your Tailwind `prose` classes here for instant, beautiful styling
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none dark:prose-invert",
      },
    },
  });

  return (
    <div className="flex flex-col h-full">
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  );
};
