import { api, RouterOutputs } from "../utils/api";
import { useState } from "react";
import CardEditor from "./CardEditor";

type Deck = RouterOutputs["deck"]["getSchema"];
type Card = RouterOutputs["card"]["getSchema"];

export default function CardManager({ deckList }: { deckList: Deck[] }) {
    const utils = api.useContext();
    const [deckSelect, setDeckSelect] = useState<string>(deckList[0]?.id as string);
    const { data: cardList } = api.card.getAll.useQuery();

    const cardListMap = new Map<string, Card[] | undefined>();
    const initialCardSelect = cardListMap.get(deckSelect)?.[0]?.id as string;
    const [cardIdSelect, setCardIdSelect] = useState<string | undefined>(initialCardSelect);

    const { mutate: editCard, isLoading } = api.card.edit.useMutation({
        onSuccess: () => {
            utils.card.invalidate();
        },
    });;

    if(!cardList) {
        return (
            <h1>Error loading card data</h1>
        );
    }

    for(let i = 0; i < cardList.length; i++) {
        const card = cardList[i];
        const deckId = card?.deckId;
        if(!deckId) continue;
        if(!cardListMap.has(deckId)) {
            cardListMap.set(deckId, []);
        }
        cardListMap.get(deckId)?.push(card);
    }

    const handleEditCard = () => {
        editCard({
            id: "",
            content: "",
            reviewDate: "",
        });
    };

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
            <div className="flex flex-col gap-4 flex-1">
                <div className="m-2 p-1 h-1/3 border border-neutral-700">
                    {cardListMap.get(deckSelect)?.map((card: Card) => (
                        <h1 key={card?.id}>{card?.content}</h1>
                    ))}
                </div>
                <div className="h-2/3">
                    {
                        //<CardEditor />
                    }
                </div>
            </div>
        </div>
    );
}
