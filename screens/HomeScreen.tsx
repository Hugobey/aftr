import { useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import type { RootStackParamList } from '../App';
import { Colors } from '../constants/Colors';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import ActiveDumpsCarousel from '../components/ActiveDumpsCarousel';
import ArchiveGrid from '../components/ArchiveGrid';
import { useDumpsStore } from '../store/dumpStore';
import { useDeviceStore } from '../store/deviceStore';
import DumpActionButton from '../components/DumpActionButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const dumps = useDumpsStore((s) => s.dumps);
  const loadingList = useDumpsStore((s) => s.loadingList);
  const fetchDumps = useDumpsStore((s) => s.fetchDumps);

  const createdIds = useDeviceStore((s) => s.createdIds);
  const joinedIds = useDeviceStore((s) => s.joinedIds);

  useFocusEffect(
    useCallback(() => {
      fetchDumps();
    }, [fetchDumps])
  );

  // Only dumps this device created or joined
  const mine = new Set([...createdIds, ...joinedIds]);
  const visibleDumps = dumps.filter((d) => mine.has(d.id));

  const activeDumps = visibleDumps.filter((d) => d.live);
  const archivedDumps = visibleDumps.filter((d) => !d.live);

  const active =
    activeDumps.length > 0 ? activeDumps : visibleDumps.slice(0, 1);
  const archived =
    activeDumps.length > 0 ? archivedDumps : visibleDumps.slice(1);

  const totalCount = visibleDumps.length;
  const hasDumps = totalCount > 0;

  console.log('device membership', { createdIds, joinedIds });
  console.log('store dumps', dumps.map((d) => d.id));
  console.log('visible', visibleDumps.map((d) => d.id));

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top }}>
        <Header
          variant="home"
          onPlusPress={() => navigation.navigate('CreateDump')}
          onScanPress={() => navigation.navigate('JoinDump')}
        />
      </View>

      {loadingList && !hasDumps ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.accent} />
        </View>
      ) : hasDumps ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 24 + insets.bottom },
          ]}
        >
          <Text style={styles.eyebrow}>YOUR NIGHT, EVERY POV</Text>

          <View style={styles.titleRow}>
            <Text style={styles.title}>DUMPS</Text>
            <Text style={styles.totalCount}>
              {String(totalCount).padStart(2, '0')}
            </Text>
          </View>

          <ActiveDumpsCarousel dumps={active} navigation={navigation} />

          {archived.length > 0 && (
            <ArchiveGrid dumps={archived} navigation={navigation} />
          )}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState navigation={navigation} />
        </View>
      )}

      <View
        style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}
      >
       {hasDumps ? (
    <DumpActionButton navigation={navigation} variant="join" />
      ) : (
        <View style={styles.emptyActions}>
          <DumpActionButton
            navigation={navigation}
            variant="create"
            appearance="primary"
          />
          <DumpActionButton
            navigation={navigation}
            variant="join"
            appearance="secondary"
          />
        </View>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 8,
  },
  title: {
    color: Colors.text,
    fontSize: 64,
    lineHeight: 60,
    fontWeight: '900',
    letterSpacing: -2.5,
  },
  totalCount: {
    color: '#666',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#222',
  },
  emptyContainer: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActions: {
  gap: 12,
},
});