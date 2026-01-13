import React from 'react';
import { useTabs } from '../context/TabContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { X, FileText, Network } from 'lucide-react';
import { cn } from '../lib/utils';

export function TabBar() {
    const { openNoteIds, activeNoteId, setActiveTab, closeTab } = useTabs();

    // Fetch titles for all open note tabs (exclude special IDs like 'graph')
    const noteIds = openNoteIds.filter(id => id !== 'graph');
    const openNotes = useLiveQuery(
        () => db.notes.where('id').anyOf(noteIds).toArray(),
        [noteIds]
    );

    if (openNoteIds.length === 0) return null;

    return (
        <div className="flex bg-secondary/20 border-b overflow-x-auto scrollbar-hide">
            {openNoteIds.map(id => {
                const isActive = activeNoteId === id;

                if (id === 'graph') {
                    return (
                        <div
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={cn(
                                "group flex items-center min-w-[120px] max-w-[200px] px-3 py-2 text-sm border-r cursor-pointer transition-colors relative transition-all",
                                isActive
                                    ? "bg-background border-b-2 border-b-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            <Network size={14} className="mr-2 shrink-0 text-primary/70" />
                            <span className="truncate flex-1">Graph View</span>
                            <button
                                onClick={(e) => closeTab(id, e)}
                                className={cn(
                                    "ml-2 p-0.5 rounded-sm hover:bg-muted transition-opacity",
                                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    );
                }

                const note = openNotes?.find(n => n.id === id);

                return (
                    <div
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={cn(
                            "group flex items-center min-w-[120px] max-w-[200px] px-3 py-2 text-sm border-r cursor-pointer transition-colors relative",
                            isActive
                                ? "bg-background border-b-2 border-b-primary font-medium"
                                : "text-muted-foreground hover:bg-muted/50"
                        )}
                    >
                        <FileText size={14} className="mr-2 shrink-0" />
                        <span className="truncate flex-1">{note?.title || 'Untitled'}</span>
                        <button
                            onClick={(e) => closeTab(id, e)}
                            className={cn(
                                "ml-2 p-0.5 rounded-sm hover:bg-muted transition-opacity",
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}
                        >
                            <X size={12} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
