import { useState, useCallback, useEffect, RefObject } from "react";
import MarkdownView from "./MarkdownView";
import { EditorState } from "@codemirror/state";
import useCodeMirror from "~/hooks/useCodeMirror";
import { api, RouterOutputs } from "../utils/api";

type Deck = RouterOutputs["deck"]["getSchema"];

const cardTemplate =
    '```js\nconsole.log("Hello World");\n```' +
    "\n".repeat(3) +
    "---back---" +
    "\n".repeat(3) +
    "```js\nHello World\n```";

const blankCardTemplate = "\n".repeat(3) + "---back---" + "\n".repeat(3);

export default function CardCreator({ deckList }: { deckList: Deck[] }) {
    const [initialDoc, setInitialDoc] = useState<string>(cardTemplate);
    const [docFront, setDocFront] = useState<string>("");
    const [docBack, setDocBack] = useState<string>("");
    const [keybinding, setKeybinding] = useState<string>("standard");
    const [deckIdSelect, setDeckIdSelect] = useState<string>(String(deckList[0]?.id));
    const handleSplitDoc = useCallback((newDoc: string) => {
        const splitDoc = newDoc.split("---back---");
        setDocFront(splitDoc[0] ? splitDoc[0] : "");
        setDocBack(splitDoc[1] ? splitDoc[1] : "");
    }, []);

    // Markdown Editor
    const handleDocChange = useCallback(
        (state: EditorState) => handleSplitDoc(state.doc.toString()),
        [handleSplitDoc]
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

    // Create Cards
    const utils = api.useContext();
    const { mutate: createCards, isLoading: isCreatingCards } = api.card.createCards.useMutation({
        onSuccess: () => {
            setInitialDoc(blankCardTemplate);
            console.log("It did the thing");
            utils.card.getAll.invalidate();
        },
    });

    const handleCreateCards = () => {
        createCards({
            front: docFront,
            back: docBack,
            deckId: deckIdSelect,
        });
    };

    return (
        <div className="h-full">
            <div className="flex flex-col px-4">
                <div className="c-top-bar pt-2">
                    <div className="flex justify-between">
                        <div>
                            <span className="pr-1">Deck:</span>
                            <select
                                className="rounded-md bg-neutral-800 p-1"
                                onChange={(e) => setDeckIdSelect(e.target.value)}
                                name="deckselect"
                                id="deckselect"
                            >
                                {deckList ? (
                                    deckList.map((deck: Deck) => (
                                        <option key={deck?.id} value={deck?.id}>
                                            {deck?.name}
                                        </option>
                                    ))
                                ) : (
                                    <option>Loading Decks...</option>
                                )}
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
                    <div className="w-full">
                        <div
                            className="w-full"
                            ref={refContainer as RefObject<HTMLDivElement>}
                        ></div>
                    </div>
                    <div className="flex w-full flex-col gap-4">
                        <MarkdownView doc={docFront} />
                        <MarkdownView doc={docBack} />
                    </div>
                </div>
                <div className="c-bot-bar flex justify-end">
                    <button
                        onClick={handleCreateCards}
                        disabled={isCreatingCards}
                        className="mt-3.5 mb-4 rounded-md bg-green-600 p-1 text-sm hover:bg-green-500"
                    >
                        Create Card
                    </button>
                </div>
            </div>
        </div>
    );
}
