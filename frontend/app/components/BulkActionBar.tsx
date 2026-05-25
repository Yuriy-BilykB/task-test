"use client";

type BulkActionBarProps = {
  selectedCount: number;
  totalSelectable: number;
  allSelected: boolean;
  onSelectAll: () => void;
  onClear: () => void;
  onCompleteSelected: () => void;
  onDeleteSelected: () => void;
};

export function BulkActionBar({
  selectedCount,
  totalSelectable,
  allSelected,
  onSelectAll,
  onClear,
  onCompleteSelected,
  onDeleteSelected,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-md">
      <span className="text-sm text-zinc-700">
        <span className="font-semibold">{selectedCount}</span> selected
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {!allSelected && totalSelectable > selectedCount && (
          <button
            type="button"
            onClick={onSelectAll}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Select all ({totalSelectable})
          </button>
        )}
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDeleteSelected}
          className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={onCompleteSelected}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Mark done
        </button>
      </div>
    </div>
  );
}
