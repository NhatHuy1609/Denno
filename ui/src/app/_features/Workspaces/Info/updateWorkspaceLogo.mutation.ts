import { WorkspaceService, workspaceTypesDto } from '@/service/api/workspace'
import { DefaultError, MutationOptions, useMutation } from '@tanstack/react-query'

type UpdateWorkspaceLogoVariables = {
  workspaceId: string,
  data: workspaceTypesDto.UpdateWorkspaceLogoDto
}

export default function useUpdateWorkspaceLogoMutation(
  options?: Pick<
    MutationOptions<
      Awaited<ReturnType<typeof WorkspaceService.updateWorkspaceLogoMutation>>,
      DefaultError,
      UpdateWorkspaceLogoVariables,
      unknown
    >,
    'mutationKey' | 'onMutate' | 'onSettled' | 'onSuccess' | 'onError'
  >
) {
  const {
    mutationKey = [],
    onMutate,
    onSuccess,
    onError,
    onSettled
  } = options || {}

  return useMutation({
    mutationKey: ['workspace', 'update', 'logo', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId, data }: UpdateWorkspaceLogoVariables) => {
      return WorkspaceService.updateWorkspaceLogoMutation({
        workspaceId,
        updateWorkspaceLogoDto: data
      })
    },
    onSuccess,
    onError,
    onSettled
  })
}