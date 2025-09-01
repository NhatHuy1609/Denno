import { useSignalR } from '@/app/_providers/SignalRProvider/useSignalR'
import { HubReceiveEventMap } from '@/service/realtime/receive-events'
import { useEffect } from 'react'

export function useHubEventListener<K extends keyof HubReceiveEventMap, E extends keyof HubReceiveEventMap[K]>(
  hubName: K,
  event: E,
  callback: HubReceiveEventMap[K][E]
) {
  const { signalRService } = useSignalR()

  useEffect(() => {
    if (!signalRService) return

    signalRService.on(hubName, event, callback)
    return () => {
      signalRService.off(hubName, event, callback)
    }
  }, [signalRService, hubName, event, callback])
}
