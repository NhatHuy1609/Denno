import React, {
  useRef,
  ChangeEvent,
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react'
import { cn } from '@/lib/styles/utils'
import { FormKeys, FormValues } from './SignUpVerificationForm'
import { TiWarning } from 'react-icons/ti'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { Controller } from 'react-hook-form'

interface VerificationOTPInputContextProps {
  indexHasChanged: number
  indexHasDeleted: number
  setIndexHasChanged: Dispatch<SetStateAction<number>>
  setIndexHasDeleted: Dispatch<SetStateAction<number>>
}

const VerificationOTPInputContext = createContext<VerificationOTPInputContextProps>({
  indexHasChanged: -1,
  indexHasDeleted: 10e7,
  setIndexHasChanged: () => {},
  setIndexHasDeleted: () => {}
})

function SignUpVerificationOTPInput({
  index,
  field,
  error,
  onChange
}: {
  index: number
  field: string
  error?: boolean
  onChange: (value: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const value = useRef<string | undefined>(undefined) // Capture input's value
  const { indexHasChanged, setIndexHasChanged, indexHasDeleted, setIndexHasDeleted } = useContext(
    VerificationOTPInputContext
  ) // Capture input's position has changed

  const handleKeyUpInput = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const key = e.key

    const isLetter = /^[a-zA-Z]$/.test(key)
    const isNumber = /^[0-9]$/.test(key)
    const isBackSpace = key === 'Backspace'
    const isNavigationArrow = key === 'ArrowRight' || key === 'ArrowLeft'

    if (inputRef.current) {
      if (isLetter || isNumber) {
        inputRef.current.value = key
        value.current = e.currentTarget.value
        onChange(e.currentTarget.value)

        setIndexHasChanged(index)
      } else if (isBackSpace) {
        if (value.current === '') {
          setIndexHasDeleted(index)
        } else {
          inputRef.current.value = ''
          value.current = ''
          onChange('')
        }
      } else if (isNavigationArrow) {
        if (key === 'ArrowRight') {
          setIndexHasChanged(index)
        } else if (key === 'ArrowLeft') [setIndexHasChanged(index - 2)]
      } else {
        return
      }
    }
  }

  // Handle move position backwards of inputs list when delete
  useEffect(() => {
    if (index !== indexHasChanged + 1) return

    inputRef.current?.focus()
  }, [indexHasChanged])

  // Handle move position forward of inputs list when delete
  useEffect(() => {
    if (index !== indexHasDeleted - 1) return

    if (inputRef.current) {
      onChange('')
      value.current = ''
      inputRef.current.value = ''

      inputRef.current?.focus()
    }
  }, [indexHasDeleted])

  // Handle reset indexHasChanged when click input
  const handleClickInput = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    setIndexHasChanged(10e7)
  }

  return (
    <input
      ref={inputRef}
      key={field}
      type='text'
      maxLength={1}
      onClick={handleClickInput}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
      }}
      onKeyUp={(e) => handleKeyUpInput(e, index)}
      className={cn(
        'w-1/4 border-b-2 py-4 text-center text-7xl outline-none',
        `${error ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-stone-500'}`
      )}
    />
  )
}

function SignUpVerificationOTPInputList({
  fieldList,
  error,
  control,
  setValue
}: {
  fieldList: FormKeys[]
  error?: boolean
  control: Control<FormValues, any>
  setValue: UseFormSetValue<FormValues>
}) {
  return (
    <div className='w-full'>
      <div className='flex items-center gap-6'>
        {fieldList.map((fieldName, index) => {
          return (
            <Controller
              key={fieldName}
              name={fieldName}
              control={control}
              render={() => (
                <SignUpVerificationOTPInput
                  field={fieldName}
                  onChange={(value) => setValue(fieldName, value)}
                  error={error}
                  index={index}
                />
              )}
            />
          )
        })}
      </div>
      {error && (
        <div className='mt-2 flex items-center'>
          <TiWarning className='-mt-px text-sm text-red-500' />
          <span className='text-xs font-medium text-red-500'>Must enter all 4 numbers</span>
        </div>
      )}
    </div>
  )
}

function SignUpVerificationOTP({
  fieldList,
  error,
  setValue,
  control
}: {
  fieldList: FormKeys[]
  error?: boolean
  setValue: UseFormSetValue<FormValues>
  control: Control<FormValues, any>
}) {
  const [indexHasChanged, setIndexHasChanged] = useState(-1)
  const [indexHasDeleted, setIndexHasDeleted] = useState(10e7)

  return (
    <VerificationOTPInputContext.Provider
      value={{ indexHasChanged, setIndexHasChanged, indexHasDeleted, setIndexHasDeleted }}
    >
      <SignUpVerificationOTPInputList
        setValue={setValue}
        fieldList={fieldList}
        error={error}
        control={control}
      />
    </VerificationOTPInputContext.Provider>
  )
}

export default SignUpVerificationOTP
