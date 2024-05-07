export type Result<T = void, E = string> = { isSuccess: true, value: T } | { isSuccess: false, error: E };

export const Ok = <T>(data: T): Result<T, never> => {
  return { isSuccess: true, value: data }
}

export const Err = <E>(error: E): Result<never, E> => {
  return { isSuccess: false, error }
}