import { createContext, useEffect } from 'react'
import SignalRService from '@/service/realtime/signalR.service'
import { notificationLib } from '@/entities/notification'
import { useQueryClient } from '@tanstack/react-query'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { UserQueries } from '@/entities/user'

type SignalRContextProps = {
  signalRService?: typeof SignalRService
}

export const SignalRContext = createContext<SignalRContextProps>({})

export const SignalRProvider = ({ children }: { children: React.ReactNode }) => {
  const currentUserId = getLocalStorageItem(PersistedStateKey.MeId)
  const queryClient = useQueryClient()

  useEffect(() => {
    // Connects to the SignalR hubs when the component mounts
    SignalRService.createConnection('notification')
    SignalRService.createConnection('workspace')
    SignalRService.createConnection('board')

    // Listen to notification hub for new notifications of user
    SignalRService.on('notification', 'ReceiveActionNotification', (notificationResponse) => {
      const notification = notificationLib.mapToNotification(notificationResponse)
      // Update notifications by adding new notification to the beginning of the list
      queryClient.setQueryData(
        UserQueries.usersNotificationsQuery(currentUserId).queryKey,
        (oldData) => {
          const newData = [notification, ...(oldData || [])]
          return newData
        }
      )
    })

    return () => {
      // Disconnects from the SignalR hubs when the component unmounts
      SignalRService.stopConnection('notification')
      SignalRService.stopConnection('workspace')
      SignalRService.stopConnection('board')
    }
  }, [])

  return (
    <SignalRContext.Provider value={{ signalRService: SignalRService }}>
      {children}
    </SignalRContext.Provider>
  )
}
