import { useState, useCallback } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownView from "./MarkdownView";

export default function Markdown() {
    const [docFront, setDocFront] = useState<string>('```js\nconsole.log("Hello World");\n```' + "\n".repeat(10));
    const [docBack, setDocBack] = useState<string>('');

    const handleDocChange = useCallback((newDoc: string) => {
        const splitDoc = newDoc.split("---back---");
        setDocFront(splitDoc[0] ? splitDoc[0] : "");
        setDocBack(splitDoc[1] ? splitDoc[1] : "");
    }, []);

    return (
        <>
            <div className="mt-4 flex gap-2 px-2">
                <MarkdownEditor initialDoc={docFront} onChange={handleDocChange} />
                <MarkdownView doc={docFront} />
            </div>
            <div className="mt-4 flex gap-2 px-2">
                <MarkdownView doc={docBack} />
            </div>
        </>
    );
}
