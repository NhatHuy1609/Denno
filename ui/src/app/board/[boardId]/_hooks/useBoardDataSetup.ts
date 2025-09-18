import { useMe } from '@/app/_hooks/query/user/useMe'
import { useBoardQuery } from '@/app/_hooks/query'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setBoard, setCurrentUserRole } from '@/store/features/board/board.slice'

export const useBoardDataSetup = (boardId: string, enabled: boolean = true) => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: currentUser } = useMe({
    enabled: enabled || !!boardId
  })
  const { data: boardData } = useBoardQuery(boardId, { includeBoardMembers: true }, { enabled: enabled || !!boardId })

  const dispatch = useAppDispatch()
  const currentUserBoardMemberRole = boardData?.members.find(
    (member) => member.memberId === currentUser?.id
  )?.boardMemberRole

  useEffect(() => {
    if (!enabled || !currentUserBoardMemberRole) return

    const setUpBoardData = () => {
      setIsLoading(true)

      // Set board data in the store
      dispatch(
        setBoard({
          id: boardId
        })
      )
      // Set current user role of current access board
      dispatch(setCurrentUserRole(currentUserBoardMemberRole))

      setIsLoading(false)
    }

    setUpBoardData()
  }, [currentUserBoardMemberRole])

  return {
    isLoading
  }
}
