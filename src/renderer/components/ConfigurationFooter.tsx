import { ReactNode } from 'react';

type ConfigurationFooterProps = {
  adding: boolean;
  onStartAdding: () => void;
  addForm: ReactNode;
  buttonText: string;
};

export default function ConfigurationFooter({
  adding,
  onStartAdding,
  addForm,
  buttonText,
}: ConfigurationFooterProps) {
  if (adding) {
    return addForm;
  }

  return (
    <button
      type="button"
      onClick={onStartAdding}
      className="btn-add self-start"
    >
      {buttonText}
    </button>
  );
}
