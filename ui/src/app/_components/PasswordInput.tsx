import React from 'react'
import { Form } from '@/ui'
import { LuLock } from 'react-icons/lu'
import { useState } from 'react'
import type { InputProps } from '@/ui/components/Controls/type'

interface IPasswordInputProps {
  title: string
  value: string
  onChange: InputProps['onChange']
  size: InputProps['size']
}

function PasswordInput({ title, value, size, onChange }: IPasswordInputProps) {
  const [isShowPassword, setShowPassword] = useState(false)

  const handleToggleShowPassword = () => {
    setShowPassword(!isShowPassword)
  }

  return (
    <div>
      <label className='text-xs'>{title}</label>
      <div className='relative w-full'>
        <Form.Input
          size={size}
          value={value}
          type={isShowPassword ? 'text' : 'password'}
          icon={<LuLock className='text-gray-400' />}
          placeholder='Enter password'
          className='w-full rounded-md'
          onChange={onChange}
        />
        <span
          onClick={handleToggleShowPassword}
          className='absolute right-0 top-1/2 mr-3 -translate-y-1/2 cursor-pointer text-xs font-medium text-blue-600 decoration-blue-600 decoration-dotted underline-offset-4 hover:underline'
        >
          {isShowPassword ? 'Hide' : 'Show'}
        </span>
      </div>
    </div>
  )
}

export default PasswordInput
