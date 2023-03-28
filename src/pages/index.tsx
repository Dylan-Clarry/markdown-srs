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
        <main className="grid h-screen grid-cols-12">
            {session ? (
                <>
                    <div className="col-span-2 h-full px-4 border-r border-neutral-800">
                        <LoginButton session={session} />
                        <DeckListForm />
                        <DeckList />
                    </div>
                    <div className="col-span-10">
                        <Markdown />
                    </div>
                </>
            ) : (
                <LoginButton session={session} />
            )}
        </main>
    );
}

function LoginButton({ session }: { session: any }) {
    return (
        <div className="flex mt-4 w-full items-center justify-between">
            <span className="flex items-center">
                <Logo />
                {session ? session.user?.name : "Markdown SRS"}
            </span>
            {session ? (
                <>
                    <button
                        type="button"
                        className="block rounded-md bg-neutral-800 pt-0.5 pb-1 px-2 hover:bg-neutral-700"
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
                    className="block rounded-md bg-neutral-800 pt-0.5 pb-1 px-2 hover:bg-neutral-700"
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
