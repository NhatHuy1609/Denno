import { useBoardQuery, useWorkspaceQuery } from "@/app/_hooks/query"
import { useMe } from "@/app/_hooks/query/user/useMe"
import { PolicyEngine } from "../core/policy-engine"
import { BoardViewAccessContext } from "../policies/board/board-view-policy"

function useBoardPolicyAccess(boardId: string) {
  const { data: currentUser } = useMe()
  
  const { data: boardData } = useBoardQuery(boardId, {
    includeBoardMembers: true
  })
  const { workspaceId = '' } = boardData || {}
  
  const { data: workspaceData } = useWorkspaceQuery(workspaceId, {
    members: true
  })

  // Initialize policy engine for permissions check
  const policyEngine = new PolicyEngine()

  if (!currentUser) {
    return {}
  }
  
  const context: BoardViewAccessContext = {
    user: currentUser,
    boardData,
    workspaceData
  }

  const viewResult = policyEngine.canWithReason(
    'view',
    'board',
    context
  )

  return {
    canView: viewResult.allowed,
    viewReason: viewResult.reason,
    isLoading: !currentUser || !boardData || (workspaceId && !workspaceData),
    boardData,
    workspaceData,
    workspaceId
  }
}

export default useBoardPolicyAccess