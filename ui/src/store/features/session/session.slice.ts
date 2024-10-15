import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Session, CurrentUser } from './session.types'

interface SessionState {
  session: Session
  currentUser: CurrentUser
}

const initialState: SessionState = {
  session: {
    token: '',
    refreshToken: ''
  },
  currentUser: {
    id: '',
    email: '',
    avatar: '',
    fullName: ''
  }
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    updateEntireSession: (state, action: PayloadAction<{session: Session, currentUser: CurrentUser}>) => {
      const { session, currentUser } = action.payload
      state.session = session
      state.currentUser = currentUser
    },
    updateSession: (state, action: PayloadAction<Partial<Session>>) => {
      const latestData = { ...state.session, ...action.payload }
      state.session = latestData
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<CurrentUser>>) => {
      const latestData = { ...state.currentUser, ...action.payload }
      state.currentUser = latestData
    }
  }
})

export default sessionSlice.reducer

export const { updateEntireSession, updateSession, updateCurrentUser } = sessionSlice.actions