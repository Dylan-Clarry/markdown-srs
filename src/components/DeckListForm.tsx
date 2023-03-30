import { useState } from "react";
import { api } from "../utils/api";

export default function DeckListForm() {
    const [newDeckName, setNewDeckName] = useState("");
    const utils = api.useContext();
    const createDeck = api.deck.createDeck.useMutation({
        onMutate: async (newEntry) => {
            utils.deck.getAllDeckNames.cancel();
            utils.deck.getAllDeckNames.setData(undefined, (prevEntries) => {
                return prevEntries ? [newEntry, ...prevEntries] : [newEntry];
            });
        },
        onSettled: async () => {
            await utils.deck.getAllDecks.invalidate();
        },
    });

    return (
        <form
            className="flex mt-3 gap-2 justify-between"
            onSubmit={(event) => {
                event.preventDefault();
                createDeck.mutate({
                    name: newDeckName,
                });
                setNewDeckName("");
            }}
        >
            <input
                type="text"
                className="w-full rounded-md border-2 border-zinc-800 bg-neutral-900 pt-0.5 pb-1 px-1 focus:outline-none"
                placeholder="Deck Name"
                minLength={1}
                maxLength={25}
                value={newDeckName}
                onChange={(event) => setNewDeckName(event.target.value)}
            />
            <button
                type="submit"
                className="rounded-md border-2 border-zinc-800 pt-0.5 pb-1 px-1 focus:outline-none"
            >
                Create
            </button>
        </form>
    );
}
