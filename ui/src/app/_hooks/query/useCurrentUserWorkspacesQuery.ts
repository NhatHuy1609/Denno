import { useQuery } from '@tanstack/react-query'
import { WorkspaceQueries } from '@/entities/workspace'

export default function useCurrentUserWorkspacesQuery() {
  return useQuery(
    WorkspaceQueries.currentUserWorkspacesQuery()
  )
}
