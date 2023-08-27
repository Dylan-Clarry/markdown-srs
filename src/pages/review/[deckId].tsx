import { api } from "../../utils/api";
import { useRouter } from "next/router";
import AppLayout from "~/pages/layouts/AppLayout";

export default function Review() {
    const router = useRouter();
    const deckId = router.query.deckId;
    const cardList = api.card.getCardsByDeckId.useQuery(deckId as string).data;

    if (!cardList) {
        return (
            <main className="mt-4 flex flex-col items-center">
                Error fetching cards with deckId: {deckId}
            </main>
        );
    }

    return (
        <AppLayout>
            {cardList.map((card) => {
                return <h1 key={card.id}>{card.content}</h1>;
            })}
        </AppLayout>
    );
}
