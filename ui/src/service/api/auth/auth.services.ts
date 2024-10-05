import { httpGet, httpPost } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { LoginGoogleDto, LoginUserDto, RegisterUserDto, ResendRegisterCodeDto, ValidateRegisterUserDto } from './auth.types'
import { RegisterUserDtoSchema, RegisterResponseDtoSchema, ValidateRegisterUserDtoSchema, LoginUserDtoSchema, LoginResponseDtoSchema, ResendRegisterCodeDtoSchema, LoginGoogleResponseDtoSchema, LoginGoogleDtoSchema } from './auth.contracts'

export class AuthService {
  static getGoogleLoginUrl() {
    return httpGet('/auth/login-google')
  }

  static loginGoogleMutation(data: {loginGoogleDto: LoginGoogleDto}) {
    const loginGoogleDto = AxiosContracts.requestContract(
      LoginGoogleDtoSchema,
      data.loginGoogleDto
    )

    return httpPost('/auth/google-sign-in', loginGoogleDto)
            .then(AxiosContracts.responseContract(LoginGoogleResponseDtoSchema))
  }

  static registerUserMutation(data: { registerUserDto: RegisterUserDto }) {
    const registerUserDto = AxiosContracts.requestContract(
      RegisterUserDtoSchema,
      data.registerUserDto
    )
    return httpPost('/auth/register', registerUserDto)
            .then(AxiosContracts.responseContract(RegisterResponseDtoSchema))
  }

  static validateRegisterUserMutation(data: { validateRegisterUserDto: ValidateRegisterUserDto }) {
    const validateRegisterUserDto = AxiosContracts.requestContract(
      ValidateRegisterUserDtoSchema,
      data.validateRegisterUserDto
    )
    return httpPost('/auth/validate-email', validateRegisterUserDto)
            .then(AxiosContracts.responseContract(LoginResponseDtoSchema))
  }

  static loginUserMutation(data: { loginUserDto: LoginUserDto }) {
    const loginUserDto = AxiosContracts.requestContract(
      LoginUserDtoSchema,
      data.loginUserDto
    )
    return httpPost('/auth/login', loginUserDto)
            .then(AxiosContracts.responseContract(LoginResponseDtoSchema))
  }

  static resendRegisterCodeMutation(data: { resendRegisterCodeDto: ResendRegisterCodeDto }) {
    const resendRegisterCodeDto = AxiosContracts.requestContract(
      ResendRegisterCodeDtoSchema,
      data.resendRegisterCodeDto
    )
    return httpPost('auth/resend-register-code', resendRegisterCodeDto)
  }
}