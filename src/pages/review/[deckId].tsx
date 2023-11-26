import { Prisma } from "@prisma/client";
import { api, RouterOutputs } from "../../utils/api";
import { useRouter } from "next/router";
import AltLayout from "~/pages/layouts/AltLayout";
import { useState } from "react";
import MarkdownView from "~/components/MarkdownView";
import { sm2CardData, cardData, sm2 } from "lib/sm2";
import { addDaysToCardReviewDate } from "lib/datelib";

type Deck = NonNullable<RouterOutputs["deck"]["getAll"][number]>;
type Card = NonNullable<RouterOutputs["card"]["getSchema"]>;

export default function Review() {
    const utils = api.useContext();
    const router = useRouter();
    const deckId = router.query.deckId as string;
    const cardList = api.card.getReviewCardsByDeckId.useQuery(deckId as string).data as Card[];
    const [currCardIdx, setCurrCardIdx] = useState<number>(0);
    const [isShowingFront, setIsShowingFront] = useState<boolean>(true);

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
                <div>No cards to review today.</div>
            </AltLayout>
        );
    }

    if (currCardIdx === cardList.length) {
        return (
            <AltLayout>
                <div>Review Complete.</div>
            </AltLayout>
        );
    }

    const splitDoc = cardList[currCardIdx]?.content.split("---back---");
    if (!splitDoc) {
        // I hate this... but tis necessary
        return;
    }
    const cardFront = splitDoc[0] || "";
    const cardBack = splitDoc[1] || "";
    const cardFull = cardFront + " --- " + cardBack;

    const handleGradeCard = (grade: number) => {
        const card = cardList[currCardIdx];
        if (!card) return null;

        const gradedCard = sm2(grade, card);

        gradeCard({
            id: gradedCard.id,
            repetition: gradedCard.repetition,
            interval: gradedCard.interval,
            eFactor: parseFloat(gradedCard.eFactor.toString()),
            reviewDate: gradedCard.reviewDate,
        });

        setIsShowingFront(true);

        if (gradedCard.interval === 1) {
            cardList.push(gradedCard);
        }

        if (currCardIdx < cardList.length) {
            setCurrCardIdx(currCardIdx + 1);
        }
    };

    return (
        <AltLayout>
            <div className="flex items-center justify-center">
                <div className="w-1/2 flex flex-col">
                    <div className="mt-16 h-full w-full">
                        <MarkdownView
                            optionalClass="c-markdown-review markdown-body"
                            doc={isShowingFront ? cardFront : cardFull}
                        />
                    </div>

                    <button
                        className="rounded-md mt-4 mx-auto w-1/2 bg-blue-500 px-1 pt-0.5 pb-1 text-white hover:bg-blue-600"
                        onClick={() => setIsShowingFront(!isShowingFront)}
                    >
                        Flip Card
                    </button>
                    {!isShowingFront ? (
                        <div className="mt-12 mx-auto flex gap-4">
                            <button
                                disabled={isGradingCard}
                                className="rounded-md w-32 bg-green-500 px-1 pt-0.5 pb-1 text-white hover:bg-green-600"
                                onClick={() => handleGradeCard(4)}
                            >
                                Pass - 1
                            </button>
                            <button
                                disabled={isGradingCard}
                                className="rounded-md w-32 bg-red-500 px-1 pt-0.5 pb-1 text-white hover:bg-red-600"
                                onClick={() => handleGradeCard(1)}
                            >
                                Fail - 2
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </AltLayout>
    );
}
