import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { BoardService } from "@/service/api/board"
import { boardTypesDto } from "@/service/api/board"
import { actionTypesDto } from "@/service/api/action"
import { enumTypes } from "@/service/api/_enums"

type MemberEmail = boardTypesDto.AddBoardMemberDto['email']

type AddMultipleBoardMemberParams = {
  role: enumTypes.BoardMemberRoleEnum
  boardId: string
  description: string
  memberEmails: Array<MemberEmail>
}

type AddMultipleBoardMemberData = {
  addedMembers: Array<string>
} & Partial<actionTypesDto.ActionResponseDto>

function useAddMultipleBoardMemberMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<AddMultipleBoardMemberData>,
      DefaultError,
      AddMultipleBoardMemberParams,
      any
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const {
    mutationKey = [],
    onMutate,
    onSuccess,
    onError,
    onSettled
  } = options

  return useMutation({
    mutationKey: ['board', 'addMember', 'multiple', ...mutationKey],
    onMutate,
    mutationFn: async ({ boardId, memberEmails, description, role }) => {
      const addBoardMemberDtos: Array<boardTypesDto.AddBoardMemberDto> = memberEmails.map((email) => ({
        email,
        description,
        role
      }))

      // Send multiple requests in parallel
      const responses = await Promise.all(
        addBoardMemberDtos.map((addBoardMemberDto) =>
          BoardService.addBoardMemberMutation({ boardId, addBoardMemberDto })
        )
      )

      // Take the first response for creating shape of AddMultipleBoardMemberData
      const firstResponse = responses[0]
      // Getting data shape from first response
      const { 
        id,
        date,
        actionType,
        memberCreatorId,
      } = firstResponse.data

      const addedMembersResponseData = {
        id,
        date,
        actionType,
        boardId,
        memberCreatorId: memberCreatorId ?? '',
        // Map the targetUserId from each response to create an array of added members
        addedMembers: responses.map((response) => response.data.targetUserId ?? '')
      }

      return addedMembersResponseData
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useAddMultipleBoardMemberMutation