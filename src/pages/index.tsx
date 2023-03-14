import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

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
                        className="block rounded-md bg-neutral-800 py-3 px-6 hover:bg-neutral-700"
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
                    className="block rounded-md bg-neutral-800 py-3 px-6 hover:bg-neutral-700"
                    onClick={() => {
                        signIn("discord").catch(console.log);
                    }}
                >
                    Sign In
                </button>
            )}
            <div className="pt-10">
                <DeckList />
            </div>
        </div>
    );
}

function DeckList() {
    const { data: deckList, isLoading } = api.deck.getAllDecks.useQuery();

    if (isLoading) {
        return <div>Fetching decks...</div>;
    }

    return (
        <div className="flex flex-col gap-4 text-center">
            {deckList?.map((deck, idx) => {
                return (
                    <div key={idx}>
                        <h1><u>{deck.name}</u></h1>
                    </div>
                );
            })}
        </div>
    );
}
