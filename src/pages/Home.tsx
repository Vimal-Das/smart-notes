import React, { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useTabs } from '../context/TabContext';
import { useAuth } from '../context/AuthContext';
import { FirebaseSyncService } from '../services/FirebaseSyncService';

export function Home() {
    const { openTab } = useTabs();
    const { user } = useAuth();

    const recentNotes = useLiveQuery(
        () => db.notes.orderBy('updatedAt').reverse().limit(10).toArray()
    );

    useEffect(() => {
        FirebaseSyncService.sync(user);
    }, [user]);

    const createNote = async () => {
        const id = crypto.randomUUID();
        await db.notes.add({
            id,
            title: 'Untitled Note',
            content: '',
            createdAt: Date.now(),
            updatedAt: new Date().toISOString(),
            isEncrypted: false
        });
        openTab(id);
    };

    return (
        <div className="p-8 w-full overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Welcome to Notes Manager</h1>
                <button
                    onClick={createNote}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    <Plus size={20} />
                    <span>New Note</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                {recentNotes?.map(note => (
                    <Link
                        key={note.id}
                        to={`/note/${note.id}`}
                        onClick={() => openTab(note.id)}
                        className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <FileText className="text-muted-foreground" size={24} />
                        </div>
                        <h3 className="font-semibold text-lg truncate">{note.title || 'Untitled'}</h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {note.content || 'No content'}
                        </p>
                        <div className="mt-4 text-xs text-muted-foreground">
                            {new Date(note.updatedAt).toLocaleDateString()}
                        </div>
                    </Link>
                ))}

                {recentNotes?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No notes yet. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
