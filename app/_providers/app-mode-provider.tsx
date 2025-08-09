"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AppMode } from "@/app/_types";

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  selectedDocument: string | null;
  setSelectedDocument: (id: string | null) => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>("checklists");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  return (
    <AppModeContext.Provider
      value={{
        mode,
        setMode,
        selectedDocument,
        setSelectedDocument,
      }}
    >
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error("useAppMode must be used within an AppModeProvider");
  }
  return context;
}
