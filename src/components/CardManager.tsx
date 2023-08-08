import { api, RouterOutputs } from "../utils/api";
import { SingleRouterOutputType } from "~/types/types";

type Deck = SingleRouterOutputType<RouterOutputs["deck"]["getAll"]>;

export default function CardManager({ deckList }: { deckList: Deck[] }) {
    const decksAndCardsList = [];
    for(let i = 0; i < deckList.length; i++) {
        const deck = deckList[i];
        const { data: cardList, isLoading } = api.card.getCardsByDeckId.useQuery(deck?.id as string);
        decksAndCardsList.push({
            deckId : deck?.id,
            deckName : deck?.name,
            cardList : cardList,
        });
    }
    console.log("decks and cards: ", decksAndCardsList);

    return (
        <div className="flex h-screen">
            <div className="h-full w-60 border-r border-neutral-800 px-4"></div>
            <div className="h-full flex-1"></div>
        </div>
    );
}
