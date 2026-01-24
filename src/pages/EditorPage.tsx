import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Editor, type EditorHandle } from '../components/Editor';
import { EditorToolbar } from '../components/EditorToolbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTabs } from '../context/TabContext';
import { useAuth } from '../context/AuthContext';
import { FirebaseSyncService } from '../services/FirebaseSyncService';

export function EditorPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const note = useLiveQuery(() => id ? db.notes.get(id) : undefined, [id]);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const editorRef = useRef<EditorHandle>(null);
    const { user } = useAuth();

    const originalTitleRef = useRef<string>('');

    useEffect(() => {
        if (id) {
            originalTitleRef.current = '';
        }
    }, [id]);

    useEffect(() => {
        if (note) {
            if (!originalTitleRef.current) {
                originalTitleRef.current = note.title;
            }
            setContent(note.content);
            setTitle(note.title);
        }
    }, [note]);

    const saveNote = useCallback(async (newContent: string, newTitle: string) => {
        if (!id) return;
        setIsSaving(true);

        if (originalTitleRef.current && newTitle !== originalTitleRef.current) {
            await db.updateNoteReferences(originalTitleRef.current, newTitle);
            originalTitleRef.current = newTitle;
        }

        const updatedAt = new Date().toISOString();
        await db.notes.update(id, {
            content: newContent,
            title: newTitle,
            updatedAt: updatedAt as any // Handling potential Dexie type mismatch during migration
        });

        // Trigger Cloud Sync
        FirebaseSyncService.sync(user);

        setIsSaving(false);
    }, [id, user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (note && (content !== note.content || title !== note.title)) {
                saveNote(content, title);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [content, title, note, saveNote]);

    const handleInsert = (text: string, offset?: number) => {
        editorRef.current?.insertText(text, offset);
    };

    const handleWrap = (prefix: string, suffix: string, placeholder?: string) => {
        editorRef.current?.wrapSelection(prefix, suffix, placeholder);
    };

    if (!id) return <div className="p-8 text-muted-foreground">Select a note to start editing</div>;
    if (!note) return <div className="p-8">Loading...</div>;

    const processedContent = content.replace(/\[\[(.*?)\]\]/g, (_, p1) => {
        return `[${p1}](#wiki-link-${encodeURIComponent(p1)})`;
    });

    const MarkdownComponents = {
        a: ({ href, children }: any) => {
            if (href?.startsWith('#wiki-link-')) {
                const linkTitle = decodeURIComponent(href.replace('#wiki-link-', ''));
                return <WikiLink title={linkTitle} />;
            }
            return (
                <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        }
    };

    return (
        <div className="flex flex-col h-full bg-background min-w-0">
            <EditorToolbar
                onInsert={handleInsert}
                onWrap={handleWrap}
                viewMode={viewMode}
                setViewMode={setViewMode}
                isSaving={isSaving}
                title={title}
                onTitleChange={(newTitle) => setTitle(newTitle)}
            />

            <div className="flex-1 overflow-auto bg-background scrollbar-thin flex flex-col pt-4 pb-24 md:pb-4">
                <div className="flex-1 w-full px-4">
                    {viewMode === 'edit' ? (
                        <Editor
                            ref={editorRef}
                            value={content}
                            onChange={(val) => setContent(val)}
                            className="h-full"
                        />
                    ) : (
                        <div className="pb-20 prose prose-slate dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:text-foreground">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={MarkdownComponents}
                            >
                                {content || '_No content yet. Click "Edit" to add some!_'}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function WikiLink({ title }: { title: string }) {
    const navigate = useNavigate();
    const note = useLiveQuery(() => db.notes.where('title').equals(title).first(), [title]);

    if (!note) {
        return <span className="text-muted-foreground italic border-b border-dotted border-muted-foreground cursor-help" title="Note not found">[[{title}]]</span>;
    }

    return (
        <button
            onClick={() => navigate(`/note/${note.id}`)}
            className="text-primary hover:underline font-medium inline-block"
        >
            {title}
        </button>
    );
}
