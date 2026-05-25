"use client";

import { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BulkActionBar } from "@/app/components/BulkActionBar";
import { CreateTodoForm } from "@/app/components/CreateTodoForm";
import { FilterBar } from "@/app/components/FilterBar";
import { TodoList } from "@/app/components/TodoList";
import { useCategories } from "@/app/hooks/useCategories";
import { useTodos } from "@/app/hooks/useTodos";
import { extractApiError } from "@/lib/api";
import type { Todo } from "@/lib/types";

export default function Page() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [prevFilter, setPrevFilter] = useState(categoryFilter);

  if (prevFilter !== categoryFilter) {
    setPrevFilter(categoryFilter);
    setSelectedIds(new Set());
  }

  const { data: categories = [], error: categoriesError } = useCategories();

  const {
    todos,
    loading,
    error: todosError,
    completeManyTodos,
    removeManyTodos,
    prependTodo,
  } = useTodos(categoryFilter);

  const categoryErrorMessage = categoriesError
    ? extractApiError(categoriesError, "Failed to load categories")
    : null;

  const selectableTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos],
  );

  const effectiveSelected = useMemo(() => {
    const ids = new Set<string>();
    for (const todo of selectableTodos) {
      if (selectedIds.has(todo.id)) ids.add(todo.id);
    }
    return ids;
  }, [selectableTodos, selectedIds]);

  const toggleSelect = (todo: Todo) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(todo.id)) next.delete(todo.id);
      else next.add(todo.id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(selectableTodos.map((todo) => todo.id)));
  };

  const clearSelection = () => setSelectedIds(new Set());

  const selectedTodos = () =>
    selectableTodos.filter((todo) => effectiveSelected.has(todo.id));

  const bulkComplete = () => {
    completeManyTodos(selectedTodos());
    clearSelection();
  };

  const bulkDelete = () => {
    removeManyTodos(selectedTodos());
    clearSelection();
  };

  return (
    <div className="flex flex-1 justify-center px-4 py-12">
      <main className="w-full max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-500">
            Todos
          </h1>
          <p className="text-sm text-zinc-500">
            Keep up to five tasks per category.
          </p>
        </header>

        <CreateTodoForm
          categories={categories}
          onCreated={(todo) => {
            if (
              categoryFilter === "all" ||
              categoryFilter === todo.categoryId
            ) {
              prependTodo(todo);
            }
          }}
        />

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-500">
              Your tasks{" "}
              <span className="text-zinc-500 font-normal">: {todos.length}</span>
            </h2>
            <FilterBar
              categories={categories}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
          </div>

          <TodoList
            loading={loading}
            error={todosError ?? categoryErrorMessage}
            todos={todos}
            selectedIds={effectiveSelected}
            onToggleSelect={toggleSelect}
          />

          <BulkActionBar
            selectedCount={effectiveSelected.size}
            totalSelectable={selectableTodos.length}
            allSelected={
              selectableTodos.length > 0 &&
              effectiveSelected.size === selectableTodos.length
            }
            onSelectAll={selectAll}
            onClear={clearSelection}
            onCompleteSelected={bulkComplete}
            onDeleteSelected={bulkDelete}
          />
        </section>
      </main>
      <ToastContainer position="bottom-center" theme="light" />
    </div>
  );
}
