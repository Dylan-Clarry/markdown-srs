import { signIn, signOut, useSession } from "next-auth/react";
import DeckList from "~/components/DeckList";
import DeckListForm from "~/components/DeckListForm";
import Markdown from "~/components/Markdown";

export default function Home() {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return <main className="mt-4 flex flex-col items-center">loading...</main>;
    }

    const name = session?.user.name ? session?.user.name : "";
    return (
        <main className="flex h-screen">
            {session ? (
                <>
                    <div className="h-full w-60 border-r border-neutral-800 px-4">
                        <LoginButton name={name} />
                        <DeckListForm />
                        <DeckList />
                    </div>
                    <div className="flex-1 h-full">
                        <div className="h-full">
                            <Markdown />
                        </div>
                    </div>
                </>
            ) : (
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
            )}
        </main>
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
