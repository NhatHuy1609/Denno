import { useSignalR } from '@/app/_providers/SignalRProvider/useSignalR'
import { HubInvokeEventMap } from '@/service/realtime/send-events'

export const useHubInvoke = () => {
  const { signalRService } = useSignalR()

  return async <K extends keyof HubInvokeEventMap, E extends keyof HubInvokeEventMap[K]>(
    hub: K,
    method: E,
    ...args: Parameters<HubInvokeEventMap[K][E] extends (...args: any) => any ? HubInvokeEventMap[K][E] : never>
  ): Promise<HubInvokeEventMap[K][E] extends (...args: any) => any ? ReturnType<HubInvokeEventMap[K][E]> : never> => {
    if (!signalRService) {
      return Promise.reject(new Error('SignalR not connected'))
    }

    try {
      const result = await signalRService.invoke(hub, method, ...args)
      console.log(`[SignalR Invoke] ${hub}.${String(method)}`, args)
      return result
    } catch (error) {
      console.error(`[SignalR Error] ${hub}.${String(method)}`, error)
      throw error
    }
  }
}
