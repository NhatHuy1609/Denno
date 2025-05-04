import { createContext, useEffect } from 'react'
import SignalRService from '@/service/realtime/signalR.service'

type SignalRContextProps = {
  signalRService?: typeof SignalRService
}

export const SignalRContext = createContext<SignalRContextProps>({})

export const SignalRProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Connects to the SignalR hubs when the component mounts
    SignalRService.createConnection('notification')
    SignalRService.createConnection('workspace')
    SignalRService.createConnection('board')

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
