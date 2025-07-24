import { InvitationSecret } from "../invitationSecret/invitationSecret.types";
import { Board, BoardJoinRequest, BoardJoinRequests, Boards, DetailedBoardInvitation } from "./board.types";
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

export function mapToDetailedBoardInvitation(
  dto: boardTypesDto.DetailedBoardInvitationSecretResponseDto
): DetailedBoardInvitation {
  return {
    inviter: {
      id: dto.inviter.id,
      fullName: dto.inviter.fullName,
      email: dto.inviter.email
    },
    board: {
      id: dto.board.id,
      name: dto.board.name
    }
  }
}

export function mapToBoardJoinRequest(
  dto: boardTypesDto.BoardJoinRequestResponseDto
): BoardJoinRequest {
  return {
    ...dto,
    requester: {
      ...dto.requester,
      name: dto.requester.name
    }
  }
}

export function mapToBoardJoinRequests(
  dto: boardTypesDto.BoardJoinRequestsResponseDto
): BoardJoinRequests {
  return dto.map(boardJoinRequest => mapToBoardJoinRequest(boardJoinRequest))
}