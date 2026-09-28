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
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      'Permission needed',
      'Please allow access to your photos to continue.'
    );
    return [];
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: multiple,
    selectionLimit: limit,
    quality: 0.85,
    allowsEditing: false, // ← never show the crop screen
  });

  if (result.canceled) {
    return [];
  }

  const uris = result.assets.map((asset) => asset.uri);

  if (multiple && uris.length > limit) {
    Alert.alert(
      'Limit reached',
      `You can only add up to ${limit} photos.`
    );
    return uris.slice(0, limit);
  }

  return uris;
}