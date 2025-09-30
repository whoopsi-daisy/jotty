"use client";

import { useEffect } from "react";
import { useFaviconUpdate } from "@/app/_hooks/useFaviconUpdate";

export function DynamicFavicon() {
  const { updateFavicons } = useFaviconUpdate();

  useEffect(() => {
    updateFavicons();
  }, [updateFavicons]);

  return null;
}
