export * from "./framerateBackend"


export type BuildSaveRequest<
    TCreate,
    TUpdate,
    KUpdateId extends keyof TUpdate,
    TCreateObject extends keyof TCreate,
    TUpdateObject extends keyof TUpdate,
> = Partial<Pick<TUpdate, KUpdateId>> &
    (TCreate[TCreateObject] | TUpdate[TUpdateObject]);
