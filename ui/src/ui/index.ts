import ButtonControl from './components/Button'
import LoadingContainer from './components/Loading/LoadingContainer'
import FormGroupContainer from './components/FormGroups'
import * as FormControls from './components/Controls'
import AvatarContainer from './components/Avatar'
import * as PopoverContainer from './components/Popover'
import * as CollapsibleContainer from './components/Collapsible'
export * from './components/ScrollArea'

export { setFixLoading } from './components/Loading'
export {
  messageInfo,
  messageError,
  messageSuccess,
  messageWarning
} from './components/Message'

export const Form = FormControls
export const Button = ButtonControl
export const Avatar = AvatarContainer
export const Loading = LoadingContainer
export const FormGroup = FormGroupContainer
export const Popover = PopoverContainer
export const Collapsible = CollapsibleContainer
