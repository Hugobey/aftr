import { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../constants/Colors';
import type { RootStackParamList } from '../App';
import Header from '../components/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const COVER =
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=85&sat=-100';

const CARDS = [
  {
    title: 'NO SLEEP\nTILL MONDAY',
    date: '24 SEP 2026 · 186 PHOTOS',
    people: '31 PEOPLE',
    image: COVER,
    live: true,
  },
  {
    title: 'ROOFTOP\nSEASON',
    date: '11 JUL 2026',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=85&sat=-100',
  },
  {
    title: 'NYE.\nNO CONTEXT',
    date: '01 JAN 2026',
    image:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=85&sat=-100',
  },
];

export default function HomeScreen({ navigation }: Props) {
  // Temporary toggle for styling. Will be replaced by real data later.
  const [showDumps, setShowDumps] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
        <Header
            variant="home"
            onPlusPress={() => navigation.navigate('CreateDump')}
            onScanPress={() => navigation.navigate('JoinDump')}
            onLogoLongPress={() => setShowDumps((prev) => !prev)}
        />

      <View style={styles.divider} />

      {showDumps ? (
        <DumpList navigation={navigation} />
      ) : (
        <EmptyState navigation={navigation} />
      )}
    </SafeAreaView>
  );
}

/* -------------------- Empty State -------------------- */

function EmptyState({ navigation }: Pick<Props, 'navigation'>) {
  return (
    <View style={styles.empty}>
      <View>
        <Text style={styles.eyebrow}>NO RECAPS. JUST PROOF.</Text>

        <Text style={styles.hero}>
          THE PARTY{`\n`}LIVES ON{`\n`}AFTR
          <Text style={styles.dot}>.</Text>
        </Text>

        <Text style={styles.subhead}>
          Create or join a Dump to get started
        </Text>
      </View>

      <View style={styles.emptyActions}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('CreateDump')}
        >
          <Text style={styles.primaryText}>CREATE A DUMP</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('JoinDump')}
        >
          <Text style={styles.secondaryText}>JOIN A DUMP</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* -------------------- Dump List -------------------- */

function DumpList({ navigation }: Pick<Props, 'navigation'>) {
  return (
    <ScrollView
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.listEyebrow}>
        YOUR NIGHT, EVERY POV <Text style={styles.count}>03</Text>
      </Text>

      <Text style={styles.listTitle}>DUMPS</Text>

      {/* Large featured card */}
      <Pressable
        onPress={() =>
          navigation.navigate('DumpDetail', { dumpId: 'no-sleep' })
        }
      >
        <DumpCard item={CARDS[0]} large />
      </Pressable>

      {/* Two smaller cards */}
      <View style={styles.twoCards}>
        {CARDS.slice(1).map((item) => (
          <Pressable
            key={item.title}
            style={styles.halfCard}
            onPress={() =>
              navigation.navigate('DumpDetail', { dumpId: item.title })
            }
          >
            <DumpCard item={item} />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.joinButton}
        onPress={() => navigation.navigate('JoinDump')}
      >
        <Text style={styles.joinText}>⌗  JOIN A DUMP</Text>
      </Pressable>
    </ScrollView>
  );
}

/* -------------------- Dump Card -------------------- */

function DumpCard({
  item,
  large = false,
}: {
  item: (typeof CARDS)[number];
  large?: boolean;
}) {
  return (
    <ImageBackground
      source={{ uri: item.image }}
      style={[styles.card, large ? styles.largeCard : styles.smallCard]}
      imageStyle={styles.cardImage}
    >
      {item.live && (
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      )}

      <View style={styles.cardOverlay} />

      <View style={styles.cardContent}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={[styles.cardTitle, !large && styles.smallCardTitle]}>
          {item.title}
        </Text>
        {item.people && <Text style={styles.people}>{item.people}</Text>}
      </View>
    </ImageBackground>
  );
}

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 104,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#222',
    marginHorizontal: 18,
  },

  // Empty State
  empty: {
    flex: 1,
    paddingHorizontal: 42,
    paddingTop: '0%',
    justifyContent: 'space-between',
    // paddingBottom: 28,
  },
  eyebrow: {
    color: '#999',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  hero: {
    color: Colors.text,
    fontSize: 67,
    lineHeight: 58,
    letterSpacing: -3.4,
    fontWeight: '900',
    marginTop: 32,
  },
  dot: {
    color: Colors.accent,
  },
  subhead: {
    color: '#999',
    fontSize: 20,
    marginTop: 40,
  },
  emptyActions: {
    gap: 18,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  primaryText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  secondaryButton: {
    borderColor: Colors.text,
    borderWidth: 1,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  secondaryText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '900',
  },

  // Dump List
  list: {
    padding: 26,
    paddingBottom: 50,
  },
  listEyebrow: {
    color: Colors.accent,
    fontSize: 15,
    letterSpacing: 2.4,
    fontWeight: '900',
    marginTop: 32,
  },
  count: {
    color: '#777',
    marginLeft: 15,
  },
  listTitle: {
    color: Colors.text,
    fontSize: 66,
    lineHeight: 70,
    fontWeight: '900',
    letterSpacing: -3,
    marginBottom: 30,
  },
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
  people: {
    color: '#aaa',
    fontSize: 13,
    letterSpacing: 1.4,
    fontWeight: '800',
    marginTop: 24,
  },
  twoCards: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },
  halfCard: {
    flex: 1,
  },
  joinButton: {
    height: 100,
    borderColor: Colors.text,
    borderWidth: 1,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: {
    color: Colors.text,
    fontWeight: '900',
    fontSize: 17,
    letterSpacing: 0.2,
  },
});