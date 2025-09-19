import axios from 'axios'
import { store } from '@/lib/redux/store'
import { messageError, messageInfo } from '@/ui'
import { getLocalStorageItem } from '@/utils/local-storage'
import { authApiLib } from './auth'
import { updateSession } from '@/store/features/session'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { redirect } from 'next/navigation' // App Router

// Types
interface QueuedRequest {
  resolve: (token: string) => void
  reject: (error: any) => void
}

// Global window flags
declare global {
  interface Window {
    sessionExpiredMessageShown?: boolean
    sessionInvalidMessageShown?: boolean
  }
}

// Axios instances

const instance = axios.create({ baseURL: process.env.NEXT_PUBLIC_BE_GATEWAY })
const refreshInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_BE_GATEWAY })
const publicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_GATEWAY
})

// Refresh token state
let isRefreshing = false
let failedQueue: QueuedRequest[] = []

// Process queued requests after refresh token
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token!)))
  failedQueue = []
}

// Helper redirect + message
const handleSignInRedirect = (message: string, delay = 500) => {
  if (!window.sessionExpiredMessageShown) {
    window.sessionExpiredMessageShown = true
    messageInfo(message)
    setTimeout(() => {
      window.sessionExpiredMessageShown = false
      store.dispatch(updateSession({ token: undefined, refreshToken: undefined }))
      redirect('/sign-in') // App Router redirect
    }, delay)
  }
}

// Request interceptor: gắn token
instance.interceptors.request.use(
  (config) => {
    const token = getLocalStorageItem(PersistedStateKey.Token)
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { statusCode, errorType } = authApiLib.getDetailedError(error)

    // === 401 ExpiredToken ===
    if (statusCode === 401 && errorType === 'ExpiredToken' && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh token, push vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return instance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      // Bắt đầu refresh token
      originalRequest._retry = true
      isRefreshing = true
      try {
        const token = getLocalStorageItem(PersistedStateKey.Token)
        const refreshToken = getLocalStorageItem(PersistedStateKey.RefreshToken)
        if (!refreshToken) throw new Error('No refresh token available')

        const response = await refreshInstance.post('/auth/refresh', { jwtToken: token, refreshToken })
        const { accessToken, refreshToken: newRefreshToken } = response.data

        store.dispatch(updateSession({ token: accessToken, refreshToken: newRefreshToken }))
        processQueue(null, accessToken)

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleSignInRedirect('Your session has expired. Please log in again to continue')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // === 401 InvalidToken ===
    if (statusCode === 401 && errorType !== 'ExpiredToken') {
      handleSignInRedirect('Invalid session. Please log in again.', 1500)
    }

    return Promise.reject(error)
  }
)

// Export helpers
export const req = instance
export const httpGet = req.get
export const httpPost = req.post
export const httpPut = req.put
export const httpDel = req.delete

export const publicGet = publicInstance.get
export const publicPost = publicInstance.post
export const publicPut = publicInstance.put
export const publicDelete = publicInstance.delete
