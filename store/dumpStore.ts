// store/dumpsStore.ts
import { create } from 'zustand';
import { getDumps, getDump } from '../lib/dump';

export type DumpUI = {
  id: string;
  title: string;
  image: string | null;
  date: string;
  photos: string;
  photoUrls: string[];
  live: boolean;
  inviteCode?: string;
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
  const photoUrls = list
    .map((p: any) => p.url)
    .filter(Boolean);

  const cover =
    row.cover_url ||
    photoUrls[0] ||
    null;

  // Keep cover first in the gallery list
  const orderedUrls =
    cover && !photoUrls.includes(cover)
      ? [cover, ...photoUrls]
      : photoUrls;

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
      const rows = await getDumps();
      set({ dumps: rows.map(mapDump), loadingList: false });
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to load dumps', loadingList: false });
    }
  },

  fetchDump: async (id: string) => {
    const cached = get().dumps.find((d) => d.id === id);

    if (cached) {
      set({ current: cached, loadingDetail: false, error: null });
    } else {
      set({ loadingDetail: true, error: null });
    }

    try {
      const row = await getDump(id);
      set({ current: mapDump(row), loadingDetail: false });
    } catch (e: any) {
      set({
        error: e.message ?? 'Failed to load dump',
        loadingDetail: false,
      });
    }
  },

  clearCurrent: () => set({ current: null }),
}));