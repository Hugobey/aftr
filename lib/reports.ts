import { supabase } from './supabase';

export async function reportPhoto({
  dumpId,
  photoId,
  reporterDeviceId,
  reportedDeviceId,
}: {
  dumpId: string;
  photoId: string;
  reporterDeviceId: string;
  reportedDeviceId?: string | null;
}) {
  const { error } = await supabase.from('content_reports').insert({
    dump_id: dumpId,
    photo_id: photoId,
    reporter_device_id: reporterDeviceId,
    reported_device_id: reportedDeviceId ?? null,
    reason: 'objectionable_content',
  });

  if (error) throw error;
}
