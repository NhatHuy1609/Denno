import React, { ChangeEvent, InputHTMLAttributes, useRef, useState } from 'react'
import Image from 'next/image'
import { MdOutlinePhotoCameraBack } from 'react-icons/md'

type InputSize = 'base' | 'sm' | 'lg'

type AvatarInputProps = {
  size?: InputSize
  initialImage?: string | null
  onChange?: (file: File) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>

const sizes: { [key in InputSize]: string } = {
  base: 'size-10',
  sm: 'size-6',
  lg: 'size-24'
}

const AvatarInput = React.forwardRef<HTMLInputElement, AvatarInputProps>(
  ({ size = 'base', initialImage = null, onChange }, ref) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      const selectedFile = files[0]
      if (!selectedFile.type.match('image.*')) {
        alert('Please select an image file')
        return
      }

      // Preview the selected image
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target && event.target.result) {
          setPreviewUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(selectedFile)

      // Call the onChange prop with the selected file
      onChange && onChange(selectedFile)
    }

    const triggerFileInput = (): void => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }

    const classes = ['border rounded-full relative']
    classes.push(sizes[size])

    return (
      <div className={classes.join(' ')}>
        <input
          ref={(element) => {
            // Handle both refs
            fileInputRef.current = element
            if (typeof ref === 'function') {
              ref(element)
            } else if (ref) {
              ref.current = element
            }
          }}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <Image
            src={previewUrl}
            alt='avatar-preview'
            width={96}
            height={96}
            className='size-full rounded-full object-cover'
          />
        ) : (
          <div className='size-full rounded-full border'></div>
        )}

        <button
          type='button'
          onClick={triggerFileInput}
          className='absolute bottom-[2px] right-[-10px] flex size-8 items-center justify-center rounded-full bg-black/70 py-1 text-white hover:bg-black/50'
        >
          <MdOutlinePhotoCameraBack className='text-xl' />
        </button>
      </div>
    )
  }
)

AvatarInput.displayName = 'AvatarInput'

export default AvatarInput
