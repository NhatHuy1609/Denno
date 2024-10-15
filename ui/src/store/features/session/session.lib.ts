import { CurrentUser, Session } from './session.types'
import { authTypesDto } from '@/service/api/auth'

export function transformLoginResponseDtoToSession(
  loginResponse: authTypesDto.LoginResponseDto
): Session {
  const { accessToken, refreshToken } = loginResponse

  return {
    token: accessToken,
    refreshToken
  }
}

export function transformRegisterResponseDtoToSession(
  registerResponse: authTypesDto.RegisterResponseDto
): Session {
  const { accessToken, refreshToken } = registerResponse

  return {
    token: accessToken,
    refreshToken
  }
}