"use client";

import { Copy, Check, Code } from "lucide-react";
import { useState, ReactElement } from "react";
import { Button } from "@/app/_components/GlobalComponents/Buttons/Button";
import { getLanguageByValue } from "@/app/_utils/code-block-utils";
import { cn, copyTextToClipboard } from "@/app/_utils/global-utils";

interface CodeBlockRendererProps {
  children: ReactElement;
  className?: string;
  language?: string;
  code: string;
}

export const CodeBlockRenderer = ({
  children,
  className = "",
  language: langProp,
  code,
}: CodeBlockRendererProps) => {
  const [copied, setCopied] = useState(false);

  const language =
    langProp ||
    children.props.className?.replace("language-", "") ||
    "plaintext";

  const copyToClipboard = async () => {
    const success = await copyTextToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const showHeader = language !== "plaintext";
  const languageObj = getLanguageByValue(language.replace("hljs ", ""));
  const languageIcon = languageObj?.icon || <Code className="h-4 w-4" />;
  const displayLanguage = languageObj?.label || language.replace("hljs ", "");

  return (
    <div
      className={cn(
        "relative group my-4 overflow-hidden rounded-lg bg-[#282c34]",
        className
      )}
    >
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#21252b] border-b border-[#181a1f]">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#abb2bf]">
            {languageIcon}
            <span className="uppercase tracking-wide">{displayLanguage}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="h-6 w-6 p-0 text-gray-400"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      {!showHeader && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="transition-opacity opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-400"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      <pre className="hljs !bg-transparent !p-4 !m-0 overflow-x-auto text-sm">
        {children}
      </pre>
    </div>
  );
};
