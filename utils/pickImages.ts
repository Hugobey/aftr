// utils/pickImages.ts
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

type PickImagesOptions = {
  /** Pick multiple photos */
  multiple?: boolean;
  /** Maximum number of photos (only used when multiple = true) */
  limit?: number;
  /** Enable crop/resize UI (only works when multiple = false) */
  allowsEditing?: boolean;
  /** Aspect ratio when editing (default 4/5 - good for covers) */
  aspect?: [number, number];
};

export async function pickImages({
  multiple = false,
  limit = 1,
  allowsEditing = false,
  aspect = [4, 5],
}: PickImagesOptions = {}): Promise<string[]> {
  // 1. Request permission
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      'Permission needed',
      'Please allow access to your photos to continue.'
    );
    return [];
  }

  // 2. Launch picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: multiple,
    selectionLimit: multiple ? limit : 1,
    quality: 0.85,
    allowsEditing: allowsEditing && !multiple, // cropping only for single image
    aspect: allowsEditing && !multiple ? aspect : undefined,
  });

  if (result.canceled) {
    return [];
  }

  const uris = result.assets.map((asset) => asset.uri);

  // 3. Safety limit
  if (multiple && uris.length > limit) {
    Alert.alert(
      'Limit reached',
      `You can only select up to ${limit} photos.`
    );
    return uris.slice(0, limit);
  }

  return uris;
}