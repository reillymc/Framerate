export * from "./framerateBackend"

export type BuildSaveRequest<
    TCreate,
    TUpdate,
    KCreateId extends keyof TCreate,
    KUpdateId extends keyof TUpdate,
    TCreateObject extends keyof TCreate,
    TUpdateObject extends keyof TUpdate,
> = Pick<TCreate, KCreateId> &Partial<Pick<TUpdate, KUpdateId>> &
    (TCreate[TCreateObject] | TUpdate[TUpdateObject]);

export { LoggerMiddleware, SignalMiddleware } from "./middleware"
