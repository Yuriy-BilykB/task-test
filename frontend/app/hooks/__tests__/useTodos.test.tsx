import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

const sampleTodo = {
  id: "t1",
  text: "Buy milk",
  completed: false,
  createdAt: new Date().toISOString(),
  categoryId: "cat_home",
  category: { id: "cat_home", name: "Home" },
};

jest.mock("@/lib/api", () => ({
  fetchTodos: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
  extractApiError: (_: unknown, fallback: string) => fallback,
}));

jest.mock("react-toastify", () => ({
  toast: Object.assign(jest.fn(), {
    success: jest.fn(),
    error: jest.fn(),
  }),
}));

import { deleteTodo, fetchTodos, updateTodo } from "@/lib/api";
import { useTodos } from "@/app/hooks/useTodos";

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useTodos undo flow", () => {
  beforeEach(() => {
    (fetchTodos as jest.Mock).mockReset().mockResolvedValue([sampleTodo]);
    (updateTodo as jest.Mock).mockReset().mockResolvedValue({
      ...sampleTodo,
      completed: true,
    });
    (deleteTodo as jest.Mock).mockReset().mockResolvedValue(undefined);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("hides the todo immediately and never calls deleteTodo when the timer is cleared", async () => {
    const { result } = renderHook(() => useTodos("all"), { wrapper });
    await waitFor(() => expect(result.current.todos).toHaveLength(1));

    act(() => result.current.removeManyTodos([sampleTodo]));
    expect(result.current.todos).toHaveLength(0);

    jest.clearAllTimers();
    expect(deleteTodo).not.toHaveBeenCalled();
  });

  it("commits the delete after the undo window expires", async () => {
    const { result } = renderHook(() => useTodos("all"), { wrapper });
    await waitFor(() => expect(result.current.todos).toHaveLength(1));

    act(() => result.current.removeManyTodos([sampleTodo]));
    expect(result.current.todos).toHaveLength(0);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(deleteTodo).toHaveBeenCalledWith("t1");
  });

  it("completeManyTodos fans out into one call per non-completed todo", async () => {
    const second = { ...sampleTodo, id: "t2", text: "Walk dog" };
    (fetchTodos as jest.Mock).mockResolvedValue([sampleTodo, second]);

    const { result } = renderHook(() => useTodos("all"), { wrapper });
    await waitFor(() => expect(result.current.todos).toHaveLength(2));

    act(() => result.current.completeManyTodos([sampleTodo, second]));
    expect(result.current.todos).toHaveLength(0);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(updateTodo).toHaveBeenCalledTimes(2);
    expect(updateTodo).toHaveBeenCalledWith("t1", { completed: true });
    expect(updateTodo).toHaveBeenCalledWith("t2", { completed: true });
  });
});
