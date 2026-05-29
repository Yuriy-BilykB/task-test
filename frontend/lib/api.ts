import axios, { AxiosError } from "axios";
import type { Category, CreateTodoInput, Todo } from "./types";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050/api";

export const api = axios.create({ baseURL });

export function extractApiError(err: unknown, fallback: string): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as { message?: string | string[] } | undefined;
    const message = data?.message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }
  return fallback;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories");
  return data;
}

export async function fetchTodos(categoryId?: string): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>("/todos", {
    params: categoryId ? { category: categoryId } : undefined,
  });
  return data;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const { data } = await api.post<Todo>("/todos", input);
  return data;
}

export async function updateTodo(
  id: string,
  patch: { completed?: boolean },
): Promise<Todo> {
  const { data } = await api.patch<Todo>(`/todos/${id}`, patch);
  return data;
}

export async function deleteTodo(id: string): Promise<void> {
  await api.delete(`/todos/${id}`);
}
