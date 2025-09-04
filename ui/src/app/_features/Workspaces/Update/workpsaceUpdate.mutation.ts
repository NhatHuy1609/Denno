import { WorkspaceService, workspaceTypesDto } from '@/service/api/workspace'
import { DefaultError, MutationOptions, useMutation } from '@tanstack/react-query'

type UpdateWorkspaceVariables = {
  workspaceId: string
  data: Partial<workspaceTypesDto.UpdateWorkspaceDto>
}

export default function useUpdateWorkspaceMutation(
  options?: Pick<
    MutationOptions<
      Awaited<ReturnType<typeof WorkspaceService.updateWorkspaceMutation>>,
      DefaultError,
      UpdateWorkspaceVariables,
      unknown
    >,
    'mutationKey' | 'onMutate' | 'onSettled' | 'onSuccess' | 'onError'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options || {}

  return useMutation({
    mutationKey: ['workspace', 'update', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId, data }: UpdateWorkspaceVariables) => {
      return WorkspaceService.updateWorkspaceMutation({
        workspaceId,
        updateWorkspaceDto: data
      })
    },
    onSuccess,
    onError,
    onSettled
  })
}
