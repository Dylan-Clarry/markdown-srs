import { api, RouterOutputs } from "../utils/api";
import { SingleRouterOutputType } from "~/types/types";

type Deck = SingleRouterOutputType<RouterOutputs["deck"]["getAll"]>;

export default function CardManager({ deckList }: { deckList: Deck[] }) {
}
