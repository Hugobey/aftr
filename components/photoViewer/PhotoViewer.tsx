import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ConfirmSheet from '../ConfirmSheet';
import ZoomableImage from '../ZoomableImage';
import PhotoActionSheet from './PhotoActionSheet';
import PhotoViewerChrome from './PhotoViewerChrome';
import type { ViewerPhoto } from './types';
import {
  copyPhotoToClipboard,
  savePhotoToLibrary,
} from '../../components/photoViewer/utils/photoActions';

export type { ViewerPhoto };

type Props = {
  photos: ViewerPhoto[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
  onDelete: (photo: ViewerPhoto) => Promise<void>;
  canDeletePhoto: (photo: ViewerPhoto) => boolean;
  onReport?: (photo: ViewerPhoto) => Promise<void>;
};

const { width, height } = Dimensions.get('window');

export default function PhotoViewer({
  photos,
  initialIndex,
  visible,
  onClose,
  onDelete,
  canDeletePhoto,
  onReport,
}: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [displayPhotos, setDisplayPhotos] = useState(photos);
  const [chromeVisible, setChromeVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1600);
  };

  useEffect(() => {
    setDisplayPhotos(photos);
  }, [photos]);

  useEffect(() => {
    if (!visible) {
      setChromeVisible(false);
      setMenuOpen(false);
      setDeleteOpen(false);
      setError(null);
      return;
    }
    setActiveIndex(initialIndex);
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: initialIndex, animated: false });
    });
  }, [visible, initialIndex]);

  const activePhoto = displayPhotos[activeIndex];
  const showDelete = !!activePhoto && canDeletePhoto(activePhoto);

  const toggleChrome = () => {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    setChromeVisible((v) => !v);
  };

  const handleSave = async () => {
    console.log('entering handleSave')
    if (!activePhoto?.url) return;
    setBusy(true);
    setError(null);
    try {
      await savePhotoToLibrary(activePhoto.url);
      setMenuOpen(false);
      Alert.alert('Saved', 'Photo saved to your library.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save photo.');
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    if (!activePhoto?.url || copying) return;
    setCopying(true);
    setError(null);
    try {
      await copyPhotoToClipboard(activePhoto.url);
      setMenuOpen(false);
      showToast('Photo copied');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not copy photo.');
    } finally {
      setCopying(false);
    }
  };

  const handleShare = async () => {
    if (!activePhoto?.url) return;
    try {
      await Share.share({ message: activePhoto.url, url: activePhoto.url });
      setMenuOpen(false);
    } catch {
      // dismissed
    }
  };

  const handleReport = () => {
    if (!activePhoto) return;
    setMenuOpen(false);

    Alert.alert(
      'Report photo',
      'Report this photo as objectionable content? We’ll open an email so you can send it to the team.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: async () => {
            const photoId = activePhoto.id ?? 'unknown';
            const photoUrl = activePhoto.url ?? '';
            const subject = encodeURIComponent(`AFTR report — photo ${photoId}`);
            const body = encodeURIComponent(
              [
                'I want to report this photo as objectionable.',
                '',
                `Photo ID: ${photoId}`,
                `Photo URL: ${photoUrl}`,
                '',
                'Additional details:',
                '',
              ].join('\n'),
            );
            const mailUrl = `mailto:hugo@joinaftr.app?subject=${subject}&body=${body}`;
            try {
              const can = await Linking.canOpenURL(mailUrl);
              if (!can) {
                setError('No mail app available.');
                return;
              };
              await Linking.openURL(mailUrl);
            } catch {
              setError('Could not open mail app.');
            };
          },
        },
      ],
    );
  };

  const handleDelete = async () => {
    if (!activePhoto) return;
    setDeleting(true);
    setError(null);
    try {
      await onDelete(activePhoto);
      setDeleteOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete photo.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={[styles.viewer, { paddingTop: insets.top }]}>
        <FlatList
          ref={listRef}
          data={displayPhotos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(p, i) => p.id ?? p.url + i}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
            setMenuOpen(false);
          }}
          renderItem={({ item, index }) => (
            <Pressable style={styles.page} onPress={toggleChrome}>
              <ZoomableImage uri={item.url} isActive={index === activeIndex} />
            </Pressable>
          )}
        />

        {chromeVisible && (
          <PhotoViewerChrome
            top={insets.top + 8}
            onClose={onClose}
            onMore={() => setMenuOpen(true)}
          />
        )}

        {chromeVisible && (
          <Text style={[styles.hint, { bottom: insets.bottom + 24 }]}>
            {activeIndex + 1} / {displayPhotos.length}
          </Text>
        )}

        {!!error && (
          <Text style={[styles.error, { bottom: insets.bottom + 48 }]}>{error}</Text>
        )}
      </View>

      <PhotoActionSheet
        visible={menuOpen}
        busy={busy}
        showDelete={showDelete}
        onClose={() => setMenuOpen(false)}
        onSave={handleSave}
        onCopy={handleCopy}
        onShare={handleShare}
        onReport={handleReport}
        copying={copying}
        saving={saving}
        onDelete={() => {
          setMenuOpen(false);
          setDeleteOpen(true);
        }}
      />

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
      {!!toast && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewer: { flex: 1, backgroundColor: '#000' },
  page: {
    width,
    height: height * 0.85,
    justifyContent: 'center',
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
    width: '100%',
    color: '#E85A5A',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 120,
    backgroundColor: 'rgba(20,20,20,0.92)',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 18,
    paddingVertical: 12,
    zIndex: 20,
  },
  toastText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});