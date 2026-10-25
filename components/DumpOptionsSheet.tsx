// components/DumpOptionsSheet.tsx
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Sheet from './Sheet';
import ConfirmContent from './ConfirmContent';
import Icon from './Icon';

type Step = 'options' | 'confirm-delete' | 'confirm-leave';

type Props = {
  visible: boolean;
  isHost: boolean;
  loading?: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onLeave?: () => void;
  onDelete?: () => void;
};

export default function DumpOptionsSheet({
  visible,
  isHost,
  loading = false,
  onClose,
  onEdit,
  onLeave,
  onDelete,
}: Props) {
  const [step, setStep] = useState<Step>('options');

  // Reset every time the sheet is opened
  useEffect(() => {
    if (visible) setStep('options');
  }, [visible]);

  return (
    <Sheet visible={visible} onClose={onClose}>
      {step === 'options' && (
        <>
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
              {/* ✅ stay in same Sheet — only change step */}
              <Pressable
                style={styles.row}
                onPress={() => setStep('confirm-leave')}
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
              onPress={() => setStep('confirm-delete')}
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
        </>
      )}

      {step === 'confirm-leave' && (
        <ConfirmContent
          title="Leave this dump?"
          message="You will lose access until someone invites you again."
          confirmLabel="LEAVE"
          cancelLabel="CANCEL"
          tone="danger"
          loading={loading}
          onCancel={() => setStep('options')}
          onConfirm={() => onLeave?.()}
        />
      )}

      {step === 'confirm-delete' && (
        <ConfirmContent
          title="Delete this dump?"
          message="This cannot be undone. All photos in this dump will be removed."
          confirmLabel="DELETE"
          cancelLabel="CANCEL"
          tone="danger"
          loading={loading}
          onCancel={() => setStep('options')}
          onConfirm={() => onDelete?.()}
        />
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
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