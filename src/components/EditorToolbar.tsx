import React, { useState } from 'react';
import { Bold, Italic, List, CheckSquare, Link as LinkIcon, Eye, Edit3, Heading1, Heading2, Quote, CloudUpload, Check } from 'lucide-react';
import { NotePicker } from './NotePicker';
import { cn } from '../lib/utils';

interface EditorToolbarProps {
    onInsert: (text: string, cursorOffset?: number) => void;
    viewMode: 'edit' | 'preview';
    setViewMode: (mode: 'edit' | 'preview') => void;
    isSaving?: boolean;
    title: string;
    onTitleChange: (newTitle: string) => void;
}

export function EditorToolbar({
    onInsert,
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
        { icon: Bold, label: 'Bold', action: () => onInsert('**bold**', 2) },
        { icon: Italic, label: 'Italic', action: () => onInsert('*italic*', 1) },
        { icon: Heading1, label: 'H1', action: () => onInsert('# ', 0) },
        { icon: Heading2, label: 'H2', action: () => onInsert('## ', 0) },
        { icon: List, label: 'List', action: () => onInsert('- ', 0) },
        { icon: CheckSquare, label: 'Task', action: () => onInsert('- [ ] ', 0) },
        { icon: Quote, label: 'Quote', action: () => onInsert('> ', 0) },
    ];

    return (
        <div className="relative flex items-center gap-2 p-1.5 border-b bg-muted/40 h-11">
            {/* Formatting Tools */}
            <div className="flex items-center gap-0.5 shrink-0">
                {tools.map((tool, i) => (
                    <button
                        key={i}
                        onClick={tool.action}
                        className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                        title={tool.label}
                    >
                        <tool.icon size={16} />
                    </button>
                ))}
                <div className="w-px h-4 bg-border mx-1" />
                <button
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                    className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Link to Note"
                >
                    <LinkIcon size={16} />
                </button>
                {isPickerOpen && (
                    <NotePicker
                        onSelect={(title) => {
                            onInsert(`[[${title}]]`);
                            setIsPickerOpen(false);
                        }}
                        onClose={() => setIsPickerOpen(false)}
                    />
                )}
            </div>

            {/* Middle: Title Input */}
            <div className="flex-1 min-w-0 px-2 flex items-center">
                <input
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium border-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground/30 truncate"
                    placeholder="Note Title"
                />
                <StatusIndicator />
            </div>

            {/* Right: View Toggle */}
            <button
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                className="p-1.5 bg-background border px-3 hover:bg-muted rounded text-foreground transition-colors flex items-center gap-2 shrink-0"
                title={viewMode === 'edit' ? "Switch to Preview Mode" : "Switch to Edit Mode"}
            >
                {viewMode === 'edit' ? (
                    <>
                        <Eye size={16} />
                        <span className="text-xs font-medium">View</span>
                    </>
                ) : (
                    <>
                        <Edit3 size={16} />
                        <span className="text-xs font-medium">Edit</span>
                    </>
                )}
            </button>
        </div>
    );
}
