import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import type { Dump } from '../data/dumps';

type Props = {
  dump: Dump;
  large?: boolean;
};

export default function DumpCard({
  dump,
  large = false,
}: Props) {
  const role = dump.host ? 'HOST' : 'JOINED';

  return (
    <ImageBackground
      source={{ uri: dump.image }}
      style={[
        styles.card,
        large ? styles.largeCard : styles.smallCard,
      ]}
      imageStyle={styles.cardImage}
    >
      {/* Image darkness */}
      <View style={styles.imageOverlay} />

      {/* Image → black transition */}
      {large && (
        <>
          <View style={[styles.fade, styles.fade1]} />
          <View style={[styles.fade, styles.fade2]} />
          <View style={[styles.fade, styles.fade3]} />

          <View style={styles.bottomBlack} />
        </>
      )}

      {/* =========================================
          THIS ENTIRE CARD MOVES WITH THE FLATLIST
          ========================================= */}

      <View style={styles.topRow}>
        <View style={styles.badges}>
          {dump.live && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>
                LIVE
              </Text>
            </View>
          )}

          <View
            style={[
              styles.roleBadge,
              dump.host
                ? styles.hostBadge
                : styles.joinedBadge,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                dump.host
                  ? styles.hostText
                  : styles.joinedText,
              ]}
            >
              {role}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom content also moves */}
      <View
        style={[
          styles.content,
          !large && styles.contentSmall,
        ]}
      >
        <Text style={styles.date}>
          {dump.date}
        </Text>

        <Text
          style={[
            styles.title,
            !large && styles.titleSmall,
          ]}
        >
          {dump.title}
        </Text>

        {large && (
          <View style={styles.bottomRow}>
            <View style={styles.stats}>
              <Text style={styles.stat}>
                {dump.photos}
              </Text>

              <Text style={styles.stat}>
                {dump.people}
              </Text>
            </View>

            <Text style={styles.arrow}>
              ↗
            </Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#444',

    justifyContent: 'space-between',
  },

  largeCard: {
    height: 400,
  },

  smallCard: {
    height: 180,
  },

  cardImage: {
    opacity: 0.9,
    resizeMode: 'cover',
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },

  /*
   * Image → black transition
   */
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  fade1: {
    top: 330,
    height: 110,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },

  fade2: {
    top: 390,
    height: 130,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },

  fade3: {
    top: 460,
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },

  bottomBlack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.94)',
  },

  /*
   * Moving with the card
   */
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    paddingHorizontal: 25,
    paddingTop: 24,

    zIndex: 2,
  },

  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  liveBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },

  liveText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.6,
  },

  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    minHeight: 44,
    justifyContent: 'center',
  },

  hostBadge: {
    backgroundColor: Colors.accent,
  },

  joinedBadge: {
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderWidth: 1,
    borderColor: '#777',
  },

  roleText: {
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.6,
  },

  hostText: {
    color: '#000',
  },

  joinedText: {
    color: '#fff',
  },

  /*
   * Moving with the card
   */
  content: {
    paddingHorizontal: 20,
    paddingBottom: 38,

    zIndex: 2,
  },

  contentSmall: {
    paddingHorizontal: 20,
    paddingBottom: 22,
  },

  date: {
    color: Colors.accent,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 17,
  },

  title: {
    color: '#fff',
    fontSize: 40,
    lineHeight: 39,
    letterSpacing: -3.5,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  titleSmall: {
    fontSize: 24,
    lineHeight: 25,
    letterSpacing: -1,
  },

  bottomRow: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 34,
  },

  stat: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  arrow: {
    color: '#fff',
    fontSize: 45,
    lineHeight: 42,
    fontWeight: '300',
  },
});