import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { setZeroTime } from "lib/datelib";

export const cardRouter = createTRPCRouter({
    getSchema: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.card.findFirst({
            select: {
                id: true,
                createdAt: true,
                reviewDate: true,
                repetition: true,
                interval: true,
                eFactor: true,
                content: true,
                userId: true,
                deckId: true,
            },
        });
    }),
    getReviewCardsByDeckId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return ctx.prisma.card.findMany({
            where: {
                deckId: input,
                reviewDate: {
                    lte: today,
                },
            },
            orderBy: {
                reviewDate: "desc",
            }
        });
    }),
    getAll: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.prisma.card.findMany({
                select: {
                    id: true,
                    createdAt: true,
                    repetition: true,
                    interval: true,
                    eFactor: true,
                    reviewDate: true,
                    content: true,
                    userId: true,
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
                content: z.string(),
                repetition: z.number(),
                interval: z.number(),
                eFactor: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const cards = await ctx.prisma.card.create({
                    data: {
                        userId: ctx.session.user.id,
                        deckId: input.deckId,
                        content: input.content,
                        repetition: 0,
                        interval: 0,
                        eFactor: 0,
                        reviewDate: setZeroTime(new Date(Date.now())),
                    },
                });
                return cards;
            } catch (err) {
                console.log(err);
            }
        }),
    editContent: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const card = await ctx.prisma.card.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        ...input,
                    }
                });
                console.log("Edited Card:", card);
                return card;
            } catch(err) {
                console.log(err);
            }
        }),
    gradeCard: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                repetition: z.number(),
                interval: z.number(),
                eFactor: z.number(),
                reviewDate: z.date(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const card = await ctx.prisma.card.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        ...input,
                    }
                });
                console.log("Graded card:", card);
                return card;
            } catch(err) {
                console.log("Error grading card:", err);
            }
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async({ ctx, input }) => {
            try {
                await ctx.prisma.card.delete({
                    where: {
                        id: input.id,
                    }
                });
            } catch(err) {
                console.log("Error deleting deck:", err);
            }
        }),
});
