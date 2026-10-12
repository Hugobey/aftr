import { useEffect, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';

import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import Header from '../components/Header';
import PhotoViewer from '../components/PhotoViewer';
import { useDumpsStore } from '../store/dumpStore';

type Props = NativeStackScreenProps<RootStackParamList, 'DumpDetail'>;

export default function DumpDetailScreen({ navigation, route }: Props) {
  const { dumpId } = route.params;
  const insets = useSafeAreaInsets();

  const current = useDumpsStore((s) => s.current);
  const loadingDetail = useDumpsStore((s) => s.loadingDetail);
  const fetchDump = useDumpsStore((s) => s.fetchDump);
  const clearCurrent = useDumpsStore((s) => s.clearCurrent);

  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchDump(dumpId);
  }, [dumpId]);

  const photos = current?.photoUrls ?? [];
  const cover = current?.image ?? photos[0] ?? null;
  const coverBw = cover;

  console.log('cover pic in DUMP detail?', cover)

  if (loadingDetail && !current) {
    return (
      <View style={[styles.container, styles.loader, { paddingTop: insets.top }]}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  if (!current) {
    return (
      <View style={[styles.container, styles.loader, { paddingTop: insets.top }]}>
        <Text style={styles.emptyText}>DUMP NOT FOUND</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        showBack
        onBackPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          );
        }}
        rightIcon="share"
        onRightIconPress={() =>
          navigation.navigate('Invite', { dumpId: current.id })
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={coverBw ? { uri: coverBw } : undefined}
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
            <Text style={styles.stats}>{current.photos}</Text>
          </View>
        </ImageBackground>

        <View style={styles.gridHeader}>
          <Text style={styles.gridLabel}>EVERYONE’S POV</Text>
          <Pressable
            onPress={() =>
              navigation.navigate('SelectedPhotos', {
                maxPhotos: 10,
                title: 'PHOTOS',
                confirmLabel: 'ADD PHOTOS',
              })
            }
          >
            <Text style={styles.addYours}>＋  ADD YOURS</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {photos.map((uri, index) => {
            const isColor = longPressedIndex === index;
            const canBw = uri.includes('unsplash.com');
            const imageUri =
              !isColor && canBw ? `${uri}&sat=-100` : uri;

            return (
              <Pressable
                key={uri + index}
                style={styles.photo}
                delayLongPress={120}
                onLongPress={() => setLongPressedIndex(index)}
                onPressOut={() => setLongPressedIndex(null)}
                onPress={() => setViewerIndex(index)}
              >
                <Image source={{ uri: imageUri }} style={styles.photoImage} />
              </Pressable>
            );
          })}
        </View>

        {photos.length === 0 && (
          <Text style={styles.noPhotos}>NO PHOTOS YET</Text>
        )}
      </ScrollView>

      <PhotoViewer
        visible={viewerIndex !== null}
        initialIndex={viewerIndex ?? 0}
        photos={photos}
        onClose={() => setViewerIndex(null)}
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
    paddingBottom: 0,
  },
  cover: {
    height: 440,
    justifyContent: 'flex-end',
    backgroundColor: '#111',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  textBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.55)',
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
    fontSize: 52,
    lineHeight: 48,
    letterSpacing: -2.2,
    fontWeight: '900',
  },
  stats: {
    color: '#aaa',
    fontSize: 13,
    letterSpacing: 1.3,
    fontWeight: '900',
    marginTop: 20,
  },
  gridHeader: {
    height: 72,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  gridLabel: {
    color: '#999',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.6,
  },
  addYours: {
    color: Colors.accent,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.1,
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