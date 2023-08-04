import { api } from "../utils/api";
import AppLayout from "~/pages/layouts/AppLayout";

export default function Manage() {
    const deckList = api.deck.getAll.useQuery().data;

    if (!deckList) {
        return <main className="mt-4 flex flex-col items-center">Error fetching decklist</main>;
    }

    return (
        <AppLayout>
        </AppLayout>
    );
}
