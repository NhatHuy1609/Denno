import { boardTypes } from "@/entities/board";
import { includesBy } from "@/utils/includesBy";
import { PolicyContext, PolicyResult } from "@/permissions/core/types";
import { workspaceTypes } from "@/entities/workspace";
import { BoardBasePolicy } from "./board-base-policy";
import { filterBy } from "@/utils/filterBy";

export interface BoardViewAccessContext extends PolicyContext {
  boardData?: boardTypes.Board
  workspaceData?: workspaceTypes.Workspace
}

export class BoardViewPolicy extends BoardBasePolicy {
  evaluate(context: BoardViewAccessContext, board?: boardTypes.Board): PolicyResult {
    const { user, boardData } = context
    const targetBoard = board || boardData

    // Deny access if the user is not authenticated or board data is missing
    if (!user || !targetBoard) {
      return this.deny('User not authenticated or board not found')
    }

    // Allow access if the board is public
    if (this.isPublicBoard(targetBoard)) {
      return this.allow('Board is public')
    }

    // Handle access logic for workspace-level visibility
    if (this.isWorkspaceBoard(targetBoard)) {
      return this.evaluateWorkspaceAccess(context, targetBoard)
    }

    // Handle access logic for private boards
    if (this.isPrivateBoard(targetBoard)) {
      return this.evaluatePrivateAccess(context, targetBoard)
    }

    // Deny by default if board visibility is unrecognized
    return this.deny('Unknown board visibility type')
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
      ? this.allow('User is a member of the board or workspace')
      : this.deny('User is not a member of the board or workspace')
  }

  private evaluatePrivateAccess(context: BoardViewAccessContext, board: boardTypes.Board): PolicyResult {
    const { workspaceData } = context
    const { members: workspaceMembers = [] } = workspaceData || {}

    const isBoardMember = this.isBoardMember(context, board)
    const workspaceAdmins = filterBy(workspaceMembers, (m) => m.memberType === 'Admin')
    const isWorkspaceAdmin = includesBy(workspaceAdmins, (m) => m.id === context.user.id)

    return (isBoardMember || isWorkspaceAdmin)
      ? this.allow('User is a member of the board or workspace admin')
      : this.deny('User is not a member of the board or workspace admin')
  }
}

