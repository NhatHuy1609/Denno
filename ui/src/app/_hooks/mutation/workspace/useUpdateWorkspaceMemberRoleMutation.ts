import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { WorkspaceService } from '@/service/api/workspace'
import { workspaceTypesDto } from '@/service/api/workspace'

type UpdateWorkspaceMemberRoleMutationParams = {
  workspaceId: string
  memberId: string
  updateWorkspaceMemberRoleDto: workspaceTypesDto.UpdateWorkspaceMemberRoleDto
}

function useUpdateWorkspaceMemberRoleMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, UpdateWorkspaceMemberRoleMutationParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['workspace', 'member-role', 'update', ...mutationKey],
    onMutate,
    mutationFn: async ({ workspaceId, memberId, updateWorkspaceMemberRoleDto }) => {
      const response = await WorkspaceService.updateWorkspaceMemberRole(workspaceId, memberId, {
        updateWorkspaceMemberRoleDto
      })
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useUpdateWorkspaceMemberRoleMutation
