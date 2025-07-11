import useCreateInvitationSecretMutation from "@/app/_hooks/mutation/workspace/useCreateInvitationSecretMutation"
import { generateBoardInvitationLink } from "@/utils/invitation-link"
import useCreateBoardInvitationSecretMutation from "./mutation/board/useCreateBoardInvitationSecretMutation"
import { enumTypes } from "@/service/api/_enums"

export const useCreateBoardInvitationLink = (boardId: string, boardRole: enumTypes.BoardMemberRoleEnum) => {
  const { mutateAsync: createBoardInvitationSecret, isPending, isSuccess } = useCreateBoardInvitationSecretMutation({})

  const handleCreateBoardInvitationLink = async (): Promise<string | null> => {
    try {
      const data = await createBoardInvitationSecret({
        boardId,
        createBoardInvitationSecretDto: {
          boardRole: boardRole
        }
      })
      if (data && data.secretCode) {
        const { secretCode } = data
        const link = generateBoardInvitationLink(boardId, secretCode)
        
        return link
      }
    } catch (error) {
      console.error("Error creating board invitation link:", error)
      return null
    }

    return null
  }

  return { 
    isSuccess,
    isCreatingLink: isPending,
    createBoardInvitationLink: handleCreateBoardInvitationLink,
  }
}