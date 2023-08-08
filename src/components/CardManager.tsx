import { api, RouterOutputs } from "../utils/api";
import { SingleRouterOutputType } from "~/types/types";
import { useState } from "react";

type Deck = SingleRouterOutputType<RouterOutputs["deck"]["getAll"]>;
type Card = SingleRouterOutputType<RouterOutputs["card"]["getAll"]>;

export default function CardManager({ deckList }: { deckList: Deck[] }) {
    const [deckSelect, setDeckSelect] = useState<string>(deckList[0]?.id as string);

    const cardListMap = new Map<string, Card[] | undefined>();
    for (let i = 0; i < deckList.length; i++) {
        const deck = deckList[i];
        const { data: cardList } = api.card.getCardsByDeckId.useQuery(deck?.id as string);
        cardListMap.set(deck?.id as string, cardList);
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
                        <h1>{card?.front}</h1>
                    ))}
                </div>
            </div>
        </div>
    );
}
