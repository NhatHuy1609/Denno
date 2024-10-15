import { WorkspaceService, workspaceTypesDto } from '@/service/api/workspace'
import { DefaultError, MutationOptions, useMutation } from '@tanstack/react-query'


export default function useCreateWorkspaceMutation(
  options?: Pick<
    MutationOptions<
      Awaited<ReturnType<typeof WorkspaceService.CreateWorkspaceMutation>>,
      DefaultError,
      workspaceTypesDto.CreateWorkspaceDto,
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
    mutationKey: ['workspace', 'create', ...mutationKey],
    onMutate,
    mutationFn: async (createWorkspaceDto: workspaceTypesDto.CreateWorkspaceDto) => {
      return WorkspaceService.CreateWorkspaceMutation({ createWorkspaceDto })
    },
    onSuccess,
    onError,
    onSettled
  })
}