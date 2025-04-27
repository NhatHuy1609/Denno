export function generateWorkspaceInvitationLink(workspaceId: string, secret: string) {
  return `${window.location.origin}/invite/${workspaceId}/${secret}`
}