import { supabase } from './supabase';
import { File } from 'expo-file-system';
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
};

export async function debugStorage() {
  console.log('=== STORAGE DEBUG ===');

  // 1. List all buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  console.log('Buckets:', buckets);
  console.log('Buckets error:', bucketsError);

  // 2. Try uploading to the root (no folder)
  const testPath = `test-${Date.now()}.jpg`;
  console.log('Trying simple path:', testPath);
}

// Upload a photo to Supabase Storage
export async function uploadPhoto(uri: string): Promise<string> {
  const file = new File(uri);
  const base64 = await file.base64();

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const filePath = fileName; // root of the bucket is fine for MVP

  const { error } = await supabase.storage
    .from('dump-photos')
    .upload(filePath, decode(base64), {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('dump-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function testUpload() {
  console.log('Testing real upload...');

  const filePath = `test-${Date.now()}.jpg`;
  const fakeBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='; // 1x1 px png

  const { data, error } = await supabase.storage
    .from('dump-photos')
    .upload(filePath, decode(fakeBase64), {
      contentType: 'image/png',
      upsert: true,
    });

  console.log('Upload data:', data);
  console.log('Upload error:', error);

  if (!error) {
    const { data: urlData } = supabase.storage
      .from('dump-photos')
      .getPublicUrl(filePath);
    console.log('Public URL:', urlData.publicUrl);
  }
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