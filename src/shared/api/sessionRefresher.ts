import { createSingleFlight } from './createSingleFlight';

export function createSessionRefresher(rotate: () => Promise<void>, onFailure: () => void) {
  let generation = 0;

  const rotation = createSingleFlight(async () => {
    try {
      await rotate();
    } catch (error) {
      onFailure();
      throw error;
    }
    generation += 1;
  });

  return {
    get generation(): number {
      return generation;
    },
    async idle(): Promise<void> {
      await rotation.pending?.catch(() => undefined);
    },
    refresh(seenGeneration: number): Promise<void> {
      if (seenGeneration !== generation) return Promise.resolve();
      return rotation.run();
    },
  };
}
