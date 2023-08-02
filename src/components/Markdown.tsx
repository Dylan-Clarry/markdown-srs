import { useState, useCallback, useEffect, RefObject } from "react";
import MarkdownView from "./MarkdownView";
import { EditorState } from "@codemirror/state";
import useCodeMirror from "~/hooks/useCodeMirror";
import { api, RouterOutputs } from "../utils/api";
import { z } from "zod";

import { deckSchema } from "~/server/api/routers/deck";
type Deck = RouterOutputs["deck"]["getAll"][number];

const cardTemplate =
    '```js\nconsole.log("Hello World");\n```' +
    "\n".repeat(3) +
    "---back---" +
    "\n".repeat(3) +
    "```js\nHello World\n```";

interface IProps {
    deckList: Deck[];
}

export default function Markdown({ deckList }: IProps) {
    const [initialDoc] = useState<string>(cardTemplate);
    const [docFront, setDocFront] = useState<string>("");
    const [docBack, setDocBack] = useState<string>("");
    const [keybinding, setKeybinding] = useState<string>("standard");
    const [deckSelect, setDeckSelect] = useState<string>(String(deckList[0]?.id));
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
    const createCards = api.card.createCards.useMutation({
        onMutate: async () => {
        },
        onSettled: async () => {
            await utils.card.invalidate();
        },
    });

    const handleCreateCards = async () => {
        try {
            await createCards.mutateAsync({
                front: docFront,
                back: docBack,
                deckId: deckSelect,
            });
            console.log("logged create cards", docFront, docBack, deckSelect);
            console.log("Deck Id", deckSelect);
        } catch (err) {
            console.log("Error: " + err);
        }
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
                                onChange={(e) => setDeckSelect(e.target.value)}
                                name="deckselect"
                                id="deckselect"
                            >
                                {deckList?.map((deck: Deck) => {
                                    return (
                                        <option key={deck.id} value={deck.id}>
                                            {deck.name}
                                        </option>
                                    );
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
                        className="mt-3.5 mb-4 rounded-md bg-green-600 p-1 text-sm hover:bg-green-500"
                    >
                        Create Card
                    </button>
                </div>
            </div>
        </div>
    );
}
