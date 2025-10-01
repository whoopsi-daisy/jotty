"use client";

import { useState, useEffect, useRef } from "react";
import { findMatchingEmoji } from "@/app/_utils/emoji-utils";

interface EmojiCache {
  [key: string]: string;
}

let globalEmojiCache: EmojiCache = {};

export const useEmojiCache = (text: string, showEmojis: boolean) => {
  const [emoji, setEmoji] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!showEmojis || !text.trim()) {
      setEmoji("");
      return;
    }

    if (globalEmojiCache[text]) {
      setEmoji(globalEmojiCache[text]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await findMatchingEmoji(text);
        globalEmojiCache[text] = result;
        setEmoji(result);
      } catch (error) {
        console.warn("Error finding emoji:", error);
        setEmoji("");
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, showEmojis]);

  return emoji;
};
