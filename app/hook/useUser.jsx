"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "../_lib/actions";
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
}

