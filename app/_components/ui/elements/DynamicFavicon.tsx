"use client";

import { useEffect } from "react";
import { useFaviconUpdate } from "@/app/_components/features/admin/hooks/useFaviconUpdate";

export function DynamicFavicon() {
  const { updateFavicons } = useFaviconUpdate();

  useEffect(() => {
    updateFavicons();
  }, [updateFavicons]);

  return null;
}
