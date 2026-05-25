"use client";

import type { Category } from "@/lib/types";

type FilterBarProps = {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
};

export function FilterBar({ categories, value, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by category"
        className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 shadow-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
