import { useSessionStore } from './sessionStore';

export const useSessionEndReason = () => useSessionStore((state) => state.endReason);
