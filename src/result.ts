export type Success<T> = { ok: true; data: T };
export type Failure<E> = { ok: false; error: E };
export type Result<T, E> = Success<T> | Failure<E>;
export const ok = <T>(data: T): Success<T> => ({ ok: true, data });
export const err = <E>(error: E): Failure<E> => ({ ok: false, error });
