import { useAppSelector } from '@/store/hooks'
import { selectCurrentUserBoardPermissions } from './board.selectors'

export const useCurrentUserBoardPermissions = () => {
  return useAppSelector(selectCurrentUserBoardPermissions)
}
