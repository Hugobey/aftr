import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}
          onPress={(e) => e.stopPropagation()}
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
                <Text style={styles.icon}>✎</Text>
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
                <Text style={styles.icon}>↗</Text>
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
              <Text style={[styles.icon, styles.iconDanger]}>⌫</Text>
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
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
  icon: {
    color: '#ccc',
    fontSize: 18,
    width: 24,
    marginTop: 2,
  },
  iconDanger: {
    color: '#E85A5A',
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