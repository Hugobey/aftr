// components/ConfirmSheet.tsx
import Sheet from './Sheet';
import ConfirmContent from './ConfirmContent';

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmSheet({
  visible,
  onCancel,
  onConfirm,
  ...contentProps
}: Props) {
  return (
    <Sheet visible={visible} onClose={onCancel}>
      <ConfirmContent
        {...contentProps}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </Sheet>
  );
}