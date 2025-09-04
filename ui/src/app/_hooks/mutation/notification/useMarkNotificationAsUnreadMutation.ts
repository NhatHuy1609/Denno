import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { NotificationService } from '@/service/api/notification/notification.service'

type MarkNotificationAsUnreadParams = {
  notificationId: number
}

function useMarkNotificationAsUnreadMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, MarkNotificationAsUnreadParams, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['notification', 'markAsUnread', ...mutationKey],
    onMutate,
    mutationFn: async ({ notificationId }) => {
      const response = await NotificationService.markNotificationAsUnread(notificationId)
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useMarkNotificationAsUnreadMutation
