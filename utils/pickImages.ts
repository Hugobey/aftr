// utils/pickImages.ts
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

type PickImagesOptions = {
  multiple?: boolean;
  limit?: number;
};

export async function pickImages({
  multiple = false,
  limit = 1,
}: PickImagesOptions = {}): Promise<string[]> {
  // 1. Ask for permission
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      'Permission needed',
      'Please allow access to your photos to continue.'
    );
    return [];
  }

  // 2. Launch the picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: multiple,
    selectionLimit: limit,
    quality: 0.8,
    allowsEditing: !multiple, // only allow crop when picking a single image
  });

  if (result.canceled) {
    return [];
  }

  const uris = result.assets.map((asset) => asset.uri);

  // 3. Extra safety check (in case the system ignores selectionLimit on some devices)
  if (multiple && uris.length > limit) {
    Alert.alert(
      'Limit reached',
      `You can only add up to ${limit} photos.`
    );
    return uris.slice(0, limit);
  }

  return uris;
}