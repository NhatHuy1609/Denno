import { configureStore } from '@reduxjs/toolkit'
import { sessionReducer } from '@/store/features/session'
import { boardReducer } from '@/store/features/board'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    board: boardReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
