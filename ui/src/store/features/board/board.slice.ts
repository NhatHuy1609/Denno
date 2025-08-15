import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BoardState, MemberRole } from './board.types'
import {
  getStaticBoardMemberPermissions,
  StaticBoardMemberPermissionsSet
} from '@/permissions/static-permissions/board-member-permissions'

const initialState: BoardState = {
  id: null,
  currentUserRole: null,
  currentUserPermissions: null
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard(state, action: PayloadAction<Omit<BoardState, 'currentUserPermissions' | 'currentUserRole'>>) {
      state.id = action.payload.id
    },
    setCurrentUserRole(state, action: PayloadAction<MemberRole>) {
      state.currentUserRole = action.payload
      state.currentUserPermissions = action.payload ? getStaticBoardMemberPermissions(action.payload) : null
    },
    setPermissions(state, action: PayloadAction<StaticBoardMemberPermissionsSet>) {
      state.currentUserPermissions = action.payload
    },
    updateMemberRoleAndPermissions(state, action: PayloadAction<MemberRole>) {
      state.currentUserRole = action.payload
      state.currentUserPermissions = action.payload ? getStaticBoardMemberPermissions(action.payload) : null
    },
    resetBoard() {
      return initialState
    }
  }
})

export const { setBoard, setCurrentUserRole, setPermissions, updateMemberRoleAndPermissions, resetBoard } =
  boardSlice.actions
export default boardSlice.reducer
