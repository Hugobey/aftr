// store/dumpsStore.ts
import { create } from 'zustand';
import { getDumps, getDump } from '../lib/dump';
import { useDeviceStore } from './deviceStore';

export type DumpUI = {
  id: string;
  title: string;
  image: string | null;
  date: string;
  photos: string;
  photoUrls: string[];
  photoItems: DumpPhoto[];
  live: boolean;
  inviteCode?: string;
};

export type DumpPhoto = {
  id: string | null;
  url: string;
};

type DumpsState = {
  dumps: DumpUI[];
  current: DumpUI | null;
  loadingList: boolean;
  loadingDetail: boolean;
  error: string | null;
  fetchDumps: () => Promise<void>;
  fetchDump: (id: string) => Promise<void>;
  clearCurrent: () => void;
};

function mapDump(row: any): DumpUI {
  const list = Array.isArray(row.photos) ? row.photos : [];
  const photoItems: DumpPhoto[] = list
    .filter((photo: any) => photo?.url)
    .map((photo: any): DumpPhoto => ({
      id: typeof photo.id === 'string' ? photo.id : null,
      url: photo.url,
    }));
  const photoUrls = photoItems.map((photo) => photo.url);

  const cover =
    row.cover_url ||
    photoUrls[0] ||
    null;

  // Keep cover first in the gallery list
  const orderedUrls =
    cover && !photoUrls.includes(cover)
      ? [cover, ...photoUrls]
      : photoUrls;
  const orderedPhotoItems =
    cover && !photoUrls.includes(cover)
      ? [{ id: null, url: cover }, ...photoItems]
      : photoItems;

  return {
    id: row.id,
    title: row.name ?? 'UNTITLED',
    image: cover,
    date: row.date
      ? new Date(row.date)
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          .toUpperCase()
      : '',
    photos: `${orderedUrls.length} PHOTOS`,
    photoUrls: orderedUrls,
    photoItems: orderedPhotoItems,
    live: !!row.is_open,
    inviteCode: row.invite_code,
  };
}

export const useDumpsStore = create<DumpsState>((set, get) => ({
  dumps: [],
  current: null,
  loadingList: false,
  loadingDetail: false,
  error: null,

  fetchDumps: async () => {
    set({ loadingList: true, error: null });
    try {
      const deviceId = useDeviceStore.getState().ensureDeviceId();
      const rows = await getDumps(deviceId);
      const mapped = rows.map(mapDump);

      useDeviceStore.getState().pruneDumpIds(mapped.map((d) => d.id));

      set({ dumps: mapped, loadingList: false });
    } catch (e: any) {
      set({
        error: e.message ?? 'Failed to load dumps',
        loadingList: false,
      });
    }
  },

  fetchDump: async (id: string) => {
    const keep = get().current?.id === id ? get().current : null;
    set({
      loadingDetail: !keep,
      error: null,
      // do NOT set current: null here
    });
    try {
      const row = await getDump(id);
      set({ current: mapDump(row), loadingDetail: false });
    } catch (e: any) {
      set({ error: e.message, loadingDetail: false });
    };
  },

  clearCurrent: () => set({ current: null }),
}));
