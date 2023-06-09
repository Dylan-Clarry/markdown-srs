import { useCallback, useEffect, RefObject } from "react";
import { EditorState } from "@codemirror/state";
import useCodeMirror from "~/hooks/useCodeMirror";

interface Props {
    initialDoc: string;
    keybinding: string;
    onChange: (doc: string) => void;
}

export default function MarkdownEditor({ initialDoc, keybinding, onChange }: Props) {
    const handleDocChange = useCallback(
        (state: EditorState) => onChange(state.doc.toString()),
        [onChange]
    );

    const [refContainer, editorView] = useCodeMirror({
        initialDoc: initialDoc,
        keybinding: keybinding,
        onChange: handleDocChange,
    });

    useEffect(() => {
        if (editorView) {
            // do nothing for now...
        }
    }, [editorView]);

    return (
        <div className="w-full">
            <div className="w-full" ref={refContainer as RefObject<HTMLDivElement>}></div>
        </div>
    );
}
