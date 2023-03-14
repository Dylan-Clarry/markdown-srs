import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const deckSchema = z.object({ name: z.string() });

export const deckRouter = createTRPCRouter({
    getAllDecks: publicProcedure.query(async ({ ctx }) => {
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
    createDeck: protectedProcedure
        .input(deckSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.deck.create({
                    data: {
                        ...input,
                        userId: ctx.session.user.id,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        }),
});
