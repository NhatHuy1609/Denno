import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { NotificationService } from '@/service/api/notification/notification.service'

type MarkNotificationAsReadParams = {
  notificationId: number
}

function useMarkNotificationAsReadMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, MarkNotificationAsReadParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['notification', 'markAsRead', ...mutationKey],
    onMutate,
    mutationFn: async ({ notificationId }) => {
      const response = await NotificationService.markNotificationAsRead(notificationId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useMarkNotificationAsReadMutation
