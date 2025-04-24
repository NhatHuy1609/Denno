import { WorkspaceJoinRequests } from '@/entities/workspace/workspace.types'
import { createContext } from 'react'
import { useContext } from 'react'

type RequestsManagerContextProps = {
  workspaceJoinRequests: WorkspaceJoinRequests
  selectedRequests: number[]
  setSelectedRequests: React.Dispatch<React.SetStateAction<number[]>>
  selectAllRequestsFn: () => void
}

export const RequestsManagerContext = createContext<RequestsManagerContextProps>({
  workspaceJoinRequests: [],
  selectedRequests: [],
  setSelectedRequests: () => {},
  selectAllRequestsFn: () => {}
})

export const RequestsManagerProvider = RequestsManagerContext.Provider

export const useRequestsManagerContext = () => useContext(RequestsManagerContext)
