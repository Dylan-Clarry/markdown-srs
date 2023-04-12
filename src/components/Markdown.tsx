import { useState, useCallback } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownView from "./MarkdownView";
import Toolbar from "~/components/Toolbar";

export default function Markdown() {
    const [docFront, setDocFront] = useState<string>(
        '```js\nconsole.log("Hello World");\n```' +
            "\n".repeat(3) +
            "---back---" +
            "\n".repeat(3) +
            "```js\nHello World\n```"
    );
    const [docBack, setDocBack] = useState<string>("");
    const [keybinding, setKeybinding] = useState<string>("standard");

    const handleDocChange = useCallback((newDoc: string) => {
        const splitDoc = newDoc.split("---back---");
        setDocFront(splitDoc[0] ? splitDoc[0] : "");
        setDocBack(splitDoc[1] ? splitDoc[1] : "");
    }, []);

    return (
        <div className="flex flex-col px-4">
            <div className="c-top-bar pt-2">
                <Toolbar setKeybinding={setKeybinding} />
            </div>
            <div className="c-markdown md:flex gap-4">
                <div className="w-full">
                    <MarkdownEditor initialDoc={docFront} onChange={handleDocChange} />
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <div className="markdown-body h-1/2 p-4">
                        <MarkdownView doc={docFront} />
                    </div>
                    <div className="markdown-body h-1/2 p-4">
                        <MarkdownView doc={docBack} />
                    </div>
                </div>
            </div>
            <div className="c-bot-bar flex justify-end">
                <button className="text-sm bg-green-600 hover:bg-green-500 rounded-md p-1 mt-3.5 mb-4">Create Card</button>
            </div>
        </div>
    );
}
