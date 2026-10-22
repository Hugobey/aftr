// screens/HostProfileScreen.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import ProfileNameForm from '../components/ProfileNameForm';
import { useDeviceStore } from '../store/deviceStore';

type Props = NativeStackScreenProps<RootStackParamList, 'HostProfile'>;

export default function HostProfileScreen({ navigation }: Props) {
  const storedName = useDeviceStore((s) => s.displayName);
  const setDisplayName = useDeviceStore((s) => s.setDisplayName);

  return (
    <ProfileNameForm
      eyebrow="NEW DUMP"
      title={"WHO’S\nHOSTING?"}
      hint="SHOWN AS HOST IN THE MEMBERS LIST."
      ctaLabel="CONTINUE  ↗"
      rightLabel="02 / 02"
      initialName={storedName ?? ''}
      onSubmit={(name) => {
        setDisplayName(name);
        navigation.navigate('CreateDump'); // not SelectedPhotos
      }}
    />
  );
}