// store/deviceStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DeviceState = {
  deviceId: string | null;
  hydrated: boolean;
  joinedIds: string[];
  createdIds: string[];

  ensureDeviceId: () => string;
  setHydrated: (value: boolean) => void;

  addJoinedId: (id: string) => void;
  removeJoinedId: (id: string) => void;
  hasJoined: (id: string) => boolean;

  addCreatedId: (id: string) => void;
  removeCreatedId: (id: string) => void;
  hasCreated: (id: string) => boolean;
  normalizeCreatedIds: () => void;
};

function createId() {
  return `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set, get) => ({
      deviceId: null,
      hydrated: false,
      joinedIds: [],
      createdIds: [],

      ensureDeviceId: () => {
        const existing = get().deviceId;
        if (existing) return existing;
        const id = createId();
        set({ deviceId: id });
        return id;
      },

      setHydrated: (hydrated) => set({ hydrated }),

      addJoinedId: (id: string) => {
        const { joinedIds } = get();
        if (joinedIds.includes(id)) return;
        set({ joinedIds: [...joinedIds, id] });
      },

      removeJoinedId: (id: string) => {
        set({
          joinedIds: get().joinedIds.filter((x) => x !== id),
        });
      },

      hasJoined: (id: string) => get().joinedIds.includes(id),

      addCreatedId: (id: string) => {
        const normalized =
          typeof id === 'string' ? id : (id as any)?.id;
        if (!normalized) return;
        const { createdIds } = get();
        if (createdIds.includes(normalized)) return;
        set({ createdIds: [...createdIds, normalized] });
      },

      normalizeCreatedIds: () => {
        const raw = get().createdIds as unknown[];
        const ids = raw
          .map((x) => (typeof x === 'string' ? x : (x as any)?.id))
          .filter((x): x is string => typeof x === 'string');
        set({ createdIds: [...new Set(ids)] });
      },

      removeCreatedId: (id: string) => {
        set({
          createdIds: get().createdIds.filter((x) => x !== id),
        });
      },

      hasCreated: (id: string) => get().createdIds.includes(id),
    }),
    {
      name: 'aftr-device',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);