import { useState } from "react";
import { api, RouterOutputs } from "../utils/api";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import DeleteDeckModal from "./DeleteDeckModal";
import DeckOptionsModal from "./DeckOptionsModal";

type Deck = NonNullable<RouterOutputs["deck"]["getAll"][number]>;

export default function SideBar({ deckList }: { deckList: Deck[] }) {
    const [newDeckName, setNewDeckName] = useState<string>("");
    const [currentSelection, setCurrentSelection] = useState<string>("");
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
                    {deckNamesAndCardCount?.map((deck: Deck, idx: number) => {
                        return (
                            <SideBarDeckItem
                                deck={deck}
                                idx={idx}
                                key={deck.id}
                                isSelected={currentSelection === deck.id}
                            />
                        );
                    })}
                    <Link href="/manage">
                        <li className="mt-2 w-1/2 rounded-md bg-cyan-700 pl-1 pt-0.5 pb-1 hover:cursor-pointer hover:bg-cyan-800">
                            Manage Cards
                        </li>
                    </Link>
                    <Link href="/create">
                        <li className="mt-1 w-1/2 rounded-md bg-green-700 pl-1 pt-0.5 pb-1 hover:cursor-pointer hover:bg-green-800">
                            Create Cards+
                        </li>
                    </Link>
                </ul>
            </div>
        </>
    );
}

function SideBarDeckItem({ deck, idx, isSelected }: { deck: Deck; idx: number; isSelected: boolean }) {
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
    const handleOnClose = () => setModalIsVisible(false);
    return (
        <li className="flex justify-between rounded-md py-0.5 px-1 hover:bg-neutral-700" key={idx}>
            <Link className="hover:cursor-pointer" href={"review/" + deck.id}>
                {deck.name}
                {deck.cardcount > 0 ? (
                    <span className="ml-1 rounded-md bg-teal-600 px-1">{deck.cardcount}</span>
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

function CollapsableList({ deck, idx }: { deck: any; idx: number }) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const handleCollapse = () => {
        setIsCollapsed((isCollapsed) => !isCollapsed);
    };
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
    const handleOnClose = () => setModalIsVisible(false);

    return (
        <li key={idx} className="mb-2">
            <p className="mr-2" onClick={handleCollapse}>
                {" "}
                {deck.name} <FontAwesomeIcon icon={isCollapsed ? faChevronUp : faChevronDown} />
            </p>
            <ul
                className="ml-4 border-l border-neutral-800 pl-2"
                style={{ display: isCollapsed ? "block" : "none" }}
            >
                <li className="mt-1 rounded-md px-2 pt-0.5 pb-1 hover:cursor-pointer hover:bg-neutral-800">
                    <Link href={"review/" + deck.id}>Review</Link>
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
