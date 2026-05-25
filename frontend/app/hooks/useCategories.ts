"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";

export const categoriesQueryKey = ["categories"] as const;

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategories,
  });
}
