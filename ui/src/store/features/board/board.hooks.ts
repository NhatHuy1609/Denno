import { useAppSelector } from '@/store/hooks'
import { selectCurrentUserBoardMemberRole, selectCurrentUserBoardPermissions } from './board.selectors'

export const useSelectCurrentUserBoardPermissions = () => {
  return useAppSelector(selectCurrentUserBoardPermissions)
}

export const useCurrentUserBoardMemberRole = () => {
  return useAppSelector(selectCurrentUserBoardMemberRole)
}
