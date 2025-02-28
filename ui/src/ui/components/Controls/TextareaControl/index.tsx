import React, { ChangeEvent, useState, useEffect } from 'react'
import type { TextareaProps } from '../types'
import { TiWarning } from 'react-icons/ti'

export default function TextareaControl({
  title,
  name,
  value,
  placeholder,
  onChange,
  helper,
  error,
  required,
  readOnly,
  disabled,
  rows = 4,
  cols
}: TextareaProps) {
  const classes = ['form-control']
  const [val, setValue] = useState(value)

  const onInputChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    onChange && onChange(ev)
  }

  disabled && classes.push('disabled')
  required && classes.push('required')
  readOnly && classes.push('readonly')
  error && classes.push('error')

  return (
    <div className={classes.join(' ')}>
      {title ? <label>{title}</label> : null}
      <div className='form-control-wrapper relative inline-flex w-full'>
        <textarea
          value={value}
          name={name}
          rows={rows}
          cols={cols}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onChange={onInputChange}
          placeholder={placeholder}
          className='form-input px-3 py-1'
        />
      </div>
      {helper && !error ? <p className='mt-2 text-sm text-gray-500'>{helper}</p> : null}
      {error ? (
        <span className='mt-2 flex items-center gap-1'>
          <TiWarning className='-mt-px text-sm text-red-500' />
          <p className='text-xs font-medium text-red-500'>{error}</p>
        </span>
      ) : null}
    </div>
  )
}
