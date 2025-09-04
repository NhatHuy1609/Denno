import { createContext, useContext } from 'react'

interface RemoveMemberOptionsContext {
  // Whether to also remove the boards in this workspace that the member is part of
  removeRelatedBoards: boolean
  changeRemoveRelatedBoardsOption: (value: boolean) => void
}

export const removeMemberOptionsContext = createContext<RemoveMemberOptionsContext>({
  removeRelatedBoards: false,
  changeRemoveRelatedBoardsOption: () => {}
})

export const RemoveMemberOptionsProvider = removeMemberOptionsContext.Provider

export const useRemoveMemberOptionsContext = () => {
  return useContext(removeMemberOptionsContext)
}
