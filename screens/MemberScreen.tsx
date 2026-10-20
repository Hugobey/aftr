import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../App';
import Header from '../components/Header';
import ConfirmSheet from '../components/ConfirmSheet';
import { Colors } from '../constants/Colors';
import { useDeviceStore } from '../store/deviceStore';
import { useDumpsStore } from '../store/dumpStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Members'>;

type MemberRow = {
  id: string;
  label: string;
  role: 'HOST' | 'MEMBER';
  isYou: boolean;
  /** ISO date when they joined / created — MVP uses "now" for this device */
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
  const isHost = hasCreated(dumpId);

  const [removeTarget, setRemoveTarget] = useState<MemberRow | null>(null);
  const [removing, setRemoving] = useState(false);

  // MVP: only this device. Later map dump_members rows here.
  const members: MemberRow[] = useMemo(() => {
    const you: MemberRow = {
      id: deviceId ?? 'you',
      label: 'YOU',
      role: isHost ? 'HOST' : 'MEMBER',
      isYou: true,
      joinedAt: new Date().toISOString(),
    };
    return [you];
  }, [deviceId, isHost]);

  const title = current?.title ?? 'DUMP';
  const hostMember = members.find((m) => m.role === 'HOST');

  const handleConfirmRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      // later: await removeMemberFromDump(dumpId, removeTarget.id)
      setRemoveTarget(null);
    } finally {
      setRemoving(false);
    }
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

              {/* Host can remove others — not themselves */}
              {isHost && !m.isYou && (
                <Pressable
                  hitSlop={10}
                  onPress={() => setRemoveTarget(m)}
                >
                  <Text style={styles.remove}>REMOVE</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
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
});