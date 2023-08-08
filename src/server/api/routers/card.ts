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
    getAll: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.prisma.card.findMany({
                select: {
                    id: true,
                    front: true,
                    back: true,
                    reviewDate: true,
                    deckId: true,
                },
                orderBy: {
                    reviewDate: "desc",
                },
            });
        } catch (err) {
            console.log("error", err);
        }
    }),
    createCards: protectedProcedure
        .input(
            z.object({
                deckId: z.string(),
                front: z.string(),
                back: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const cards = await ctx.prisma.card.create({
                    data: {
                        userId: ctx.session.user.id,
                        deckId: input.deckId,
                        front: input.front,
                        back: input.back,
                        reviewDate: new Date(Date.now()),
                    },
                });
                return cards;
            } catch (err) {
                console.log(err);
            }
        }),
});
