import { ChangeEvent, ChangeEventHandler, FocusEvent } from 'react'

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

type TextareaBaseProps = Omit<InputBaseProps, 'onChange'> & {
  onChange: (ev: ChangeEvent<HTMLTextAreaElement>) => void
  rows: number
  cols: number
}

export type InputProps = Partial<InputBaseProps>
export type TextareaProps = Partial<TextareaBaseProps>