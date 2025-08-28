import { useQuery } from '@tanstack/react-query'
import { UserQueries, userSchemas } from '@/entities/user'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

export default function useCurrentUserWorkspacesQuery({ filter }: { filter?: userSchemas.UserWorkspacesFilterQuery }) {
  const userId = getLocalStorageItem(PersistedStateKey.MeId) || ''

  return useQuery(UserQueries.userWorkspacesQuery(userId, filter))
}
