import { useQuery } from '@tanstack/react-query'
import { UserQueries, userTypes } from '@/entities/user'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'

export default function useCurrentUserWorkspacesQuery({ filter }: { filter?: userTypes.UserWorkspacesFilterQuery }) {
  const userId = getLocalStorageItem(PersistedStateKey.MeId) || ''

  return useQuery(
    UserQueries.userWorkspacesQuery(userId, filter)
  )
}
