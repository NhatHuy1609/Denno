import { store } from '@/lib/redux/store'
import { messageError, messageInfo } from '@/ui'
import axios from 'axios'

import { authApiLib } from './auth';
import { updateSession } from '@/store/features/session';
import { getErrorMessage } from './_getErrorMessage';

// console.log('=================================')
// console.log('process.env', process.env.NEXT_PUBLIC_BE_GATEWAY)
// console.log('=================================')

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_GATEWAY
})

instance.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const { token } = state.session.session;
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
  (error) => {
    const originalRequest = error.config;
    const { statusCode, errorType } = authApiLib.getDetailedError(error)
    if (statusCode === 401 && errorType === 'ExpiredToken' && !originalRequest._retry) {
      originalRequest._retry = true;

      // Taking old session to refresh
      const state = store.getState()
      const { token, refreshToken } = state.session.session
      const data = {
        jwtToken: token,
        refreshToken
      }

      req.post('/auth/refresh', data)
        .then(response => {
          const { accessToken, refreshToken } = response.data
          console.log(response)
          store.dispatch(updateSession({
            token: accessToken,
            refreshToken
          }))

          return req(originalRequest)
        })
        .catch(error => {
          messageInfo("Your session has expired. Please log in again to continue")
          setTimeout(() => {
            window.location.href = '/sign-in'
          }, 500)
        })
    }

    return Promise.reject(error)
  }
)

export const req = instance
export const httpGet = req.get
export const httpPost = req.post
export const httpPut = req.put
export const httpDel = req.delete