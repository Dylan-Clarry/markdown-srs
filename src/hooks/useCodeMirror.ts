import { useState, useRef, useEffect, MutableRefObject } from "react";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { indentOnInput, bracketMatching } from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { javascript } from "@codemirror/lang-javascript";
import { defaultKeymap, indentWithTab, history } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { languages } from "@codemirror/language-data";
import { vim } from "@replit/codemirror-vim";

interface Props {
    initialDoc: string;
    onChange: (state: EditorState) => void;
}

export default function useCodeMirror<T extends Element>({
    initialDoc,
    onChange,
}: Props): [MutableRefObject<T | null>, EditorView?] {
    const refContainer = useRef<T>(null);
    const [editorView, setEditorView] = useState<EditorView>();
    const userExtensionSettings = [
        vim(),
        oneDark
    ];

    useEffect(() => {
        if (!refContainer) return;
        const startState = EditorState.create({
            doc: initialDoc,
            extensions: [
                ...userExtensionSettings,
                lineNumbers(),
                highlightActiveLine(),
                highlightActiveLineGutter(),
                indentOnInput(),
                history(),
                bracketMatching(),
                keymap.of([indentWithTab]),
                markdown({
                    base: markdownLanguage,
                    codeLanguages: languages,
                    addKeymap: true,
                }),
                EditorView.lineWrapping,
                EditorView.updateListener.of((update) => {
                    if (update.changes) {
                        onChange && onChange(update.state);
                    }
                }),
            ],
        });

        const startView = new EditorView({
            state: startState,
            extensions: [basicSetup, javascript(), keymap.of(defaultKeymap)],
            parent: refContainer.current ?? undefined,
        });
        setEditorView(startView);

        return () => {
            startView.destroy();
        };
    }, [refContainer]);
    return [refContainer, editorView];
}
