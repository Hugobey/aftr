import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 'danger' = red confirm (leave / delete) */
  tone?: 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  const insets = useSafeAreaInsets();
  const confirmColor = tone === 'danger' ? '#E85A5A' : Colors.accent;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <View style={styles.handle} />

          <Text style={styles.title}>{title}</Text>

          {!!message && (
            <Text style={styles.message}>{message}</Text>
          )}

          <View style={styles.rule} />

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              disabled={loading}
              hitSlop={12}
            >
              <Text style={styles.cancel}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={loading}
              hitSlop={12}
            >
              <Text style={[styles.confirm, { color: confirmColor }]}>
                {loading ? '…' : confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
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
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    width: '100%',
    backgroundColor: '#0A0A0A',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2A2A2A',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 3,
    backgroundColor: '#333',
    marginBottom: 22,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  message: {
    color: '#777',
    fontSize: 15,
    marginTop: 10,
    lineHeight: 21,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#222',
    marginTop: 28,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 28,
    paddingTop: 12,
  },
  cancel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  confirm: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
});