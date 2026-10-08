import { File } from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export async function uploadPhoto(uri: string): Promise<string> {
  const file = new File(uri);
  const base64 = await file.base64();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  const { error } = await supabase.storage
    .from('dump-photos')
    .upload(fileName, decode(base64), {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('dump-photos')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function createDump({
  name,
  coverUri,
  date,
  isOpen = true,
}: {
  name: string;
  coverUri?: string | null;
  date?: string;
  isOpen?: boolean;
}) {
  let cover_url: string | null = null;

  if (coverUri) {
    cover_url = await uploadPhoto(coverUri);
  };
  const { data, error } = await supabase
    .from('dumps')
    .insert({
      name,
      cover_url,
      date,
      is_open: isOpen,
      invite_code: generateInviteCode(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export async function addPhotosToDump(dumpId: string, uris: string[]) {
  if (!uris.length) return [];

  const rows = [];

  for (const uri of uris) {
    const url = await uploadPhoto(uri);
    rows.push({ dump_id: dumpId, url });
  }

  const { data, error } = await supabase
    .from('photos')
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

export async function getDumps() {
  const { data, error } = await supabase
    .from('dumps')
    .select(`
      id,
      name,
      cover_url,
      date,
      is_open,
      created_at,
      invite_code,
      photos ( id, url )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getDump(dumpId: string) {
  const { data, error } = await supabase
    .from('dumps')
    .select('*, photos(*)')
    .eq('id', dumpId)
    .single();

  if (error) throw error;
  return data;
};

export async function getDumpByInviteCode(code: string) {
  const { data, error } = await supabase
    .from('dumps')
    .select('*, photos(*)')
    .eq('invite_code', code)
    .single();

  if (error) throw error;
  return data;
};