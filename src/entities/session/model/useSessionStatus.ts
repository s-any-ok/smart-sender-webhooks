import { useSessionStore } from './sessionStore';

export const useSessionStatus = () => useSessionStore((state) => state.status);
