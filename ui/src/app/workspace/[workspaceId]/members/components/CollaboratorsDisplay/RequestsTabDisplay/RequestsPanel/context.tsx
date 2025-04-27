import { WorkspaceJoinRequests } from '@/entities/workspace/workspace.types'
import { createContext } from 'react'
import { useContext } from 'react'

type RequestsManagerContextProps = {
  workspaceJoinRequestDisplay: WorkspaceJoinRequests // Filtered Requests
  workspaceJoinRequests: WorkspaceJoinRequests // All Requests
  selectedRequests: number[] // Selected Requests
  setSelectedRequests: React.Dispatch<React.SetStateAction<number[]>>
  toggleSelectAllRequestsFn: (isAllChecked: boolean, isIndeterminate: boolean) => void
}

export const RequestsManagerContext = createContext<RequestsManagerContextProps>({
  workspaceJoinRequestDisplay: [],
  workspaceJoinRequests: [],
  selectedRequests: [],
  setSelectedRequests: () => {},
  toggleSelectAllRequestsFn: (isAllChecked, isIndeterminate) => {}
})

export const RequestsManagerProvider = RequestsManagerContext.Provider

export const useRequestsManagerContext = () => useContext(RequestsManagerContext)
