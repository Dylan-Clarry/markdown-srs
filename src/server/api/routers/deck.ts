import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const deckSchema = z.object({ id: z.string(), name: z.string() });

export const deckRouter = createTRPCRouter({
    getSchema: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.deck.findFirst({
            select: {
                id: true,
                name: true,
            },
        });
    }),
    getAllDeckNames: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.prisma.deck.findMany({
                select: {
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
    getAll: publicProcedure.query(async ({ ctx }) => {
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
            console.log("error fetching decks (getAll):", err);
        }
    }),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.prisma.deck.create({
                    data: {
                        userId: ctx.session.user.id,
                        ...input,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        }),
    delete: protectedProcedure.input(deckSchema).mutation(async ({ ctx, input }) => {
        try {
            await ctx.prisma.deck.delete({
                where: {
                    id: input.id,
                },
            });
        } catch (err) {
            console.log("error", err);
        }
    }),
});
