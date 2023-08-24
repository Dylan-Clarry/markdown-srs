import { useState, useCallback, useEffect, RefObject } from "react";
import MarkdownView from "./MarkdownView";
import { EditorState } from "@codemirror/state";
import useCodeMirror from "~/hooks/useCodeMirror";

interface IProps {
    keybinding: string;
    mainDoc: string;
    setMainDoc: React.Dispatch<React.SetStateAction<string>>;
}

export default function MarkdownEditorAndRenderer({ keybinding, mainDoc, setMainDoc }: IProps) {
    const [docFront, setDocFront] = useState<string>("");
    const [docBack, setDocBack] = useState<string>("");
    const handleSplitDoc = useCallback((newDoc: string) => {
        const splitDoc = newDoc.split("---back---");
        setDocFront(splitDoc[0] ? splitDoc[0] : "");
        setDocBack(splitDoc[1] ? splitDoc[1] : "");
    }, []);

    // Markdown Editor
    const handleDocChange = useCallback(
        (state: EditorState) => {
            const stringDoc = state.doc.toString();
            handleSplitDoc(stringDoc);
            setMainDoc(stringDoc);
        },
        [handleSplitDoc]
    );

    const [markdownEditor, editorView] = useCodeMirror({
        initialDoc: mainDoc,
        keybinding: keybinding,
        onChange: handleDocChange,
    });

    useEffect(() => {
        if (editorView) {
            // do nothing for now...
        }
    }, [editorView]);

    return (
        <div className="c-markdown gap-4 md:flex">
            <div className="w-full">
                <div className="w-full" ref={markdownEditor as RefObject<HTMLDivElement>}></div>
            </div>
            <div className="flex w-full flex-col gap-4">
                <MarkdownView doc={docFront} />
                <MarkdownView doc={docBack} />
            </div>
        </div>
    );
}
