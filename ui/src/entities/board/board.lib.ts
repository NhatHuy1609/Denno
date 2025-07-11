import { InvitationSecret } from "../invitationSecret/invitationSecret.types";
import { Board, Boards } from "./board.types";
import { boardTypesDto } from "@/service/api/board";

export function transformBoardDtoToBoard(
  boardDto: boardTypesDto.BoardResponseDto
): Board {
  return {
    ...boardDto
  }
}

export function transformBoardsDtoToBoards(
  boardsDto: boardTypesDto.BoardsResponseDto
): Boards {
  return boardsDto.map(boardDto => transformBoardDtoToBoard(boardDto))
}

export function mapToInvitationSecret(
  dto: boardTypesDto.BoardInvitationSecretResponseDto
): InvitationSecret {
  return {
    ...dto
  };
}