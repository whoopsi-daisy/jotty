import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import BulletList from "@tiptap/extension-bullet-list";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { TiptapToolbar } from "@/app/_components/FeatureComponents/Notes/Parts/TipTap/TipTapToolbar";
import { FileAttachmentExtension } from "@/app/_components/FeatureComponents/Notes/Parts/FileAttachment/FileAttachmentExtension";
import { CodeBlockNodeView } from "@/app/_components/FeatureComponents/Notes/Parts/CodeBlock/CodeBlockNodeView";
import { useState, useEffect, useRef, useCallback } from "react";
import { InputRule } from "@tiptap/core";
import {
  convertMarkdownToHtml,
  convertHtmlToMarkdownUnified,
} from "@/app/_utils/markdown-utils";
import { lowlight } from "@/app/_utils/lowlight-utils";

type TiptapEditorProps = {
  content: string;
  onChange: (content: string, isMarkdownMode: boolean) => void;
};

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(content);
  const isInitialized = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedOnChange = useCallback(
    (newContent: string, isMarkdown: boolean) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        onChange(newContent, isMarkdown);
      }, 0);
    },
    [onChange]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: false,
        listItem: false,
        bulletList: false,
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal",
          },
        },
      }),
      BulletList.extend({
        parseHTML() {
          return [{ tag: 'ul:not([data-type="taskList"])' }];
        },
      }).configure({
        HTMLAttributes: {
          class: "list-disc",
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
      ListItem.extend({
        content: "paragraph",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      if (!isMarkdownMode) {
        debouncedOnChange(editor.getHTML(), false);
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

          if (
            $from.parent.type.name === "listItem" ||
            $from.parent.type.name === "taskItem"
          ) {
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
        const htmlContent = convertMarkdownToHtml(content);
        editor.commands.setContent(htmlContent);
      }, 0);
    }
  }, [editor, content]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdownContent(newContent);
    debouncedOnChange(newContent, true);
  };

  const toggleMode = () => {
    if (isMarkdownMode) {
      setTimeout(() => {
        if (editor) {
          const htmlContent = convertMarkdownToHtml(markdownContent);
          editor.commands.setContent(htmlContent, { emitUpdate: false });
          setIsMarkdownMode(false);
        }
      }, 0);
    } else {
      setTimeout(() => {
        if (editor) {
          const htmlContent = editor.getHTML();
          const markdownOutput = convertHtmlToMarkdownUnified(htmlContent);
          setMarkdownContent(markdownOutput);
          setIsMarkdownMode(true);
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-background border-b border-border px-4 py-2 flex items-center justify-between sticky top-0 z-50">
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
