import { api } from "../utils/api";
import CardCreator from "~/components/CardCreator";
import AppLayout from "~/components/AppLayout";

export default function Home() {
    const deckList = api.deck.getAll.useQuery().data;

    if (!deckList) {
        return <main className="mt-4 flex flex-col items-center">Error fetching decklist</main>;
    }

    return (
        <AppLayout>
            <CardCreator deckList={deckList} />
        </AppLayout>
    );
}
