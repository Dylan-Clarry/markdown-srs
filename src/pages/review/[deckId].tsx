import { api, RouterOutputs } from "../../utils/api";
import { useRouter } from "next/router";
import AltLayout from "~/pages/layouts/AltLayout";
import { useEffect, useState } from "react";
import MarkdownView from "~/components/MarkdownView";
import { sm2 } from "lib/sm2";

type Card = NonNullable<RouterOutputs["card"]["getSchema"]>;

export default function Review() {
    const utils = api.useContext();
    const router = useRouter();
    const deckId = router.query.deckId as string;
    const cardList = api.card.getReviewCardsByDeckId.useQuery(deckId as string).data as Card[];
    const [currCardIdx, setCurrCardIdx] = useState<number>(0);
    const [isShowingFront, setIsShowingFront] = useState<boolean>(true);
    const [reviewCount, setReviewCount] = useState<number>(0);
    const [newCount, setNewCount] = useState<number>(0);

    const { mutate: gradeCard, isLoading: isGradingCard } = api.card.gradeCard.useMutation({
        onSuccess: () => {
            // This line invalidates the entire router instead of just a single query
            // This allows the card count on the sidebar next to the deck to update while reviewing
            //utils.invalidate();
            utils.card.getAll.invalidate();
            utils.deck.invalidate();
        },
    });

    console.log("deck: ", deckId);
    const deckNameAndCardCount = api.deck.getById.useQuery({ id: deckId }).data;
    useEffect(() => {
        setReviewCount(deckNameAndCardCount?.reviewcardcount || 0);
        setNewCount(deckNameAndCardCount?.newcardcount || 0);
    }, []);
    console.log("deck: ", deckNameAndCardCount);

    if (!cardList || !deckId) {
        return (
            <main className="mt-4 flex flex-col items-center">
                Error fetching cards with deckId: {deckId}
            </main>
        );
    }

    if (cardList.length === 0) {
        return (
            <AltLayout>
                <div className="flex mt-12 text-lg justify-center">No cards to review today.</div>
            </AltLayout>
        );
    }

    if (currCardIdx === cardList.length) {
        return (
            <AltLayout>
                <div className="flex mt-12 text-lg justify-center">Review Complete.</div>
            </AltLayout>
        );
    }

    const currCard = cardList[0];

    const splitDoc = currCard?.content.split("---back---");
    if (!splitDoc) {
        // I hate this... but tis necessary
        return;
    }
    const cardFront = splitDoc[0] || "";
    const cardBack = splitDoc[1] || "";
    const cardFull = cardFront + " --- " + cardBack;

    const handleGradeCard = (grade: number) => {
        const card = currCard;
        if (!card) return null;

        const gradedCard = sm2(grade, card);

        gradeCard({
            id: gradedCard.id,
            repetition: gradedCard.repetition,
            interval: gradedCard.interval,
            eFactor: parseFloat(gradedCard.eFactor.toString()),
            reviewDate: gradedCard.reviewDate,
        });

        cardList.shift();
        setIsShowingFront(true);

        if (gradedCard.interval === 1 || grade === 1) {
            cardList.push(gradedCard);
        }
    };

    return (
        <AltLayout>
            <div className="flex items-center justify-center">
                <div className="flex w-1/2 flex-col">
                    <div className="mt-16 h-full w-full">
                        <div className="mb-2 flex w-full justify-between">
                            <h1 className="text-lg">{deckNameAndCardCount?.name}</h1>
                            <div className="text-lg">
                                {reviewCount > 0 ? (
                                    <span className="ml-1 rounded-md bg-blue-500 px-1">
                                        {reviewCount}
                                    </span>
                                ) : null}
                                {newCount > 0 ? (
                                    <span className="ml-1 rounded-md bg-green-500 px-1">
                                        {newCount}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                        <MarkdownView
                            optionalClass="c-markdown-review markdown-body"
                            doc={isShowingFront ? cardFront : cardFull}
                        />
                    </div>

                    <button
                        className="mx-auto mt-4 w-1/2 rounded-md bg-blue-500 px-1 pt-0.5 pb-1 text-white hover:bg-blue-600"
                        onClick={() => setIsShowingFront(!isShowingFront)}
                    >
                        Flip Card
                    </button>
                    {!isShowingFront ? (
                        <div className="mx-auto mt-12 flex gap-4">
                            <button
                                disabled={isGradingCard}
                                className="w-32 rounded-md bg-green-500 px-1 pt-0.5 pb-1 text-white hover:bg-green-600"
                                onClick={() => handleGradeCard(4)}
                            >
                                Pass - 1
                            </button>
                            <button
                                disabled={isGradingCard}
                                className="w-32 rounded-md bg-red-500 px-1 pt-0.5 pb-1 text-white hover:bg-red-600"
                                onClick={() => handleGradeCard(1)}
                            >
                                Fail - 2
                            </button>
                        </div>
                    ) : null}
                </div>
                <div className="flex flex-col gap-4">
                    {cardList.map((card, idx) => (
                        <div key={card.id}>
                            {idx === currCardIdx ? (
                                <span className="text-green-500">{"->"}</span>
                            ) : null}{card.content}
                        </div>
                    ))}
                </div>
            </div>
        </AltLayout>
    );
}
