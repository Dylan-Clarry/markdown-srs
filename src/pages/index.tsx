import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { z } from "zod";
import DeckList from "~/components/DeckList";
import Markdown from "~/components/Markdown";

import { deckSchema } from "~/server/api/routers/deck";
type Deck = z.infer<typeof deckSchema>;

export default function Home() {
    const { data: session, status } = useSession();
    const data = api.deck.getAllDecks.useQuery();
    const name = session?.user.name || "";

    if (status === "loading") {
        return <main className="mt-4 flex flex-col items-center">loading...</main>;
    }

    return (
        <main className="flex h-screen">
            {
                session
                ? <Authenticated data={data} name={name} />
                : <Unauthenticated />
            }
        </main>
    );
}

function Authenticated({ data, name }: { data: any; name: string }) {
    return (
        <>
            <div className="h-full w-60 border-r border-neutral-800 px-4">
                <LoginButton name={name} />
                <DeckList data={data} />
            </div>
            <div className="h-full flex-1">
                <Markdown data={data} />
            </div>
        </>
    );
}

function Unauthenticated() {
    return (
        <div className="flex w-full flex-col items-center justify-center">
            <span className="flex items-center">
                <Logo />
                <h1 className="pr-2 text-2xl">Rocket SRS</h1>
            </span>
            <button
                type="button"
                className="mt-4 block rounded-md bg-neutral-800 px-3 pt-1 pb-2 text-xl hover:bg-neutral-700"
                onClick={() => {
                    signIn("discord").catch(console.log);
                }}
            >
                Sign In
            </button>
        </div>
    );
}

function LoginButton({ name }: { name: string }) {
    return (
        <div className="mt-2 flex w-full items-center justify-between">
            <span className="flex items-center">
                <Logo />
                <p>{name}</p>
            </span>
            <button
                type="button"
                className="block rounded-md bg-neutral-800 px-2 pt-0.5 pb-1 hover:bg-neutral-700"
                onClick={() => {
                    signOut().catch(console.log);
                }}
            >
                Sign Out
            </button>
        </div>
    );
}

function Logo() {
    return <span className="mr-2 text-xl">🚀</span>;
}
