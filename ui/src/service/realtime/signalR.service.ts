import { HttpTransportType, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr'
import type { HubConnection } from '@microsoft/signalr'
import type { HubType } from './types'
import { HubReceiveEventMap } from './receive-events'
import { HubInvokeEventMap } from './send-events'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

class SignalRService {
  connectionStartPromises: Partial<Record<HubType, Promise<void>>>
  connections: Partial<Record<HubType, HubConnection>>
  urls: Record<HubType, string>

  constructor() {
    this.connectionStartPromises = {}
    this.connections = {}
    this.urls = {
      notification: '/hubs/notification',
      workspace: '/hubs/workspace',
      board: '/hubs/board'
    }
  }

  createConnection(hubName: HubType) {
    if (this.connections[hubName]) return this.connections[hubName]

    const url = this.urls[hubName]

    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_BE_URL}${url}`, {
        accessTokenFactory: async () => getLocalStorageItem(PersistedStateKey.Token)
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connection
      .start()
      .then(() => console.log(`Connected to ${hubName} hub successfully`))
      .catch((err) => console.error(`Error starting connection for ${hubName}:`, err))

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

  async invoke<K extends keyof HubInvokeEventMap, E extends keyof HubInvokeEventMap[K]>(
    hub: K,
    method: E,
    ...args: Parameters<HubInvokeEventMap[K][E] extends (...args: any) => any ? HubInvokeEventMap[K][E] : never>
  ): Promise<HubInvokeEventMap[K][E] extends (...args: any) => any ? ReturnType<HubInvokeEventMap[K][E]> : never> {
    const connection = this.connections[hub]
    if (!connection) return Promise.reject(new Error(`No connection for hub: ${hub}`))

    if (connection.state !== HubConnectionState.Connected) {
      if (!this.connectionStartPromises[hub]) {
        this.connectionStartPromises[hub] = connection.start().finally(() => {
          delete this.connectionStartPromises[hub]
        })
      }

      await this.connectionStartPromises[hub]
    }

    return connection.invoke(method as string, ...args) as Promise<
      HubInvokeEventMap[K][E] extends (...args: any) => any ? ReturnType<HubInvokeEventMap[K][E]> : never
    >
  }

  off<K extends keyof HubReceiveEventMap, E extends keyof HubReceiveEventMap[K]>(
    hubName: K,
    event: E,
    callback?: HubReceiveEventMap[K][E]
  ) {
    const connection = this.connections[hubName]
    if (connection) {
      connection.off(event as string, callback as (...args: any[]) => void)
    }
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
