// components/ConfirmContent.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

type Props = {
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

export default function ConfirmContent({
  title,
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  const confirmColor = tone === 'danger' ? '#E85A5A' : Colors.accent;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>

      {!!message && <Text style={styles.message}>{message}</Text>}

      <View style={styles.rule} />

      <View style={styles.actions}>
        <Pressable onPress={onCancel} disabled={loading} hitSlop={12}>
          <Text style={styles.cancel}>{cancelLabel}</Text>
        </Pressable>

        <Pressable onPress={onConfirm} disabled={loading} hitSlop={12}>
          <Text style={[styles.confirm, { color: confirmColor }]}>
            {loading ? '…' : confirmLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24,
    paddingBottom: 8,
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