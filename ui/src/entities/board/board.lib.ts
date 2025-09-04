import { boardTypesDto } from '@/service/api/board'
import {
  Board,
  BoardJoinRequest,
  BoardJoinRequests,
  BoardMemberRole,
  Boards,
  DetailedBoardInvitation
} from './board.schemas'
import { InvitationSecret } from '../invitationSecret/invitationSecret.schemas'
import { userTypesDto } from '@/service/api/user'
import { dot } from 'node:test/reporters'

export function transformBoardDtoToBoard(boardDto: boardTypesDto.BoardResponseDto): Board {
  return {
    ...boardDto
  }
}

export function transformBoardsDtoToBoards(boardsDto: boardTypesDto.BoardsResponseDto): Boards {
  return boardsDto.map((boardDto) => transformBoardDtoToBoard(boardDto))
}

export function mapToInvitationSecret(dto: boardTypesDto.BoardInvitationSecretResponseDto): InvitationSecret {
  return {
    ...dto
  }
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

export function mapToBoardJoinRequest(dto: boardTypesDto.BoardJoinRequestResponseDto): BoardJoinRequest {
  return {
    ...dto,
    requester: {
      ...dto.requester,
      name: dto.requester.name
    }
  }
}

export function mapToBoardJoinRequests(dto: boardTypesDto.BoardJoinRequestsResponseDto): BoardJoinRequests {
  return dto.map((boardJoinRequest) => mapToBoardJoinRequest(boardJoinRequest))
}

export function getRoleHierarchy(role?: BoardMemberRole): number {
  if (!role) {
    return 0
  }

  const hierarchy = {
    Observer: 1,
    Member: 2,
    Admin: 3
  }

  return hierarchy[role] || 0
}
