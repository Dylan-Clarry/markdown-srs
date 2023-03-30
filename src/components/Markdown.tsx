import { useState, useCallback } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownView from "./MarkdownView";

export default function Markdown() {
    const [docFront, setDocFront] = useState<string>(
        '```js\nconsole.log("Hello World");\n```'
        + "\n".repeat(3)
        + "---back---"
        + "\n".repeat(3)
        + "```js\nHello World\n```"
    );
    const [docBack, setDocBack] = useState<string>("");

    const handleDocChange = useCallback((newDoc: string) => {
        const splitDoc = newDoc.split("---back---");
        setDocFront(splitDoc[0] ? splitDoc[0] : "");
        setDocBack(splitDoc[1] ? splitDoc[1] : "");
    }, []);

    return (
        <div className="flex">
            <div className="mt-4 w-full c-markdown-col h-full flex gap-2 px-2">
                <MarkdownEditor initialDoc={docFront} onChange={handleDocChange} />
            </div>
            <div className="mt-4 w-full c-markdown-col flex flex-col gap-2 px-2">
                <MarkdownView doc={docFront} />
                <MarkdownView doc={docBack} />
            </div>
        </div>
    );
}
