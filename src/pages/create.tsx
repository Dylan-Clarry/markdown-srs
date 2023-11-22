import { api, RouterOutputs } from "../utils/api";
import { useEffect, useState } from "react";
import AppLayout from "~/pages/layouts/AppLayout";
import MarkdownEditorAndRenderer from "../components/MarkdownEditorAndRenderer";
import AltLayout from "./layouts/AltLayout";

type Deck = RouterOutputs["deck"]["getSchema"];
type KeyBinding = NonNullable<RouterOutputs["user"]["getKeybinding"]>;

const cardTemplate =
    '```js\nconsole.log("Hello World");\n```' +
    "\n".repeat(3) +
    "---back---" +
    "\n".repeat(3) +
    "```js\nHello World\n```";

const blankCardTemplate = "\n".repeat(3) + "---back---" + "\n".repeat(3);

export default function Create() {
    const utils = api.useContext();
    const deckList = api.deck.getAll.useQuery().data;
    const [mainDoc, setMainDoc] = useState<string>(cardTemplate);
    const [keyBinding, setKeyBinding] = useState("standard");
    const [deckIdSelect, setDeckIdSelect] = useState<string>(String(deckList?.[0]?.id));
    const [resetDoc, setResetDoc] = useState<number>(0);

    const keyBindingData = api.user.getKeybinding.useQuery().data;
    useEffect(() => {
        const userKeyBinding = keyBindingData?.keyBinding;
        if (userKeyBinding) {
            setKeyBinding(userKeyBinding);
        }
    }, [keyBindingData]);

    const { mutate: createCards, isLoading: isCreatingCards } = api.card.createCards.useMutation({
        onSuccess: () => {
            utils.invalidate();
        },
    });

    const { mutate: updateKeyBinding } =
        api.user.updateKeybinding.useMutation({
            onSuccess: () => {
                utils.user.getKeybinding.invalidate();
            },
        });

    const handleCreateCards = () => {
        createCards({
            content: mainDoc,
            deckId: deckIdSelect,
            repetition: 0,
            interval: 0,
            eFactor: 0,
        });
        setMainDoc(blankCardTemplate);
        setResetDoc(resetDoc === 1 ? 0 : 1);
    };

    const handleSetKeyBinding = (e: any) => {
        const keyBindingValue = e.target.value;
        setKeyBinding(keyBindingValue);
        updateKeyBinding({
            keyBinding: keyBindingValue,
        });
    };

    if (!deckList) {
        return <main className="mt-4 flex flex-col items-center">Error fetching decklist</main>;
    }

    return (
        <AltLayout>
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
                                    value={keyBinding}
                                    className="rounded-md bg-neutral-800 p-1"
                                    onChange={handleSetKeyBinding}
                                    name="keybinding"
                                    id="keybinding"
                                >
                                    <option value="standard" key={0}>Standard</option>
                                    <option value="vim" key={1}>Vim</option>
                                    <option value="emacs" key={2}>Emacs</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <MarkdownEditorAndRenderer
                        key={resetDoc}
                        keybinding={keyBinding}
                        mainDoc={mainDoc}
                        setMainDoc={setMainDoc}
                    />
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
        </AltLayout>
    );
}
