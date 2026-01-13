import React, { createContext, useContext, useState, type ReactNode, useCallback } from 'react';

interface TabContextType {
    openNoteIds: string[]; // This will store IDs like 'graph' as well as note UUIDs
    activeNoteId: string | null;
    openTab: (id: string) => void;
    closeTab: (id: string, e?: React.MouseEvent) => void;
    setActiveTab: (id: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
    const [openNoteIds, setOpenNoteIds] = useState<string[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    const openTab = useCallback((id: string) => {
        setOpenNoteIds(prev => {
            if (!prev.includes(id)) {
                return [...prev, id];
            }
            return prev;
        });
        setActiveNoteId(id);
    }, []);

    const closeTab = useCallback((id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        setOpenNoteIds(prev => {
            const newTabs = prev.filter(tabId => tabId !== id);

            // If we closed the active tab, switch to another one
            if (activeNoteId === id) {
                if (newTabs.length > 0) {
                    setActiveNoteId(newTabs[newTabs.length - 1]);
                } else {
                    setActiveNoteId(null);
                }
            }
            return newTabs;
        });
    }, [activeNoteId]);

    const setActiveTab = useCallback((id: string) => {
        setActiveNoteId(id);
    }, []);

    return (
        <TabContext.Provider value={{ openNoteIds, activeNoteId, openTab, closeTab, setActiveTab }}>
            {children}
        </TabContext.Provider>
    );
}

export function useTabs() {
    const context = useContext(TabContext);
    if (context === undefined) {
        throw new Error('useTabs must be used within a TabProvider');
    }
    return context;
}
