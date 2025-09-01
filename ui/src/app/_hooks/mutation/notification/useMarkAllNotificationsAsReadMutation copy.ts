import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { NotificationService } from '@/service/api/notification/notification.service'

function useMarkAllNotificationsAsReadMutation(
  options: Pick<
    UseMutationOptions<any, DefaultError, void, any>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['notification', 'markAllAsRead', ...mutationKey],
    onMutate,
    mutationFn: async () => {
      const response = await NotificationService.markAllNotificationsAsRead()
      return response.data
    },
    onSuccess,
    onError,
    onSettled
  })
}

export default useMarkAllNotificationsAsReadMutation
