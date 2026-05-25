"use client";

import type { Todo } from "@/lib/types";

type TodoItemProps = {
  todo: Todo;
  selected: boolean;
  onToggleSelect: (todo: Todo) => void;
};

export function TodoItem({ todo, selected, onToggleSelect }: TodoItemProps) {
  return (
    <li
      className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xs transition hover:shadow-sm ${
        selected
          ? "border-indigo-300 ring-2 ring-indigo-100"
          : "border-zinc-200 hover:border-zinc-300"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelect(todo)}
        disabled={todo.completed}
        aria-label={`Select "${todo.text}"`}
        className="h-4 w-4 shrink-0 cursor-pointer accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-30"
      />

      <div className="flex flex-1 flex-col min-w-0">
        <span
          className={`truncate text-sm ${
            todo.completed ? "text-zinc-400 line-through" : "text-zinc-900"
          }`}
        >
          {todo.text}
        </span>
        <span className="text-xs text-zinc-500">{todo.category.name}</span>
      </div>
    </li>
  );
}
