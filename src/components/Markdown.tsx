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

    const handleDocChange = useCallback((newDoc: string) => {
        const splitDoc = newDoc.split("---back---");
        setDocFront(splitDoc[0] ? splitDoc[0] : "");
        setDocBack(splitDoc[1] ? splitDoc[1] : "");
    }, []);

    return (
        <div className="flex flex-col">
            <div className="c-top-bar pt-2">
                <Toolbar />
            </div>
            <div className="c-markdown md:flex gap-4">
                <div className="w-full">
                    <MarkdownEditor initialDoc={docFront} onChange={handleDocChange} />
                </div>
                <div className="w-full">
                    <div className="markdown-body h-1/2 p-4">
                        <MarkdownView doc={docFront} />
                    </div>
                    <div className="markdown-body h-1/2 p-4">
                        <MarkdownView doc={docBack} />
                    </div>
                </div>
            </div>
            <div className="c-bot-bar flex justify-end">
                <button className="">Hello</button>
            </div>
        </div>
    );
}

//        <div className="flex flex-col">
//            <div className="mt-2 ml-2 min-h-[5%]">
//                <Toolbar />
//            </div>
//            <div className="mt-4 flex">
//                <div className="c-markdown-col flex w-full gap-2 px-2">
//                    <MarkdownEditor initialDoc={docFront} onChange={handleDocChange} />
//                </div>
//                <div className="c-markdown-col flex w-full flex-col gap-2 px-2">
//                    <div className="markdown-body ml-4 p-4 min-h-[49.5%]">
//                        <MarkdownView doc={docFront} />
//                    </div>
//                    <div className="markdown-body ml-4 p-4 min-h-[49.5%]">
//                        <MarkdownView doc={docBack} />
//                    </div>
//                </div>
//            </div>
//            <button className="mb-5 mr-2 flex justify-end min-h-[5%]">Hello</button>
//        </div>
