// screens/JoinProfileScreen.tsx
import { useState } from 'react';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import ProfileNameForm from '../components/ProfileNameForm';
import { addDumpMember } from '../lib/members';
import { useDeviceStore } from '../store/deviceStore';
import { containsProhibitedContent } from '../utils/contentSafety';

type Props = NativeStackScreenProps<RootStackParamList, 'JoinProfile'>;

export default function JoinProfileScreen({ navigation, route }: Props) {
  const { dumpId, dumpName } = route.params;
  const [loading, setLoading] = useState(false);

  const storedName = useDeviceStore((s) => s.displayName);
  const setDisplayName = useDeviceStore((s) => s.setDisplayName);
  const ensureDeviceId = useDeviceStore((s) => s.ensureDeviceId);
  const addJoinedId = useDeviceStore((s) => s.addJoinedId);

  const onSubmit = async (displayName: string) => {
    if (containsProhibitedContent(displayName)) {
      Alert.alert('Choose another name', 'This display name is not allowed.');
      return;
    }
    try {
      setLoading(true);
      setDisplayName(displayName);
      await addDumpMember({
        dumpId,
        deviceId: ensureDeviceId(),
        displayName,
        role: 'member',
      });
      addJoinedId(dumpId);
      navigation.replace('DumpDetail', { dumpId });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not join this dump. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileNameForm
      eyebrow="YOU’RE IN"
      title={"WHO’S\nJOINING?"}
      hint="SHOWN TO OTHERS IN THE MEMBERS LIST."
      ctaLabel="ENTER DUMP  ↗"
      loadingLabel="JOINING..."
      rightLabel={dumpName?.toUpperCase()}
      initialName={storedName ?? ''}
      loading={loading}
      onSubmit={onSubmit}
    />
  );
}
