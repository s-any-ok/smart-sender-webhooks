export function createSingleFlight<T>(task: () => Promise<T>) {
  let inFlight: Promise<T> | null = null;

  return {
    run(): Promise<T> {
      inFlight ??= task().finally(() => {
        inFlight = null;
      });
      return inFlight;
    },
    get pending(): Promise<T> | null {
      return inFlight;
    },
  };
}
