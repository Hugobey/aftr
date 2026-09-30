import { create } from 'zustand';

type CreateDumpState = {
  name: string;
  coverUri: string | null;
  isOpen: boolean;
  photoUris: string[];

  setName: (name: string) => void;
  setCoverUri: (uri: string | null) => void;
  setIsOpen: (value: boolean) => void;
  setPhotoUris: (uris: string[]) => void;
  addPhotoUris: (uris: string[]) => void;
  removePhotoUri: (index: number) => void;
  reset: () => void;
};

export const useCreateDumpStore = create<CreateDumpState>((set) => ({
  name: '',
  coverUri: null,
  isOpen: true,
  photoUris: [],

  setName: (name) => set({ name }),
  setCoverUri: (coverUri) => set({ coverUri }),
  setIsOpen: (isOpen) => set({ isOpen }),
  setPhotoUris: (photoUris) => set({ photoUris }),
  addPhotoUris: (uris) =>
    set((state) => ({
      photoUris: [...state.photoUris, ...uris].slice(0, 10),
    })),
  removePhotoUri: (index) =>
    set((state) => ({
      photoUris: state.photoUris.filter((_, i) => i !== index),
    })),
  reset: () =>
    set({
      name: '',
      coverUri: null,
      isOpen: true,
      photoUris: [],
    }),
}));