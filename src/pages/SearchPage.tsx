import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Search as SearchIcon, FileText, Calendar, ArrowRight } from 'lucide-react';
import { useTabs } from '../context/TabContext';
import { cn } from '../lib/utils';

export function SearchPage() {
    const [query, setQuery] = useState('');
    const { openTab } = useTabs();
    const notes = useLiveQuery(() => db.notes.toArray());

    const filteredResults = useMemo(() => {
        if (!query.trim() || !notes) return [];

        const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 0);

        return notes.filter(note => {
            const title = (note.title || '').toLowerCase();
            const content = (note.content || '').toLowerCase();
            return searchTerms.every(term => title.includes(term) || content.includes(term));
        }).map(note => {
            // Find snippet
            const content = note.content || '';
            const lowerContent = content.toLowerCase();
            let snippet = '';
            const firstMatchIndex = lowerContent.indexOf(searchTerms[0]);

            if (firstMatchIndex !== -1) {
                const start = Math.max(0, firstMatchIndex - 40);
                const end = Math.min(content.length, firstMatchIndex + 80);
                snippet = (start > 0 ? '...' : '') + content.substring(start, end).replace(/\n/g, ' ') + (end < content.length ? '...' : '');
            } else {
                snippet = content.substring(0, 100).replace(/\n/g, ' ') + (content.length > 100 ? '...' : '');
            }

            return { ...note, snippet };
        });
    }, [query, notes]);

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden px-6 py-8 md:px-12">
            <div className="max-w-4xl w-full mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Search Notes</h1>
                    <p className="text-muted-foreground">Find anything across your entire vault.</p>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <SearchIcon size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for titles, content, or keywords..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                        className="w-full h-14 pl-12 pr-4 bg-muted/30 border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:bg-background transition-all text-lg shadow-sm"
                    />
                </div>

                <div className="space-y-4 pb-20 overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-thin pr-2">
                    {query.trim() && (
                        <div className="text-sm font-medium text-muted-foreground px-1">
                            Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
                        </div>
                    )}

                    <div className="grid gap-3">
                        {filteredResults.map(note => (
                            <button
                                key={note.id}
                                onClick={() => openTab(note.id)}
                                className="group flex flex-col p-5 bg-card border rounded-xl hover:border-primary/50 hover:shadow-md transition-all text-left relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                                    <ArrowRight size={18} />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText size={16} className="text-primary" />
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{note.title || 'Untitled Note'}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 italic mb-3">
                                    {note.snippet || 'No preview available'}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    {note.isEncrypted && (
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">Encrypted</span>
                                    )}
                                </div>
                            </button>
                        ))}

                        {query.trim() && filteredResults.length === 0 && (
                            <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                                <SearchIcon size={40} className="mx-auto text-muted/30 mb-4" />
                                <p className="text-muted-foreground">No notes found matching your search term.</p>
                            </div>
                        )}

                        {!query.trim() && (
                            <div className="text-center py-20 text-muted-foreground/60 italic">
                                Start typing to search through your notes...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
