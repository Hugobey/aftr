import { supabase } from './supabase';
import { decode } from 'base64-arraybuffer';

export async function debugStorage() {
  console.log('=== STORAGE DEBUG ===');

  // 1. List all buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  console.log('Buckets:', buckets);
  console.log('Buckets error:', bucketsError);

  // 2. Try uploading to the root (no folder)
  const testPath = `test-${Date.now()}.jpg`;
  console.log('Trying simple path:', testPath);
};

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