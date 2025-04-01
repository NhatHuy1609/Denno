import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { WorkspaceService } from "@/service/api/workspace"
import { workspaceTypesDto } from "@/service/api/workspace"

type MemberEmail = workspaceTypesDto.AddWorkspaceMemberDto['email']

type AddMultipleWorkspaceMemberParams = {
  workspaceId: string
  description: string
  memberEmails: Array<MemberEmail>
}

type AddMultipleWorkspaceMemberData = {
  addedMembers: Array<workspaceTypesDto.AddWorkspaceMemberResponseDto['targetUserId']>
} & Omit<workspaceTypesDto.AddWorkspaceMemberResponseDto, 'targetUserId' | 'date'>

function useAddMultipleWorkspaceMemberMutation(
  options: Pick<
    UseMutationOptions<
      AddMultipleWorkspaceMemberData,
      DefaultError,
      AddMultipleWorkspaceMemberParams,
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
    mutationKey: ['workspace', 'addMember', 'multiple', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId, memberEmails, description }) => {
      const addWorkspaceMemberDtos: Array<workspaceTypesDto.AddWorkspaceMemberDto> = memberEmails.map((email) => ({
        email,
        description,
        role: 'Normal'
      }))

      const responses = await Promise.all(
        addWorkspaceMemberDtos.map((addWorkspaceMemberDto) =>
          WorkspaceService.addWorkspaceMemberMutation({ workspaceId, addWorkspaceMemberDto })
        )
      )

      // Take the first response for creating shape of AddMultipleWorkspaceMemberData
      const firstResponse = responses[0]
      const addedMembersResponseData = {
        ...firstResponse.data,
        addedMembers: responses.map((response) => response.data.targetUserId)
      }

      return addedMembersResponseData
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useAddMultipleWorkspaceMemberMutation