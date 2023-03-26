import { useState, useCallback } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownView from "./MarkdownView";

export default function Markdown() {
    const [doc, setDoc] = useState('```js\nconsole.log("Hello World");\n```' + "\n".repeat(10));

    const handleDocChange = useCallback((newDoc: string) => {
        setDoc(newDoc);
    }, []);

    return (
        <div className="flex px-2">
            <MarkdownEditor initialDoc={doc} onChange={handleDocChange} />
            <MarkdownView doc={doc} />
        </div>
    );
}
