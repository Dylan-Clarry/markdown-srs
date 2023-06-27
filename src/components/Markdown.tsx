import { useState, useCallback } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownView from "./MarkdownView";
import MarkdownToolbar from "~/components/MarkdownToolbar";

export default function Markdown() {
    const [docFull, setDocFull] = useState<string>(
        '```js\nconsole.log("Hello World");\n```' +
            "\n".repeat(3) +
            "---back---" +
            "\n".repeat(3) +
            "```js\nHello World\n```"
    );
    const [docFront, setDocFront] = useState<string>("");
    const [docBack, setDocBack] = useState<string>("");
    const [keybinding, setKeybinding] = useState<string>("standard");

    const handleDocChange = useCallback((newDoc: string) => {
        const splitDoc = newDoc.split("---back---");
        setDocFront(splitDoc[0] ? splitDoc[0] : "");
        setDocBack(splitDoc[1] ? splitDoc[1] : "");
    }, []);

    return (
        <div className="h-full">
            <div className="flex flex-col px-4">
                <MarkdownToolbar setKeybinding={setKeybinding} />
                <div className="c-markdown gap-4 md:flex">
                    <MarkdownEditor
                        initialDoc={docFull}
                        keybinding={keybinding}
                        onChange={handleDocChange}
                    />
                    <div className="flex w-full flex-col gap-4">
                        <MarkdownView doc={docFront} />
                        <MarkdownView doc={docBack} />
                    </div>
                </div>
                <div className="c-bot-bar flex justify-end">
                    <button className="mt-3.5 mb-4 rounded-md bg-green-600 p-1 text-sm hover:bg-green-500">
                        Create Card
                    </button>
                </div>
            </div>
        </div>
    );
}
