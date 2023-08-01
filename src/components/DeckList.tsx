import { api } from "../utils/api";
import { z } from "zod";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import DeleteDeckModal from "./DeleteDeckModal";

import { deckSchema } from "~/server/api/routers/deck";
type Deck = z.infer<typeof deckSchema>;

export default function DeckList({ deckList }: { deckList: Deck[] }) {
    console.log("DeckList:", deckList);
    const [newDeckName, setNewDeckName] = useState("");
    const utils = api.useContext();
    const createDeck = api.deck.createDeck.useMutation({
        onMutate: async (newEntry) => {
            utils.deck.getAllDeckNames.cancel();
            utils.deck.getAllDeckNames.setData(undefined, (prevEntries) => {
                return prevEntries ? [newEntry, ...prevEntries] : [newEntry];
            });
        },
        onSettled: async () => {
            await utils.deck.getAllDecks.invalidate();
        },
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createDeck.mutate({
            name: newDeckName,
        });
        setNewDeckName("");
    };

    return (
        <>
            <form className="mt-3 flex justify-between gap-2" onSubmit={handleFormSubmit}>
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
            <div className="mt-3 flex flex-col gap-4">
                <ul>
                    {deckList?.map((deck: Deck, idx: number) => {
                        return <CollapsableList deck={deck} key={idx} />;
                    })}
                    <li className="mt-1 w-1/2 rounded-md bg-cyan-800 pl-1 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">
                        Manage Cards
                    </li>
                    <li className="mt-1 w-1/2 rounded-md bg-green-900 pl-1 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">
                        Create Cards+
                    </li>
                </ul>
            </div>
        </>
    );
}

function CollapsableList({ deck, key} : { deck: any; key: number }) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const handleCollapse = () => {
        setIsCollapsed((isCollapsed) => !isCollapsed);
    };
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
    const handleOnClose = () => setModalIsVisible(false);

    return (
        <li key={key} className="mb-2">
            <p className="mr-2" onClick={handleCollapse}>
                {" "}
                {deck.name} <FontAwesomeIcon icon={isCollapsed ? faChevronUp : faChevronDown} />
            </p>
            <ul
                className="ml-4 border-l border-neutral-800 pl-2"
                style={{ display: isCollapsed ? "block" : "none" }}
            >
                <li className="mt-1 rounded-md px-2 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">
                    Review
                </li>
                <li className="mt-1 rounded-md px-2 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">
                    Rename Deck
                </li>
                <li className="mt-1 rounded-md px-2 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">
                    <button
                        className="hover:cursor-pointer"
                        onClick={() => {
                            setModalIsVisible(true);
                        }}
                    >
                        Delete
                    </button>
                </li>
                <DeleteDeckModal
                    onClose={handleOnClose}
                    visible={modalIsVisible}
                    deckName={deck.name}
                    deckId={deck.id}
                />
            </ul>
        </li>
    );
}
