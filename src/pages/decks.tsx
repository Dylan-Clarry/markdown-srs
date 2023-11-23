import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { api, RouterOutputs } from "../utils/api";
import DeckOptionsModal from "../components/DeckOptionsModal";
import AltLayout from "./layouts/AltLayout";

type Deck = NonNullable<RouterOutputs["deck"]["getAll"][number]>;

export default function Decks() {
    const [newDeckName, setNewDeckName] = useState<string>("");
    const utils = api.useContext();
    const createDeck = api.deck.create.useMutation({
        onMutate: async (newEntry) => {
            utils.deck.getAllDeckNames.cancel();
            utils.deck.getAllDeckNames.setData(undefined, (prevEntries) => {
                return prevEntries ? [newEntry, ...prevEntries] : [newEntry];
            });
        },
        onSettled: async () => {
            await utils.deck.getAll.invalidate();
        },
    });

    const deckNamesAndCardCount = api.deck.getAll.useQuery().data as Deck[];

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createDeck.mutate({
            name: newDeckName,
        });
        setNewDeckName("");
    };
    return (
        <AltLayout>
            <div className="mt-8 flex h-full justify-center">
                <div className="w-1/3">
                    <h2 className="mt-3 text-lg font-bold">Decks</h2>
                    <form className="flex justify-between gap-2" onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            className="w-full rounded-md border-2 border-zinc-800 bg-neutral-900 px-1 pt-0.5 pb-1 focus:outline-none"
                            placeholder="Deck Name"
                            minLength={1}
                            maxLength={25}
                            value={newDeckName}
                            onChange={(event) => setNewDeckName(event.target.value)}
                        />
                        <button
                            type="submit"
                            className="rounded-md border-2 border-zinc-800 px-1 pt-0.5 pb-1 focus:outline-none"
                        >
                            Create
                        </button>
                    </form>
                    <ul className="mt-2">
                        {deckNamesAndCardCount?.map((deck: Deck, idx: number) => {
                            return <DecklistItem deck={deck} idx={idx} key={deck.id} />;
                        })}
                    </ul>
                </div>
            </div>
        </AltLayout>
    );
}

function DecklistItem({ deck, idx }: { deck: Deck; idx: number }) {
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
    const handleOnClose = () => setModalIsVisible(false);
    return (
        <li className="flex justify-between rounded-md py-0.5 px-0.5 hover:bg-neutral-700" key={idx}>
            <Link className="hover:cursor-pointer" href={"review/" + deck.id}>
                {deck.name}
                {deck.reviewcardcount > 0 ? (
                    <span className="ml-1 rounded-md bg-teal-500 px-1">{deck.reviewcardcount}</span>
                ) : null}
                {deck.newcardcount > 0 ? (
                    <span className="ml-1 rounded-md bg-amber-600 px-1">{deck.newcardcount}</span>
                ) : null}
            </Link>
            <div className="hover:cursor-pointer" onClick={() => setModalIsVisible(true)}>
                <FontAwesomeIcon icon={faEllipsis} />
            </div>
            <DeckOptionsModal
                onClose={handleOnClose}
                visible={modalIsVisible}
                deckName={deck.name}
                deckId={deck.id}
            />
        </li>
    );
}
