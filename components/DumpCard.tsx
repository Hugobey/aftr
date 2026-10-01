import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import type { Dump } from '../data/dumps';

type Props = {
  dump: Dump;
  large?: boolean;
};

export default function DumpCard({ dump, large = false }: Props) {
  return (
    <ImageBackground
      source={{ uri: dump.image }}
      style={[styles.card, large ? styles.largeCard : styles.smallCard]}
      imageStyle={styles.cardImage}
    >
      {dump.live && (
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      )}

      {dump.host && (
        <View style={styles.hostBadge}>
          <Text style={styles.hostText}>HOST</Text>
        </View>
      )}

      <View style={styles.cardOverlay} />

      <View style={styles.cardContent}>
        <Text style={styles.cardDate}>{dump.date}</Text>

        <Text style={[styles.cardTitle, !large && styles.smallCardTitle]}>
          {dump.title}
        </Text>

        {large && (
          <View style={styles.stats}>
            <Text style={styles.stat}>{dump.photos}</Text>
            <Text style={styles.stat}>{dump.people}</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: '#111',
  },

  cardImage: {
    opacity: 0.87,
  },

  largeCard: {
    height: 480,
  },

  smallCard: {
    height: 320,
  },

  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.36)',
  },

  liveBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
    backgroundColor: Colors.accent,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  liveText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 13,
  },

  hostBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
    borderWidth: 1,
    borderColor: Colors.text,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  hostText: {
    color: Colors.text,
    fontWeight: '900',
    fontSize: 13,
  },

  cardContent: {
    position: 'absolute',
    bottom: 25,
    left: 26,
    right: 18,
  },

  cardDate: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 15,
  },

  cardTitle: {
    color: Colors.text,
    fontSize: 50,
    lineHeight: 48,
    letterSpacing: -2.4,
    fontWeight: '900',
  },

  smallCardTitle: {
    fontSize: 30,
    lineHeight: 28,
    letterSpacing: -1.2,
  },

  stats: {
    flexDirection: 'row',
    gap: 28,
    marginTop: 24,
  },

  stat: {
    color: '#aaa',
    fontSize: 13,
    letterSpacing: 1.4,
    fontWeight: '800',
  },
});
