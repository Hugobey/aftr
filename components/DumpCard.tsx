import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import type { Dump } from '../data/dumps';
import SkiaBwImage from './SkiaBwImage';

type Props = {
  dump: Dump;
  large?: boolean;
};

export default function DumpCard({ dump, large = false }: Props) {
  const coverUri = dump.image ?? dump.photoUrls?.[0] ?? null;
  const cardHeight = large ? 400 : 180;

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      {!!coverUri && (
        <SkiaBwImage
          key={coverUri}
          uri={coverUri}
          bw
          style={{ width: '100%', height: cardHeight }}
        />
      )}

      <View style={styles.imageOverlay} pointerEvents="none" />

      {large && (
        <>
          <View style={[styles.fade, styles.fade1]} />
          <View style={[styles.fade, styles.fade2]} />
          <View style={[styles.fade, styles.fade3]} />
          <View style={styles.bottomBlack} />
        </>
      )}

      <View style={styles.topRow}>
        {dump.live && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      <View style={[styles.content, !large && styles.contentSmall]}>
        <Text style={styles.date}>{dump.date}</Text>
        <Text style={[styles.title, !large && styles.titleSmall]}>
          {dump.title}
        </Text>

        {large && (
          <View style={styles.bottomRow}>
            <Text style={styles.stat}>{dump.photos}</Text>
            <Text style={styles.arrow}>↗</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'space-between',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  fade1: {
    bottom: 180,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  fade2: {
    bottom: 120,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  fade3: {
    bottom: 60,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  bottomBlack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.92)',
  },
  topRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 2,
  },
  liveBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  liveText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    zIndex: 2,
  },
  contentSmall: {
    paddingBottom: 16,
  },
  date: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    lineHeight: 36,
    letterSpacing: -1.5,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  titleSmall: {
    fontSize: 22,
    lineHeight: 24,
  },
  bottomRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stat: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  arrow: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
});