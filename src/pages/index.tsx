import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import Markdown from "~/components/Markdown";

export default function Home() {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return (
            <main className="flex flex-col items-center pt-8">loading...</main>
        );
    }
    return (
        <main className="flex flex-col items-center pt-8">
            <h1 className="text-3xl">Yolki</h1>
            <div className="pt-10">
                <LoginButton session={session} />
                {session ? (
                    <div className="pt-10">
                        <Form />
                        <DeckList />
                    </div>
                ) : null}
                <DeckList />
            </div>
        </main>
    );
}

function LoginButton({ session }: { session: any }) {
    return (
        <div>
            {session ? (
                <>
                    <p className="mb-4 text-center">Hi {session.user?.name}</p>
                    <button
                        type="button"
                        className="mx-auto block rounded-md bg-neutral-800 py-3 px-6 hover:bg-neutral-700"
                        onClick={() => {
                            signOut().catch(console.log);
                        }}
                    >
                        Sign Out
                    </button>
                </>
            ) : (
                <button
                    type="button"
                    className="mx-auto block rounded-md bg-neutral-800 py-3 px-6 hover:bg-neutral-700"
                    onClick={() => {
                        signIn("discord").catch(console.log);
                    }}
                >
                    Sign In
                </button>
            )}
        </div>
    );
}

function Form() {
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

    return (
        <form
            className="flex gap-2"
            onSubmit={(event) => {
                event.preventDefault();
                createDeck.mutate({
                    name: newDeckName,
                });
                setNewDeckName("");
            }}
        >
            <input
                type="text"
                className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-2 py-2 focus:outline-none"
                placeholder="New Deck Name"
                minLength={1}
                maxLength={100}
                value={newDeckName}
                onChange={(event) => setNewDeckName(event.target.value)}
            />
            <button
                type="submit"
                className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
            >
                Submit
            </button>
        </form>
    );
}

function DeckList() {
    const { data: deckList, isLoading } = api.deck.getAllDecks.useQuery();
    const utils = api.useContext();
    const deleteDeck = api.deck.deleteDeck.useMutation({
        onSettled: async () => {
            await utils.deck.invalidate();
        },
    });

    if (isLoading) {
        return (
            <div className="mt-4 flex flex-col gap-4 text-center">
                Fetching decks...
            </div>
        );
    }

    return (
        <div className="mt-4 flex flex-col gap-4 text-center">
            {deckList?.map((deck, idx) => {
                return (
                    <div key={idx}>
                        <h1>
                            <u className="mr-2">{deck.name}</u>
                            <button
                                className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
                                onClick={() => {
                                    deleteDeck.mutate({
                                        id: deck.id,
                                    });
                                }}
                            >
                                Delete
                            </button>
                        </h1>
                    </div>
                );
            })}
        </div>
    );
}
