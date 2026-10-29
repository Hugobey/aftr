import { useState } from 'react';
import { Keyboard } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../App';
import DumpForm from '../components/DumpForm';
import { pickImages } from '../utils/pickImages';
import { useCreateDumpStore } from '../store/createDumpStore';
import { useDeviceStore } from '../store/deviceStore';
import { containsProhibitedContent } from '../utils/contentSafety';
import { Alert } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateDump'>;

function formatToday(): string {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

export default function CreateDumpScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [dateLabel] = useState(formatToday());

  const { name, coverUri, isOpen, setName, setCoverUri, setIsOpen } =
    useCreateDumpStore();

  const handlePickCover = async () => {
    const uris = await pickImages({
      multiple: false,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (uris[0]) setCoverUri(uris[0]);
  };

  const handleCreate = () => {
    if (!name.trim() || loading) return;
    if (containsProhibitedContent(name)) {
      Alert.alert('Choose another name', 'This Dump name is not allowed.');
      return;
    }
    Keyboard.dismiss();

    const displayName = useDeviceStore.getState().displayName?.trim();
    if (!displayName) {
      navigation.navigate('HostProfile');
      return;
    }

    navigation.navigate('SelectedPhotos', {
      initialUris: [],
      maxPhotos: 10,
      title: 'PHOTOS',
      confirmLabel: 'CREATE DUMP',
    });
  };

  return (
    <DumpForm
      mode="create"
      rightLabel="01 / 01"
      name={name}
      onChangeName={setName}
      dateLabel={dateLabel}
      coverUri={coverUri}
      onPickCover={handlePickCover}
      isOpen={isOpen}
      onChangeOpen={setIsOpen}
      ctaLabel="CREATE DUMP  ↗"
      loading={loading}
      helpText={
        name.trim() ? 'READY TO MAKE IT OFFICIAL.' : 'GIVE IT A NAME FIRST.'
      }
      onSubmit={handleCreate}
    />
  );
}
