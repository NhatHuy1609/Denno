import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { WorkspaceService } from "@/service/api/workspace"
import { workspaceTypesDto } from "@/service/api/workspace"
import { AddWorkspaceMemberActionResponseDto } from "@/service/api/action/action.types"

type AddWorkspaceMemberParams = {
  workspaceId: string
  addWorkspaceMemberDto: workspaceTypesDto.AddWorkspaceMemberDto
}

function useAddWorkspaceMemberMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<AddWorkspaceMemberActionResponseDto>,
      DefaultError,
      AddWorkspaceMemberParams,
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
    mutationKey: ['workspace', 'addMember', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId, addWorkspaceMemberDto }) => {
      const response = await WorkspaceService.addWorkspaceMemberMutation({ workspaceId, addWorkspaceMemberDto })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useAddWorkspaceMemberMutation