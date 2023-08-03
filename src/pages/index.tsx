import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (session) {
        router.push("/app");
    }

    if (status === "loading") {
        return <main className="mt-4 flex flex-col items-center">loading...</main>;
    }

    return (
        <main className="flex h-screen">
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
        </main>
    );
}

function Logo() {
    return <span className="mr-2 text-xl">🚀</span>;
}
