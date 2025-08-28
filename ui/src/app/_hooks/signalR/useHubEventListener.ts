import { useSignalR } from '@/app/_providers/SignalRProvider/useSignalR'
import { HubReceiveEventMap } from '@/service/realtime/receive-events'
import { useEffect } from 'react'

type UseHubEventListenerParams<K extends keyof HubReceiveEventMap, E extends keyof HubReceiveEventMap[K]> = {
  hubName: K
  event: E
  callback: HubReceiveEventMap[K][E]
}

export const useHubEventListener = <K extends keyof HubReceiveEventMap, E extends keyof HubReceiveEventMap[K]>({
  hubName,
  event,
  callback
}: UseHubEventListenerParams<K, E>) => {
  const { signalRService } = useSignalR()

  useEffect(() => {
    if (!signalRService) {
      return
    }

    signalRService.on(hubName, event, callback)
    return () => {
      signalRService.off(hubName, event, callback)
    }
  }, [signalRService, callback, hubName, event])
}
