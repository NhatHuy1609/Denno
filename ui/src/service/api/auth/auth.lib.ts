import { AxiosError, isAxiosError } from "axios";

type Null<T> = null | T

type Field = 'Email' | 'Password';

type ErrorField = Null<Field>

type DetailedError = {
  message: string;
  statusCode?: number;
  errorType?: string;
  field?: ErrorField;
};

const parseErrorDetails = (errorString: string): Pick<DetailedError, 'errorType' | 'message'> => {
  const messageDetail = errorString.split('::');
  if (messageDetail.length > 1) {
    return {
      errorType: messageDetail[0],
      message: messageDetail[1]
    }
  }

  return {
    message: messageDetail[0]
  }
};

export const getDetailedError = (
  error: Error | AxiosError
) : DetailedError => {
  if (isAxiosError(error) && error?.response?.data) {
    const statusCode = error.response.status
    const { statusMessage } = error.response.data
    const errorList = statusMessage.split(',')
    const { errorType = '', message } = parseErrorDetails(errorList[0]);

    let field: ErrorField = null;
    // Handle get field (email, password, ....) which error indicates
    if (errorType.includes('Password')) field = 'Password'
    else if (errorType.includes('Email')) field = 'Email'

    // Handle get wanted message
    if (errorType.includes('DuplicateUserName')) message.replace('UserName', 'Email')
    
    return {
      field,
      message,
      errorType,
      statusCode
    };
  } else {
    // console.log(error)
    return {
      message: error.message
    }
  }
} 