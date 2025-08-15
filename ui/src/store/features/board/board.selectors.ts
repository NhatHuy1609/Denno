import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/lib/redux/store'
import { getStaticBoardMemberPermissions } from '@/permissions/static-permissions/board-member-permissions'

export const selectCurrentUserBoardMemberRole = (state: RootState) => state.board.currentUserRole

export const selectCurrentUserBoardPermissions = createSelector([selectCurrentUserBoardMemberRole], (memberRole) => {
  if (!memberRole) return null
  return getStaticBoardMemberPermissions(memberRole)
})
