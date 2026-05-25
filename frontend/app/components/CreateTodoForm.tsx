"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createTodo, extractApiError } from "@/lib/api";
import { createTodoSchema, type CreateTodoFormValues } from "@/lib/schemas";
import type { Category, Todo } from "@/lib/types";

type Props = {
  categories: Category[];
  onCreated: (todo: Todo) => void;
};

const inputBase =
  "w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export function CreateTodoForm({ categories, onCreated }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoFormValues>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { text: "", categoryId: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await createTodo(values);
      onCreated(created);
      reset({ text: "", categoryId: values.categoryId });
      toast.success("Task created");
    } catch (e) {
      toast.error(extractApiError(e, "Failed to create task"));
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-base font-semibold text-zinc-900">New task</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-zinc-600">
          Task
          <input
            {...register("text")}
            placeholder="What needs doing?"
            aria-invalid={errors.text ? "true" : "false"}
            className={inputBase}
          />
          {errors.text && (
            <span className="text-xs font-normal text-red-600">
              {errors.text.message}
            </span>
          )}
        </label>

        <label className="flex sm:w-44 flex-col gap-1 text-xs font-medium text-zinc-600">
          Category
          <select
            {...register("categoryId")}
            defaultValue=""
            aria-invalid={errors.categoryId ? "true" : "false"}
            className={inputBase}
          >
            <option value="" disabled>
              Select a category…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span className="text-xs font-normal text-red-600">
              {errors.categoryId.message}
            </span>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || categories.length === 0}
        className="self-end rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Adding…" : "Add task"}
      </button>
    </form>
  );
}
