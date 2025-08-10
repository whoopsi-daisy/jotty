'use client';

import { createContext, useState } from "react";

interface ChecklistContextType {
    selectedChecklist: string | null;
    setSelectedChecklist: (checklist: string | null) => void;
}

export const ChecklistContext = createContext<ChecklistContextType>({
    selectedChecklist: null,
    setSelectedChecklist: () => { }
});

export function ChecklistProvider({ children }: { children: React.ReactNode }) {
    const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);

    return (
        <ChecklistContext.Provider value={{ selectedChecklist, setSelectedChecklist }}>
            {children}
        </ChecklistContext.Provider>
    )
}