import { useEffect } from "react"
import { useSyncedLocalStorage } from "@/app/_hooks/useSyncedLocalStorage"
import { PersistedStateKey } from "@/data/persisted-keys"

function useRecentAccessSync(boardId: string, workspaceId: string) {
  const [, setBoardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')
  const [, setWorkspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')

  // Sync recent access board id with local storage
  useEffect(() => {
    if (boardId) {
      setBoardId(boardId)
    }
  }, [boardId, setBoardId])

  // Sync recent access workspace id with local storage
  useEffect(() => {
    if (workspaceId) {
      setWorkspaceId(workspaceId)
    }
  }, [workspaceId, setWorkspaceId])
}

export default useRecentAccessSync