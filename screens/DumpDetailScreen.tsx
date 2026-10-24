import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';

import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import Header from '../components/Header';
import PhotoViewer from '../components/PhotoViewer';
import ConfirmSheet from '../components/ConfirmSheet';
import DumpOptionsSheet from '../components/DumpOptionsSheet';
import { deletePhoto } from '../lib/dump';
import { useDumpsStore } from '../store/dumpStore';
import { useDeviceStore } from '../store/deviceStore';
import {
  getDumpMembers,
  isDeviceMemberOfDump,
  removeDumpMember,
} from '../lib/members';

type Props = NativeStackScreenProps<RootStackParamList, 'DumpDetail'>;

export default function DumpDetailScreen({ navigation, route }: Props) {
  const { dumpId } = route.params;
  const insets = useSafeAreaInsets();

  const current = useDumpsStore((s) => s.current);
  const loadingDetail = useDumpsStore((s) => s.loadingDetail);
  const fetchDump = useDumpsStore((s) => s.fetchDump);

  const removeJoinedId = useDeviceStore((s) => s.removeJoinedId);
  const hasCreated = useDeviceStore((s) => s.hasCreated);
  const isHost = hasCreated(dumpId);

  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);
  const [memberCount, setMemberCount] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetchDump(dumpId);
  }, [dumpId]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        try {
          const deviceId = useDeviceStore.getState().ensureDeviceId();
          const stillIn = await isDeviceMemberOfDump(dumpId, deviceId);

          if (cancelled) return;

          if (!stillIn) {
            useDeviceStore.getState().removeJoinedId?.(dumpId);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              })
            );
            return;
          }

          await fetchDump(dumpId);
          const rows = await getDumpMembers(dumpId);
          if (!cancelled) setMemberCount(rows.length);
        } catch (e) {
          console.error('DumpDetail access check', e);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [dumpId, fetchDump, navigation])
  );

  const photos = current?.photoUrls ?? [];
  const photoItems = current?.photoItems ?? [];
  const cover = current?.image ?? photos[0] ?? null;

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  const handleLeave = async () => {
    try {
      const deviceId = useDeviceStore.getState().ensureDeviceId();
      await removeDumpMember({ dumpId, deviceId });
      removeJoinedId(dumpId);
      setLeaveOpen(false);
      goHome();
    } catch (e) {
      console.error('leave dump', e);
    }
  };

  const handleDeleteDump = async () => {
    try {
      setDeleteOpen(false);
      // await deleteDump(dumpId);
      // useDeviceStore.getState().removeCreatedId?.(dumpId);
      // goHome();
      console.warn('deleteDump not implemented yet');
    } catch (e) {
      console.error('delete dump', e);
    }
  };

  const handleDeletePhoto = async (photo: {
    id: string | null;
    url: string;
  }) => {
    if (!photo.id || !current?.id) {
      throw new Error('Photo not found.');
    }
    const id = current.id;

    await deletePhoto({
      dumpId: id,
      photoId: photo.id,
      url: photo.url,
    });

    setViewerIndex(null);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    await fetchDump(id);
  };

  if (loadingDetail && !current) {
    return (
      <View
        style={[styles.container, styles.loader, { paddingTop: insets.top }]}
      >
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  if (!current) {
    return (
      <View
        style={[styles.container, styles.loader, { paddingTop: insets.top }]}
      >
        <Text style={styles.emptyText}>DUMP NOT FOUND</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        showBack
        onBackPress={goHome}
        rightIcon="share"
        onRightIconPress={() =>
          navigation.navigate('Invite', { dumpId: current.id })
        }
        rightIcon2="more"
        onRightIcon2Press={() => setMenuOpen(true)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={cover ? { uri: cover } : undefined}
          style={styles.cover}
        >
          <View style={styles.coverOverlay} />

          {current.live && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}

          <View style={styles.textBackground} />

          <View style={styles.coverContent}>
            {!!current.date && (
              <Text style={styles.date}>{current.date}</Text>
            )}
            <Text style={styles.title}>{current.title}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.stats}>{current.photos}</Text>
              <Text style={styles.stats}>
                {memberCount} {memberCount === 1 ? 'PERSON' : 'PEOPLE'}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>EVERYONE’S POV</Text>
          <Pressable
            onPress={() =>
              navigation.navigate('SelectedPhotos', {
                dumpId: current.id,
                maxPhotos: 10,
                title: 'PHOTOS',
                confirmLabel: 'ADD PHOTOS',
              })
            }
          >
            <Text style={styles.rowActionAccent}>＋  ADD YOURS</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>MEMBERS</Text>
          <Pressable
            onPress={() =>
              navigation.navigate('Members', { dumpId: current.id })
            }
            hitSlop={8}
          >
            <Text style={styles.membersLink}>
              {memberCount} MEMBERS →
            </Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {photoItems.map((photo, index) => (
            <Pressable
              key={photo.id ?? photo.url + index}
              style={styles.photo}
              delayLongPress={120}
              onLongPress={() => setLongPressedIndex(index)}
              onPressOut={() => setLongPressedIndex(null)}
              onPress={() => setViewerIndex(index)}
            >
              <Image source={{ uri: photo.url }} style={styles.photoImage} />
            </Pressable>
          ))}
        </View>

        {photos.length === 0 && (
          <Text style={styles.noPhotos}>NO PHOTOS YET</Text>
        )}
      </ScrollView>

      {viewerIndex !== null && (
        <PhotoViewer
          visible
          initialIndex={viewerIndex}
          photos={photoItems}
          onClose={() => setViewerIndex(null)}
          onDelete={handleDeletePhoto}
        />
      )}

      <DumpOptionsSheet
        visible={menuOpen}
        isHost={isHost}
        onClose={() => setMenuOpen(false)}
        onEdit={() =>
          navigation.navigate('EditDump', { dumpId: current.id })
        }
        onLeave={() => setLeaveOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      <ConfirmSheet
        visible={leaveOpen}
        title={`Leave ${current.title}?`}
        message="You'll no longer see or contribute to this Dump."
        cancelLabel="CANCEL"
        confirmLabel="LEAVE"
        tone="danger"
        onCancel={() => setLeaveOpen(false)}
        onConfirm={handleLeave}
      />

      <ConfirmSheet
        visible={deleteOpen}
        title={`Delete ${current.title}?`}
        message="Photos and members will be removed. This can't be undone."
        cancelLabel="CANCEL"
        confirmLabel="DELETE"
        tone="danger"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDeleteDump}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#777',
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cover: {
    height: 440,
    justifyContent: 'flex-end',
    backgroundColor: '#111',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  textBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  coverContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    zIndex: 2,
  },
  liveBadge: {
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: Colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 2,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  date: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 48,
    lineHeight: 46,
    letterSpacing: -2,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 18,
  },
  stats: {
    color: '#aaa',
    fontSize: 13,
    letterSpacing: 1.3,
    fontWeight: '900',
  },
  row: {
    minHeight: 64,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#292929',
  },
  rowLabel: {
    color: '#777',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  rowActionAccent: {
    color: Colors.accent,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.1,
  },
  membersLink: {
    color: '#ccc',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photo: {
    width: '50%',
    height: 210,
    backgroundColor: '#111',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  noPhotos: {
    color: '#666',
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 40,
  },
});