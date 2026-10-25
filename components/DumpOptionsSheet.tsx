import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type Props = {
  visible: boolean;
  isHost: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onLeave?: () => void;
  onDelete?: () => void;
};

export default function DumpOptionsSheet({
  visible,
  isHost,
  onClose,
  onEdit,
  onLeave,
  onDelete,
}: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  // Open / close animation
  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.setValue(SCREEN_HEIGHT);
      opacity.setValue(0);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 20,
          stiffness: 220,
          mass: 0.9,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible]);

  // Android hardware back
  useEffect(() => {
    if (!visible) return;

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => sub.remove();
  }, [visible, onClose]);

  if (!mounted) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={mounted}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        {/* Dim overlay (visual only) */}
        <Animated.View
          pointerEvents="none"
          style={[styles.backdrop, { opacity }]}
        />

        {/* Tappable area above the sheet */}
        <Pressable style={styles.flexFill} onPress={onClose} />

        {/* Bottom sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: insets.bottom + 20,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Dump options</Text>
          <View style={styles.divider} />

          {isHost && (
            <>
              <Pressable
                style={styles.row}
                onPress={() => {
                  onClose();
                  onEdit?.();
                }}
              >
                <Icon name="edit" size={20} color="#ccc" />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Edit dump</Text>
                  <Text style={styles.rowSub}>
                    Name, cover, date and uploads
                  </Text>
                </View>
              </Pressable>
              <View style={styles.divider} />
            </>
          )}

          {!isHost && (
            <>
              <Pressable
                style={styles.row}
                onPress={() => {
                  onClose();
                  onLeave?.();
                }}
              >
                <Icon name="arrow" size={20} color="#ccc" />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Leave dump</Text>
                  <Text style={styles.rowSub}>
                    Remove yourself from this dump
                  </Text>
                </View>
              </Pressable>
              <View style={styles.divider} />
            </>
          )}

          {isHost && (
            <Pressable
              style={styles.row}
              onPress={() => {
                onClose();
                onDelete?.();
              }}
            >
              <Icon name="trash" size={20} color="#E85A5A" />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, styles.danger]}>
                  Delete dump
                </Text>
                <Text style={styles.rowSub}>
                  Permanently delete this dump and its content
                </Text>
              </View>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.78)',
  },
  flexFill: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#222',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
    marginTop: 10,
    marginBottom: 14,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#2a2a2a',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 22,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rowSub: {
    color: '#777',
    fontSize: 13,
    marginTop: 4,
  },
  danger: {
    color: '#E85A5A',
  },
});