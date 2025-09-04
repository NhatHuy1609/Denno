import useStarBoardMutation from '@/app/_hooks/mutation/board/useStarBoardMutation'
import { toastSuccess, toastError } from '@/ui'
import useUnstarBoardMutation from '@/app/_hooks/mutation/board/useUnstarBoardMutation'

type UseToggleBoardMutationParams = {
  boardId: string
  isStarred: boolean
  onStarBoardSuccess?: () => void
  onUnstarBoardSuccess?: () => void
}

export const useToggleBoardStarredStatusMutation = ({
  boardId,
  isStarred,
  onStarBoardSuccess,
  onUnstarBoardSuccess
}: UseToggleBoardMutationParams) => {
  const { mutateAsync: starBoardAsync, isPending: isStarringBoard } = useStarBoardMutation({
    onSuccess: () => {
      onStarBoardSuccess && onStarBoardSuccess()
    },
    onError: (error) => {
      console.error(error)
      toastError('Failed to star the board')
    }
  })

  const { mutateAsync: unstarBoardAsync, isPending: isUnstarringBoard } = useUnstarBoardMutation({
    onSuccess: () => {
      onUnstarBoardSuccess && onUnstarBoardSuccess()
    },
    onError: (error) => {
      console.error(error)
      toastError('Failed to unstar the board')
    }
  })

  const handleToggleStarBoard = async () => {
    if (isStarred) {
      await unstarBoardAsync(boardId)
    } else {
      await starBoardAsync(boardId)
    }
  }

  return {
    toggleStarBoardAsync: handleToggleStarBoard,
    isPending: isStarringBoard || isUnstarringBoard
  }
}
