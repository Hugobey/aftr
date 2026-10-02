// lib/createDumpFlow.ts
import { createDump } from './dump';

type CreateDumpParams = {
  name: string;
  coverUri?: string | null;
  isOpen?: boolean;
  date?: string;
};

export async function createDumpFlow({
  name,
  coverUri = null,
  isOpen = true,
  date = new Date().toISOString().split('T')[0],
}: CreateDumpParams) {
  if (!name.trim()) {
    throw new Error('Dump name is required');
  };
  // Create the dump in Supabase
  const dump = await createDump({
    name: name.trim(),
    coverUri,
    date,
    isOpen,
  });

  return dump; // contains id, invite_code, etc.
}