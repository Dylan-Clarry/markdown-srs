import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <main>loading...</main>;
  }
  return (
    <main className="flex flex-col items-center">
      <h1>Yolki</h1>
      <Login session={session} />
    </main>
  );
}

function Login({ session }: { session: any }) {
  return (
    <div>
      {session ? (
        <>
          <p>Hi {session.user?.name}</p>
          <button
            onClick={() => {
              signOut().catch(console.log);
            }}
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
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
