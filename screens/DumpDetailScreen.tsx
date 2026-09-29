import { useState } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import Header from '../components/Header';
import { CommonActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'DumpDetail'>;

const COVER_PHOTO =
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=90';

const PHOTOS = [
  COVER_PHOTO,
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=85',
];

export default function DumpDetailScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const openViewer = (index: number) => setViewerIndex(index);
  const closeViewer = () => setViewerIndex(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
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
          navigation.navigate('Invite', { dumpId: 'no-sleep' })
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover */}
       <ImageBackground
        source={{ uri: `${COVER_PHOTO}&sat=-100` }}
        style={styles.cover}
        >
            {/* Soft overall darkening */}
            <View style={styles.coverOverlay} />

            {/* LIVE badge */}
            <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE</Text>
            </View>

            {/* Darker area just behind the text */}
            <View style={styles.textBackground} />

            {/* Cover content */}
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
          <Pressable>
            <Text style={styles.addYours}>＋  ADD YOURS</Text>
          </Pressable>
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
        <View style={[styles.viewer, { paddingTop: insets.top }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 0,
    },

    // Cover
    cover: {
        height: 440,
        justifyContent: 'flex-end',
    },
    coverOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.91)', // light overall darkening
    },
    textBackground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 220,               // adjusts how high the dark area goes
        backgroundColor: 'rgba(0,0,0,0.55)',
    },
    coverContent: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        zIndex: 2,                 // keeps text above the dark layer
    },
    liveBadge: {
        position: 'absolute',
        top: 24,
        left: 24,
        backgroundColor: Colors.accent,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    liveText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 0.5,
    },
    // coverContent: {
    //     paddingHorizontal: 24,
    //     paddingBottom: 32,
    // },
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

    // Grid Header
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

    // Photo Grid
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

    // Viewer
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
        right: 24,
        top: 16,
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        fontSize: 32,
        color: Colors.text,
        fontWeight: '200',
    },
    viewerHint: {
        position: 'absolute',
        bottom: 48,
        width: '100%',
        textAlign: 'center',
        color: '#777',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.4,
    },
});