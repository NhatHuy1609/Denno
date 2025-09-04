import axios from 'axios'
import { store } from '@/lib/redux/store'
import { messageError, messageInfo } from '@/ui'
import { getLocalStorageItem } from '@/utils/local-storage'
import { authApiLib } from './auth'
import { updateSession } from '@/store/features/session'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

// Types
interface QueuedRequest {
  resolve: (token: string) => void
  reject: (error: any) => void
}

declare global {
  interface Window {
    sessionExpiredMessageShown?: boolean
    sessionInvalidMessageShown?: boolean
  }
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_GATEWAY
})

// Tạo instance riêng cho refresh token để tránh circular dependency
const refreshInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_GATEWAY
})

// Biến để track trạng thái refresh token
let isRefreshing = false
let failedQueue: QueuedRequest[] = []

// Process queue khi refresh token thành công/thất bại
const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })

  failedQueue = []
}

instance.interceptors.request.use(
  (config) => {
    const token = getLocalStorageItem(PersistedStateKey.Token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { statusCode, errorType } = authApiLib.getDetailedError(error)

    // Chỉ xử lý 401 với ExpiredToken và chưa retry
    if (statusCode === 401 && errorType === 'ExpiredToken' && !originalRequest._retry) {
      // Nếu đang refresh token, add request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return instance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const token = getLocalStorageItem(PersistedStateKey.Token)
        const refreshToken = getLocalStorageItem(PersistedStateKey.RefreshToken)

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const refreshData = {
          jwtToken: token,
          refreshToken
        }

        // Sử dụng refreshInstance để tránh circular dependency
        const response = await refreshInstance.post('/auth/refresh', refreshData)
        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Update session
        store.dispatch(
          updateSession({
            token: accessToken,
            refreshToken: newRefreshToken
          })
        )

        // Process queue với token mới
        processQueue(null, accessToken)

        // Retry original request với token mới
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return instance(originalRequest)
      } catch (refreshError) {
        // Process queue với error
        processQueue(refreshError, null)

        // Clear tokens và redirect
        store.dispatch(
          updateSession({
            token: undefined,
            refreshToken: undefined
          })
        )

        // Chỉ show message một lần
        if (!window.sessionExpiredMessageShown) {
          window.sessionExpiredMessageShown = true
          messageInfo('Your session has expired. Please log in again to continue')

          setTimeout(() => {
            window.sessionExpiredMessageShown = false

            const currentPath = window.location.pathname
            if (currentPath !== '/sign-in') {
              localStorage.setItem(PersistedStateKey.RedirectAfterLogin, currentPath)
              window.location.href = '/sign-in'
            }
          }, 500)
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Xử lý các lỗi khác
    if (statusCode === 401 && errorType !== 'ExpiredToken') {
      // Token không hợp lệ, redirect ngay
      if (!window.sessionInvalidMessageShown) {
        window.sessionInvalidMessageShown = true
        messageError('Invalid session. Please log in again.')

        setTimeout(() => {
          window.sessionInvalidMessageShown = false
          window.location.href = '/sign-in'
        }, 1500)
      }
    }

    return Promise.reject(error)
  }
)

export const req = instance
export const httpGet = req.get
export const httpPost = req.post
export const httpPut = req.put
export const httpDel = req.delete
