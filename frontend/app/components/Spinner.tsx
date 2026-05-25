type SpinnerProps = {
  label?: string;
};

export function Spinner({ label = "Loading" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex items-center justify-center py-12 text-zinc-400"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-500" />
    </div>
  );
}
