import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

// Generate a short invite code
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create a new Dump
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
  let cover_url = null;

  // Upload cover if exists
  if (coverUri) {
    cover_url = await uploadPhoto(coverUri);
  }

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
}

// Upload a photo to Supabase Storage
export async function uploadPhoto(uri: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
  const filePath = `photos/${fileName}`;

  const { error } = await supabase.storage
    .from('dump-photos')
    .upload(filePath, decode(base64), {
      contentType: 'image/jpeg',
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('dump-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// Add multiple photos to a dump
export async function addPhotosToDump(dumpId: string, uris: string[]) {
  const uploadedUrls: string[] = [];

  for (const uri of uris) {
    const url = await uploadPhoto(uri);
    uploadedUrls.push(url);
  }

  const { error } = await supabase.from('photos').insert(
    uploadedUrls.map((url) => ({
      dump_id: dumpId,
      url,
    }))
  );

  if (error) throw error;
  return uploadedUrls;
}

// Get a dump by invite code
export async function getDumpByInviteCode(code: string) {
  const { data, error } = await supabase
    .from('dumps')
    .select('*, photos(*)')
    .eq('invite_code', code)
    .single();

  if (error) throw error;
  return data;
}