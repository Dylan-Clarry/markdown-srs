import { createTRPCRouter } from "~/server/api/trpc";
import { deckRouter } from "./routers/deck";
import { cardRouter } from "./routers/card";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    user: userRouter,
    deck: deckRouter,
    card: cardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
