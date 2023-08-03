import { signIn, signOut, useSession } from "next-auth/react";
import { api, RouterOutputs } from "../utils/api";
import SideBar from "~/components/SideBar";
import CardCreator from "~/components/CardCreator";
import { SingleRouterOutputType } from "~/types/types";

type Deck = SingleRouterOutputType<RouterOutputs["deck"]["getAll"]>;

export default function Home() {
    const { data: session, status } = useSession();
    const deckList = api.deck.getAll.useQuery().data;
    const name = session?.user.name || "";

    if (status === "loading") {
        return <main className="mt-4 flex flex-col items-center">loading...</main>;
    }

    if(!deckList) {
        return <main className="mt-4 flex flex-col items-center">Error fetching decklist</main>;
    }

    return (
        <main className="flex h-screen">
            {
                session
                ? <Authenticated deckList={deckList} name={name} />
                : <Unauthenticated />
            }
        </main>
    );
}

function Authenticated({ deckList, name }: { deckList: Deck[]; name: string }) {
    return (
        <>
            <div className="h-full w-60 border-r border-neutral-800 px-4">
                <UsernameAndSignOut name={name} />
                <SideBar deckList={deckList} />
            </div>
            <div className="h-full flex-1">
                <CardCreator deckList={deckList} />
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

function UsernameAndSignOut({ name }: { name: string }) {
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
