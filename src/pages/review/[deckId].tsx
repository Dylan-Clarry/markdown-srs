import { api } from "../../utils/api";
import { useRouter } from "next/router";
import AppLayout from "~/pages/layouts/AppLayout";
import { useState } from "react";
import MarkdownView from "~/components/MarkdownView";
import { sm2, cardData } from "lib/sm2";

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

    const handleNextCard = () => {
        if (currCardIdx < cardList.length) {
            setCurrCardIdx(currCardIdx + 1);
        }
    };

    const handleGradeCard = (grade: number) => {
        const card = cardList[currCardIdx];
        const cardData = {};

        // grade card on algorithm
        const gradedCardData = sm2(grade, {} as cardData);

        // add graded card data to card
        const gradedCard = {
            ...card,
            ...gradedCardData,
        } as cardData;

        // api call to update

        // Go to next card
        handleNextCard();
    };

    return (
        <AppLayout>
            <div>
                <div className="w-1/2 h-full">
                    <MarkdownView doc={isShowingFront ? cardFront : cardBack} />
                </div>

                <button
                    className="rounded-md bg-green-500 px-1 pt-0.5 pb-1 text-white hover:bg-green-600"
                    onClick={() => setIsShowingFront(!isShowingFront)}
                >
                    Flip Card
                </button>
                <button
                    className="rounded-md bg-blue-500 px-1 pt-0.5 pb-1 text-white hover:bg-blue-600"
                    onClick={handleNextCard}
                >
                    Next Card
                </button>
            </div>
        </AppLayout>
    );
}
