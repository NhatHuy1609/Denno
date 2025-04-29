import { ApiQueryOptionsParams } from "../types";
import { useApiQueryWrapper } from "../useApiQueryWrapper";
import { Notification } from "@/entities/notification/notification.types";
import { UserQueries } from "@/entities/user";

export const useUserNotifications = (
  userId: string, 
  options?: ApiQueryOptionsParams<Notification[]>
) => {
  const queryOptions = UserQueries.usersNotificationsQuery(userId);
  
  return useApiQueryWrapper(queryOptions, options)
};