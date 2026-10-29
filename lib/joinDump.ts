import { parseJoinCode } from '../utils/parseJoinCode';
import { getDumpByInviteCode } from './dump';
import { addDumpMember } from '../lib/members';
import { useDeviceStore } from '../store/deviceStore';

export type JoinDumpResult =
  | { ok: true; dumpId: string; needsProfile: true; code: string; dumpName: string }
  | { ok: true; dumpId: string; needsProfile: false }
  | { ok: false; error: string };

export async function joinDumpWithCode(raw: string): Promise<JoinDumpResult> {
  const code = parseJoinCode(raw);
  if (!code) return { ok: false, error: 'Invalid code' };

  try {
    const dump = await getDumpByInviteCode(code);
    const dumpId = dump.id;
    const displayName = useDeviceStore.getState().displayName?.trim();
    const ensureDeviceId = useDeviceStore.getState().ensureDeviceId;
    const addJoinedId = useDeviceStore.getState().addJoinedId;

    if (!displayName) {
      return {
        ok: true,
        dumpId,
        needsProfile: true,
        code,
        dumpName: dump.name,
      };
    }

    await addDumpMember({
      dumpId,
      deviceId: ensureDeviceId(),
      displayName,
      role: 'member',
    });
    addJoinedId(dumpId);

    return { ok: true, dumpId, needsProfile: false };
  } catch {
    return { ok: false, error: 'Dump not found or closed' };
  }
}