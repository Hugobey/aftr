// components/PhotoViewer.tsx
import { useEffect, useRef } from 'react';
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
import ZoomableImage from './ZoomableImage';

type Props = {
  photos: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
};

const { width, height } = Dimensions.get('window');

export default function PhotoViewer({
  photos,
  initialIndex,
  visible,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible && listRef.current) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      });
    }
  }, [visible, initialIndex]);

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
          data={photos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, i) => uri + i}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={styles.page}>
              <ZoomableImage uri={item} />
              {/* <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="contain"
              /> */}
            </View>
          )}
        />

        <Pressable style={[styles.closeButton, { top: insets.top + 12 }]} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>

        <Text style={[styles.hint, { bottom: insets.bottom + 24 }]}>
          SWIPE FOR MORE · TAP × TO CLOSE
        </Text>
      </View>
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
  hint: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
});