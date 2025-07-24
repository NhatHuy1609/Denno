import { boardTypes } from "@/entities/board";
import { filterBy } from "@/utils/filterBy";
import { includesBy } from "@/utils/includesBy";
import { PolicyContext, PolicyResult } from "@/permissions/core/types";
import { workspaceTypes } from "@/entities/workspace";
import { BoardBasePolicy } from "./board-base-policy";

export interface BoardViewAccessContext extends PolicyContext {
  boardData?: boardTypes.Board
  workspaceData?: workspaceTypes.Workspace
}

export class BoardViewPolicy extends BoardBasePolicy {
  evaluate(context: BoardViewAccessContext, board?: boardTypes.Board): PolicyResult {
    const { user, boardData } = context
    const targetBoard = board || boardData

    if (!user || !targetBoard) {
      return this.deny('GLOBAL::MISSING_AUTHENTICATION_OR_BOARD')
    }

    if (this.isPublicBoard(targetBoard)) {
      return this.allow('BOARD::ALLOWED_IS_PUBLIC')
    }

    if (this.isWorkspaceBoard(targetBoard)) {
      return this.evaluateWorkspaceAccess(context, targetBoard)
    }

    if (this.isPrivateBoard(targetBoard)) {
      return this.evaluatePrivateAccess(context, targetBoard)
    }

    return this.deny('BOARD::INVALID_VISIBILITY')
  }

  private isPublicBoard(board: boardTypes.Board): boolean {
    return this.hasVisibility(board, 'Public')
  }

  private isWorkspaceBoard(board: boardTypes.Board): boolean {
    return this.hasVisibility(board, 'Workspace')
  }

  private isPrivateBoard(board: boardTypes.Board): boolean {
    return this.hasVisibility(board, 'Private')
  }

  private evaluateWorkspaceAccess(context: BoardViewAccessContext, board: boardTypes.Board): PolicyResult {
    const { user, workspaceData } = context
    const workspaceMembers = workspaceData?.members || []

    const isWorkspaceMember = includesBy(workspaceMembers, (m) => m.id === user.id)
    const isBoardMember = this.isBoardMember(context, board)

    return (isWorkspaceMember || isBoardMember)
      ? this.allow('BOARD::ALLOWED_IS_WORKSPACE_LEVEL')
      : this.deny('BOARD::DENIED_USER_NOT_IN_BOARD_OR_WORKSPACE')
  }

  private evaluatePrivateAccess(context: BoardViewAccessContext, board: boardTypes.Board): PolicyResult {
    const { workspaceData } = context
    const { members: workspaceMembers = [] } = workspaceData || {}

    const isBoardMember = this.isBoardMember(context, board)
    const workspaceAdmins = filterBy(workspaceMembers, (m) => m.memberType === 'Admin')
    const isWorkspaceAdmin = includesBy(workspaceAdmins, (m) => m.id === context.user.id)

    return (isBoardMember || isWorkspaceAdmin)
      ? this.allow('BOARD::ALLOWED_IS_PRIVATE')
      : this.deny('BOARD::DENIED_USER_NOT_IN_BOARD_OR_NOT_WORKSPACE_ADMIN')
  }
}
