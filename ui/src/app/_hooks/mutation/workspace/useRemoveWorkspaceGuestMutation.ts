import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { WorkspaceService } from '@/service/api/workspace'

type RemoveWorkspaceGuestMutationParams = {
  workspaceId: string
  userId: string
}

function useRemoveWorkspaceGuestMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, RemoveWorkspaceGuestMutationParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['workspace', 'removeGuest', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId, userId }) => {
      const response = await WorkspaceService.removeWorkspaceGuest(workspaceId, userId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useRemoveWorkspaceGuestMutation
