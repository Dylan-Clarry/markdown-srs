import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";


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
        const decksWithCardCount = await ctx.prisma.deck.findMany({
            include: {
                cards: {
                    select: {
                        id: true,
                    }
                }
            }
        });
        const deckList = decksWithCardCount.map((deck) => ({
            id: deck.id,
            name: deck.name,
            userid: deck.userId,
            createdat: deck.createdAt,
            cardcount: deck.cards.length,
        }));
        return deckList;
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
    rename: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string(),
            })
        )
        .mutation(async({ ctx, input }) => {
            await ctx.prisma.deck.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                }
            });
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
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
