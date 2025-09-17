"use client";

import { useMemo } from "react";
import { marked } from "marked";
import { CodeBlockRenderer } from "./TipTapComponents/CodeBlockRenderer";

interface UnifiedMarkdownRendererProps {
    content: string;
    className?: string;
}

export function UnifiedMarkdownRenderer({
    content,
    className = ""
}: UnifiedMarkdownRendererProps) {
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

            const language = match[1] || '';
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

        // If no parts were created (no code blocks found), render the entire content as markdown
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

    if (!content?.trim()) {
        return (
            <div className={`prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl dark:prose-invert ${className}`}>
                <p className="text-muted-foreground italic">No content to display.</p>
            </div>
        );
    }

    return (
        <div className={`prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl dark:prose-invert [&_ul]:list-disc [&_ol]:list-decimal ${className}`}>
            {parsedContent}
        </div>
    );
}
