import { AxiosError, isAxiosError } from "axios";

type ErrorField = 'Email' | 'Password';
type FormattedError = {
  code?: string;
  message: string;
  field?: ErrorField;
};

const parseErrorDetails = (errorString: string): { code: string; description: string } => {
  const [code, description] = errorString.split('::');
  return { code, description };
};

export const formatAuthResponseError = (
  error: Error | AxiosError
) : FormattedError => {
  if (isAxiosError(error) && error.response?.data) {
    const { statusMessage } = error.response.data
    const errorList = statusMessage.split(',')

    const { code, description } = parseErrorDetails(errorList[0]);
    const field = code.includes('Password') ? 'Password' : 'Email';
    
    return {
      field,
      code,
      message: code.includes('UserName') ? description.replace('Username', 'Email') : description
    };
  } else {
    return {
      message: error.message
    }
  }
} 