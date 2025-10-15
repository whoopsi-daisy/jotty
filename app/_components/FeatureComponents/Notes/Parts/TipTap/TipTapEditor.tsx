import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { TiptapToolbar } from "@/app/_components/FeatureComponents/Notes/Parts/TipTap/TipTapToolbar";
import { FileAttachmentExtension } from "@/app/_components/FeatureComponents/Notes/Parts/FileAttachment/FileAttachmentExtension";
import { CodeBlockNodeView } from "@/app/_components/FeatureComponents/Notes/Parts/CodeBlock/CodeBlockNodeView";
import { useState, useEffect, useRef } from "react";
import { InputRule } from "@tiptap/core";
import {
  convertMarkdownToHtml,
  convertHtmlToMarkdownUnified,
} from "@/app/_utils/markdown-utils";

import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";

const lowlight = createLowlight();

lowlight.register("javascript", javascript);
lowlight.register("js", javascript);
lowlight.register("typescript", typescript);
lowlight.register("ts", typescript);
lowlight.register("python", python);
lowlight.register("py", python);
lowlight.register("css", css);
lowlight.register("html", html);
lowlight.register("sql", sql);
lowlight.register("bash", bash);

type TiptapEditorProps = {
  content: string;
  onChange: (content: string, isMarkdownMode: boolean) => void;
};

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(content);
  const isInitialized = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        bulletList: {
          HTMLAttributes: {
            class: "list-disc",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "list-item",
          },
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockNodeView);
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }).extend({
        addInputRules() {
          return [
            new InputRule({
              find: /\[([^\]]+)\]\(([^)]+)\)/,
              handler: ({ state, range, match }) => {
                const { tr } = state;
                const start = range.from;
                const end = range.to;
                const text = match[1];
                const href = match[2];

                tr.replaceWith(
                  start,
                  end,
                  state.schema.text(text, [
                    state.schema.marks.link.create({ href }),
                  ])
                );
              },
            }),
          ];
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      FileAttachmentExtension.configure({
        HTMLAttributes: {
          class: "file-attachment",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-0",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border px-3 py-2",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border px-3 py-2 bg-muted font-semibold",
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      if (!isMarkdownMode) {
        onChange(editor.getHTML(), false);
      }
    },
    editorProps: {
      attributes: {
        class: "text-foreground m-5 focus:outline-none",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter") {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;

          if ($from.parent.type.name === "listItem") {
            const isEmpty = $from.parent.content.size === 0;
            if (isEmpty) {
              event.preventDefault();
              const tr = state.tr.setBlockType(
                $from.pos,
                $from.pos,
                state.schema.nodes.paragraph
              );
              view.dispatch(tr);
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && !isInitialized.current) {
      isInitialized.current = true;
      setTimeout(() => {
        editor.commands.setContent(content);
      }, 0);
    }
  }, [editor, content]);

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdownContent(newContent);
    onChange(newContent, true);
  };

  const toggleMode = () => {
    if (isMarkdownMode) {
      setIsMarkdownMode(false);
      if (editor) {
        const htmlContent = convertMarkdownToHtml(markdownContent);
        editor.commands.setContent(htmlContent);
      }
    } else {
      setIsMarkdownMode(true);
      if (editor) {
        const htmlContent = editor.getHTML();
        const markdownOutput = convertHtmlToMarkdownUnified(htmlContent);
        setMarkdownContent(markdownOutput);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-background border-b border-border px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <TiptapToolbar
          editor={editor}
          isMarkdownMode={isMarkdownMode}
          toggleMode={toggleMode}
        />
      </div>

      {isMarkdownMode ? (
        <div className="flex-1 p-4 overflow-y-auto h-full">
          <textarea
            value={markdownContent}
            onChange={handleMarkdownChange}
            className="w-full h-full p-4 bg-background text-foreground border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Write your markdown here..."
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="h-full" />
        </div>
      )}
    </div>
  );
};
