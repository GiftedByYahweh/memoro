export type UseCase<TInput = void, TOutput = void> = (input: TInput) => Promise<TOutput>;
