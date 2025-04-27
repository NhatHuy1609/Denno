import { DefaultError, useMutation, UseMutationOptions } from "@tanstack/react-query"
import { WorkspaceService } from "@/service/api/workspace"
import { workspaceTypesDto } from "@/service/api/workspace"

type SendJoinRequestMutationParams = {
  workspaceId: string
  createWorkspaceJoinRequestDto: workspaceTypesDto.CreateWorkspaceJoinRequestDto
}

function useSendJoinRequestMutation(
  options: Pick<
    UseMutationOptions<
      Awaited<workspaceTypesDto.WorkspaceJoinRequestResponseDto>,
      DefaultError,
      SendJoinRequestMutationParams,
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
    mutationKey: ['workspace', 'joinRequest', 'create', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId, createWorkspaceJoinRequestDto }) => {
      const response = await WorkspaceService.createWorkspaceJoinRequestMutation(
        workspaceId, 
        { createWorkspaceJoinRequestDto }
      )
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useSendJoinRequestMutation