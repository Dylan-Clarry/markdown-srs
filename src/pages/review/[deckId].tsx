import { Prisma } from "@prisma/client";
import { api, RouterOutputs } from "../../utils/api";
import { useRouter } from "next/router";
import AppLayout from "~/pages/layouts/AppLayout";
import { useState } from "react";
import MarkdownView from "~/components/MarkdownView";
import { sm2, cardData } from "lib/sm2";
import { addDaysToCardReviewDate } from "lib/datelib";

type Card = NonNullable<RouterOutputs["card"]["getSchema"]>;

export default function Review() {
    const utils = api.useContext();
    const router = useRouter();
    const deckId = router.query.deckId;
    const cardList = api.card.getReviewCardsByDeckId.useQuery(deckId as string).data;
    const [currCardIdx, setCurrCardIdx] = useState<number>(0);
    const [isShowingFront, setIsShowingFront] = useState<boolean>(true);

    const { mutate: gradeCard, isLoading: isGradingCard } = api.card.gradeCard.useMutation({
        onSuccess: () => {
            utils.card.getAll.invalidate();
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

        const cardData: cardData = {
            repetition: card.repetition,
            interval: card.interval,
            eFactor: parseFloat(card.eFactor.toString()),
        };

        const gradedCardData = sm2(grade, cardData);
        const newCard = addDaysToCardReviewDate(card, gradedCardData.interval);
        const gradedCard = {
            ...newCard,
            repetition: gradedCardData.repetition,
            interval: gradedCardData.interval,
            eFactor: new Prisma.Decimal(gradedCardData.eFactor),
        } as Card;

        gradeCard({
            id: gradedCard.id,
            repetition: gradedCard.repetition,
            interval: gradedCard.interval,
            eFactor: parseFloat(gradedCard.eFactor.toString()),
            reviewDate: gradedCard.reviewDate,
        });

        setIsShowingFront(true);
        if (currCardIdx < cardList.length) {
            setCurrCardIdx(currCardIdx + 1);
        }
    };

    return (
        <AppLayout>
            <div>
                <div className="h-full w-1/2">
                    <MarkdownView doc={isShowingFront ? cardFront : cardBack} />
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
