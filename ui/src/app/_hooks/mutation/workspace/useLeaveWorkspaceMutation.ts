import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { WorkspaceService } from '@/service/api/workspace'
import { workspaceTypesDto } from '@/service/api/workspace'

type LeaveWorkspaceMutationParams = {
  workspaceId: string
}

function useLeaveWorkspaceMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, LeaveWorkspaceMutationParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['workspace', 'leave', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId }) => {
      const response = await WorkspaceService.leaveWorkspace(workspaceId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useLeaveWorkspaceMutation
