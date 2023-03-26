import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Open_Sans } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const openSans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <div className={`${openSans.variable} font-sans`}>
               <Component {...pageProps} />
            </div>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
