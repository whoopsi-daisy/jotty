"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { CodeBlockRenderer } from "./TipTapComponents/CodeBlockRenderer";
import { FileAttachment } from "@/app/_components/GlobalComponents/FormElements/FileAttachment";
import type { Components } from "react-markdown";

interface UnifiedMarkdownRendererProps {
  content: string;
  className?: string;
}

export function UnifiedMarkdownRenderer({
  content,
  className = "",
}: UnifiedMarkdownRendererProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !selectedQuote) {
      const quotes = [
        "Nothing... a whole lot of nothing.",
        "What's in the box?!",
        "Hello? Is there anybody in there?",
        "You've got nothing. I've got nothing. Let's do nothing.",
        "The journey of a thousand miles begins with a single step.",
        "Silence is golden.",
        "There's nothing to see here.",
        "Empty.",
        "Hello darkness, my old friend.",
        "I'll be back.",
        "Just start.",
        "This is not the note you are looking for.",
        "I feel like a blank canvas.",
        "Alright, alright, alright.",
        "There is no spoon.",
        "Waiting.",
        "// TODO: Add content here",
        "Error 404: Note not found.",
        "Make it so.",
        "Hello, world!",
        "The rest is still unwritten.",
        "A note about nothing.",
        "What... is your quest?",
        "Where we're going, we don't need roads.",
        "The Nothing is spreading.",
        "This page intentionally left blank.",
        "And now for something completely different.",
        "I'm sorry, Dave. I'm afraid I can't do that.",
        "Space: the final frontier.",
        "Get on with it!",
        "Are you the Keymaster?",
        "All work and no play makes Jack a dull boy.",
        "The sleeper must awaken.",
        "In the beginning...",
        "An enigma, wrapped in a riddle, inside a mystery.",
      ];
      const quoteIndex = Math.floor(Math.random() * quotes.length);
      setSelectedQuote(quotes[quoteIndex]);
    }
  }, [isClient, selectedQuote]);

  if (!content?.trim()) {
    const displayQuote = selectedQuote || "Nothing... a whole lot of nothing.";

    return (
      <div
        className={`prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl dark:prose-invert ${className}`}
      >
        <div className="text-center py-12">
          <p className="text-lg italic text-muted-foreground">
            &quot;{displayQuote}&quot;
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Start writing your note above!
          </p>
        </div>
      </div>
    );
  }

  const components: Partial<Components> = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const codeContent = String(children).replace(/\n$/, "");
      const inline = !className?.includes("language-");

      if (!inline && language) {
        return (
          <CodeBlockRenderer
            code={codeContent}
            language={language}
            showHeader={true}
            showCopyButton={true}
          />
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a({ href, children, ...props }) {
      const childText = String(children);
      const isFileAttachment = childText.startsWith("📎 ") && href;

      if (isFileAttachment) {
        const fileName = childText.substring(2);
        const isImage = href.includes("/api/image/");
        const mimeType = isImage ? "image/jpeg" : "application/octet-stream";

        return (
          <FileAttachment
            url={href}
            fileName={fileName}
            mimeType={mimeType}
            type={isImage ? "image" : "file"}
            className="my-4"
          />
        );
      }

      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
    input({ type, checked, ...props }) {
      if (type === "checkbox") {
        return (
          <input
            type="checkbox"
            checked={checked}
            disabled
            className="mr-2 cursor-default"
            {...props}
          />
        );
      }
      return <input type={type} {...props} />;
    },
    ul({ node, className, children, ...props }) {
      const isTaskList = className?.includes("contains-task-list");

      if (isTaskList) {
        return (
          <ul
            className={`list-none !pl-0 space-y-1 ${className || ""}`}
            {...props}
          >
            {children}
          </ul>
        );
      }

      return (
        <ul className={className} {...props}>
          {children}
        </ul>
      );
    },
    li({ node, className, children, ...props }) {
      const isTaskItem = className?.includes("task-list-item");

      if (isTaskItem) {
        return (
          <li
            className={`flex items-center gap-1 ${className || ""}`}
            {...props}
          >
            {children}
          </li>
        );
      }

      return (
        <li className={className} {...props}>
          {children}
        </li>
      );
    },
  };

  return (
    <div
      className={`prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl dark:prose-invert [&_ul]:list-disc [&_ol]:list-decimal [&_table]:border-collapse [&_table]:w-full [&_table]:my-4 [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_tr:nth-child(even)]:bg-muted/50 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
