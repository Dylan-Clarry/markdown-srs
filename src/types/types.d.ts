// possibly deprecated, better way to infer single entry types
export type SingleRouterOutputType<T> = T extends (infer U)[] ? U : T | undefined;
