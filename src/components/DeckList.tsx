import { api } from "../utils/api";

export default function DeckList() {
    const { data: deckList, isLoading } = api.deck.getAllDecks.useQuery();
    const utils = api.useContext();
    const deleteDeck = api.deck.deleteDeck.useMutation({
        onSettled: async () => {
            await utils.deck.invalidate();
        },
    });

    if (isLoading) {
        return <div className="mt-3 flex flex-col gap-4 text-center">Fetching decks...</div>;
    }

    return (
        <div className="mt-3 flex flex-col gap-4">
            <h2>Decks</h2>
            <ul>
                {deckList?.map((deck, idx) => {
                    return (
                        <li key={idx} className="mb-2">
                            <p className="mr-2">{deck.name}</p>
                            <ul className="ml-4 pl-2 border-l border-neutral-800">
                                <li className="mt-1 hover:cursor-pointer rounded-md px-2 pt-0.5 pb-1 hover:bg-neutral-800">Create</li>
                                <li className="mt-1 hover:cursor-pointer rounded-md px-2 pt-0.5 pb-1 hover:bg-neutral-800">Manage</li>
                                <li className="mt-1 hover:cursor-pointer rounded-md px-2 pt-0.5 pb-1 hover:bg-neutral-800">
                                    <button
                                        className="hover:cursor-pointer"
                                        onClick={() => {
                                            deleteDeck.mutate({
                                                id: deck.id,
                                                name: deck.name,
                                            });
                                        }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
