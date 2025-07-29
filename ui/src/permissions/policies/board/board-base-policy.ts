import { boardTypes } from "@/entities/board";
import { BasePolicy } from "../base-policy";
import { includesBy } from "@/utils/includesBy";
import { PolicyContext } from "@/permissions/types/policy-context";
import { PolicyResult } from "@/permissions/types/policy-result";

export abstract class BoardBasePolicy extends BasePolicy<boardTypes.Board> {
  abstract evaluate(context: PolicyContext, resource?: boardTypes.Board): PolicyResult

  protected isBoardMember(context: PolicyContext, board: boardTypes.Board): boolean {
    const { user } = context
    const { members = [] } = board

    return includesBy(members, (member) => member.memberId === user.id)
  }

  protected hasVisibility(
    board: boardTypes.Board, 
    visibility: boardTypes.Board['visibility']
  ): boolean {
    return board.visibility === visibility
  }
}