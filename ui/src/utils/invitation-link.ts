export function generateWorkspaceInvitationLink(workspaceId: string, secret: string) {
  return `${window.location.origin}/invite/${workspaceId}/${secret}`
}

export function generateBoardInvitationLink(boardId: string, secret: string) {
  return `${window.location.origin}/invite/board/${boardId}/${secret}`
}