"use client";

import type { Todo } from "@/lib/types";
import { EmptyState } from "./EmptyState";
import { Spinner } from "./Spinner";
import { TodoItem } from "./TodoItem";

type TodoListProps = {
  loading: boolean;
  error: string | null;
  todos: Todo[];
  selectedIds: Set<string>;
  onToggleSelect: (todo: Todo) => void;
};

export function TodoList({
  loading,
  error,
  todos,
  selectedIds,
  onToggleSelect,
}: TodoListProps) {
  if (loading) return <Spinner label="Loading todos" />;

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (todos.length === 0) return <EmptyState />;

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selected={selectedIds.has(todo.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </ul>
  );
}
