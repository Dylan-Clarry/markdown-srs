import { api, RouterOutputs } from "../utils/api";
import { useState } from "react";
import AppLayout from "~/pages/layouts/AppLayout";
import MarkdownEditorAndRenderer from "../components/MarkdownEditorAndRenderer";

type Deck = RouterOutputs["deck"]["getSchema"];

const cardTemplate =
    '```js\nconsole.log("Hello World");\n```' +
    "\n".repeat(3) +
    "---back---" +
    "\n".repeat(3) +
    "```js\nHello World\n```";

const blankCardTemplate = "\n".repeat(3) + "---back---" + "\n".repeat(3);

export default function Create() {
    const deckList = api.deck.getAll.useQuery().data;

    if (!deckList) {
        return <main className="mt-4 flex flex-col items-center">Error fetching decklist</main>;
    }

    const [mainDoc, setMainDoc] = useState<string>(cardTemplate);
    const [keybinding, setKeybinding] = useState<string>("standard");
    const [deckIdSelect, setDeckIdSelect] = useState<string>(String(deckList[0]?.id));

    // Create Cards
    const utils = api.useContext();
    const { mutate: createCards, isLoading: isCreatingCards } = api.card.createCards.useMutation({
        onSuccess: () => {
            utils.card.getAll.invalidate();
        },
    });

    const handleCreateCards = () => {
        createCards({
            content: mainDoc,
            deckId: deckIdSelect,
        });
        setMainDoc(blankCardTemplate);
    };

    return (
        <AppLayout>
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
                    <MarkdownEditorAndRenderer
                        keybinding={keybinding}
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
        </AppLayout>
    );
}
