import { toastError, toastSuccess } from '@/ui'
import useMarkCardAsCompletedMutation from './useMarkCardAsCompletedMutation'
import useMarkCardAsInCompletedMutation from './useMarkCardAsInCompletedMutation'

type UseToggleCardCompletionStatusProps = {
  cardId: string
  isCompleted: boolean
  onMarkAsCompletedSuccess?: () => void
  onMarkAsInCompletedSuccess?: () => void
  onMarkAsCompletedFailed?: () => void
  onMarkAsInCompletedFailed?: () => void
}

export const useToggleCardCompletionStatus = ({
  cardId,
  isCompleted,
  onMarkAsCompletedSuccess,
  onMarkAsInCompletedSuccess,
  onMarkAsCompletedFailed,
  onMarkAsInCompletedFailed
}: UseToggleCardCompletionStatusProps) => {
  const { mutateAsync: markAsCompleted } = useMarkCardAsCompletedMutation({
    onSuccess: () => {
      onMarkAsCompletedSuccess?.()
    },
    onError: (error) => {
      console.error(error)
      toastError('Failed to mark card as completed')
      onMarkAsCompletedFailed?.()
    }
  })

  const { mutateAsync: markAsInCompleted } = useMarkCardAsInCompletedMutation({
    onSuccess: () => {
      onMarkAsInCompletedSuccess?.()
    },
    onError: (error) => {
      console.error(error)
      toastError('Failed to mark card as inCompleted')
      onMarkAsInCompletedFailed?.()
    }
  })

  const toggleCardCompletionStatusAsync = async () => {
    if (isCompleted) {
      markAsInCompleted({ id: cardId })
    } else {
      markAsCompleted({ id: cardId })
    }
  }

  return { toggleCardCompletionStatusAsync }
}
