import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

export async function savePhotoToLibrary(remoteUrl: string) {
  const perm = await MediaLibrary.requestPermissionsAsync(true);
  if (perm.status !== 'granted') {
    throw new Error('Photo library permission needed.');
  }

  const path = `${FileSystem.cacheDirectory}aftr-${Date.now()}.jpg`;
  const downloaded = await FileSystem.downloadAsync(remoteUrl, path);

  if (downloaded.status !== 200) {
    throw new Error('Download failed.');
  }

  await MediaLibrary.saveToLibraryAsync(downloaded.uri);
}

export async function copyPhotoToClipboard(remoteUrl: string) {
  const path = `${FileSystem.cacheDirectory}aftr-copy-${Date.now()}.jpg`;
  await FileSystem.downloadAsync(remoteUrl, path);
  const base64 = await FileSystem.readAsStringAsync(path, {
    encoding: FileSystem.EncodingType.Base64,
  });
  await Clipboard.setImageAsync(base64);
}