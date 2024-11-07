export * from './components/ScrollArea'
import ButtonControl from './components/Button'
import LoadingContainer from './components/Loading/LoadingContainer'
import FormGroupContainer from './components/FormGroups'
import AvatarContainer from './components/Avatar'
import ToasterContainer from './components/Toaster/ToasterContainer'
import * as FormControls from './components/Controls'
import * as PopoverContainer from './components/Popover'
import * as CollapsibleContainer from './components/Collapsible'
import DropdownMenuContainer from './components/Dropdown'

export { setFixLoading } from './components/Loading'
export {
  messageInfo,
  messageError,
  messageSuccess,
  messageWarning
} from './components/Message'
export {
  toastError,
  toastSuccess
} from './components/Toaster'

export const Form = FormControls
export const Button = ButtonControl
export const Avatar = AvatarContainer
export const Loading = LoadingContainer
export const Toaster = ToasterContainer
export const DropdownMenu = DropdownMenuContainer
export const FormGroup = FormGroupContainer
export const Popover = PopoverContainer
export const Collapsible = CollapsibleContainer
