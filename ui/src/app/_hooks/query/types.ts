import { QueryOptions, UseQueryOptions } from "@tanstack/react-query";

export type ApiQueryOptionsParams<TData> = Omit<
  UseQueryOptions<TData, Error, TData, unknown[]>,
  'queryKey' | 'queryFn'
>;