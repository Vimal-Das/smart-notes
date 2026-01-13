import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Search, FileText, X } from 'lucide-react';

interface NotePickerProps {
    onSelect: (noteTitle: string) => void;
    onClose: () => void;
}

export function NotePicker({ onSelect, onClose }: NotePickerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const notes = useLiveQuery(
        () => db.notes
            .where('title')
            .startsWithIgnoreCase(searchTerm)
            .limit(10)
            .toArray(),
        [searchTerm]
    );

    return (
        <div className="absolute top-12 left-0 z-50 w-64 bg-popover text-popover-foreground border rounded-md shadow-lg p-2">
            <div className="flex items-center gap-2 mb-2 p-1 border-b">
                <Search size={14} className="text-muted-foreground" />
                <input
                    autoFocus
                    className="bg-transparent text-sm border-none focus:ring-0 w-full outline-none"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={onClose} className="hover:text-foreground text-muted-foreground">
                    <X size={14} />
                </button>
            </div>
            <div className="max-h-48 overflow-y-auto">
                {notes?.map(note => (
                    <button
                        key={note.id}
                        onClick={() => onSelect(note.title)}
                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded flex items-center gap-2"
                    >
                        <FileText size={14} className="text-muted-foreground" />
                        <span className="truncate">{note.title || 'Untitled'}</span>
                    </button>
                ))}
                {notes?.length === 0 && (
                    <div className="text-xs text-muted-foreground p-2">No notes found</div>
                )}
            </div>
        </div>
    );
}
