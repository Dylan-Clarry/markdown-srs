import { useState, useCallback } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownView from "./MarkdownView";

export default function Markdown() {
    const [docFront, setDocFront] = useState<string>(
        '```js\nconsole.log("Hello World");\n```' +
            "\n".repeat(3) +
            "---back---" +
            "\n".repeat(3) +
            "```js\nHello World\n```"
    );
    const [docBack, setDocBack] = useState<string>("");

    const handleDocChange = useCallback((newDoc: string) => {
        const splitDoc = newDoc.split("---back---");
        setDocFront(splitDoc[0] ? splitDoc[0] : "");
        setDocBack(splitDoc[1] ? splitDoc[1] : "");
    }, []);

    return (
        <div className="mt-4 flex">
            <div className="c-markdown-col flex w-full gap-2 px-2">
                <MarkdownEditor initialDoc={docFront} onChange={handleDocChange} />
            </div>
            <div className="c-markdown-col flex w-full flex-col gap-2 px-2">
                <MarkdownView doc={docFront} />
                <MarkdownView doc={docBack} />
            </div>
        </div>
    );
}
