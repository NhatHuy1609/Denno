import { httpPut } from '../_req'

export class NotificationService {
  private static readonly basePath = '/notifications'

  static markNotificationAsRead(notificationId: number) {
    return httpPut(`${this.basePath}/${notificationId}/read`)
  }

  static markNotificationAsUnread(notificationId: number) {
    return httpPut(`${this.basePath}/${notificationId}/unread`)
  }

  static markAllNotificationsAsRead() {
    return httpPut(`${this.basePath}/readAll`)
  }
}
