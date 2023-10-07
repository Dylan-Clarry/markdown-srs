import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const userRouter = createTRPCRouter({
    getKeybinding: protectedProcedure
        .query(async({ ctx }) => {
            const keyBinding = await ctx.prisma.user.findFirst({
                select: {
                    keyBinding: true,
                }
            });
            console.log("KeyBinding get:", keyBinding);
            return keyBinding;
        }),
    updateKeybinding: protectedProcedure
        .input(
            z.object({
                keyBinding: z.string(),
            })
        )
        .mutation(async({ ctx, input }) => {
            const keyBinding = await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    keyBinding: input.keyBinding,
                }
            })
            console.log("Keybinding set:", keyBinding);
        }),
});
