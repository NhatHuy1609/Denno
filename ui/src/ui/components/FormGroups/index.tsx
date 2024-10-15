import { ReactNode } from 'react'
import './style.css'

interface IFormGroupProps {
  title?: string
  helper?: string
  required?: boolean
  error?: string
  children: ReactNode
}

interface IFormGroupProps {
  title?: string
  helper?: string
  required?: boolean
  error?: string
  children: ReactNode
}
export default function FormGroup({ title, children, required, error, helper }: IFormGroupProps) {
  const classes = ['form-control-group form-control']
  required && classes.push('required')
  error && classes.push('error')
  return (
    <div className={classes.join(' ')}>
      {title ? <label>{title}</label> : null}
      <div className='form-group flex items-center'>{children}</div>
      {helper && !error ? <p className='mt-2 text-sm text-gray-500'>{helper}</p> : null}
      {error ? <p className='mt-2 text-sm text-red-500'>{error}</p> : null}
    </div>
  )
}
