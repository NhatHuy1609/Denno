import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import type { HubConnection } from "@microsoft/signalr"
import type { HubType } from './types'
import { HubReceiveEventMap } from './receive-events'
import { HubInvokeEventMap } from './send-events'

class SignalRService {
  connections: Partial<Record<HubType, HubConnection>>
  urls: Record<HubType, string>

  constructor() {
    this.connections = {}
    this.urls = {
      'notification': '/hubs/notification',
      'workspace': '/hubs/workspace',
      'board': '/hubs/board',
    }
  }

  createConnection(hubName: HubType) {
    if (this.connections[hubName]) return this.connections[hubName]
    
    const url = this.urls[hubName]

    const connection = new HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connection.start().catch(err => console.error(`Error starting connection for ${hubName}:`, err))

    this.connections[hubName] = connection
    return connection
  }

  on<K extends keyof HubReceiveEventMap, E extends keyof HubReceiveEventMap[K]>(
    hubName: K,
    event: E,
    callback: HubReceiveEventMap[K][E]
  ) {
    const connection = this.connections[hubName]
    if (connection) {
      connection.on(event as string, callback as (...args: any[]) => void)
    }
  }

  invoke<K extends keyof HubInvokeEventMap, E extends keyof HubInvokeEventMap[K]>(
    hub: K,
    method: E,
    ...args: Parameters<HubInvokeEventMap[K][E] extends (...args: any) => any ? HubInvokeEventMap[K][E] : never>
  ): Promise<HubInvokeEventMap[K][E] extends (...args: any) => any ? ReturnType<HubInvokeEventMap[K][E]> : never> {
    const connection = this.connections[hub];
    if (!connection)
      return Promise.reject(new Error(`No connection for hub: ${hub}`));

    return connection.invoke(
      method as string,
      ...args
    ) as Promise<HubInvokeEventMap[K][E] extends (...args: any) => any ? ReturnType<HubInvokeEventMap[K][E]> : never>;
  }

  stopConnection(hubName: HubType) {
    const connection = this.connections[hubName]
    if (connection) {
      connection.stop().then(() => {
        console.log(`Connection for ${hubName} stopped.`)
        delete this.connections[hubName]
      })
    }
  }
}

export default new SignalRService()