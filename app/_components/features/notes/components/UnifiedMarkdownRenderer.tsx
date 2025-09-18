"use client";

import { useMemo, useEffect } from "react";
import { marked } from "marked";
import { CodeBlockRenderer } from "./TipTapComponents/CodeBlockRenderer";

interface UnifiedMarkdownRendererProps {
  content: string;
  className?: string;
}

export function UnifiedMarkdownRenderer({
  content,
  className = "",
}: UnifiedMarkdownRendererProps) {
  useEffect(() => {
    const addHeadingIds = () => {
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      headings.forEach((heading) => {
        if (!heading.id) {
          const text = heading.textContent || "";
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          heading.id = id;
        }
      });
    };

    const timeoutId = setTimeout(addHeadingIds, 100);
    return () => clearTimeout(timeoutId);
  }, [content]);

  const parsedContent = useMemo(() => {
    if (!content?.trim()) return [];

    // More robust regex that handles different line endings and whitespace
    const codeBlockRegex = /```(\w*)\r?\n([\s\S]*?)```/g;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const beforeCode = content.slice(lastIndex, match.index);
        if (beforeCode.trim()) {
          parts.push(
            <div
              key={`text-${keyCounter++}`}
              dangerouslySetInnerHTML={{
                __html: marked.parse(beforeCode, { breaks: true, gfm: true }),
              }}
            />
          );
        }
      }

      const language = match[1] || "";
      const code = match[2];
      parts.push(
        <CodeBlockRenderer
          key={`code-${keyCounter++}`}
          code={code}
          language={language}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const remaining = content.slice(lastIndex);
      if (remaining.trim()) {
        parts.push(
          <div
            key={`text-${keyCounter++}`}
            dangerouslySetInnerHTML={{
              __html: marked.parse(remaining, { breaks: true, gfm: true }),
            }}
          />
        );
      }
    }

    if (parts.length === 0) {
      parts.push(
        <div
          key="full-content"
          dangerouslySetInnerHTML={{
            __html: marked.parse(content, { breaks: true, gfm: true }),
          }}
        />
      );
    }

    return parts;
  }, [content]);

  const nerdyQuotes = [
    // --- Original Quotes ---
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

  return (
    <div
      className={`prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl dark:prose-invert [&_ul]:list-disc [&_ol]:list-decimal ${className}`}
    >
      {parsedContent}
    </div>
  );
}
