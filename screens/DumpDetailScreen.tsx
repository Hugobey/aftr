import { useState } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'DumpDetail'>;

const COVER_PHOTO =
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=90';

const PHOTOS = [
  COVER_PHOTO,
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=85',
];

export default function DumpDetailScreen({ navigation }: Props) {
  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const openViewer = (index: number) => setViewerIndex(index);
  const closeViewer = () => setViewerIndex(null);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.navigate('Invite', { dumpId: 'no-sleep' })}
        >
          <Text style={styles.shareText}>⇧</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <ImageBackground source={{ uri: COVER_PHOTO }} style={styles.cover}>
          <View style={styles.coverOverlay} />

          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>

          <View style={styles.coverContent}>
            <Text style={styles.date}>24 SEP 2026 · BROOKLYN</Text>
            <Text style={styles.title}>
              NO SLEEP{`\n`}TILL MONDAY
            </Text>
            <Text style={styles.stats}>186 PHOTOS      31 PEOPLE</Text>
          </View>
        </ImageBackground>

        {/* Grid Header */}
        <View style={styles.gridHeader}>
          <Text style={styles.gridLabel}>EVERYONE’S POV</Text>
          <Text style={styles.addYours}>＋  ADD YOURS</Text>
        </View>

        {/* Photo Grid */}
        <View style={styles.grid}>
          {PHOTOS.map((uri, index) => {
            const isColor = longPressedIndex === index;
            const imageUri = isColor ? uri : `${uri}&sat=-100`;

            return (
              <Pressable
                key={uri + index}
                style={styles.photo}
                onLongPress={() => setLongPressedIndex(index)}
                onPressOut={() => setLongPressedIndex(null)}
                onPress={() => openViewer(index)}
              >
                <Image source={{ uri: imageUri }} style={styles.photoImage} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Fullscreen Viewer */}
      <Modal
        visible={viewerIndex !== null}
        animationType="fade"
        transparent={false}
        onRequestClose={closeViewer}
      >
        <View style={styles.viewer}>
          <Image
            source={{
              uri: viewerIndex === null ? COVER_PHOTO : PHOTOS[viewerIndex],
            }}
            style={styles.viewerImage}
            resizeMode="contain"
          />

          <Pressable style={styles.closeButton} onPress={closeViewer}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          <Text style={styles.viewerHint}>TAP × TO CLOSE</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 100,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 54,
    color: Colors.text,
    fontWeight: '200',
    marginTop: -10,
  },
  shareText: {
    color: Colors.text,
    fontSize: 41,
    fontWeight: '200',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#222',
    marginHorizontal: 18,
  },
  cover: {
    height: 520,
    justifyContent: 'flex-end',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  liveBadge: {
    position: 'absolute',
    top: 30,
    left: 32,
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  liveText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
  },
  coverContent: {
    padding: 32,
    paddingBottom: 40,
  },
  date: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.7,
    marginBottom: 20,
  },
  title: {
    color: Colors.text,
    fontSize: 56,
    lineHeight: 52,
    letterSpacing: -2.5,
    fontWeight: '900',
  },
  stats: {
    color: '#aaa',
    fontSize: 14,
    letterSpacing: 1.3,
    fontWeight: '900',
    marginTop: 24,
  },
  gridHeader: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
    height: 90,
    marginHorizontal: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridLabel: {
    color: '#999',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.7,
  },
  addYours: {
    color: Colors.accent,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    padding: 18,
  },
  photo: {
    width: '49.4%',
    height: 220,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  viewer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  viewerImage: {
    width: '100%',
    height: '78%',
  },
  closeButton: {
    position: 'absolute',
    right: 26,
    top: 65,
    width: 54,
    height: 54,
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 38,
    color: Colors.text,
    fontWeight: '200',
  },
  viewerHint: {
    position: 'absolute',
    bottom: 55,
    width: '100%',
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});