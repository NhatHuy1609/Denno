import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useSyncedLocalStorage } from '../../useSyncedLocalStorage'
import { useQueries } from '@tanstack/react-query'
import { BoardQueries, boardSchemas } from '@/entities/board'

export const useRecentBoards = () => {
  const [recentBoards] = useSyncedLocalStorage(PersistedStateKey.RecentBoards)
  const results = useQueries({
    queries: recentBoards.map((b) => BoardQueries.boardQuery(b.id))
  })

  const isAllSuccess = results.every((query) => query.isSuccess)
  const isAnyLoading = results.some((query) => query.isLoading)
  const isAnyError = results.some((query) => query.isError)
  const successfulData = results
    .filter(
      (query): query is { data: boardSchemas.Board } & typeof query => query.isSuccess && query.data !== undefined
    )
    .map((query) => query.data)

  return {
    results,
    isAllSuccess,
    isAnyLoading,
    isAnyError,
    successfulData
  }
}
