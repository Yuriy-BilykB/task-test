"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UndoToast } from "@/app/components/UndoToast";
import {
  deleteTodo,
  extractApiError,
  fetchTodos,
  updateTodo,
} from "@/lib/api";
import type { Todo } from "@/lib/types";

export const undoMs = 5000;

export const todosQueryKey = (categoryFilter: string) =>
  ["todos", categoryFilter] as const;

export function useTodos(categoryFilter: string) {
  const queryClient = useQueryClient();
  const queryKey = todosQueryKey(categoryFilter);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      fetchTodos(categoryFilter === "all" ? undefined : categoryFilter),
  });

  const [pendingHide, setPendingHide] = useState<Set<string>>(new Set());
  const pendingTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    const timers = pendingTimers.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const visibleTodos = useMemo(
    () => (data ?? []).filter((t) => !pendingHide.has(t.id)),
    [data, pendingHide],
  );

  const cancelPending = useCallback((ids: string[]) => {
    for (const id of ids) {
      const timer = pendingTimers.current.get(id);
      if (timer) {
        clearTimeout(timer);
        pendingTimers.current.delete(id);
      }
    }
    setPendingHide((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const id of ids) {
        if (next.delete(id)) changed = true;
      }
      return changed ? next : prev;
    });
  }, []);

  const scheduleBulkPending = useCallback(
    (
      ids: string[],
      commit: (id: string) => Promise<void>,
      undoLabel: string,
    ) => {
      if (ids.length === 0) return;
      const snapshot = [...ids];

      setPendingHide((prev) => {
        const next = new Set(prev);
        for (const id of ids) next.add(id);
        return next;
      });

      const timer = setTimeout(async () => {
        for (const id of ids) pendingTimers.current.delete(id);
        const results = await Promise.allSettled(ids.map((id) => commit(id)));
        const failed = results
          .map((r, i) => (r.status === "rejected" ? ids[i] : null))
          .filter((id): id is string => id !== null);
        const succeeded = ids.filter((id) => !failed.includes(id));

        if (succeeded.length > 0) {
          queryClient.setQueryData<Todo[]>(queryKey, (old) =>
            (old ?? []).filter((t) => !succeeded.includes(t.id)),
          );
        }
        if (failed.length > 0) {
          setPendingHide((prev) => {
            const next = new Set(prev);
            for (const id of failed) next.delete(id);
            return next;
          });
          toast.error(`${failed.length} action(s) failed`);
        }
      }, undoMs);

      for (const id of ids) pendingTimers.current.set(id, timer);

      toast(
        ({ closeToast }) => (
          <UndoToast
            label={undoLabel}
            onUndo={() => {
              cancelPending(snapshot);
              closeToast?.();
            }}
          />
        ),
        { autoClose: undoMs, closeOnClick: false },
      );
    },
    [cancelPending, queryClient, queryKey],
  );

  const completeManyTodos = useCallback(
    (todos: Todo[]) => {
      const targets = todos.filter((t) => !t.completed);
      if (targets.length === 0) return;
      scheduleBulkPending(
        targets.map((t) => t.id),
        (id) => updateTodo(id, { completed: true }).then(() => undefined),
        `Completed ${targets.length} task${targets.length === 1 ? "" : "s"}`,
      );
    },
    [scheduleBulkPending],
  );

  const removeManyTodos = useCallback(
    (todos: Todo[]) => {
      if (todos.length === 0) return;
      scheduleBulkPending(
        todos.map((t) => t.id),
        (id) => deleteTodo(id),
        `Deleted ${todos.length} task${todos.length === 1 ? "" : "s"}`,
      );
    },
    [scheduleBulkPending],
  );

  const prependTodo = useCallback(
    (todo: Todo) => {
      queryClient.setQueryData<Todo[]>(queryKey, (old) => [
        todo,
        ...(old ?? []),
      ]);
    },
    [queryClient, queryKey],
  );

  return {
    todos: visibleTodos,
    loading: isLoading,
    error: error ? extractApiError(error, "Failed to load todos") : null,
    completeManyTodos,
    removeManyTodos,
    prependTodo,
  };
}
