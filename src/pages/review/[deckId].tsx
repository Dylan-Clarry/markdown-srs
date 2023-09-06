import { api } from "../../utils/api";
import { useRouter } from "next/router";
import AppLayout from "~/pages/layouts/AppLayout";
import { useState } from "react";
import MarkdownView from "~/components/MarkdownView";
import { sm2, cardData } from "lib/sm2";
import { addDaysToCardReviewDate } from "lib/datelib";

export default function Review() {
    const router = useRouter();
    const deckId = router.query.deckId;
    const cardList = api.card.getReviewCardsByDeckId.useQuery(deckId as string).data;
    const [currCardIdx, setCurrCardIdx] = useState<number>(0);
    const [isShowingFront, setIsShowingFront] = useState<boolean>(true);

    if (!cardList) {
        return (
            <main className="mt-4 flex flex-col items-center">
                Error fetching cards with deckId: {deckId}
            </main>
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

        if (!card) {
            return null;
        }

        const cardData: cardData = {
            repetition: card.repetition,
            interval: card.interval,
            eFactor: card.eFactor,
        };

        // grade card on algorithm
        const gradedCardData = sm2(grade, cardData);

        const newCard = addDaysToCardReviewDate(card, gradedCardData.interval);

        // add graded card data to card
        const gradedCard = {
            ...newCard,
            ...gradedCardData,
        } as cardData;

        // api call to update

        // reset isShowingFront
        setIsShowingFront(true);

        // Go to next card
        if (currCardIdx < cardList.length - 1) {
            setCurrCardIdx(currCardIdx + 1);
        }
    };

    console.log("bingo bango bongo:", currCardIdx, cardList.length);

    if (currCardIdx === cardList.length - 1) {
        return (
            <AppLayout>
                <div>Review Complete.</div>
            </AppLayout>
        );
    }

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
                            className="rounded-md bg-green-500 px-1 pt-0.5 pb-1 text-white hover:bg-green-600"
                            onClick={() => handleGradeCard(1)}
                        >
                            Pass
                        </button>
                        <button
                            className="rounded-md bg-red-500 px-1 pt-0.5 pb-1 text-white hover:bg-red-600"
                            onClick={() => handleGradeCard(4)}
                        >
                            Fail
                        </button>
                    </>
                ) : null}
            </div>
        </AppLayout>
    );
}
