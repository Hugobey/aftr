import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

type Props = {
  top: number;
  onClose: () => void;
  onMore: () => void;
};

export default function PhotoViewerChrome({ top, onClose, onMore }: Props) {
  return (
    <View style={[styles.bar, { top }]} pointerEvents="box-none">
      <Pressable style={styles.btn} onPress={onClose} accessibilityLabel="Close">
        <Text style={styles.close}>×</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={onMore} accessibilityLabel="More">
        <Text style={styles.more}>⋯</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  btn: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  close: {
    fontSize: 32,
    color: Colors.text,
    fontWeight: '200',
    marginTop: -2,
  },
  more: {
    fontSize: 28,
    color: Colors.text,
    fontWeight: '700',
    marginTop: -8,
  },
});