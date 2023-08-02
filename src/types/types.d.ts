export type SingleRouterOutputType<T> = T extends (infer U)[] ? U : never;
