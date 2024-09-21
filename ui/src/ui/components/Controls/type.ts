import { ChangeEvent, FocusEvent } from 'react'

interface InputBaseProps {
  title: string
  className: string
  value: string
  name: string
  type: string
  size: 'sm' | 'lg' | 'base'
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void
  onBlur: (ev: FocusEvent<HTMLInputElement>) => void
  onEnter: (val: string, target: HTMLInputElement) => void
  onEsc: (target: HTMLInputElement) => void
  placeholder: string
  helper: string
  focus: boolean
  error: string
  required: boolean
  disabled: boolean
  readOnly: boolean
  icon: JSX.Element
  addon: string
}

export type InputProps = Partial<InputBaseProps>