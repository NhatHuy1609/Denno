import { httpDel, httpGet, httpPost } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import {
  LoginGoogleDto,
  LoginUserDto,
  RegisterUserDto,
  ResendRegisterCodeDto,
  ValidateRegisterUserDto
} from './auth.types'
import {
  RegisterUserDtoSchema,
  RegisterResponseDtoSchema,
  ValidateRegisterUserDtoSchema,
  LoginUserDtoSchema,
  LoginResponseDtoSchema,
  ResendRegisterCodeDtoSchema,
  LoginGoogleResponseDtoSchema,
  LoginGoogleDtoSchema
} from './auth.contracts'

export class AuthService {
  static getGoogleLoginUrl() {
    return httpGet('/auth/login-google')
  }

  static loginGoogleMutation(data: { loginGoogleDto: LoginGoogleDto }) {
    const loginGoogleDto = AxiosContracts.requestContract(LoginGoogleDtoSchema, data.loginGoogleDto)

    return httpPost('/auth/google-sign-in', loginGoogleDto)
  }

  static registerUserMutation(data: { registerUserDto: RegisterUserDto }) {
    const registerUserDto = AxiosContracts.requestContract(RegisterUserDtoSchema, data.registerUserDto)
    const formData = new FormData()
    Object.entries(registerUserDto).forEach(([key, value]) => {
      formData.append(key, value)
    })

    return httpPost('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  static validateRegisterUserMutation(data: { validateRegisterUserDto: ValidateRegisterUserDto }) {
    const validateRegisterUserDto = AxiosContracts.requestContract(
      ValidateRegisterUserDtoSchema,
      data.validateRegisterUserDto
    )
    return httpPost('/auth/validate-email', validateRegisterUserDto)
  }

  static loginUserMutation(data: { loginUserDto: LoginUserDto }) {
    const loginUserDto = AxiosContracts.requestContract(LoginUserDtoSchema, data.loginUserDto)
    return httpPost('/auth/login', loginUserDto)
  }

  static resendRegisterCodeMutation(data: { resendRegisterCodeDto: ResendRegisterCodeDto }) {
    const resendRegisterCodeDto = AxiosContracts.requestContract(
      ResendRegisterCodeDtoSchema,
      data.resendRegisterCodeDto
    )
    return httpPost('auth/resend-register-code', resendRegisterCodeDto)
  }

  static revokeToken() {
    return httpDel('/auth/revoke')
  }
}
