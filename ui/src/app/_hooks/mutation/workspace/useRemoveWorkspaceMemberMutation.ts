import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { WorkspaceService } from '@/service/api/workspace'

type RemoveWorkspaceMemberMutationParams = {
  workspaceId: string
  memberId: string
}

function useRemoveWorkspaceMemberMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, RemoveWorkspaceMemberMutationParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['workspace', 'member', 'remove', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId, memberId }) => {
      const response = await WorkspaceService.removeWorkspaceMember(workspaceId, memberId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useRemoveWorkspaceMemberMutation
