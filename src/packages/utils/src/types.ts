export type Nullable<T> = T | null | undefined;
export type NotNull<T> = Exclude<T, null | undefined>;
export type WithId<T, IdType = number> = T & { id: IdType };
export type MakeArray<T> = T | T[];
