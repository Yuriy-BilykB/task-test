type EmptyStateProps = {
  label?: string;
};

export function EmptyState({ label = "No tasks yet" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-200 bg-white/50 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 12.75 11.25 15 15 9.75" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
      <span className="text-sm text-zinc-500">{label}</span>
    </div>
  );
}
