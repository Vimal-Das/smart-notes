import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export interface EditorHandle {
    insertText: (text: string, cursorOffset?: number) => void;
    wrapSelection: (prefix: string, suffix: string, placeholder?: string) => void;
    focus: () => void;
}

export const Editor = forwardRef<EditorHandle, EditorProps>(({ value, onChange, className }, ref) => {
    const editorRef = useRef<ReactCodeMirrorRef>(null);

    useImperativeHandle(ref, () => ({
        insertText: (text: string, cursorOffset: number = 0) => {
            const view = editorRef.current?.view;
            if (!view) return;

            const { from, to } = view.state.selection.main;
            view.dispatch({
                changes: { from, to, insert: text },
                selection: { anchor: from + text.length - cursorOffset },
                scrollIntoView: true,
            });
            view.focus();
        },
        wrapSelection: (prefix: string, suffix: string, placeholder: string = 'text') => {
            const view = editorRef.current?.view;
            if (!view) return;

            const { from, to } = view.state.selection.main;
            const selectedText = view.state.sliceDoc(from, to);

            if (from !== to) {
                // If text is selected, wrap it
                const newText = `${prefix}${selectedText}${suffix}`;
                view.dispatch({
                    changes: { from, to, insert: newText },
                    selection: { anchor: from + prefix.length, head: from + prefix.length + selectedText.length },
                    scrollIntoView: true,
                });
            } else {
                // If no text is selected, insert placeholder
                const newText = `${prefix}${placeholder}${suffix}`;
                view.dispatch({
                    changes: { from, to, insert: newText },
                    selection: { anchor: from + prefix.length, head: from + prefix.length + placeholder.length },
                    scrollIntoView: true,
                });
            }
            view.focus();
        },
        focus: () => {
            editorRef.current?.view?.focus();
        }
    }));

    return (
        <div className={className}>
            <CodeMirror
                ref={editorRef}
                value={value}
                height="100%"
                extensions={[markdown({ base: markdownLanguage })]}
                onChange={onChange}
                theme={oneDark}
                className="h-full text-base"
                basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                    highlightActiveLine: false,
                }}
            />
        </div>
    );
});

Editor.displayName = 'Editor';
