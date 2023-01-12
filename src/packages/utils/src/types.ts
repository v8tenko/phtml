export type Nullable<T> = T | null;
export type NotNull<T> = Exclude<T, null | undefined>;

export type MakeArray<T> = T | T[];
