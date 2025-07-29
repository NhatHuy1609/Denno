import { useBoardQuery } from "./useBoardQuery"

export const useBoardMembers = (boardId: string) => {
  const queryResult = useBoardQuery(boardId, {
    includeBoardMembers: true
  })

  return {
    ...queryResult,
    boardMembers: queryResult.data?.members || []
  }
}
