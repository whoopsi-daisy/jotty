"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Code } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/_components/GlobalComponents/Buttons/Button";
import {
  languageIcons,
  getLanguageFromCode,
} from "@/app/_utils/markdown-utils";
import { cn } from "@/app/_utils/global-utils";

interface CodeBlockRendererProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlockRenderer = ({
  code,
  language,
  className = "",
}: CodeBlockRendererProps) => {
  const [copied, setCopied] = useState(false);
  const detectedLanguage =
    language === "text" || !language ? getLanguageFromCode(code) : language;

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const showHeader = detectedLanguage !== "text";

  return (
    <div
      className={cn("relative group my-4 overflow-hidden", className)}
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {showHeader && (
        <div
          className="flex items-center justify-between px-3 py-1"
          style={{
            backgroundColor: "#1a202c",
            borderBottom: "1px solid #4a5568",
          }}
        >
          <div />
          <div
            className="flex items-center gap-1.5 text-xs font-mono"
            style={{ color: "#a0aec0" }}
          >
            {languageIcons[detectedLanguage] || <Code className="h-3 w-3" />}
            <span className="uppercase tracking-wide">{detectedLanguage}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className={cn("opacity-50 hover:opacity-100 h-5 w-5 p-0")}
            style={{ color: "#a0aec0" }}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      <div className="relative">
        {!showHeader && (
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className={cn(
              "transition-opacity",
              "absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
            )}
            style={{ color: "#a0aec0" }}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* @ts-ignore - react-syntax-highlighter has type issues with modern React/Next.js */}
        <SyntaxHighlighter
          language={detectedLanguage}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: "0.875rem",
            background: "transparent",
            padding: "0.75rem",
            border: "none",
          }}
          codeTagProps={{
            style: {
              background: "transparent",
              fontFamily: "var(--font-geist-mono)",
            },
          }}
          PreTag={({ children, ...props }) => (
            <pre
              {...props}
              style={{ ...props.style, background: "transparent" }}
            >
              {children}
            </pre>
          )}
          showLineNumbers={false}
          wrapLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
