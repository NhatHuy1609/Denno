import { isAxiosError, AxiosError } from 'axios'

interface ErrorDetail {
  status?: number,
  message: string
}

export function getErrorMessage(error: Error | AxiosError): ErrorDetail {
  if (isAxiosError(error) && error.response?.data) {
    const { statusMessage, statusCode } = error.response.data
    return {
      status: statusCode as number ,
      message: statusMessage as string
    }  
  } else {
    return {
      message: error.message
    }
  }
}
