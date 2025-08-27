import { createContext, useContext } from 'react'
import type { workspaceSchemas } from '@/entities/workspace'

type GuestItemContextProps = {
  guestId: string
  guestInfo: workspaceSchemas.Workspace['guests'][0]['user']
  guestJoinedBoards: workspaceSchemas.Workspace['guests'][0]['joinedBoards']
}

export const GuestItemContext = createContext<GuestItemContextProps | null>(null)

export const GuestItemProvider = GuestItemContext.Provider

export const useGuestItemContext = () => {
  const guestItemContext = useContext(GuestItemContext)

  if (!guestItemContext) {
    return {} as Partial<GuestItemContextProps>
  }

  return guestItemContext
}
