// store/deviceStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DeviceState = {
  deviceId: string | null;
  hydrated: boolean;
  ensureDeviceId: () => string;
  setHydrated: (value: boolean) => void;
};

function createId() {
  return `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set, get) => ({
      deviceId: null,
      hydrated: false,

      ensureDeviceId: () => {
        const existing = get().deviceId;
        if (existing) return existing;
        const id = createId();
        set({ deviceId: id });
        return id;
      },

      setHydrated: (hydrated) => set({ hydrated }),
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