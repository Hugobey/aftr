// PhotoActionSheet.tsx
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  saving?: boolean;
  copying?: boolean;
  showDelete?: boolean;
  busy?: boolean;
  onClose: () => void;
  onSave: () => void;
  onCopy: () => void;
  onShare: () => void;
  onReport: () => void;
  onDelete?: () => void;
};

export default function PhotoActionSheet({
  visible,
  saving,
  copying,
  showDelete,
  busy,
  onClose,
  onSave,
  onCopy,
  onShare,
  onReport,
  onDelete,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.handle} />

          <Row
            label={saving ? 'Saving…' : 'Save photo'}
            disabled={saving}
            onPress={onSave}
          />
          <Row
            label={copying ? 'Copying…' : 'Copy photo'}
            disabled={copying}
            onPress={onCopy}
          />
          <Row label="Share" onPress={onShare} />
          <Row label="Report" onPress={onReport} />
          {showDelete && onDelete && (
            <Row label="Delete" danger onPress={onDelete} />
          )}
        </View>
      </View>
    </Modal>
  );
}

function Row({
  label,
  onPress,
  danger,
  disabled,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && !disabled && styles.rowPressed,
        disabled && styles.rowDisabled,
      ]}
    >
      <Text style={[styles.rowText, danger && styles.danger]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: '#111',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
    marginBottom: 10,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222',
  },
  rowPressed: {
    backgroundColor: '#1c1c1c',
  },
  rowDisabled: {
    opacity: 0.45,
  },
  rowText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  danger: {
    color: '#E85A5A',
  },
});