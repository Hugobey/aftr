import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../App';
import Header from '../components/Header';
import ConfirmSheet from '../components/ConfirmSheet';
import { Colors } from '../constants/Colors';
import { useDeviceStore } from '../store/deviceStore';
import { useDumpsStore } from '../store/dumpStore';
import { getDumpMembers } from '../lib/members';
import { removeDumpMember } from '../lib/members';

type Props = NativeStackScreenProps<RootStackParamList, 'Members'>;

type MemberRow = {
  id: string; // dump_members.id
  deviceId: string;
  label: string;
  role: 'HOST' | 'MEMBER';
  isYou: boolean;
  joinedAt: string;
};

function formatJoinedAt(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'JOINED JUST NOW';
  if (mins < 60) return `JOINED ${mins}M AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `JOINED ${hours}H AGO`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'JOINED YESTERDAY';
  if (days < 30) return `JOINED ${days}D AGO`;
  const months = Math.floor(days / 30);
  return `JOINED ${months}MO AGO`;
}

export default function MembersScreen({ navigation, route }: Props) {
  const { dumpId } = route.params;
  const insets = useSafeAreaInsets();

  const current = useDumpsStore((s) => s.current);
  const hasCreated = useDeviceStore((s) => s.hasCreated);
  const deviceId = useDeviceStore((s) => s.deviceId);
  const blockedDeviceIds = useDeviceStore((s) => s.blockedDeviceIds);
  const blockDeviceId = useDeviceStore((s) => s.blockDeviceId);
  const isHost = hasCreated(dumpId);

  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState<MemberRow | null>(null);
  const [removing, setRemoving] = useState(false);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await getDumpMembers(dumpId);

      const mapped: MemberRow[] = rows.map((r) => {
        const role = r.role === 'host' ? 'HOST' : 'MEMBER';
        const isYou = !!deviceId && r.device_id === deviceId;
        const rawName = (r.display_name || '').trim();

        // Never use "HOST" as the person's name
        const label = isYou
          ? 'YOU'
          : rawName && rawName.toUpperCase() !== 'HOST'
            ? rawName
            : 'SOMEONE';

        return {
          id: r.id,
          deviceId: r.device_id,
          label,
          role,
          isYou,
          joinedAt: r.joined_at ?? new Date().toISOString(),
        };
      });

      // Host first, then others
      mapped.sort((a, b) => {
        if (a.role === 'HOST' && b.role !== 'HOST') return -1;
        if (b.role === 'HOST' && a.role !== 'HOST') return 1;
        return 0;
      });

      setMembers(mapped);
    } catch (e) {
      console.error('loadMembers', e);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [dumpId, deviceId]);

  useFocusEffect(
    useCallback(() => {
      loadMembers();
    }, [loadMembers])
  );

  const title = current?.title ?? 'DUMP';
  const hostMember = members.find((m) => m.role === 'HOST');

  const handleConfirmRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await removeDumpMember({
        dumpId,
        memberId: removeTarget.id,
        // or: deviceId: removeTarget.deviceId,
      });

      setRemoveTarget(null);
      await loadMembers(); // this screen’s list
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not remove this member.');
    } finally {
      setRemoving(false);
    };
  };

  const handleBlock = (member: MemberRow) => {
    Alert.alert(
      `Block ${member.label}?`,
      'Their photos will be hidden from your view of AFTR. You can still report specific content from the photo viewer.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => blockDeviceId(member.deviceId),
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header
        showBack
        rightLabel={String(members.length).padStart(2, '0')}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>MEMBERS</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>
          {members.length}{' '}
          {members.length === 1 ? 'PERSON' : 'PEOPLE'} IN THIS DUMP
        </Text>

        {!!hostMember && (
          <Text style={styles.creatorLine}>
            CREATED BY{' '}
            <Text style={styles.creatorName}>
              {hostMember.isYou ? 'YOU' : hostMember.label}
            </Text>
          </Text>
        )}

        {loading ? (
          <ActivityIndicator color={Colors.accent} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.list}>
            {members.map((m) => (
              <View key={m.id} style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {m.label.slice(0, 1)}
                  </Text>
                </View>

                <View style={styles.meta}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{m.label}</Text>
                    {m.role === 'HOST' && (
                      <View style={styles.hostBadge}>
                        <Text style={styles.hostBadgeText}>HOST</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.joined}>
                    {formatJoinedAt(m.joinedAt)}
                  </Text>
                </View>

                {isHost && !m.isYou && (
                  <View style={styles.memberActions}>
                    {!blockedDeviceIds.includes(m.deviceId) && (
                      <Pressable hitSlop={10} onPress={() => handleBlock(m)}>
                        <Text style={styles.block}>BLOCK</Text>
                      </Pressable>
                    )}
                    <Pressable hitSlop={10} onPress={() => setRemoveTarget(m)}>
                      <Text style={styles.remove}>REMOVE</Text>
                    </Pressable>
                  </View>
                )}
                {!isHost && !m.isYou && !blockedDeviceIds.includes(m.deviceId) && (
                  <Pressable hitSlop={10} onPress={() => handleBlock(m)}>
                    <Text style={styles.block}>BLOCK</Text>
                  </Pressable>
                )}
                {!isHost && !m.isYou && blockedDeviceIds.includes(m.deviceId) && (
                  <Text style={styles.blocked}>BLOCKED</Text>
                )}
              </View>
            ))}

            {members.length === 0 && (
              <Text style={styles.empty}>NO MEMBERS YET</Text>
            )}
          </View>
        )}
      </ScrollView>

      <ConfirmSheet
        visible={!!removeTarget}
        title={
          removeTarget
            ? `Remove ${removeTarget.label}?`
            : 'Remove member?'
        }
        message="They’ll lose access to this Dump and won’t see it on their home."
        cancelLabel="CANCEL"
        confirmLabel="REMOVE"
        tone="danger"
        loading={removing}
        onCancel={() => !removing && setRemoveTarget(null)}
        onConfirm={handleConfirmRemove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -1.4,
    textTransform: 'uppercase',
    marginTop: 14,
  },
  sub: {
    color: '#777',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginTop: 12,
  },
  creatorLine: {
    color: '#666',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 10,
    marginBottom: 24,
  },
  creatorName: {
    color: Colors.accent,
    fontWeight: '900',
  },
  list: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#292929',
  },
  row: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#292929',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  meta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.1,
  },
  hostBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  hostBadgeText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1,
  },
  joined: {
    color: '#777',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 5,
  },
  remove: {
    color: '#E85A5A',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.2,
  },
  memberActions: {
    alignItems: 'flex-end',
    gap: 12,
  },
  block: {
    color: '#E85A5A',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  blocked: {
    color: '#777',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  empty: {
    color: '#666',
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 32,
  },
});
