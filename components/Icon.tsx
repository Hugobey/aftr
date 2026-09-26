import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Colors } from '../constants/Colors';

type IconName =
  | 'plus'
  | 'scan'
  | 'arrow'
  | 'back'
  | 'share'
  | 'camera'
  | 'link'
  | 'check';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({
  name,
  size = 22,
  color = Colors.text,
}: IconProps) {
  const stroke = color;
  const strokeWidth = 2;

  const paths = {
    plus: (
      <>
        <Path d="M12 5v14M5 12h14" />
      </>
    ),
    scan: (
      <>
        <Path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
        <Rect x="8" y="8" width="8" height="8" />
      </>
    ),
    arrow: (
      <>
        <Path d="M5 19 19 5M9 5h10v10" />
      </>
    ),
    back: (
      <>
        <Path d="m15 18-6-6 6-6" />
      </>
    ),
    share: (
      <>
        <Path d="M12 16V3M7 8l5-5 5 5" />
        <Path d="M5 13v7h14v-7" />
      </>
    ),
    camera: (
      <>
        <Path d="M4 8h4l2-3h4l2 3h4v11H4z" />
        <Circle cx="12" cy="13" r="3.5" />
      </>
    ),
    link: (
      <>
        <Path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" />
      </>
    ),
    check: (
      <>
        <Path d="m5 12 4 4L19 6" />
      </>
    ),
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </Svg>
  );
}