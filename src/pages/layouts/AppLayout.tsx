import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { api, RouterOutputs } from "../../utils/api";
import SideBar from "~/components/SideBar";
import { useEffect } from "react";

type Deck = NonNullable<RouterOutputs["deck"]["getAll"][number]>;

export default function AppLayout({ children }: any) {
    const { data: session, status } = useSession();
    const deckList = api.deck.getAll.useQuery().data as Deck[];
    const name = session?.user.name || "";
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.replace("/");
        }
    }, [router, session]);

    if (status === "loading") {
        return <main className="mt-4 flex flex-col items-center">loading...</main>;
    }

    if (!deckList) {
        return <main className="mt-4 flex flex-col items-center">Error fetching decklist</main>;
    }

    return (
        <main className="flex h-screen">
            <div className="h-full w-60 border-r border-neutral-800 px-4">
                <UsernameAndSignOut name={name} />
                <SideBar deckList={deckList} />
            </div>
            <div className="h-full flex-1">
                {children}
            </div>
        </main>
    );
}

function UsernameAndSignOut({ name }: { name: string }) {
    return (
        <div className="mt-2 flex w-full items-center justify-between">
            <span className="flex items-center">
                <span className="mr-2 text-xl"><Link href="/">🚀</Link></span>
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
