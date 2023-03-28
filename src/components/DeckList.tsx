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
            {deckList?.map((deck, idx) => {
                return (
                    <div key={idx} className="flex justify-between">
                        <u className="mr-2">{deck.name}</u>
                        <button
                            className="rounded-md border-2 border-zinc-800 p-1 focus:outline-none"
                            onClick={() => {
                                deleteDeck.mutate({
                                    id: deck.id,
                                    name: deck.name,
                                });
                            }}
                        >
                            Delete
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
