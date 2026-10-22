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

export async function removeDumpMember(params: {
  dumpId: string;
  /** dump_members row id */
  memberId?: string;
  /** or target device */
  deviceId?: string;
}) {
  const { dumpId, memberId, deviceId } = params;

  let query = supabase.from('dump_members').delete().eq('dump_id', dumpId);

  if (memberId) {
    query = query.eq('id', memberId);
  } else if (deviceId) {
    query = query.eq('device_id', deviceId);
  } else {
    throw new Error('memberId or deviceId required');
  }

  const { error } = await query;
  if (error) throw error;
};

  export async function isDeviceMemberOfDump(
    dumpId: string,
    deviceId: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('dump_members')
      .select('id')
      .eq('dump_id', dumpId)
      .eq('device_id', deviceId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }