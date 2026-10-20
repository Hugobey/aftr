import { supabase } from './supabase';

export async function addDumpMember({
  dumpId,
  deviceId,
  displayName,
  role = 'member',
}: {
  dumpId: string;
  deviceId: string;
  displayName: string;
  role?: 'host' | 'member';
}) {
  const { data, error } = await supabase
    .from('dump_members')
    .upsert(
      {
        dump_id: dumpId,
        device_id: deviceId,
        display_name: displayName.trim(),
        role,
      },
      { onConflict: 'dump_id,device_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export async function getDumpMembers(dumpId: string) {
  const { data, error } = await supabase
    .from('dump_members')
    .select('*')
    .eq('dump_id', dumpId)
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function removeDumpMember(memberId: string) {
  const { error } = await supabase
    .from('dump_members')
    .delete()
    .eq('id', memberId);

  if (error) throw error;
}