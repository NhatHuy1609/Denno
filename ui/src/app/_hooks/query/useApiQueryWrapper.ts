import { useQuery, QueryOptions } from '@tanstack/react-query';
import { ApiQueryOptionsParams } from './types';

export const useApiQueryWrapper = <TData>(
  queryOptions: QueryOptions<TData, Error, TData, unknown[]>,
  options?: ApiQueryOptionsParams<TData>
) => {
  return useQuery({
    ...queryOptions,
    ...options,
    queryKey: queryOptions.queryKey as unknown[], // đảm bảo queryKey không bị undefined
    queryFn: queryOptions.queryFn,
  });
};
