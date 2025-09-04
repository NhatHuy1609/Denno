import React from 'react'
import TooltipWrapper from '@/app/_components/TooltipWrapper'
import { useToggleBoardStarredStatusMutation } from '@/app/_hooks/mutation/board/useToggleBoardStarredStatusMutation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useBoardQuery } from '@/app/_hooks/query'
import { toastSuccess } from '@/ui'
import StarButton from '@/app/_components/StarButton'

function FavourButton() {
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard)
  const { data: boardData, refetch } = useBoardQuery(boardId)

  const { starredStatus: isStarred = false } = boardData || {}

  const { toggleStarBoardAsync } = useToggleBoardStarredStatusMutation({
    boardId: boardId,
    isStarred,
    onStarBoardSuccess: () => {
      refetch()
      toastSuccess('Successfully starred the board')
    },
    onUnstarBoardSuccess: () => {
      refetch()
      toastSuccess('Successfully unstarred the board')
    }
  })

  const handleToggleBoardStatus = async () => {
    await toggleStarBoardAsync()
  }

  return (
    <TooltipWrapper
      content={
        <>
          Click to star or unstar this board. Starred <br /> boards show up at the top of your boards list.
        </>
      }
      side='bottom'
      sideOffset={4}
    >
      <StarButton onClick={handleToggleBoardStatus} isStarred={isStarred} />
    </TooltipWrapper>
  )
}

export default FavourButton
