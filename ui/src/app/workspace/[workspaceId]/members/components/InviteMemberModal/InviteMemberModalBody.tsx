import React, { useState, useRef } from 'react'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import { useUsersQuery } from '@/app/_hooks/query/user/useUsersQuery'
import { userTypes } from '@/entities/user'
import { useDebounce } from '@/app/_hooks/useDebounce'

type SearchedUserFilter = Pick<userTypes.UsersFilterQuery, 'email'>

function InviteMemberModalBody() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const searchedUserFilter: SearchedUserFilter = {
    email: debouncedSearchTerm
  }

  const { data } = useUsersQuery(searchedUserFilter)

  console.log('SEARCHED USER: ', data)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className='flex'>
      <PrimaryInputText
        ref={inputRef}
        onInput={handleInputChange}
        className='w-full border-gray-500 p-2'
        placeholder='Email address or name'
      />
      <div className='h-16'></div>
    </div>
  )
}

export default InviteMemberModalBody
