import React, { useState } from 'react';
import {
    Bold, Italic, List, CheckSquare, Link as LinkIcon, Eye, Edit3,
    Heading1, Heading2, Heading3, ListOrdered, Strikethrough,
    Code, SquareTerminal, Quote, CloudUpload, Check, Table, Minus
} from 'lucide-react';
import { NotePicker } from './NotePicker';
import { cn } from '../lib/utils';

interface EditorToolbarProps {
    onInsert: (text: string, cursorOffset?: number) => void;
    onWrap: (prefix: string, suffix: string, placeholder?: string) => void;
    viewMode: 'edit' | 'preview';
    setViewMode: (mode: 'edit' | 'preview') => void;
    isSaving?: boolean;
    title: string;
    onTitleChange: (newTitle: string) => void;
}

export function EditorToolbar({
    onInsert,
    onWrap,
    viewMode,
    setViewMode,
    isSaving,
    title,
    onTitleChange
}: EditorToolbarProps) {
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const StatusIndicator = () => (
        <div className="flex items-center gap-1 px-2 border-l shrink-0">
            {isSaving ? (
                <CloudUpload size={14} className="text-primary animate-pulse" />
            ) : (
                <Check size={14} className="text-green-500" />
            )}
        </div>
    );

    const tools = [
        { icon: Bold, label: 'Bold', action: () => onWrap('**', '**', 'bold') },
        { icon: Italic, label: 'Italic', action: () => onWrap('*', '*', 'italic') },
        { icon: Strikethrough, label: 'Strikethrough', action: () => onWrap('~~', '~~', 'strikethrough') },
        { icon: Heading1, label: 'H1', action: () => onInsert('# ', 0) },
        { icon: Heading2, label: 'H2', action: () => onInsert('## ', 0) },
        { icon: Heading3, label: 'H3', action: () => onInsert('### ', 0) },
        { icon: List, label: 'Bullet List', action: () => onInsert('- ', 0) },
        { icon: ListOrdered, label: 'Numbered List', action: () => onInsert('1. ', 0) },
        { icon: CheckSquare, label: 'Task List', action: () => onInsert('- [ ] ', 0) },
        { icon: Quote, label: 'Quote', action: () => onInsert('> ', 0) },
        { icon: Code, label: 'Inline Code', action: () => onWrap('`', '`', 'code') },
        { icon: SquareTerminal, label: 'Code Block', action: () => onWrap('```\n', '\n```', 'code') },
        { icon: Minus, label: 'Horizontal Rule', action: () => onInsert('\n---\n', 0) },
        { icon: Table, label: 'Table', action: () => onInsert('\n| Header | Header |\n| :--- | :--- |\n| Cell | Cell |\n', 0) },
    ];

    return (
        <div className="relative flex items-center gap-2 p-1.5 border-b bg-muted/40 h-11 min-w-0 shrink-0 z-40">
            {/* 1. Formatting Tools - Responsive Positioning */}
            <div className={cn(
                "md:flex md:items-center md:gap-0.5 md:relative md:bg-transparent md:border-none md:p-0 md:visible md:opacity-100", // Desktop: Normal
                "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t p-2 grid grid-cols-8 gap-1 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]", // Mobile: Bottom Grid
                "md:w-auto w-full shrink-0"
            )}>
                {tools.map((tool, i) => (
                    <button
                        key={i}
                        onClick={tool.action}
                        className="p-2 md:p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                        title={tool.label}
                    >
                        <tool.icon size={18} className="md:w-4 md:h-4 w-5 h-5" />
                    </button>
                ))}

                {/* Visual Divider (Desktop only) */}
                <div className="hidden md:block w-px h-4 bg-border mx-1" />

                {/* Wiki Link Button (Included in grid on mobile) */}
                <button
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                    className="p-2 md:p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center relative"
                    title="Link to Note"
                >
                    <LinkIcon size={18} className="md:w-4 md:h-4 w-5 h-5" />
                    {isPickerOpen && (
                        <div className="fixed md:absolute bottom-full mb-2 md:bottom-auto md:top-full md:mt-1 left-4 md:left-0 z-[60]">
                            <NotePicker
                                onSelect={(title) => {
                                    onInsert(`[[${title}]]`);
                                    setIsPickerOpen(false);
                                }}
                                onClose={() => setIsPickerOpen(false)}
                            />
                        </div>
                    )}
                </button>
            </div>

            {/* 2. Middle: Title Input (Always at top) */}
            <div className="flex-1 min-w-0 px-2 flex items-center">
                <input
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium border-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground/30 truncate"
                    placeholder="Note Title"
                />
                <StatusIndicator />
            </div>

            {/* 3. Right: View Toggle (Always at top) */}
            <button
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                className="p-1.5 bg-background border px-3 hover:bg-muted rounded text-foreground transition-colors flex items-center gap-2 shrink-0 md:h-8 h-7"
                title={viewMode === 'edit' ? "Switch to Preview Mode" : "Switch to Edit Mode"}
            >
                {viewMode === 'edit' ? (
                    <>
                        <Eye size={16} />
                        <span className="text-xs font-medium hidden sm:inline">View</span>
                    </>
                ) : (
                    <>
                        <Edit3 size={16} />
                        <span className="text-xs font-medium hidden sm:inline">Edit</span>
                    </>
                )}
            </button>
        </div>
    );
}
