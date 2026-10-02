import { useState, useEffect } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import Header from '../components/Header';
import { pickImages } from '../utils/pickImages';
import { useCreateDumpStore } from '../store/createDumpStore';
import { createDump, addPhotosToDump } from '../lib/dump';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectedPhotos'>;

const { width } = Dimensions.get('window');
const GAP = 4;
const COLS = 3;
const HORIZONTAL_PADDING = 20;   // left + right padding of the content
const ITEM_SIZE = (width - HORIZONTAL_PADDING * 2 - GAP * (COLS - 1)) / COLS;

export default function SelectedPhotosScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const {
    maxPhotos = 10,
    title = 'SELECTED PHOTOS',
    confirmLabel = 'CONFIRM',
  } = route.params ?? {};

  const [loading, setLoading] = useState(false);

  const {
    name,
    coverUri,
    isOpen,
    photoUris,
    addPhotoUris,
    removePhotoUri,
    reset,
  } = useCreateDumpStore();

  const canAddMore = photoUris.length < maxPhotos;

  const handleAddMore = async () => {
    const remaining = maxPhotos - photoUris.length;
    if (remaining <= 0) return;

    const newUris = await pickImages({
      multiple: true,
      limit: remaining,
    });

    if (newUris.length > 0) {
      addPhotoUris(newUris);
    }
  };

  const handleRemove = (index: number) => {
    removePhotoUri(index);
  };

  const handleConfirm = async () => {
    if (loading) return;

    try {
      setLoading(true);

      console.log('=== CREATE DUMP DEBUG ===', {
        name,
        coverUri,
        isOpen,
        photoUris,
      });

      const dump = await createDump({
        name,
        coverUri,
        isOpen,
        date: new Date().toISOString().split('T')[0],
      });

      if (photoUris.length > 0) {
        await addPhotosToDump(dump.id, photoUris);
      };

      reset();
      navigation.replace('DumpDetail', { dumpId: dump.id });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not create the dump. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header showBack rightLabel={`${photoUris.length}/${maxPhotos}`} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>{title}</Text>
        <Text style={styles.subtitle}>
          {photoUris.length === 0
            ? 'No photos selected yet'
            : `${photoUris.length} photo${photoUris.length > 1 ? 's' : ''} selected`}
        </Text>

        <View style={styles.grid}>
          {photoUris.map((uri, index) => (
            <View key={uri + index} style={styles.item}>
              <Image source={{ uri }} style={styles.image} />
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemove(index)}
              >
                <Text style={styles.removeText}>×</Text>
              </Pressable>
            </View>
          ))}

          {canAddMore && (
            <Pressable style={styles.addButton} onPress={handleAddMore}>
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addLabel}>ADD</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[
            styles.confirmButton,
            loading && styles.confirmButtonDisabled,
          ]}
          disabled={loading}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>
            {loading ? 'CREATING...' : `${confirmLabel}  ↗`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 24,
    paddingBottom: 40,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE, // slightly taller looks better for photos    backgroundColor: '#111',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
    marginTop: -2,
  },
  addButton: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  addIcon: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '200',
  },
  addLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 6,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#222',
    backgroundColor: Colors.background,
  },
  confirmButton: {
    height: 64,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#222',
  },
  confirmText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },
  confirmTextDisabled: {
    color: '#666',
  },
});