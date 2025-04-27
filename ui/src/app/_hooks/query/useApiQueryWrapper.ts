import { useEffect } from 'react';
import { useQuery, QueryOptions } from '@tanstack/react-query';
import { ApiQueryOptionsParams } from './types';
import axios from 'axios';
import { queryClient } from '@/lib/react-query/query-client';

export const useApiQueryWrapper = <TData>(
  queryOptions: QueryOptions<TData, Error, TData, unknown[]>,
  options?: ApiQueryOptionsParams<TData>
) => {
  const query = useQuery({
    ...queryOptions,
    ...options,
    queryKey: queryOptions.queryKey as unknown[], // đảm bảo queryKey không bị undefined
    queryFn: queryOptions.queryFn,
    select: (data) => data,
  });

  useEffect(() => {
    if (query.error && axios.isAxiosError(query.error) && query.error.response?.status === 404) {
      queryClient.setQueryData(queryOptions.queryKey as unknown[], null);
    }
  }, [query.error, query.isError])

  return query
};
