type UndoToastProps = {
  label: string;
  onUndo: () => void;
};

export function UndoToast({ label, onUndo }: UndoToastProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <button
        type="button"
        className="font-medium text-blue-600 hover:underline"
        onClick={onUndo}
      >
        Undo
      </button>
    </div>
  );
}
