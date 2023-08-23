import { api, RouterOutputs } from "../utils/api";
import { useState } from "react";
import CardEditor from "./CardEditor";

type Deck = RouterOutputs["deck"]["getSchema"];
type Card = RouterOutputs["card"]["getSchema"];

export default function CardManager({ deckList }: { deckList: Deck[] }) {
    const ctx = api.useContext();
    const [deckSelect, setDeckSelect] = useState<string>(deckList[0]?.id as string);
    const { data: cardList } = api.card.getAll.useQuery();

    const deckIdToCardListMap = new Map<string, Card[]>();
    const cardIdToCardMap = new Map<string, Card>();
    const initialCardSelect = deckIdToCardListMap.get(deckSelect)?.[0]?.id as string;
    const [cardIdSelect, setCardIdSelect] = useState<string>(initialCardSelect);

    if (!cardList) {
        return <h1>Error loading card data</h1>;
    }

    for (let i = 0; i < cardList.length; i++) {
        const card = cardList[i];
        if (!card) continue;
        cardIdToCardMap.set(card.id, card);

        const deckId = card.deckId;
        if (!deckIdToCardListMap.has(deckId)) {
            deckIdToCardListMap.set(deckId, []);
        }
        deckIdToCardListMap.get(deckId)?.push(card);
    }

    return (
        <div className="mt-2 flex h-screen">
            <div className="h-full w-60 border-r border-neutral-800 px-4">
                {deckList.map((deck) => (
                    <div
                        className="hover:cursor-pointer"
                        key={deck?.id}
                        onClick={() => setDeckSelect(deck?.id as string)}
                    >
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
            <div className="flex flex-1 flex-col gap-4">
                <div className="m-2 h-1/3 border border-neutral-700 p-1">
                    {deckIdToCardListMap.get(deckSelect)?.map((card: Card) => (
                        <div
                            className="hover:cursor-pointer"
                            key={card?.id}
                            onClick={() => setCardIdSelect(card?.id as string)}
                        >
                            <h1
                                className={
                                    cardIdSelect === card?.id
                                        ? "rounded-md bg-neutral-800 p-1"
                                        : "rounded-md p-1"
                                }
                                key={card?.id}
                            >
                                {card?.content}
                            </h1>
                        </div>
                    ))}
                </div>
                <div className="h-2/3">
                    {cardIdSelect ? (
                        <>
                            <CardEditor
                                key={cardIdSelect}
                                card={cardIdToCardMap.get(cardIdSelect) as Card | null}
                            />
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
