import { Image, type ImageProps } from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';

type Props = ImageProps & {
  bw?: boolean;
};

export default function BwImage({ bw = true, ...rest }: Props) {
  if (!bw) return <Image {...rest} />;
  return (
    <Grayscale>
      <Image {...rest} />
    </Grayscale>
  );
}