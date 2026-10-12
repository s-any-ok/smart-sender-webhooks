import { create } from 'zustand';

import type { SessionEndReason, SessionStatus } from './types';

interface SessionState {
  status: SessionStatus;
  endReason: SessionEndReason | null;
  deviceSessionToken: string | null;
}

interface SessionActions {
  setDeviceSessionToken: (token: string | null) => void;
  markAuthenticated: () => void;
  endSession: (reason: SessionEndReason) => void;
}

const initialState: SessionState = {
  status: 'anonymous',
  endReason: null,
  deviceSessionToken: null,
};

export const useSessionStore = create<SessionState & SessionActions>()((set) => ({
  ...initialState,
  setDeviceSessionToken: (deviceSessionToken) => set({ deviceSessionToken }),
  markAuthenticated: () =>
    set({ status: 'authenticated', endReason: null, deviceSessionToken: null }),
  endSession: (endReason) => set({ ...initialState, endReason }),
}));
