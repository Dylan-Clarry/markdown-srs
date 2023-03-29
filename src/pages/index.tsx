import { signIn, signOut, useSession } from "next-auth/react";
import DeckList from "~/components/DeckList";
import DeckListForm from "~/components/DeckListForm";
import Markdown from "~/components/Markdown";

export default function Home() {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return <main className="mt-4 flex flex-col items-center">loading...</main>;
    }
    return (
        <main className="flex h-screen">
            {session ? (
                <>
                    <div className="h-full w-60 border-r border-neutral-800 px-4">
                        <LoginButton session={session} />
                        <DeckListForm />
                        <DeckList />
                    </div>
                    <div className="flex-1">
                        <Markdown />
                    </div>
                </>
            ) : (
                <div className="flex w-full items-center justify-center flex-col">
                    <span className="flex items-center">
                        <Logo />
                        <h1 className="text-2xl pr-2">Rocket SRS</h1>
                    </span>
                    <button
                        type="button"
                        className="block rounded-md bg-neutral-800 mt-4 text-xl px-3 pt-1 pb-2 hover:bg-neutral-700"
                        onClick={() => {
                            signIn("discord").catch(console.log);
                        }}
                    >
                        Sign In
                    </button>
                </div>
            )}
        </main>
    );
}

function LoginButton({ session }: { session: any }) {
    return (
        <div className="mt-4 flex w-full items-center justify-between">
            <span className="flex items-center">
                <Logo />
                {session ? session.user?.name : "Rocket SRS"}
            </span>
            {session ? (
                <>
                    <button
                        type="button"
                        className="block rounded-md bg-neutral-800 px-2 pt-0.5 pb-1 hover:bg-neutral-700"
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
                    className="block rounded-md bg-neutral-800 px-2 pt-0.5 pb-1 hover:bg-neutral-700"
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

function Logo() {
    return <span className="mr-2 text-xl">🚀</span>;
}
