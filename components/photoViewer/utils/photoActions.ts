import { File, Paths } from 'expo-file-system';
import { Asset, requestPermissionsAsync } from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';

export async function savePhotoToLibrary(remoteUrl: string) {
  const perm = await requestPermissionsAsync(true); // write-only is enough to save
  if (perm.status !== 'granted') {
    throw new Error('Photo library permission needed.');
  }

  // 1) Download remote image into cache
  const target = new File(Paths.cache, `aftr-${Date.now()}.jpg`);
  const downloaded = await File.downloadFileAsync(remoteUrl, target);

  // 2) New MediaLibrary API — saves into the Photos library
  const asset = await Asset.create(downloaded.uri);
  return asset;
}

export async function copyPhotoToClipboard(remoteUrl: string) {
  const target = new File(Paths.cache, `aftr-copy-${Date.now()}.jpg`);
  const downloaded = await File.downloadFileAsync(remoteUrl, target);
  const base64 = await downloaded.base64();
  await Clipboard.setImageAsync(base64);
}