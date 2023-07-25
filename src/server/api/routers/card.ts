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
    createCards: protectedProcedure
        .input(
            z.object({
                deckId: z.string(),
                front: z.string(),
                back: z.string(),
                reviewDate: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.card.create({
                    data: {
                        userId: ctx.session.user.id,
                        deckId: input.deckId,
                        front: input.front,
                        back: input.back,
                        reviewDate: String(Date.now()),
                    },
                });
            } catch (err) {
                console.log(err);
            }
        }),
});
