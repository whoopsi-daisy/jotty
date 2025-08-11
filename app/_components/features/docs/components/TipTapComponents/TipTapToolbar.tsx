import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  List,
  Quote,
  Link as LinkIcon,
  Square,
} from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";

type ToolbarProps = {
  editor: Editor | null;
};

export const TiptapToolbar = ({ editor }: ToolbarProps) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const setCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock({ language: "javascript" }).run();
  };

  return (
    <div className="bg-background px-4 py-2 flex items-center gap-1 flex-wrap">
      <Button
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("strike") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("code") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
        size="sm"
        onClick={setCodeBlock}
      >
        <Square className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        variant={
          editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
        }
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("link") ? "secondary" : "ghost"}
        size="sm"
        onClick={setLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
