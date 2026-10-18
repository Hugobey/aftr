// components/PhotoViewer.tsx
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import ConfirmSheet from './ConfirmSheet';
import ZoomableImage from './ZoomableImage';

export type ViewerPhoto = {
  id: string | null;
  url: string;
};

type Props = {
  photos: ViewerPhoto[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
  onDelete: (photo: ViewerPhoto) => Promise<void>;
};

const { width, height } = Dimensions.get('window');

export default function PhotoViewer({
  photos,
  initialIndex,
  visible,
  onClose,
  onDelete,
}: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [displayPhotos, setDisplayPhotos] = useState(photos);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setDisplayPhotos(photos);
  }, [photos]);

  useEffect(() => {
    if (visible && listRef.current) {
      setActiveIndex(initialIndex);
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      });
    }
  }, [visible, initialIndex]);

  const activePhoto = displayPhotos[activeIndex];

  const handleDelete = async () => {
    console.log('trigger DELETE')
    if (!activePhoto) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(activePhoto);
      console.log('delete ok, calling onClose');
      setDeleteOpen(false);
      // onClose(); // always return to DumpDetail
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : 'Could not delete photo.'
      );
    } finally {
      setDeleting(false);
    };
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.viewer, { paddingTop: insets.top }]}>
        <FlatList
          ref={listRef}
          data={displayPhotos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(photo, i) => photo.id ?? photo.url + i}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
          renderItem={({ item, index }) => (
            <View style={styles.page}>
             <ZoomableImage
              uri={item.url}
              isActive={index === activeIndex}
            />
             
            </View>
          )}
        />

        <Pressable style={[styles.closeButton, { top: insets.top + 12 }]} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>

        {!!activePhoto?.id && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete photo"
            style={[styles.deleteButton, { top: insets.top + 12 }]}
            onPress={() => {
              setDeleteError(null);
              setDeleteOpen(true);
            }}
          >
            <View style={styles.trashLid} />
            <View style={styles.trashBody} />
          </Pressable>
        )}

        <Text style={[styles.hint, { bottom: insets.bottom + 24 }]}>
          SWIPE FOR MORE · TAP × TO CLOSE
        </Text>

        {!!deleteError && <Text style={styles.error}>{deleteError}</Text>}
      </View>

      <ConfirmSheet
        visible={deleteOpen}
        title="Delete this photo?"
        message="This can’t be undone."
        cancelLabel="CANCEL"
        confirmLabel="DELETE"
        tone="danger"
        loading={deleting}
        onCancel={() => !deleting && setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
    backgroundColor: '#000',
  },
  page: {
    width,
    height: height * 0.85,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
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
  deleteButton: {
    position: 'absolute',
    left: 24,
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashLid: {
    width: 18,
    height: 3,
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  trashBody: {
    width: 14,
    height: 17,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: '#fff',
  },
  hint: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  error: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    color: '#E85A5A',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
});
