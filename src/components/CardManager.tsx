import { api, RouterOutputs } from "../utils/api";
import { useState } from "react";

type Deck = RouterOutputs["deck"]["getSchema"];
type Card = RouterOutputs["card"]["getSchema"];

export default function CardManager({ deckList }: { deckList: Deck[] }) {
    const [deckSelect, setDeckSelect] = useState<string>(deckList[0]?.id as string);
    //const { data: cardList } = api.card.getCardsByDeckId.useQuery(deckList.map(deck => deck?.id as string));
    const { data: cardList } = api.card.getAll.useQuery();
    const cardListMap = new Map<string, Card[] | undefined>();

    if(!cardList) {
        return (
            <h1>Error loading card data</h1>
        );
    }

    for(let i = 0; i < cardList.length; i++) {
        const card = cardList[i];
        const deckId = card?.deckId;
        if(!deckId) {
            continue;
        }
        if(!cardListMap.has(deckId)) {
            cardListMap.set(deckId, []);
        }
        cardListMap.get(deckId)?.push(card);
    }

    return (
        <div className="mt-2 flex h-screen">
            <div className="h-full w-60 border-r border-neutral-800 px-4">
                {deckList.map((deck) => (
                    <div className="hover:cursor-pointer" key={deck?.id} onClick={() => setDeckSelect(deck?.id as string)}>
                        <h1
                            className={
                                deckSelect === deck?.id
                                    ? "rounded-md bg-neutral-800 p-1"
                                    : "rounded-md p-1"
                            }
                        >
                            {deck?.name}
                        </h1>
                    </div>
                ))}
            </div>
            <div className="h-full flex-1">
                <div className="m-2 p-1 border border-neutral-700">
                    {cardListMap.get(deckSelect)?.map((card: Card) => (
                        <h1 key={card?.id}>{card?.content}</h1>
                    ))}
                </div>
            </div>
        </div>
    );
}
