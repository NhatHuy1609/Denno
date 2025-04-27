import useCreateInvitationSecretMutation from "@/app/_hooks/mutation/workspace/useCreateInvitationSecretMutation"
import { generateWorkspaceInvitationLink } from "@/utils/invitation-link"

export const useCreateInvitationLink = (workspaceId: string) => {
  const { mutateAsync: createInvitationSecret, isPending } = useCreateInvitationSecretMutation({})

  const handleCreateInvitationLink = async (): Promise<string | null> => {
    try {
      const data = await createInvitationSecret(workspaceId)
      if (data && data.secretCode) {
        const { secretCode } = data
        const link = generateWorkspaceInvitationLink(workspaceId, secretCode)
        
        return link
      }
    } catch (error) {
      console.error("Error creating invitation link:", error)
      return null
    }

    return null
  }

  return { 
    isCreatingLink: isPending,
    createInvitationLink: handleCreateInvitationLink,
  }
}