import { useEffect, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../App';
import DumpForm from '../components/DumpForm';
import { pickImages } from '../utils/pickImages';
import { updateDump } from '../lib/dump';
import { useDumpsStore } from '../store/dumpStore';
import { useDeviceStore } from '../store/deviceStore';

type Props = NativeStackScreenProps<RootStackParamList, 'EditDump'>;

function formatDateLabel(isoOrDisplay?: string | null): string {
  if (!isoOrDisplay) {
    return new Date()
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .toUpperCase();
  }
  // if already "04 OCT 2026" style, return as-is
  if (isoOrDisplay.includes(' ')) return isoOrDisplay.toUpperCase();
  const d = new Date(isoOrDisplay);
  if (Number.isNaN(d.getTime())) return isoOrDisplay.toUpperCase();
  return d
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
}

export default function EditDumpScreen({ navigation, route }: Props) {
  const { dumpId } = route.params;

  const current = useDumpsStore((s) => s.current);
  const fetchDump = useDumpsStore((s) => s.fetchDump);
  const fetchDumps = useDumpsStore((s) => s.fetchDumps);
  const hasCreated = useDeviceStore((s) => s.hasCreated);

  const [name, setName] = useState('');
  const [dateLabel, setDateLabel] = useState('');
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasCreated(dumpId)) {
      navigation.goBack();
      return;
    }

    (async () => {
      // ensure we have latest dump
      if (!current || current.id !== dumpId) {
        await fetchDump(dumpId);
      }
    })();
  }, [dumpId]);

  useEffect(() => {
    if (!current || current.id !== dumpId) return;
    setName(current.title ?? '');
    setDateLabel(formatDateLabel(current.date));
    setCoverUri(current.image ?? null);
    setIsOpen(true); // or current.isOpen if you map it
    setReady(true);
  }, [current, dumpId]);

  const handlePickCover = async () => {
    const uris = await pickImages({
      multiple: false,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (uris[0]) setCoverUri(uris[0]);
  };

  const handleSave = async () => {
    if (!name.trim() || loading) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      await updateDump({
        id: dumpId,
        name: name.trim(),
        // date: optional — only if you persist a real ISO; skip until date picker
        coverUri,
        isOpen,
      });
      await fetchDump(dumpId);
      await fetchDumps(); // home cards
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not update dump.');
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <DumpForm
      mode="edit"
      rightLabel="EDIT"
      name={name}
      onChangeName={setName}
      dateLabel={dateLabel}
      // onPressDate={() => {}} // later: date picker
      coverUri={coverUri}
      onPickCover={handlePickCover}
      isOpen={isOpen}
      onChangeOpen={setIsOpen}
      ctaLabel="SAVE  ↗"
      loading={loading}
      helpText={name.trim() ? 'SAVE TO UPDATE THIS DUMP.' : 'NAME REQUIRED.'}
      onSubmit={handleSave}
    />
  );
}