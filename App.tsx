import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { Colors } from './constants/Colors';

// Temporary placeholder screens
import HomeScreen from './screens/HomeScreen';
import CreateDumpScreen from './screens/CreateDumpScreen';
import JoinDumpScreen from './screens/JoinDumpScreen';
import DumpDetailScreen from './screens/DumpDetailScreen';
import InviteScreen from './screens/InviteScreen';
import SelectedPhotosScreen from './screens/SelectedPhotoScreen';

export type RootStackParamList = {
  Home: undefined;
  CreateDump: undefined;
  JoinDump: undefined;
  DumpDetail: { dumpId: string };
  Invite: { dumpId: string };
  SelectedPhotos: {
    initialUris: string[];
    maxPhotos?: number;
    title?: string;
    confirmLabel?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}