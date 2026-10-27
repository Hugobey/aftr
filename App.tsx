// App.tsx
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

import { Colors } from './constants/Colors';
import { useDeviceStore } from './store/deviceStore';
import { useDumpsStore } from './store/dumpStore';

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
  JoinDump: undefined;
  DumpDetail: { dumpId: string };
  Members: { dumpId: string };
  Invite: { dumpId: string };
  JoinProfile: { dumpId: string; dumpName?: string };
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

  // Hooks must run every render (no early return above this)
  useEffect(() => {
    if (!hydrated || !legalAcceptedAt) return;
    normalizeCreatedIds();
    fetchDumps();
  }, [hydrated, legalAcceptedAt, normalizeCreatedIds, fetchDumps]);

  // 1) Wait for persisted store (AsyncStorage)
  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
  }

  // 2) First launch only
  if (!legalAcceptedAt) {
    return <LegalGateScreen onAccepted={() => {}} />;
  }

  // 3) Normal app
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
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
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}