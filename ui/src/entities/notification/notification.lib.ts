import { Notification } from "./notification.types";
import { NotificationResponseDto } from "@/service/api/notification/notification.types";

export function mapToNotification(dto: NotificationResponseDto): Notification {
  return {
    id: dto.id,
    isRead: dto.isRead,
    type: dto.type,
    date: dto.date,
    translationKey: dto.display.translationKey,
    initiator: {
      id: dto.memberCreator.id,
      name: dto.memberCreator.fullName,
      avatar: dto.memberCreator.avatar,
    },
    entities: dto.display.entities,
  }
}

export function mapToNotifications(dtos: NotificationResponseDto[]): Notification[] {
  return dtos.map(mapToNotification)
}