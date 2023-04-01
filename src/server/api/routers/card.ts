import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const cardRouter = createTRPCRouter({
    getCardById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
        return ctx.prisma.card.findFirst({
            where: {
                id: input
            },
        });
    }),
    getCardsByDeckId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
        return ctx.prisma.card.findMany({
            where: {
                deckId: input
            },
        });
    }),
    getAllCards: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.prisma.deck.findMany({
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } catch (err) {
            console.log("error", err);
        }
    }),
});
