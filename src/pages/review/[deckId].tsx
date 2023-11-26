import { Prisma } from "@prisma/client";
import { api, RouterOutputs } from "../../utils/api";
import { useRouter } from "next/router";
import AppLayout from "~/pages/layouts/AppLayout";
import { useState } from "react";
import MarkdownView from "~/components/MarkdownView";
import { sm2CardData, cardData, sm2 } from "lib/sm2";
import { addDaysToCardReviewDate } from "lib/datelib";

type Deck = NonNullable<RouterOutputs["deck"]["getAll"][number]>;
type Card = NonNullable<RouterOutputs["card"]["getSchema"]>;

export default function Review() {
    const utils = api.useContext();
    const router = useRouter();
    const deckId = router.query.deckId;
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

    if (!cardList || !deckId) {
        return (
            <main className="mt-4 flex flex-col items-center">
                Error fetching cards with deckId: {deckId}
            </main>
        );
    }

    if (cardList.length === 0) {
        return (
            <AppLayout>
                <div>No cards to review today.</div>
            </AppLayout>
        );
    }

    if (currCardIdx === cardList.length) {
        return (
            <AppLayout>
                <div>Review Complete.</div>
            </AppLayout>
        );
    }

    const deckNamesAndCardCount = api.deck.getAll.useQuery().data as Deck[];

    const splitDoc = cardList[currCardIdx]?.content.split("---back---");
    if (!splitDoc) {
        // I hate this...
        return;
    }
    const cardFront = splitDoc[0] || "";
    const cardBack = splitDoc[1] || "";

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

        if(gradedCard.interval === 1) {
            cardList.push(gradedCard);
        }

        if (currCardIdx < cardList.length) {
            setCurrCardIdx(currCardIdx + 1);
        }
    };

    return (
        <AppLayout>
            <div className="flex items-center justify-center">
                <div className="h-full w-1/2">
                    <MarkdownView optionalClass="c-markdown-review markdown-body" doc={isShowingFront ? cardFront : cardBack} />
                </div>

                <button
                    className="rounded-md bg-blue-500 px-1 pt-0.5 pb-1 text-white hover:bg-blue-600"
                    onClick={() => setIsShowingFront(!isShowingFront)}
                >
                    Flip Card
                </button>
                {!isShowingFront ? (
                    <>
                        <button
                            disabled={isGradingCard}
                            className="rounded-md bg-green-500 px-1 pt-0.5 pb-1 text-white hover:bg-green-600"
                            onClick={() => handleGradeCard(4)}
                        >
                            Pass
                        </button>
                        <button
                            disabled={isGradingCard}
                            className="rounded-md bg-red-500 px-1 pt-0.5 pb-1 text-white hover:bg-red-600"
                            onClick={() => handleGradeCard(1)}
                        >
                            Fail
                        </button>
                    </>
                ) : null}
            </div>
        </AppLayout>
    );
}
