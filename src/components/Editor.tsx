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
