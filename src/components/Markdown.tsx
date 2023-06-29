import { useState, useCallback } from "react";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownView from "./MarkdownView";

interface IDeck {
    id: string;
    name: string;
}

export default function Markdown(props: { data: any }) {
    const deckTemplate =
        '```js\nconsole.log("Hello World");\n```' +
        "\n".repeat(3) +
        "---back---" +
        "\n".repeat(3) +
        "```js\nHello World\n```";
    const { data: deckList } = props.data;

    const [docFull] = useState<string>(deckTemplate);
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
                <div className="c-top-bar pt-2">
                    <div className="flex justify-between">
                        <div>
                            <span className="pr-1">Deck:</span>
                            <select
                                className="rounded-md bg-neutral-800 p-1"
                                onChange={(e) => setKeybinding(e.target.value)}
                                name="deckselect"
                                id="deckselect"
                            >
                                {deckList?.map((deck: IDeck) => {
                                    return <option value="standard">{deck.name}</option>;
                                })}
                            </select>
                        </div>
                        <div>
                            <select
                                className="rounded-md bg-neutral-800 p-1"
                                onChange={(e) => setKeybinding(e.target.value)}
                                defaultValue="standard"
                                name="keybinding"
                                id="keybinding"
                            >
                                <option value="standard">Standard</option>
                                <option value="vim">Vim</option>
                                <option value="emacs">Emacs</option>
                            </select>
                        </div>
                    </div>
                </div>
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
