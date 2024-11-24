import React from 'react'
import { cn } from '@/lib/styles/utils'
import { useParams } from 'next/navigation'
import { SlPicture } from 'react-icons/sl'
import { useRef, useEffect } from 'react'
import { toastError, toastSuccess } from '@/ui'
import { queryClient } from '@/lib/react-query/query-client'
import { WorkspaceQueries } from '@/entities/workspace'
import { LuLoader2 } from 'react-icons/lu'
import useUpdateWorkspaceLogoMutation from '../updateWorkspaceLogo.mutation'

function UploadLogoButton() {
  const validFileExtensions = ['jpg', 'png', 'jfif']

  const { workspaceId } = useParams()

  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate: updateWorkspaceLogo, isPending } = useUpdateWorkspaceLogoMutation({
    onSuccess: async () => {
      toastSuccess("Update workspace's logo successfully!")
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueries.workspaceQuery(workspaceId as string).queryKey
      })
    },
    onError: (error) => {
      console.log(error)
      toastError("Update workspace's logo failed!")
    }
  })

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const selectedFile = files[0]
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()

      if (fileExtension && validFileExtensions.includes(fileExtension)) {
        const fileBlob = new Blob([selectedFile], { type: selectedFile.type })

        updateWorkspaceLogo({
          workspaceId: workspaceId as string,
          data: {
            logoFile: fileBlob
          }
        })
      } else {
        toastError('Selected file is not a valid image format.')
      }
    }
  }

  useEffect(() => {
    const handleClickInputFile = () => {
      if (inputRef && inputRef.current) {
        const inputFileElement = inputRef.current
        inputFileElement?.click()
      }
    }

    ref.current?.addEventListener('click', handleClickInputFile)

    return () => {
      ref.current?.removeEventListener('click', handleClickInputFile)
    }
  }, [ref, inputRef])

  return (
    <div
      ref={ref}
      className={cn(
        'flex cursor-pointer items-center justify-center gap-1 rounded-sm border bg-gray-100 px-2 py-1 hover:bg-gray-200',
        isPending && 'cursor-not-allowed opacity-60'
      )}
    >
      {isPending ? (
        <LuLoader2 className='size-4 animate-spin text-primary' />
      ) : (
        <SlPicture className='text-sm font-bold' />
      )}

      <div>
        <span className='text-sm font-medium text-black'>Upload a new logo</span>
        <input
          ref={inputRef}
          type='file'
          className='hidden'
          onChange={handleInputFileChange}
        ></input>
      </div>
    </div>
  )
}

export default UploadLogoButton
