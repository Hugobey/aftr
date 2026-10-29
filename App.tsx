// App.tsx
import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  type LinkingOptions,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Linking, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { Colors } from './constants/Colors';
import { useDeviceStore } from './store/deviceStore';
import { useDumpsStore } from './store/dumpStore';
import { parseJoinCode } from './utils/parseJoinCode';

import HomeScreen from './screens/HomeScreen';
import CreateDumpScreen from './screens/CreateDumpScreen';
import JoinDumpScreen from './screens/JoinDumpScreen';
import DumpDetailScreen from './screens/DumpDetailScreen';
import InviteScreen from './screens/InviteScreen';
import SelectedPhotosScreen from './screens/SelectedPhotoScreen';
import MembersScreen from './screens/MemberScreen';
import JoinProfileScreen from './screens/JoinProfileScreen';
import HostProfileScreen from './screens/HostProfileScreen';
import EditDumpScreen from './screens/EditDumpScreen';
import LegalGateScreen from './screens/LegalGateScreen';

export type RootStackParamList = {
  Home: undefined;
  CreateDump: undefined;
  JoinDump: { inviteCode?: string } | undefined;
  DumpDetail: { dumpId: string };
  Members: { dumpId: string };
  Invite: { dumpId: string };
  JoinProfile: { dumpId: string; dumpName?: string; inviteCode?: string };
  HostProfile: undefined;
  EditDump: { dumpId: string };
  SelectedPhotos: {
    dumpId?: string;
    maxPhotos?: number;
    title?: string;
    confirmLabel?: string;
    initialUris?: string[];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['aftr://', 'https://joinaftr.app'],
  config: {
    screens: {
      JoinDump: 'join/:inviteCode',
    },
  },
};

function captureJoinCodeFromUrl(url: string | null) {
  if (!url) return;
  const code = parseJoinCode(url);
  if (code) {
    useDeviceStore.getState().setPendingJoinCode(code);
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  );
}

function Root() {
  const hydrated = useDeviceStore((s) => s.hydrated);
  const legalAcceptedAt = useDeviceStore((s) => s.legalAcceptedAt);
  const normalizeCreatedIds = useDeviceStore((s) => s.normalizeCreatedIds);
  const fetchDumps = useDumpsStore((s) => s.fetchDumps);

  // Capture deep link even before legal / navigation
  useEffect(() => {
    Linking.getInitialURL().then(captureJoinCodeFromUrl);
    const sub = Linking.addEventListener('url', ({ url }) => {
      captureJoinCodeFromUrl(url);
    });
    return () => sub.remove();
  }, []);

  // Clipboard → pending (helps after install from join page)
  useEffect(() => {
    if (!hydrated) return;
    (async () => {
      try {
        const raw = await Clipboard.getStringAsync();
        const code = parseJoinCode(raw);
        if (code) {
          useDeviceStore.getState().setPendingJoinCode(code);
        }
      } catch {
        // ignore
      }
    })();
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || !legalAcceptedAt) return;
    normalizeCreatedIds();
    fetchDumps();
  }, [hydrated, legalAcceptedAt, normalizeCreatedIds, fetchDumps]);

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
  }

  if (!legalAcceptedAt) {
    return (
      <LegalGateScreen
        onAccepted={() => {
          // legalAcceptedAt is set inside the screen / store
        }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer linking={linking}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateDump" component={CreateDumpScreen} />
          <Stack.Screen name="JoinDump" component={JoinDumpScreen} />
          <Stack.Screen name="DumpDetail" component={DumpDetailScreen} />
          <Stack.Screen name="Invite" component={InviteScreen} />
          <Stack.Screen name="SelectedPhotos" component={SelectedPhotosScreen} />
          <Stack.Screen name="Members" component={MembersScreen} />
          <Stack.Screen name="JoinProfile" component={JoinProfileScreen} />
          <Stack.Screen name="HostProfile" component={HostProfileScreen} />
          <Stack.Screen name="EditDump" component={EditDumpScreen} />
        </Stack.Navigator>

        {/* Runs only when navigator exists; consumes pending code */}
        <PendingJoinHandler />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

/**
 * After legal + nav ready: pending code → profile or dump.
 * Avoids empty Home for QR / clipboard cold start.
 */
function PendingJoinHandler() {
  const pendingJoinCode = useDeviceStore((s) => s.pendingJoinCode);
  const setPendingJoinCode = useDeviceStore((s) => s.setPendingJoinCode);
  const displayName = useDeviceStore((s) => s.displayName);
  const [busy, setBusy] = useState(false);
  const ran = useRef(false);

  // navigation from container — useNavigation only works under screens;
  // use a ref on the container instead:
  const navigationRef = useRef<any>(null);

  // Better pattern: put this logic inside Home with navigation prop.
  // See HomeScreen snippet below — keep App.tsx without this if you prefer.
  return null;
}