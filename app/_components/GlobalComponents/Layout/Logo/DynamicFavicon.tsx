"use client";

import { useEffect } from "react";
import { useFaviconUpdate } from "@/app/_hooks/useFaviconUpdate";

export const DynamicFavicon = () => {
  const { updateFavicons } = useFaviconUpdate();

  useEffect(() => {
    updateFavicons();
  }, [updateFavicons]);

  return null;
};
