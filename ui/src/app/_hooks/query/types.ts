import { UseQueryOptions } from '@tanstack/react-query'
import { UserQueries } from '@/entities/user'

export type ExtractQueryFnReturnType<T> = T extends { queryFn: (...args: any[]) => infer R } ? R : never

export type ApiQueryOptionsParams<TData> = Omit<UseQueryOptions<TData, Error, TData, unknown[]>, 'queryKey' | 'queryFn'>

type Test = ExtractQueryFnReturnType<typeof UserQueries.userJoinedBoardsQuery>
