import ButtonControl from './components/Button'
import LoadingContainer from './components/Loading/LoadingContainer'
import FormGroupContainer from './components/FormGroups'
import * as FormControls from './components/Controls'
import AvatarContainer from './components/Avatar'

export { setFixLoading } from './components/Loading'
export {
  messageInfo,
  messageError,
  messageSuccess,
  messageWarning
} from './components/Message'

export const Button = ButtonControl
export const Avatar = AvatarContainer
export const Loading = LoadingContainer
export const Form = FormControls
export const FormGroup = FormGroupContainer
