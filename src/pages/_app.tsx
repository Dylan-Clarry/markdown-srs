import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import { Noto_Sans } from  "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const openSans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
});

const notoSans = Noto_Sans({
    weight: ["200", "400"],
    subsets: ["latin"],
    variable: "--font-open-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <div className={`${notoSans.variable} font-sans text-sm`}>
               <Component {...pageProps} />
            </div>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
